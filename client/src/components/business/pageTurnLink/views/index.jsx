import React, {Component} from 'react';
import {Breadcrumb} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";

import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import PropTypes from  'prop-types';

/**
 * 面包屑
 *
 * @visibleName Crumb（翻页链接）
 * @author gaozhiyuan
 */

/**
 * data 当前列表的总数据源
 * current 当前一列数据源
 * type 类型
 * linkdata 链接参数
 * showdata 展示表现参数
 **/
class PageTurnLink extends Component {

    saveData = () =>{
        const {data, type, linkdata} = this.props;
        let allDataLink = [];
        data&&data.forEach((item)=>{
            allDataLink.push(item[linkdata]+'')
        });
        const storage = window.localStorage;
        storage.setItem(type+'link',JSON.stringify(allDataLink));
    }

    render() {
        const {type, linkdata, showdata,current} = this.props;
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

        url = url+current[linkdata];

        return (
            <Link onClick={this.saveData} to={url} ga-data={"list-billNo"}>{current[showdata]}</Link>
        )
    }
}

export default withRouter(PageTurnLink)