using barber_backend.Data;
using barber_backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/plugins")]
public class PluginsController(BarberDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PluginDto>>> GetAll() =>
        Ok(await db.Plugins.Select(p => p.ToDto()).ToListAsync());

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PluginDto>> Update(Guid id, PluginUpdateRequest req)
    {
        var plugin = await db.Plugins.FindAsync(id);
        if (plugin is null) return NotFound();
        plugin.Enabled = req.Enabled;
        plugin.Configured = req.Configured;
        await db.SaveChangesAsync();
        return plugin.ToDto();
    }
}
