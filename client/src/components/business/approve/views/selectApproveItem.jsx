import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import {Modal, Table} from 'antd';

import {asyncGetApproveStatus} from "../actions";
import styles from '../styles/index.scss';
import {asyncFetchLevelApprovedList} from 'pages/auxiliary/levelApproval/actions';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);


/**
 *  选择当前模块的合适的审批流程
 * @visibleName SelectApproveItem
 * @author jinbo
 */

class SelectApproveItem extends Component {
    constructor(props) {
        super(props);
        this.state={
            approveId: ''
        }
    }

    componentDidMount() {
        this.props.asyncFetchLevelApprovedList({type:this.props.type});
    }

    onSelectChange = (selectedRowKeys, selectedRows)=>{
        let approveId = selectedRows[0].id;
        this.setState({approveId});
    };

    render() {
        const {show,levelApprovedList} = this.props;
        const incomeListData = levelApprovedList.getIn(['data','data','result']);
        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                id: item.get('id'),
                serial: index + 1,
                approveName: item.get('displayName'),
                createTime: item.get('createTime'),
                modifyTime: item.get('modifyTime')
            }
        }).toJS();

        const rowSelection = {
            type: 'radio',
            onChange: this.onSelectChange,
        };

        const columns = [
            {
                dataIndex: "serial",
                key: "serial",
                title: intl.get("components.approve.selectApproveItem.serial")
            },
            {
                dataIndex: "approveName",
                key: "approveName",
                title: intl.get("components.approve.selectApproveItem.approveName")
            },
            {
                dataIndex: "createTime",
                key: "createTime",
                title: intl.get("components.approve.selectApproveItem.createTime")
            },
            {
                dataIndex: "modifyTime",
                key: "modifyTime",
                title: intl.get("components.approve.selectApproveItem.modifyTime")
            }];

        return (
            <Modal
                title={intl.get("components.approve.selectApproveItem.choose")}
                visible={show}
                onOk={()=>this.props.onOk(this.state.approveId)}
                onCancel={this.props.onClose}
                width={800}
                okText={intl.get("components.approve.selectApproveItem.okText")}
                cancelText={intl.get("components.approve.selectApproveItem.cancelText")}
            >
                {
                    (dataSource && dataSource.length > 0) ? (
                        <div className={"tb-inner"}>
                            <Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} scroll={{y: 280}}
                                   pagination={false}/>
                        </div>

                    ) : <div className={cx('selectApprove')}>
                        暂无可用审批流，无法提交审批
                    </div>
                }
            </Modal>
        );
    }
}



const mapStateToProps = (state) => ({
    vipService: state.getIn(['vipHome', 'vipService']),
    levelApprovedList: state.getIn(['auxiliaryLevelApproved', 'levelApprovedList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchLevelApprovedList,
        asyncGetApproveStatus,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectApproveItem)

