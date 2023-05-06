import React, {Component} from 'react';
import _ from 'lodash';
import { Input, Table, Form, Select } from 'antd';
import {PlusOutlined,MinusOutlined} from '@ant-design/icons';
import {SelectEmployeeIdFix} from 'pages/auxiliary/employee';
import {SelectWorkCenter} from 'pages/auxiliary/workCenter';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {getCookie} from 'utils/cookie';
const cx = classNames.bind(styles);
const {Option} = Select;

/**
 * 新增报工记录
 * @visibleName WorkSheetOperateTable
 * @author jinb
 */
export default class WorkSheetOperateTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentKey: 0,
            reports: [{key: 0}],
            renderFlag: false,
            employeeId: null
        };
        this.dataPrefix = this.props.dataPrefix;
    }

    componentDidMount() {
        this.props.getRef(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.employeeIdList!==this.props.employeeIdList){
            let { setFieldsValue } = this.props.formRef.current;
            let {employeeIdList} = nextProps;
            //处理员工Id
            let newReport = [];
            employeeIdList.forEach((item,index)=>{
                let obj = {
                    key: index,
                    employeeId: item
                }
                newReport.push(obj);
            });
            this.setState({reports: newReport,currentKey:newReport.length-1},()=>{
                for(let i=0;i<newReport.length;i++){
                    setFieldsValue({[this.dataPrefix]: {[newReport[i].key]: { employeeId: newReport[i].employeeId }}});
                }
            });

       }
    }

    // 添加
    addOneProcess = (index) => {
        let { setFieldsValue } = this.props.formRef.current;
        let {reports, currentKey} = this.state;
        let newReports = _.cloneDeep(reports);
        newReports.splice(index+1, 0, {key: ++currentKey});
        this.setState({currentKey, reports: newReports}, () => {
            setFieldsValue({[this.dataPrefix]: {[currentKey]: {employeeId: this.props.employeeId}}});
        });
    };

    // 删除
    removeOneProcess = (key) => {
        let { setFieldsValue } = this.props.formRef.current;
        let {reports} = this.state;
        let newReports  = reports.filter(item => item.key !== key);
        this.setState({reports: newReports}, () => {
            setFieldsValue({[this.dataPrefix]: {[key]: null}});
        });
    };

    emptyTable = () => {
        let { setFieldsValue } = this.props.formRef.current;
        let reports = [{key: 0}];
        this.setState({ reports });
        setFieldsValue({[this.dataPrefix]: []});
        setFieldsValue({[this.dataPrefix]: {0: {employeeId: this.props.employeeId}}});
    };

    render() {
        let { reports } = this.state;
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
                            <a href="#!" className={cx('add-item')} onClick={() => this.addOneProcess(index)}>
                                <PlusOutlined style={{fontSize: "16px"}}/>
                            </a>
                            {
                                reports.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')} onClick={() => this.removeOneProcess(record.key)}>
                                        <MinusOutlined style={{fontSize: "16px"}}/>
                                    </a>
                                ) : null
                            }
                        </React.Fragment>
                    )
                }
            }, {
                title: "员工",
                dataIndex: 'employeeId',
                key: 'employeeId',
                width: 250,
                required: true,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'employeeId']}
                            rules={[
                                { required: true,message: "该项为必填项"},
                                {
                                    validator: (rules, value, callback) => {
                                        console.log(this.props.formRef.current.getFieldValue([this.dataPrefix]), index,  'dataPrefix');
                                        let reports = this.props.formRef.current.getFieldValue([this.dataPrefix]);
                                        let idx = 0;
                                        for(let key in reports){
                                            if(reports[key] && reports[key].employeeId === value){
                                                ++idx;
                                            }
                                        }
                                        if(value && idx > 1){
                                            callback("存在重复员工");
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <SelectEmployeeIdFix
                                showVisible={true}
                                showFullSize={true}
                            />
                        </Form.Item>
                    )
                }
            }, {
                title: "良品数量",
                dataIndex: 'finishCount',
                key: 'finishCount',
                width: 250,
                required: true,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'finishCount']}
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
                            <Input maxLength={14} />
                        </Form.Item>
                    )
                }
            }, {
                title: "不良数量",
                dataIndex: 'scrapCount',
                key: 'scrapCount',
                width: 250,
                required: true,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'scrapCount']}
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
                            <Input maxLength={14} />
                        </Form.Item>
                    )
                }
            }
        ];

        columns = columns.map(item => {
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

        return (
            <React.Fragment>
                <Table
                    bordered
                    dataSource={reports}
                    pagination={false}
                    columns={columns}
                    className={cx("goods-table")}
                />
            </React.Fragment>
        )
    }
}
