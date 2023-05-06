
import axios from 'utils/axios';

const batchUpdateConfig = (prefix,data) => ({
    type: prefix + '_' + 'BATCH_UPDATE_CONFIG',
    data
});

export const asyncBaseBatchUpdateConfig = (prefix,arr,callback) => dispatch => {
    axios.post(`${BASE_URL}/common/field/edit`, {
        voList: arr
    }).then(function (res) {
        dispatch(batchUpdateConfig(prefix,{
            tableConfigs:res.data.listFields,
            filterConfigs:res.data.searchFields,
        }));
        callback&&callback();
    }).catch(error => {
        console.log(error,'field/edit/error');
    });
};
