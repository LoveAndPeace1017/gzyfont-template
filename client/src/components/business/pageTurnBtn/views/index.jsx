import React, {Component} from 'react';
import {Breadcrumb,Button} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";

import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import PropTypes from  'prop-types';

/**
 * 面包屑
 *
 * @visibleName Crumb（翻页按钮）
 * @author
 */


class PageTurnBtn extends Component {


    render() {
        const {type,current} = this.props;
        let url = '';
        switch(type){
            case 'sale':
                url = '/sale/show/';
                break
            case 'quotation':
                url = '/quotation/show/';
                break
            case 'purchase':
                url = '/purchase/show/';
                break
            case 'inbound':
                url = '/inventory/inbound/show/';
                break
            case 'outbound':
                url = '/inventory/outbound/show/';
                break
            case 'scheduling':
                url = '/inventory/scheduling/show/';
                break
            case 'stocktaking':
                url = '/inventory/stocktaking/show/';
                break
            case 'expend':
                url = '/finance/expend/show/';
                break
            case 'income':
                url = '/finance/income/show/';
                break
            case 'invoice':
                url = '/finance/invoice/show/';
                break
            case 'saleInvoice':
                url = '/finance/saleInvoice/show/';
                break
        }
        const storage = window.localStorage;
        let getData = JSON.parse(storage.getItem(type+'link'));
        let index = getData && getData.indexOf(current);
        if(getData == null || getData == undefined || index == -1){
            return null;
        }
        let str;
        if(index == 0 && (index != getData.length-1)){
            str = <div className={cx("wild-lst")}>
                    <div className={cx(["upPage","ant-pagination-disabled"])}>
                        <a className={cx(["ant-pagination-item-link"])}>
                            <i aria-label="图标: left" className="anticon anticon-left">
                                <svg viewBox="64 64 896 896" className="" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                                </svg>
                            </i>
                        </a>
                    </div>

                    <Link key={"2"} to={url+getData[index+1]}>
                        <div className={cx("upPage")}>
                            <a className={cx("ant-pagination-item-link")}>
                                <i aria-label="图标: right" className="anticon anticon-right">
                                    <svg viewBox="64 64 896 896" className="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
                                    </svg>
                                </i>
                            </a>
                        </div>
                    </Link>
                  </div>
        }else if(index == getData.length-1 && (index != 0)){
            str = <div className={cx("wild-lst")}>
                    <Link key={"1"} to={url+getData[index-1]}>
                        <div className={cx(["upPage"])}>
                            <a className={cx(["ant-pagination-item-link"])}>
                                <i aria-label="图标: left" className="anticon anticon-left">
                                    <svg viewBox="64 64 896 896" className="" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                                    </svg>
                                </i>
                            </a>
                        </div>
                    </Link>

                    <div className={cx(["upPage","ant-pagination-disabled"])}>
                        <a className={cx("ant-pagination-item-link")}>
                            <i aria-label="图标: right" className="anticon anticon-right">
                                <svg viewBox="64 64 896 896" className="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
                                </svg>
                            </i>
                        </a>
                    </div>

                  </div>
        }else if(index == 0 && (index == getData.length-1)){
            str =
                <div className={cx("wild-lst")}>
                        <div className={cx(["upPage","ant-pagination-disabled"])}>
                            <a className={cx(["ant-pagination-item-link"])}>
                                <i aria-label="图标: left" className="anticon anticon-left">
                                    <svg viewBox="64 64 896 896" className="" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                                    </svg>
                                </i>
                            </a>
                        </div>

                        <div className={cx(["upPage","ant-pagination-disabled"])}>
                            <a className={cx("ant-pagination-item-link")}>
                                <i aria-label="图标: right" className="anticon anticon-right">
                                    <svg viewBox="64 64 896 896" className="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
                                    </svg>
                                </i>
                            </a>
                        </div>
                </div>
        }else {
            str =
                <div className={cx("wild-lst")}>
                    <Link key={"1"} to={url+getData[index-1]}>
                    <div className={cx(["upPage"])}>
                        <a className={cx(["ant-pagination-item-link"])}>
                            <i aria-label="图标: left" className="anticon anticon-left">
                            <svg viewBox="64 64 896 896" className="" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                            </svg>
                            </i>
                        </a>
                    </div>
                    </Link>
                    <Link key={"2"} to={url+getData[index+1]}>
                    <div className={cx("upPage")}>
                        <a className={cx("ant-pagination-item-link")}>
                            <i aria-label="图标: right" className="anticon anticon-right">
                            <svg viewBox="64 64 896 896" className="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
                            </svg>
                            </i>
                        </a>
                    </div>
                    </Link>
                </div>
        }
        return (
            str
        )
    }
}

export default withRouter(PageTurnBtn)