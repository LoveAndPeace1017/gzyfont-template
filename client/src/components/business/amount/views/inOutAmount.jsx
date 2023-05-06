import {Component} from "react";
import React from "react";
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import {AmountItem} from '../dependencies/amountItem';

/**
 * 四个合计(目前只用于收支明细报表)
 *
 * @visibleName InOutAmount（出入库金额合计）
 * @author guozhaodong
 */
export default class InOutAmount extends Component{

    static propTypes = {
        /** 本页收款合计 */
        pageColAmount: PropTypes.number,
        /** 全部收款合计 */
        totalColAmount: PropTypes.number,
        /** 本页支出合计 */
        pagePayAmount: PropTypes.number,
        /** 全部支出合计 */
        totalPayAmount: PropTypes.number,
        /** 权限对应的模块名称，
         * 如采购列表页需要有采购价格的查看权则module="purchasePrice"，
         * 如入库列表页需要同时具有采购价和销售价的查看权则module=["purchasePrice", "salePrice"]
         **/
        module: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ])
    };

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className={cx("amount")}>
                <AmountItem label={intl.get("components.amount.inOutAmount.label1")} amount={this.props.pageColAmount} {...this.props}/>
                <AmountItem label={intl.get("components.amount.inOutAmount.label2")} amount={this.props.totalColAmount} {...this.props}/>
                <AmountItem label={intl.get("components.amount.inOutAmount.label3")} amount={this.props.pagePayAmount} {...this.props}/>
                <AmountItem label={intl.get("components.amount.inOutAmount.label4")} amount={this.props.totalPayAmount} {...this.props}/>
            </div>
        )
    }
}