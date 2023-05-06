import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const auxiliaryDataProgressList = withAsyncReducer(constant.FETCH_DATA_PROGRESS_LIST);

export default combineReducers({
    auxiliaryDataProgressList
})