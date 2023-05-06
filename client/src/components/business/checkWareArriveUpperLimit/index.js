import * as actions from './actions';
import reducer from './reducer';
import view from './views/index';
import {
    checkWareArriveUpperLimit,
    dealCheckWareUpperLimitData,
    dealCheckWareUpperLimitDataForQuickEnter,
    dealCheckWareUpperLimitDataForQuickOut
} from './views/index';

export {
    actions,
    reducer,
    checkWareArriveUpperLimit,
    dealCheckWareUpperLimitData,
    dealCheckWareUpperLimitDataForQuickEnter,
    dealCheckWareUpperLimitDataForQuickOut
};
export default view;

