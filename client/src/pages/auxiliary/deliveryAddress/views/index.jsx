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
import {asyncFetchAddressList, asyncAddAddress,asyncEditCommon} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;


class Address extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        id: '',
        incomeName: ''
    };

    openModal = (id, incomeName,receiverProvinceCode,receiverCityCode,receiverProvinceText,receiverCityText) => {
        this.setState({
            addModalVisible: true,
            id:'',
            incomeName:'',
            receiverProvinceCode:'',
            receiverCityCode:'',
            receiverProvinceText:'',
            receiverCityText:''
        });
        if (id && typeof id !== 'object') {
            this.setState({
                id,
                incomeName,
                receiverProvinceCode,
                receiverCityCode,
                receiverProvinceText,
                receiverCityText
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
            if (res.data.retCode === '0') {
                //重新获取列表数据
                this.props.asyncFetchAddressList(this.props.type);
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
                _this.props.asyncAddAddress('delete', {id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchAddressList(_this.props.type);
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
        console.log(this.props.type,'type');
        this.props.asyncFetchAddressList(this.props.type);
    }

    render() {
        const {addressList, type} = this.props;
        const incomeListData = addressList.getIn([type,'data','data']);
        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                incomeName: item.get('receiverProvinceText') + ' ' + item.get('receiverCityText') + ' ' + item.get('receiverAddress'), //{item.get('receiverProvinceText') + ' ' + item.get('receiverCityText') + ' ' + item.get('receiverAddress')}
                action: {
                    id: item.get('id'),
                    incomeName: item.get('receiverAddress'),
                    receiverProvinceCode: item.get('receiverProvinceCode'),
                    receiverCityCode: item.get('receiverCityCode'),
                    receiverProvinceText: item.get('receiverProvinceText'),
                    receiverCityText: item.get('receiverCityText'),
                    checked: item.get('isMain')===1?true:false
                }
            }
        }).toJS();
        console.log(dataSource,'dataSource');
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
                        loading={addressList.get([type, 'isFetching'])}
                        className={cx("tb-aux")}
                        scroll={{y: 518}}
                    >
                        <Column
                            title={intl.get("auxiliary.deliveryAddress.serial")}
                            dataIndex="serial"
                            key="serial"
                            width="15%"
                        />
                        <Column
                            title={intl.get("auxiliary.deliveryAddress.action1")}
                            dataIndex="action"
                            key="common"
                            width="15%"
                            render={({id, incomeName,checked}, data) => (
                                <React.Fragment>
                                    <Radio onClick={()=>this.changeRadio(id, data)}  checked={checked} ></Radio>
                                </React.Fragment>
                            )}
                        />
                        <Column
                            title={intl.get("auxiliary.deliveryAddress.incomeName")}
                            dataIndex="incomeName"
                            key="incomeName"
                            width="65%"
                        />
                        <Column
                            title={intl.get("auxiliary.deliveryAddress.action")}
                            dataIndex="action"
                            key="action"
                            width="20%"
                            align="center"
                            render={({id, incomeName,receiverProvinceCode,receiverCityCode,receiverProvinceText,receiverCityText}) => (
                                <React.Fragment>
                                    <a href="#!" className="ope-item" onClick={()=>this.openModal(id, incomeName,receiverProvinceCode,receiverCityCode,receiverProvinceText,receiverCityText)}>{intl.get('common.confirm.editor')}</a>
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
                    receiverProvinceCode={this.state.receiverProvinceCode}
                    receiverCityCode={this.state.receiverCityCode}
                    receiverProvinceText={this.state.receiverProvinceText}
                    receiverCityText={this.state.receiverCityText}
                    incomeName={this.state.incomeName}
                    onClose={this.closeModal.bind(this)}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addressList: state.getIn(['auxiliaryAddress', 'addressList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchAddressList,
        asyncAddAddress,
        asyncEditCommon
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Address)

