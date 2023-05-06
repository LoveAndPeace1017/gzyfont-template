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
import {ExclamationCircleTwoTone} from '@ant-design/icons';
import {asyncFetchMultiCurrencyList, asyncAddMultiCurrency} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;


class Currency extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        id: '',
        incomeName: '',
        paramValue: '',
        paramModule: '',
        defaultCurrency: 0
    };

    openModal = (id, incomeName, paramValue,defaultCurrency,paramModule) => {
        const {multiCurrencyList} = this.props;
        const incomeListData = multiCurrencyList.getIn(['data','data']);
        if(incomeListData.size >= 20){
            message.error('币种数量已超过上线');
            return false;
        }
        this.setState({
            addModalVisible: true,
            id:'',
            paramValue: '',
            incomeName:'',
            paramModule: '',
            defaultCurrency: 0
        });
        if (id && typeof id !== 'object') {
            this.setState({
                id,
                incomeName,
                paramValue,
                defaultCurrency,
                paramModule
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
                _this.props.asyncAddMultiCurrency('del', {id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchMultiCurrencyList();
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
        this.props.asyncFetchMultiCurrencyList();
    }

    render() {
        const {multiCurrencyList} = this.props;
        const incomeListData = multiCurrencyList.getIn(['data','data']);
        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                incomeName: item.get('paramKey'),
                paramValue: item.get('paramValue'),
                paramModule: item.get('paramModule'),
                action: {
                    id: item.get('id'),
                    incomeName: item.get('paramKey'),
                    paramValue: item.get('paramValue'),
                    paramModule: item.get('paramModule'),
                    isDefault: item.get('paramModule') !== 'CurrencyDefault'
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
                        loading={multiCurrencyList.get('isFetching')}
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
                            title={"币种名称"}
                            dataIndex="incomeName"
                            key="incomeName"
                            width="40%"
                            render={(incomeName,data)=>{
                                if(data.paramModule === 'CurrencyDefault'){
                                    return <span>
                                                 {incomeName}
                                                 <span className={cx("tip-currency")}><ExclamationCircleTwoTone style={{fontSize: "16px",marginRight: "4px"}}/>本币不可修改牌价，不可删除</span>
                                            </span>
                                }else{
                                    return  <span>{incomeName}</span>
                                }
                            }}
                        />
                        <Column
                            title={"牌价"}
                            dataIndex="paramValue"
                            key="paramValue"
                            width="30%"
                        />
                        <Column
                            title={intl.get("auxiliary.express.action")}
                            dataIndex="action"
                            key="action"
                            width="15%"
                            align="center"
                            render={({id, incomeName, paramValue, isDefault, paramModule}) => (
                                <React.Fragment>
                                    {
                                        isDefault?(
                                            <>
                                                <a href="#!"  className="ope-item" onClick={()=>this.openModal(id, incomeName, paramValue,0,paramModule)}>{intl.get('common.confirm.editor')}</a>
                                                <span className="ope-split">|</span>
                                                <a href="#!" className="ope-item"
                                                   onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                            </>
                                        ):(
                                            <>
                                                <a href="#!" className="ope-item" onClick={()=>this.openModal(id, incomeName, paramValue,1,paramModule)}>{intl.get('common.confirm.editor')}</a>
                                                <span className="ope-split">|</span>
                                                <a href="#!" className="ope-item" style={{color: "#d3d3d3"}}>{intl.get('common.confirm.delete')}</a>
                                            </>
                                        )
                                    }

                                </React.Fragment>
                            )}
                        />
                    </Table>
                </div>
                <Add
                    visible={this.state.addModalVisible}
                    id={this.state.id}
                    incomeName={this.state.incomeName}
                    paramValue={this.state.paramValue}
                    defaultCurrency={this.state.defaultCurrency}
                    paramModule={this.state.paramModule}
                    onClose={this.closeModal.bind(this)}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        multiCurrencyList: state.getIn(['auxiliaryMultiCurrency', 'multiCurrencyList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchMultiCurrencyList,
        asyncAddMultiCurrency
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Currency)

