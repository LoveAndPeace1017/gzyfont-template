import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Drawer, Modal, Toast, PullToRefresh, ListView } from 'antd-mobile';
import Icon from 'components/widgets/icon';
import Header from 'components/layout/header';
import prodImg120 from 'images/prodImg120.png';
import {formatCurrency} from 'utils/format';
// import initMeScroll from '../source/mescroll-option';

import {actions as orderListOrder} from '../index'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {parse} from "url";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";

const cx = classNames.bind(styles);
const alert = Modal.alert;


export class OrderList extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        const searchQuery = parse(props.location.search, true);
        this.state = {
            dataSource,
            allData: [],
            open: false,
            drawStatus: false,
            condition: {
                key: searchQuery.query.key || ''
            },
            searchInput: '',
            isClearBtnShow: false,
            currentCount: 0,
            currentTabIndex: 0,
            prevTabIndex: 0,
            refreshing: true,
            isLoading: true,
            showPop: false
        };
    }


    componentDidMount() {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "showTab"});
        }else if(window.nativeHandler) {
            window.nativeHandler.showTab && window.nativeHandler.showTab();
        }
        var self = this;
        this.props.fetchMobileInfo(parse(this.props.location.search, true).query, function () {
            self.props.asyncFetchCartGroupData();
            self.props.asyncFetchCartListData({}, function () {
                if(self.props.listData){
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.props.listData.toJS()),
                        allData: [...self.props.listData.toJS()]
                    });
                }
                self.setState({
                    refreshing: false,
                    isLoading: false
                })
            });
            self.props.asyncFetchCartCount();
        });
        document.addEventListener('click',this.clearMask,false);
    }

    componentWillUnmount () {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "hideTab"});
        }else if(window.nativeHandler) {
            window.nativeHandler.hideTab && window.nativeHandler.hideTab();
        }
        document.removeEventListener('click',this.clearMask,false);
    }

    clearMask = () => {
        this.setState({showPop: false});
    };

    //加入购物车
    addToCart = (item) => {
        const params = {
            supplierCode: item.supplierCode,
            supplierProductCode: item.supplierProductCode,
            quantity: 1
        };
        let _this = this;
        this.props.asyncAddToCart('add', [params], (res) => {
            if (res.data.retCode === '0') {
                Toast.success('操作成功', 1);
                _this.props.asyncFetchCartCount();
            }
            else {
                Toast.fail(res.data.retMsg, 1);
            }
        })
    };

    onOpenChange = (...args) => {
        this.setState({ open: !this.state.open });
        this.setState({ drawStatus: !this.state.drawStatus, currentTabIndex: this.state.prevTabIndex});
    };

    //改变颜色
    changeSupplierColor = (groupCount, index) => {
        this.setState({
            prevTabIndex: this.state.currentTabIndex,
            currentTabIndex: index
        });
    };

    // 切换分组
    changeGroup = (resetFlag) => {
        this.setState({open: false, drawStatus: false});
        this.doFilter({supplierCode: resetFlag ? this.props.groupData.toJS()[this.state.currentTabIndex].groupCode : '', page: 1});
        if(resetFlag){
            this.props.changeLocalTotalCount(this.props.groupData.toJS()[this.state.currentTabIndex].groupCount);
            this.setState({prevTabIndex: this.state.currentTabIndex});
        } else {
            this.props.changeLocalTotalCount(this.props.groupData.toJS()[0].groupCount);
            this.setState({currentTabIndex: 0, prevTabIndex: 0});
        }
    };

    handleEnter = (e) => {
        let keyNum = (e.keyCode ? e.keyCode : e.which);
        let value = e.target.value;
        if(keyNum === 13 && value.trim().length > 0){
            this.searchWord(value);
            this.setState({showPop: false});
        }
    };

    clearSearchInfo = () => {
        this.setState({isClearBtnShow: false, searchInput: ''});
        this.searchWord('');
    };

    suggestSearch = (val) => {
        this.setState({searchInput: val});
        this.searchWord(val);
    };

    searchWord = (val) => {
        var self = this;
        let encodeValue = encodeURI(val);
        this.doFilter({key: encodeValue, page: 1});
        this.props.asyncFetchCartGroupData({params: {key: encodeValue}}, function () {
            self.props.groupData && self.props.changeLocalTotalCount(self.props.groupData.toJS()[self.state.currentTabIndex].groupCount);
        });
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

        var self = this;
        this.props.asyncFetchCartListData(params, function () {
            self.setState({
                allData: self.props.listData.toJS(),
                dataSource: self.state.dataSource.cloneWithRows(self.props.listData.toJS()),
                refreshing: false,
                isLoading: false
            }, () => {
                if(ReactDOM.findDOMNode(self.lv)){
                    ReactDOM.findDOMNode(self.lv).scrollTop = 0;
                }
            });
        });
    };

    handleChange = (e) => {
        let value = e.target.value;
        let visibleFlag = (value.trim().length > 0);
        this.setState({searchInput: value, isClearBtnShow: visibleFlag});
        var self = this;
        if(visibleFlag){
            this.props.asyncOnSearch({params: {key: encodeURI(value)}}, function (data) {
                self.setState({showPop: (data && data.length > 0)});
            });
        }
    };

    goCartDetail = (item) => {
        this.props.history.push(`${PROD_PATH}/onlineOrder/cartDetail/${item.supplierUserIdEnc}/${item.supplierProductCode}`);
    };

    rightClick = () => {
        this.props.history.push(`${PROD_PATH}/onlineOrder/cartList/`);
    };

    onRefresh = () => {
        // this.setState({ refreshing: true, isLoading: true });
        // // simulate initial Ajax
        // setTimeout(() => {
        //     // this.rData = genData();
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(this.state.dataSource),
        //         refreshing: false,
        //         isLoading: false,
        //     });
        // }, 600);
    };

    onEndReached  = () => {
        let {current, pageSize} = this.props.pagination.toJS();
        let allPage = Math.ceil(this.props.totalCount / pageSize);

        if(current < allPage - 1){
            this.doFilter({page: ++current});

            setTimeout(() => {
                this.setState({
                    allData: [...this.state.allData, ...this.props.listData.toJS()],
                    dataSource: this.state.dataSource.cloneWithRows([...this.state.allData, ...this.props.listData.toJS()]),
                    refreshing: false,
                    isLoading: false
                });
            },600);
        }
    };

    render() {
        const { searchInput, isClearBtnShow, dataSource, currentTabIndex, showPop } = this.state;
        const {isFetching, groupData, listData, suggestData, pagination, totalCount, cartAmount} = this.props;

        const sidebar = (
            <div className={cx('sidebar')}>
                <div className={cx('sidebar-title')}>供应商</div>
                <ul className={cx('sidebar-lst')}>
                    {
                        groupData && groupData.toJS().map((item, index) => {
                            return (
                                <li  key={index} className={cx(['sidebar-item', {'active': currentTabIndex === index}])}
                                     onClick={() => this.changeSupplierColor(item.groupCount, index)}
                                >
                                    {
                                        currentTabIndex === index && (
                                            <Icon type="check-circle" style={{'marginTop': '4px'}}/>
                                        )
                                    }
                                    <span>{item.groupName}</span>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className={cx('sidebar-btn')}>
                    <a href="#!" className={cx('reset')} onClick={() => {this.changeGroup(false)}}>重置</a>
                    <a href="#!" className={cx('confirm')} onClick={() => {this.changeGroup(true)}}>确定</a>
                </div>
            </div>
        );

        const row = (rowData, sectionID, rowID) => {
            return (
                <div className={cx('c-bd')} key={rowID}>
                    <div className={cx('cart-prod-list')}>
                        <div className={cx('cart-item-wrap')}>
                            <a href="#!" className={cx('cart-prod-img')} onClick={() => this.goCartDetail(rowData)}>
                                <img className={cx({'no-img': !rowData.thumbnailUri})} src={rowData.thumbnailUri ? rowData.thumbnailUri : prodImg120} alt={rowData.prodName} />
                            </a>
                            <div className={cx('cart-list')}>
                                <a href="#!" className={cx('cart-prod-name')} onClick={() => this.goCartDetail(rowData)}>{rowData.prodName}</a>
                                <p className={cx('cart-prod-desc')}>{rowData.description}</p>
                                <p className={cx('cart-prod-price')}><span className={cx('red')}>¥{formatCurrency(rowData.salePrice)}</span>/{rowData.unit}</p>
                                <p className={cx('cart-com-name')}>{rowData.supplierName}</p>
                                <span className={cx('circle')} onClick={() => this.addToCart(rowData)}>
                                    <Icon type="shopping-cart" style={{'color': '#40BE7F', 'fontSize': '20px'}}/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return(
            <div className={cx('container')}>
                <Header navStatus={'orderList'} rightClick={this.rightClick}/>

                <div className={cx('main')}>
                    <div className={cx('search-bar')}>
                        <input type="text"
                               value={searchInput}
                               placeholder={'请输入产品名称'}
                               className={cx('search-input')}
                               onChange={this.handleChange}
                               onKeyPress={this.handleEnter}
                        />
                        <p className={cx('search-go-btn')} onClick={() => {this.searchWord(searchInput)}}>搜索</p>
                        <span className={cx('search-filter')}>
						    <Icon type="filter" style={{'fontSize': '16px'}} onClick={() => {this.onOpenChange(true)}}/>
					    </span>
                        {
                            isClearBtnShow && (
                                <span className={cx('search-clear')} onClick={()=>{this.clearSearchInfo()}}>
                                <Icon type="close-circle"/>
                            </span>
                            )
                        }
                        <div className={cx('suggest')} style={{display: showPop ? 'block' : 'none'}}>
                            <ul className={cx('suggest-lst')}>
                                {
                                    suggestData && suggestData.map((item, index) => {
                                        return (
                                            <li key={index} onClick={() => this.suggestSearch(item)}><span>{item}</span></li>
                                        )
                                    })
                                }

                            </ul>
                        </div>
                    </div>

                    <div className={cx('alpha-page')} style={{display: showPop ? 'block' : 'none'}}/>
                    {
                        (listData && listData.count() > 0) ? (
                            <ListView
                                ref={el => this.lv = el}
                                dataSource={dataSource}
                                renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                                    {this.state.isLoading ? 'Loading...' : '- 没有更多内容啦 -'}
                                </div>)}
                                renderRow={row}
                                useBodyScroll={false}
                                className="am-list"
                                pageSize={20}
                                pullToRefresh={<PullToRefresh
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                                onScroll={() => {}}
                                onEndReached={this.onEndReached}
                                style={{
                                    height: document.documentElement.clientHeight - 104
                                }}
                            >
                            </ListView>
                        ) : (
                            <div className={cx('no-goods')}>
                                <span className={cx('no-goods-logo')}/>
                                <span className={cx('no-goods-words')}>没有找到相关物品〜</span>
                            </div>
                        )
                    }

                    <Drawer
                        className="my-drawer"
                        style={{'display': this.state.drawStatus ? 'block' : 'none','position': 'fixed','top': '94px'}}
                        enableDragHandle
                        contentStyle={{ color: '#A6A6A6', textAlign: 'center'}}
                        sidebar={sidebar}
                        open={this.state.open}
                        onOpenChange={this.onOpenChange}
                        position={'right'}
                    >
                        <span style={{'display': 'none'}}>drawer</span>
                    </Drawer>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isFetching: state.getIn(['orderListReducer', 'onlineOrderCartListOrderList', 'isFetching']),
    groupData: state.getIn(['orderListReducer', 'onlineOrderCartListOrderList', 'groupData']),
    listData: state.getIn(['orderListReducer', 'onlineOrderCartListOrderList', 'listData']),
    pagination: state.getIn(['orderListReducer', 'onlineOrderCartListOrderList', 'pagination']),
    totalCount: state.getIn(['orderListReducer', 'onlineOrderCartListOrderList', 'totalCount']),
    cartAmount: state.getIn(['orderListReducer', 'onlineOrderCartListOrderList', 'cartAmount']),
    supplierCode: state.getIn(['orderListReducer', 'onlineOrderCartListOrderList', 'supplierCode']),
    suggestData: state.getIn(['orderListReducer', 'onlineOrderCartListOrderList', 'suggestData'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchMobileInfo: orderListOrder.fetchMobileInfo,
        asyncFetchCartGroupData: orderListOrder.asyncFetchCartGroupData,
        asyncFetchCartListData: orderListOrder.asyncFetchCartListData,
        changeLocalTotalCount: orderListOrder.changeLocalTotalCount,
        asyncAddToCart: orderListOrder.asyncAddToCart,
        asyncFetchCartCount: orderListOrder.asyncFetchCartCount,
        asyncOnSearch: orderListOrder.asyncOnSearch
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OrderList)
)

