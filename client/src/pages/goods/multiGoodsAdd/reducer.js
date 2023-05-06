import {fromJS} from "immutable";
import * as constant from "./actionsTypes";
import {combineReducers} from "redux-immutable";


//获取系统编号
const preData = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_PRE_DATA_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_PRE_DATA_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.FETCH_PRE_DATA_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};

//新增物品提交
const addGoods = (
    state = fromJS({
        isFetching: false,
        data: ''
    }),
    action
) => {
    switch (action.type) {
    case constant.ADD_MULTI_GOODS_REQUEST:
        return state.set('isFetching', true);
    case constant.ADD_MULTI_GOODS_SUCCESS:
        return state.set('isFetching', false)
            .set('data', action.data);
    case constant.ADD_MULTI_GOODS_FAILURE:
        return state.set('isFetching', false);
    default:
        return state
    }
};


//根据物品id获取物品信息

//上传图片
const initPicList = [];
for(let i =0;i<6;i++){
    initPicList.push({
        pid: i
    })
}

const goodsInfo = (
    state = fromJS({
        isFetching: false,
        data: '',
        picList: fromJS(initPicList)
    }),
    action
) => {
    switch (action.type) {
    case constant.FETCH_MULTI_GOODS_BY_ID_REQUEST:
        return state.set('isFetching', true);
    case constant.FETCH_MULTI_GOODS_BY_ID_SUCCESS:
        let newState = state.set('isFetching', false)
            .set('data', action.data)
            .update('picList', picList=>{
                return picList.map((pic, index)=>{
                    const image = action.data.getIn(['data', 'images']);
                    if(image && image.get(index)){
                        return pic.set('name', image.getIn([index, 'imageName']))
                            .set('thumbnailUri', image.getIn([index, 'thumbnailUri']))
                            .set('url', image.getIn([index, 'uri']))
                            .set('status', 'done')
                            .set('uid', image.getIn([index, 'recId']))
                            .set('ffsKey', image.getIn([index, 'ffsKey']))
                            .set('id', image.getIn([index, 'id']));
                    }
                    return pic;
                })
            });
        return newState;
    case constant.FETCH_MULTI_GOODS_BY_ID_FAILURE:
        return state.set('isFetching', false);
    case constant.UPLOAD_PIC_CHANGE:
        return state.update('picList', picList=>{
            return picList.map(pic=>{
                let newPic = pic;
                if(pic.get('pid') === action.pid){
                    if(action.file.get('status') === 'done'){
                        const response = action.file.get('response');
                        const data = response.get('data');
                        newPic = pic.set('ffsKey', data && data.get('ffsKey'))
                            .set('url', data && data.get('url'))
                            .set('thumbnailUri', data && data.get('url'))
                            .set('status', 'done');
                    }
                    if(action.file.get('status') === 'removed'){
                       newPic = pic.set('id', '')
                    }
                    return newPic;
                }
                return newPic;
            })
        });
    case constant.DELETE_PIC_CHANGE:
        return state.update('picList', picList=>{
            return picList.map(pic=>{
                if(pic.get('pid') === action.pid){
                    return fromJS({
                        pid: action.pid
                    })
                }
                return pic;
            })
        });
    case constant.EMPTY_UPLOAD_PIC_DATA:
        return state.set('picList',  fromJS(initPicList));
    default:
        return state
    }
};



export default combineReducers({
    preData,
    addGoods,
    goodsInfo
})