import React, {Component} from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import Base from './base';
import _ from "lodash";

/**
 * @visibleName WithGoodsSuggest（处理建议词相关功能）
 * @author jinb
 */
export default function withGoodsSuggest(WrappedComponent) {

    return class WithGoodsSuggest extends Base {
        static propTypes = {
            /** 传递给选择物品弹层的参数 */
            goodsPopCondition: PropTypes.object,
            /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
            dataPrefix: PropTypes.string,
            /** 获取表单数据 */
            getFormField: PropTypes.func,
            /** 填充当前行数据 */
            setFormField: PropTypes.func,
            /** 计算总数量 */
            calculateTotalQuantity: PropTypes.func,
        };

        /** 校验建议词所选物品是否与表单中物品重复 */
        validateExistProd = (prodNo) => {
            let flag = true;
            let dataSource = this.props.getFormField();
            _.forIn(dataSource, function (data) {
                // 检验不是bom物品中物品编号相同的物品
                if (!!data && !data.bom && data.prodNo===prodNo){
                    flag = false;
                    return flag;
                }
            });
            return flag;
        };

        /** 物品编号建议词 以及物品名称建议词 回填物品其它信息*/
        handleProdSuggestSelect = (value, good, recordKey) => {
            let newGood = null;
            if (good) {
                let {productCode:prodNo,orderPrice, ...restItem} = good;
                let unitPrice = orderPrice;
                newGood = {prodNo,unitPrice,...restItem};
                // 校验建议词所选物品是否与表单中物品重复
                if(!this.validateExistProd(prodNo)){
                    message.error('存在相同物品');
                    newGood = null;
                }
            }
            console.log(newGood,'newGood');
            this.props.setFormField(recordKey, newGood);
            /** 计算总数量 */
            this.props.calculateTotalQuantity();
        };
        /** 物品编号建议词 以及物品名称建议词 发生变化时*/
        handleProdSuggestChange = (recordKey) => {
            const prodNo = this.props.getFormField(recordKey, 'prodNo');
            if (prodNo) {
                this.props.setFormField(recordKey, null);
                /** 计算总数量 */
                this.props.calculateTotalQuantity();
            }
        };

        render(){
            return <WrappedComponent
                {...this.props}
                handleProdSuggestSelect={this.handleProdSuggestSelect}
                handleProdSuggestChange={this.handleProdSuggestChange}
            />
        }
    }
}

