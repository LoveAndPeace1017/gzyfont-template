import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {message, Modal} from 'antd';
import Icon from 'components/widgets/icon';
import IntlTranslation from 'utils/IntlTranslation';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {asyncCheckWareArriveUpperLimit} from "../actions";
const cx = classNames.bind(styles);

const map = {
    'purchase': {
       '1': {
           title: <IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.warningTip"/>,
           icon: <ExclamationCircleOutlined/>,
           content: (<div><IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.purchaseContent1"/></div>),
           okCallback: ''
       }
    },
    'sale': {
       '1': {
           title: <IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.warningTip"/>,
           icon: <ExclamationCircleOutlined/>,
           content: (<div><IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.saleContent1"/></div>),
           okCallback: ''
       },
        '2': {
            title: <IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.warningTip"/>,
            icon: <ExclamationCircleOutlined/>,
            content: (<div><IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.saleContent2"/></div>),
            modalType: 'info',
            okCallback: ''
        }
    },
    'inbound': {
        '1': {
           title: <IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.warningTip"/>,
           icon:<ExclamationCircleOutlined/>,
           content: (<div><IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.inboundContent1"/></div>),
           okCallback: ''
       },
    },
    'outbound': {
        '1': {
            title: <IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.warningTip"/>,
            icon: <ExclamationCircleOutlined/>,
            content: (<div>以下物品出库后存在负库存，确认出库么？</div>),
            okCallback: ''
        },
        '2': {
            title: <IntlTranslation intlKey="components.checkWareArriveUpperLimit.index.warningTip"/>,
            icon: <ExclamationCircleOutlined/>,
            content: (<div>以下物品出库后存在负库存，无法保存！</div>),
            modalType: 'info',
            okCallback: ''
        }
    }
};

const popModal = ({title, content, icon, theme, modalType, okCallback, cancelCallback}) => {
    const _this = this;
    modalType = modalType || 'confirm';
    Modal[modalType]({
        icon,
        title: title,
        content: content,
        onOk() {
            okCallback && okCallback.call(null, _this);
        },
        onCancel() {
            cancelCallback && cancelCallback.call(null, _this);
        },
    })
};


/***
 *  通用
 * 处理校验超过库存上限接口所需数据
 * @param prodList   物品列表
 * @param warehouseName  仓库名称
 */
export const dealCheckWareUpperLimitData = (billNo, prodList, warehouseName, source) => {
    let out = {};
    out.prodList = prodList.filter(item => (item && (item.prodNo || item.productCode))).map(item => {
        return {productCode: item.prodNo || item.productCode, quantity: item.quantity}
    });
    out.billNo = billNo;
    out.warehouseName = warehouseName;
    out.source = source;
    return out;
};


/***
 *  只针对于快捷入库
 * 处理校验超过库存上限接口所需数据
 * @param prodList   物品列表
 * @param warehouseName  仓库名称
 */
export const dealCheckWareUpperLimitDataForQuickEnter = (prodList, warehouseName, source) => {
    let out = {};
    out.prodList = prodList.map(item => {
        return {productCode: item.productCode, quantity: item.unEntNum}
    });
    out.warehouseName = warehouseName;
    out.source = source;
    return out;
};


/***
 *  只针对于快捷出库
 * 处理校验超过库存上限接口所需数据
 * @param prodList   物品列表
 * @param warehouseName  仓库名称
 */
export const dealCheckWareUpperLimitDataForQuickOut = (prodList, warehouseName, source) => {
    let out = {};
    out.prodList = prodList.map(item => {
        return {productCode: item.productCode, quantity: item.unOutNum}
    });
    out.warehouseName = warehouseName;
    out.source = source;
    return out;
};

/***
 *  校验当前提交物品是否达到仓库上限
 *  新建提交时调用
 * @param result
 * @param callback
 */
export const checkWareArriveUpperLimit = (result, source, okCallback, cancelCallback) => {
    // data 为 0代表正常操作  1 允许超卖  2 不允许超卖
    //如果是出库上限操作，返回的数据变化
    if(source === 'outbound'){
        if(result.data === 1 || result.data === 2){
            let state = result.data;
            let {title, content,icon, modalType} = map[source][state];
            let prodList = result.prodList;
            let prodListDom;
            if(prodList && prodList.length>0){
                prodListDom = <div>
                    {
                        content
                    }
                    <ul>
                        {
                            prodList.map((item, index)=>{
                                return <li key={index}>{item.prodCustomNo}<span style={{marginLeft: "15px"}}>{item.prodName}</span></li>
                            })
                        }
                    </ul>
                </div>;
                content = prodListDom;
            }
            popModal({title, content,icon, modalType, okCallback, cancelCallback});
        }else{
            okCallback();
        }

    }else{

        if(result === 1 || result === 2){
            let {title, content,icon, modalType} = map[source][result];
            popModal({title, content,icon, modalType, okCallback, cancelCallback});
        } else {
            okCallback();
        }

    }

};

/**
 * 校验当前提交物品是否达到仓库上限
 *  如审批按钮使用
 * @visibleName checkWareArriveUpperLimit
 * @author jinbo
 */
class CheckWareArriveUpperLimit extends Component {
    checkArriveUpperLimit = () => {
        let {params, callback}  = this.props;
        // data 为 1 达到仓库上限  2 为超卖
        this.props.asyncCheckWareArriveUpperLimit(params, (result) => {
            let isOutBoundFlag = (params.source === 'outbound');
            if(isOutBoundFlag?(result.data === 1 || result.data === 2):(result === 1 || result === 2)){
                let {title, content,icon, modalType, okCallback} = map[params.source][isOutBoundFlag?result.data:result];
                if(isOutBoundFlag?(result.data === 1):(result === 1)) {
                    okCallback = callback;  // 1 表示达到仓库上限 允许提交表单
                }
                if(isOutBoundFlag){
                    content = <div>
                        {content}
                        <ul>
                            {
                                result.prodList && result.prodList.length>0 && result.prodList.map((item, index)=>{
                                    return <li key={index}>{item.prodCustomNo}<span style={{marginLeft: "15px"}}>{item.prodName}</span></li>
                                })
                            }
                        </ul>
                    </div>
                }
                popModal({title, content,icon, modalType, okCallback});
            } else {
                callback();
            }
        });
    };

    render() {
        return (
            <div onClick={() => this.checkArriveUpperLimit()} style={{'display': 'inline-block'}}>
                {this.props.render(this)}
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncCheckWareArriveUpperLimit
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(CheckWareArriveUpperLimit);





