import {combineReducers} from 'redux-immutable';
import {fromJS} from "immutable";
import * as constant from './actionsTypes';
import {withAsyncReducer} from 'utils/reduxSimpleAsync';

const customTemplate = withAsyncReducer(constant.FETCH_CUSTOMER_TEMPLATES);


export default combineReducers({
    customTemplate
});


