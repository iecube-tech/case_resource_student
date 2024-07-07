import httpInstance from "@/utils/http";

export function StudentAppointment(appointmentId: number) {
    return httpInstance({
        url: 'remote/appointment',
        method: 'POST',
        params: { appointmentId: appointmentId }
    })
}