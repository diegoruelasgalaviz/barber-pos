using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using barber_backend.Data;
using barber_backend.Hubs;
using barber_backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MysticMind.PostgresEmbed;

var builder = WebApplication.CreateBuilder(args);

// --- Database connection string -------------------------------------------------
// Dev: spin up a real embedded Postgres server (no external services required).
// Prod: use the connection string configured via appsettings/env var (a managed Postgres).
// Both paths go through the same Npgsql + EF Core provider and the same migrations.
PgServer? embeddedPg = null;
string connectionString;

if (builder.Environment.IsDevelopment() && string.IsNullOrEmpty(builder.Configuration.GetConnectionString("Default")))
{
    embeddedPg = new PgServer("16.4.0", port: 0);
    embeddedPg.StartAsync().GetAwaiter().GetResult();
    connectionString = $"Host=localhost;Port={embeddedPg.PgPort};Username={embeddedPg.PgUser};Database={embeddedPg.PgDbName}";
}
else
{
    connectionString = builder.Configuration.GetConnectionString("Default")
        ?? throw new InvalidOperationException("ConnectionStrings:Default must be set in production.");
}

builder.Services.AddDbContext<BarberDbContext>(opts => opts.UseNpgsql(connectionString));

// --- Core services ----------------------------------------------------------------
builder.Services.AddControllers().AddJsonOptions(opts =>
{
    // Frontend types use kebab-case string literals for status/role/category enums
    // (e.g. "in-progress", "no-show", "due-at-shop").
    opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.KebabCaseLower));
});
builder.Services.AddOpenApi();
builder.Services.AddSignalR();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<RealtimeNotifier>();

var jwtKey = builder.Configuration["Jwt:Key"] ?? "dev-only-super-secret-key-change-me-1234567890";
builder.Configuration["Jwt:Key"] = jwtKey;
builder.Configuration["Jwt:Issuer"] ??= "barber-backend";
builder.Configuration["Jwt:Audience"] ??= "barber-clients";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opts =>
{
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
    };
    // Allow SignalR to authenticate via access_token query string on the hub URL.
    opts.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            if (!string.IsNullOrEmpty(accessToken) && context.HttpContext.Request.Path.StartsWithSegments("/hubs"))
                context.Token = accessToken;
            return Task.CompletedTask;
        },
    };
});
builder.Services.AddAuthorization();

var frontendOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:3000", "http://localhost:3001"];
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("Frontends", policy => policy
        .WithOrigins(frontendOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

var app = builder.Build();

if (embeddedPg is not null)
    app.Lifetime.ApplicationStopping.Register(() => embeddedPg.StopAsync().GetAwaiter().GetResult());

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BarberDbContext>();
    await DbSeeder.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontends");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationsHub>("/hubs/notifications");

app.Run();
