import httpInstance from "@/utils/http";

export function Login(loginfo) {
    return httpInstance({
        url: 'teacher/login',
        method: 'POST',
        params: { email: loginfo.email, password: loginfo.password }
    })
}