import React, {Component} from 'react';
import { Input, Table, Form, Select } from 'antd';
import {PlusOutlined,MinusOutlined} from '@ant-design/icons';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

/**
 * 多规格表格(上)
 *
 * @visibleName specTable（多规格table）
 * @author jinb
 */
export default class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [{key: 0}],
        };
        this.dataPrefix = this.props.dataPrefix;
    }

    // 添加规格属性
    addSpecItem = () => {
        let {dataSource} = this.state;
        let idx = this.props.getEmptyPosition(); // 获取当前specName为空的索引位置
        let specName = `规格${idx+1}`;
        let newDataSource = JSON.parse(JSON.stringify(dataSource));
        newDataSource.splice(idx, 0, {key: idx, specName, specValues: []});

        this.setState({
            dataSource: newDataSource
        }, () => {
            // 设置form对应属性的数据
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            setFieldsValue({[this.dataPrefix]: {...getFieldValue([this.dataPrefix]), [idx]: {specName}}});
            // 修改规格table中的规格名称
            this.props.handleOnChangeSpecName('add', null, specName);
        })
    };

    // 删除规格属性
    removeSpecItem = (key, index) => {
        let {dataSource} = this.state;
        let newDataSource  = dataSource.filter(item => item.key !== key);
        this.setState({
            dataSource: newDataSource
        }, () => {
            // 清除form对应属性的数据
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let specData = getFieldValue([this.dataPrefix]);
            let specValues = getFieldValue([this.dataPrefix, key, 'specValues']);
            specData[key]={};
            setFieldsValue({[this.dataPrefix]: specData});

            // 同步SpecGoodsTable的数据
            (specValues && specValues.length > 0) && this.props.deleteOneSpec(specData, index);  // 如果规格属性没值，则不同步SpecGoodsTable的数据
            // 修改规格table中的规格名称
            this.props.handleOnChangeSpecName('delete', index+1, null);
        });
    };


    // 规格名称变化
    handleSpecNameChange= (e, index) => {
        let value = e.target.value;
        console.log(value, 'value');
        // 修改规格table中的规格名称
        this.props.handleOnChangeSpecName('modify', index+1, value);
    };

    // 规格值变化
    handleSpecValuesChange = (values, key) => {
        let {dataSource} = this.state;
        let preValues = [];
        let newDataSource = dataSource.map(item => {
            if(item.key===key) {
                preValues = item.specValues;
                item.specValues = values;
            }
            return item;
        });

        // 触发SpecGoodsTable表单中的数据
        this.props.handleOnChangeOneSpecValue();

        this.setState({dataSource, newDataSource});
    };

    render() {
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
                                dataSource.length < 3 ? (
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
                title: '规格名称',
                dataIndex: 'specName',
                width: 250,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                label=""
                                name={[this.dataPrefix, record.key, "specName"]}
                                initialValue={'规格'+(index+1)}
                                rules={[
                                    {
                                        required: true,
                                        message: '规格名称为必填项',
                                    }
                                ]}>
                                <Input maxLength={20} onBlur={(e) => this.handleSpecNameChange(e, index)}/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '规格值',
                dataIndex: 'specName',
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                label=""
                                name={[this.dataPrefix, record.key, "specValues"]}
                                initialValue={[]}
                                rules={[
                                    {
                                        required: true,
                                        message: '规格值为必填项',
                                    }
                                ]}>
                                <Select mode="tags"
                                        style={{ width: '100%' }}
                                        onChange={(val) => this.handleSpecValuesChange(val, record.key)}
                                        tokenSeparators={[',']} />

                            </Form.Item>
                        </React.Fragment>
                    )
                }
            },
        ];

        return (
            <React.Fragment>
                <Table
                    bordered
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    className={cx("goods-table")}
                />
            </React.Fragment>
        )
    }
}
