import { combineReducers } from 'redux-immutable';

import {reducer as homeReducer} from 'pages/home';
import {reducer as orderListReducer} from 'pages/onlineOrder/orderList/index';
import {reducer as cartListReducer} from 'pages/onlineOrder/cartList/index';
import {reducer as cartDetailReducer} from 'pages/onlineOrder/cartDetail/index';
import {reducer as orderConfirmReducer} from "pages/onlineOrder/orderConfirm/index";
import {reducer as orderListNewReducer} from "pages/onlineOrder/newOrderList/index";
import {reducer as orderListCompanyInforReducer} from "pages/onlineOrder/companyIntroduce/index";
import {reducer as orderListCompanyListReducer} from "pages/onlineOrder/companyProduct/index";
import {reducer as inquiryListReducer} from "pages/miccn/inquiry/index/index";
import {reducer as inquiryShowReducer} from "pages/miccn/inquiry/show";
import {reducer as contactListReducer} from 'pages/miccn/contactList/index';
import {reducer as contactInforReducer} from 'pages/miccn/contactDetail/index';
import {reducer as quotationAddReducer} from 'pages/miccn/quotation/add/index';
import {reducer as quotationShowReducer} from "pages/miccn/quotation/show";
import {reducer as repeatProductReducer} from "pages/miccn/repeatProduct/index";

const rootReducer = combineReducers({
    homeReducer,
    orderListReducer,
    cartListReducer,
    cartDetailReducer,
    orderConfirmReducer,
    orderListNewReducer,
    orderListCompanyInforReducer,
    orderListCompanyListReducer,
    inquiryListReducer,
    inquiryShowReducer,
    contactListReducer,
    quotationAddReducer,
    quotationShowReducer,
    contactInforReducer,
    repeatProductReducer
});

export default rootReducer
