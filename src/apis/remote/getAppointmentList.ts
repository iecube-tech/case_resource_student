import httpInstance from "@/utils/http";

export function GetAppointmentList(remoteAppointmentQo: any) {
    return httpInstance({
        url: 'remote/appointment/query',
        method: 'POST',
        data: remoteAppointmentQo
    })
}