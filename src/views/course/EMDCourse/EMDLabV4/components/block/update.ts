import {
    updateEmdV4ComponentStatus,
    updateEmdV4ComponentPayload,
    updateEmdV4ComponentScore,
} from "@/apis/emdV4/index.ts";
import { el } from "element-plus/es/locale/index.mjs";

// 通用 更新 component 状态
export const updateCompStatus = (id, status, cb) => {
    updateEmdV4ComponentStatus(id, status).then((res) => {
        if (res.state == 200) {
            if (typeof cb == "function") {
                cb();
            }
        } else {
            console.error(res.message);
        }
    });
};

// 通用更新 component payload
export const updateCompPayload = (id, payloadStr, cb) => {
    updateEmdV4ComponentPayload(id, payloadStr).then((res) => {
        if (res.state == 200) {
            if (typeof cb == "function") {
                cb();
            }
        } else {
            console.error(res.message);
        }
    });
};

export const updateCompScore = (id, score, cb) => {
    updateEmdV4ComponentScore(id, score).then(res => {
        if(res.state == 200) {
            if(typeof cb == "function"){
                cb();
            }
        } else {
            console.error(res.message);
        }
    })
}
