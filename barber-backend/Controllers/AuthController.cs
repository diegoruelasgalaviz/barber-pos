using barber_backend.Data;
using barber_backend.DTOs;
using barber_backend.Models;
using barber_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(BarberDbContext db, JwtTokenService tokens) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        return new AuthResponse(tokens.CreateToken(user), user.ToAuthDto());
    }

    /// <summary>Registration for the customer-facing barber-app.</summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            return Conflict(new { message = "An account with that email already exists" });

        var user = new ApplicationUser
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone ?? "",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Customer,
        };
        db.Users.Add(user);

        // Id intentionally mirrors the user's id: barber-app only ever knows
        // its logged-in user's id, and uses it directly as the appointment's
        // customerId, so the two must line up for self-registered customers.
        db.Customers.Add(new Customer
        {
            Id = user.Id,
            UserId = user.Id,
            FirstName = request.Name,
            Email = request.Email,
            Phone = request.Phone ?? "",
        });

        await db.SaveChangesAsync();
        return new AuthResponse(tokens.CreateToken(user), user.ToAuthDto());
    }

    [HttpGet("me")]
    public async Task<ActionResult<AuthUserDto>> Me()
    {
        var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        if (idClaim is null || !Guid.TryParse(idClaim, out var id)) return Unauthorized();
        var user = await db.Users.FindAsync(id);
        return user is null ? NotFound() : user.ToAuthDto();
    }
}
