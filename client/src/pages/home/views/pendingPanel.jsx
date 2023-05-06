import React, {Component} from 'react';
import {Spin, Tabs, Button} from 'antd';
import Panel from 'components/business/panel';
import Icon from 'components/widgets/icon';
import ScrollContainer from 'components/widgets/scrollContainer';
import {Link} from 'react-router-dom';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {asyncFetchSaleOrder, asyncFetchPurchaseOrder, asyncSetSaleOrderRead, asyncSetPurchaseOrderRead } from "../actions";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {asyncFetchPreData} from "../../mall/home/actions";
import intl from 'react-intl-universal';
const cx = classNames.bind(styles);

const TabPane = Tabs.TabPane;

class PendingPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'saleTab',
            mallStatus:0
        };
    }

    isRead = false;

    handleTabChange=(activeKey)=> {
        this.setState({
            activeKey
        });
        this.isRead = false;
        if(activeKey === 'saleTab'){
            this.props.asyncFetchSaleOrder();
        } else if(activeKey === 'purchaseTab'){
            this.props.asyncFetchPurchaseOrder();
        }
    };

    setRead=(billType, recId)=>{
        this.isRead = true;
        if(billType === 'sale'){
            // this.setReadBtn.setAttribute('disabled', true);
            this.props.asyncSetSaleOrderRead(recId, ()=>{
                const saleOrderData = this.props.saleOrder.getIn(['data', 'data']);
                // if(saleOrderData<=4){
                    this.props.asyncFetchSaleOrder();
                // }
            });
        }else if(billType === 'purchase'){
            this.props.asyncSetPurchaseOrderRead(recId, ()=>{
                const purchaseOrderData = this.props.purchaseOrder.getIn(['data', 'data']);
                // if(purchaseOrderData<=4) {
                    this.props.asyncFetchPurchaseOrder();
                // }
            });
        }
    };

    componentDidMount() {
        this.props.asyncFetchSaleOrder();
        this.props.asyncFetchPreData((res)=>{
            if(res.retCode== "0"&&res.data.available){
                this.setState({
                    mallStatus:1
                });
            }
        });
    }

    render() {

        const {saleOrder} = this.props;
        let saleLstStr = null;
        if(this.state.mallStatus){
            //销售
            if (!saleOrder.get('isFetching') || this.isRead) {
                if (saleOrder.getIn(['data', 'retCode']) === '0' && saleOrder.getIn(['data', 'data']).size > 0) {
                    const saleOrderData = saleOrder.getIn(['data', 'data']);
                    saleLstStr = (
                        <TransitionGroup component="ul">
                            {
                                saleOrderData && saleOrderData.map(item=>{
                                    const operateType = item.get('operateType');
                                    let itemStr;
                                    if(operateType === 1){
                                        itemStr = <span>{intl.get("home.pendingPanel.reserve")}【{item.get('parterName')}】{intl.get("home.pendingPanel.tip3")}<Link to={`/sale/show/${item.get('billNo')}?source=mall&current=/`}>【{item.get('displayBillNo')}】</Link></span>
                                    }else if(operateType === 3){
                                        itemStr = <span>{intl.get("home.pendingPanel.tip4")}<Link to={`/sale/show/${item.get('billNo')}`}>【{item.get('displayBillNo')}】</Link>{intl.get("home.pendingPanel.tip5")}【${item.get('parterName')}】{intl.get("home.pendingPanel.tip6")}</span>
                                    }
                                    if(itemStr && !item.get('isRead')){
                                        return (
                                            <CSSTransition
                                                key={item.get('recId')}
                                                timeout={300}
                                                classNames="slide-fade"
                                            >
                                                <li>
                                                <span className={cx("title")}>
                                                    {itemStr}
                                                </span>
                                                    <span className={cx("sub-info")}>{moment(item.get('operateTime')).format("YYYY-MM-DD")}</span>
                                                    <a disabled={item.get('setReadIsFetching')}
                                                       href="#!" className={cx("ope")}
                                                        // ref={(obj)=> this.setReadBtn = obj}
                                                       onClick={()=>this.setRead('sale', item.get('recId'))}
                                                    >{intl.get("home.pendingPanel.tip7")}</a>
                                                </li>
                                            </CSSTransition>
                                        )
                                    }else{
                                        return null
                                    }
                                })
                            }
                        </TransitionGroup>
                    )
                }
                else {
                    saleLstStr = (
                        <div className="gb-nodata">
                            <span/><p>{intl.get("home.pendingPanel.noContent")}</p>
                        </div>
                    )
                }
            }
            else if(!this.isRead){
                saleLstStr = (
                    <Spin className="gb-data-loading"/>
                )
            }

        }else{
            saleLstStr = (
                <div className={cx("panel-no-data")}>
                    <p className={cx("tit")}>{intl.get("home.pendingPanel.tip1")}</p>
                    <p className={cx("sub-tit")}>{intl.get("home.pendingPanel.tip2")}</p>
                    <Button type="primary" size="small"><Link to="/mall/">{intl.get("home.pendingPanel.open")}</Link></Button>
                </div>
            )
        }



        return (
            <Panel title={intl.get("home.pendingPanel.title")}
                className={cx("panel-tab-wrap")}
            >
                <ScrollContainer className={cx(["panel-info-lst", "pending-info-lst"])}>
                    {saleLstStr}
                </ScrollContainer>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => ({
    saleOrder: state.getIn(['home', 'saleOrder']),
    purchaseOrder: state.getIn(['home', 'purchaseOrder']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleOrder,
        asyncFetchPurchaseOrder,
        asyncSetSaleOrderRead,
        asyncSetPurchaseOrderRead,
        asyncFetchPreData,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(PendingPanel)
