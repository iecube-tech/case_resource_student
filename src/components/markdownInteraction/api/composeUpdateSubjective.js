import httpInstance from "@/utils/http.ts";
const CHARACTERS = import.meta.env.VITE_APP_CHARACTERS
export function ComposeUpdateSubjective(composeId, subjective) {
    let url = ''
    if (CHARACTERS === 'T') {
        url = '/t/article/compose/upsubjective/' + composeId
    }
    if (CHARACTERS === 'S') {
        return
    }
    return httpInstance({
        url: url,
        method: 'POST',
        data: { subjective: subjective }
    })
}