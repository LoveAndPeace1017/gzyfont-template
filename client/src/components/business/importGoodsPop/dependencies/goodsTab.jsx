import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Input, Table, Alert
} from 'antd';

const Search = Input.Search;

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import CnGoodsCate from "components/business/cnGoodsCate";
import {asyncFetchCnGoodsList} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import FilterToolBar from "../../filterToolBar/views";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import prodImg60 from 'images/prodImg60.png'
import Pagination from 'components/widgets/pagination';
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable'

const cx = classNames.bind(styles);

class GoodsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            currentPageData: [],
            currentPageNum: 1,
            condition: {}
        }
    }

    getGoodsList = (params) => {
        this.props.asyncFetchCnGoodsList({...params});
    };

    componentDidMount() {
        this.getGoodsList(this.props.condition);
        console.log('componentDidMount:', this.props.selectedRowKeys, this.props.selectedRows);
        this.setState({
            selectedRowKeys: this.props.selectedRowKeys || [],
            selectedRows: this.props.selectedRows || [],
            condition: this.props.condition,
            originCondition: this.props.condition
        });
        // 强制更新父组件中的默认数据
        this.props.onSelectRowChange(this.props.selectedRowKeys, this.props.selectedRows);
    }

    onCategoryChange = (value) => {
        this.doFilter({group: value.key});
    };
    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = this.state.originCondition;
        }
        params = {
            ...params,
            ...condition
        };
        this.setState({
            condition: params
        });
        this.getGoodsList(params);
    };
    onSearch = (value) => {
        this.doFilter({key: value}, true);
        this.filterToolBarHanler.reset();
    };
    onPageInputChange = (page) => {
        this.doFilter({page});
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    updateSelectRows = (selectedRowKeys, selectedRows) => {
        console.log('updateSelectRows:', selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys,
            selectedRows
        });
        this.props.onSelectRowChange(selectedRowKeys, selectedRows);
    };

    onSelectAll = (selected, _selectedRows, changeRows) => {
        console.log('onSelectAll:', selected, _selectedRows, changeRows);
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];
        if (selected) {
            let keys = [];
            changeRows.forEach((item) => {
                keys.push(item.key);
            });
            selectedRowKeys = selectedRowKeys.concat(keys);
            selectedRows = selectedRows.concat(changeRows);
        }
        else {
            let firstKey = changeRows[0].key;
            let len = changeRows.length;
            const index = selectedRowKeys.indexOf(firstKey);
            selectedRowKeys.splice(index, len);
            selectedRows.splice(index, len);
        }
        this.setState({
            selectedRowKeys,
            selectedRows
        });
        this.updateSelectRows(selectedRowKeys, selectedRows);
    };
    // 点击多选框
    onRowSelect = (record, selected, _selectedRows, nativeEvent) => {
        console.log('onRowSelect:', record, selected, _selectedRows, nativeEvent);
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];

        if (selected) {
            selectedRowKeys.push(record.key);
            selectedRows.push(record);
        }
        else {
            let index = selectedRowKeys.indexOf(record.key);
            selectedRowKeys.splice(index, 1);
            selectedRows.splice(index, 1);
        }

        this.updateSelectRows(selectedRowKeys, selectedRows);
    };

    // 点击行
    selectRow = (event, record) => {
        if (event.target && event.target.nodeName !== "INPUT") {
            let selectedRowKeys = [...this.state.selectedRowKeys];
            let selected = selectedRowKeys.indexOf(record.key) < 0;
            this.onRowSelect(record, selected);
        }
    };

    render() {
        let columns = [
            {title: intl.get("components.importGoodsPop.goodsTab.serial"), dataIndex: 'serial', key: 'serial', width: constants.TABLE_COL_WIDTH.SERIAL},
            {
                title: intl.get("components.importGoodsPop.goodsTab.picUrls"), dataIndex: 'picUrls', width: 180, align: 'center',
                render: (text, data) => {
                    return (
                        <div className={cx("img-wrap")}>
                            <div className={cx("prod-img") + " sl-vam"}>
                                <div className="sl-vam-outer">
                                    <div className="sl-vam-inner">
                                        <img src={text && text[0] ? text[0] : prodImg60} alt={data.prodName}/>
                                    </div>
                                </div>
                            </div>
                            {
                                data.mainProdValue > 0 ? (
                                    <span className={cx("mark-primary") + " ui-status ui-status-primary"}>{intl.get("components.importGoodsPop.goodsTab.main")}</span>
                                ) : null
                            }
                        </div>
                    )
                }
            },
            {title: intl.get("components.importGoodsPop.goodsTab.prodName"), dataIndex: 'prodName'},
            {title: intl.get("components.importGoodsPop.goodsTab.groupName"), dataIndex: 'groupName', width: 235,},
            {
                title: intl.get("components.importGoodsPop.goodsTab.updateTime"), dataIndex: 'updateTime', width: constants.TABLE_COL_WIDTH.DATE,
                render: (text) => {
                    return text ? moment(text).format('YYYY-MM-DD') : null
                }
            }
        ];

        columns = columns.map((col) => {
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title
                }),
            };
        });

        const {cnGoodsList} = this.props;
        let dataSource = cnGoodsList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = cnGoodsList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        console.log('this.state.selectedRowKeys:', this.state.selectedRowKeys);

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            type: 'checkbox',
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        const filterDataSource = {
            prefixComponents: [
                <div className={cx(["list-search"])}>
                    <Search
                        placeholder={intl.get("components.importGoodsPop.goodsTab.placeholder")}
                        onSearch={this.onSearch}
                        enterButton
                        maxLength={100}
                    />
                </div>,
                <CnGoodsCate onChange={this.onCategoryChange}/>],
            datePickerComponents: [
                {
                    label: intl.get("components.importGoodsPop.goodsTab.updateTime"),
                    fieldName: 'updateTime',
                    type: "datePicker"
                }
            ]
        };
        return (
            <React.Fragment>
               {/* <div className={cx("tip-wrap")}>
                    <Alert message={<span className={cx("tip-txt")}>您选择的产品将导入到百卓优采云进销存物品库的[平台同步产品]分类中</span>}
                           type="info" showIcon/>
                </div>*/}
                <div className={cx("import-hd")}>{intl.get("components.importGoodsPop.goodsTab.chooseProd")}</div>
                <div className={cx("ope-bar") + " mt20"}>
                    <FilterToolBar
                        dataSource={filterDataSource}
                        doFilter={this.doFilter}
                        ref={(child) => {
                            this.filterToolBarHanler = child;
                        }}
                    />
                </div>
                <ListModalTable dataSource={dataSource}
                       columns={columns}
                       rowSelection={rowSelection}
                       onRow={
                           (record) => {
                               return {
                                   onClick: (event) => this.selectRow(event, record)
                               }
                           }
                       }
                       pagination={false}
                        paginationComponent={true}
                       loading={cnGoodsList.get('isFetching')}
                />
                <div className="cf">
                    <Pagination {...paginationInfo}
                                size="small"
                                onChange={this.onPageInputChange}
                                onShowSizeChange={this.onShowSizeChange}
                    />
                </div>
            </React.Fragment>
        )
    }
};
const mapStateToProps = (state) => ({
    cnGoodsList: state.getIn(['importGoodsPop', 'cnGoodsList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCnGoodsList
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(GoodsTab)