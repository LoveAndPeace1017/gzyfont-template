import React, {Component} from 'react';
import {Breadcrumb} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);


/**
 * 在线商城公司全部产品排序
 *
 * @visibleName OrderBy（排序）
 * @author gaozhiyuan
 */
class OrderBy extends Component {

    static propTypes = {
        /** function orderToList 子组件调用父组件的方法，逻辑在于父组件*/
        orderToList: PropTypes.func,
        /** data中包括 {title:排序的名称（依据什么排序）,orderState:{-1表示默认排序，0表示顺时排序，1表示逆时针排序},orderFlag:{用于和后台决定的排序字段}} */
        data: PropTypes.object,
    };


    constructor(props){
        super(props);
    }
    changeOrder = (data) =>{
      this.props.orderToList(data);
    }
    render() {
        const {data} = this.props;
        let infor;
        if(data.orderState == -1){
            infor = (
                <div onClick={()=>this.changeOrder(data)} className={cx("order-block")}>
                    <span>{data.title}</span>
                    <img src="/images/server/orderBy.png"/>
                </div>
            )
        }else if(data.orderState == 0){
            infor = (
                <div onClick={()=>this.changeOrder(data)} className={cx("order-block")}>
                    <span>{data.title}</span>
                    <img src="/images/server/orderByTop.png"/>
                </div>
            )
        }else if(data.orderState == 1){
            infor = (
                <div onClick={()=>this.changeOrder(data)} className={cx("order-block")}>
                    <span>{data.title}</span>
                    <img src="/images/server/orderByBottom.png"/>
                </div>
            )
        }
        return (
            <React.Fragment>
                {infor}
            </React.Fragment>
        )
    }
}

export default OrderBy