import httpInstance from "@/utils/http.ts";
const CHARACTERS = import.meta.env.VITE_APP_CHARACTERS
export function ComposeUpdateScore(composeId, score) {
    let url = ''
    if (CHARACTERS === 'T') {
        url = '/t/article/compose/upscore/' + composeId
    }
    if (CHARACTERS === 'S') {
        return
    }
    return httpInstance({
        url: url,
        method: 'POST',
        data: { score: score }
    })
}