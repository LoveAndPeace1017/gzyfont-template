import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";

export const addFieldConfig = (data, module) => ({
    type: constant.ADD_FIELD_CONFIG,
    data,
    module
});


export const updateFieldConfig = (data, module) => ({
    type: constant.UPDATE_FIELD_CONFIG,
    data,
    module
});

export const asyncSaveFieldConfig = (type, callback) => (dispatch, getState) => {
    let arr = [];
    let goodsTableConfig = getState().getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig', 'data']);
    goodsTableConfig && goodsTableConfig.forEach((item) => {
        let moduleType = type + '_product';
        if(type === 'workSheet_process'){  // 特殊情况
            moduleType = type;
        }
        arr.push({
            moduleType: moduleType,
            recId: item.get('recId'),
            columnName: item.get('columnName'),
            visibleFlag: item.get('visibleFlag')
        });
    });
    axios.post(`${BASE_URL}/common/field/edit`, {
        voList: arr
    }).then(function (res) {
        callback && callback();
    }).catch(error => {
        alert(error);
    });
};

export const asyncSaveFieldConfigForProduce = (callback) => (dispatch, getState) => {
    let produceTableConfig = getState().getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig', 'produceData']);
    let materialTableConfig = getState().getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig', 'materialData']);
    let produceTableConfigData = produceTableConfig && produceTableConfig.toJS();
    let materialTableConfigData = materialTableConfig && materialTableConfig.toJS();

    axios.post(`${BASE_URL}/common/field/edit`, {
        voList: [
            ...produceTableConfigData,
            ...materialTableConfigData
        ]
    }).then(function (res) {
        callback && callback();
    }).catch(error => {
        alert(error);
    });
};


export const asyncResetFieldConfig = (type,callback) => dispatch => {
    let configType = 'product';
    axios.post(`/api/common/field/default`,{
        type,
        configType: configType
    }).then(function(res) {
        if(res.data.retCode==='0'){
            callback && callback()
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

export const emptyFieldConfig = (data) => ({
    type: constant.EMPTY_FIELD_CONFIG,
    data
});













