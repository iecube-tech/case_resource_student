import httpInstance from "@/utils/http";

export function GroupAddStudnets(studentList: Array<any>, goupId: Number) {
    return httpInstance({
        url: '/pgroup/group/add/' + goupId,
        method: 'POST',
        data: studentList
    })
} 