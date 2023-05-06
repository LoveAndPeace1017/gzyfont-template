import React, {Component} from 'react';
import List from './list';
import {message, Modal} from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

import {asyncAssignToSubAccount, asyncBatchAssignToSubAccount, emptySubAccountList, subAccountCheck} from '../actions'
import * as constants from 'utils/constants'

class ChooseForm extends Component {

    componentWillUnmount() {
        this.props.emptySubAccountList();
    }

    render() {
        return (
            <List pageType="choose" {...this.props} rowSelection={this.props.rowSelection}/>
        );
    }
}

class Choose extends Component {
    state={
      status: 1
    };

    singleCreate = () => {
        const {subAccountList} = this.props;
        const selectedRowKeys = this.props.selectedRowKeys;
        const subAccountListData = subAccountList.getIn(['data', 'data', 'subAccountDetails']);
        const checkedData = subAccountListData && subAccountListData.map((item) => {
            return {
                subUserId: item.get('userIdEnc'),
                visable: selectedRowKeys.length>0?selectedRowKeys.some(val => {
                    return item.get('userIdEnc') === val
                }):false
            }
        }).toJS();

        this.props.asyncAssignToSubAccount(this.props.postUrl, checkedData, (res) => {

            if (res.data.retCode === '0') {
                message.success(intl.get('common.confirm.success'));
                this.props.onClose();
            }
            else {
                message.error(res.data.retMsg)
            }
        })
    };

    batchCreate = () => {
        let {selectedRowKeys, selectIds, postUrl} = this.props;
        let data = {
            status: this.state.status,
            subUserIds : selectedRowKeys,
            selectIds: selectIds
         };
        this.props.asyncBatchAssignToSubAccount(postUrl, data, (res) => {

            if (res.data.retCode === '0') {
                message.success(intl.get('common.confirm.success'));
                this.props.onOk && this.props.onOk();
                this.props.onClose();
            }
            else {
                message.error(res.data.retMsg)
            }
        })
    };

    handleCreate = () => {
        // pageType 为 batchChoose 为批量选择
        this.props.pageType === 'batchChoose' ? this.batchCreate() :
            this.singleCreate();
    };

    onRadioChange = (e) => {
        this.setState({status: e.target.value})
    };

    render() {
        const rowSelection = {
            onChange: this.props.subAccountCheck,
            selectedRowKeys: this.props.selectedRowKeys,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };
        return (
            <Modal
                title={intl.get("account.index.select")}
                width={''}
                className={cx("modal-mul-account") + " list-pop"}
                visible={this.props.visible}
                onOk={this.handleCreate}
                onCancel={this.props.onClose}
                confirmLoading={this.props.assignToSubAccount.get('isFetching')}
                destroyOnClose={true}
            >
                <ChooseForm {...this.props}
                            rowSelection={rowSelection}
                            onRadioChange={this.onRadioChange}
                            status={this.state.status}
                />
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    const subAccountList = state.getIn(['accountIndex', 'subAccountList']);
    const selectedRowKeys = subAccountList && subAccountList.get('selectedRowKeys');
    return {
        assignToSubAccount: state.getIn(['accountIndex', 'assignToSubAccount']),
        subAccountList,
        selectedRowKeys
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAssignToSubAccount,
        asyncBatchAssignToSubAccount,
        emptySubAccountList,
        subAccountCheck
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Choose)

