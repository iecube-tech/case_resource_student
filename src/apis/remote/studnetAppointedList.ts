import httpInstance from "@/utils/http";

export function StudentAppointmentedList(proejctId: number) {
    return httpInstance({
        url: 'remote/' + proejctId + '/my_appointment',
        method: 'GET',
    })
}