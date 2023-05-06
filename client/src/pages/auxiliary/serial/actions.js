import axios from 'utils/axios';
import * as constant from './actionsTypes';
import {getNowFormatDate} from 'utils/format';


export const asyncFetchSerialList = (type, callback) => dispatch => {
    let url = `${BASE_URL}/auxiliary/serial/list`;
    if(type) url = `${BASE_URL}/auxiliary/serial/other/list`;
    axios.get(url).then(function(res) {
        if (res.data) {
            let resData = res.data.data.map((item, index)=>{
                item.serial = '0001';
                item.key = index + 1;
                item.date = getNowFormatDate({format:item.midfix});
                switch (item.module){
                    case 'OutWarehouse':
                        item.name ='auxiliary.serial.out';
                        break;
                    case 'EnterWarehouse':
                        item.name ='auxiliary.serial.in';
                        break;
                    case 'SaleOrder':
                        item.name ='auxiliary.serial.sale';
                        break;
                    case 'Bom':
                        item.name ='auxiliary.serial.bom';
                        item.serial = '00001';
                        break;
                    case 'PurchaseOrder':
                        item.name ='auxiliary.serial.purchase';
                        break;
                    case 'Requisition':
                        item.name ='auxiliary.serial.requisition';
                }
                return item;
            });
            callback && callback(resData);
        }
    });
};


/**
 * 新增/修改/删除单据编号提交
 **/
const addSerialRequest = () => ({
    type: constant.ADD_SERIAL_REQUEST
});

const addSerialSuccess = (data) => ({
    type: constant.ADD_SERIAL_SUCCESS,
    data
});

const addSerialFailure = (error) => ({
    type: constant.ADD_SERIAL_FAILURE,
    error
});

export const asyncAddSerial = (values, callback) => dispatch => {
    dispatch(addSerialRequest());
    let url = `${BASE_URL}/auxiliary/serial/add`;
    axios.post(url,values).then(res => {
        dispatch(addSerialSuccess());
        callback && callback(res);
    }).catch(error => {
        dispatch(addSerialFailure(error));
    })
};
