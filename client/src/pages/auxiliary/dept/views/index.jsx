import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);

import Add from './add';
import {asyncFetchDeptList, asyncAddDept} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;

class Index extends Component {

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        id: '',
        recId: '',
        deptName: ''
    };

    openModal = (type, id, recId, deptName) => {
        this.setState({
            [type]: true,
             id: '',
             recId: '',
             deptName: ''
        });
        if (recId && typeof recId !== 'object') {
            this.setState({
                id,
                recId,
                deptName
            });
        }
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    deleteConfirm = (deptId, id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get('common.confirm.content1'),
            onOk() {
                _this.props.asyncAddDept('del', {recId:deptId,id:id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchDeptList();
                        message.success(intl.get('common.confirm.success'));
                    }
                    else {
                        alert(res.data.retMsg)
                    }
                })
            },
            onCancel() {
            },
        });
    };

    //筛选排序分页
    handleTableChange = (pagination, filters, sorter) => {
        const orderByType = sorter.order === 'descend' ? 'desc' : 'asc';
        this.props.asyncFetchDeptList(orderByType);
    };

    componentDidMount() {
        this.props.asyncFetchDeptList();
    }

    render() {
        const {deptList} = this.props;
        const deptListData = deptList.getIn(['data', 'data']);
        const dataSource = deptListData && deptListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                deptName: item.get('name'),
                action: {
                    id:item.get('id'),
                    recId: item.get('recId'),
                    deptName: item.get('name')
                }
            }
        }).toJS();

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    <Button type="primary" icon={<PlusOutlined />}
                            onClick={this.openModal.bind(this, 'addModalVisible')}>{intl.get('common.confirm.new')}</Button>
                </div>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        onChange={this.handleTableChange}
                        loading={deptList.get('isFetching')}
                        className={cx("tb-aux")}
                        scroll={{y: 481}}
                    >
                        <Column
                            title={intl.get("auxiliary.dept.serial")}
                            dataIndex="serial"
                            key="serial"
                            width="15%"
                        />
                        <Column
                            title={intl.get("auxiliary.dept.deptName")}
                            dataIndex="deptName"
                            key="deptName"
                            width="60%"
                            sorter={true}
                        />
                        <Column
                            title={intl.get("auxiliary.dept.action")}
                            dataIndex="action"
                            key="action"
                            width="25%"
                            align="center"
                            render={({id,recId, deptName}) => (
                                <React.Fragment>
                                    <a href="#!" className="ope-item"
                                       onClick={this.openModal.bind(this, 'addModalVisible', id, recId, deptName)}>{intl.get('common.confirm.editor')}</a>
                                    <span className="ope-split">|</span>
                                    <a href="#!" className="ope-item"
                                       onClick={this.deleteConfirm.bind(this, recId,id)}>{intl.get('common.confirm.delete')}</a>
                                </React.Fragment>
                            )}
                        />
                    </Table>
                </div>
                <Add
                    visible={this.state.addModalVisible}
                    id={this.state.id}
                    recId={this.state.recId}
                    deptName={this.state.deptName}
                    onClose={this.closeModal.bind(this, 'addModalVisible')}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        deptList: state.getIn(['auxiliaryDept', 'deptList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchDeptList,
        asyncAddDept
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
