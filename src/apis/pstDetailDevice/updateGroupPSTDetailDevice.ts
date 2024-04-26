import httpInstance from "@/utils/http";

export function UpdateGroupPSTDetailDevice(groupId: number, pstId: number, pstDetailDevice: object) {
    return httpInstance({
        url: 'pst_ddd/up/group/' + groupId + '/' + pstId,
        method: 'POST',
        data: pstDetailDevice
    })
}