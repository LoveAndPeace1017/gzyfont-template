import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {Tabs, ListView, Modal} from 'antd-mobile';
const alert = Modal.alert;
import Header from 'components/layout/header';

import {asyncOneKeyReSubmit, asyncFetchRepeatProduct} from '../actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatCurrency} from 'utils/format';
import {getUrlParamValue} from 'utils/urlParam';
import {getCookie, setCookie} from "utils/cookie";
import accordionData from './accordionData';
import {NoData, repeatProductListRow, RenderFooter} from './extra';
const {
    genData
} = accordionData;

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
import {reducer as repeatProductReducer} from "../index";
import {Toast} from "antd-mobile/lib/index";

const cx = classNames.bind(styles);

const listData =  new ListView.DataSource({  //这个dataSource有cloneWithRows方法
    rowHasChanged: (row1, row2) => row1 !== row2,
});

export class InquiryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            condition: {},
            repeatProductDataSource: listData,
            isLoading: true,
            clientHeight: document.documentElement.clientHeight,
            isFirstPage: false
        };
    }

    componentDidMount() {
        // let token = getUrlParamValue('token');
        // let userId = getUrlParamValue('userid');
        // let userName = getUrlParamValue('username');
        //
        // let {condition} = this.state;
        // if(token && userId && userName){
        //     this.props.asyncFetchMockLogin({token, userId, userName});
        //     this.setState({isFirstPage: true});
        // }
        // let params = {...condition};
        let params = {};
        this.props.asyncFetchRepeatProduct(params, (data) => {
            console.log(data, 'data.list');
            if(data.retCode === '0'){
                this.repeatProductData = genData(0, data.data.list);
                this.setState({
                    repeatProductDataSource: this.state.repeatProductDataSource.cloneWithRows(this.repeatProductData),
                    isLoading: false
                });
            }
        });
    }


    leftClick = () =>{
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "popBack"});
        }else if(window.nativeHandler) {
            window.nativeHandler.popBack && window.nativeHandler.popBack();
        }
    };

    onEndReached = (e) => {
        let iData = this.props.repeatProductListInfo.get('data').toJS();

        console.log(iData, 'iData');
        let {current, total} = iData.data.pageModel;
        if(current < total - 1) {
            this.doFilter({current: ++current}, false);
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

    doFilter = (condition, resetFlag) => {
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

        this.props.asyncFetchRepeatProduct(params, (data)=>{
            if(data.retCode === '0'){
                let {current} = data.data.pageModel;
                if(current > 1){
                    this.repeatProductData = { ...this.repeatProductData, ...genData(current-1, data.data.list) };
                } else {
                    this.repeatProductData = genData(0, data.data.list);
                }
                this.setState({
                    repeatProductDataSource: this.state.repeatProductDataSource.cloneWithRows(this.repeatProductData),
                    isLoading: false
                }, () => {
                    if(ReactDOM.findDOMNode(this.lv) && current === 1){
                        ReactDOM.findDOMNode(this.lv).scrollTop = 0;
                    }
                });
            }
        });
    };

    oneKeyReSubmit = () => {
        this.props.asyncOneKeyReSubmit({}, (data)=>{
            console.log(data, 'asyncFetchRepeatProduct');
            if(data && data.retCode==='0'){
                Toast.success('重发成功', 1);
                this.doFilter({current: 1});
            }
        });
    };


    render() {
        const { repeatProductDataSource, isLoading, clientHeight, isFirstPage} = this.state;

        return(
            <div className={cx('container')}>
                <Header navStatus={'repeatProduct'} leftClick={isFirstPage ? this.leftClick: null}/>

                <div className={cx('main')}>
                    <div className={cx('tab-content')}>
                        <div className={cx('tip-component')} >
                            <p className={cx('content')}>
                                 通过产品重发功能可更新您在中国制造网内贸站上架的产品；只有“通过审核”的产品才可重发；如果您只需更新产品发布时间， 可使用重发功能；重发产品，无须审核就可以直接发布展示
                            </p>
                        </div>
                        <div className={cx(['lst-component', 'inquiry-lst'])}>
                            {
                                (
                                    (repeatProductDataSource && repeatProductDataSource._cachedRowCount > 0) ? (
                                        <ListView
                                            ref={el => this.lv = el}
                                            dataSource={repeatProductDataSource}
                                            renderFooter={() => RenderFooter(isLoading)}
                                            renderRow={repeatProductListRow}
                                            className="am-list"
                                            pageSize={20}
                                            useBodyScroll={false}
                                            onScroll={() => {}}
                                            onEndReached={(e) => this.onEndReached(e)}
                                            style={{
                                                height: clientHeight - 104
                                            }}
                                        />
                                    ) : <NoData />
                                )
                            }
                        </div>

                        <div className={cx('footer')} onClick={this.oneKeyReSubmit}>
                            一键重发产品
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    repeatProductListInfo: state.getIn(['repeatProductReducer', 'repeatProductListInfo']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchRepeatProduct,
        asyncOneKeyReSubmit
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(InquiryList)
);

