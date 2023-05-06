import React, {Component} from 'react';
import {Menu, Dropdown, Spin} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {ResizeableTable} from 'components/business/resizeableTitle';
import Pagination from 'components/widgets/pagination';
import {Link} from 'react-router-dom';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import moment from "moment-timezone/index";
const cx = classNames.bind(styles);


export default class Index extends Component {
    constructor(props) {
        super(props);
    }

    onPageInputChange = (page, perPage) => {
        this.props.fetchData({activeKey: 'productInboundRecord', params: {perPage, page}});
    };
    onShowSizeChange = (current, perPage) => {
        this.props.fetchData({activeKey: 'productInboundRecord', params: {perPage, page: 1}});
    };


    render() {
        const {dataSource, paginationInfo} = this.props;

        let columns = [
            {
                title: "序号",
                dataIndex: 'serial',
                align: 'center',
                width: 60,
                render: (text, record, index) => <span>{index + 1}</span>
            },
            {
                title: "入库单号",
                dataIndex: 'displayBillNo',
                align: 'left',
                width: 150,
                sorter: (a, b) => a.displayBillNo.localeCompare(b.displayBillNo),
                render: (displayBillNo, record) => (
                    <span className={cx("txt-clip")} title={displayBillNo}>
                          <Link ga-data="list-billNo" to={`/inventory/inbound/show/${record.billNo}`}>{displayBillNo}</Link>
                    </span>
                )
            },
            {
                title: "入库日期",
                dataIndex: 'enterDate',
                align: 'left',
                width: 150,
                sorter: (a, b) => a.enterDate - b.enterDate,
                render: (enterDate)=>{
                    return (<span>{enterDate ? moment(enterDate).format('YYYY-MM-DD') : ''}</span>)
                }
            },
            {
                title: "仓库",
                dataIndex: 'warehouseName',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            },
            {
                title: "物品概述",
                dataIndex: 'prodAbstract',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column',
                render: (prodAbstract, data) => (
                    <Dropdown
                        onVisibleChange={(visible) => this.props.loadWare(visible, data.billNo, 'productInboundRecord')}
                        overlay={() => (
                            <Menu className={cx('abstract-drop-menu')}>
                                <Menu.Item>
                                    <Spin
                                        spinning={data.prodAbstractIsFetching}
                                    >
                                        <div className={cx("abstract-drop")}>
                                            <div className={cx("tit")}>成品概述</div>
                                            <ul>
                                                {
                                                    data.prodAbstractList && data.prodAbstractList.map((item, index) =>
                                                        <li key={index}>
                                                            <span className={cx('prod-tit')}>{item.prodName}</span>
                                                            <span className={cx('prod-desc')}>{item.descItem}</span>
                                                            <span className={cx('amount')}>x{item.quantity}</span>
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </Spin>
                                </Menu.Item>
                            </Menu>
                        )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={prodAbstract}>{prodAbstract}</span>
                                <DownOutlined className="ml5" />
                            </span>
                    </Dropdown>
                )
            },
            {
                title: "部门",
                dataIndex: 'otherEnterWarehouseName',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column'
            },
            {
                title: "员工",
                dataIndex: 'otherEnterWarehouseContacterName',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column'
            },
            {
                title: "供应商",
                dataIndex: 'supplierName',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column'
            }
        ];

        return (
            <div className="detail-table-wrap">
                <ResizeableTable
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    pagination={false}
                    loading={false}
                    scroll={{x: 'auto'}}
                />
                <Pagination {...paginationInfo}
                            onChange={this.onPageInputChange}
                            onShowSizeChange={this.onShowSizeChange}
                />
            </div>
        )
    }
}
