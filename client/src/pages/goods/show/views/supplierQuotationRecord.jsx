import React, {Component} from 'react';
import { Resizable } from 'react-resizable';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Table, message} from 'antd';
import {EditSuppliyQuotationModal} from 'components/business/supplierQuotation';
import {actions as supplierAddActions} from 'pages/supplier/add';
import Pagination from 'components/widgets/pagination';
import {asyncDeleteSupplierQuotation, asyncFetchSupplierQuotationRecord} from '../actions';
import {asyncAddQuotationGoods} from '../../add/actions';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {Modal} from "antd/lib/index";
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

export class Record extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            setId: '',
            perPage: 20,
            page: 1,
            sortInfo: {},
            editSupplyQuotationVisible: false,
            data: {}
        }
    }

    componentDidMount() {
        this.fetchData();
        this.props.onRef && this.props.onRef(this);
        let recordColumns = [{
            title: "序号",
            width: 50,
            dataIndex: 'serial',
            className: 'ant-table-selection-column',
            render: (text, record, index) => (
                <span className="txt-clip">
                    {index + 1}
                 </span>
            )
        }
        , {
            title: "供应商",
            width: 200,
            dataIndex: 'supplierName',
            sorter: true,
        }, {
            title: "联系人",
            width: 100,
            dataIndex: 'supplierContacterName'
        },{
            title: "联系电话",
            width: 150,
            dataIndex: 'supplierMobile'
        },{
            title: "报价日期",
            width: 150,
            dataIndex: 'quotationDate',
            sorter: true,
            render: (text) => (
                <span className="txt-clip">
                    {text ? moment(text).format('YYYY-MM-DD') : null}
                 </span>
            )
        }, {
            title: "报价数量",
            width: 100,
            dataIndex: 'quantity',
        }, {
            title: "单位",
            width: 80,
            dataIndex: 'unit',
        }, {
            title: "含税单价",
            width: 100,
            dataIndex: 'unitPrice',
            sorter: true
        },{
            title: "税率",
            width: 80,
            dataIndex: 'taxRate',
            render: (text) => (
                <span className="txt-clip">
                    { text }%
                </span>
            )
        },{
            title: "价税合计",
            width: 150,
            dataIndex: 'amount',
            sorter: true
        }, {
            title: "价格有效期",
            width: 150,
            dataIndex: 'expiredDate',
            render: (text) => (
                <span className="txt-clip">
                    {text ? moment(text).format('YYYY-MM-DD') : null}
                 </span>
            )
        }, {
            title: "备注",
            width: 300,
            dataIndex: 'remarks'
        },{
            title: "操作",
            key: 'operate',
            dataIndex: 'operate',
            width: 150,
            fixed: 'right',
            render: (value, record) => {
                let { id } = record;
                return (
                    <React.Fragment>
                        <a href="#!" onClick={() => this.handleEdit(id,record)}>修改</a>
                        <span> | </span>
                        <a href="#!" onClick={() => this.handleDelete(id)}>删除</a>
                    </React.Fragment>
                )
            }
        }];

        this.setState({
            columns: recordColumns
        })
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    handleEdit = (id,data)=>{
        this.setState({
            data
        },()=>{
            this.openModal('editSupplyQuotationVisible');
        })
    }

    onPageInputChange = (page) => {
        this.setState({ page }, () => {
            this.fetchData();
        });
    };

    onShowSizeChange = (page, perPage) => {
        this.setState({ page, perPage }, () => {
            this.fetchData();
        });
    };

    openModal=(visibleType)=>{
        this.setState({
            [visibleType]: true
        })
    };

    closeModal=(visibleType)=>{
        this.setState({
            [visibleType]: false
        })
    };

    handleDelete = (id) => {
        let _this = this;
        Modal.confirm({
            title: '提示信息',
            content: '删除后将无法恢复，确定删除吗？',
            onOk() {
                _this.props.asyncDeleteSupplierQuotation([id], (res) => {
                    if(res.retCode === '0'){
                        message.success('操作成功');
                        _this.fetchData();
                    }
                });
            }
        });

    };

    fetchData = () => {
        let {perPage, page, sortInfo} = this.state;
        let params = {
            recordFor: this.props.recordFor,
            perPage, page,
            ...sortInfo
        };
        this.props.asyncFetchSupplierQuotationRecord(params);
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.recordFor!=this.state.setId) {
            this.setState({setId: this.props.recordFor});
            this.fetchData();
        }
    }

    onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
        let {field, order} = sorter;
        let sortKey = `${field}Flag`;
        this.setState({sortInfo : {[sortKey]:  order === 'ascend' ? 0 : 1}}, () => {
            this.fetchData();
        })
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
        const {recordList} = this.props;
        console.log(recordList && recordList.toJS(), 'recordList');
        let paginationInfo = recordList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo || {};

        const recordDataSource = (recordList && recordList.getIn(['data', 'data'])) || [];

        let tableWidth = this.state.columns && this.state.columns.reduce(function(width, item) {
            return width + item.width;
        }, 0);

        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));

        return (
            <React.Fragment>
                <Table
                    bordered
                    columns={columns}
                    dataSource={recordDataSource}
                    components={this.components}
                    pagination={false}
                    loading={recordList.get('isFetching')}
                    scroll={{x: tableWidth}}
                    onChange={this.onChange}
                />
                <Pagination {...paginationInfo}
                            onChange={this.onPageInputChange}
                            onShowSizeChange={this.onShowSizeChange}
                />
                <EditSuppliyQuotationModal
                    visible={this.state.editSupplyQuotationVisible}
                    data={this.state.data}
                    goodsName={this.props.goodsName}
                    productCode={this.props.recordFor}
                    unitFlag={this.props.unitFlag}
                    asyncShowSupplier={this.props.asyncShowSupplier}
                    asyncAddQuotationGoods={this.props.asyncAddQuotationGoods}
                    onClose={()=>this.closeModal('editSupplyQuotationVisible')}
                    onOk={() => {
                        this.closeModal('editSupplyQuotationVisible');
                        this.fetchData();
                    }}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    recordList: state.getIn(['goodsShow', 'supplierQuotationRecord'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncShowSupplier: supplierAddActions.asyncShowSupplierForSelect,
        asyncAddQuotationGoods,
        asyncDeleteSupplierQuotation,
        asyncFetchSupplierQuotationRecord
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Record)