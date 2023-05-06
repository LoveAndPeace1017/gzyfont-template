import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

//获取联系信
export const asyncFetchContactInfor=(params, callback)=>({
    actionTypePrefix: constant.FETCH_CONTACT_DETAIL_INFOR,
    request: axios.get(`${BASE_URL}/mobile/miccn/contact/detailInfor`, {params}),
    callback
});
//发送联系信
export const fetchContactSendInfor = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/mobile/miccn/contact/sendInfor`, {params}).then(function(res) {
        callback && callback(res.data);
    }).catch(error => {
        alert(error);
    });
}


