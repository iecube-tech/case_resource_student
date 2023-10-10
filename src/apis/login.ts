import httpInstance from "@/utils/http";

export function Login(loginfo: { email: string; password: string; clause: boolean; }) {
    return httpInstance({
        url: 'student/login',
        method: 'POST',
        params: { email: loginfo.email, password: loginfo.password }
    })
}