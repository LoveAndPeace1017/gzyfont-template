import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Drawer, Modal, Toast, PullToRefresh, ListView ,Tabs,Badge} from 'antd-mobile';
import chatPng from '../img/chat.png';
import {formatCurrency} from 'utils/format';
// import initMeScroll from '../source/mescroll-option';

import {actions as contactListAction} from '../index';
import {asyncFetchMockLogin} from '../../inquiry/index/actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {parse} from "url";
import moment from "moment";
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
import {Link} from "react-router-dom";
import Header from 'components/layout/header';
import {getUrlParamValue} from 'utils/urlParam';

const cx = classNames.bind(styles);
const alert = Modal.alert;


export class contactList extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({  //这个dataSource有cloneWithRows方法
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            inbox: dataSource,
            inboxPageSize: 10,
            inboxPageNumber: 1,
            inboxTotal: 10,
            outbox: dataSource,
            outboxPageSize: 10,
            outboxPageNumber: 1,
            outboxTotal: 10,
            open: false,
            drawStatus: false,
            currentCount: 0,
            currentTabIndex: 0,
            prevTabIndex: 0,
            refreshing: true,
            isLoading: true,
            showPop: false,
            initialPage: 0,
            isFirstPage: false
        };
    }


    componentDidMount() {
        //如果是直接通过链接进入，注入cookie信息
        let token = getUrlParamValue('token');
        let userId = getUrlParamValue('userid');
        let userName = getUrlParamValue('username');
        if(userName && userId && token){
            this.props.asyncFetchMockLogin({token, userId, userName});
            this.setState({isFirstPage: true});
        }

        this.props.fetchContactListInfo({userName:userName},(data)=>{
             let lists = data.tab1.values.messages;
             let list2 = data.tab2.values.messages;
             let obj = {};
             let obj1 = {};
             lists.forEach((item,index)=>{
                 obj[index+1] = item;
             });
            list2.forEach((item,index)=>{
                obj1[index+1] = item;
            });
            this.inbox = obj;
            this.outbox = obj1;
            this.setState({inbox:this.state.inbox.cloneWithRows(obj),
                           inboxPageSize: data.tab1.pageSize,
                           inboxPageNumber: data.tab1.pageNumber,
                           inboxTotal: (data.tab1.messageNumber)/1,
                           outbox:this.state.inbox.cloneWithRows(obj1),
                           outboxPageSize:data.tab2.pageSize,
                           outboxPageNumber: data.tab2.pageNumber,
                           outboxTotal: (data.tab2.messageNumber)/1,
                           isLoading: false
            })
        });

    }

    leftClick = () =>{
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "popBack"});
        }else if(window.nativeHandler) {
            window.nativeHandler.popBack && window.nativeHandler.popBack();
        }
    };

    doFilter = (pageNumber,pageSize,type) => {
       console.log(pageNumber,'pageNumber');
       console.log(type,'type');
       this.props.fetchContactListTypeDetail({type:type,pageNumber:pageNumber,pageSize:pageSize},(data)=>{
           let list = data.values.messages;
           let obj = {};
           list.forEach((item,index)=>{
               console.log(index,'index');
               obj[index+1+(pageNumber-1)*pageSize] = item;
           });
           this[type] = { ...this[type], ...obj };
           this.setState({
               [type]:this.state[type].cloneWithRows(this[type]),
               [type+'PageNumber']:pageNumber,
               isLoading: false
           })
       })

    };

    onEndReached  = (e,type) => {
        let pageSize;
        let pageNumber;
        let totalCount;
        if(type == 'inbox'){
            pageSize = this.state.inboxPageSize;
            pageNumber = this.state.inboxPageNumber;
            totalCount = this.state.inboxTotal;
        }else{
            pageSize = this.state.outboxPageSize;
            pageNumber = this.state.outboxPageNumber;
            totalCount = this.state.outboxTotal;
        }
        console.log(pageSize,pageNumber,totalCount);
        let allPage = Math.ceil(totalCount / pageSize);
        if(pageNumber < allPage) {
            this.doFilter(++pageNumber,pageSize,type);
        }else{
            this.setState({isLoading: false})
        }

    };

    onRefresh = () =>{
        this.props.fetchContactListInfo({},(data)=>{
            let lists = data.tab1.values.messages;
            let list2 = data.tab2.values.messages;
            let obj = {};
            let obj1 = {};
            lists.forEach((item,index)=>{
                obj[index+1] = item;
            });
            list2.forEach((item,index)=>{
                obj1[index+1] = item;
            });
            this.inbox = obj;
            this.outbox = obj1;
            this.setState({inbox:this.state.inbox.cloneWithRows(obj),
                inboxPageSize: data.tab1.pageSize,
                inboxPageNumber: data.tab1.pageNumber,
                inboxTotal: (data.tab1.messageNumber)/1,
                outbox:this.state.inbox.cloneWithRows(obj1),
                outboxPageSize:data.tab2.pageSize,
                outboxPageNumber: data.tab2.pageNumber,
                outboxTotal: (data.tab2.messageNumber)/1,
                isLoading: false,
                refreshing: false
            })
        });
    }

    render() {
        const { inbox,outbox,showPop,isFirstPage } = this.state;
        const {isFetching, groupData,contactList} = this.props;
        console.log('contactList',contactList && contactList.toJS());
        let tabFlag = this.props.match.params.page?1:0;
        const row = (rowData, sectionID, rowID) => {
            return (
                <Link to={`${PROD_PATH}/miccn/contact/detail/${rowData.jxcAppFlag}/${rowData.encodeMessageId}`}>
                   <div className={cx('c-bd')} key={rowID}>
                    <div className={cx("contact-tab-l")}>
                        {
                            (rowData.readFlag == '1' || rowData.jxcAppFlag == 'outbox')?(
                                <img src={chatPng} alt="tp"/>
                            ):(
                                <Badge dot>
                                 <img src={chatPng} alt="tp"/>
                                </Badge>
                            )
                        }
                    </div>
                    <div className={cx("contact-tab-r")}>

                        <div className={cx("contact-sub")}>
                            <span className={cx("contact-title")}>
                                {rowData.jxcAppFlag == 'inbox'?rowData.senderCom:rowData.receiverCom}
                            </span>
                            <span className={cx("contact-time")}>
                                {moment(rowData.sendTime.time).format('YYYY-MM-DD')}
                            </span>
                        </div>
                        <p>
                            {rowData.content}
                        </p>
                    </div>
                </div>
                </Link>
            );
        };
        //表格切换
        const tabs = [{title: '收件箱', sub: '1' },{title: '发件箱', sub: '2' }];

        return(
            <React.Fragment>
                <div className={cx('contact-tab')}>
                 <Header navStatus={'contact'} leftClick={isFirstPage ? this.leftClick: null}/>
                    <div className={cx('main-ls')}>
                    <Tabs tabs={tabs}
                      initialPage={tabFlag}
                 >
                    <div className={cx('tab-ls')}>
                        <div className={cx('container')}>
                            <div className={cx('main')}>
                                {
                                    (JSON.stringify(this.inbox) != '{}') ? (
                                        <ListView
                                            ref={el => this.lv = el}
                                            dataSource={inbox}
                                            renderFooter={() => (<div style={{textAlign: 'center' }}>
                                                {this.state.isLoading ? 'Loading...' : '- 没有更多内容啦 -'}
                                            </div>)}
                                            renderRow={row}
                                            useBodyScroll={false}
                                            className="am-list"
                                            pageSize={50}
                                            pullToRefresh={<PullToRefresh
                                                refreshing={this.state.refreshing}
                                                onRefresh = {this.onRefresh}
                                            />}
                                            onScroll={() => {}}
                                            onEndReached={(e)=>this.onEndReached(e,'inbox')}
                                            style={{
                                                height: document.documentElement.clientHeight - 100
                                            }}
                                        >
                                        </ListView>
                                    ) : (
                                        <div className={cx('no-goods')}>
                                            <span className={cx('no-goods-logo')}/>
                                            <span className={cx('no-goods-words')}>没有相关联系信〜</span>
                                        </div>
                                    )
                                }
                        </div>
                      </div>
                    </div>


                    <div className={cx('tab-ls')}>
                        <div className={cx('container')}>
                            <div className={cx('main')}>
                                {
                                    (JSON.stringify(this.outbox) != '{}') ? (
                                        <ListView
                                            ref={el => this.lv = el}
                                            dataSource={outbox}
                                            renderFooter={() => (<div style={{textAlign: 'center' }}>
                                                {this.state.isLoading ? 'Loading...' : '- 没有更多内容啦 -'}
                                            </div>)}
                                            renderRow={row}
                                            useBodyScroll={false}
                                            className="am-list"
                                            pageSize={50}
                                            pullToRefresh={<PullToRefresh
                                                refreshing={this.state.refreshing}
                                                onRefresh = {this.onRefresh}
                                            />}
                                            onScroll={() => {}}
                                            onEndReached={(e)=>this.onEndReached(e,'outbox')}
                                            style={{
                                                height: document.documentElement.clientHeight - 100
                                            }}
                                        >
                                        </ListView>
                                    ) : (
                                        <div className={cx('no-goods')}>
                                            <span className={cx('no-goods-logo')}/>
                                            <span className={cx('no-goods-words')}>没有相关联系信〜</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </Tabs>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    contactList: state.getIn(['contactListReducer', 'contactList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchContactListInfo: contactListAction.fetchContactListInfo,
        fetchContactListTypeDetail: contactListAction.fetchContactListTypeDetail,
        asyncFetchMockLogin
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(contactList)
)

