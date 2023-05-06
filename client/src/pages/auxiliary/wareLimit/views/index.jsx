import React, {Component} from 'react';
import {Button, message, Modal, Table, Switch} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Tip from 'components/widgets/tip';
import Icon from 'components/widgets/icon';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import { asyncFetchWareLimitList, asyncModifyWareLimitStatus,} from "../actions";
import intl from 'react-intl-universal';
const {Column} = Table;

class WareLimit extends Component{
    // toggleEnable = ({key, item, type}, callback) =>{
    //     this.props.asyncToggleEnable({key, item, type}, (data)=>{
    //         if(data.get('retCode') === '0'){
    //             callback && callback(true);
    //             this.props.asyncFetchApproveList(true);
    //             this.props.asyncFetchPendingApproval(true);
    //         }else{
    //             callback && callback(false);
    //         }
    //     });
    // };

    toggleEnable = (action)=>{
        let {isDeleted,paramName,orderNo} = action;
        isDeleted = isDeleted === 0 ? 1 : 0;
        this.props.asyncModifyWareLimitStatus({isDeleted,paramName,orderNo}, (data)=>{
            if(data.retCode === '0'){
                this.props.asyncFetchWareLimitList();
            }
        });
    };

    componentDidMount() {
        this.props.asyncFetchWareLimitList();
    }

    render() {
        const {wareLimitList} = this.props;
        const wareLimitListData = wareLimitList.getIn(['data','data']);
        const dataSource = wareLimitListData && wareLimitListData.map((item, index) => {
            return {
                paramName: item.get('paramName'),
                key: index,
                isDeleted: item.get('isDeleted'),
                action: {
                   /* id: item.get('id'),*/
                    isDeleted: item.get('isDeleted'),
                    paramName: item.get('paramName'),
                    orderNo: item.get('orderNo')
                }
            }
        }).toJS();
        return (
            <React.Fragment>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        loading={wareLimitList.get('isFetching')}
                        className={cx("tb-aux")}
                        scroll={{y: 518}}
                    >
                        <Column
                            title={intl.get("auxiliary.wareLimit.paramName")}
                            dataIndex="paramName"
                            width="85%"
                        />
                        <Column
                            title={intl.get("auxiliary.wareLimit.action")}
                            dataIndex="action"
                            width="15%"
                            align="center"
                            render={(action, record) => (
                                <React.Fragment>
                                    <Switch onChange={()=>this.toggleEnable(action)} checked={action.isDeleted===0} />
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
        wareLimitList: state.getIn(['auxiliaryWareLimit', 'auxiliaryWareLimitList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWareLimitList,
        asyncModifyWareLimitStatus,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(WareLimit)

