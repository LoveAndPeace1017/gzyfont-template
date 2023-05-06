import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import IntlTranslation from 'utils/IntlTranslation';
import {Button, message, Modal, Table} from 'antd';
import Icon from 'components/widgets/icon';

import {asyncGetApproveStatus} from "../actions";
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {Accordion} from "antd-mobile/lib/accordion";
import {Link} from "react-router-dom";
// import {actions as vipServiceHomeActions} from "pages/vipService/index";
const cx = classNames.bind(styles);

/**
 *   ApproveProcess 审批流
 *  @visibleName ApproveProcess
 * @author wangmei
 */

class ApproveProcess extends Component {


    render() {
        const processData = (this.props.data && this.props.data)|| [];
        //approveStatu 审批状态 0 未提交  1 通过  2 反驳  3 审批中
        const approveStatu = this.props.approveStatus;
        //将后端数据处理成需要的json格式
        let dealJson = {};
        let current = false;
        let rejectNode = '';
        let currentLocation;
        for(let i=0;i<processData.length;i++){
            let name = processData[i].name;
            if(!current && processData[i].current){
                current = true;
                currentLocation = i;
            }
            if(current){
                processData[i].status = '1';
            }else{
                processData[i].status = '2';
            }
            dealJson[name] = processData[i];

            processData[i].rejectNode && (rejectNode = processData[i].rejectNode);
        }
        let width = '';
        let lineWidth = '';
        processData.length > 0 && (
            //开始和结束节点的状态添加固定的状态码（开始：0，结束：4）
            dealJson["0"].status = '0', rejectNode && (dealJson[rejectNode].status = '3'),dealJson[processData.length-1].status = '4',
            width = (1/processData.length)*100+'%',
            currentLocation ? (lineWidth = (1/processData.length)*(currentLocation-1)*100):(lineWidth = '100')
        )
        console.log(dealJson,'dealJson');
        // 说明：  提交  待审批  已审批   驳回
        // starus : 0       1       2       3

        let approveStatus = {
            '0': {
                text: '',
                style: 'status-green',
                icon: 'icon-submit'
            },
            '1': {
                text: '【待审批】',
                style: '',
                icon: 'icon-stamp'
            },
            '2': {
                text: '【审批通过】',
                style: 'status-green',
                icon: 'icon-stamp'
            },
            '3': {
                text: '【已驳回】',
                style: 'status-error',
                icon: 'icon-stamp'
            },
            '4': {
                text: '',
                style: currentLocation?'':'status-green',
                icon: 'icon-complete'
            }
        }

        let approveType = {
            ANY: "普通审批",
            ALL: "会签审批"
        }

        return (
            <React.Fragment>
                {
                    processData.length>0 && approveStatu != 0 && (
                        <div className={cx("approve")}>
                        <div className={cx("approve-hd")}>审批设置</div>
                        <div className={cx("approve-bd")}>
                            <div className={cx("step")}>
                                <span className={cx("step-line")}></span>
                                <span style={{width: lineWidth+'%'}} className={cx("step-line-current")}></span>
                                <ul className={cx("step-lst")}>
                                    {
                                        (dealJson && Object.keys(dealJson).length > 0) && (
                                            Object.keys(dealJson).map((key) => {
                                                let item = dealJson[key];
                                                return (
                                                    <li key={key} style={{width: width}} className={cx(["step-item",approveStatus[item.status].style])}>
                                                        <Icon type={approveStatus[item.status].icon}/>
                                                        <h3>{item.displayName}</h3>
                                                        <div className={cx("step-detail")}>
                                                            <p>{item.name != '1'?approveStatus[item.status].text+(approveType[item.type]?approveType[item.type]:''): null}</p>
                                                            <div className={cx("approve-per")}>
                                                                {
                                                                    item.items && item.name != '1' && item.items.length>0 && item.items.map((data) => {
                                                                        return (
                                                                            <dl>
                                                                                <dt>{data.operator} <span>{data.checkStatus?(data.checkStatus=='0'?(data.returned == '0'?'【驳回上一级】':'【驳回制单人】'):'【审批通过】'):"【待审批】"}</span></dt>
                                                                                <dd>{data.operateTime}</dd>
                                                                                {
                                                                                   data.rejectReason && (
                                                                                       <dd>{data.rejectReason}</dd>
                                                                                   )
                                                                                }
                                                                            </dl>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>)
                }

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    // vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncGetApproveStatus,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveProcess)
