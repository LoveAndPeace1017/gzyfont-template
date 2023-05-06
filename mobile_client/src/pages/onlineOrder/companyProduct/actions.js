import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";
import {fetchSuggestsByKeySuccess} from "../../../../../client/src/components/business/suggestSearch/actions";

const fetchOnlineOrderCompanyListDataSuccess = (data) => ({
    type: constant.FETCH_ONLINE_ORDER_COMPANY_LIST_DATA_SUCCESS,
    data
});


export const asyncFetchNewOnlineOrderCompanyListData = (params, callback) => dispatch => {
    console.log(params,'params');
    axios.post(`${BASE_URL}/mobile/newOrderList/companyList`, params).then(function(res) {
        console.log(res,'company');
        if(res.data.retCode === '0') {
            dispatch(fetchOnlineOrderCompanyListDataSuccess(res));
            callback && callback();
        }
    }).catch(error => {
        alert(error);
    });
};

