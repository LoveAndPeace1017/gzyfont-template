import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


const fetchOnlineOrderCustomerDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_CUSTOMER_DATA_SUCCESS,
    data
});



export const asyncFetchCustomerInformationData = (params, callback) => dispatch => {
    axios.get(`${BASE_URL}/mobile/newOrderList/companyInformation`, {
        params
    }).then(function(res) {
        console.log(res,'companyInformation');
        if(res.data.retCode === '0') {
            dispatch(fetchOnlineOrderCustomerDataSuccess(res.data));
            callback && callback();
        }
    }).catch(error => {
        alert(error);
    });
};


