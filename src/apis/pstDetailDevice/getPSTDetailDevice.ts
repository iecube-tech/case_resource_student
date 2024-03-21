import httpInstance from "@/utils/http";

export function GetPSTDetailDevice(pstId: number) {
    return httpInstance({
        url: 'pst_ddd/' + pstId,
        method: 'GET',
    })
}