import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

import goodsTable from 'components/business/newGoods';
import CopyFromOrder from 'components/business/copyFromOrder';


class CopyFromOrderTable extends Component {

    onOk = (selectedRows, visibleKey) => {
        this.props.closeCopyModal(visibleKey);
        this.props.fillGoods(selectedRows)
    };

    render() {
        return (
            <CopyFromOrder
                visible={this.props.copyFromOrderVisible}
                visibleFlag={'copyFromOrderVisible'}
                onOk={this.onOk}
                onCancel={() => this.props.closeCopyModal('copyFromOrderVisible')}
                selectType={"radio"}
                popType={'goods'}
                selectedKeys={[this.props.getExistIds()]}
                copySource="scheduling"
            />
        )
    }
}

const Goods = goodsTable(CopyFromOrderTable);

class ProdList extends Component {



    dataPrefix="prod";

    handleInsertGoods = (goodsItem) => {

    };

    render() {

        return (

            <React.Fragment>
                <Goods
                    {...this.props}
                    initGoodsTableData={this.props.initGoodsTableData}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                    //要修改字段提交的名称传下面这个参数修改，value为你需要改的字段名称
                     dataName = {{
                         productCode: 'prodNo',
                         prodCustomNo: 'prodCustomNo',
                         // prodName: 'prodName',
                         // descItem: 'descItem',
                        // proBarCode: 'proBarCode',
                        //  unit: 'unit',
                    //     quantity: 'quantity',
                    //     unitPrice: 'unitPrice',
                    //     amount: 'amount',
                    //     remarks: 'remarks'
                    }}
                    //数量单价金额可单独配置，会覆盖默认的选项，如果不需要可以设置hideRecQuantityColumn hideUnitPriceColumn hideAmountColumn为false
                    quantityColumns = {{
                        title: intl.get("schedule.add.prodList.amount")
                    }}
                    hideAmountColumn = {true}
                    hideTotalAmount={true}
                    goodsOnlySelect
                    onInsertGoods={this.handleInsertGoods} //当一条物品插入表格时候的回调
                    hideUnitPriceColumn
                    hideOtherGoodsColumns
                    hideCustomGoodsColumns
                    hideUntaxedPriceColumn
                    hideUntaxedAmountColumn
                    hideTaxRateColumn
                    hideTaxColumn
                    hideDiscountAmount
                    showQuantityColumns  // 显示基本单位数量
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdList)