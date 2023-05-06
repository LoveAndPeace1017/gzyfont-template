import React, {Component} from 'react'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import Tooltip from 'components/widgets/tooltip';
import Panel from 'components/business/panel';
import {formatCurrency} from 'utils/format';
import {asyncFetchStoreGoods, asyncFetchStoreDistributionGoods} from "../actions";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class StorePanel extends Component {

    componentDidMount() {
        this.props.asyncFetchStoreGoods();
        this.props.asyncFetchStoreDistributionGoods();
    }

    render() {
        const {storeGoods, storeDistributionGoods} = this.props;
        let distributionGoodsCount = 0,
            goodsTotalCount = 0;
        const goodsData = storeGoods.getIn(['data', 'retCode']) === '0' && storeGoods.getIn(['data', 'data']);
        const distributionGoodsData = storeDistributionGoods.getIn(['data', 'retCode']) === '0' && storeDistributionGoods.getIn(['data', 'data']);
        if (goodsData) {
            goodsTotalCount = formatCurrency(goodsData, 0, true);
        }
        if (distributionGoodsData) {
            distributionGoodsCount = formatCurrency(distributionGoodsData, 0, true);
        }
        return (
            <Panel
                title="物品数据"
                // extra={<span className="grayLight">数据截止到2019-01-20 08:00</span>}
            >
                <div className={cx("store-data")}>
                    <div className={cx(["store-box", "store-box-price"])}>
                        <div className={cx("pie-wrap")}>
                            <div className={cx("pie-bg")}/>
                            <div className={cx("pie-content")}>
                                <div className={cx("pie-content-inner")}>
                                    <p className={cx("title")}>物品总数</p>
                                    <p className={cx("sum")} title={goodsTotalCount}>{goodsTotalCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx(["store-box", "store-box-num"])}>
                        <div className={cx("pie-wrap")}>
                            <div className={cx("pie-bg")}/>
                            <div className={cx("pie-content")}>
                                {/* <p className={cx("title")}>库存金额
                                    <Tooltip
                                        type="info"
                                        title="点击问号查看库存金额计算方法"
                                    >
                                        <a href="http://www.abiz.com/info/assbus/62689.htm" target="_blank"><Icon type="question-circle" theme="filled" /></a>
                                    </Tooltip>
                                </p>*/}
                                <div className={cx("pie-content-inner")}>
                                    <p className={cx("title")}>上架物品总数</p>
                                    <p className={cx("sum")} title={distributionGoodsCount}>{distributionGoodsCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        );
    }
}

const mapStateToProps = (state) => ({
    storeGoods: state.getIn(['home', 'storeGoods']),
    storeDistributionGoods: state.getIn(['home', 'storeDistributionGoods'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchStoreGoods,
        asyncFetchStoreDistributionGoods
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(StorePanel)
