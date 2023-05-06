/**
 * filterImgXss 过滤img标签上的onerror事件
 * */
export default function filterImgXss(data){
    return data && data.replace(/onerror=/, "ssd=")
}