import axios from 'utils/axios';
import * as constant from './actionsTypes';


export const asyncFetchLackMaterialList = (params) =>({
    actionTypePrefix: constant.FETCH_LACK_MATERIAL_LIST,
    request: axios.post(`${BASE_URL}/fitting/lackMaterial/list`,{...params})
});


