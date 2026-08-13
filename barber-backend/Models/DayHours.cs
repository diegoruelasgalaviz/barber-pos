namespace barber_backend.Models;

public class DayHours
{
    public string Start { get; set; } = "09:00";
    public string End { get; set; } = "17:00";
    public bool Closed { get; set; }
}
