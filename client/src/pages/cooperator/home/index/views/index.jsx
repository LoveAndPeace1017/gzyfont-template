import React, {Component} from 'react';
import {
    Button, message
} from 'antd';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {asyncFetchCooperatorList} from '../actions';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import ReportHd from 'components/business/reportHd';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {InOutAmount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);


export class Index extends ListPage {
    constructor(props) {
        super(props);

        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            condition: {
                startTime: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
                endTime: moment(new Date()).format("YYYY-MM-DD")
            }
        };
    }

    componentDidMount() {
        this.generateReportForm();
    }


    doFilter = (condition, resetFlag, performGenerate) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = {}
        }else {
            params = {
                ...params,
                ...condition,
            }
        }
        this.setState( {
            condition: params
        }, ()=>{
            if (performGenerate) {
                this.generateReportForm(true);
            }
        });
    };

    onPageInputChange = (page) => {
        this.doFilter({page},false,true);
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1},false,true);
    };



    refresh = () => {
        this.refreshReportForm();
    };

    refreshReportForm = () => {
        const param = {...this.state.condition};
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition:param
        });
       /* this.props.asyncFetchFinanceInOutDetailReport(param || {}, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });*/
    };

    generateReportForm = (flag) => {
        const param = {...this.state.condition};
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition:param
        });
        if(flag){
            param.newUrl = true;
        }
        this.props.asyncFetchCooperatorList(param||{}, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
         }});
    };


    render() {
        const {cooperatorList} = this.props;
        console.log(cooperatorList&&cooperatorList.toJS(),'cooperatorList');
        let dataSource = cooperatorList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        const pageRegNum = cooperatorList.getIn(['data', 'pageRegNum']);
        const pagePayAmount = cooperatorList.getIn(['data', 'pagePayAmount']);
        const countRegister = cooperatorList.getIn(['data', 'countRegister']);
        const totalPayMoney = cooperatorList.getIn(['data', 'totalPayMoney']);
        const filterConfigList = [
            {
                label: "cooperator.datatime",
                fieldName: 'time',
                fieldStartKey: 'startTime',
                fieldEndKey: 'endTime',
                visibleFlag: true,
                cannotEdit: true,
                type: 'datePicker',
                defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
            },
            {
                label: "cooperator.registration",
                fieldName: 'registration',
                visibleFlag: true,
                cannotEdit: true,
                type:'select',
                width: 240,
                options:[
                    {label:"仅看有注册的日期",value:"1"},
                ]
            },
            {
                label: "cooperator.payment",
                fieldName: 'payment',
                visibleFlag: true,
                cannotEdit: true,
                type:'select',
                width: 240,
                options:[
                    {label:"仅看有付费的日期",value:"1"},
                ]
            }
        ];
        let tableConfigList = cooperatorList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = cooperatorList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        tableConfigList.forEach((item) => {
            const obj = {
                title: item.label,
                dataIndex: item.fieldName,
                key: item.fieldName,
                width: item.width,
            };
            if (item.fieldName === "datatime") {
                obj.render = (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>)
            }
            tempColumns.push(obj);
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            intervalComponents: [],
            categoryComponents: [],
            projectComponents: [],
            productComponents: [],
            customerComponents: [],
            supplierComponents: [],
            financeComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" onClick={()=>this.generateReportForm(true)}>查询</Button>
            ]
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>

                <div className={cx("content-index-bd-spec")}>
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                        />

                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                       ref={(child) => {
                                           this.filterToolBarHanler = child;
                                       }}
                        />
                    </div>
                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ListTable
                                columns={tempColumns}
                                dataSource={dataSource}
                                loading={this.props.cooperatorList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <div className={cx('footer-spec')}>
                                <div className={cx("amount")}>
                                    <span className={cx("amount-item")}>本页注册数合计：<span className={cx("amount-txt")}>{pageRegNum||0}个</span></span>
                                    <span className={cx("amount-item")}>本页付费金额合计：<span className={cx("amount-txt")}>{pagePayAmount||0}元</span></span>
                                    <span className={cx("amount-item")}>全部注册数合计：<span className={cx("amount-txt")}>{countRegister||0}个</span></span>
                                    <span className={cx("amount-item")}>全部付费金额合计：<span className={cx("amount-txt")}>{totalPayMoney||0}元</span></span>
                                </div>
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className={cx("footer-other")}>
                        合伙人客服热线：025-66775124、13914468382（微信同号）
                        <span className="v-sep">|</span>
                        <a target="_blank" href="https://erp.abiz.com/login">返回百卓优采云进销存首页</a>
                    </h2>
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    cooperatorList: state.getIn(['cooperatorList', 'cooperatorList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCooperatorList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)