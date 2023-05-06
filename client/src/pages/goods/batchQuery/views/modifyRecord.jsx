import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ResizeableTable} from 'components/business/resizeableTitle';
import Pagination from 'components/widgets/pagination';
import { asyncFetchBatchModifyList } from "../actions";

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import moment from "moment-timezone/index";
const cx = classNames.bind(styles);

/**
 *
 * @visibleName ModifyRecord（修改记录）
 * @author jinb
 */
const mapStateToProps = (state) => ({
    batchRecordList: state.getIn(['batchQueryIndex', 'batchRecordList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchBatchModifyList,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class ModifyRecord extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.fetchData();
    }

    fetchData = (page, perPage) => {
        let {productCode, batchNo} = this.props;
        if(productCode && batchNo){
            this.props.asyncFetchBatchModifyList({productCode, batchNo, page, perPage})
        }
    };

    onPageInputChange = (page, perPage) => {
        this.props.fetchData({params: {perPage, page}});
    };
    onShowSizeChange = (current, perPage) => {
        this.props.fetchData({params: {perPage, page: 1}});
    };


    render() {
        let { batchRecordList } = this.props;
        let dataSource = batchRecordList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = batchRecordList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let columns = [
            {
                title: "序号",
                dataIndex: 'serial',
                align: 'center',
                width: 60,
                render: (text, record, index) => <span>{index + 1}</span>
            },
            {
                title: "修改记录",
                dataIndex: 'operation',
                align: 'left',
                width: 600
            },
            {
                title: "修改时间",
                dataIndex: 'operatedTime',
                align: 'left',
                width: 150,
                render: (operationTime)=>{
                    return (<span>{operationTime ? moment(operationTime).format('YYYY-MM-DD') : ''}</span>)
                }
            },
            {
                title: "修改人",
                dataIndex: 'operatedLoginName',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            }
        ];

        return (
            <div className="detail-table-wrap">
                <ResizeableTable
                    loading={batchRecordList.get('isFetching')}
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    pagination={false}
                    scroll={{x: 'auto'}}
                />
                <div style={{ marginTop: '10px', overflow: 'hidden'}}>
                    <Pagination {...paginationInfo}
                                onChange={this.onPageInputChange}
                                onShowSizeChange={this.onShowSizeChange}
                    />
                </div>
            </div>
        )
    }
}
