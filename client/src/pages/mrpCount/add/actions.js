import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

/**
 * 新增mrp数据
 **/
const addMrpCountRequest = () => ({
    type: constant.ADD_MRP_COUNT_REQUEST
});

const addMrpCountSuccess = (data) => ({
    type: constant.ADD_MRP_COUNT_SUCCESS,
    data
});

const addMrpCountFailure = (error) => ({
    type: constant.ADD_MRP_COUNT_FAILURE,
    error
});

/**
 * 新增Mrp运算
 **/
export const asyncAddMrpCount = (values,callback) => dispatch => {
    dispatch(addMrpCountRequest());
    axios.post(`${BASE_URL}/productControl/addMrp`,{
        ...values
    }).then(function(res) {
        if (res.data) {
            dispatch(addMrpCountSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(addMrpCountFailure(error));
    });
};


/**
 * 获取下一级Bom数据
 **/
const getNextBomRequest = () => ({
    type: constant.GET_NEXT_BOM_DATA_REQUEST
});

const getNextBomSuccess = (data) => ({
    type: constant.GET_NEXT_BOM_DATA_SUCCESS,
    data
});

const getNextBomUpdate = (data) => ({
    type: constant.GET_NEXT_BOM_DATA_UPDATE,
    data
});

const getNextBomFailure = (error) => ({
    type: constant.GET_NEXT_BOM_DATA_FAILURE,
    error
});

const upDateTime = (data)=>({
    type: constant.GET_NEXT_BOM_UPDATE_TIME,
    data
});

const emptyData = ()=>({
    type: constant.EMPTY_NEXT_BOM_DATA
});

//更新时间
export const dispatchUpDateTime = (data) =>dispatch=>{
    dispatch(upDateTime(data));
}

//清空数据
export const dispatchEmptyData = () =>dispatch=>{
    dispatch(emptyData());
}

//从销售订单复制数据获取
export const asyncGetNextBom = (values, callback) => dispatch => {
    dispatch(getNextBomRequest());
    axios.post(`${BASE_URL}/productControl/getNextBom`, {
        ...values
    }).then(res => {
        dispatch(getNextBomSuccess(fromJS(res.data)));
        //当bom列表中有默认bom，选中默认bom并带出
        let bomData = res.data.data;
        let needUpdate = [];
        if(bomData && bomData.length>0){
            for(let i=0;i<bomData.length;i++){
                let bomList = bomData[i].bomList;
                if(bomList && bomList.length>0){
                    let defaultBomCode = bomList.filter((item)=> {
                        return item.defaultFlag
                    });
                    let id = bomData[i].id;
                    let dataAry = (defaultBomCode[0].bomCode+'').split('&*');
                    let nextBomValue = {
                        id:id,
                        code:dataAry[0],
                        dayProductivity:(dataAry[1] && dataAry[1]) || ""
                    };
                    needUpdate.push(nextBomValue);
                }
            }
        }
        callback && callback(needUpdate);

    }).catch(error => {
        dispatch(getNextBomFailure(error));
    })
};

//根据bom编号获取子级bom数据
export const asyncGetBomChilren = (values,callback) => dispatch => {
    console.log(values,'22values');
    axios.post(`${BASE_URL}/productControl/getBomChildren`, {
        ...values
    }).then(res => {
        let dataSource = res.data.data || [];
        dataSource.forEach((item)=>{
            item.id = values.id+"-"+item.id;
        });
        console.log(dataSource,'dataSourceMM');
        dispatch(getNextBomUpdate({dataSource:dataSource,bomCode:values.code,dayProductivity:values.dayProductivity}));
        callback && callback(res.data);
    }).catch(error => {
        console.log(error);
    })
};



/**
 * 获取页面初始数据
 **/
const fetchPreDataRequest = () => ({
    type: constant.FETCH_MRP_COUNT_PRE_DATA_REQUEST
});

const fetchPreDataSuccess = (data) => ({
    type: constant.FETCH_MRP_COUNT_PRE_DATA_SUCCESS,
    data
});

const fetchPreDataFailure = (error) => ({
    type: constant.FETCH_MRP_COUNT_PRE_DATA_FAILURE,
    error
});

export const asyncFetchPreData = (callback) => dispatch => {

    dispatch(fetchPreDataRequest());
    axios.get(`${BASE_URL}/productControl/mrp/pre/create`).then(function(res) {
        if (res.data) {
            dispatch(fetchPreDataSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchPreDataFailure(error));
    });
};









