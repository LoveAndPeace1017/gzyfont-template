import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
import {ExclamationCircleTwoTone} from '@ant-design/icons';
const cx = classNames.bind(styles);

import Add from './add';
import {asyncFetchGroupList, asyncAddGroup} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;


class Index extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        id: '',
        groupName: ''
    };

    openModal = (id, groupName) => {
        this.setState({
            addModalVisible: true,
            id:'',
            groupName:''
        });
        if (id && typeof id !== 'object') {
            this.setState({
                id,
                groupName
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
                _this.props.asyncAddGroup('delete',_this.props.type,{id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchGroupList(_this.props.type);
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
        this.props.asyncFetchGroupList(this.props.type);
    }

    render() {
        const {incomeList, type} = this.props;
        const incomeListData = incomeList.getIn([type, 'data', 'data']);

        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                groupName: item.get('groupName'),
                action: {
                    id: item.get('id')+'',
                    groupName: item.get('groupName')
                }
            }
        }).toJS();

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    {
                        dataSource && dataSource.length>20?null:(
                            <Button type="primary" icon={<PlusOutlined />}
                                    onClick={this.openModal.bind(this)}>{intl.get('common.confirm.new')}</Button>
                        )
                    }

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
                            title={"分组名称"}
                            dataIndex="groupName"
                            key="groupName"
                            width="60%"
                            render={(groupName,data)=>{
                                if(data.action.id === '0'){
                                    return <span>
                                                 {groupName}
                                                  <span className={cx("tip-currency")}><ExclamationCircleTwoTone style={{fontSize: "16px",marginRight: "4px"}}/>系统默认不可删除，不可修改</span>
                                            </span>
                                }else{
                                    return  <span>{groupName}</span>
                                }
                            }}
                        />
                        <Column
                            title={intl.get("auxiliary.income.action")}
                            dataIndex="action"
                            key="action"
                            width="25%"
                            align="center"
                            render={({id, groupName}) => (
                                <React.Fragment>
                                    {
                                        id === '0'?(
                                            <>
                                                <a href="#!" className="ope-item" style={{color:"#ccc", cursor: "not-allowed"}}>{intl.get('common.confirm.editor')}</a>
                                                <span className="ope-split" style={{color:"#ccc", cursor: "not-allowed"}}>|</span>
                                                <a href="#!" className="ope-item" style={{color:"#ccc", cursor: "not-allowed"}}>{intl.get('common.confirm.delete')}</a>
                                            </>
                                        ):(
                                            <>
                                                <a href="#!" className="ope-item"
                                                   onClick={this.openModal.bind(this, id, groupName)}>{intl.get('common.confirm.editor')}</a>
                                                <span className="ope-split">|</span>
                                                <a href="#!" className="ope-item"
                                                   onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
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
                    type={this.props.type}
                    id={this.state.id}
                    groupName={this.state.groupName}
                    onClose={this.closeModal.bind(this)}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        incomeList: state.getIn(['auxiliaryGroup', 'groupList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGroupList,
        asyncAddGroup
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)

