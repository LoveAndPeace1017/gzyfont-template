import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import Base from './base';
import SelectGoodsOrFitting from 'components/business/goodsPop';

/**
 * @visibleName WithGoodsPop（物品弹层）
 * @author jinb
 */
export default function withGoodsPop(WrappedComponent) {

    return class WithGoodsPop extends Base {
        static propTypes = {
            /** 传递给选择物品弹层的参数 */
            goodsPopCondition: PropTypes.object,
            /** 默认需要展示的物品信息 */
            defaultForm: PropTypes.object,
            /** 填充列表数据 */
            fillList: PropTypes.func,
            /** 获取已经存在的列表数据 */
            getExistRows: PropTypes.func,
            /** 计算合计 */
            calcTotal: PropTypes.func,
            /** 预处理物品数据 */
            preProcessProd: PropTypes.func,
            /** 来源*/
            source: PropTypes.string,
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

        onOk = (selectedRows, visibleKey, popType, bomSelectRows, callback) => {
            this.beforeOnOk(()=>{
                let { source, defaultForm, fillList, preProcessProd, calcTotal } = this.props;
                this.closeModal(visibleKey);
                // 预处理物品数据
                let prodList = preProcessProd({type: 'goodsPop',source, defaultForm, lists: selectedRows});
                fillList && fillList(prodList, popType, () => {
                    // 计算合计
                    calcTotal && calcTotal();
                    callback && callback()
                });
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

