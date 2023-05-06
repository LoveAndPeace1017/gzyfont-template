import React, {Component} from 'react'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, withRouter} from 'react-router-dom';
import Panel from 'components/business/panel';
import {asyncFetchPendingApproval} from "../actions";
import {actions as commonActions} from "components/business/commonRequest";
import {Auth} from 'utils/authComponent';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {Button, Spin} from "antd";
const cx = classNames.bind(styles);
import Auxiliary from 'pages/auxiliary';
import intl from 'react-intl-universal';

class PendingApproval extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auxiliaryVisible: false,
            auxiliaryKey: ''
        }
    }

    handleOpen(type, auxiliaryKey) {
        this.setState({
            [type]: true,
            auxiliaryKey
        })
    }

    handleClose(type) {
        this.setState({
            [type]: false
        })
    }

    toAssignList = (item) => {
        const link = item.get('link');
        const title = item.get('title');
        const condition = {approveStatus: item.get('approveStatus'),assignee: "1"};
        this.props.asyncFetchInitListCondition({TITLE: title, condition});
        this.props.history.push(link);
    };

    componentDidMount() {
        this.props.asyncFetchPendingApproval();
    }

    render() {
        const {pendingApproval} = this.props;
        const pendingApprovalData = pendingApproval.getIn(['data', 'data']);

        let renderStr = null;
        if(pendingApproval.get('isFetching')){
            renderStr = (
                <Spin className="gb-data-loading"/>
            )
        }else if(pendingApprovalData && pendingApprovalData.size>0){
            renderStr = pendingApprovalData.map(item=>{
                return (
                    <li key={item.get('name')}>
                        <div className={cx('panel-tit-name')} onClick={() => this.toAssignList(item)}>
                            <p className={cx("num")}>{item.get('count')}</p>
                            <p className={cx("name")}>{intl.get(item.get('label'))}</p>
                        </div>
                    </li>
                )
            })
        }else{
            renderStr = (
                <Auth option='main'>
                    {
                        (isAuthed) => isAuthed ?(
                            <div className={cx("panel-no-data")}>
                                <p className={cx("tit")}>{intl.get("home.pendingApprovalPanel.tip1")}</p>
                                <Button type="primary" onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'approve')}>{intl.get("home.pendingApprovalPanel.open")}</Button>
                            </div>
                        ):(
                            <div className={cx("panel-no-data")}>
                                <p className={cx("tit")}>{intl.get("home.pendingApprovalPanel.tip2")}</p>
                                <p className={cx("sub-tit")}>{intl.get("home.pendingApprovalPanel.tip3")}</p>
                            </div>
                        )
                    }
                </Auth>
            )
        }

        return (
            <React.Fragment>
                <Panel
                    title={intl.get("home.pendingApprovalPanel.title")}
                >
                    <div className={cx("approval-lst")}>
                        <ul style={{"display": "flex"}}>
                            {renderStr}
                        </ul>
                    </div>
                </Panel>
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.handleClose.bind(this, 'auxiliaryVisible')}
                />
            </React.Fragment>

        );
    }
}

const mapStateToProps = (state) => ({
    pendingApproval: state.getIn(['home', 'pendingApproval'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPendingApproval,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PendingApproval)
)
