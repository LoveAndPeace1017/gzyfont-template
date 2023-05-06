import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import {Link} from 'react-router-dom';
import {withRouter} from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import {asyncFetchLevelApprovedList, asyncAddLevelApproved,asyncDeleteLevelApproved} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;

const map ={
    "10":"采购订单",
    "11":"销售订单",
    "12":"入库单",
    "13":"出库单",
    "14":"收入记录",
    "15":"支出记录",
    "16":"开票记录",
    "17":"到票记录",
    "18": "请购单"
}


class LevelApproved extends React.Component{

    constructor(props) {
        super(props);
    }

    openModal = () => {
        this.props.close();
        this.props.history.push(`/approved/add/`);
    };


    deleteConfirm = (id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get('common.confirm.content1'),
            onOk() {
                _this.props.asyncDeleteLevelApproved( {id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchLevelApprovedList(_this.props.type);
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
        this.props.asyncFetchLevelApprovedList();
    }

    render() {
        const {levelApprovedList, type} = this.props;
        const incomeListData = levelApprovedList.getIn(['data','data','result']);
        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                displayName: item.get('displayName'),
                createTime: item.get('createTime'),
                modifyTime: item.get('modifyTime'),
                type: map[item.get('type')],
                action: {
                    id: item.get('id')
                }
            }
        }).toJS();

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    <Button type="primary" icon={<PlusOutlined />}
                            onClick={()=>this.openModal()}>{intl.get('home.approved.add')}</Button>
                </div>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        loading={levelApprovedList.get([type, 'isFetching'])}
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
                            title={intl.get("home.approved.name")}
                            dataIndex="displayName"
                            key="displayName"
                            width="20%"
                        />
                        <Column
                            title={intl.get("home.approved.type")}
                            dataIndex="type"
                            key="type"
                            width="10%"
                        />
                        <Column
                            title={intl.get("home.approved.date")}
                            dataIndex="createTime"
                            key="createTime"
                            width="15%"
                        />
                        <Column
                            title={intl.get("home.approved.editorDate")}
                            dataIndex="modifyTime"
                            key="modifyTime"
                            width="15%"
                        />
                        <Column
                            title={intl.get("auxiliary.express.action")}
                            dataIndex="action"
                            key="action"
                            width="25%"
                            align="center"
                            render={({id}) => (
                                <React.Fragment>
                                    <a href="#!" className="ope-item" onClick={()=>{
                                        this.props.close();
                                        this.props.history.push(`/approved/edit/${id}`);
                                    }}>{intl.get('common.confirm.editor')}</a>
                                    <span className="ope-split">|</span>
                                    <a href="#!" className="ope-item"
                                       onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                    <span className="ope-split">|</span>
                                    <a href="#!" className="ope-item"
                                       onClick={()=>{
                                           this.props.close();
                                           this.props.history.push(`/approved/copy/${id}`);
                                       }}>{intl.get('common.confirm.copy')}</a>
                                </React.Fragment>
                            )}
                        />
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        levelApprovedList: state.getIn(['auxiliaryLevelApproved', 'levelApprovedList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchLevelApprovedList,
        asyncAddLevelApproved,
        asyncDeleteLevelApproved
    }, dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LevelApproved))

