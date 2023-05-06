import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const language = withAsyncReducer(constant.ASYNC_FETCH_LANGUAGE_LIST);

export default combineReducers({
    language
})