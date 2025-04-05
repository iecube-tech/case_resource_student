import httpInstance from "@/utils/http";

export function UseArtefact(artefactId: any) {
    return httpInstance({
        url: '/ai/artefact/' + artefactId,
        method: 'GET',
    })
}