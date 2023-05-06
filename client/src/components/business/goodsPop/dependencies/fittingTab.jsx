import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { InputNumber, Input } from 'antd';

import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actions as fittingActions} from "../../../../pages/fitting/index";
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable';
import Pagination from 'components/widgets/pagination';
import {AddPkgOpen} from "components/business/vipOpe";
import FilterToolBar from "../../filterToolBar/views";
import {getCookie} from 'utils/cookie';

const cx = classNames.bind(styles);

function difference(first, second) {
    var out = [];
    var idx = 0;
    var firstLen = first.length;
    var secondLen = second.length;
    var toFilterOut = new Set([]);

    for (var i = 0; i < secondLen; i += 1) {
        toFilterOut.add(second[i]);
    }

    while (idx < firstLen) {
        if (!toFilterOut.has(first[idx])) {
            out[out.length] = first[idx];
        }
        idx += 1;
    }
    return out;
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Search = Input.Search;

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {

    save = (value) => {
        const { record, handleSave } = this.props;
        handleSave({ ...record, num:value });
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                <div className={"tb-input-wrap"}>
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            initialValue: record[dataIndex],
                                            rules: [{
                                                validator: (rules, value, callback) => {
                                                    let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
                                                    let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                    if (Number.isNaN(value) || !reg.test(value)) {
                                                        callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                    }
                                                    callback();
                                                }
                                            }],
                                        })(
                                            <InputNumber onChange={this.save} />
                                        )}
                                    </FormItem>
                                </div>
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class FittingTab extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            condition: this.props.condition||{}
        }
    }
    componentDidMount(){
        this.fetchData()
    }

    fetchData = (param)=>{
        let params = param || this.props.condition || null;
        this.props.asyncFetchFittingList(params, ()=> {
            this.onSelectRowChange(this.props.selectedFittingRowKeys, this.props.selectedFittingRows);
        });
    }

    onSelectRowChange = (newSelectedRowKeys,newSelectedRows) => {
        let {selectedRowKeys} = this.state;
        if(newSelectedRowKeys.length > selectedRowKeys.length){
            let diffSelectedRowKeys = difference(newSelectedRowKeys, selectedRowKeys);
            let record = newSelectedRows.filter(item => diffSelectedRowKeys.indexOf(item.prodNo+item.bomCode||item.bomCode) !== -1);
            console.log(record,'setFittingList');
            record.forEach(item => {
                if(!item.num){
                    item.num = 1;
                }
                this.props.setFittingList(item);
            });
        }
        newSelectedRowKeys = newSelectedRows.map(item => item.key);

        this.setState({
            selectedRowKeys:newSelectedRowKeys,
            selectedRows:newSelectedRows
        });
        this.props.onSelectFittingRowChange(newSelectedRowKeys,newSelectedRows);
    };

    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage});
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
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
        this.fetchData(params);
    };

    selectRow = (event,record) => {
        if (event.target && event.target.nodeName !== "INPUT") {
            let {selectedRowKeys, selectedRows} = this.state;
            let currentIndex = selectedRowKeys.indexOf(record.key);
            if(currentIndex < 0){
                selectedRowKeys = [...selectedRowKeys, record.key];
                selectedRows = [...selectedRows, record];
            } else {
                selectedRowKeys.splice(currentIndex, 1);
                selectedRows.splice(currentIndex, 1)
            }
            this.onSelectRowChange(selectedRowKeys,selectedRows);
        }
    };

    handleSave  = (row) => {

        let {selectedRowKeys, selectedRows} = this.state;

        let currentIndex = selectedRowKeys.indexOf(row.key);
        if(selectedRowKeys.length!=0&&currentIndex!==-1){
            selectedRows[currentIndex].num = row.num;
            this.props.onSelectFittingRowChange(selectedRowKeys,selectedRows);
            this.setState({selectedRows});
        }
        this.props.setFittingList(row);
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
        this.fetchData(params)
    };

    onSearch = (value) => {
        this.doFilter({key: value}, false);
        //this.filterToolBarHanler.reset();
    };


    render(){
        let columns = [
            {title: intl.get("components.goodsPop.fittingTab.serial"),dataIndex: 'serial',key: 'serial', width: 70},
            {title: intl.get("components.goodsPop.fittingTab.bomCode"),dataIndex: 'bomCode',key: 'bomCode', width: 110},
            {title: intl.get("components.goodsPop.fittingTab.bomVersion"),dataIndex: 'bomVersion',key: 'bomVersion', width: 70},
            {title: intl.get("components.goodsPop.fittingTab.displayCode"),dataIndex: 'displayCode', width: 110},
            {title: intl.get("components.goodsPop.fittingTab.prodName"),dataIndex: 'prodName', width: 300},
            {title: intl.get("components.goodsPop.fittingTab.description"),dataIndex: 'description', width: 300},
            {title: intl.get("components.goodsPop.fittingTab.brand"),dataIndex: 'brand', width: 80},
            {title: intl.get("components.goodsPop.fittingTab.produceModel"),dataIndex: 'produceModel', width: 100},
            {title: intl.get("components.goodsPop.fittingTab.num"),dataIndex: 'num',editable:true, width: 120},
        ];
        columns = columns.map((col) => {
            if (!col.editable) {
                if(!col.render){
                    col.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const {fittingList} = this.props;
        let dataSource = fittingList.getIn(['data','list']);
        dataSource = dataSource? dataSource.toJS():[];
        let paginationInfo = fittingList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        let vipInfo = fittingList.getIn(['data','vipInfo']);
        /**
         * vipState
         * NOT_OPEN 未开通
         * EXPIRED 已到期
         * TRY 试用中
         * OPENED 服务中
         */
        vipInfo = vipInfo?vipInfo.toJS():{};

        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            type:'checkbox',
            onChange: this.onSelectRowChange,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        const filterDataSource = {
            prefixComponents: [
                <div className={cx(["list-search"])}>
                    <Search
                        placeholder={"BOM编号/成品物品/规格型号"}
                        onSearch={this.onSearch}
                        enterButton
                        allowClear={true}
                    />
                </div>
            ],
            inputComponents:[
                {
                    label:"node.multiBom.rowMaterial",
                    fieldName: 'rowMaterial',
                    placeholder:'原料编号/原料名称/规格型号'
                }
            ],
        };

        return (
            <React.Fragment>
                {
                    vipInfo && (
                        <React.Fragment>
                            {/*到期状态*/}
                            {
                                vipInfo.vipState === 'EXPIRED' && (
                                    <div className={cx("nodata-wrap")}>
                                        <p>
                                            <ExclamationCircleFilled style={{color:'#3388fa'}} className="mr5" />
                                            多级BOM已到期，欢迎续费继续使用。详询客服400 -6979-890（转1） 或 18402578025（微信同号）
                                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">立即续约</a>
                                        </p>
                                    </div>
                                )
                            }
                            {/*试用 和 已开通状态*/}
                            {
                                (vipInfo.vipState === 'TRY' || vipInfo.vipState === 'OPENED') && (
                                    <div>
                                        <div>
                                            <p>服务期：{moment(vipInfo.startTime).format('YYYY-MM-DD')} 至 {moment(vipInfo.endTime).format('YYYY-MM-DD')}</p>
                                            <p>多级BOM续约，详询客服：400-6979-890（转1）和18402578025（微信同号）
                                                <a style={{color:'#52d271'}} href="http://www.abiz.com/info/problem/63017.htm" target="_blank">查看详情</a>
                                                <a style={{color:'#52d271'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">在线客服</a>
                                            </p>
                                        </div>
                                        <br />
                                        <div>
                                            <p>
                                                若缺少BOM编号，请及时<a style={{color:'#52d271'}} href="/multiBom/list" target="_blank">完善</a>后再使用多级BOM
                                            </p>
                                        </div>
                                        <div className={cx("ope-bar-lst")}>
                                            <FilterToolBar
                                                dataSource={filterDataSource}
                                                doFilter={this.doFilter}
                                                ref={(child) => {
                                                    this.filterToolBarHanler = child;
                                                }}
                                            />
                                        </div>
                                        <div className="mt10">
                                            <ListModalTable dataSource={dataSource} columns={columns}
                                                            isNeedDrag={true}
                                                            rowSelection={rowSelection}
                                                            components={components}
                                                            pagination={false}
                                                            loading={fittingList.get('isFetching')}
                                            />
                                        </div>
                                        <div className="cf">
                                            <Pagination {...paginationInfo}
                                                        size="small"
                                                        onChange={this.onPageInputChange}
                                                        onShowSizeChange={this.onShowSizeChange}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            {/*未开通*/}
                            {
                                vipInfo.vipState === 'NOT_OPEN' && (
                                    <div className={cx("nodata-wrap")}>
                                        <p>
                                            <ExclamationCircleFilled style={{color:'#3388fa'}} className="mr5" />
                                            多级bom为增值服务，购买后可以继续使用。咨询电话：400-6979-890（转1）和18402578025（微信同号）

                                            <AddPkgOpen openVipSuccess={() => this.fetchData()}
                                                        source={'fitting'}
                                                        vipInfo={vipInfo}
                                                        style={{'display': 'inline-block', 'marginLeft': '20px'}}
                                                        render={() => (
                                                            <span style={{color:'#52d271', cursor: 'pointer'}}>
                                                                立即开通
                                                            </span>
                                                        )}
                                            />
                                        </p>
                                    </div>
                                )
                            }
                        </React.Fragment>
                    )
                }
            </React.Fragment>
        );
    }
}
const mapStateToProps = (state) => ({
    fittingList: state.getIn(['fittingIndex', 'fittingList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchFittingList:fittingActions.asyncFetchFittingList,
        setFittingList:fittingActions.setFittingList,
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(FittingTab)