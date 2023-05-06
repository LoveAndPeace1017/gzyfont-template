import React, {Component} from 'react';
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
            /** 来源*/
            source: PropTypes.string,
            /** 默认需要展示的物品信息 */
            defaultForm: PropTypes.object,
            /** 获取表单数据 */
            getFormField: PropTypes.func,
            /** 填充当前行数据 */
            setFormField: PropTypes.func,
            /** 设置表单state中的formData中的数据 */
            setFormState: PropTypes.func,
            /** 当某一行的数据发生改变时，通过改方法计算合计 */
            calcTotalForOneRow: PropTypes.func,
            /** 预处理物品数据 */
            preProcessProd: PropTypes.func,
        };

        /** 清除当前行*/
        clearOneRow = (idx, key) => {
            let {getFormField, setFormState, setFormField, calcTotalForOneRow, defaultForm} = this.props;
            let {quantity=0, amount=0} = getFormField(key) || {};
            /** 清楚当前行form中的数据 */
            setFormField(key, null);
            /** 赋初值 */
            setFormField(key, defaultForm);
            /** 计算合计 */
            calcTotalForOneRow && calcTotalForOneRow(_.divide(quantity, -1), _.divide(amount, -1));
            setFormState(idx, null);
        };

        /** 物品编号建议词 以及物品名称建议词 回填物品其它信息*/
        handleProdSuggestSelect = (idx, recordKey, value, good) => {
            if (good) {
                let {setFormState, setFormField, source, defaultForm, preProcessProd} = this.props;
                // 预处理物品数据
                let out = preProcessProd({type: 'goodsSuggest',source, defaultForm, list: good});
                setFormState(idx, out, () => {
                    setFormField(recordKey, out);
                });
            }
        };

        /** 物品编号建议词 以及物品名称建议词 发生变化时*/
        handleProdSuggestChange = (idx, recordKey) => {
            let {getFormField} = this.props;
            const productCode = getFormField(recordKey, 'productCode');
            if (productCode) {
                this.clearOneRow(idx, recordKey);
            }
        };

        render(){
            return <WrappedComponent
                {...this.props}
                clearOneRow={this.clearOneRow}
                handleProdSuggestSelect={this.handleProdSuggestSelect}
                handleProdSuggestChange={this.handleProdSuggestChange}
            />
        }
    }
}

