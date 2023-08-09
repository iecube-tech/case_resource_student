import httpInstance from "@/utils/http";

export function MyProjectDetail(id: Number) {
    return httpInstance({
        url: 'project/spdetail',
        method: 'GET',
        params: { projectId: id }
    })
}