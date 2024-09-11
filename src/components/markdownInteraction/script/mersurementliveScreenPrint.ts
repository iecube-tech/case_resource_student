import { useMersurementliveStore } from '@/store/measurementliveStore'
import ScreenShort from "js-web-screen-shot";
const CHARACTERS = import.meta.env.VITE_APP_CHARACTERS
const measurementliveStore = useMersurementliveStore();
let stateBeforeJietu = false;
interface res {
    base64: string | null
    cutInfo: any | null
    code: number | null
    msg: string | null
    errorInfo: string | null
}

export default function getScreenPrint() {
    if (CHARACTERS == 'T') {
        return null
    }
    return new Promise<{
        base64: string | null
        cutInfo: any | null
        code: number | null
        msg: string | null
        errorInfo: string | null
    }>((resolve, reject) => {
        stateBeforeJietu = measurementliveStore.getState();
        measurementliveStore.displayMersurementlive();
        try {
            new ScreenShort({
                enableWebRtc: true,
                completeCallback: (imageInfo) => {
                    // 截图成功完成的回调
                    closeScreenGet();
                    let res = <res>{
                        base64: imageInfo.base64,
                        cutInfo: imageInfo.cutInfo,
                        code: 1,
                        msg: '截图成功',
                    }
                    resolve(res);
                },
                closeCallback: () => {
                    // 关闭回调
                    closeScreenGet();
                    let res = <res>{
                        code: -1,
                        msg: '截图关闭',
                    }
                    resolve(res)
                },
                cancelCallback: (res) => {
                    // 截图取消的回调
                    // 使用webrtc模式截屏时，用户点了取消或者浏览器不支持时所触发的事件 
                    // 参数 {code: number,msg: string, errorInfo: string}c ode为-1时代表用户未授权或者浏览器不支持webrtc。
                    closeScreenGet();
                    let result = <res>{
                        code: res.code,
                        msg: res.msg,
                        errorInfo: res.errorInfo
                    }
                    resolve(result);
                },
                saveCallback: (code, msg) => {
                    // 截图保存回调
                    // code 状态码，number类型，为0时代表保存成功
                    // msg 消息码，string类型。
                    closeScreenGet();
                    let res = <res>{
                        code: code,
                        msg: "已保存图像，请重新上传",
                    }
                    resolve(res)
                },
                canvasHeight: window.innerHeight - 5,
                canvasWidth: window.innerWidth - 5,
                level: 9999,
                loadCrossImg: true,
                imgAutoFit: true,
            });
            disableScroll()
        } catch (error) {
            closeScreenGet()
            let res = <res>{
                code: -1,
                errorInfo: error,
                msg: '意外的错误'
            }
            reject(res)
        }

    })
}

const closeScreenGet = () => {
    if (stateBeforeJietu == true) {
        measurementliveStore.displayMersurementlive()
    } else {
        measurementliveStore.hiddenMersurementlie()
    }
    enableScroll()

}

let scrollTop = 0
let scrollLeft = 0

const disableScroll = () => {
    // Get the current page scroll position 
    scrollTop = window.scrollY || document.documentElement.scrollTop;
    scrollLeft = window.screenX || document.documentElement.scrollLeft;
    // if any scroll is attempted, 
    // set this to the previous value
    // console.log('scroll', scrollTop, scrollLeft)
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
    });
    window.onscroll = function () {
        return
    };
    // console.log("jinz")
}

const enableScroll = () => {
    window.onscroll = function () { };
    // console.log("huifu", scrollTop, scrollLeft)
    window.scrollTo({
        top: scrollTop,
        left: scrollLeft,
        behavior: 'auto'
    });
    // console.log("qiyong")
}

