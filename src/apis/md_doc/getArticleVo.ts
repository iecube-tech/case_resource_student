import httpInstance from "@/utils/http";

export function GetArticleVo(chapterId: number) {
    return httpInstance({
        url: '/md/vo/ar/' + chapterId,
        method: 'GET',
    })
}