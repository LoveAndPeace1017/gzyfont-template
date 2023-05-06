import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";
import {comInfoPromise} from "../commonRequest/actions";


/**
 * 物品联想选择
 **/
export const fetchAutoImportRequest = () => ({
    type: constant.FETCH_AUTO_IMPORT_REQUEST
});

export const fetchAutoImportSuccess = (data) => ({
    type: constant.FETCH_AUTO_IMPORT_SUCCESS,
    data
});

export const fetchAutoImportFailure = (error) => ({
    type: constant.FETCH_AUTO_IMPORT_FAILURE,
    error
});


export let autoImportPromise;
export const asyncFetchAutoImport = (callback) => dispatch => {

    dispatch(fetchAutoImportRequest());

    autoImportPromise = new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/goods/prod/auto`).then(function(res) {
            if (res.data) {
                dispatch(fetchAutoImportSuccess(fromJS(res.data)));
                callback && callback(res.data);
                resolve(res.data);
            }
        }).catch(error => {
            dispatch(fetchAutoImportFailure(error));
            reject();
        });
    });
    return autoImportPromise;

    /*axios.post(`${BASE_URL}/goods/prod/auto`).then(function(res) {
        if (res.data) {
            dispatch(fetchAutoImportSuccess(fromJS(res.data)));
            callback && callback(res.data);
        }
    }).catch(error => {
        dispatch(fetchAutoImportFailure(error));
    });*/

};











