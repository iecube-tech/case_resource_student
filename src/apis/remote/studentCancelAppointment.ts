import httpInstance from "@/utils/http";

export function StudentCancelAppointment(appointmentId: number) {
    return httpInstance({
        url: 'remote/appointment/cancel',
        method: 'POST',
        params: { appointmentId: appointmentId }
    })
}