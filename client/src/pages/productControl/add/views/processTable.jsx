import React, {Component} from 'react';
import _ from 'lodash';
import { Input, Table, Form, DatePicker, Select } from 'antd';
import {PlusOutlined,MinusOutlined,QuestionCircleOutlined} from '@ant-design/icons';
import AttachmentUpload from 'components/business/attachmentUpload';
import Tooltip from 'components/widgets/tooltip';
import Auxiliary from 'pages/auxiliary';
import {SelectEmployeeIdFix} from 'pages/auxiliary/employee';
import {SelectWorkCenter} from 'pages/auxiliary/workCenter';
import {SettlementAdd} from 'pages/auxiliary/workProcedure';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from "moment-timezone/index";
const cx = classNames.bind(styles);
import {getCookie} from 'utils/cookie';
import DiscountInput from "../../../../components/business/goods/dependencies/discountInput";
const {Option} = Select;
const {TextArea} = Input;

/**
 * 工序表格
 * @visibleName processTable（工序table）
 * @author jinb
 */
export default class ProcessTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentKey: 0,
            processList: [{key: 0}],
            processCodeData: [],
            processNameData: [],
            procedureAddVisible: false,
        };
        this.dataPrefix = this.props.dataPrefix;
    }

    componentDidMount(){
        this.props.getRef && this.props.getRef(this);
        this.props.asyncFetchProcessListByKey('', 0, (data)=>{
            let searchData = data.data;
            if(searchData && searchData.length > 0){
                this.setState({processNameData: searchData,processCodeData: searchData});
            }
        });
    }

    openModal = (type, auxiliaryKey, auxiliaryTabKey) => {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    };

    closeModal = (type) =>{
        this.setState({
            [type]: false
        })
    };

    // 初始化表单数据
    initFormData = (processList) => {
        let { setFieldsValue } = this.props.formRef.current;
        this.setState({
            processList,
            currentKey: processList.length -1
        }, () => {
            for(let i=0;i<processList.length;i++)
                setFieldsValue({[this.dataPrefix]: {[i]: {...processList[i]}}});
        });
    };

    // 添加规格属性
    addOneProcess = (index) => {
        let {processList, currentKey} = this.state;
        let newProcessList = _.cloneDeep(processList);
        newProcessList.splice(index+1, 0, {key: ++currentKey});
        this.setState({currentKey, processList: newProcessList});
    };

    // 删除规格属性
    removeOneProcess = (key) => {
        let {processList} = this.state;
        let newProcessList  = processList.filter(item => item.key !== key);
        this.setState({processList: newProcessList});
    };

    handleSearch = (value, key, name, callback) => {
        let flag = 0;
        if(name === 'processName') flag = 1;
        this.props.asyncFetchProcessListByKey(value, flag, (data)=>{
            let searchData = data.data;
            if(searchData && searchData.length > 0){
                this.setState({[name+'Data']: searchData});
            }
            callback && callback(searchData)
        });
    };

    handleSelect = (option, key) => {
        let { getFieldValue, setFieldsValue } = this.props.formRef.current;
        let {processCode, processName, caCode, officerId} = option.goods;
        let preItem = getFieldValue([this.dataPrefix, key]);
        //如果带出的负责人Id设置的是隐藏，清空对应的Id
        let employeeList = this.props.employeeList;
        employeeList = employeeList && employeeList.toJS();
        let employeeListData = employeeList.data.data;
        let atLastId = '';
        for(let i=0;i<employeeListData.length;i++){
            if(employeeListData[i].id === officerId){
                atLastId = officerId;
                break;
            }
        }
        setFieldsValue({[this.dataPrefix]: {[key]: {...preItem, processCode, processName, caCode, officerId:atLastId}}});
    };

    // 选择工作中心带出对应的负责人
    handleSelectByWorkCenter = (option, key) => {
        let { setFieldsValue } = this.props.formRef.current;
        let employeeList = this.props.employeeList;
        employeeList = employeeList && employeeList.toJS();
        let employeeListData = employeeList.data.data;
        let officerId = option.goods && option.goods.officerId;
        let atLastId = '';
        for(let i=0;i<employeeListData.length;i++){
            if(employeeListData[i].id === officerId){
                atLastId = officerId;
                break;
            }
        }
        //需要判断当前officerId是否设置了隐藏，如果是隐藏，显示为空
        setFieldsValue({[this.dataPrefix]: {[key]: {officerId:atLastId}}});
    };

    handleChangeForFile = (key, fileList) => {
        let { setFieldsValue } = this.props.formRef.current;
        let {fileMap, handleChangeForFileMap} = this.props;
        let fileIds = [];
        _.forEach(fileList, o=>{
            let fileId = o.response && o.response.fileId;
            if(fileId && !fileMap[fileId]){
                fileIds.push(fileId);
                fileMap[fileId] = o.name;
            }
        });
        if(fileIds.length > 0){
            setFieldsValue({[this.dataPrefix]: {[key]: {fileIds: _.join(fileIds, ',')}}});
            this.setState({flag : false});
        }
        if(fileList.length===0){
            setFieldsValue({[this.dataPrefix]: {[key]: {fileIds: ''}}});
            this.setState({flag : false});
        }
    };

    // 新建工序成功后的回调
    addProcessSuccessCallback = (values) => {
        let fieldName = this.currentFieldName;
        this.handleSearch(values[fieldName], this.currentKey, fieldName, (data) => {
            let goods = (data && data[0]) || {};
            this.handleSelect({goods}, this.currentKey);  // 填充数据
        });
    };

    render() {
        let {processList} = this.state;
        let { getFieldValue } = this.props.formRef.current;
        let { processCodeData, processNameData } = this.state;
        let { source, isCopy, fileMap, hideExpectStartDateFlag, hideExpectEndDateFlag, hideExpectCountFlag, hideWorkloadFlag,
            processCodeRequiredFlag, processNameRequiredFlag, caCodeRequiredFlag, officerIdRequiredFlag} = this.props;
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);

        let columns = [
            {
                title: '',
                key: 'ope',
                dataIndex: 'ope',
                width: 60,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            {
                                (processList.length >= 20 && source === 'bom') ? null : (
                                    <a href="#!" className={cx('add-item')} onClick={() => this.addOneProcess(index)}>
                                        <PlusOutlined style={{fontSize: "16px"}}/>
                                    </a>
                                )
                            }

                            {
                                processList.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')} onClick={() => this.removeOneProcess(record.key)}>
                                        <MinusOutlined style={{fontSize: "16px"}}/>
                                    </a>
                                ) : null
                            }
                            <div style={{display:"none"}}>
                                <Form.Item
                                    name={[this.dataPrefix, record.key, "id"]}
                                >
                                    <Input type="hidden"/>
                                </Form.Item>

                            </div>
                        </React.Fragment>
                    )
                }
            }, {
                title: '序号',
                dataIndex: 'serial',
                key: 'serial',
                width: 50,
                align: 'center',
                render: (text, record, index) => index + 1
            }, {
                title: '工序编号',
                dataIndex: 'processCode',
                width: 250,
                required: processCodeRequiredFlag,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[this.dataPrefix, record.key, "processCode"]}
                                rules={[
                                    {
                                        required: processCodeRequiredFlag,
                                        message: '工序编号为必填项',
                                    }
                                ]}>
                                <Select
                                    showSearch
                                    allowClear
                                    disabled={!isCopy && record.reports && record.reports.length > 0}
                                    defaultActiveFirstOption={false}
                                    onSearch={(val) => this.handleSearch(val, record.key, "processCode")}
                                    onSelect={(value, option) => this.handleSelect(option, record.key)}
                                    filterOption={false}
                                    dropdownStyle={{width: '250px'}}
                                    dropdownMatchSelectWidth={false}
                                    className={cx("suggest")}
                                    dropdownClassName={cx("suggest-dropdown")}
                                    optionLabelProp={"value"}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <div className={cx('dropdown-action') + " cf"}>
                                                <a href="#!" className="fl" onClick={()=> {
                                                    this.currentKey = record.key;
                                                    this.currentFieldName = 'processCode';
                                                    this.openModal('procedureAddVisible')
                                                }}>新建</a>
                                                <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'production', 'workProcedure')}>管理</a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {
                                        processCodeData && processCodeData.length>0 && processCodeData.map(item =>
                                            <Option
                                                key={item.processCode}
                                                value={item.processCode}
                                                goods={{...item}}
                                            >
                                                <div className={cx("prod-list")}>
                                                    <span className={cx("prod-no")}>{item.processCode}</span>
                                                    <span className={cx("prod-name")}>{item.processName}</span>
                                                </div>
                                            </Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            }, {
                title: '工序名称',
                dataIndex: 'processName',
                width: 250,
                required: processNameRequiredFlag,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                name={[this.dataPrefix, record.key, "processName"]}
                                rules={[
                                    {
                                        required: processNameRequiredFlag,
                                        message: '工序名称为必填项',
                                    }
                                ]}>
                                <Select
                                    showSearch
                                    allowClear
                                    disabled={!isCopy && record.reports && record.reports.length > 0}
                                    defaultActiveFirstOption={false}
                                    onSearch={(val) => this.handleSearch(val, record.key, "processName")}
                                    onSelect={(value, option) => this.handleSelect(option, record.key)}
                                    filterOption={false}
                                    dropdownStyle={{width: '250px'}}
                                    dropdownMatchSelectWidth={false}
                                    className={cx("suggest")}
                                    dropdownClassName={cx("suggest-dropdown")}
                                    optionLabelProp={"value"}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <div className={cx('dropdown-action') + " cf"}>
                                                <a href="#!" className="fl" onClick={()=> {
                                                    this.currentKey = record.key;
                                                    this.currentFieldName = 'processName';
                                                    this.openModal('procedureAddVisible')
                                                }}>新建</a>
                                                <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'production', 'workProcedure')}>管理</a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {
                                        processNameData && processNameData.length>0 && processNameData.map(item =>
                                            <Option
                                                key={item.processCode}
                                                value={item.processCode}
                                                goods={{...item}}
                                            >
                                                <div className={cx("prod-list")}>
                                                    <span className={cx("prod-no")}>{item.processCode}</span>
                                                    <span className={cx("prod-name")}>{item.processName}</span>
                                                </div>
                                            </Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            }, {
                title: "计划开始时间",
                dataIndex: 'expectStartDate',
                key: 'expectStartDate',
                width: 250,
                hidden: hideExpectStartDateFlag,
                // required: true,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            initialValue={text ? moment(text) : moment().add(1, 'minutes')}
                            name={[this.dataPrefix, record.key, 'expectStartDate']}
                            // rules={[
                            //     { type: 'object',required: true,message: "该项为必填项"},
                            //     {
                            //         validator: (rules, val, callback) => {
                            //             let expectStartDateForWork = getFieldValue('expectStartDate');
                            //             if(val && expectStartDateForWork && val.isBefore(expectStartDateForWork)){
                            //                 callback('工序开始不得早于工单开始时间');
                            //             }
                            //             callback();
                            //         },
                            //     }
                            // ]}
                        >
                            <DatePicker className={"gb-datepicker"}
                                        format="YYYY-MM-DD HH:mm"
                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                                        disabled={!isCopy && record.reports && record.reports.length > 0}
                            />
                        </Form.Item>
                    )
                }
            },{
                title: "计划结束时间",
                dataIndex: 'expectEndDate',
                key: 'expectEndDate',
                width: 250,
                hidden: hideExpectEndDateFlag,
                // required: true,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            initialValue = {text ? moment(text) : moment().add(1, 'days')}
                            name={[this.dataPrefix, record.key, 'expectEndDate']}
                            rules={[
                                // { type: 'object',required: true,message: "该项为必填项"},
                                {
                                    validator: (rules, val, callback) => {
                                        // let expectEndDateForWork = getFieldValue('expectEndDate');
                                        let expectStartDate = getFieldValue([this.dataPrefix, record.key, 'expectStartDate']);
                                        if(val && expectStartDate && expectStartDate.isAfter(val)){
                                            callback('计划结束时间应大于计划开始时间');
                                        }
                                        // if(val && expectEndDateForWork && val.isAfter(expectEndDateForWork)){
                                        //     callback('工序结束时间不得晚于工单结束时间');
                                        // }
                                        callback();
                                    },
                                }
                            ]}
                        >
                            <DatePicker className={"gb-datepicker"}
                                        format="YYYY-MM-DD HH:mm"
                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                                        disabled={!isCopy && record.reports && record.reports.length > 0}
                            />
                        </Form.Item>
                    )
                }
            }, {
                title: "计划产量",
                dataIndex: 'expectCount',
                key: 'expectCount',
                width: 250,
                hidden: hideExpectCountFlag,
                required: true,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'expectCount']}
                            rules={[
                                { required: true,message: "该项为必填项"},
                                {
                                    validator: (rules, value, callback) => {
                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                        if (value && (Number.isNaN(value) || !reg.test(value))) {
                                            callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={14} disabled={!isCopy && record.reports && record.reports.length > 0}/>
                        </Form.Item>
                    )
                }
            },  {
                title: (
                    <React.Fragment>
                        <Tooltip
                            type="info"
                            title={'生产单位成品所需完成的工作量'}
                        >
                            <span>单位工作量 </span><QuestionCircleOutlined  className={cx("scan-tip")}/>
                        </Tooltip>
                    </React.Fragment>
                ),
                dataIndex: 'workload',
                key: 'workload',
                width: 250,
                hidden: hideWorkloadFlag,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'workload']}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        const reg = /^(0|[1-9]\d{0,9})(\.\d{1,3})?$/;
                                        if (value && (Number.isNaN(value) || !reg.test(value))) {
                                            callback("输入整数不超过10位小数不超过3位的正数");
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={14} disabled={!isCopy && record.reports && record.reports.length > 0}/>
                        </Form.Item>
                    )
                }
            },{
                title: "工作中心",
                dataIndex: 'caCode',
                key: 'caCode',
                width: 250,
                // required: caCodeRequiredFlag,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'caCode']}
                            // rules={[
                            //     { required: caCodeRequiredFlag, message: "该项为必填项"},
                            // ]}
                        >
                            <SelectWorkCenter  disabled={!isCopy && record.reports && record.reports.length > 0} showFullSize={true}
                                               showEdit={true} onChange={(value, option) => this.handleSelectByWorkCenter(option, record.key)}/>
                        </Form.Item>
                    )
                }
            }, {
                title: "负责人",
                dataIndex: 'officerId',
                key: 'officerId',
                width: 250,
                // required: officerIdRequiredFlag,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'officerId']}
                            // rules={[
                            //     { required: officerIdRequiredFlag,message: "该项为必填项"},
                            // ]}
                        >
                            <SelectEmployeeIdFix
                                disabled={!isCopy && record.reports && record.reports.length > 0}
                                showVisible={true}
                                showFullSize={true}
                            />
                        </Form.Item>
                    )
                }
            },{
                title: "备注",
                dataIndex: 'remarks',
                key: 'remarks',
                width: 250,
                // required: officerIdRequiredFlag,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'remarks']}
                            // rules={[
                            //     { required: officerIdRequiredFlag,message: "该项为必填项"},
                            // ]}
                        >
                            <Input  maxLength={2000} placeholder="备注"/>
                        </Form.Item>
                    )
                }
            },
            {
                title: "附件",
                dataIndex: 'fileIds',
                key: 'fileIds',
                width: 200,
                render: (text, record) => {
                    let fileIds = getFieldValue([this.dataPrefix, record.key, 'fileIds']);
                    let fileList = fileIds ? _.map(_.split((fileIds), ','), (id,idx) => {
                        let file = {};
                        file.uid = -(idx+1);
                        file.url = `${BASE_URL}/file/download/?url=/file/download/${id}`;
                        file.name = fileMap[id];
                        file.status = 'done';
                        file.response = {
                            fileId: id
                        };
                        return file;
                    }) : [];
                    return (
                        <React.Fragment>
                            <AttachmentUpload
                                maxLength={'1'}
                                fileList={fileList}
                                handleChange={(fileList) => this.handleChangeForFile(record.key, fileList)}
                            />
                            <div style={{display:"none"}}>
                                <Form.Item
                                    name={[this.dataPrefix, record.key, 'fileIds']}
                                >
                                    <Input type="hidden"/>
                                </Form.Item>
                            </div>
                        </React.Fragment>

                    )
                }
            }
        ];

        columns = columns.filter(item => !item.hidden).map(item => {
            return {
                ...item,
                title: () => {
                    return (
                        <React.Fragment>
                            {
                                item.required ? (<span className="required">*</span>) : null
                            }
                            {item.title}
                        </React.Fragment>
                    )
                },
                align: item.align || 'left',
            };
        });

        const tableWidth = columns.reduce(function(width, item) {
            return width + (item.width !== undefined ? item.width : 200) / 1;
        }, 0);

        return (
            <React.Fragment>
                <Table
                    bordered
                    dataSource={processList}
                    pagination={false}
                    columns={columns}
                    className={cx(["goods-table", "process-table"])}
                    scroll={{x: tableWidth}}
                />
                <SettlementAdd
                    visible={this.state.procedureAddVisible}
                    onClose={this.closeModal.bind(this,'procedureAddVisible')}
                    callback={(values) => this.addProcessSuccessCallback(values)}
                />
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    defaultTabKey={this.state.auxiliaryTabKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.closeModal.bind(this, 'auxiliaryVisible')}
                />
            </React.Fragment>
        )
    }
}
