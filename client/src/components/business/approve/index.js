import * as actions from './actions';
// import reducer from './reducer';
import SelectApproveItem from './views/selectApproveItem';
import ApproveProcess from './views/approveProcess';
import RejectApprove from './views/rejectApprove';
import withApprove from './dependencies/withApprove';
import {backDisabledStatus, batchBackDisabledStatusForList, batchBackDisabledStatusForDetail, backApproveStatusImg, APPROVE_COLOR_GROUP, BACKEND_TYPES, batchPermitOperate} from './views/data';

export {
    actions,
    // reducer,
    SelectApproveItem,
    ApproveProcess,
    RejectApprove,
    withApprove,
    backDisabledStatus,
    batchBackDisabledStatusForList,
    batchBackDisabledStatusForDetail,
    backApproveStatusImg,
    APPROVE_COLOR_GROUP,
    BACKEND_TYPES,
    batchPermitOperate
};
