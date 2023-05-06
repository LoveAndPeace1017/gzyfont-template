import React from "react";
import {formatCurrency} from 'utils/format';
import authComponent from  'utils/authComponent';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const AmountNumber = (props) => {
    return props.amount !== undefined?(
        <span className={cx("amount-txt")}>
            {
                formatCurrency(props.amount)
            }
        </span>
    ): null
};

const AuthAmountNumber = authComponent(AmountNumber);

export const AmountItem = (props) => {
    return (
        <span className={cx("amount-item")}>
            {props.label}：{
                props.module ? (<AuthAmountNumber {...props} option="show" noAuthRender="**"/>) : (
                <AmountNumber amount={props.amount}/>)
            }
   </span>
    )
};