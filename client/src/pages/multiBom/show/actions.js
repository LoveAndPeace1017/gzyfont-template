import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


const asyncFetchMultiBomDetailRequest = () => ({
    type: constant.FETCH_MULTI_BOM_DETAIL_REQUEST
});

const asyncFetchMultiBomDetailSuccess = (data) => ({
    type: constant.FETCH_MULTI_BOM_DETAIL_SUCCESS,
    data
});


const asyncFetchMultiBomDetailFailure = (error) => ({
    type: constant.FETCH_MULTI_BOM_DETAIL_FAILURE,
    error
});


//获取生产Bom详情
export const asyncFetchMultiBomDetail = (billNo, callback) => dispatch => {
    dispatch(asyncFetchMultiBomDetailRequest());
    axios.get(`${BASE_URL}/multiBom/detail/${billNo}`).then(function(res) {
        if(res.data.retCode === "0"){
            dispatch(asyncFetchMultiBomDetailSuccess(fromJS(res.data)));
            callback && callback(res);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        dispatch(asyncFetchMultiBomDetailFailure());
        alert(error);
    });
};

//导出Bom
export const asyncFetchExportBom = (param, callback) => dispatch => {
    axios.post(`${BASE_URL}/downloadCenter/report/multiBom/`,param).then(function(res) {
        if(res.data.retCode === "0"){
            callback && callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};


