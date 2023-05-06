import {fromJS} from "immutable";
import axios from 'utils/axios';
import * as constant from "./actionsTypes";


/**
 * 获取子账号权限
 **/
const fetchSubAccountAuthRequest = () => ({
    type: constant.FETCH_SUB_ACCOUNT_AUTH_REQUEST
});

const fetchSubAccountAuthSuccess = (data) => ({
    type: constant.FETCH_SUB_ACCOUNT_AUTH_SUCCESS,
    data
});

const fetchSubAccountAuthFailure = (error) => ({
    type: constant.FETCH_SUB_ACCOUNT_AUTH_FAILURE,
    error
});

export const asyncFetchSubAccountAuth = (subUserId,callback) => dispatch => {
    dispatch(fetchSubAccountAuthRequest());
    axios.get(`${BASE_URL}/subAccount/showChildrenAuth/${subUserId}`).then(function(res) {
        if (res.data) {
            dispatch(fetchSubAccountAuthSuccess(fromJS(res.data)));
            if(callback){
                callback(res.data);
            }
        }
    }).catch(error => {
        dispatch(fetchSubAccountAuthFailure(error));
    });
};

//清空子账号信息
export const emptySubAccountAuth = () => ({
    type: constant.EMPTY_SUB_ACCOUNT_AUTH
});


/**
 * 提交子账号权限
 **/

const SubmitSubAccountAuthRequest = () => ({
    type: constant.SUBMIT_SUB_ACCOUNT_AUTH_REQUEST
});

const SubmitSubAccountAuthSuccess = (data) => ({
    type: constant.SUBMIT_SUB_ACCOUNT_AUTH_SUCCESS,
    data
});

const SubmitSubAccountAuthFailure = (error) => ({
    type: constant.SUBMIT_SUB_ACCOUNT_AUTH_FAILURE,
    error
});

export const asyncSubmitSubAccountAuth = (values) => dispatch => {
    dispatch(SubmitSubAccountAuthRequest());
    let url = `${BASE_URL}/subAccount/${values.userId}`;
    const valuesKey = Object.keys(values);
    const authList = valuesKey.filter(item => {
        return /^(\w+)-(\w+)-(\w+)$/g.test(item);
    });

    //数组去重,把同一个模块的数据放在一起
    const moduleList = [];
    for (let i = 0; i < authList.length; i++) {
        const tempList = authList[i].split('-');
        const authArr = [];
        for (let j = i+1; j < authList.length; j++) {
            const tempList2 = authList[j].split('-');
            if (tempList[1] == tempList2[1]) {
                authArr.push(tempList2[2]);
                ++i;
            }
        }
        authArr.push(tempList[2]);
        moduleList.push({
            moduleId: tempList[1],
            key: tempList[0] + '-' + tempList[1],
            auth: authArr
        });
    }

    //组装成后端需要的数据格式
    const authoritys = moduleList.map(item => {
        let authority = 0;
        for(var i=0;i<item.auth.length;i++){
            if (values[item.key + '-' + item.auth[i]]) {
                if(item.auth[i] === constant.AUTH_APPENDIX){
                    authority += 32;
                }
                if(item.auth[i] === constant.AUTH_APPROVE){
                    authority += 16;
                }
                if(item.auth[i] === constant.AUTH_ADD){
                    authority += 8;
                }
                if(item.auth[i] === constant.AUTH_DELETE){
                    authority += 4;
                }
                if(item.auth[i] === constant.AUTH_MODIFY){
                    authority += 2;
                }
                if(item.auth[i] === constant.AUTH_READ){
                    authority += 1;
                }
            }
        }

        return {
            module: item.moduleId,
            authority,
            dataRange: values['dataRange-' + item.moduleId]
        }
    });
    return new Promise((resolve, reject) => {
        axios.post(url, {
            authoritys: authoritys,
            userName: values.userNameMain,
            userNameSub: values.userNameSub
        }).then(res => {
            dispatch(SubmitSubAccountAuthSuccess());
            resolve(res);
        }).catch(error => {
            dispatch(SubmitSubAccountAuthFailure());
            reject(error);
        })
    })
};





