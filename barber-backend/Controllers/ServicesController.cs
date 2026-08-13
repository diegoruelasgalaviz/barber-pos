using barber_backend.Data;
using barber_backend.DTOs;
using barber_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController(BarberDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAll() =>
        Ok(await db.Services.Select(s => s.ToDto()).ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceDto>> Get(Guid id)
    {
        var s = await db.Services.FindAsync(id);
        return s is null ? NotFound() : s.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<ServiceDto>> Create(ServiceUpsertRequest req)
    {
        var service = new Service { Name = req.Name, Description = req.Description, DurationMinutes = req.DurationMinutes, Price = req.Price, Category = req.Category };
        db.Services.Add(service);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = service.Id }, service.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceDto>> Update(Guid id, ServiceUpsertRequest req)
    {
        var service = await db.Services.FindAsync(id);
        if (service is null) return NotFound();
        service.Name = req.Name;
        service.Description = req.Description;
        service.DurationMinutes = req.DurationMinutes;
        service.Price = req.Price;
        service.Category = req.Category;
        await db.SaveChangesAsync();
        return service.ToDto();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var service = await db.Services.FindAsync(id);
        if (service is null) return NotFound();
        db.Services.Remove(service);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
