import httpInstance from "@/utils/http";

export function getExamCourse() {
    return httpInstance({
        url: '/exam/stu/exam_course',
        method: 'GET'
    })
}

export function getCourseExamList(projectId: number) {
    return httpInstance({
        url: '/exam/stu/' + projectId + '/exam_list',
        method: 'GET'
    })
}

export function startExam(esId: number) {
    return httpInstance({
        url: '/exam/stu/' + esId + '/start_exam',
        method: "POST"
    })
}

export function getExamPaper(esId: number) {
    return httpInstance({
        url: '/exam/stu/' + esId + '/paper',
        method: "GET"
    })
}

export function updateQues(exampaper: any) {
    return httpInstance({
        url: '/exam/stu/up_ques',
        method: "POST",
        data: exampaper
    })
}

export function submitExam(esId: number) {
    return httpInstance({
        url: '/exam/timing/interrupt/' + esId,
        method: "POST",
    })
}