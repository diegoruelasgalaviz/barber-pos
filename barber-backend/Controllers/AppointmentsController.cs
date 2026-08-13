using barber_backend.Data;
using barber_backend.DTOs;
using barber_backend.Models;
using barber_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace barber_backend.Controllers;

[ApiController]
[Route("api/appointments")]
public class AppointmentsController(BarberDbContext db, RealtimeNotifier notifier) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll([FromQuery] Guid? customerId) =>
        Ok(await db.Appointments
            .Where(a => customerId == null || a.CustomerId == customerId)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => a.ToDto())
            .ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AppointmentDto>> Get(Guid id)
    {
        var a = await db.Appointments.FindAsync(id);
        return a is null ? NotFound() : a.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentDto>> Create(AppointmentUpsertRequest req)
    {
        var durationMinutes = req.DurationMinutes ?? await db.Services.Where(s => s.Id == req.ServiceId).Select(s => s.DurationMinutes).FirstOrDefaultAsync();

        var appointment = new Appointment
        {
            CustomerId = req.CustomerId,
            GuestName = req.GuestName,
            GuestContact = req.GuestContact,
            StaffId = req.StaffId,
            ServiceId = req.ServiceId,
            Date = req.Date,
            StartTime = req.StartTime,
            DurationMinutes = durationMinutes,
            Status = req.Status,
            Notes = req.Notes,
            PaymentMethod = req.PaymentMethod,
            PaymentStatus = req.PaymentStatus,
            DiscountId = req.DiscountId,
        };
        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        var dto = appointment.ToDto();
        // Broadcast the payload we already have in memory — no extra DB read for the notification.
        await notifier.NewAppointment(dto);

        return CreatedAtAction(nameof(Get), new { id = appointment.Id }, dto);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AppointmentDto>> Update(Guid id, AppointmentUpsertRequest req)
    {
        var appointment = await db.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();

        appointment.CustomerId = req.CustomerId;
        appointment.GuestName = req.GuestName;
        appointment.GuestContact = req.GuestContact;
        appointment.StaffId = req.StaffId;
        appointment.ServiceId = req.ServiceId;
        appointment.Date = req.Date;
        appointment.StartTime = req.StartTime;
        appointment.DurationMinutes = req.DurationMinutes ?? appointment.DurationMinutes;
        appointment.Status = req.Status;
        appointment.Notes = req.Notes;
        appointment.PaymentMethod = req.PaymentMethod;
        appointment.PaymentStatus = req.PaymentStatus;
        appointment.DiscountId = req.DiscountId;
        await db.SaveChangesAsync();

        var dto = appointment.ToDto();
        await notifier.AppointmentUpdated(dto);
        return dto;
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var appointment = await db.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();
        db.Appointments.Remove(appointment);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
