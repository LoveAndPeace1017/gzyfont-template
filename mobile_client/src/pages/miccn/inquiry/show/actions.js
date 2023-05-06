import axios from 'utils/axios';
import * as constant from "./actionsTypes";

export const asyncFetchInquiryDetail=(logonUserName, inquiryId, callback)=>({
    actionTypePrefix: constant.FETCH_INQUIRY_DETAIL,
    request: axios.get(`${BASE_URL}/mobile/miccn/inquiry/list/before/detail/${logonUserName}/${inquiryId}`),
    callback
});


