import React, {Component} from 'react';
import {Button, message, Modal, Table, Switch} from 'antd';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Tip from 'components/widgets/tip';
import Icon from 'components/widgets/icon';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import { asyncFetchPriceLimitList, asyncModifyPriceLimitStatus} from "../actions";
import intl from 'react-intl-universal';
import {reducer as auxiliaryPriceLimit} from "../index";
const {Column} = Table;

class PriceLimit extends Component{

    toggleEnable = (action)=>{
        let {configKey, configValue,status} = action;
        status = status === 0 ? 1 : 0;
        this.props.asyncModifyPriceLimitStatus({configKey,configValue,status}, (data)=>{
            if(data.retCode === '0'){
                this.props.asyncFetchPriceLimitList();
            }
        });
    };

    componentDidMount() {
        this.props.asyncFetchPriceLimitList();
    }

    render() {
        const {priceLimitList} = this.props;
        const priceLimitListData = priceLimitList.getIn(['data','data']);
        let needReverse = false;
        const dataSource = priceLimitListData && priceLimitListData.map((item, index) => {
            if(index == 0 && item.get('configValue')=='priceupdate_auto'){
                needReverse = true;
            }
            return {
                paramName: item.get('configValue'),
                key: item.get('configValue'),
                action: {
                    configKey: item.get('configKey'),
                    configValue: item.get('configValue'),
                    status: item.get('status'),

                }
            }
        }).toJS();

        return (
            <React.Fragment>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={needReverse?dataSource.reverse():dataSource}
                        pagination={false}
                        loading={priceLimitList.get('isFetching')}
                        className={cx("tb-aux")}
                        scroll={{y: 518}}
                    >
                        <Column
                            title={intl.get("auxiliary.wareLimit.paramName")}
                            dataIndex="paramName"
                            width="85%"
                            render={(paramName) => {
                                if(paramName == 'priceupdate_auto'){
                                   return <React.Fragment>
                                                <span style={{width: "130px",display: "inline-block"}}>价格自动更新</span>
                                                <LegacyIcon type="exclamation-circle" theme={'filled'} style={{marginRight: '6px', color:'#0066DD'}}/>{"开启自动更新，则系统会根据每次销售订单、销售出库单内含税单价更新客户对应物品的销售价格"}
                                           </React.Fragment>
                                }else if(paramName == 'onecus_oneprice'){
                                    return <React.Fragment>
                                                <span style={{width: "130px",display: "inline-block"}}>一客一价</span>
                                                <LegacyIcon type="exclamation-circle" theme={'filled'} style={{marginRight: '6px', color:'#0066DD'}}/>{"开启后物品对应每个客户可设置不同价格，同时客户多级售价不再有效"}
                                           </React.Fragment>
                                }
                            }}
                        />
                        <Column
                            title={intl.get("auxiliary.wareLimit.action")}
                            dataIndex="action"
                            width="15%"
                            align="center"
                            render={(action, record) => (
                                <React.Fragment>
                                    <Switch onChange={()=>this.toggleEnable(action)} checked={action.status!==0} />
                                </React.Fragment>
                            )}
                        />
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        priceLimitList: state.getIn(['auxiliaryPriceLimit', 'auxiliaryPriceLimitList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPriceLimitList,
        asyncModifyPriceLimitStatus,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceLimit)

