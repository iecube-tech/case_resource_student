import httpInstance from "@/utils/http.ts";
const CHARACTERS = import.meta.env.VITE_APP_CHARACTERS
export function SubmitVal(composeId, val, result) {
    let url = ''
    if (CHARACTERS === 'T') {
        return
    }
    if (CHARACTERS === 'S') {
        url = '/s/article/compose/update/' + composeId
        return httpInstance({
            url: url,
            method: 'POST',
            data: { val: val, result: result }
        })
    }
    return
}