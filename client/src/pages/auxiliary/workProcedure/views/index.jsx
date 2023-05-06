import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table, Dropdown, Menu} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import { DownOutlined } from '@ant-design/icons';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import Add from './add';
import {asyncFetchWorkProcedureList, asyncAddWorkProcedure} from "../actions";
import moment from "moment";
const {Column} = Table;
const confirm = Modal.confirm;


class WorkProcedure extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        id: '',
        data: ''
    };

    openModal = (id,data) => {
        this.setState({
            addModalVisible: true,
            id:'',
            data: ''
        });
        if (id && typeof id !== 'object') {
            this.setState({
                id,
                data
            });
        }
    };

    closeModal = () => {
        this.setState({
            addModalVisible: false
        })
    };

    deleteConfirm = (id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get('common.confirm.content1'),
            onOk() {
                _this.props.asyncAddWorkProcedure('delete', {id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchWorkProcedureList();
                        message.success(intl.get('common.confirm.success'));
                    }
                    else {
                        message.error(res.data.retMsg);
                    }
                })
            },
            onCancel() {
            },
        });
    };

    componentDidMount() {
        this.props.asyncFetchWorkProcedureList();
    }

    render() {
        const {workProcedureList} = this.props;
        const workProcedureListData = workProcedureList.getIn(['data','data']);
        const dataSource = workProcedureListData && workProcedureListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                caCode: item.get('caCode'),
                caName: item.get('caName'),
                processCode: item.get('processCode'),
                processName: item.get('processName'),
                productivity: item.get('productivity'),
                addedName: item.get('addedName'),
                addedTime: item.get('addedTime'),
                action: {
                    id: item.get('recId')
                }
            }
        }).toJS();

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    <Button type="primary" icon={<PlusOutlined />}
                            onClick={()=>this.openModal()}>{intl.get('common.confirm.new')}</Button>
                </div>
                <div className={cx("aux-list")}>
                    <div className={"tb-inner"}>
                        <Table
                            dataSource={dataSource}
                            pagination={false}
                            loading={workProcedureList.get(['isFetching'])}
                            className={cx("tb-aux")}
                            scroll={{y: 510}}
                        >
                            <Column
                                title={intl.get("auxiliary.orderType.serial")}
                                dataIndex="serial"
                                key="serial"
                                width={50}
                            />
                            <Column
                                title={"工序编号"}
                                dataIndex="processCode"
                                key="processCode"
                            />
                            <Column
                                title={"名称"}
                                dataIndex="processName"
                                key="processName"
                            />
                            <Column
                                title={"默认工作中心"}
                                dataIndex="caName"
                                key="caName"
                            />
                            <Column
                                title={"单位工时产能"}
                                dataIndex="productivity"
                                key="productivity"
                                align="center"
                            />
                            <Column
                                title={"新建人"}
                                dataIndex="addedName"
                                key="addedName"
                            />
                            <Column
                                title={"新建时间"}
                                dataIndex="addedTime"
                                key="addedTime"
                                width={160}
                                render={(date) => (
                                    <span className="txt-clip">
                                       {date ? moment(date).format('YYYY-MM-DD HH:mm') : null}
                                    </span>
                                )}
                            />
                            <Column
                                title={intl.get("auxiliary.orderType.action")}
                                dataIndex="action"
                                key="action"
                                align="center"
                                render={({id},data) => (
                                    <React.Fragment>
                                        <a href="#!" className="ope-item" onClick={()=>this.openModal(id,data)}>{intl.get('common.confirm.editor')}</a>
                                        <span className="ope-split">|</span>
                                        <a href="#!" className="ope-item"
                                           onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                    </React.Fragment>
                                )}
                            />
                        </Table>
                    </div>
                </div>

                <Add
                    visible={this.state.addModalVisible}
                    id={this.state.id}
                    data={this.state.data}
                    onClose={this.closeModal.bind(this)}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        workProcedureList: state.getIn(['auxiliaryWorkProcedure', 'workProcedureList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWorkProcedureList,
        asyncAddWorkProcedure
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkProcedure)

