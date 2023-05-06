import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table, Radio} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';

import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import Add from './add';
import {asyncFetchExpressList, asyncAddExpress,asyncEditCommon} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;


class Express extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        radioState: false,
        id: '',
        incomeName: ''
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

    changeRadio = (id,data) =>{
        this.props.asyncEditCommon(id, (res) => {
            console.log(res);
            if (res.data.retCode === '0') {
                //重新获取列表数据
                this.props.asyncFetchExpressList(this.props.type);
            }
            else {
                alert(res.data.retMsg)
            }
        })
    }

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
                        message.error(res.data.retMsg)
                    }
                })
            },
            onCancel() {
            },
        });
    };

    componentDidMount() {
        this.props.asyncFetchExpressList(this.props.type);
    }

    render() {
        const {rateList, type} = this.props;
        const incomeListData = rateList.getIn([type,'data','data']);
        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                radioState: false,
                incomeName: item.get('paramName')+'%',
                action: {
                    id: item.get('id'),
                    incomeName: item.get('paramName'),
                    checked: item.get('isCommon')===1?true:false
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
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        loading={rateList.get([type, 'isFetching'])}
                        className={cx("tb-aux")}
                        scroll={{y: 339}}
                    >
                        <Column
                            title={intl.get("auxiliary.rate.serial")}
                            dataIndex="serial"
                            key="serial"
                            width="15%"
                        />
                        <Column
                            title={intl.get("auxiliary.rate.action")}
                            dataIndex="action"
                            key="common"
                            width="10%"
                            render={({id, incomeName,checked}, data) => (
                                <React.Fragment>
                                    <Radio onClick={()=>this.changeRadio(id, data)}  checked={checked} ></Radio>
                                </React.Fragment>
                            )}
                        />
                        <Column
                            title={intl.get("auxiliary.rate.incomeName")}
                            dataIndex="incomeName"
                            key="incomeName"
                            width="50%"
                        />
                        <Column
                            title={intl.get("auxiliary.rate.action1")}
                            dataIndex="action"
                            key="action"
                            width="25%"
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
        rateList: state.getIn(['auxiliaryRate', 'rateList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchExpressList,
        asyncAddExpress,
        asyncEditCommon
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Express)

