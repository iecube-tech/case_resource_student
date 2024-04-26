import httpInstance from "@/utils/http";

export function GroupRemoveStudent(groupId: number, studentId: number) {
    return httpInstance({
        url: 'pgroup/remove',
        method: 'POST',
        params: { groupId: groupId, studentId: studentId }
    })
}