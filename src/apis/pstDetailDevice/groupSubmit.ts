import httpInstance from "@/utils/http";

export function GroupSubmit(groupId: number, pstId: number) {
    return httpInstance({
        url: 'pst_ddd//group/submit',
        method: 'GET',
        params: { groupId: groupId, pstId: pstId }
    })
}   