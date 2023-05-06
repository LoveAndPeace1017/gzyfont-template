import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import {DatePicker, message, Tooltip, Form} from "antd";
import {Auth} from 'utils/authComponent';
import Base from './base';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import moment from "moment-timezone/index";
const cx = classNames.bind(styles);

/**
 * @visibleName withDeadlineDate（交付日期组件）
 * @author jinb
 */
export default function withDeadlineDate(WrappedComponent) {

    return class WithDeadlineDate extends Base {
        static propTypes = {
            /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
            dataPrefix: PropTypes.string,
            /** 获取表单数据 */
            getFormField: PropTypes.func,
            /** 来源*/
            source: PropTypes.string,
        };

        /** 找寻第一个交付日期*/
        _findFirstDeadlineDate = () => {
            let dataSource = this.props.getFormField();
            let deliveryDeadlineDate = null;
            _.forIn(dataSource, (value) => {
                if (value && value.deliveryDeadlineDate){
                    deliveryDeadlineDate = value.deliveryDeadlineDate;
                    return false; // 提前退出循环
                }
            });
            return deliveryDeadlineDate;
        };

        // 一键填充方法
        oneKeyFill = () => {
            let deliveryDeadlineDate = this._findFirstDeadlineDate();
            if(deliveryDeadlineDate){
                let dataSource = this.props.getFormField();
                _.forIn(dataSource, (value, key) => {
                    if (value && value.prodCustomNo){
                        this.props.setFormField(key, {deliveryDeadlineDate});
                    }
                });
            } else {
                message.error('没有可填充的内容，操作失败');
            }
        };

        render(){
            let {dataPrefix, source} = this.props;
            let {getFieldValue} = this.props.formRef.current;

            const deadlineDateColumn = {
                title: (
                    <div className="tb-fill-wrap">交付日期
                        <Tooltip title={'若交付日期一致，可按第一个日期一键填充'}>
                            <a href="#!" className={"fr"} onClick={this.oneKeyFill}>一键填充</a>
                        </Tooltip>
                    </div>
                ),
                key: 'deliveryDeadlineDate',
                dataIndex: 'deliveryDeadlineDate',
                columnName: 'deliveryDeadlineDate',
                width: 141,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[dataPrefix, record.key, 'deliveryDeadlineDate']}
                            initialValue={text && moment(text)}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        if(value){
                                            const orderDate = getFieldValue(Base.SOURCE_MAP[source].orderDateKey);
                                            if(orderDate.isAfter(value, 'date')){
                                                callback(Base.SOURCE_MAP[source].deliveryDeadlineDateText);
                                            }
                                            callback();
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>
                    )
                }
            };

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        deadlineDateColumn={deadlineDateColumn}
                    />
                </React.Fragment>
            )
        }
    }
}

