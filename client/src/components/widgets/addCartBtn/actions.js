import axios from 'utils/axios';

export const asyncAddToCart = (type, params, callback) => dispatch => {
    let url = `${BASE_URL}/mobile/cart/oprate/${type}`;
    axios.post(url, params).then(res => {
        callback && callback(res);
    }).catch(error => {
        alert(error);
    })
};
