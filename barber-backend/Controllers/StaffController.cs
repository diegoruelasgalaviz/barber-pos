using barber_backend.Data;
using barber_backend.DTOs;
using barber_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/staff")]
public class StaffController(BarberDbContext db) : ControllerBase
{
    private IQueryable<Staff> WithIncludes() => db.Staff.Include(s => s.StaffServices);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StaffDto>>> GetAll() =>
        Ok(await WithIncludes().Select(s => s.ToDto()).ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StaffDto>> Get(Guid id)
    {
        var s = await WithIncludes().FirstOrDefaultAsync(s => s.Id == id);
        return s is null ? NotFound() : s.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<StaffDto>> Create(StaffUpsertRequest req)
    {
        var staff = new Staff
        {
            Name = req.Name,
            Email = req.Email,
            Title = req.Title,
            Color = req.Color,
            PhotoInitials = string.Concat(req.Name.Split(' ', StringSplitOptions.RemoveEmptyEntries).Take(2).Select(p => p[0])).ToUpperInvariant(),
            WorkingHours = req.WorkingHours,
            Active = req.Active,
        };
        db.Staff.Add(staff);
        await db.SaveChangesAsync();
        await SyncServices(staff, req.ServiceIds);
        return CreatedAtAction(nameof(Get), new { id = staff.Id }, staff.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StaffDto>> Update(Guid id, StaffUpsertRequest req)
    {
        var staff = await WithIncludes().FirstOrDefaultAsync(s => s.Id == id);
        if (staff is null) return NotFound();
        staff.Name = req.Name;
        staff.Email = req.Email;
        staff.Title = req.Title;
        staff.Color = req.Color;
        staff.WorkingHours = req.WorkingHours;
        staff.Active = req.Active;
        await SyncServices(staff, req.ServiceIds);
        await db.SaveChangesAsync();
        return staff.ToDto();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var staff = await db.Staff.FindAsync(id);
        if (staff is null) return NotFound();
        db.Staff.Remove(staff);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task SyncServices(Staff staff, string[] serviceIds)
    {
        var wanted = serviceIds.Select(Guid.Parse).ToHashSet();
        db.StaffServices.RemoveRange(staff.StaffServices.Where(ss => !wanted.Contains(ss.ServiceId)));
        var existing = staff.StaffServices.Select(ss => ss.ServiceId).ToHashSet();
        foreach (var serviceId in wanted.Except(existing))
            db.StaffServices.Add(new StaffService { StaffId = staff.Id, ServiceId = serviceId });
        await db.SaveChangesAsync();
    }
}
