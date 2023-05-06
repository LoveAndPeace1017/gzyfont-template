import React, {Component} from 'react';
import {Button, message, Modal, Table} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);

import Add from './add';
import {asyncFetchCustomFieldList, asyncAddCustomField} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;


class Index extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        customFieldName: '',
        id:''
    };

    openModal = (id, customFieldName) => {
            this.setState({
                addModalVisible:true,
                id,
                customFieldName
            });
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    deleteConfirm = (id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get("auxiliary.customField.deleteContent"),
            onOk() {
                _this.props.asyncAddCustomField('delete', {id:id}, (res) => {

                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchCustomFieldList(_this.props.type);
                        message.success(intl.get('common.confirm.success'));
                    }
                    else {
                        alert(res.data.retMsg+res.data.retValidationMsg.msg[0].msg)
                    }
                })
            },
            onCancel() {
            },
        });
    };

    componentDidMount() {
        this.props.asyncFetchCustomFieldList(this.props.type);
    }

    render() {
        const {customFieldList,currentAccountInfo} = this.props;
        const customFieldListData = customFieldList.getIn([this.props.type, 'data']);
        let dataSource = customFieldListData?customFieldListData.toJS():[];
        const accountInfo = currentAccountInfo.get('data');
        dataSource = dataSource.map((item, index) => {
            return {
                key: index + 1,
                serial: index + 1,
                customFieldName: item.propName,
                id: item.id,
                action: {
                    id:item.id,
                    customFieldName:item.propName
                }
            }
        });

        return (
            <React.Fragment>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        loading={customFieldList.get('isFetching')}
                        className={cx("tb-aux")}
                        scroll={{y: 400}}
                    >
                        <Column
                            title={intl.get("auxiliary.customField.serial")}
                            dataIndex="serial"
                            key="serial"
                            width="15%"
                        />
                        <Column
                            title={intl.get("auxiliary.customField.customFieldName")}
                            dataIndex="customFieldName"
                            key="customFieldName"
                            width="60%"
                        />
                        {
                            accountInfo && accountInfo.get('mainUserFlag')?(
                                <Column
                                    title={intl.get("auxiliary.customField.action")}
                                    dataIndex="action"
                                    key="action"
                                    width="25%"
                                    align="center"
                                    render={({id, customFieldName}) =>
                                        customFieldName?(
                                            <React.Fragment>
                                                <a href="#!" className="ope-item"
                                                   onClick={this.openModal.bind(this, id, customFieldName)}>{intl.get('common.confirm.editor')}</a>
                                                <span className="ope-split">|</span>
                                                <a href="#!" className="ope-item"
                                                   onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                            </React.Fragment>
                                        ):(<React.Fragment>
                                            <a href="#!" className="mr5"
                                               onClick={this.openModal.bind(this,id,customFieldName)}>{intl.get('common.confirm.new')}</a>
                                        </React.Fragment>)}
                                />
                            ):null
                        }

                    </Table>
                </div>
                <Add
                    visible={this.state.addModalVisible}
                    type={this.props.type}
                    id={this.state.id}
                    customFieldName={this.state.customFieldName}
                    onClose={this.closeModal.bind(this,'addModalVisible')}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        customFieldList: state.getIn(['auxiliaryCustomField', 'customFieldList']),
        currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCustomFieldList,
        asyncAddCustomField
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)

