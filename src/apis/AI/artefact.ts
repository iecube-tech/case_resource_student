import httpInstance from "@/utils/http";

export function UseArtefact(artefactId: any, taskId: number, agentName: string) {
    return httpInstance({
        url: '/ai/artefact/' + artefactId,
        method: 'GET',
        params: { taskId: taskId, type: agentName }
    })
}