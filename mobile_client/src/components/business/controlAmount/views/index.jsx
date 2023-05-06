import React, {Component} from 'react';
import _ from 'lodash';
import {
    Icon
} from 'antd';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);


class ControlQuantity extends  Component {
    constructor(props) {
        super(props);
        this.state = {amount: 1};
    }
    increase = _.throttle(function () {
        this.setState(prevState => ({
            amount: Number(prevState.amount) + 1
        }),() => {
            this.props.onChange && this.props.onChange(this.state.amount);
        });
    }, 500);
    decrease = _.throttle(function () {
        (this.state.amount > 1) &&
        this.setState(prevState => ({
            amount: (Number(prevState.amount) - 1) < 1 ? 1 : (Number(prevState.amount) - 1)
        }),() => {
            this.props.onChange && this.props.onChange(this.state.amount);
        });
    }, 500);
    addMount  = () => {
        this.increase();
    };
    reduceMount  = () => {
       this.decrease();
    };
    changeMount = (e) => {
        this.setState({amount: e.target.value});
    };
    checkMount  = () => {
        let currentAmount = this.state.amount;
        const reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
        let pattern = new RegExp(reg);
        currentAmount = (!pattern.test(currentAmount) || currentAmount < 1) ? 1 : currentAmount;
        this.setState({amount: currentAmount}, () => {
            this.props.onChange && this.props.onChange(this.state.amount);
        });
    };

    componentDidMount () {
        !!this.props.amount && this.setState({amount: this.props.amount})
    }

    // UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
    //     if(nextProps.amount !== this.state.amount){
    //         this.setState({amount: nextProps.amount});
    //     }
    // }

    // static getDerivedStateFromProps(nextProps, state) {
    //     // Should be a controlled component.
    //     if (nextProps.amount && nextProps.amount !== state.amount) {
    //         return {
    //             amount: nextProps.amount
    //         };
    //     }
    //     return null;
    // }

    render() {
        let amount = this.state.amount;
        return (
            <React.Fragment>
                <div className={cx("amount")}>
                   <span className={cx(["amount-minus", {"amount-disabled": amount === 1}])} onClick={this.reduceMount}>
                       <Icon type="minus" style={{fontSize: '12px'}}/>
                   </span>
                    <input type="text" className={cx("txt-amount")} value={amount} maxLength={14} onChange={this.changeMount} onBlur={this.checkMount} />
                    <span className={cx("amount-plus")} onClick={this.addMount} >
                        <Icon type="plus" style={{fontSize: '12px'}}/>
                   </span>
                </div>
            </React.Fragment>
        )
    }
}

export default ControlQuantity