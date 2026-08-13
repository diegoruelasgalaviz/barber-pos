namespace barber_backend.Models;

public class Plugin
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public PluginCategory Category { get; set; }
    public bool Enabled { get; set; }
    public bool Configured { get; set; }
}
