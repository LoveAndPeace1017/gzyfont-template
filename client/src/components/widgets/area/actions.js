import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

/**
 * 获取仓库列表数据
 **/
const fetchProvinceListSuccess = (provinceList) => ({
    type: constant.GET_PROVINCE_LIST_SUCCESS,
    list:provinceList
});
const fetchProvinceListFailure = (error) => ({
    type: constant.GET_PROVINCE_LIST_FAILURE,
    error
});




export const asyncGetProvinceList = () => dispatch => {
    let area =JSON.parse(localStorage.getItem("area"));
    if(area){
        dispatch(fetchProvinceListSuccess(fromJS(area)))
    }else{
        axios.get('/api/common/area').then(function(res) {
            if (res.data && res.data.retCode==0) {
                localStorage.setItem("area",JSON.stringify(res.data.list));
                dispatch(fetchProvinceListSuccess(fromJS(res.data.list)))
            }else{
                dispatch(fetchProvinceListFailure(res.data.retMsg));
            }
        }).catch(error => {
            dispatch(fetchProvinceListFailure(error));
        });
    }

};

