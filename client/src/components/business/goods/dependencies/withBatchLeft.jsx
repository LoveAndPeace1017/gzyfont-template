import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Input, Form, DatePicker} from "antd";
import {EllipsisOutlined} from '@ant-design/icons';
import {actions as batchShelfActions} from "components/business/batchShelfLeft";
import {AuthInput} from 'components/business/authMenu';
import {SelectBatchShelf} from 'components/business/batchShelfLeft';
import Base from './base';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchBatchShelfList: batchShelfActions.asyncFetchBatchShelfList
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default function withBatchLeft(WrappedComponent) {
    return class withBatchLeft extends Base {
        static propTypes = {
            /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
            dataPrefix: PropTypes.string,
            /** 获取表单数据 */
            getFormField: PropTypes.func,
            /** 填充当前行数据 */
            setFormField: PropTypes.func,
            /** 获取表单state中的formData中的数据 */
            getFormState: PropTypes.func,
            /** 设置表单state中的formData中的数据 */
            setFormState: PropTypes.func,
        };

        constructor(props) {
            super(props);
            this.state={
                visible: false,
                currentIdx: null,  // 当前的所在行号
                currentKey: null, // 当前行
                productCode: null,
                warehouseName: null
            };
        }

        handleOpen = (idx, record) => {
            let {key, productCode, expirationFlag} = record;
            let {getFieldValue} = this.props.formRef.current;
            let warehouseName = getFieldValue('warehouseName');
            if(!expirationFlag) return false;
            this.setState({currentIdx: idx, currentKey: key, visible: true, productCode, warehouseName});
        };

        dealCurrentItem = (list) => {
            let {setFormField, setFormState} = this.props;
            let {currentIdx, currentKey} = this.state;
            let {batchNo, productionDate, expirationDate} = list;

            setFormState(currentIdx, {batchnoFlag: true, productionDate: moment(productionDate), expirationDate: moment(expirationDate)}, () => {
                setFormField(currentKey, {batchNo});
            });
        };

        dealNewItem = (lists) => {
            let {getFormField, getFormState} = this.props;
            let {currentIdx, currentKey} = this.state;
            let currentGoodItem = {...getFormState(currentIdx), ...getFormField(currentKey)};
            return lists.map(item => {
                let {key, ...newItem} = item;
                return {...currentGoodItem, ...newItem, productCode: currentGoodItem.prodNo, batchnoFlag: true}
            });
        };

        confirmOperate = (selectedRows) => {
            if(selectedRows.length === 0){
                message.error('请选择一个批次号！');
                return false;
            }
            let newItems = selectedRows.slice(1);

            this.dealCurrentItem(selectedRows[0]);  // 更新当前行数据
            if(newItems.length > 0){
                newItems = this.dealNewItem(newItems);
                this.props.fillList(newItems);
            }
            this.setState({visible: false});
        };

        /** 处理批次号发生变化 */
        handleChangeBatchNo = (batchno, idx, record) => {
            let {setFormField, setFormState} = this.props;
            let {key, productCode} = record;
            if(productCode && batchno){
                this.props.asyncFetchBatchShelfList({productCode, batchNo:batchno}, (res)=> {
                    if(res.data && res.data.retCode==="0"){
                        let dataSource = res.data.data;
                        if(dataSource && dataSource.length > 0){
                            let {productionDate, expirationDate} = dataSource[0];
                            setFormState(idx, {batchnoFlag: true, productionDate: moment(productionDate), expirationDate: moment(expirationDate)});
                        } else {
                            setFormState(idx, {batchnoFlag: false}, () => {
                                setFormField(key, {productionDate: '', expirationDate: ''});
                            });
                        }
                    }
                })
            }
        };

        /** 处理生产日期发生变化 */
        handleChangeProductionDate = (val, record) => {
            let {setFormField} = this.props;
            let {key, expirationDay} = record;
            setFormField(key, {expirationDate: moment(val).add(expirationDay-1, 'days')});
        };

        render() {
            let {dataPrefix, source, getFormField, vipService} = this.props;
            let {productCode, warehouseName} = this.state;
            let vipSource = vipService.getIn(['vipData','data']);
            vipSource = vipSource ? vipSource.toJS() : [];
            let batchShelfLife = vipSource.BATCH_SHELF_LIFE || {};  //增值包数据
            let batchShelfLifeVipFlag = batchShelfLife.vipState === 'TRY' || batchShelfLife.vipState === 'OPENED';

            let batchLeftColumns = [];
            if(batchShelfLifeVipFlag){
                batchLeftColumns = [{
                    title: "批次号",
                    key: 'batchNo',
                    dataIndex: 'batchNo',
                    columnName: 'batchNo',
                    render: (text, record, index)=> {
                        return (
                            <React.Fragment>
                                {
                                    (!record.expirationFlag) ? (
                                        <span className="txt-clip" title={text}>{text}</span>
                                    ) : (
                                        <Form.Item
                                            rules={[
                                                {
                                                    validator: (rules, value, callback) => {
                                                        if (record.expirationFlag && !value) {
                                                            callback('该项为必填项');
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]}
                                            validateTrigger="onBlur"
                                            name={[dataPrefix, record.key, 'batchNo']}
                                        >
                                            <Input
                                                maxLength={50}
                                                onBlur={(e)=>this.handleChangeBatchNo(e.target.value, index, record)}
                                                style={{width:'100%'}}
                                                suffix={(
                                                    <a href="#!"
                                                       onClick={() => this.handleOpen(index, record)}>
                                                        <EllipsisOutlined style={{fontSize: "16px"}}/>
                                                    </a>
                                                )}
                                                className={cx("suggest")}
                                            />
                                        </Form.Item>
                                    )
                                }
                            </React.Fragment>
                        )
                    }
                },{
                    title: "生产日期",
                    key: 'productionDate',
                    dataIndex: 'productionDate',
                    columnName: 'productionDate',
                    render: (text, record, index)=> {
                        let {key, expirationFlag, batchnoFlag} = record;
                        /***
                         *   入库时  当物品非批次管理物品时字段不可用
                         *  当物品对应批次号在系统内存在时字段只读，显示该批次的生产日期
                         *  当物品对应批次号在系统内不存在时字段可用，点击则打开日期选择控件可选择日期
                         *   出库时 只读
                         */
                        return (
                            <React.Fragment>
                                {
                                    (!(expirationFlag && !batchnoFlag)|| source==='OUTBOUND' || source==='OUTBOUND_SALE') ? (
                                        <span className="txt-clip">{text ? moment(text).format("YYYY-MM-DD") : ''}</span>
                                    ) : (
                                        <Form.Item
                                            initialValue={text && moment(text)}
                                            rules={[
                                                {
                                                    validator: (rules, value, callback) => {
                                                        if (record.expirationFlag && !value) {
                                                            callback('该项为必填项');
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]}
                                            name={[dataPrefix, key, 'productionDate']}
                                        >
                                            <DatePicker className={"gb-datepicker"}
                                                        onChange={(val) => this.handleChangeProductionDate(val, record)}
                                            />
                                        </Form.Item>
                                    )
                                }
                            </React.Fragment>
                        )
                    }
                },{
                    title: "到期日期",
                    key: 'expirationDate',
                    dataIndex: 'expirationDate',
                    columnName: 'expirationDate',
                    render: (text, record, index)=> {
                        let {key, expirationFlag, batchnoFlag} = record;
                        /***
                         *   入库时  当物品非批次管理物品时字段不可用
                         *  当物品对应批次号在系统内存在时字段只读，显示该批次的到期日期
                         *  当物品对应批次号在系统内不存在时字段可用，点击则打开日期选择控件可选择日期
                         *
                         *   出库时 只读
                         */
                        return (
                            <React.Fragment>
                                {
                                    (!(expirationFlag && !batchnoFlag) || source==='OUTBOUND' || source==='OUTBOUND_SALE') ? (
                                        <span className="txt-clip">{text ? moment(text).format("YYYY-MM-DD") : ''}</span>
                                    ) : (
                                        <Form.Item
                                            initialValue={text && moment(text)}
                                            rules={[
                                                {
                                                    validator: (rules, value, callback) => {
                                                        if (record.expirationFlag && !value) {
                                                            callback('该项为必填项');
                                                        }
                                                        let productionDate = getFormField(key, 'productionDate');
                                                        if(value && productionDate && productionDate.isAfter(value, 'date')){
                                                            callback('到期日期不能早于生产日期')
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]}
                                            name={[dataPrefix, record.key, 'expirationDate']}
                                        >
                                            <DatePicker className={"gb-datepicker"}/>
                                        </Form.Item>
                                    )
                                }
                            </React.Fragment>
                        )
                    }
                }];
            }

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        batchLeftColumns={batchLeftColumns}
                    />
                    <SelectBatchShelf
                        visible={this.state.visible}
                        onOk={(selectedRows) => this.confirmOperate(selectedRows)}
                        onCancel={()=>{this.setState({visible: false})}}
                        productCode={productCode}
                        warehouseName={warehouseName}
                    />
                </React.Fragment>
            )
        }
    }
}