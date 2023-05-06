import React from 'react';
import styles from "../styles/reportSource.scss";
import classNames from "classnames/bind";
import {AttributeBlock} from 'components/business/attributeBlock';
import ReportHd from 'components/business/reportHd';
import intl from 'react-intl-universal';

const cx = classNames.bind(styles);

function ReportSource(props) {
    let {prodSourceName, prodInfoData, prodInfoClassNames} = props;
    return (
        <React.Fragment>
            <div className={cx('prod-info')}>

                <ReportHd
                    sourceLabel={intl.get('report.flowmeter.source')}
                    sourceName={prodSourceName}
                />
                <div className={cx("prod-info-wrap") + " cf"}>
                    <h2 className={cx('prod-title')}>{intl.get('report.flowmeter.lookInfo')}</h2>
                    <div className={cx('prod-detail')}>
                        {
                            prodInfoData ? <AttributeBlock data={prodInfoData} customClassName={prodInfoClassNames} /> : <span className={cx('prod-no-data')}>{intl.get('report.flowmeter.noGoods')}</span>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ReportSource;