using barber_backend.Data;
using barber_backend.DTOs;
using barber_backend.Models;
using barber_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(BarberDbContext db, RealtimeNotifier notifier) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll() =>
        Ok(await db.Products.Select(p => p.ToDto()).ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> Get(Guid id)
    {
        var p = await db.Products.FindAsync(id);
        return p is null ? NotFound() : p.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(ProductUpsertRequest req)
    {
        var product = new Product
        {
            Name = req.Name, Sku = req.Sku, Category = req.Category, Stock = req.Stock,
            LowStockThreshold = req.LowStockThreshold, UnitCost = req.UnitCost, UnitPrice = req.UnitPrice, Supplier = req.Supplier,
        };
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductDto>> Update(Guid id, ProductUpsertRequest req)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        product.Name = req.Name; product.Sku = req.Sku; product.Category = req.Category;
        product.Stock = req.Stock; product.LowStockThreshold = req.LowStockThreshold;
        product.UnitCost = req.UnitCost; product.UnitPrice = req.UnitPrice; product.Supplier = req.Supplier;
        await db.SaveChangesAsync();
        return product.ToDto();
    }

    [HttpPost("{id:guid}/adjustments")]
    public async Task<ActionResult<StockAdjustmentDto>> Adjust(Guid id, StockAdjustmentRequest req)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();

        product.Stock += req.Delta;
        var adjustment = new StockAdjustment { ProductId = id, Delta = req.Delta, Reason = req.Reason };
        db.StockAdjustments.Add(adjustment);
        await db.SaveChangesAsync();

        if (product.Stock <= product.LowStockThreshold)
            await notifier.LowStock(product.ToDto());

        return adjustment.ToDto();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
