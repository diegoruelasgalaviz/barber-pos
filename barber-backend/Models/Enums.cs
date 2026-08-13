namespace barber_backend.Models;

public enum UserRole
{
    Owner,
    Admin,
    Staff,
    Customer
}

public enum AppointmentStatus
{
    Pending,
    Confirmed,
    InProgress,
    Completed,
    Cancelled,
    NoShow
}

public enum PaymentMethod
{
    Online,
    Cash
}

public enum PaymentStatus
{
    Paid,
    Pending,
    DueAtShop
}

public enum PluginCategory
{
    Marketing,
    Loyalty,
    Booking,
    Payments
}
