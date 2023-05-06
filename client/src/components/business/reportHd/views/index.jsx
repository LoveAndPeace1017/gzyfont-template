import React, {Component} from 'react';
import Icon from 'components/widgets/icon';
import {
    InfoCircleFilled
} from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import {getCookie} from 'utils/cookie';

export default class ReportHd extends Component {

    render() {
        let {listIntroduce,deliveryInfo} = this.props;
        return (
            <div className={cx('report-source')}>
                <div className={cx("report-source-wrap")}>
                    <InfoCircleFilled style={{color:"#06d",fontSize:"16px"}}/>
                    <span className={cx('source-tit')}> {this.props.sourceLabel}:</span>
                    <span className={cx('source-content')}>{this.props.sourceName}</span>
                    {
                        listIntroduce && listIntroduce.map((item)=>{
                            return <p style={{paddingLeft: "30px"}}>{item}</p>
                        })
                    }
                    {
                        deliveryInfo && (<div className={cx("delivery-div")}>
                            <span className={cx("delivery-title")}>送货单信息：</span>
                            <span>购买单位：{deliveryInfo.company}</span>
                            <span className={cx("address-info")}>供货单位：{deliveryInfo.comName}</span>
                            <span className={cx("address-info")}>交货地址：{deliveryInfo.address}</span>
                        </div>)
                    }
                </div>
            </div>
        )
    }
}

