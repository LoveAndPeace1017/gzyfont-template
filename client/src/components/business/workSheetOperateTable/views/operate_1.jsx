import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Input, Table, Form } from 'antd';
import {PlusOutlined,MinusOutlined} from '@ant-design/icons';
import {getCookie} from 'utils/cookie';
import {SelectEmployeeIdFix} from 'pages/auxiliary/employee';
import withFormOperate from "../dependencies/withFormOperate";
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

/**
 * 新增报工记录
 * @visibleName Operate 仅报工
 * @author jinb
 */
@withFormOperate
export default class Operate extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static propTypes = {
        /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
        dataPrefix: PropTypes.string,
        /** 添加行 */
        addOneRow: PropTypes.func,
        /** 删除行 */
        removeOneRow: PropTypes.func,
        /** 清除当前行 */
        clearOneRow: PropTypes.func,
        /** 获取表单数据 */
        getFormField: PropTypes.func,
        /** 初始化时填充列表数据 */
        initFormList: PropTypes.func,
        /** 清楚所有数据 */
        clearAllRows: PropTypes.func,
    };

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    render() {
        let { dataPrefix, formData } = this.props;
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
                            <a href="#!" className={cx('add-item')} onClick={() => this.props.addOneRow(index)}>
                                <PlusOutlined style={{fontSize: "16px"}}/>
                            </a>
                            {
                                formData.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')} onClick={() => this.props.removeOneRow(record.key)}>
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
                            name={[dataPrefix, record.key, 'employeeId']}
                            rules={[
                                { required: true,message: "该项为必填项"},
                                {
                                    validator: (rules, value, callback) => {
                                        let reports = this.props.getFormField();
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
                title: "报工数量",
                dataIndex: 'reportCount',
                key: 'reportCount',
                width: 250,
                required: true,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[dataPrefix, record.key, 'reportCount']}
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
                            <Input maxLength={14}/>
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
                    dataSource={formData}
                    pagination={false}
                    columns={columns}
                    className={cx("goods-table")}
                />
            </React.Fragment>
        )
    }
}
