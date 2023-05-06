import React, {Component} from 'react';
import { Input, Table, Select } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {PlusOutlined,MinusOutlined,QuestionCircleOutlined} from '@ant-design/icons';
import Tooltip from 'components/widgets/tooltip';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Auxiliary from 'pages/auxiliary';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
const cx = classNames.bind(styles);


export default class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [{key: 0}],
            auxiliaryVisible: false,
            auxiliaryKey: '',
        };
        this.dataPrefix = this.props.dataPrefix;
    }

    componentDidMount() {
        const {initBaseInfo} = this.props;
        let toJsData = initBaseInfo && initBaseInfo.toJS();
        if(toJsData && toJsData.otherUnits && toJsData.otherUnits.length>0){
            let otherUnits = toJsData.otherUnits || [];
            for(let i = 0;i<otherUnits.length;i++){
                otherUnits[i].key = i;
            }
            this.props.initPosition(otherUnits.length);
            this.setState({
                dataSource: otherUnits
            })
        }
    }

    addSpecItem = () => {
        let {dataSource} = this.state;
        let idx = this.props.getEmptyPosition(); // 获取当前specName为空的索引位置
        let unitName = `${idx+1}`;
        let newDataSource = JSON.parse(JSON.stringify(dataSource));
        newDataSource.splice(idx, 0, {key: idx, unitName:'', unitConverter: ""});

        this.setState({
            dataSource: newDataSource
        }, () => {
            // 设置form对应属性的数据
            const {form: {getFieldValue, setFieldsValue}} = this.props;
            setFieldsValue({[this.dataPrefix]: {...getFieldValue([this.dataPrefix]), [idx]: {unitName:''}}});
            // 修改规格table中的规格名称
            this.props.handleOnChangeSpecName('add', null, unitName);
        })
    };


    removeSpecItem = (key, index) => {
        let {dataSource} = this.state;
        let newDataSource  = dataSource.filter(item => item.key !== key);
        this.setState({
            dataSource: newDataSource
        }, () => {
            // 清除form对应属性的数据
            const {form: {getFieldValue, setFieldsValue}} = this.props;
            let unitData = getFieldValue([this.dataPrefix]);
            unitData[key]={};
            setFieldsValue({[this.dataPrefix]: unitData});
            // 修改规格table中的规格名称
            this.props.handleOnChangeSpecName('delete', index+1, null);
        });
    };



    handleClose(type) {
        this.setState({
            [type]: false
        })
    }

    render() {
        const {form: {getFieldDecorator},initBaseInfo} = this.props;
        let {dataSource} = this.state;

        const columns = [
            {
                title: '',
                key: 'ope',
                dataIndex: 'ope',
                width: 60,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            {
                                dataSource.length < 5 ? (
                                    <a href="#!" className={cx('add-item')} onClick={this.addSpecItem}>
                                        <PlusOutlined style={{fontSize: "16px"}}/>
                                    </a>
                                ) : null

                            }
                            {
                                dataSource.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')} onClick={() => this.removeSpecItem(record.key, index)}>
                                        <MinusOutlined style={{fontSize: "16px"}}/>
                                    </a>
                                ) : null
                            }
                        </React.Fragment>
                    )
                }
            },
            {
                title: '单位名称',
                dataIndex: 'unitName',
                width: 250,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item>
                            {
                                getFieldDecorator(`${this.dataPrefix}.${record.key}.unitName`, {
                                    initialValue: value || '',
                                    rules: [
                                        {
                                            required: true,
                                            message: "单位名称为必填项"
                                        },
                                        {
                                            validator: (rules, value, callback) => {
                                                 const {form: {getFieldValue}} = this.props;
                                                 let dataList = getFieldValue(this.dataPrefix);
                                                 let currentUnit = getFieldValue("unit");
                                                 if(dataList && value){
                                                     for(let i in dataList){
                                                         if((i != record.key && dataList[i].unitName == value)|| currentUnit == value){
                                                             callback('单位存在重复，请重新选择');
                                                         }
                                                     }
                                                 }
                                                callback();
                                            }
                                        }
                                    ]
                                })(
                                    <SelectUnit showEdit={true} carryDefaultValue={false}/>
                                )
                            }
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: <span>
                            单位关系
                            <Tooltip
                                type="info"
                                title={"辅助单位换算至基本单位的数量如：1箱=12个，则填写12"}
                            >
                                    <QuestionCircleOutlined style={{fontSize: "16px",color: "#fb982a",marginLeft: "5px"}}/>
                            </Tooltip>
                      </span>,
                dataIndex: 'unitConverter',
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item>
                            {
                                getFieldDecorator(`${this.dataPrefix}.${record.key}.unitConverter`, {
                                    initialValue: value || '',
                                    rules: [
                                        {
                                            required: true,
                                            message: "单位关系为必填项"
                                        },
                                        {
                                            validator: (rules, value, callback) => {
                                                const reg = /^(0|[1-9]\d{0,9})(\.\d{1,3})?$/;
                                                if ((Number.isNaN(value) || !reg.test(value)) && value) {
                                                    callback("文本框内仅可输入整数不超过10位小数部分不超过3位的正数");
                                                }
                                                callback();
                                            }
                                        }
                                    ]
                                })(
                                    <Input maxLength={14}/>
                                )
                            }
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '物品条码',
                dataIndex: 'proBarCode',
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item>
                            {
                                getFieldDecorator(`${this.dataPrefix}.${record.key}.proBarCode`, {
                                    initialValue: value || '',
                                    rules: [
                                        /*{
                                            required: true,
                                            message: "物品条码为必填项"
                                        },*/
                                        {
                                            validator: (rules, value, callback) => {
                                                const {form: {getFieldValue}} = this.props;
                                                let dataList = getFieldValue(this.dataPrefix);
                                                let proBarCode = getFieldValue("proBarCode");
                                                if(dataList && value){
                                                    for(let i in dataList){
                                                        if((i != record.key && dataList[i].proBarCode == value) || proBarCode == value){
                                                            callback('物品条码存在重复，请重新选择');
                                                        }
                                                    }
                                                }
                                                callback();
                                            }
                                        }
                                    ]
                                })(
                                    <Input maxLength={50}/>
                                )
                            }
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '',
                dataIndex: 'recId',
                className: 'recId-class',
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item>
                                {
                                    getFieldDecorator(`${this.dataPrefix}.${record.key}.recId`, {
                                        initialValue: value || '',
                                    })(
                                        <Input type={"hidden"} maxLength={50}/>
                                    )
                                }
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            }
        ];

        return (
            <React.Fragment>
                <Table
                    bordered
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    className={cx("goods-table-old")}
                />
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.handleClose.bind(this, 'auxiliaryVisible')}
                />
            </React.Fragment>
        )
    }
}
