import React, {Component} from 'react';
import {
    Dropdown, Layout, Menu, message, Modal, Tooltip,
} from 'antd';
const confirm = Modal.confirm;
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {asyncFetchMrpCountList,asyncDeleteMrpCountInfo} from '../actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {Link} from "react-router-dom";
import {Choose} from 'pages/account/index';
import {ModifyMenu, DeleteMenu, DispatchMenu, ToggleVisibleMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage'
import moment from "moment-timezone/index";
import { DownOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

export class Index extends ListPage {
    constructor(props) {
        super(props);
        this.state = {
            listToolBarVisible: true,
            condition: {},
            selectedRowKeys: [],
            filterToolBarVisible: false,
            checkResultVisible: false
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchMrpCountList(params, callback);
    };

    componentDidMount() {
        let condition = {
            ...this.state.condition
        };
        this.setState({condition});
        //初始化列表数据
        this.fetchListData(condition,res=>{
            let filterConfigList = res && res.filterConfigList;
            this.props.dealFilterConfigList(filterConfigList);
        });
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
            checkResultVisible: selectedRowKeys.length > 0,
        });
    };

    batchUpdateConfig = (callback) => {
        callback && callback();
    }


    deleteConfirm = (ids, callback) => {
        let _this = this;
        console.log(ids,'ids');
        confirm({
            title: intl.get('common.confirm.title'),
            content: "删除模拟生产数据后，信息将无法恢复，确定删除吗？",
            onOk() {
                _this.props.asyncDeleteMrpCountInfo(ids, (res)=>{
                    if (res.retCode == 0) {
                        message.success("删除数据成功！");
                        let condition = {
                            ..._this.state.condition
                        };
                        _this.fetchListData(condition);
                        _this.checkRemove();
                    }else{
                        message.error(res.retMsg);
                    }
                });
            },
            onCancel() {
            },
        });
    };


    render() {
        const {mrpCountList} = this.props;
        let dataSource = mrpCountList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = mrpCountList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = mrpCountList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let paginationInfo = mrpCountList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        //不需要动态显隐
        //直接在页面写死
        filterConfigList = [{
            label: "report.inventory.time1",
            fieldName: 'time',
            fieldStartKey: 'dateStart',
            fieldEndKey: 'dateEnd',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker'/*,
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]*/
        },{
            label: "report.inventory.state",
            fieldName: 'status',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: [
                {label: '运算中', value: '0'},
                {label: '已完成', value: '1'},
            ]
        }
        ];
        let tempColumns = [];
        tableConfigList.forEach((item,index) => {
            if (item.visibleFlag) {
                let obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: index,
                    width: item.width
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                }
                if (item.fieldName === "billNo") {
                    obj.render = (billNo, data) => (
                        <span className={cx("txt-clip")} title={billNo}>
                            {
                                data.mrpStatus === 1?<Link to={`/productControl/mrpCount/show/${billNo}`}>{billNo}</Link>:<span>{billNo}</span>
                            }
                        </span>
                    )
                }else if(item.fieldName === "prodList"){
                    obj.render = (prodAbstract, data) => (
                        <Dropdown className={'list-sale-prodAbstract'}
                                  overlay={() => (
                                      <Menu className={cx('abstract-drop-menu') + ' list-prodAbstract'}>
                                          <Menu.Item>
                                                  <div className={cx("abstract-drop")}>
                                                      <div className={cx("tit")}>{intl.get("sale.index.index.prod_abstract")}</div>
                                                      <ul>
                                                          {
                                                              prodAbstract && prodAbstract.map((item, index) =>
                                                                  <li key={index}>
                                                                      <span className={cx('prod-tit')}>{item.prodName}</span>
                                                                      <span className={cx('prod-desc')}>{item.grossQuantity}</span>
                                                                  </li>
                                                              )
                                                          }
                                                      </ul>
                                                  </div>
                                          </Menu.Item>
                                      </Menu>
                                  )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'}>{prodAbstract && prodAbstract.length>0 && prodAbstract[0].prodName + "等" + prodAbstract.length + "项"}</span>
                                <DownOutlined className="ml5"/>
                            </span>
                        </Dropdown>
                    )
                }else if(item.fieldName === "addedTime"){
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                }else if(item.fieldName === "mrpStatus"){
                    obj.render = (mrpStatus) => (
                        <span className="txt-clip">
                            {mrpStatus === 0 ? "运算中":mrpStatus === 1? "已完成": "运算失败" }
                        </span>
                    )
                }
                tempColumns.push(obj);
            }
        });
        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={
                <Menu>
                    <DeleteMenu  clickHandler={() => this.deleteConfirm([data.billNo])}/>
                </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };


        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: []
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "生产管理"
                        },
                        {
                            title: "模拟生产列表"
                        }
                    ]}/>
                </div>

                <div className="content-index-bd">
                    <div className={cx("list-ope-wrap")}>
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/productControl/mrpCount/add"
                            searchTipsUrlPrefix={"/cgi/"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            searchTipsUrl={`/mrp/search/tips`}
                            searchPlaceHolder={"物品编号/物品名称"}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onDelete={this.batchDelete}
                        />
                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                       ref={(child) => {
                                           this.filterToolBarHanler = child;
                                       }}
                        />
                    </div>

                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ListTable
                                columns={tempColumns}
                                operationColumn={operationColumn}
                                dataSource={dataSource}
                                rowSelection={rowSelection}
                                loading={this.props.mrpCountList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    mrpCountList: state.getIn(['mrpCountReduceList', 'mrpCountList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchMrpCountList,
        asyncDeleteMrpCountInfo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)