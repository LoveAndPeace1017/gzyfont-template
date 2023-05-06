import React, { Component } from 'react';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import { format } from 'date-fns'
const cx = classNames.bind(styles);

export function NoData() {
    return (
        <div className={cx('no-goods')}>
            <span className={cx('no-goods-logo')}/>
            <span className={cx('no-goods-words')}>暂无数据〜</span>
        </div>
    )
}

export function repeatProductListRow(rowData, sectionID, rowID) {
    return (
        <div key={rowID} className={cx('repeat-product-item')}>
            <React.Fragment>
                <div className={cx('r-left')}>
                    <img src={rowData.picUrl} />
                </div>
                <div className={cx('r-right')}>
                    <div className={cx('name')}>{rowData.prodName}</div>
                    <div className={cx('address')}>操作日期：{format(rowData.updateTime, 'YYYY-MM-DD')}</div>
                </div>
            </React.Fragment>
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