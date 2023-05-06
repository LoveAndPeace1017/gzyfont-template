import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatCurrency, removeCurrency} from 'utils/format';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

import goodsTable from 'components/business/subcontractGoods';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

const Goods = goodsTable();

class ProdList extends Component {
    dataPrefix = "enterProdList";

    render() {
        return (
            <React.Fragment>
                <Goods
                    {...this.props}
                    fieldConfigType={"outsource_product"}
                    initGoodsTableData={this.props.initGoodsTableData}
                    dataPrefix={this.dataPrefix} //提交的数据的对象名称
                    prodType={"preform"}  // 消耗原料列表 区分reducer
                    showBatchLeftColumns
                    fittingfillGoods={this.props.fittingFillGoods}
                    dataName={{productCode: 'prodNo'}}
                    quantityColumns={{title: "入库数量"}}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    goodsInfo: state.getIn(['goods', 'goodsInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdList)