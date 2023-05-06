import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

export const asyncCustomerTemplatesList=(params,callback)=>({
    actionTypePrefix: constant.FETCH_CUSTOMER_TEMPLATES_lIST,
    request: axios.post(`${BASE_URL}/customerTemplates/list`,{
        params:params
    }),
    callback
});

export const asyncCustomerTemplatesDelete= (params,callback) => dispatch=>{
    axios.post(`${BASE_URL}/customerTemplates/delete`,{vo1:params}).then(function (res) {
         callback(res);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        })
   })
}

export const asyncCustomerTemplatesSetDefault= (params,callback) => dispatch=>{
    axios.post(`${BASE_URL}/customerTemplates/setDefault`,params).then(function (res) {
        callback(res);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        })
    })
}

//根据选择的打印模板获取模板数据和页面数据
export const asyncCustomerTemplatesGetData= (params,callback) => dispatch=>{
    axios.post(`${BASE_URL}/customerTemplates/getData`,params).then(function (res) {
        callback(res);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        })
    })
}

//直接打印数据
export const asyncCustomerTemplatesDirectPrint= (params,callback) => dispatch=>{
    axios.post(`${BASE_URL}/customerTemplates/directPrint`,params).then(function (res) {
        callback(res);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        })
    })
}
