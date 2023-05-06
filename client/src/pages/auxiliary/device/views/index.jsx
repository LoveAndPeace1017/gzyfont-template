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
import {
    asyncFetchDeviceManageList,
    asyncAddDeviceManage
} from "../actions";
import moment from "moment";
const {Column} = Table;
const confirm = Modal.confirm;


class DeviceManage extends React.Component{

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

    setHideOrDisplay = (id,equipmentState) =>{
        this.props.asyncAddDeviceManage('set', {id: id,equipmentState}, (res) => {
            if (res.data.retCode === '0') {
                //重新获取列表数据
                this.props.asyncFetchDeviceManageList();
                message.success(intl.get('common.confirm.success'));
            }
            else {
                message.error(res.data.retMsg);
            }
        })
    }

    deleteConfirm = (id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get('common.confirm.content1'),
            onOk() {
                _this.props.asyncAddDeviceManage('delete', {id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchDeviceManageList();
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
        this.props.asyncFetchDeviceManageList();
    }

    render() {
        const {deviceManageList} = this.props;
        const deviceManageListData = deviceManageList.getIn(['data','data']);
        const dataSource = deviceManageListData && deviceManageListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                equipmentCode: item.get('equipmentCode'),
                equipmentName: item.get('equipmentName'),
                head: item.get('head'),
                officerId: item.get('officerId'),
                remarks: item.get('remarks'),
                equipmentState: item.get('equipmentState')?"显示":"隐藏",
                equipmentStateCode: item.get('equipmentState'),
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
                            loading={deviceManageList.get(['isFetching'])}
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
                                title={"设备编号"}
                                dataIndex="equipmentCode"
                                key="equipmentCode"
                            />
                            <Column
                                title={"设备名称"}
                                dataIndex="equipmentName"
                                key="equipmentName"
                            />
                            <Column
                                title={"负责人"}
                                dataIndex="head"
                                key="head"
                            />
                            <Column
                                title={"备注"}
                                dataIndex="remarks"
                                key="remarks"
                                align="center"
                            />
                            <Column
                                title={"展示状态"}
                                dataIndex="equipmentState"
                                key="equipmentState"
                                align="center"
                            />
                            <Column
                                title={intl.get("auxiliary.orderType.action")}
                                dataIndex="action"
                                key="action"
                                align="center"
                                width={200}
                                render={({id},data) => (
                                    <React.Fragment>
                                        <a href="#!" className="ope-item" onClick={()=>this.openModal(id,data)}>{intl.get('common.confirm.editor')}</a>
                                        <span className="ope-split">|</span>
                                        <a href="#!" className="ope-item"
                                           onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                        <span className="ope-split">|</span>
                                        <a href="#!" className="ope-item"
                                           onClick={this.setHideOrDisplay.bind(this, id,data.equipmentStateCode?0:1)}>{
                                            data.equipmentStateCode?"隐藏":"显示"
                                        }</a>
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
        deviceManageList: state.getIn(['auxiliaryDeviceManage', 'deviceManageList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchDeviceManageList,
        asyncAddDeviceManage
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceManage)

