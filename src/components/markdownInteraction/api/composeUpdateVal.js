import httpInstance from "@/utils/http.ts";
const CHARACTERS = import.meta.env.VITE_APP_CHARACTERS
export function ComposeUpdateVal(composeId, val) {
    let url = ''
    if (CHARACTERS === 'T') {
        url = '/t/article/compose/upval/' + composeId
    }
    if (CHARACTERS === 'S') {
        url = '/s/article/compose/update/' + composeId
    }
    return httpInstance({
        url: url,
        method: 'POST',
        data: { val: val }
    })
}