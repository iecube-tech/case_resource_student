import dayjs from 'dayjs';

export const formatDate = (time: string | Date, showTime: boolean = true) => {
    if (!time) {
        return ''
    }
    if (showTime) {
        return dayjs(time).format('YYYY年MM月DD日 HH:mm')
    } else {
        return dayjs(time).format('YYYY年MM月DD日')
    }

}

export function base64DecodeUnicode(str: string) {
    // 首先使用 atob() 进行基本的 Base64 解码
    return decodeURIComponent(escape(atob(str)));
}


/**
 * 将格式为 YYYYMM 的字符串转换为 年份+季节 的格式
 * @param {string} dateStr - 输入字符串，格式如 "202501"
 * @returns {string} 转换后的结果，如 "2025春季"；输入非法时返回提示信息
 */
export function formatSeason(dateStr: string) {
    // 1. 输入验证：检查是否为6位字符串，且全部是数字
    if (!/^\d{6}$/.test(dateStr)) {
        return "输入格式错误，请输入6位数字（如202501）";
    }

    // 2. 拆分年份和季节码
    const year = dateStr.substring(0, 4); // 截取前4位作为年份
    const seasonCode = dateStr.substring(4, 6); // 截取后2位作为季节码

    // 3. 映射季节码到对应季节名称
    let season;
    switch (seasonCode) {
        case "01":
            season = "春季";
            break;
        case "02":
            season = "秋季";
            break;
        default:
            return dateStr;
    }

    // 4. 拼接结果并返回
    return `${year}${season}`;
}

/**
 * 从数组中随机获取一个元素
 * @param {Array} arr - 目标数组
 * @returns {*} 随机选中的元素；若数组为空则返回 null
 */
export function getRandomElement(arr: Array<any>) {
    // 边界检查：如果数组为空，返回 null 避免报错
    if (!Array.isArray(arr) || arr.length === 0) {
        return null;
    }

    // 生成 0 到 数组长度-1 之间的随机整数（包含两端）
    const randomIndex = Math.floor(Math.random() * arr.length);

    // 根据随机索引返回对应元素
    return arr[randomIndex];
}

/**
 * 计算两个时间点之间的用时（单位：分钟）
 * @param {string|Date|null|undefined} startTime - 开始时间（支持字符串格式如"2026-02-07 10:00:00"或Date对象，为空则返回'-'）
 * @param {string|Date|null|undefined} endTime - 结束时间（为空则使用当前时间）
 * @returns {string|number} 结果：开始时间为空返回'-'，否则返回分钟数（保留1位小数）
 */
export function calculateTimeDuration(startTime: string | Date | null | undefined, endTime: string | Date | null | undefined) {
    // 1. 开始时间为空，直接返回 '-'
    if (!startTime) {
        return '-';
    }

    // 2. 解析开始时间为Date对象，处理格式异常
    let startDate;
    try {
        startDate = new Date(startTime);
        // 校验是否为有效日期
        if (isNaN(startDate.getTime())) {
            throw new Error('开始时间格式无效');
        }
    } catch (error: any) {
        console.error('解析开始时间失败：', error.message);
        return '-'; // 格式错误也返回 '-'，可根据需求调整
    }

    // 3. 解析结束时间，为空则使用当前时间
    let endDate;
    if (!endTime) {
        endDate = new Date(); // 当前时间
    } else {
        try {
            endDate = new Date(endTime);
            if (isNaN(endDate.getTime())) {
                throw new Error('结束时间格式无效');
            }
        } catch (error: any) {
            console.error('解析结束时间失败：', error.message);
            return '-';
        }
    }

    // 4. 计算时间差（毫秒转分钟，保留1位小数）
    const timeDiffMs = endDate.getTime() - startDate.getTime();
    const timeDiffMinutes = timeDiffMs / (1000 * 60);

    // 处理时间差为负数的情况（结束时间早于开始时间）
    return timeDiffMinutes >= 0
        ? parseFloat(timeDiffMinutes.toFixed(1))
        : 0.0; // 负数返回0，可根据需求调整
}

/**
 * 将逗号分隔的字符串拆分为数组
 * @param {string} str - 输入的逗号分隔字符串，如 "A,B,C,D"
 * @returns {Array} 拆分后的数组，空输入返回空数组
 */
export function splitByComma(str: String) {
    // 1. 处理空值/非字符串输入，直接返回空数组
    if (!str || typeof str !== 'string') {
        return [];
    }

    // 2. 按逗号拆分字符串，并过滤掉拆分后可能出现的空字符串（如连续逗号、首尾逗号的情况）
    // 同时去除每个元素前后的多余空格
    const result = str.split(',').map(item => item.trim()).filter(item => item);

    return result;
}

/**
 * 将数组元素按顺序拼接为以逗号分隔的字符串
 * @param {Array} arr - 待拼接的数组
 * @param {string} [separator=','] - 分隔符（可选，默认逗号）
 * @returns {string} 拼接后的字符串
 */
export function arrayToCommaString(arr: any[], separator = ',') {
    // 边界处理：如果传入的不是数组，返回空字符串
    if (!Array.isArray(arr)) {
        console.warn('参数必须是数组类型');
        return '';
    }

    // 过滤掉数组中的 null/undefined/空字符串（可选，根据需求调整）
    const validArr = arr.filter(item => {
        return item !== null && item !== undefined && item !== '';
    });

    // 拼接为字符串（原生 join 方法本身就是按顺序拼接）
    return validArr.join(separator);
}

/**
 * 宽松判断两个数组的元素集合是否相同（不要求顺序，无重复元素）
 * @param {Array} arr1 - 第一个数组
 * @param {Array} arr2 - 第二个数组
 * @returns {boolean} 是否相同
 */
export function isArrayEqualLoose(arr1: any[], arr2: any[]) {
    // 第一步：长度不一致直接返回false
    if (arr1.length !== arr2.length) return false;

    // 第二步：判断arr1的所有元素都在arr2中，且arr2的所有元素都在arr1中
    return arr1.every(item => arr2.includes(item)) && arr2.every(item => arr1.includes(item));
}


/**
 * 获取元素在数组中第一个匹配项的索引
 * @param {*} element - 要查找的元素（支持字符串、数字、布尔等基础类型）
 * @param {Array} arr - 目标数组
 * @returns {number} 元素索引（不存在返回 -1）
 */
export function findElementIndex(element: any, arr: any[]) {
    // 前置校验：确保传入的是合法数组
    if (!Array.isArray(arr)) {
        console.warn('第二个参数必须是数组');
        return -1;
    }
    // 原生indexOf实现基础类型查找
    console.log(arr.includes(element))
    return arr.indexOf(element);
}

/**
 * 严格查找元素在数组中的索引（支持引用类型）
 * @param {*} element - 要查找的元素（支持所有类型）
 * @param {Array} arr - 目标数组
 * @param {Function} [comparator] - 自定义对比函数（可选，默认全等对比）
 * @returns {number} 元素索引（不存在返回 -1）
 */
export function findElementIndexStrict(element: any, arr: any[], comparator: any | null) {
    if (!Array.isArray(arr)) {
        console.warn('第二个参数必须是数组');
        return -1;
    }
    // 自定义对比函数优先级更高，否则用全等（===）对比
    const compare = comparator || ((item: any) => item == element);
    return arr.findIndex(compare);
}