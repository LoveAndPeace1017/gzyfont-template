import React, {Component} from 'react';
import {
    Dropdown, Layout, Menu, message, Modal, Tooltip,
} from 'antd';
const confirm = Modal.confirm;
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {asyncFetchMultiBomList,asyncDeleteMultiBomInfo} from '../actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {Link} from "react-router-dom";
import {Choose} from 'pages/account/index';
import {ModifyMenu, DeleteMenu, DispatchMenu, ToggleVisibleMenu, CopyMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage'
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
            curGoodsId: 0,
            batchAssignSubAccountVisible: false, // 批量选择物品分配子账号
            checkResultVisible: false
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchMultiBomList(params, callback);
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
    };

    deleteConfirm = (ids, callback) => {
        let _this = this;
        console.log(ids,'ids');
        confirm({
            title: intl.get('common.confirm.title'),
            content: "删除生产BOM数据后，信息将无法恢复，确定删除吗？",
            onOk() {
                _this.props.asyncDeleteMultiBomInfo(ids, (res)=>{
                    if (res.retCode == 0) {

                        if(res.data !== ids.length){
                            message.error("存在关联的单据，无法删除！");
                        }else{
                            message.success("删除数据成功！");
                            let condition = {
                                ..._this.state.condition
                            };
                            _this.fetchListData(condition);
                            _this.checkRemove();
                        }

                    }
                });
            },
            onCancel() {
            },
        });
    };

    assignSubAccount = (id) => {
        this.openModal('assignSubAccountVisible');
        this.setState({
            curGoodsId: id
        })
    };

    //批量分配给子账号
    batchAssignToSubAccount = () => {
        this.openModal('batchAssignSubAccountVisible');
    };

    render() {
        const {multiBomList} = this.props;
        let dataSource = multiBomList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = multiBomList.getIn(['data', 'filterConfigList']);
        // filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = multiBomList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let paginationInfo = multiBomList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        //不需要动态显隐
        //直接在页面写死
        filterConfigList = [{
            label: "node.multiBom.bom",
            fieldName: 'defaultFlag',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: [
                {label: '是', value: '1'},
                {label: '否', value: '0'},
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
                if (item.fieldName === "bomCode") {
                    obj.render = (bomCode, data) => (
                        <span className={cx("txt-clip")} title={bomCode}>
                              <Link to={`/multiBom/show/${data.recId}`}>{bomCode}</Link>
                        </span>
                    )
                }else if(item.fieldName === "defaultFlag"){
                    obj.render = (defaultFlag) => (
                        <span className={cx("txt-clip")}>
                            {defaultFlag?"是":"否"}
                        </span>
                    )
                }
                tempColumns.push(obj);
            }
        });
        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={
                <Menu>
                    <DeleteMenu module={"bom"} clickHandler={() => this.deleteConfirm([data.recId])}/>
                    <ModifyMenu module={"bom"} to={`/multiBom/modify/${data.recId}`}/>
                    <CopyMenu module={"bom"} to={`/multiBom/copy/${data.recId}`} />
                    <DispatchMenu module={"bom"} clickHandler={() => this.assignSubAccount(data.recId)}/>
                </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };


        const filterDataSource = {
            selectComponents: [],
            inputComponents:[
                {
                    label:"node.multiBom.rowMaterial",
                    fieldName: 'rowMaterial',
                    placeholder:'原料编号/原料名称/规格型号'
                },
                {
                    label: "node.multiBom.bomVersion",
                    fieldName: 'bomVersion',
                },
            ],
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        let prodIds = dataSource.filter(item=> {
            return selectedRowKeys.indexOf(item.key)!==-1
        }).map(item=> item.recId);

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "物品库"
                        },
                        {
                            title: "多级BOM"
                        }
                    ]}/>
                </div>

                <div className="content-index-bd">
                    <div className={cx("list-ope-wrap")}>
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/multiBom/add"
                            authModule={"bom"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            searchPlaceHolder={"BOM编号/成品物品/规格型号"}
                            searchTipsUrl={`/production-bom/search/tips`}
                            refresh={this.refresh}
                            importModule={
                                {
                                    module: "bom",
                                    text: intl.get("purchase.index.index.import"),
                                }
                            }
                        />
                        <CheckResult
                            module={"bom"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onDelete={this.batchDelete}
                            onDispatch={this.batchAssignToSubAccount}
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
                                loading={this.props.multiBomList.get('isFetching')}
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

                {/*分配子账号*/}
                <Choose
                    visible={this.state.assignSubAccountVisible}
                    getUrl={`/multiBom/subAccounts/${this.state.curGoodsId}`}
                    postUrl={`/multiBom/allocSubAccounts/${this.state.curGoodsId}`}
                    onClose={this.closeModal.bind(this, 'assignSubAccountVisible')}
                />

                {/*批量分配子账号*/}
                <Choose
                    pageType={'batchChoose'}
                    visible={this.state.batchAssignSubAccountVisible}
                    postUrl={`/multiBom/batch/allocSubAccounts`}
                    selectIds={prodIds}
                    onClose={this.closeModal.bind(this, 'batchAssignSubAccountVisible')}
                    onOk={this.checkRemove}
                />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    multiBomList: state.getIn(['multiBomIndex', 'multiBomList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchMultiBomList,
        asyncDeleteMultiBomInfo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)