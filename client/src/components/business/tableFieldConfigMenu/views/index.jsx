import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Drawer, Checkbox, Button
} from 'antd';
import Icon from 'components/widgets/icon';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {actions as commonActions} from 'components/business/commonRequest/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const cx = classNames.bind(styles);

class TableFieldConfigMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawVisible: false
        }
    }

    showDrawer = () => {
        this.setState({
            drawVisible: true
        });
    };
    closeDrawer = () => {
        this.setState({
            drawVisible: false
        });
        this.props.batchUpdateConfig();
    };
    filterList = (e, fieldName, index) => {
        this.props.onFilterConfigChange(fieldName, e.target.checked, index);
    };
    setTableList = (e, fieldName, index) => {
        this.props.onTableConfigChange(fieldName, e.target.checked, index);
    };

    reset = () => {
        this.props.asyncResetConfig(this.props.type, () => {
            this.props.refresh();
        });
    };

    render() {
        const {filterList, tableList} = this.props;
        let filterListStr = filterList && filterList.map((item, index) =>
            item.label && (
                <li key={index}
                    style={{display: (item.cannotEdit || item.displayFlag) ? 'none' : 'block'}}
                >
                    <Checkbox onChange={(e) => this.filterList(e, item.fieldName, index)}
                              checked={item.visibleFlag}>{(item.fieldName.indexOf('property_value') !== -1 && item.fieldName!== 'property_value')?item.label: intl.get(item.label)}
                    </Checkbox>
                </li>
            )
        );
        let tableListStr = tableList && tableList.map((item, index) =>
            item.label && (
                <li key={index}
                    style={{display: (item.cannotEdit || item.displayFlag) ? 'none' : 'block'}}
                >
                    <Checkbox onChange={(e) => this.setTableList(e, item.fieldName, index)}
                              checked={item.visibleFlag}>{
                                  (item.fieldName.indexOf('property_value') == -1 && item.fieldName.indexOf('orderPropertyValue') == -1 && item.fieldName.indexOf('supplierPropertyValue') == -1 && item.fieldName.indexOf('salePropertyValue') == -1 && item.fieldName.indexOf('prodPropertyValue') == -1 && item.fieldName.indexOf('SupplierPropValue') == -1 && item.fieldName.indexOf('propertyValue') == -1 && item.fieldName.indexOf('customerPropValue') == -1 && item.fieldName.indexOf("enterPropertyValue") == -1 && item.fieldName.indexOf("outPropertyValue") == -1  && item.fieldName.indexOf("orderProdPropertyValue") == -1 && item.fieldName.indexOf("saleProdPropertyValue") == -1 && item.fieldName.indexOf("inStorageProdPropertyValue") == -1 && item.fieldName.indexOf("outStorageProdPropertyValue") == -1 && item.fieldName.indexOf("purchasePropertyValue") == -1 && item.fieldName.indexOf("salePropertyValue") == -1 && item.fieldName.indexOf("item_property_value") == -1 && item.fieldName.indexOf("warehouse-") == -1)?intl.get(item.label):item.label
                              }</Checkbox></li>
            )
        );

        return (
            <React.Fragment>
                <a ga-data="global-field-config"
                    className={cx("right-menu")} onClick={this.showDrawer}><Icon type="icon-config"
                                                                                style={{fontSize: '16px'}}/>{intl.get("components.tableFieldConfigMenu.index.fieldConfig")}</a>
                <Drawer
                    title={<span className={cx("right-menu")}>{intl.get("components.tableFieldConfigMenu.index.chooseShowField")}</span>}
                    placement="right"
                    closable={false}
                    onClose={this.closeDrawer}
                    visible={this.state.drawVisible}
                    className={cx("config-wrap")}
                >
                    <div className={cx("config-panel")}>
                        <h4>{intl.get("components.tableFieldConfigMenu.index.filterList")}</h4>
                        <ul>
                            {filterListStr}
                        </ul>
                    </div>
                    <div className={cx("config-panel")}>
                        <h4>{intl.get("components.tableFieldConfigMenu.index.listField")}</h4>
                        <ul>
                            {tableListStr}
                        </ul>
                    </div>
                    <div
                        className={cx("config-ope")}
                    >
                        {
                            !this.props.noNeedDefault?
                                <>
                                  <Button htmlType={'button'} size="large" onClick={this.reset} className={cx("config-btn-reset")}>{intl.get("components.tableFieldConfigMenu.index.reset")}</Button>
                                  <Button size="large" onClick={this.closeDrawer} type="primary" className={cx("config-btn-confirm")}>{intl.get("components.tableFieldConfigMenu.index.onOk")}</Button>
                                </>
                                : null
                        }
                    </div>


                </Drawer>
            </React.Fragment>
        )
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncResetConfig: commonActions.asyncResetConfig,
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(TableFieldConfigMenu)