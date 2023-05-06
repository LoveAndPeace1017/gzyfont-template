import React, {Component} from 'react';
import {Breadcrumb,Tooltip} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";
import intl from 'react-intl-universal';
import Auxiliary from 'pages/auxiliary';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import moment from "moment";
import PropTypes from  'prop-types';

class NewProgress extends Component {


    constructor(props) {
        super(props);
        //设置内层颜色
        this.outerColor = ['#FFEEE5','#C7F8E0','#EEEEEE'];
        this.innerColor = ['#FF6D1E','#2DA66A','#9C9C9C'];

    }

    render() {
        const {width,top,left,index,data,status,actualFlag,type} = this.props;
        let colorlength = this.outerColor.length;
        let colorIndex = index % colorlength === 0 ? colorlength-1:(index % colorlength)-1;

        let outerColor = actualFlag?this.innerColor[colorIndex]:this.outerColor[colorIndex];

        let finishCount = data.finishCount || 0;
        let expectCount = data.expectCount || 0;
        let reportCount = data.reportCount || 0;
        let str = data.orderNo + " " +data.processName + finishCount+"/"+expectCount;
        let processStatus = status === 0?"下达":status === 1?"开工":status === 2?"完成":status === 3?"关闭":"未知状态";

        return (
            <React.Fragment>
                <div className={cx("process-dom")} style={{width: width+"px",top: top+"px",left: left+"px"}}>
                    <div className={data.actualEndDate && data.actualStartDate?cx("process-detail-mobile-lst"):cx("process-mobile-detail")}>
                        <ul>
                            <li>工序编号：<span style={{width: "200px"}} className={cx("long-txt")}>{data.processCode}</span></li>
                            <li>工序名称：<span style={{width: "200px"}} className={cx("long-txt")}>{data.processName}</span></li>
                            <li>工作中心：<span style={{width: "200px"}} className={cx("long-txt")}>{data.caName}</span></li>
                            <li>负责人：<span style={{width: "200px"}} className={cx("long-txt")}>{data.head}</span></li>
                            <li>状态：<span style={{width: "200px"}} className={cx("long-txt")}>{processStatus}</span></li>
                            <li>计划/完工/良品：<span style={{width: "200px"}} className={cx("long-txt")}>{expectCount}/{reportCount}/{finishCount}</span></li>
                        </ul>
                        <div className={cx("down-arrow")}></div>
                    </div>
                    <div className={cx("out")} style={{backgroundColor:outerColor}}>{actualFlag?str:null}</div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(NewProgress)