import React from 'react';
import intl from 'react-intl-universal';
import {Divider} from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";


const cx = classNames.bind(styles);

export default function OperatorLog(props) {
    let footInfo = (
        <div className={cx("operator-log-lst")}>
            <span className={cx('log')}>
                {intl.get("components.operatorLog.index.creator")+ "：" + (props.logInfo.creator || '')}
            </span>
            <span className={cx('log')}>
                {intl.get("components.operatorLog.index.createDate")+ "：" + (props.logInfo.createDate || '')}
            </span>
            {
                !props.logInfo.hideModifier && (
                    <React.Fragment>
                        <span className={cx('log')}>
                            {intl.get("components.operatorLog.index.lastModifier")+"：" + (props.logInfo.lastModifier || '')}
                        </span>
                        <span className={cx('log')}>
                            {intl.get("components.operatorLog.index.lastModifyDate")+ "：" + (props.logInfo.lastModifyDate || '')}
                        </span>
                    </React.Fragment>
                )
            }
            {
                props.logInfo.approveModuleFlag==1 && (
                    <React.Fragment>
                        <span className={cx('log')}>
                            {intl.get("components.operatorLog.index.approvedLoginName")+ "：" + (props.logInfo.approvedLoginName || '')}
                        </span>
                        <span className={cx('log')}>
                            {intl.get("components.operatorLog.index.approvedTime")+ "：" + (props.logInfo.approvedTime || '')}
                        </span>
                    </React.Fragment>
                )
            }
        </div>
    );

    return (
        <div className={cx("operator-log")}>
            {footInfo}
        </div>
    )
}
