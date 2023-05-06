import axios from 'utils/axios';
import * as constant from "./actionsTypes";

export const asyncFetchQuotationDetail=(quotationId, callback)=>({
    actionTypePrefix: constant.FETCH_QUOTATION_DETAIL,
    request: axios.get(`${BASE_URL}/mobile/miccn/quotation/inquiry/quotation/${quotationId}`),
    callback
});


