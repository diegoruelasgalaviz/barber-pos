using barber_backend.Data;
using barber_backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController(BarberDbContext db) : ControllerBase
{
    [HttpGet("business-profile")]
    public async Task<ActionResult<BusinessProfileDto>> GetBusinessProfile()
    {
        var profile = await db.BusinessProfiles.FindAsync(1);
        return profile is null ? NotFound() : profile.ToDto();
    }

    [HttpPut("business-profile")]
    public async Task<ActionResult<BusinessProfileDto>> UpdateBusinessProfile(BusinessProfileDto req)
    {
        var profile = await db.BusinessProfiles.FindAsync(1);
        if (profile is null) return NotFound();
        profile.Name = req.Name; profile.Address = req.Address; profile.City = req.City;
        profile.State = req.State; profile.Zip = req.Zip; profile.Phone = req.Phone;
        profile.Email = req.Email; profile.Website = req.Website; profile.Hours = req.Hours;
        await db.SaveChangesAsync();
        return profile.ToDto();
    }

    [HttpGet("notifications")]
    public async Task<ActionResult<NotificationPrefsDto>> GetNotificationPrefs()
    {
        var prefs = await db.NotificationPrefs.FindAsync(1);
        return prefs is null ? NotFound() : prefs.ToDto();
    }

    [HttpPut("notifications")]
    public async Task<ActionResult<NotificationPrefsDto>> UpdateNotificationPrefs(NotificationPrefsDto req)
    {
        var prefs = await db.NotificationPrefs.FindAsync(1);
        if (prefs is null) return NotFound();
        prefs.EmailReminders = req.EmailReminders; prefs.SmsReminders = req.SmsReminders;
        prefs.ReminderLeadHours = req.ReminderLeadHours; prefs.NewBookingAlerts = req.NewBookingAlerts;
        prefs.LowStockAlerts = req.LowStockAlerts;
        await db.SaveChangesAsync();
        return prefs.ToDto();
    }

    [HttpGet("payment-tax")]
    public async Task<ActionResult<PaymentTaxSettingsDto>> GetPaymentTax()
    {
        var settings = await db.PaymentTaxSettings.FindAsync(1);
        return settings is null ? NotFound() : settings.ToDto();
    }

    [HttpPut("payment-tax")]
    public async Task<ActionResult<PaymentTaxSettingsDto>> UpdatePaymentTax(PaymentTaxSettingsDto req)
    {
        var settings = await db.PaymentTaxSettings.FindAsync(1);
        if (settings is null) return NotFound();
        settings.Currency = req.Currency; settings.TaxRate = req.TaxRate;
        settings.AcceptsCard = req.AcceptsCard; settings.AcceptsCash = req.AcceptsCash;
        settings.TippingEnabled = req.TippingEnabled; settings.DefaultTipPercents = req.DefaultTipPercents;
        await db.SaveChangesAsync();
        return settings.ToDto();
    }
}
