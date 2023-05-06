import React, {Component} from 'react';
import Base from "./base";
import { Modal, message  } from 'antd';
import DetailCostShare from 'components/business/detailCostShare';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {formatCurrency, removeCurrency} from 'utils/format';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);

export default function withAllocateCost(WrappedComponent) {
    return class withAllocateCost extends Base {
        constructor(props) {
            super(props);
            this.state = {
                visible: false,
                list: []
            };
        }

        openAllocateCost = (list) => {
            console.log(list, 'list');
            list = list.map((item, index) => {
                item.serial = index+1;
                item.quantity = item.quantity || 0;
                item.allocatedAmount = item.allocatedAmount || 0;
                item.amount = removeCurrency(item.amount) || 0;
                item.makeCost = Number(item.allocatedAmount)- Number(item.amount);
                return item;
            });
            if(!list || list.length===0) {
                message.error('请选择物品!');
                return false;
            }
            this.setState({visible: true, list});
        };

        onOk = (values) => {
            let {setFieldsValue} = this.props.formRef.current;
            let priceDecimalNum = getCookie("priceDecimalNum");

            let totalCost=0, processCost=0, totalAmount=0;
            this.setState({visible: false});
            values.cost.forEach(item => {
                let amount = Number(removeCurrency(item.amount));
                let makeCost = Number(removeCurrency(item.makeCost));
                let allocatedAmount = amount + makeCost;
                let unitCost = fixedDecimal(amount / item.quantity, priceDecimalNum);
                let allocatedPrice = fixedDecimal(allocatedAmount / item.quantity, priceDecimalNum);
                totalCost += amount;
                processCost += makeCost;
                totalAmount += allocatedAmount;
                setFieldsValue({[this.dataPrefix]: {[item.key]: {unitCost, amount: removeCurrency(formatCurrency(amount, 3, true)), allocatedPrice,  allocatedAmount: removeCurrency(formatCurrency(allocatedAmount, 3, true))}}});
            });
            this.props.setTotalCost(totalCost);   // 初始化原料成本
            this.props.setProcessCost(processCost);   // 初始化加工费
            this.props.setTotalAmount(totalAmount);   // 初始化总金额
        };

        onClose = () => {
            this.setState({visible: false});
        };

        render() {
            let {getFieldValue} = this.props.formRef.current;
            let consumeTotalCost = getFieldValue && getFieldValue('consumeTotalCost');

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        openAllocateCost={this.openAllocateCost}
                    />
                    <Modal
                        title={"成本分摊"}
                        visible={this.state.visible}
                        footer={null}
                        onCancel={this.onClose}
                        width={1200}
                        destroyOnClose={true}>
                        <DetailCostShare
                            consumeTotalCost={consumeTotalCost}
                            onOk={this.onOk}
                            list={this.state.list}
                        />
                    </Modal>
                </React.Fragment>
            )
        }
    }
}


