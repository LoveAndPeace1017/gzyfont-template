import React, {Component} from 'react';
import Panel from 'components/business/panel';
import Icon from 'components/widgets/icon';
import intl from 'react-intl-universal';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {
    asyncFetchInviteFriend
} from "../actions";
import {connect} from "react-redux";
import {message, Spin} from "antd";
import InviteModal from 'components/widgets/invite';
import ScrollContainer from 'components/widgets/scrollContainer';
import {actions as commonActions} from 'components/business/commonRequest/index';

const cx = classNames.bind(styles);

class FriendsPanel extends Component {
    constructor(props) {
        super(props);
        this.state={
            addFriendVisible: false,
            curComNo: '',
            curComType: ''
        }
    }

    isAddFriend = false;


    addFriends = (comNo, comType)=>{
        this.setState({
            curComNo: comNo,
            curComType: comType
        });
        this.props.asyncAddFriend({
            type: comType,
            id: comNo
        },(data)=>{
            if(data.retCode==='0'){ //添加成功
                this.addFriendModal(true);
            }else if(data.retCode==='1'){ //还没有百卓账号
                this.addFriendModal(false);
            }else{
                alert(data.retMsg)
            }
        });
    };

    showAddFriendModal = () => {
        this.setState({
            addFriendVisible: true,
        });
    };
    hideAddFriend = () => {
        this.setState({
            addFriendVisible: false,
        });
    };

    addFriendModal = (isAbizAccountFlag) => {
        if(isAbizAccountFlag){
            this.isAddFriend = true;
            this.props.asyncFetchInviteFriend();
            message.success(intl.get("common.confirm.success"));
        }else{
            this.showAddFriendModal();
        }
    };

    componentDidMount() {
        this.props.asyncFetchInviteFriend();
    }

    render() {

        const {inviteFriend} = this.props;
        let inviteFriendStr = null;

        //销售
        if (!inviteFriend.get('isFetching') || this.isAddFriend) {
            if (inviteFriend.getIn(['data', 'retCode']) === '0' && inviteFriend.getIn(['data', 'data']).size > 0) {
                const inviteFriendData = inviteFriend.getIn(['data', 'data']);
                inviteFriendStr = (
                    <ul>
                        {
                            inviteFriendData && inviteFriendData.map((item, index) => {
                                const companyNo = item.get('customerNo') || item.get('supplierNo');
                                const companyName = (item.get('customerNo') && item.get('customerName')) || (item.get('supplierNo') && item.get('supplierName'));
                                const companyType = item.get('customerNo')?'customer':'supplier';
                                return (
                                    <li key={index}>
                                        <span className={cx("title")} title={companyName}>{companyName}</span>
                                        <span className={cx("sub-info")}>{intl.get("home.friendsPanel.deal")}{item.get('billCount')}{intl.get("home.friendsPanel.piece")}</span>
                                        <a href="#!" className={cx("ope")} ga-data="global-add-friend" onClick={()=>this.addFriends(companyNo, companyType)}>{intl.get("home.friendsPanel.add")}</a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                )
            }
            else {
                inviteFriendStr = (
                    <div className="gb-nodata">
                        <span/><p>{intl.get("home.friendsPanel.noContent")}</p>
                    </div>
                )
            }
        }
        else if(!this.isAddFriend){
            inviteFriendStr = (
                <Spin className="gb-data-loading"/>
            )
        }
        return (
            <React.Fragment>
                <Panel
                    title={intl.get("home.friendsPanel.invite")}
                    // extra={<Icon type="right" className={cx("trigger-more")}/>}
                >
                    <ScrollContainer className={cx(["panel-info-lst", "friend-info-lst"])}>
                        {inviteFriendStr}
                    </ScrollContainer>
                </Panel>
                <InviteModal
                    title={intl.get("common.confirm.title")}
                    inviteVisible={this.state.addFriendVisible}
                    onCancel={this.hideAddFriend}
                    width={800}
                    type={this.state.curComType === 'customer'?"1":"0"}
                />
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({
    inviteFriend: state.getIn(['home', 'inviteFriend'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInviteFriend,
        asyncAddFriend:commonActions.asyncAddFriend
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendsPanel)
