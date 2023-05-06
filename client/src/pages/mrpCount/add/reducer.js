import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

//递归
//获取数据中所有的data
function recursion(bomAry,dataAry) {
   for(let i=0;i<bomAry.length;i++){
      let data = bomAry[i].data;
       dataAry.push(data);
       if(bomAry[i].children){
           dataAry = recursion(bomAry[i].children,dataAry);
       }
   }
   return dataAry;
}



//获取下一级Bom数据
const getNextBomData = (
    state = fromJS({
        isFetching: false,
        data: '',
        allBomDate: []
    }),
    action
) => {
    switch (action.type) {
    case constant.GET_NEXT_BOM_DATA_REQUEST:
        return state.set('isFetching', true);
    case constant.GET_NEXT_BOM_DATA_SUCCESS:
        let copyFromSaleId = [];
        let allBomDate = [];
        let dataSource = action.data && action.data.toJS() || [];
        for(let i=0;i<dataSource.data.length;i++){
            copyFromSaleId.push(dataSource.data[i].id);
            //添加默认初始化日期
            dataSource.data[i].requiredDate = moment();
            let obq = {id:dataSource.data[i].id,data:dataSource.data[i]};
            allBomDate.push(obq);
        }
        return state.set('isFetching', false)
            .set('data', fromJS(dataSource)).set('copyFromSaleId',copyFromSaleId).set('allBomDate',allBomDate);
    case constant.GET_NEXT_BOM_UPDATE_TIME:
        let data = action.data;
        let id = data.id;
        let requiredDate = data.requiredDate;
        console.log(requiredDate,'requiredDate');
        let sortBomData1 = state.get('allBomDate');
        for(let z=0;z<sortBomData1.length;z++){
            if(sortBomData1[z].id === id){
                sortBomData1[z].data.requiredDate = requiredDate;
                break;
            }
        }
        let newData = recursion(sortBomData1,[]);
        return state.set('data',fromJS({data:newData,retCode:"0"})).set('allBomDate',sortBomData1);
    case constant.GET_NEXT_BOM_DATA_UPDATE:
        let needUpdateData = action.data.dataSource;
        let bomCode = action.data.bomCode;
        let dayProductivity = action.data.dayProductivity;
        let sortBomData = state.get('allBomDate');
        console.log(sortBomData,'sortBomData');
        //遍历重新处理bom树
        //因为只可能在一个目录下的子集
        if(needUpdateData.length>0){
            let children = [];
            for(let i=0;i<needUpdateData.length;i++){
                let objs = {};
                let getFullIds = needUpdateData[i].id.split('-');
                let nowId = getFullIds[getFullIds.length-1];
                objs.data = needUpdateData[i];
                objs.id = nowId;
                children.push(objs);
            }
            console.log(children,'children');
            //获取父级ids并剔除自己的id
            //拥有共同的父级元素id，取第一个
            let ids = needUpdateData[0].id.split('-');
            ids.pop();
            let findAllDataBom = sortBomData;
            for(let i=0;i<ids.length;i++){
                let takeId = ids[i];
                for(let j=0;j<findAllDataBom.length;j++){
                    //再次处理
                    if(findAllDataBom[j].id === takeId){
                        //当最后一次循环，获取父级
                        i === ids.length-1?(findAllDataBom =  findAllDataBom[j]):(findAllDataBom = findAllDataBom[j].children);
                        break;
                    }
                }
            }
            findAllDataBom.children = children;
            if(!findAllDataBom.data){
                findAllDataBom.data = {};
            }
            findAllDataBom.data.bomCode = bomCode;
            findAllDataBom.data.dayProductivity = dayProductivity;
            findAllDataBom.data.combineBomCode = bomCode+'&*'+dayProductivity;
            console.log(sortBomData,'sortBomData');
            //bom树已经重新渲染，递归boom树，获取所有的data
            let newData = recursion(sortBomData,[]);
            return state.set('data',fromJS({data:newData,retCode:"0"})).set('allBomDate',sortBomData);
        }

    case constant.GET_NEXT_BOM_DATA_FAILURE:
        return state.set('isFetching', false);
    case constant.EMPTY_NEXT_BOM_DATA:
        return state.set('data', fromJS({data:[],retCode:"0"}));
    default:
        return state
    }
};

//新增Mrp运算
const addMrpCount = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_MRP_COUNT_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_MRP_COUNT_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_MRP_COUNT_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//获取页面初始数据
const preData = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
        case constant.FETCH_MRP_COUNT_PRE_DATA_REQUEST:
            return state.set('isFetching', true);
        case constant.FETCH_MRP_COUNT_PRE_DATA_SUCCESS:
            return state.set('isFetching', false)
                .set('data', action.data);
        case constant.FETCH_MRP_COUNT_PRE_DATA_FAILURE:
            return state.set('isFetching', false);
        default:
            return state
    }
};


export default combineReducers({
    getNextBomData,
    addMrpCount,
    preData
})