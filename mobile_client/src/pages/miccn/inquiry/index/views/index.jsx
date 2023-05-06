import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {Tabs, ListView, Modal} from 'antd-mobile';
const alert = Modal.alert;
import Icon from 'components/widgets/icon';
import Header from 'components/layout/header';
import AppDrawer from 'components/business/appDrawer';
import AppSearch from 'components/business/appSearch';
import {Spin} from "antd";

import {asyncFetchInquiryList,  asyncFetchRecommendInquiryList,
    asyncFetchQuotationList, asyncFetchMockLogin} from '../actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatCurrency} from 'utils/format';
import {getUrlParamValue} from 'utils/urlParam';
import {getCookie, setCookie} from "utils/cookie";
import accordionData from './accordionData';
import {NoData, InquiryListRow, RenderFooter, RecommendInquiryListRow, QuotationListRow} from './extra';
const {
    inquiryAccordionData,
    inquiryAccordionDefaultIndexGroup,
    recommendInquiryAccordionData,
    recommendInquiryAccordionDefaultIndexGroup,
    quotationAccordionData,
    quotationAccordionDefaultIndexGroup,
    tabs,
    genData
} = accordionData;

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";

const cx = classNames.bind(styles);

const listData =  new ListView.DataSource({  //这个dataSource有cloneWithRows方法
    rowHasChanged: (row1, row2) => row1 !== row2,
});

export class InquiryList extends Component {
    constructor(props) {
        super(props);
        let inquiryQuotationCondition = getCookie('inquiryQuotationCondition') ? JSON.parse(decodeURI(getCookie('inquiryQuotationCondition'))) : {};

        let condition = inquiryQuotationCondition.condition || {};
        if(condition && condition.word){
            condition.word = decodeURI(inquiryQuotationCondition.condition.word)
        }
        this.state = {
            inquiryDataSource: listData,
            recommendInquiryDataSource: listData,
            quotationDataSource: listData,
            condition: condition,
            initialPage: inquiryQuotationCondition.initialPage || 'inquiry', // 默认的tab页面
            isLoading: true,
            inquiryConditionVisible: false,
            recommendInquiryConditionVisible: false,
            quotationConditionVisible:  false,
            inquiryAccordionIndexGroup: inquiryQuotationCondition.inquiryAccordionIndexGroup || {...inquiryAccordionDefaultIndexGroup},
            recommendInquiryAccordionIndexGroup: inquiryQuotationCondition.recommendInquiryAccordionIndexGroup || {...recommendInquiryAccordionDefaultIndexGroup},
            quotationAccordionIndexGroup: inquiryQuotationCondition.quotationAccordionIndexGroup || {...quotationAccordionDefaultIndexGroup},
            clientHeight: document.documentElement.clientHeight,
            isFirstPage: inquiryQuotationCondition.isFirstPage || false
        };
    }

    componentDidMount() {
        var _this = this;
        let token = getUrlParamValue('token');
        let userId = getUrlParamValue('userid');
        let userName = getUrlParamValue('username');

        let {initialPage: name, condition} = this.state;
        let Bname = name.charAt(0).toUpperCase() + name.slice(1);
        if(token && userId && userName){
            this.props.asyncFetchMockLogin({token, userId, userName});
            this.setState({isFirstPage: true});
        }
        let params = {...condition};
        if(params && params.word) params.word = encodeURI(params.word);
        this.props['asyncFetch'+ Bname +'List'](params, function (data) {
            if(data.retCode === '0'){
                _this[name+'Data'] = genData(0, data.list);
                _this.setState({
                    [name+'DataSource']: _this.state[name+'DataSource'].cloneWithRows(_this[name+'Data']),
                    isLoading: false
                });
            }
        });
    }

    componentWillUnmount() {
        let {condition, initialPage, inquiryAccordionIndexGroup, recommendInquiryAccordionIndexGroup, quotationAccordionIndexGroup, isFirstPage
        } = this.state;
        condition.pageNumber = 1;
        let inquiryQuotationCondition = {
            condition, initialPage, inquiryAccordionIndexGroup, recommendInquiryAccordionIndexGroup, quotationAccordionIndexGroup, isFirstPage
        };
        let inquiryString = JSON.stringify(inquiryQuotationCondition);
        setCookie('inquiryQuotationCondition', encodeURI(inquiryString), 1);
    }

    leftClick = () =>{
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "popBack"});
        }else if(window.nativeHandler) {
            window.nativeHandler.popBack && window.nativeHandler.popBack();
        }
    };

    onEndReached = (event, name) => {
        let iData = this.props[name+'ListInfo'].get('data').toJS();

        let {pageNumber, pageSize, total} = iData.pagination;
        let allPage = Math.ceil(total / pageSize);

        if(pageNumber < allPage - 1) {
            this.doFilter({pageNumber: ++pageNumber}, false, name+'ConditionVisible');
        }
    };

    openModal = (tag)=>{
        this.setState({
            [tag]:true
        })
    };

    closeModal = (tag)=>{
        this.setState({
            [tag]:false
        })
    };

    changeStatus = (tag, flag) => {
        flag ? this.openModal(tag) : this.closeModal(tag);
    };

    doFilter = (condition, resetFlag, visibleFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = condition;
        }
        else {
            params = {
                ...params,
                ...condition
            }
        }
        this.setState({
            condition: params
        });

        var _this = this;
        let name = visibleFlag.slice(0, -16);
        let Bname = name.charAt(0).toUpperCase() + name.slice(1);

        let newParams = {...params};
        if(newParams && newParams.word) newParams.word = encodeURI(newParams.word);

        this.props['asyncFetch'+ Bname +'List'](newParams, function (data) {
            if(data.retCode === '0'){
                let {pageNumber} = data.pagination;
                if(pageNumber > 1){
                    _this[name+'Data'] = { ..._this[name+'Data'], ...genData(pageNumber-1, data.list) };
                } else {
                    _this[name+'Data'] = genData(0, data.list);
                }
                _this.setState({
                    [name+'DataSource']: _this.state[name+'DataSource'].cloneWithRows(_this[name+'Data']),
                    isLoading: false
                }, () => {
                    if(ReactDOM.findDOMNode(_this[name+'Lv']) && pageNumber === 1){
                        ReactDOM.findDOMNode(_this[name+'Lv']).scrollTop = 0;
                    }
                });
            }
        });
    };

    reset = (visibleFlag) => {
        let params = {};
        let name = visibleFlag.slice(0, -16);
        let accordionDefaultIndexGroup =  accordionData[name + 'AccordionDefaultIndexGroup'];

        Object.keys(accordionDefaultIndexGroup).forEach(function (key) {
            params[key] = '';
        });
        this.doFilter({pageNumber: 1 ,...params}, false, visibleFlag);
        this.changeStatus(visibleFlag, false);
        this.setState({[name+ 'AccordionIndexGroup'] : {...accordionDefaultIndexGroup}});
    };

    confirm = (visibleFlag, accordionIndexGroup) => {
        let params = {};
        let name = visibleFlag.slice(0, -16);
        Object.keys(accordionIndexGroup).forEach(function (key) {
            if(accordionIndexGroup[key] >= 0) {
                params[key] =  accordionData[name + 'AccordionData'][key].subData[accordionIndexGroup[key]].value;
            }
        });
        this.doFilter({pageNumber: 1 ,...params}, false, visibleFlag);
        this.changeStatus(visibleFlag, false);
        this.setState({[name+ 'AccordionIndexGroup']: {...accordionIndexGroup}});
    };

    tabClick = (tab) => {
        var _this = this;
        let name = tab.name;
        let Bname = name.charAt(0).toUpperCase() + name.slice(1);
        if(!this[name+'Data']){
            this.props['asyncFetch'+ Bname +'List']({}, function (data) {
                if(data.retCode === '0'){
                    _this[name+'Data'] = genData(0, data.list);
                    _this.setState({
                        [name+'DataSource']: _this.state[name+'DataSource'].cloneWithRows(_this[name+'Data']),
                        isLoading: false,
                        initialPage: name
                    });
                }
            });
        }
    };

    doSearch = (val) => {
        this.doFilter({word: val, pageNumber: 1}, false, 'inquiryConditionVisible');
    };

    render() {
        const { inquiryDataSource, inquiryConditionVisible, inquiryAccordionIndexGroup,
            recommendInquiryDataSource, recommendInquiryConditionVisible,recommendInquiryAccordionIndexGroup,
            quotationDataSource,quotationConditionVisible, quotationAccordionIndexGroup,
            isLoading, clientHeight, isFirstPage, condition, initialPage
        } = this.state;

        let word = (condition && condition.word) ? condition.word : '';
        const {inquiryListInfo, recommendInquiryListInfo, quotationListInfo} = this.props;

        return(
            <div className={cx('container')}>
                <Header navStatus={'inquiry'} leftClick={isFirstPage ? this.leftClick: null}/>

                <div className={cx('main')}>
                    <Tabs tabs={tabs}
                          initialPage={initialPage}
                          onTabClick={(tab) => this.tabClick(tab)}
                    >
                        <div className={cx('tab-content')} key={'inquiry'}>
                            <div className={cx('search-component')} >
                                <AppSearch
                                    word={word}
                                    doSearch={this.doSearch}
                                    changeStatus={() => this.changeStatus('inquiryConditionVisible', true)}
                                    placeholder={"询价标题/物品名称"}
                                />
                            </div>
                            <div className={cx(['total-component', 'inquiry-total'])}>共找到 <span className="red">{inquiryListInfo.getIn(['data', 'pagination', 'total']) || 0}</span> 条询价信息
                            </div>
                            <div className={cx(['lst-component', 'inquiry-lst'])}>
                                {
                                        (
                                            (inquiryDataSource && inquiryDataSource._cachedRowCount > 0) ? (
                                                <ListView
                                                    ref={el => this.inquiryLv = el}
                                                    dataSource={inquiryDataSource}
                                                    renderFooter={() => RenderFooter(isLoading)}
                                                    renderRow={InquiryListRow}
                                                    className="am-list"
                                                    pageSize={50}
                                                    useBodyScroll={false}
                                                    onScroll={() => {}}
                                                    onEndReached={(e) => this.onEndReached(e, 'inquiry')}
                                                    style={{
                                                        height: clientHeight - 104
                                                    }}
                                                />
                                            ) : <NoData />
                                        )
                                }
                            </div>
                        </div>
                        <div className={cx('tab-content')} key={'recommendInquiry'}>
                            <div className={cx('total-component')}>
                                共找到 <span className="red">{recommendInquiryListInfo.getIn(['data', 'pagination', 'total']) || 0}</span> 条询价信息
                                <span className={cx('total-filter')}>
                                    <Icon type="icon-filter" style={{'fontSize': '16px'}} onClick={() => {this.changeStatus('recommendInquiryConditionVisible', true)}}/>
                                </span>
                            </div>

                            <div className={cx('lst-component')} style={{display:'block'}}>
                                {
                                        (
                                            (recommendInquiryDataSource && recommendInquiryDataSource._cachedRowCount > 0) ? (
                                                <ListView
                                                    ref={el => this.recommendInquiryLv = el}
                                                    dataSource={recommendInquiryDataSource}
                                                    renderFooter={() => RenderFooter(isLoading)}
                                                    renderRow={RecommendInquiryListRow}
                                                    className="am-list"
                                                    pageSize={50}
                                                    useBodyScroll={false}
                                                    onScroll={() => {}}
                                                    onEndReached={(e) => this.onEndReached(e, 'recommendInquiry')}
                                                    style={{
                                                        height: clientHeight - 79.5
                                                    }}
                                                />
                                            ) : <NoData />
                                        )
                                }
                            </div>
                        </div>
                        <div className={cx('tab-content')} key={'quotation'}>
                            <div className={cx('total-component')}>
                                共找到 <span className="red">{quotationListInfo.getIn(['data', 'pagination', 'total']) || 0}</span> 条报价信息
                                <span className={cx('total-filter')}>
                                    <Icon type="icon-filter" style={{'fontSize': '16px'}} onClick={() => {this.changeStatus('quotationConditionVisible', true)}}/>
                                </span>
                            </div>
                            <div className={cx('lst-component')}>
                                {
                                        (
                                            (quotationDataSource && quotationDataSource._cachedRowCount > 0) ? (
                                                <ListView
                                                    ref={el => this.quotationLv = el}
                                                    dataSource={quotationDataSource}
                                                    renderFooter={() => RenderFooter(isLoading)}
                                                    renderRow={QuotationListRow}
                                                    className="am-list"
                                                    pageSize={50}
                                                    useBodyScroll={false}
                                                    onScroll={() => {
                                                    }}
                                                    onEndReached={(e) => this.onEndReached(e, 'quotation')}
                                                    style={{
                                                        height: clientHeight - 79.5
                                                    }}
                                                />
                                            ) : <NoData/>
                                        )
                                }
                            </div>
                        </div>
                    </Tabs>
                </div>
                <AppDrawer
                    title={"筛选"}
                    accordionData={inquiryAccordionData}
                    accordionIndexGroup={inquiryAccordionIndexGroup}
                    open={inquiryConditionVisible}
                    visibleFlag={"inquiryConditionVisible"}
                    changeStatus={this.changeStatus}
                    reset={this.reset}
                    confirm={this.confirm}
                />
                <AppDrawer
                    title={"筛选"}
                    accordionData={recommendInquiryAccordionData}
                    accordionIndexGroup={recommendInquiryAccordionIndexGroup}
                    open={recommendInquiryConditionVisible}
                    visibleFlag={"recommendInquiryConditionVisible"}
                    changeStatus={this.changeStatus}
                    reset={this.reset}
                    confirm={this.confirm}
                />
                <AppDrawer
                    title={"筛选"}
                    accordionData={quotationAccordionData}
                    accordionIndexGroup={quotationAccordionIndexGroup}
                    open={quotationConditionVisible}
                    visibleFlag={"quotationConditionVisible"}
                    changeStatus={this.changeStatus}
                    reset={this.reset}
                    confirm={this.confirm}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    inquiryListInfo: state.getIn(['inquiryListReducer', 'inquiryListInfo']),
    recommendInquiryListInfo: state.getIn(['inquiryListReducer', 'recommendInquiryListInfo']),
    quotationListInfo: state.getIn(['inquiryListReducer', 'quotationListInfo']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInquiryList,
        asyncFetchRecommendInquiryList,
        asyncFetchQuotationList,
        asyncFetchMockLogin,
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(InquiryList)
);

