import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Dropdown, Layout, Table, Menu, message, Modal,
} from 'antd';

const confirm = Modal.confirm;
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {actions as inquiryActions} from '../index';
import {actions as commonActions} from "components/business/commonRequest";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {parse} from 'url'

import {DeleteMenu} from "components/business/authMenu";
import QuoteListPop from "./quoteList";
import ListTable from 'components/business/listTable';
const cx = classNames.bind(styles);

export class Index extends Component {
    constructor(props) {
        super(props);
        const TITLE = props.initListCondition.getIn(['data', 'TITLE']);
        let condition = {};
        let selectedRowKeys = [];
        let filterToolBarVisible = false;
        let checkResultVisible = false;
        if (TITLE === 'inquiry') {
            condition = props.initListCondition.getIn(['data', 'condition']) || {};
            selectedRowKeys = props.initListCondition.getIn(['data', 'selectedRowKeys']) || [];
            filterToolBarVisible = props.initListCondition.getIn(['data', 'filterToolBarVisible']) || false;
            checkResultVisible = props.initListCondition.getIn(['data', 'checkResultVisible']) || false;
        }
        this.state = {
            selectedRowKeys, // Check here to configure the default column
            listToolBarVisible: true,
            filterToolBarVisible,
            quotePopListVisible: false,
            quoteForInquiryId: '',
            defaultSearchText: '',
            statistic: {
                count: 0,
                countMonth: 0,
                countToday: 0
            },
            checkResultVisible,
            condition,
            resultList: [],
            curPage: 1,
            isEmptyList: false
        };
    }

    componentDidMount() {
        //初始化列表数据
        this.fetchData();
    }

    componentWillUnmount() {
        let {condition, selectedRowKeys, filterToolBarVisible, checkResultVisible} = this.state;
        this.props.asyncFetchInitListCondition({TITLE: 'inquiry', condition, selectedRowKeys, filterToolBarVisible, checkResultVisible});
    }

    fetchData = () => {
        this.props.asyncFetchInquiryList({key: this.state.condition.key}, (data) => {
            if (data && data.retCode == 0) {
                this.setState({
                    isEmptyList: data.list.length == 0
                });

                this.onSearch(this.state.condition.key);
            }
        });
    };

    // 是否显示筛选条件
    toggleFilter = () => {
        this.setState({
            filterToolBarVisible: !this.state.filterToolBarVisible
        });
    };

    refresh = () => {
        this.props.asyncFetchInquiryList(this.state.condition);
    };

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({
            selectedRowKeys,
            checkResultVisible: selectedRowKeys.length > 0
        });
    };
    // 清除选中项
    checkRemove = () => {
        this.setState({
            selectedRowKeys: [],
            checkResultVisible: false
        })
    };

    //选中项批量删除
    batchDelete = () => {
        let _this = this;
        this.deleteConfirm(this.state.selectedRowKeys, function () {
            _this.checkRemove(_this.state.condition, () => _this.checkRemove());
        });
    };

    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            let key = params.key;
            params = condition;
            if (key && (typeof params.key === "undefined")) {
                params.key = key;
            }
        } else {
            params = {
                ...params,
                ...condition
            }
        }
        this.setState({
            condition: params,
        });

        this.props.asyncFetchInquiryList(params);
    };

    onSearch = (value) => {
        let resultRet;
        if (!value) {
            resultRet = this.props.inquiryList.getIn(['data', 'list'])
        } else {
            const inquiryList = this.props.inquiryList.getIn(['data', 'list']);
            resultRet = inquiryList.filter((item) => {
                return item.infoTitle.indexOf(value) !== -1 || item.prodNames.indexOf(value) !== -1
            });

        }
        resultRet.forEach((item, index) => item.serial = index + 1);
        this.setState({
            resultList: resultRet,
            curPage: 1,
            condition: {key: value}
        });

        // this.doFilter({key: value}, true);
        // this.filterToolBarHanler.reset();
    };

    onPageInputChange = (page) => {
        this.doFilter({page});
    };

    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    closeModal = (key) => {
        this.setState({
            [key]: false
        });
    };

    openModal = (key) => {
        this.setState({
            [key]: true
        });
    };

    deleteConfirm = (ids, callback) => {
        let _this = this;
        confirm({
            title: intl.get("inquiry.index.index.warningTip"),
            content: intl.get("inquiry.index.index.deleteConfirmContent"),
            onOk() {
                _this.props.asyncDeleteInquiryInfo(ids, function (res) {
                    if (res.retCode == 0) {
                        message.success(intl.get("inquiry.index.index.deleteSuccessMessage"));
                        _this.fetchData()
                        if (callback) {
                            callback();
                        }
                    } else {
                        alert(res.retMsg);
                    }
                });
            },
            onCancel() {
            },
        });
    };

    onPageChange = (pagination) => {
        this.setState({
            curPage: pagination.current
        })
    };

    render() {
        const {inquiryList} = this.props;
        // let dataSource = inquiryList.getIn(['data', 'list']);
        // dataSource = dataSource || [];
        const dataSource = this.state.resultList || [];

        // let tableConfigList = inquiryList.getIn(['data', 'tableConfigList']);
        const tableConfigList = inquiryList.getIn(['data', 'tableConfigList']) || [];

        const localeInfo = this.state.isEmptyList ? {
            locale: {
                emptyText: this.state.isEmptyList ? (
                    <div style={{marginTop: '150px', marginBottom: '150px'}}>
                        <span>{intl.get("inquiry.index.index.msg1")}</span>
                        <a target="_blank" href={'https://www.abiz.com'}>www.abiz.com</a>
                        <span>{intl.get("inquiry.index.index.msg2")}</span>
                    </div>
                ) : undefined
            }
        } : {};
        // let paginationInfo = inquiryList.getIn(['data', 'pagination']);
        // paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let tempColumns = [];
        tableConfigList.forEach((item) => {
            const obj = {
                title: item.label,
                dataIndex: item.fieldName,
                key: item.fieldName,
                width: item.width
            };
            // if (item.fixed) {
            //     obj.fixed = item.fixed;
            // }

            switch (item.fieldName) {
                case 'infoTitle':
                    obj.render = (infoTitle, data) => (<Link to={`/inquiry/show/${data.inquiryId}`}>{infoTitle}</Link>);
                    break;
                case 'quotationNum':
                    obj.render = (quotationNum, data) => (<a onClick={() => {
                        this.setState({
                            quoteForInquiryId: data.inquiryId,
                            quotePopListVisible: true
                        })
                    }}>{quotationNum}</a>);
                    break;
                case 'addedTime':
                case 'effectiveTime':
                    //obj.defaultSortOrder = 'descend';
                    //obj.sorter = (prev, next) => prev[item.fieldName] - next[item.fieldName];
                    obj.render = (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>);
                    break;

            }

            tempColumns.push(obj);

        });
        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={
                <Menu>
                    <DeleteMenu module={"inquiry"} clickHandler={() => this.deleteConfirm([data.inquiryId])}/>
                </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {title: intl.get("inquiry.index.index.inquiry")},
                        {title: intl.get("inquiry.index.index.inquiryList")}
                    ]}/>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/inquiry/add"
                            addLabel={intl.get("inquiry.index.index.distribute")}
                            authModule={"inquiry"}
                            // onFilter={this.toggleFilter}
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={''}
                            searchPlaceHolder={intl.get("inquiry.index.index.placeholder")}
                        />
                        <CheckResult
                            module={"inquiry"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onDelete={this.batchDelete}
                        />
                    </div>
                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ListTable
                                columns={tempColumns}
                                operationColumn={operationColumn}
                                dataSource={dataSource}
                                rowSelection={rowSelection}
                                pagination={{
                                    pageSize: 20,
                                    current: this.state.curPage
                                }}
                                {...localeInfo}
                                onChange={this.onPageChange}
                                loading={this.props.inquiryList.get('isFetching')}
                            />
                            {/*<Pagination pageSizeOptions={['20', '100', '200']} style={{float: 'right'}} showSizeChanger showQuickJumper {...paginationInfo}*/}
                            {/*            onChange={this.onPageInputChange} onShowSizeChange={this.onShowSizeChange}/>*/}
                        </div>
                    </div>
                </div>
                <Modal
                    title={intl.get("inquiry.index.index.receiveOffer")}
                    visible={this.state.quotePopListVisible}
                    footer={null}
                    onCancel={() => {
                        this.closeModal('quotePopListVisible');
                    }}
                    width={800}
                    destroyOnClose={true}
                >
                    <QuoteListPop inquiryId={this.state.quoteForInquiryId}/>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    inquiryList: state.getIn(['inquiryIndex', 'inquiryList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInquiryList: inquiryActions.asyncFetchInquiryList,
        asyncDeleteInquiryInfo: inquiryActions.asyncDeleteInquiryInfo,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)