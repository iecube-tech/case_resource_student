import httpInstance from "@/utils/http.ts";
const CHARACTERS = import.meta.env.VITE_APP_CHARACTERS
export function ComposeUpdateAnswer(composeId, answer) {
    let url = ''
    if (CHARACTERS === 'T') {
        url = '/t/article/compose/upanswer/' + composeId
    }
    if (CHARACTERS === 'S') {
        return
    }
    return httpInstance({
        url: url,
        method: 'POST',
        data: { answer: answer }
    })
}