import * as constant from "./actionsTypes";
import axios from 'utils/axios';

/**
 * 获取供应商报价记录
 * @param params
 * @returns {Function}
 */
const fetchSupplierQuotationRecordRequest = () => ({
    type: constant.FETCH_SUPPLIER_QUOTATION_RECORD_REQUEST
});
const fetchSupplierQuotationRecordSuccess = (data) => ({
    type: constant.FETCH_SUPPLIER_QUOTATION_RECORD_SUCCESS,
    data
});
const fetchSupplierQuotationRecordFailure = () => ({
    type: constant.FETCH_SUPPLIER_QUOTATION_RECORD_FAILURE
});

export const asyncFetchSupplierQuotationRecord = (params, callback) => dispatch => {
    dispatch(fetchSupplierQuotationRecordRequest());
    axios.get(`${BASE_URL}/goods/supplier/quotation/record`,{ params }).then(function(res) {
        if (res.data && res.data.retCode==="0") {
            dispatch(fetchSupplierQuotationRecordSuccess(res.data));
        }else{
            dispatch(fetchSupplierQuotationRecordFailure());
        }
        if(callback){
            callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchSupplierQuotationRecordFailure(error));
    });
};

export const asyncDeleteSupplierQuotation = (ids, callback) => dispatch => {
    axios.post(`${BASE_URL}/goods/supplier/quotation/delete`, {
        ids
    }).then(function (res) {
        if (callback) {
            callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};

