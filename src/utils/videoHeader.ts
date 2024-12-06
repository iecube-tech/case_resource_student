import videojs from 'video.js';
import Xhr, { XhrBaseConfig } from '@videojs/xhr'
import videoLanguage from 'video.js/dist/lang/zh-CN.json'
videojs.addLanguage('zh-CN', videoLanguage)
videojs.Vhs.xhr.beforeRequest = (options) => {
    if (!options.headers) {
        options.headers = {}
    }
    options.headers["x-access-token"] = localStorage.getItem("x-access-token")
    options.headers["x-access-type"] = localStorage.getItem("x-access-type")
    return options;
}

export default videojs