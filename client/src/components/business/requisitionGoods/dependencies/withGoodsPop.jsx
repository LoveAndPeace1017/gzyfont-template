import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import Base from './base';
import _ from "lodash";

/**
 * @visibleName WithGoodsPop（物品弹层）
 * @author jinb
 */
export default function withGoodsPop(WrappedComponent) {

    return class WithGoodsPop extends Base {
        static propTypes = {
            /** 传递给选择物品弹层的参数 */
            goodsPopCondition: PropTypes.object,
            /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
            dataPrefix: PropTypes.string,
            /** 填充列表数据 */
            fillList: PropTypes.func,
            /** 填充消耗原料 */
            fillOutGoods: PropTypes.func,
            /** 获取已经存在的列表数据 */
            getExistRows: PropTypes.func
        };

        constructor(props) {
            super(props);
            this.state = {
                goodsPopVisible: false
            }
        }

        setSelectedLineKey =(selectedLineKey)=>{
            this.setState({
                selectedLineKey
            })
        };

        selectGoods = (key) => {
            this.openModal('goodsPopVisible');
            this.setSelectedLineKey(key);
        };

        closeSelectGoods = () => {
            this.closeModal('goodsPopVisible');
            this.setSelectedLineKey('');
        };

        beforeOnOk = (callback)=>{
            if(this.props.beforeOnOk){
                this.props.beforeOnOk(callback);
            }else{
                callback();
            }
        };

        /** 处理物品列表的数据 */
        dealProductList = (selectedRows) => {
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            if(!selectedRows || selectedRows.length===0) return null;
            return selectedRows.map(item => {
                let out = {
                    ...item,
                    prodNo: item.code || item.productCode || item.prodNo,
                    prodCustomNo: item.displayCode || item.prodCustomNo,
                    prodName: item.name || item.prodName,
                    descItem: item.description || item.descItem,
                    unit: item.unit,
                    brand: item.brand,
                    unitPrice: item.orderPrice,
                    produceModel: item.produceModel,
                    remarks: ''
                };
                if(item.bomCode) out.bomCode = item.bomCode;
                if(item.quantity) out.quantity = fixedDecimal(item.quantity || 0, quantityDecimalNum);
                return out;
            });
        };

        onOk = (selectedRows, visibleKey, popType) => {
            this.beforeOnOk(()=>{
                let { fillList } = this.props;
                this.closeModal(visibleKey);
                let prodList = this.dealProductList(selectedRows);
                fillList && fillList(prodList, popType);
            })
        };

        render(){
            let selectedRows = this.props.getExistRows() || [];
            let selectedRowKeys = _.map(selectedRows, item => item.key);

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        selectGoods={this.selectGoods}
                    />
                    <SelectGoodsOrFitting
                        visible={this.state.goodsPopVisible}
                        visibleFlag={'goodsPopVisible'}
                        onOk={this.onOk}
                        onCancel={this.closeSelectGoods}
                        selectType={"checkbox"}
                        popType={"produceGoods"}
                        condition={{
                            ...this.props.goodsPopCondition,
                            billType: this.props.billType,
                            isSellOutBound: this.props.billType === "listForSaleOrder"
                        }}
                        selectedRowKeys={selectedRowKeys}
                        selectedRows={selectedRows}
                    />
                </React.Fragment>
            )
        }
    }

}

