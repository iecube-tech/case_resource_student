import httpInstance from "@/utils/http";

export function GetRemoteProject(proejctId: number) {
    return httpInstance({
        url: 'remote/' + proejctId,
        method: 'GET',
    })
}