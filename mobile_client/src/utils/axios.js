import axios from 'axios';

//新建了一个axios的实例
const ajax = axios.create();
var modal = {closed: true};

//增加了响应数据的拦截，当请求响应登录超时的时候，给页面一个弹层提醒
ajax.interceptors.response.use(function(response){
    /**
     *  retCode: 3 token失效或超时
     *  retCode: 1003 用户多人登录被踢
     */
    if(response.data && modal.closed){
        if(response.data.retCode === '3' || response.data.retCode === '1003'){
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
                window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "userKickOff", "retCode": response.data.retCode});
            }else if(window.nativeHandler) {
                window.nativeHandler.userKickOff && window.nativeHandler.userKickOff(response.data.retCode);
            }
        }
        if(response.data.retCode === '1005'){
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
                window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "userKickOff", "retCode": response.data.retCode});
            }else if(window.nativeHandler) {
                window.nativeHandler.userKickOff && window.nativeHandler.userKickOff(response.data.retCode);
            }
        }
    }
    return response;

}, function(){
    return Promise.reject(error);
});

export default ajax;
