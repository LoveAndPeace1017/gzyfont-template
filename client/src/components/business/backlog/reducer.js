import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';


const backlogInfo = withAsyncReducer(constant.ASYNC_FETCH_BACKLOG);

export default combineReducers({
    backlogInfo
})