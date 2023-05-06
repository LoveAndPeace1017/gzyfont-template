import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const lackMaterialList = withAsyncReducer(constant.FETCH_LACK_MATERIAL_LIST);

export default combineReducers({
    lackMaterialList
})

