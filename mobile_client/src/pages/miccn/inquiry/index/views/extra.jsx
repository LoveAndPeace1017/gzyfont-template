import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import check from 'images/check.png';

const cx = classNames.bind(styles);

export function NoData() {
    return (
        <div className={cx('no-goods')}>
            <span className={cx('no-goods-logo')}/>
            <span className={cx('no-goods-words')}>暂无数据〜</span>
        </div>
    )
}

export function InquiryListRow(rowData, sectionID, rowID) {
    return (
        <div key={rowID} className={cx('inquiry-item')}>
            <Link to={`${PROD_PATH}/miccn/inquiry/${rowData.logonUserName}/${rowData.inquiryId}`}>
                <div className={cx('inq-left')}>
                    <div className={cx('name')}>
                        {rowData.infoTitle}
                        {
                            rowData.confirmStatus != 0 && (
                                <img src={check} className={cx('check-img')}/>
                            )
                        }
                    </div>
                    <div className={cx('amount')}>
                        采购量：
                        {
                            rowData.prodNum > 1 ? rowData.prodNum + '种': rowData.purchaseQuantity + rowData.purchaseUnitText
                        }
                    </div>
                    <div className={cx('address')}>{rowData.provCity}</div>
                </div>
                <div className={cx('inq-right')}>
                    <div className={cx('name')}><span className="red">{rowData.quotationNum}</span>条报价</div>
                    <div className={cx('amount')}>剩余{rowData.leftDay}天</div>
                    <div className={cx('address')}>报价截止日期：{rowData.effectiveTime}</div>
                </div>
            </Link>
        </div>
    );
}

export function RecommendInquiryListRow(rowData, sectionID, rowID) {
    return (
        <div key={rowID} className={cx('inquiry-item')}>
            <Link to={`${PROD_PATH}/miccn/inquiry/${rowData.logonUserName}/${rowData.inquiryIdEnc}`}>
                <div className={cx('inq-left')}>
                    <div className={cx('name')}>
                        {rowData.infoTitle}
                        {
                            rowData.confirmStatus != 0 && (
                                <img src={check} className={cx('check-img')}/>
                            )
                        }
                    </div>
                    <div className={cx('amount')}>采购量：{rowData.purchaseQuantity}{rowData.purchaseUnitText}</div>
                    <div className={cx('address')}>{rowData.provCity}</div>
                </div>
                <div className={cx('inq-right')}>
                    <div className={cx('name')}><span className="red">{rowData.quoNum}</span>条报价</div>
                    <div className={cx('amount')}>剩余{rowData.leftDay}天</div>
                    <div className={cx('address')}>报价截止日期：{rowData.effectiveTime}</div>
                </div>
            </Link>
        </div>
    );
}

export function QuotationListRow(rowData, sectionID, rowID) {
    return (
        <div key={rowID} className={cx('quotation-item')}>
            <Link to={`${PROD_PATH}/miccn/quotation/${rowData.quotationIdEnc}`}>
                <div className={cx('quo-left')}>
                    <div className={cx('name')}>{rowData.infoTitle}</div>
                    <div className={cx('amount')}>采购量：{rowData.purchaseQuantity}{rowData.purchaseUnitText}</div>
                </div>
                <div className={cx('quo-right')}>
                    <div className={cx('status')}>{rowData.status}</div>
                    <div className={cx('time')}>报价日期：{rowData.effectiveTime}</div>
                </div>
            </Link>
        </div>
    );
}

export function RenderFooter(isLoading) {
    return (
        (<div style={{ padding: 30, textAlign: 'center' }}>
            {isLoading ? 'Loading...' : '- 没有更多内容啦 -'}
        </div>)
    );
}