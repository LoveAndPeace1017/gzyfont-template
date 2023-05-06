import {fromJS} from "immutable";

//actionType后缀
const BATCH_UPDATE_CONFIG = 'BATCH_UPDATE_CONFIG';
// 用于即时更新列表数据，不向后台发请求
const COMMON_UPDATE_TEMP_CONFIG = 'COMMON_UPDATE_TEMP_CONFIG';

/**
 * 批量更新列表配置高阶reducer
 * @params {String}  actionType前缀
 * @params {Function}  自定义的reducer（其它需要处理当前state的reducer）
 * @params {String}  初始state
 * @returns {Function} 返回了一个处理过的高阶reducer函数（其实就是加上异步请求的三种情况）
 * */
const withBatchUpdateReducer = (actionTypePrefix, wrappedReducer, initialState = fromJS({
    isFetching: false,
    data: '',

})) => (state = initialState, action) => {
    switch (action.type) {
        case actionTypePrefix + '_' + BATCH_UPDATE_CONFIG:
            let  {tableConfigs,filterConfigs} = action.data;
            return state.updateIn(['data','tableConfigList'],function(data){
                console.log(data && data.toJS(),'data');
                console.log(tableConfigs && tableConfigs,'tableConfigs');
                return data.map(function(item,index){
                    //依靠下标对应有问题，只能靠着id匹配（多重循环又会影响性能。。只能先写解决问题）
                    let fieldName = item.get('fieldName');
                    let obj;
                    //因为自定义字段后端传的可能是property_value，也可能是propertyValue
                    //这个接口返回的自定义字段没有办法在node做实时转换，需要在这里进行处理
                    /*if(fieldName.indexOf("propertyValue") !== -1 || fieldName.indexOf("property_value") !== -1){
                        let suffix = fieldName.slice( fieldName.indexOf('propertyValue')!== -1 ? 13 : 14);
                        let propertyAry = ['propertyValue'+suffix,'property_value'+suffix];
                        for(let i=0;i<tableConfigs.length;i++){
                            if(tableConfigs[i]["columnName"] === propertyAry[0] || tableConfigs[i]["columnName"] === propertyAry[1]){
                                obj = tableConfigs[i];
                                break;
                            }
                        }
                    }else{*/
                        for(let i=0;i<tableConfigs.length;i++){
                            if(tableConfigs[i]["columnName"] == fieldName){
                                obj = tableConfigs[i];
                                break;
                            }
                        }
                   /* }*/
                    console.log(obj,'objs');

                    return  item.set('originVisibleFlag',obj.visibleFlag).set('recId',obj.recId);
                });
            });
            //     .updateIn(['data','filterConfigList'],function(data){
            //     return data.map(function(item,index){
            //         console.log('filterConfigs',index);
            //         return  item.set('originVisibleFlag',filterConfigs[index].visibleFlag)
            //             .set('recId',filterConfigs[index].recId);
            //     });
            // });
        case actionTypePrefix + '_' + COMMON_UPDATE_TEMP_CONFIG:
            const {index, propName, value, type} = action.data;
            return state.setIn(['data', type, index, propName], value);
        default:
            if(wrappedReducer) {
                return wrappedReducer(state, action);
            }
            return state;
    }
};

export default withBatchUpdateReducer;

