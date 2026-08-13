namespace barber_backend.Models;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string Sku { get; set; } = "";
    public string Category { get; set; } = "";
    public int Stock { get; set; }
    public int LowStockThreshold { get; set; }
    public decimal UnitCost { get; set; }
    public decimal UnitPrice { get; set; }
    public string Supplier { get; set; } = "";

    public ICollection<StockAdjustment> StockAdjustments { get; set; } = [];
}
