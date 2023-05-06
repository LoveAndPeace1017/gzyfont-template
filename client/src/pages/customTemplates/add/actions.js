import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

export const asyncCustomerTemplates=(values,callback)=>({
    actionTypePrefix: constant.FETCH_CUSTOMER_TEMPLATES,
    request: axios.post(`${BASE_URL}/customerTemplates/add`,{
        params:values
    }),
    callback
});
/*修改模板*/
export const asyncEditorCustomerTemplates= (params,callback) => dispatch=>{
    axios.post(`${BASE_URL}/customerTemplates/editor`,params).then(function (res) {
        callback(res);
    }).catch(error => {
        alert(error)
    })
}
/*模板详情*/
export const asyncCustomerTemplatesDetail= (params,callback) => dispatch=>{
    axios.post(`${BASE_URL}/customerTemplates/detail`,params).then(function (res) {
        callback(res);
    }).catch(error => {
        callback({
            retCode: 1,
            retMsg: error
        })
    })
}







