using barber_backend.Data;
using barber_backend.DTOs;
using barber_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomersController(BarberDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll() =>
        Ok(await db.Customers.OrderByDescending(c => c.CreatedAt).Select(c => c.ToDto()).ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CustomerDto>> Get(Guid id)
    {
        var c = await db.Customers.FindAsync(id);
        return c is null ? NotFound() : c.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<CustomerDto>> Create(CustomerUpsertRequest req)
    {
        var customer = new Customer
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            Email = req.Email,
            Phone = req.Phone,
            Notes = req.Notes,
            Tags = req.Tags,
        };
        db.Customers.Add(customer);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = customer.Id }, customer.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CustomerDto>> Update(Guid id, CustomerUpsertRequest req)
    {
        var customer = await db.Customers.FindAsync(id);
        if (customer is null) return NotFound();
        customer.FirstName = req.FirstName;
        customer.LastName = req.LastName;
        customer.Email = req.Email;
        customer.Phone = req.Phone;
        customer.Notes = req.Notes;
        customer.Tags = req.Tags;
        await db.SaveChangesAsync();
        return customer.ToDto();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var customer = await db.Customers.FindAsync(id);
        if (customer is null) return NotFound();
        db.Customers.Remove(customer);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
