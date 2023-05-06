import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import Icon from 'components/widgets/icon';
import Panel from 'components/business/panel';
import {AddPkgOpen} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import NEW from  '../images/NEW@2x.png';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';

const cx = classNames.bind(styles);

class ShortcutPanel extends Component {
    componentDidMount() {
        // 获取VIP相关信息
        this.props.asyncFetchVipService();
    }

    render() {
        const {vipService} = this.props;
        let dataSource = vipService.getIn(['vipData','data']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let valueAdd = dataSource.VALUE_ADDED || {};  //增值包数据

        return (
            <Panel
                title={intl.get("home.quickWays.title")}
            >
                <ul className={cx("shortcut-lst")}>
                    <li className={cx("item-order")} ga-data="global-add-pruchase">
                        <Link to={"/purchase/add/"}>
                            <span>
                                <Icon type="icon-cart"/>
                            </span>
                            <p>{intl.get("home.quickWays.addPurchaseOrder")}</p>
                        </Link>

                    </li>
                    <li className={cx("item-sale")} ga-data="global-add-sale">
                        <Link to={"/sale/add/"}>
						<span>
							<Icon type="icon-sale"/>
						</span>
                        <p>{intl.get("home.quickWays.addSaleOrder")}</p>
                        </Link>
                    </li>
                    <li className={cx("item-store-in")} ga-data="global-add-inbound">
                        <Link to={"/inventory/inbound/add/"}>
						<span>
							<Icon type="icon-store-in"/>
						</span>
                        <p>{intl.get("home.quickWays.addInboundOrder")}</p>
                        </Link>
                    </li>
                    <li className={cx("item-store-out")} ga-data="global-add-outbound">
                        <Link to={"inventory/outbound/add"}>
						<span>
							<Icon type="icon-store-out"/>
						</span>
                        <p>{intl.get("home.quickWays.addOutboundOrder")}</p>
                        </Link>
                    </li>
                    <li className={cx("item-goods")} ga-data="global-add-goods">
                        <Link to={"/goods/add"}>
						<span>
							<Icon type="icon-goods"/>
						</span>
                        <p>{intl.get("home.quickWays.addGoods")}</p>
                        </Link>
                    </li>
                    <li className={cx("item-supplier")} ga-data="global-add-supplier">
                        <Link to={"/supplier/add"}>
						<span>
							<Icon type="icon-supplier"/>
						</span>
                        <p>{intl.get("home.quickWays.addSupplies")}</p>
                        </Link>
                    </li>

                    <li className={cx("item-serial")} ga-data="global-add-serial">
                        <AddPkgOpen
                                onTryOrOpenCallback={() => {this.props.history.push('/goods/serialNumQuery/')}}
                                openVipSuccess={() => {this.props.history.push('/goods/serialNumQuery/')}}
                                vipInfo={valueAdd}
                                source={'serial'}
                                render={() => (
                                    <React.Fragment>
                                        <span>
                                            <img src={NEW} className={cx('icon-new')}/>
                                            <Icon type="icon-serial"/>
                                        </span>
                                        <p>{intl.get("home.quickWays.serialSearch")}</p>
                                    </React.Fragment>
                                )}
                        />
                    </li>
                </ul>
            </Panel>
        );
    }
}


const mapStateToProps = (state) => ({
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};


export default withRouter(
    connect(mapStateToProps,mapDispatchToProps)(ShortcutPanel)
)
