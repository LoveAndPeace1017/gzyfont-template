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
import {asyncFetchIncomeList, asyncAddIncome} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;


class Index extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
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

    deleteConfirm = (id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get('common.confirm.content1'),
            onOk() {
                _this.props.asyncAddIncome('delete', {id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchIncomeList(_this.props.type);
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
        this.props.asyncFetchIncomeList(this.props.type);
    }

    render() {
        const {incomeList, type} = this.props;
        const incomeListData = incomeList.getIn([type, 'data', 'data']);

        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                incomeName: item.get('propName'),
                action: {
                    id: item.get('id'),
                    incomeName: item.get('propName')
                }
            }
        }).toJS();

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    <Button type="primary" icon={<PlusOutlined />}
                            onClick={this.openModal.bind(this)}>{intl.get('common.confirm.new')}</Button>
                </div>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        loading={incomeList.get([type, 'isFetching'])}
                        className={cx("tb-aux")}
                        scroll={{y: 500}}
                    >
                        <Column
                            title={intl.get("auxiliary.income.serial")}
                            dataIndex="serial"
                            key="serial"
                            width="15%"
                        />
                        <Column
                            title={this.props.type === 'account'?intl.get("auxiliary.income.name"):intl.get("auxiliary.income.name1")}
                            dataIndex="incomeName"
                            key="incomeName"
                            width="60%"
                        />
                        <Column
                            title={intl.get("auxiliary.income.action")}
                            dataIndex="action"
                            key="action"
                            width="25%"
                            align="center"
                            render={({id, incomeName}) => (
                                <React.Fragment>
                                    <a href="#!" className="ope-item"
                                       onClick={this.openModal.bind(this, id, incomeName)}>{intl.get('common.confirm.editor')}</a>
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
        incomeList: state.getIn(['auxiliaryIncome', 'incomeList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchIncomeList,
        asyncAddIncome
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)

