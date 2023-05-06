import React, {Component} from 'react';
import intl from 'react-intl-universal';
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import {AttributeInfo} from 'components/business/attributeBlock';
import {formatCurrency, removeCurrency} from 'utils/format';
import {getYmd} from 'utils/format';
import {detailPage} from  'components/layout/listPage';
import moment from 'moment-timezone';
import {Modal, Tabs} from 'antd';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {connect} from "react-redux";
const cx = classNames.bind(styles);
import {withRouter} from "react-router-dom";
const {TabPane} = Tabs;

import SimulatedProductionRecord from '../dependencies/simulatedProductionRecord';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }


    render() {

        let id = this.props.match.params.id;

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            title: "MRP运算"
                        },
                        {
                            url: '/productControl/mrpCount/list',
                            title: "模拟生产列表"
                        },
                        {
                            title: "详情页"
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <React.Fragment>
                        <div className={cx("mrp-detail")}>
                            <Tabs defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'t1'}>
                                <TabPane
                                    tab={"模拟生产"}
                                    key="simulatedProduction"
                                >
                                    <SimulatedProductionRecord id={id} type={"simulatedProduction"}/>
                                </TabPane>
                                <TabPane
                                    tab={"采购建议"}
                                    key="purchaseProposal"
                                >
                                    <SimulatedProductionRecord id={id} type={"purchaseProposal"}/>
                                </TabPane>
                                <TabPane
                                    tab={"生产建议"}
                                    key="productionSuggest"
                                >
                                    <SimulatedProductionRecord id={id} type={"productionSuggest"}/>
                                </TabPane>
                                <TabPane
                                    tab={"采购记录"}
                                    key="purchaseRecord"
                                >
                                    <SimulatedProductionRecord id={id} type={"purchaseRecord"}/>
                                </TabPane>
                                <TabPane
                                    tab={"生产记录"}
                                    key="productionRecord"
                                >
                                    <SimulatedProductionRecord id={id} type={"productionRecord"}/>
                                </TabPane>
                            </Tabs>
                        </div>
                    </React.Fragment>
                </Content.ContentBd>

            </React.Fragment>
        )
    }
}


export default withRouter(connect(null, null)(Index))

