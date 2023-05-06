import axios from 'utils/axios';
import * as constant from './actionsTypes';


export const asyncCheckWareArriveUpperLimit =(params, callback) =>({
    actionTypePrefix: constant.FETCH_ASYNC_CHECK_WARE_ARRIVE_UPPER_LIMIT,
    request: axios.post(`${BASE_URL}/common/checkWareArriveUpperLimit`, params),
    callback
});

