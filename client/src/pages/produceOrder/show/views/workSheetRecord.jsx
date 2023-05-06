import React, {Component} from 'react';
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
        this.props.fetchData({activeKey: 'workSheetRecord', params: {perPage, page}});
    };
    onShowSizeChange = (current, perPage) => {
        this.props.fetchData({activeKey: 'workSheetRecord', params: {perPage, page: 1}});
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
                title: "工单编号",
                dataIndex: 'billNo',
                align: 'left',
                width: 150,
                sorter: (a, b) => a.billNo.localeCompare(b.billNo),
                render: (billNo) => (
                    <span className={cx("txt-clip")} title={billNo}>
                          <Link ga-data="list-billNo" to={`/productControl/show/${billNo}`}>{billNo}</Link>
                    </span>
                )
            },
            {
                title: "工单名称",
                dataIndex: 'sheetName',
                align: 'left',
                width: 150
            },
            {
                title: "生产物品",
                dataIndex: 'prodName',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            },
            {
                title: "计划开始时间",
                dataIndex: 'expectStartDate',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column',
                sorter: (a, b) => a.expectStartDate - b.expectStartDate,
                render: (expectStartDate)=>{
                    return (<span>{expectStartDate ? moment(expectStartDate).format('YYYY-MM-DD') : ''}</span>)
                }
            },
            {
                title: "计划结束时间",
                dataIndex: 'expectEndDate',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column',
                sorter: (a, b) => a.expectEndDate - b.expectEndDate,
                render: (expectEndDate)=>{
                    return (<span>{expectEndDate ? moment(expectEndDate).format('YYYY-MM-DD') : ''}</span>)
                }
            },
            {
                title: "部门",
                dataIndex: 'departmentName',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column'
            },
            {
                title: "员工",
                dataIndex: 'officerName',
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
