import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from './actionsTypes';

const insertSupplier = () => ({
    type: constant.SUPPLIER_INSERT,
});
const insertSupplierEnd = () => ({
    type: constant.SUPPLIER_INSERT_END,
});


export const asyncInsertSupplier = (supplier,callback) => dispatch => {
    dispatch(insertSupplier());
    axios.post(`/api/supplier/insert`,supplier).then(function(res) {
        dispatch(insertSupplierEnd());
        callback(res.data);
    }).catch(error => {
        alert(error);
    });
};
export const asyncModifySupplier = (supplier,callback) => dispatch => {
    dispatch(insertSupplier());
    axios.post(`/api/supplier/modify`,supplier).then(function(res) {
        dispatch(insertSupplierEnd());
        callback(res.data);
    }).catch(error => {
        alert(error);
    });
};

const fetchSupplierDetailSuccess = (data) => ({
    type: constant.SUPPLIER_DETAIL,
    data
});
export const asyncShowSupplier = (supplierNo,callback) => dispatch => {
    axios.get(`/api/supplier/detail/${supplierNo}`).then(function(res) {
        if(res.data.retCode==0){
            dispatch(fetchSupplierDetailSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

export const asyncShowSupplierForSelect = (supplierNo,callback) => dispatch => {
    axios.get(`/api/supplier/relevancy/${supplierNo}`).then(function(res) {
        if(res.data.retCode==0){
            callback && callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

//根据供应商名称取详细数据
export const asyncShowSupplierByName = (supplierName,callback) => dispatch => {
    axios.get(`/api/supplier/detailByName/${supplierName}`).then(function(res) {
        if(res.data.retCode === "0"){
            callback && callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};

export const asyncFetchSupplierPre = (callback) => dispatch => {
    axios.get(`/api/supplier/pre`).then(function(res) {
        if(res.data.retCode==0){
            callback(res.data);
        }else{
            alert(res.data.retMsg);
        }
    }).catch(error => {
        alert(error);
    });
};



