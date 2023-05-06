import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Drawer, Spin, Tabs} from 'antd';
import Icon from 'components/widgets/icon';
import {Link} from 'react-router-dom';

import '../styles/index.scss';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import {asyncFetchOrderNotice, asyncFetchFriendNotice, asyncSetNoticeRead, asyncFetchNoticeCount} from '../actions';

const TabPane = Tabs.TabPane;

class NoticeContent extends Component{
    constructor(props) {
        super(props);
    }


    curPage = {
        order: 1,
        friend: 1
    };

    perPage={
        order: 10,
        friend: 10
    };

    handleChange = (activeKey) => {
        if (activeKey === 'orderTab') {
            this.curPage.order = 1;
            // this.props.asyncFetchOrderNotice(this.curPage.order, this.perPage.order);
        }
        else if (activeKey === 'friendTab') {
            this.curPage.friend = 1;
            this.props.asyncFetchFriendNotice(this.curPage.friend, this.perPage.friend);

        }
    };

    loadMore = (type) => {
        if (type === 'order') {
            this.curPage.order++;
            this.props.asyncFetchOrderNotice(this.curPage.order, this.perPage.order);
        }
        else if (type === 'friend') {
            this.curPage.friend++;
            this.props.asyncFetchFriendNotice(this.curPage.friend, this.perPage.friend);
        }
    };

    setRead=(id)=>{
        this.props.asyncSetNoticeRead(id, (data)=>{
            if(data.retCode === '0'){
                if(!id){
                    this.props.asyncFetchFriendNotice(this.curPage.friend, this.perPage.friend)
                }
                this.props.asyncFetchNoticeCount();
            }
        })
    };

    componentDidMount() {
        this.props.asyncFetchFriendNotice(this.curPage.friend, this.perPage.friend);
        this.props.asyncFetchNoticeCount();
    }

    render(){
        const {orderNotice, friendNotice} = this.props;
        let orderNoticeStr = null,
            friendNoticeStr = null;

        if (!friendNotice.get('isFetching') || this.curPage.friend !== 1) {
            if (friendNotice.getIn(['data', 'retCode']) === '0' && friendNotice.getIn(['data', 'data', 'list']).size > 0) {
                const friendNoticeData = friendNotice.getIn(['data', 'data', 'list']);
                const totalFriend = friendNotice.getIn(['data', 'data', 'total']);
                const currentLoadedSize = friendNoticeData.size;
                friendNoticeStr = (
                    <React.Fragment>
                        <ul className={cx("msg-lst")}>
                            {
                                friendNoticeData && friendNoticeData.map(item =>{
                                    const recId = item.get('recId');
                                    const objectType = item.get('objectType');
                                    const objectId = item.get('objectId');
                                    let link = '';
                                    switch(objectType){
                                        case '销售订单':
                                            link = `/sale/show/${objectId}`;
                                            break;
                                        case '生产单':
                                            link = `/produceOrder/show/${objectId}`;
                                            break;
                                    default:
                                            break;
                                    }

                                    const liProps = {
                                        className:cx({"read-finished": item.get('readStatus') == '1'})+ " clearfix",
                                        key: recId,
                                        onClick: ()=>item.get('readStatus') == '1'?null:this.setRead(recId)
                                    };

                                    const txtStr = (
                                        <React.Fragment>
                                            <span className={cx("date")}>{moment(item.get('sendTime')).format("YYYY-MM-DD")}</span>
                                            <span className={cx("title")}>{item.get('content')}</span>
                                        </React.Fragment>
                                    );

                                    return link?(
                                        <li {...liProps}>
                                            <Link to={link}>
                                                {txtStr}
                                            </Link>
                                        </li>
                                    ):(
                                        <li {...liProps}>
                                            {txtStr}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {
                            currentLoadedSize<totalFriend? friendNotice.get('isFetching') ? (
                                <div className={cx("load-more-loading")}>
                                    <Spin/>
                                </div>
                            ) : (
                                <div className={cx("load-more-wrap")}>
                                    <span className={cx("load-more")} onClick={() => this.loadMore('friend')}><Icon
                                        type="reload"/>加载更多</span>
                                </div>
                            ):null
                        }

                    </React.Fragment>
                )
            }
            else {
                friendNoticeStr = (
                    <div className="gb-nodata">
                        <span/><p>暂无内容</p>
                    </div>
                )
            }
        }
        else if (this.curPage.friend === 1) {
            friendNoticeStr = (
                <Spin className="gb-data-loading"/>
            )
        }

        return(
            <React.Fragment>
                <Tabs defaultActiveKey="friendTab"
                      onChange={this.handleChange}
                >
                    {/*<TabPane tab="订单通知" key="orderTab">
                    <div className={cx("msg-lst-wrap")}>
                        {orderNoticeStr}
                    </div>
                </TabPane>*/}
                    <TabPane tab="通知" key="friendTab">
                        <div className={cx("msg-lst-wrap")}>
                            {friendNoticeStr}
                        </div>
                    </TabPane>
                </Tabs>
                <div className={cx("msg-ope")}>
                    <span className={cx("msg-btn-read")} onClick={()=>this.setRead()}>全部已读</span>
                </div>
            </React.Fragment>
        )
    }
}


class Notice extends Component {
    constructor(props) {
        super(props);
    }

    render() {


        return (
            <Drawer
                closable={false}
                destroyOnClose={true}
                visible={this.props.visible}
                onClose={this.props.onClose}
                width="320"
                className={cx("drawer-msg")}
            >
                {this.props.visible && <NoticeContent {...this.props}/>}
            </Drawer>
        )
    }
}


const mapStateToProps = state => ({
    orderNotice: state.getIn(['header', 'orderNotice']),
    friendNotice: state.getIn(['header', 'friendNotice'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOrderNotice,
        asyncFetchFriendNotice,
        asyncSetNoticeRead,
        asyncFetchNoticeCount
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Notice);
