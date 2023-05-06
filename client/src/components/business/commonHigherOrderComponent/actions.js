import axios from 'utils/axios';

// 状态已完成操作
export const asyncFinishState = (params, callback)=> dispatch => {
    axios.post(`${BASE_URL}/common/state/finish`, params).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};


// 状态撤回操作
export const asyncRevertState = (params, callback) => dispatch => {
    axios.post(`${BASE_URL}/common/state/revert`, params).then(function(res) {
        if (res.data) {
            callback && callback(res.data);
        }
    }).catch(error => {
        alert(error);
    });
};
