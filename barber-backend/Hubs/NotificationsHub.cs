using Microsoft.AspNetCore.SignalR;

namespace barber_backend.Hubs;

/// <summary>
/// Real-time channel for barber-admin. Clients just connect and listen;
/// events are pushed server-side from controllers via IHubContext, using
/// the payload already built for the HTTP response so no extra DB read
/// is needed to notify.
/// </summary>
public class NotificationsHub : Hub
{
    public const string NewAppointmentEvent = "newAppointment";
    public const string AppointmentUpdatedEvent = "appointmentUpdated";
    public const string LowStockEvent = "lowStock";
}
