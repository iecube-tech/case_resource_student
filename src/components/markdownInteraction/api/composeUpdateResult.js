import httpInstance from "@/utils/http.ts";
const CHARACTERS = import.meta.env.VITE_APP_CHARACTERS
export function ComposeUpdateResult(composeId, result) {
    let url = ''
    if (CHARACTERS === 'T') {
        url = '/s/article/compose/upresult/' + composeId
    }
    if (CHARACTERS === 'S') {
        return
    }
    return httpInstance({
        url: url,
        method: 'POST',
        data: { result: result }
    })
}