import httpInstance from "@/utils/http";

export function RemoteOperation(appointmentId: number) {
    return httpInstance({
        url: 'remote/operation/' + appointmentId,
        method: 'POST',
    })
}