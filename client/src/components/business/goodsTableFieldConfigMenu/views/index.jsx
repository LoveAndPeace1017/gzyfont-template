import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Drawer, Checkbox, Button
} from 'antd';
import Icon from 'components/widgets/icon';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {is} from 'immutable';
import {addFieldConfig, updateFieldConfig, asyncResetFieldConfig} from '../actions'

const cx = classNames.bind(styles);

class TableFieldConfigMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawVisible: false
        }
    }

    resetFlag=false;

    showDrawer = () => {
        this.setState({
            drawVisible: true
        });
    };
    closeDrawer = () => {
        this.setState({
            drawVisible: false
        });
    };
    setTableList = (e, index, module) => {
        this.props.updateFieldConfig({propName: 'visibleFlag', index, value: e.target.checked?1:0}, module);
    };

    reset = () => {
        this.resetFlag = true;
        this.props.asyncResetFieldConfig(this.props.type, ()=>{
            this.props.refresh();
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.tableConfigList && (!is(nextProps.tableConfigList, this.props.tableConfigList) || !nextProps.goodsTableConfig.get('data') || this.resetFlag)){
            this.resetFlag = false;
            this.props.addFieldConfig(nextProps.tableConfigList);
        }
        if(nextProps.produceTableConfigList && (!is(nextProps.produceTableConfigList, this.props.produceTableConfigList) || !nextProps.goodsTableConfig.get('produceData') || this.resetFlag)){
            this.resetFlag = false;
            this.props.addFieldConfig(nextProps.produceTableConfigList, 'produce');
        }
        if(nextProps.materialTableConfigList && (!is(nextProps.materialTableConfigList, this.props.materialTableConfigList) || !nextProps.goodsTableConfig.get('materialData') || this.resetFlag)){
            this.resetFlag = false;
            this.props.addFieldConfig(nextProps.materialTableConfigList, 'material');
        }
    }

    render() {
        const {goodsTableConfig, fieldConfigTitle, isShowFooter=true} = this.props;

        const configFields = goodsTableConfig.get('data');
        const produceConfigFields = goodsTableConfig.get('produceData');
        const materialConfigFields = goodsTableConfig.get('materialData');

        let tableListStr = configFields && configFields.map((item, index) =>
            (
                item&&item.get('label')?
                <li key={index}>
                    <Checkbox onChange={(e) => this.setTableList(e, index)}
                              checked={item.get('visibleFlag') === 1}>{
                        (item.get('columnName').indexOf('property_value') == -1 && item.get('columnName').indexOf('orderPropertyValue') == -1 && item.get('columnName').indexOf('supplierPropertyValue') == -1 && item.get('columnName').indexOf('salePropertyValue') == -1 && item.get('columnName').indexOf('prodPropertyValue') == -1 && item.get('columnName').indexOf('SupplierPropValue') == -1 && item.get('columnName').indexOf('propertyValue') == -1 && item.get('columnName').indexOf('customerPropValue') == -1 && item.get('columnName').indexOf("enterPropertyValue") == -1 && item.get('columnName').indexOf("outPropertyValue") == -1  && item.get('columnName').indexOf("inStorageProdPropertyValue") == -1 && item.get('columnName').indexOf("outStorageProdPropertyValue") == -1&& item.get('columnName').indexOf("warehouse-") == -1)?intl.get(item.get('label')):item.get('label')

                    }</Checkbox></li>:null
            )
        );

        let produceTableListStr = produceConfigFields && produceConfigFields.map((item, index) =>
            (
                item&&item.get('label')?
                    <li key={index}>
                        <Checkbox onChange={(e) => this.setTableList(e, index, 'produce')}
                                  checked={item.get('visibleFlag') === 1}>{
                            (item.get('columnName').indexOf('property_value') === -1)?intl.get(item.get('label')):item.get('label')

                        }</Checkbox></li>:null
            )
        );

        let materialTableListStr = materialConfigFields && materialConfigFields.map((item, index) =>
            (
                item&&item.get('label')?
                    <li key={index}>
                        <Checkbox onChange={(e) => this.setTableList(e, index, 'material')}
                                  checked={item.get('visibleFlag') === 1}>{
                            (item.get('columnName').indexOf('property_value') === -1)?intl.get(item.get('label')):item.get('label')

                        }</Checkbox></li>:null
            )
        );

        return (
            <React.Fragment>
                <a ga-data="global-field-config"
                    className={cx("right-menu")}
                   onClick={this.showDrawer}><Icon type="icon-config"
                                                   style={{fontSize: '16px'}}/>{fieldConfigTitle || intl.get("components.goodsTableFieldConfigMenu.index.fieldConfig")}</a>
                <Drawer
                    title={<span className={cx("right-menu")}>{intl.get("components.goodsTableFieldConfigMenu.index.chooseDisplayField")}</span>}
                    placement="right"
                    closable={false}
                    onClose={this.closeDrawer}
                    visible={this.state.drawVisible}
                    className={cx("config-wrap")}
                >
                    {
                        tableListStr && (
                            <div className={cx("config-panel")}>
                                <h4>{fieldConfigTitle || intl.get("components.goodsTableFieldConfigMenu.index.goodsListField")}</h4>
                                <ul>
                                    {tableListStr}
                                </ul>
                            </div>
                        )
                    }

                    {
                        produceTableListStr && (
                            <div className={cx("config-panel")}>
                                <h4>生产成品列表</h4>
                                <ul>
                                    {produceTableListStr}
                                </ul>
                            </div>
                        )
                    }

                    {
                        materialTableListStr && (
                            <div className={cx("config-panel")}>
                                <h4>消耗原料列表</h4>
                                <ul>
                                    {materialTableListStr}
                                </ul>
                            </div>
                        )
                    }

                    {
                        isShowFooter && (
                            <div
                                className={cx("config-ope")}
                            >
                                <Button htmlType={'button'} size="large" onClick={this.reset}  className={cx("config-btn-reset")}>{intl.get("components.goodsTableFieldConfigMenu.index.recoverToDefault")}</Button>
                                <Button onClick={this.closeDrawer}  size="large" type="primary" className={cx("config-btn-confirm")}>
                                    {intl.get("components.goodsTableFieldConfigMenu.index.confirm")}
                                </Button>
                            </div>
                        )
                    }
                </Drawer>
            </React.Fragment>
        )
    }
};

const mapStateToProps = (state) => ({
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        addFieldConfig,
        updateFieldConfig,
        asyncResetFieldConfig
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(TableFieldConfigMenu)