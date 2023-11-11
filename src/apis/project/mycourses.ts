import httpInstance from "@/utils/http";

export function MyCourse() {
    return httpInstance({
        url: 'project/mycourse',
        method: 'GET',
    })
}