import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, message, Radio } from 'antd';
import PropTypes from "prop-types";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {actions as CustomerActions} from 'pages/customer/add/index';
import {SelectCustomer} from "pages/customer/index";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

/**
 * 将新申请的客户与本地库客户进行绑定
 *
 * @visibleName BindCustomer（绑定客户）
 * @author qiumingsheng
 */
class BindCustomer extends Component{
    static propTypes = {
        /** 弹层提示信息 */
        tip: PropTypes.node,
        /** 是否显示 */
        visible: PropTypes.bool,
        /** 取消绑定回调函数 */
        onCancel:PropTypes.func,
        /** 绑定回调函数 */
        okCallback:PropTypes.func,
        /** 待绑定客户信息 */
        customerInfo: PropTypes.object,
    };
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            selectCustomerVisible:true,
            saveType:1
        }
    }

    confirm = ()=>{
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if(this.state.saveType==1){
                let _this = this;
                let pop = function(values){
                    Modal.confirm({
                        title: intl.get("components.bindCustomer.index.warningTip"),
                        content: intl.get("components.bindCustomer.index.msg1"),
                        okText: intl.get("components.bindCustomer.index.okText"),
                        cancelText:intl.get("components.bindCustomer.index.cancelText"),
                        onOk:()=>_this.onOk(values)
                    });
                };
                if(values.customerName.key){
                    pop(values);
                }else{
                    this.props.asyncFetchOneCustomerByName({
                        name:values.customerName.label
                    },function(res){
                        if(res.retCode=='0'){
                            values.customerName.key = res.data.customerNo;
                            pop(values);
                        }else{
                            message.error(intl.get("components.bindCustomer.index.msg2"));
                        }
                    });
                }
            }else{
                this.onOk(values);
            }

        })
    };

    defaultCallback = (data,callback)=>{
        if(data.retCode==0){
            message.success(intl.get("components.bindCustomer.index.operateSuccessMessage"));
            if(callback){
                callback();
            }
        }else{
            alert(data.retMsg);
        }
    };

    onOk = (values)=>{
        let _this = this;
        if(this.state.saveType==1){
            let customer = values.customerName;
            _this.props.asyncBindMallCustomer({
                ..._this.props.customerInfo,
                customerNo:customer.key
            },(data)=>{
                _this.defaultCallback(data,_this.props.okCallback);
            });

        }else{
            this.props.asyncInsertMallCustomer(this.props.customerInfo,(data)=>{
                _this.defaultCallback(data,_this.props.okCallback);
            });
        }

    };

    radioChange = (e)=>{
        let flag = e.target.value==1;
        this.setState({
            selectCustomerVisible:flag,
            checkCustomer: flag,
            saveType:e.target.value
        },() => {
            this.props.form.validateFields(['customerName'], { force: true });
        },);
    };

    render(){
        const { getFieldDecorator,  } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 11 },
            }
        };
        return(
                <Modal
                    {...this.props}
                    title={intl.get("components.bindCustomer.index.savCustomer")}
                    onOk={this.confirm}
                    okText={intl.get("components.bindCustomer.index.okText")}
                    cancelText={intl.get("components.bindCustomer.index.cancelText")}
                    className={"list-pop"}
                    destroyOnClose={true}
                    width={800}
                >

                    <div className={cx("complete-wrap")}>
                        <Radio.Group onChange={this.radioChange} value={this.state.saveType}>
                        <Form>
                            <Form.Item
                                label={<React.Fragment/>}
                                colon={false}
                                {...formItemLayout}
                            >
                                {
                                    this.props.tip?this.props.tip:<p>{intl.get("components.bindCustomer.index.msg3")}</p>
                                }
                            </Form.Item>

                                <Form.Item
                                    label={<Radio value={1}>{intl.get("components.bindCustomer.index.yes")}</Radio>}
                                    colon={false}
                                    {...formItemLayout}
                                >
                                    <div style={{minHeight: '32px'}}>
                                        <div style={{display:this.state.selectCustomerVisible?'block':'none'}}>
                                            {
                                                getFieldDecorator("customerName", {
                                                    rules: [
                                                        {
                                                            required: this.state.checkCustomer,
                                                            message: intl.get("components.bindCustomer.index.customerMsg"),
                                                        },
                                                    ],
                                                })(
                                                    <SelectCustomer placeholder={intl.get("components.bindCustomer.index.customerPlaceholder")} isBound={0}/>
                                                )
                                            }
                                        </div>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    label={<Radio value={2}>{intl.get("components.bindCustomer.index.no")}</Radio>}
                                    colon={false}
                                    {...formItemLayout}
                                >
                                    <div style={{display:!this.state.selectCustomerVisible?'block':'none'}}>
                                        {intl.get("components.bindCustomer.index.msg4")}
                                    </div>
                                </Form.Item>
                        </Form>
                        </Radio.Group>
                    </div>
                </Modal>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncInsertMallCustomer:CustomerActions.asyncInsertMallCustomer,
        asyncBindMallCustomer:CustomerActions.asyncBindMallCustomer,
        asyncFetchOneCustomerByName:CustomerActions.asyncFetchOneCustomerByName,
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(Form.create()(BindCustomer))


