import httpInstance from "@/utils/http";

export function Login(loginfo: { studentId: string; password: string; clause: boolean; }) {
    return httpInstance({
        url: 'student/login',
        method: 'POST',
        params: { studentId: loginfo.studentId, password: loginfo.password }
    })
}