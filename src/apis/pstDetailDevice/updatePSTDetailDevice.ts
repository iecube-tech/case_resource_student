import httpInstance from "@/utils/http";

export function UpdatePSTDetailDevice(pstId: number, pstDetailDevice: object) {
    return httpInstance({
        url: 'pst_ddd/up/' + pstId,
        method: 'POST',
        data: pstDetailDevice
    })
}