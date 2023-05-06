import {fromJS} from "immutable";

//actionType后缀
const REQUEST_BEGIN_SUFFIX = 'REQUEST';
const REQUEST_SUCCESS_SUFFIX = 'SUCCESS';
const REQUEST_FAILURE_SUFFIX = 'FAILURE';

/**
 * 异步请求中间件
 * 如果有request的话说明是异步请求
 * */
const simpleAsync = ({dispatch}) => next => action => {
    const {actionTypePrefix, request, callback} = action;
    if (request) {
        dispatch({
            type: actionTypePrefix + '_' + REQUEST_BEGIN_SUFFIX
        });
        return request.then((res) => {
            dispatch({
                type: actionTypePrefix + '_' + REQUEST_SUCCESS_SUFFIX,
                data: fromJS(res.data)
            });
            callback && callback(res.data);
        }).catch((error) => {
            dispatch({
                type: actionTypePrefix + '_' + REQUEST_FAILURE_SUFFIX,
                error
            })
        })
    }
    return next(action);
};

/**
 * 异步请求高阶reducer
 * @params {String}  actionType前缀
 * @params {Function}  自定义的reducer（其它需要处理当前state的reducer）
 * @params {String}  初始state
 * @returns {Function} 返回了一个处理过的高阶reducer函数（其实就是加上异步请求的三种情况）
 * */
export const withAsyncReducer = (actionTypePrefix, wrappedReducer, initialState = fromJS({
    isFetching: false,
    data: ''
})) => (state = initialState, action) => {
    switch (action.type) {
        case actionTypePrefix + '_' + REQUEST_BEGIN_SUFFIX:
            return state.set('isFetching', true);
        case actionTypePrefix + '_' + REQUEST_SUCCESS_SUFFIX:
            return state.set('isFetching', false)
                .set('data', action.data);
        case actionTypePrefix + '_' + REQUEST_FAILURE_SUFFIX:
            return state.set('isFetching', false);
        default:
            if(wrappedReducer) {
                return wrappedReducer(state, action);
            }
            return state;
    }
};

export default simpleAsync;