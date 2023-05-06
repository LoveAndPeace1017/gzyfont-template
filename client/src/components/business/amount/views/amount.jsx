import React, {Component} from 'react';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import {AmountItem} from '../dependencies/amountItem';



/**
 * 列表页下方金额本页合计和全部合计（收支明细）
 *
 * @visibleName Amount（金额合计）
 * @author guozhaodong
 */
export default class Amount extends Component{

    static propTypes = {
        /** 本页合计金额 */
        pageAmount: PropTypes.number,
        /** 全部合计金额 */
        totalAmount: PropTypes.number,
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
                <AmountItem label={intl.get("components.amount.amount.label1")} amount={this.props.pageAmount} {...this.props}/>
                <AmountItem label={intl.get("components.amount.amount.label2")} amount={this.props.totalAmount} {...this.props}/>
            </div>
        )
    }
}

