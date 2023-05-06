import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 物品联想选择
 **/
export const fetchSuggestsByKeyRequest = () => ({
    type: constant.FETCH_SUGGESTS_BY_KEY_REQUEST
});

export const fetchSuggestsByKeySuccess = (data) => ({
    type: constant.FETCH_SUGGESTS_BY_KEY_SUCCESS,
    data
});

export const fetchSuggestsByKeyFailure = (error) => ({
    type: constant.FETCH_SUGGESTS_BY_KEY_FAILURE,
    error
});

let timeout;
let currentValue;
export const asyncFetchSuggestsByKey = (searchTipsUrl, searchTipsUrlPrefix, key, params, callback) => dispatch => {

    dispatch(fetchSuggestsByKeyRequest());

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = key;

    function fake(){
        axios.get(`${BASE_URL}/common/search/tips`, {
            params: {
                key: key,
                s_path_prefix: searchTipsUrlPrefix,
                s_path: searchTipsUrl,
                ...params
            }
        }).then(function(res) {
            if (res.data) {
                dispatch(fetchSuggestsByKeySuccess(fromJS(res.data)));
                callback && callback(fromJS(res.data.data));
            }
        }).catch(error => {
            dispatch(fetchSuggestsByKeyFailure(error));
        });
    }

    timeout = setTimeout(fake, 300);

};











