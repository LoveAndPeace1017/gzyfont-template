import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

const userIdEnc = 'guUeyJzBXiOs';

const fetchContactListSuccess = (res) => ({
    type: constant.FETCH_CONTACT_LIST_SUCCESS,
    data: res.data
});

const fetchContactListFailure = () => ({
    type: constant.FETCH_CONTACT_LIST_FAILURE
});

//初始化联系信列表数据
export const fetchContactListInfo = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/mobile/miccn/contact/lists`, {params}).then(function(res) {
        dispatch(fetchContactListSuccess(res));
        callback && callback(res.data);
    }).catch(error => {
        dispatch(fetchContactListFailure(error));
    });
};

//根据类型不同返回不同类型的联系信
export const fetchContactListTypeDetail = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/mobile/miccn/contact/list/detailType`, {params}).then(function(res) {
        callback && callback(res.data);
    }).catch(error => {
        alert(error);
    });
}



