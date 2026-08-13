using barber_backend.DTOs;
using barber_backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace barber_backend.Services;

/// <summary>
/// Thin wrapper around IHubContext so controllers can push the response
/// payload they already built straight to connected clients, with no
/// extra DB round-trip for the notification itself.
/// </summary>
public class RealtimeNotifier(IHubContext<NotificationsHub> hub)
{
    public Task NewAppointment(AppointmentDto appointment) =>
        hub.Clients.All.SendAsync(NotificationsHub.NewAppointmentEvent, appointment);

    public Task AppointmentUpdated(AppointmentDto appointment) =>
        hub.Clients.All.SendAsync(NotificationsHub.AppointmentUpdatedEvent, appointment);

    public Task LowStock(ProductDto product) =>
        hub.Clients.All.SendAsync(NotificationsHub.LowStockEvent, product);
}
