import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Select, message, Upload, Button, Radio, Cascader } from 'antd';
const { TextArea } = Input;
const Option  = Select.Option;

import defaultOptions from 'utils/validateOptions';
import {withRouter} from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {actions as customerEdit} from '../index'
import AddForm, {actions as addFormActions}  from 'components/layout/addForm'
import {actions as areaActions} from 'components/widgets/area/index';
import {actions as mallHomeActions, OpenAppletsPre, redirectToHome} from 'pages/mall/home'
import Crumb from 'components/business/crumb';
import Fold from 'components/business/fold';
import {SelectCustomerLv} from 'pages/auxiliary/customerLv';
import {getUrlParamValue} from 'utils/urlParam';
const cx = classNames.bind(styles);


class CustomerAddForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            editableField:['mallName','mallContacter','mallPhone','mallCsline','mallAddress','mallDesc'
                ,'mallStatus','needLogin','provinceCode','provinceText','cityCode','cityText'],
            applyStatus:0,
            mallStatus:0,
            openAppletsPreVisible: false
        };
    }
    initForm = (setting)=>{
        let obj = {};
        if(setting.mallContacter=='N/A'){
            setting.mallContacter = '';
        }
        this.state.editableField.forEach((item)=> {
            setting[item] && (obj[item] = setting[item]);
        });
        this.setState({
            applyStatus:setting.applyStatus,
            mallStatus:setting.mallStatus
        });
        obj.addressCode = [setting.provinceCode||'',setting.cityCode||''];
        this.props.form.setFieldsValue(obj);
        this.props.setInitFinished();
    };
    componentDidMount() {
        //初始化商城数据
        this.props.asyncGetProvinceList();
        this.refresh();
    }

    refresh=()=>{
        this.props.asyncFetchSettingInfo((res)=>{
            let setting = res.data||{};
            this.initForm(setting);
        });
    };

    displayRender = (label)=>{
        return label.join(' ');
    };
    onChange = (value,obj)=> {
        let provinceText,cityText,provinceCode,cityCode;
        if(obj.length===0){
            provinceText = cityText = provinceCode = cityCode ="";
        }else{
            provinceText = obj[0].label;
            cityText = obj[1].label;
            provinceCode = obj[0].value;
            cityCode = obj[1].value;
        }
        this.props.form.setFieldsValue({
            [`provinceText`]: provinceText,
            [`cityText`]: cityText,
            [`provinceCode`]: provinceCode,
            [`cityCode`]: cityCode,
        });
    };


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this;
                this.props.asyncEditMallSetting(values,(data)=>{
                    if (data.retCode == 0) {
                        message.success('操作成功！');
                        _this.props.emptyFieldChange();
                    }else {
                        alert(data.retMsg)
                    }
                });
            }
        });
    };

    onRadioChange = (e)=>{
        let value = e.target.value;
        this.setState({
            mallStatus:value==1
        })
    };


    closeModal = (tag)=>{
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };

    openModal = (tag)=>{
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };


    render() {
        const {areaInfo} = this.props;
        let options = areaInfo.getIn(['areaList']);
        options = options? options.toJS():[];
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            }
        };

        const formItemAdreeLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            }
        };

        const fullFormItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: '2d66'},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: '21d33'},
            }
        };

        const inputField = [
            {
                fieldName:"mallName",
                label:"名称",
                rules:[
                    {
                        required: true,
                        message: '商城名称为必填！'
                    },
                ],
                placeholder:"请填写完整公司全称",
                maxLength:80
            },
            {
                fieldName:"mallContacter",
                label:"联系人",
                rules:[
                    {
                        required: true,
                        message: '联系人为必填项！'
                    },
                ],
                maxLength:25
            },
            {
                fieldName:"mallPhone",
                label:"联系电话",
                rules:[
                    {
                        required: true,
                        message: '联系电话为必填项！'
                    },
                ],
                maxLength:20
            },
            {
                fieldName:"mallCsline",
                label:"客服热线",
                maxLength:20
            },
            {
                fieldName:"provinceCode",
                label:"经营地址",
                maxLength:50
            },
        ];


        const basicInfoInputArea = inputField.map((item,index)=>{
            if(item.fieldName==="provinceCode"){
                return <React.Fragment>
                    <Col span={8} key={index}>
                        <Form.Item label={item.label} {...formItemLayout}>
                            <div>
                                {getFieldDecorator(`addressCode`, {
                                })(
                                    <Cascader options={options}
                                              displayRender={this.displayRender}
                                              onChange={(value,obj)=>this.onChange(value,obj)} placeholder={'--请选择--'}/>
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={8} key={index}>
                        <Form.Item label={null} colon={false} {...formItemLayout}>
                            <div className={cx("field-val")}>
                                {getFieldDecorator(`mallAddress`, {
                                })(
                                    <Input placeholder="请输入详细地址" maxLength={120} />
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                </React.Fragment>
            }else{
                return <Col span={8} key={index} style={{ textAlign: 'right' }}>
                    <Form.Item label={item.label} {...formItemLayout}>
                        {
                            getFieldDecorator(item.fieldName, {
                                ...defaultOptions,
                                rules: item.rules
                            })(
                                <Input placeholder={item.placeholder} maxLength={item.maxLength}/>
                            )
                        }
                    </Form.Item>
                </Col>
            }
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/mall/',
                            title: '我的商城'
                        },
                        {
                            title: '设置'
                        }
                    ]}/>

                </div>
                <AddForm onSubmit={this.handleSubmit} loading={this.props.customerInfo.get('isFetching')}>
                    <div className="content-bd">
                        <Fold title="基础信息">
                            <Row>
                                {basicInfoInputArea}
                            </Row>

                        </Fold>
                        <Fold title="商城设置">
                            <Row>
                                <Col span={24}>
                                    <Form.Item label="是否开启商城" {...fullFormItemLayout}>
                                        {getFieldDecorator('mallStatus',{
                                            initialValue:0
                                        })(
                                            <Radio.Group onChange={this.onRadioChange}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </Radio.Group>,
                                        )}
                                    </Form.Item>
                                </Col>
                                {
                                    this.state.applyStatus==0?
                                        <Col span={24}>
                                            <Form.Item className={cx("open-applet-txt")} label={<React.Fragment/>} colon={false} {...fullFormItemLayout}>
                                                您还没有开通小程序商城哦，快去开通吧,
                                                <a href="#!" className={cx("open-applet")} onClick={()=>this.openModal('openAppletsPreVisible')}>马上开通</a>
                                            </Form.Item>
                                        </Col>
                                        :this.state.applyStatus==2?
                                        <Col span={24}>
                                            <Form.Item label="浏览小程序商城是否需要登录" {...fullFormItemLayout}>
                                                {getFieldDecorator('needLogin',{
                                                    initialValue:0
                                                })(
                                                    <Radio.Group disabled={!this.state.mallStatus}>
                                                        <Radio value={1}>是</Radio>
                                                        <Radio value={0}>否</Radio>
                                                    </Radio.Group>,
                                                )}
                                            </Form.Item>
                                        </Col>:null
                                }

                            </Row>
                        </Fold>
                        <Fold title="我的商城描述">
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label="商城描述"
                                        {...fullFormItemLayout}
                                    >
                                        {
                                            getFieldDecorator("mallDesc", {
                                                ...defaultOptions
                                            })(
                                                <TextArea rows={4} placeholder="您可以在这里填写公司的详细介绍，例如公司历史、经营范围、发展前景等，用于商城公司介绍。"/>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div style={{display:"none"}}>
                                {getFieldDecorator(`provinceText`)(<Input />)}
                                {getFieldDecorator(`cityText`)(<Input />)}
                                {getFieldDecorator(`provinceCode`)(<Input />)}
                                {getFieldDecorator(`cityCode`)(<Input />)}
                            </div>
                        </Fold>
                    </div>
                </AddForm>
                <OpenAppletsPre
                    visible={this.state.openAppletsPreVisible}
                    onClose={()=>this.closeModal('openAppletsPreVisible') }
                    okCallback={this.refresh}
                />
            </React.Fragment>
        );
    }
}




const mapStateToProps = (state) => ({
    customerInfo: state.getIn(['customerEdit', 'customerInfo']),
    areaInfo: state.getIn(['provinceAndCity', 'proviceAndCityInfo']),
    mallPreData: state.getIn(['mallHome', 'preData'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        setInitFinished: addFormActions.setInitFinished,
        asyncGetProvinceList:areaActions.asyncGetProvinceList,
        asyncFetchSettingInfo: mallHomeActions.asyncFetchSettingInfo,
        asyncEditMallSetting: mallHomeActions.asyncEditMallSetting,
    }, dispatch)
};

export default withRouter(redirectToHome(connect(mapStateToProps, mapDispatchToProps)(AddForm.create(CustomerAddForm))))

