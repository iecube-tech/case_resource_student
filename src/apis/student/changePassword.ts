import httpInstance from "@/utils/http";
export function changePassword(ChangePassword: any) {
    return httpInstance({
        url: '/student/change_password',
        method: 'POST',
        data: ChangePassword,
    })
}