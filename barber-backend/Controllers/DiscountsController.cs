using barber_backend.Data;
using barber_backend.DTOs;
using barber_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/discounts")]
public class DiscountsController(BarberDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DiscountDto>>> GetAll() =>
        Ok(await db.Discounts.Select(d => d.ToDto()).ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DiscountDto>> Get(Guid id)
    {
        var d = await db.Discounts.FindAsync(id);
        return d is null ? NotFound() : d.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<DiscountDto>> Create(DiscountUpsertRequest req)
    {
        var discount = new Discount { Title = req.Title, Description = req.Description, PercentOff = req.PercentOff, Code = req.Code, ExpiresAt = req.ExpiresAt };
        db.Discounts.Add(discount);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = discount.Id }, discount.ToDto());
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var discount = await db.Discounts.FindAsync(id);
        if (discount is null) return NotFound();
        db.Discounts.Remove(discount);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
