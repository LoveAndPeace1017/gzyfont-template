import React, {Component} from 'react';
import { Table, Modal, Form, Button, Radio, Input, Typography, message} from 'antd';
import { Resizable } from 'react-resizable';
import Pagination from 'components/widgets/pagination';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    }
};

const { Text } = Typography;

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

export default class WorkSheetReport extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            qualityTestVisible: false
        }
    }

    componentDidMount() {
        let recordColumns = [
            {
                title: "序号",
                dataIndex: 'serial',
                align: 'center',
                width: 60
            },
            {
                title: "工序顺序号",
                dataIndex: 'orderNo',
                align: 'left',
                width: 150
            },
            {
                title: "工序编号",
                dataIndex: 'processCode',
                align: 'left',
                width: 150
            },
            {
                title: "工序名称",
                dataIndex: 'processName',
                align: 'left',
                width: 150
            },
            {
                title: "工作中心",
                dataIndex: 'caName',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            },
            {
                title: "部门员工",
                dataIndex: 'employeeName',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            },
            {
                title: "质检状态",
                dataIndex: 'qualityStatus',
                align: 'left',
                width: 150,
                className: 'ant-table-selection-column'
            },
            {
                title: "完工数量",
                dataIndex: 'reportCount',
                align: 'left',
                width: 150,
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
            },
            {
                title: "新建时间",
                key: 'addedTime',
                dataIndex: 'addedTime',
                align: 'left',
                width: 150,
            },
            {
                title: "质检时间",
                key: 'qualityTime',
                dataIndex: 'qualityTime',
                align: 'left',
                width: 150,
            },
            {
                title: "操作",
                key: 'operate',
                align: 'left',
                dataIndex: 'operate',
                width: 150,
                render: (value, row) => {
                    let {deleteWorkSheetReportRecord} = this.props;
                    let {id, processId,qualityStatusNum} = row;
                    return (
                        <React.Fragment>
                            <a href="#!" className={qualityStatusNum === 1 ? cx("a-disabled"): null} onClick={() => this.qualityTest(row)}>质检</a>
                            <span> | </span>
                            <a href="#!" onClick={() => deleteWorkSheetReportRecord(id, processId)}>删除</a>
                        </React.Fragment>
                    )
                }
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

    onPageInputChange = (page, perPage) => {
        this.props.fetchData({perPage, page});
    };
    onShowSizeChange = (current, perPage) => {
        console.log(current, perPage, 'current, perPage');
        this.props.fetchData({perPage, page: 1});
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
    //质量检测
    qualityTest = (data)=>{
        if(data.qualityStatusNum === 1) return false;
        this.openModal('qualityTestVisible');
        console.log(data,'data');
        //手动填充数据
        setTimeout(()=>{
            let setFieldsValue = this.formRef.current.setFieldsValue;
            setFieldsValue({
                processCode: data.processCode,
                processName: data.processName,
                employeeName: data.employeeName,
                reportCount: data.reportCount,
                id: data.id
            });
        },500);

    }

    //提交质检记录
    dealQualityTest = (value)=>{
        console.log(value,'value');
        this.props.asyncFetchQualityAction(value,(data)=>{
            console.log(data,'data');
            if(data.retCode === "0"){
                message.success('操作成功！');
                this.closeModal('qualityTestVisible');
                this.emptyFormInfo();
                this.props.fetchData();
            }else{
                message.error(data.retMsg||'操作异常');
            }
        });
    };

    // 清空表单数据
    emptyFormInfo = () => {
        let setFieldsValue = this.formRef.current.setFieldsValue;
        setFieldsValue({
            processCode: '',
            processName: '',
            employeeName: '',
            reportCount: '',
            scrapCount: '',
            finishCount: '',
            id: '',
            type: 0,
        });
    };

    formatFloat = (f, digit) => {
        let m = Math.pow(10, digit);
        return Math.round(f * m, 10) / m;
    };


    //数字变化
    numberChange = (type) => {
        let {setFieldsValue,getFieldValue} = this.formRef.current;
        let getValue = getFieldValue(type);
        let reportCount = getFieldValue('reportCount')/1;
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);

        if(type === 'finishCount'){
            setFieldsValue({
                scrapCount:  fixedDecimal(reportCount-getValue, quantityDecimalNum) || 0
            });
        }else if(type === 'scrapCount'){
            setFieldsValue({
                finishCount:  fixedDecimal(reportCount-getValue, quantityDecimalNum) || 0
            });
        }
    };

    openModal = type => {
        this.setState({
            [type]: true
        })
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    //质检弹层
    qualityTestModal = () => {
        const tailLayout = {
            wrapperCol: { offset: 13, span: 16 },
        };
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        return (
            <Modal
                title={"质检"}
                onCancel={() => {
                    this.emptyFormInfo();
                    this.closeModal('qualityTestVisible')
                }}
                okText={"确定"}
                cancelText={'取消'}
                className={"list-pop"}
                visible={this.state.qualityTestVisible}
                footer={null}
                destroyOnClose={false}
                width={800}
            >
                <div className={cx("complete-wrap")}>
                    <Form  ref={this.formRef}
                           onFinish={(values) => {
                           this.dealQualityTest(values);
                    }}>

                                    <Form.Item
                                        label={'工序编号'}
                                        name={'processCode'}
                                        {...formItemLayout}
                                    >
                                        <Input className={cx("no-border-input")} bordered={false} disabled={true} maxLength={25}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={'工序名称'}
                                        name={'processName'}
                                        {...formItemLayout}
                                    >
                                        <Input className={cx("no-border-input")} bordered={false} disabled={true} maxLength={25}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={'部门员工'}
                                        name={'employeeName'}
                                        {...formItemLayout}
                                    >
                                        <Input className={cx("no-border-input")} bordered={false} disabled={true} maxLength={25}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={'完工数量'}
                                        name={'reportCount'}
                                        {...formItemLayout}
                                    >
                                        <Input className={cx("no-border-input")} bordered={false} disabled={true} maxLength={25}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={'良品数量'}
                                        name={'finishCount'}
                                        rules={[
                                            {
                                                required: true,
                                                message: "良品数量为必填项！"
                                            },
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
                                        {...formItemLayout}
                                    >
                                        <Input maxLength={25} onChange={()=>this.numberChange('finishCount')}/>
                                    </Form.Item>
                                    <Form.Item
                                        label={'不良数量'}
                                        name={'scrapCount'}
                                        rules={[
                                            {
                                                required: true,
                                                message: "不良数量为必填项！"
                                            },
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
                                        {...formItemLayout}
                                    >
                                        <Input maxLength={25} onChange={()=>this.numberChange('scrapCount')}/>
                                    </Form.Item>

                                    <Form.Item
                                        {...formItemLayout}
                                        label="同时完成工序"
                                        name="type"
                                        required={true}
                                        initialValue={0}
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                        name="id"
                                    >
                                        <Input type="hidden"/>
                                    </Form.Item>

                                    <Form.Item  {...tailLayout} style={{marginTop: '15px',textAlign: "right"}}>
                                        <Button type="primary" htmlType="submit">
                                            确定
                                        </Button>
                                        <Button onClick={() => {
                                            this.closeModal('qualityTestVisible');
                                            this.emptyFormInfo();
                                        }} style={{marginLeft: 10}}>
                                            取消
                                        </Button>
                                    </Form.Item>

                    </Form>
                </div>
            </Modal>
        )
    };

    render() {
        const {productList, paginationInfo} = this.props;
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
            <React.Fragment>
                <Table
                    bordered
                    columns={columns}
                    dataSource={productList}
                    scroll={{x: tableWidth}}
                    components={this.components}
                    pagination={false}
                    loading={false}
                />
                <Pagination {...paginationInfo}
                            onChange={this.onPageInputChange}
                            onShowSizeChange={this.onShowSizeChange}
                />
                {this.qualityTestModal()}
            </React.Fragment>
        )
    }
}
