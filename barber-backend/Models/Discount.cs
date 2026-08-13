namespace barber_backend.Models;

public class Discount
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal PercentOff { get; set; }
    public string Code { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
}
