import React, {Component} from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';

import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {auth} from 'utils/authComponent';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

export default class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
        }
    }

    componentDidMount() {
        let recordColumns = [
            {
                title: "物品编号",
                dataIndex: 'prodDisplayCode',
                align: 'left',
                width: 120,
                className: 'ant-table-selection-column'
            },
            {
                title: "物品名称",
                dataIndex: 'prodName',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            },
            {
                title: "规格型号",
                dataIndex: 'descItem',
                align: 'left',
                width: 250,
                className: 'ant-table-selection-column'
            },
            {
                title: "品牌",
                dataIndex: 'prodBrand',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            },
            {
                title: "制造商型号",
                dataIndex: 'produceModel',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            },
            {
                title: "计划产量",
                dataIndex: 'expectCount',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column'
            },
            {
                title: "良品数量",
                dataIndex: 'finishCount',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column'
            },
            {
                title: "不良数量",
                dataIndex: 'scrapCount',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column'
            },
            {
                title: "良品率",
                dataIndex: 'yieldRate',
                align: 'left',
                width: 80,
                className: 'ant-table-selection-column'
            }
        ];
        this.setState({
            columns: recordColumns
        })
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };

    render() {
        const {productList} = this.props;
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));
        let tableWidth = columns && columns.reduce(function(width, item) {
            return width + item.width;
        }, 0);

        return (
            <div className="detail-table-wrap">
                <Table
                    bordered
                    columns={columns}
                    dataSource={productList}
                    scroll={{x: tableWidth}}
                    components={this.components}
                    pagination={false}
                    loading={false}
                />
            </div>
        )
    }
}
