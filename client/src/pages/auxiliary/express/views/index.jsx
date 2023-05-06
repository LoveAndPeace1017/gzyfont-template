import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table, Alert} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';

import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import Add from './add';
import {asyncFetchExpressList, asyncAddExpress, asyncFetchExpressInfoNum} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;


class Express extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        id: '',
        incomeName: '',
        num: 0
    };

    openModal = (id, incomeName) => {
        this.setState({
            addModalVisible: true,
            id:'',
            incomeName:''
        });
        if (id && typeof id !== 'object') {
            this.setState({
                id,
                incomeName
            });
        }
    };

    closeModal = type => {
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
                _this.props.asyncAddExpress('delete', {id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchExpressList(_this.props.type);
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

    componentDidMount() {
        this.loadInfo();
    }

    loadInfo = ()=>{
        this.props.asyncFetchExpressList(this.props.type);
        this.props.asyncFetchExpressInfoNum((data)=>{
            if(data.data.retCode === "0"){
               this.setState({
                   num: data.data.data
               })
            }
        })
    }

    render() {
        const {expressList, type} = this.props;
        const incomeListData = expressList.getIn([type,'data','data']);
        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                incomeName: item.get('paramName'),
                action: {
                    id: item.get('id'),
                    incomeName: item.get('paramName')
                }
            }
        }).toJS();

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    <Alert message="更新物流公司，以便在线查询物流进度。" type="info" showIcon />
                    <div className={cx("info-num")}>
                        剩余可查询次数: <span>{this.state.num}</span>
                    </div>
                    <Button type="primary" icon={<PlusOutlined />}
                            onClick={()=>this.openModal()}>{intl.get('common.confirm.new')}</Button>
                </div>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        loading={expressList.get([type, 'isFetching'])}
                        className={cx("tb-aux")}
                        scroll={{y: 339}}
                    >
                        <Column
                            title={intl.get("auxiliary.express.serial")}
                            dataIndex="serial"
                            key="serial"
                            width="15%"
                        />
                        <Column
                            title={intl.get("auxiliary.express.incomeName")}
                            dataIndex="incomeName"
                            key="incomeName"
                            width="70%"
                        />
                        <Column
                            title={intl.get("auxiliary.express.action")}
                            dataIndex="action"
                            key="action"
                            width="15%"
                            align="center"
                            render={({id, incomeName}) => (
                                <React.Fragment>
                                    <a href="#!" className="ope-item" onClick={()=>this.openModal(id, incomeName)}>{intl.get('common.confirm.editor')}</a>
                                    <span className="ope-split">|</span>
                                    <a href="#!" className="ope-item"
                                       onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                </React.Fragment>
                            )}
                        />
                    </Table>
                </div>
                <Add
                    visible={this.state.addModalVisible}
                    type={this.props.type}
                    id={this.state.id}
                    incomeName={this.state.incomeName}
                    onClose={this.closeModal.bind(this)}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        expressList: state.getIn(['auxiliaryExpress', 'expressList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchExpressList,
        asyncAddExpress,
        asyncFetchExpressInfoNum
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Express)

