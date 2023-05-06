import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Select, message, Button, Checkbox} from 'antd';
const { TextArea } = Input;
const Option  = Select.Option;
let id = 0;
import defaultOptions from 'utils/validateOptions';
import axios from 'utils/axios';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {actions as customerEdit} from '../index'
import AddForm, {actions as addFormActions}  from 'components/layout/addForm'
import Crumb from 'components/business/crumb';
import intl from 'react-intl-universal';
import Fold from 'components/business/fold';
import CustomField from 'components/business/customField';
import DeliveryAddress from 'components/business/deliveryAddress';
import {SelectCustomerLv} from 'pages/auxiliary/customerLv';
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import {SelectExpress} from 'pages/auxiliary/express';
import {SelectGroupType} from 'pages/auxiliary/group';
import Tooltip from 'components/widgets/tooltip';
import Upload from 'components/widgets/upload';
import {getUrlParamValue} from 'utils/urlParam';
const cx = classNames.bind(styles);
import {actions as mallHomeActions} from 'pages/mall/home';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {Modal} from "antd/lib/index";

class CustomerAddForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            customer:{},
            editableField:['customerNo','customerName','contacterName','telNo','email','levelId','legalRepresentative','registeredAddress','licenseNo'
                ,'customerLoginName','remarks','customerAddressList','dataTagList', 'id','followStatus','displayCode'],
            option:'add',
            useSystemCode: true,
            source:'',
            fileList: []
        };
    }
    initForm = (customer)=>{
        // 处理交货地址
        if (!customer.customerAddressList||customer.customerAddressList.length===0){
            customer.customerAddressList = [{provinceCode:"",cityCode:"",provinceText:"",cityText:"",address:"",}];
        }
        customer.customerAddressList =  customer.customerAddressList.map((item,index)=>{
            return {...item,index};
        });
        // 处理自定义字段
        customer.dataTagList = [];
        this.state.tags&&this.state.tags.forEach((item,index)=>{
            if(item.propName!=""){
                customer.dataTagList.push({
                    index,
                    id:item.id,
                    mappingName:item.mappingName,
                    propName:item.propName,
                    propValue:customer["propValue"+item.mappingName.slice(-1)]
                })
            }
        });
        if (customer.dataTagList.length===0){
            customer.dataTagList = [{
                index:5,
                mappingName:"property_value1",
                propValue:"",
                propName:""
            }];
        }

        let obj = {};
        this.state.editableField.forEach((item)=> {
            customer[item] && (obj[item] = customer[item]);
        });

        this.state.option === 'edit' ? (obj.groupName = customer['groupId']+"" || "0") : null;

        obj.saleMan = customer.deptEmployeeName && customer.deptEmployeeName;
        this.props.form.setFieldsValue(obj);
        this.initContactInfo(customer);
        this.props.setInitFinished();
    };
    componentDidMount() {
        //初始化客户数据
        let _this = this;
        let customerNo = this.props.match.params.id;
        this.setState({
            source:getUrlParamValue('source')
        });
        let customer = {};
        this.props.asyncFetchCustomerPre(data => {
            if(data.data&&data.data.tags){
                _this.setState({tags:data.data.tags});
                _this.initForm({});
            }
            if(customerNo){
                this.setState({option:'edit'});
                this.props.asyncShowCustomer(this.props.match.params.id,function(data){
                    customer = data.data||{};

                    let newFileInfo = customer.fileInfo && customer.fileInfo.map((file, index) => {
                        file.uid = -(index+1);
                        file.url = `${BASE_URL}/file/download/?url=/file/download/${file.fileId}`;
                        file.name = file.fileName;
                        file.status = 'done';
                        file.response = {
                            fileId: file.fileId
                        };
                        return file;
                    });
                    _this.setState({tags:data.tags});
                    customer.fileInfo && _this.setState({fileList: newFileInfo});
                    _this.initForm(customer);
                });
            }
        });
    }
    //初始化联系人信息
    initContactInfo = (info)=>{
        console.log(info,'info');
        let {setFieldsValue} = this.props.form;
        let customerContacterList = info.customerContacterList;
        if(customerContacterList){
            let otherContactInfo = [];
            let mainContacterInfo;
            let keysAry = [];
            let i = 0;
            customerContacterList.forEach((item)=>{
                if(item.isMain === 1){
                    mainContacterInfo = item;
                }else{
                    otherContactInfo.push(item);
                    keysAry.push(i);
                    i++;
                }
            });
            id = i;
            console.log(keysAry,'keysAry');
            console.log(otherContactInfo,'otherContactInfo');
            mainContacterInfo && setFieldsValue({
                contacterName:mainContacterInfo.contacterName,
                telNo:mainContacterInfo.telNo,
                email:mainContacterInfo.email,
                contacterTitle:mainContacterInfo.contacterTitle,
                mainContacterId: mainContacterInfo.id,
                keys: keysAry,
            });

            otherContactInfo && otherContactInfo.forEach((item,index)=>{
                //[`customerLevelPrices[${recId}].salePrice`]
                setFieldsValue({
                    [`customerContacterList[${index}].contacterName`]: item.contacterName,
                    [`customerContacterList[${index}].telNo`]: item.telNo,
                    [`customerContacterList[${index}].email`]: item.email,
                    [`customerContacterList[${index}].contacterTitle`]: item.contacterTitle,
                    [`customerContacterList[${index}].id`]: item.id,
                });
            });
        }
    }


    // 处理交货地址
    clearUpDeliverAddress = (values)=>{
        let customerAddressList = [];
        if(values.cityCode){
            for(let i=0;i<values.cityCode.length;i++){
                if(values.provinceText[i]){
                    customerAddressList.push({
                        "address": values.address[i],
                        "cityCode": values.cityCode[i][1],
                        "cityText": values.cityText[i],
                        "provinceCode": values.cityCode[i][0],
                        "provinceText": values.provinceText[i],
                    });
                }
            }
        }
        values.customerAddressList = customerAddressList;
    };
    clearUpCustomField = (values)=>{
        // 处理自定义字段
        // 需要和后端确认分别在什么时候使用propValue1和property_value1
        let tempArr = [];
        if(values.propName){
            values.propName.forEach((item,index)=>{
                if(item){
                    values['propValue'+values.mappingName[index].slice(-1)] = values.propValue[index];
                    tempArr.push({
                        mappingName: values.mappingName[index],
                        propValue: values.propValue[index],
                        propName: values.propName[index],
                        customInfoType:'CustomerCustomPropInfo'
                    });
                }
            });
        }
        values.dataTagList = tempArr;
        values.dataTagList.forEach((item)=>{
            this.state.tags.some((tag)=>{
                if(tag.mappingName==item.mappingName){
                    item.id = tag.id;
                }
            })
        });
    };
    callbackAfterEdit = (data,_this)=>{
        if (data.retCode == 0) {
            let displayId = data.data;
            message.success(intl.get('common.confirm.success'));
            this.props.emptyFieldChange();
            //如果从引导过来则进入商城客户列表页
            if(this.props.location.state && (this.props.location.state.fromFourStep || this.props.location.state.fromExplore)){
                this.props.asyncFetchMallPreData(); //引导需要获取探索我的商城任务完成状态
                this.props.history.push(`/mall/customer/`, {...this.props.location.state, fromGuideAdd: true});
            }else{
                let url = `/customer/show/${displayId}`;
                if(this.state.source=='mall'){
                    url = `/customer/show/${displayId}?source=mall&current=/mall/customer/`;
                }
                displayId && _this.props.history.push(url);
            }

        }
        else {
            Modal.error({
                title: '提示信息',
                content: data.retValidationMsg.msg[0].msg || data.retMsg
            });
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        let _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.clearUpDeliverAddress(values);
                this.clearUpCustomField(values);

                let fileIds = this.state.fileList.map(item => item.response.fileId);
                /*let tempAtt = values.tempAtt ? values.tempAtt.fileList : [];
                tempAtt && tempAtt.forEach(item=>{
                    if(item.status === 'done' && item.response){
                        fileIds.push(item.response.fileId)
                    }
                });*/

                //对数据进行处理
                values.groupName && (values.groupId = values.groupName);

                let mainContacter = {
                    contacterName: values.contacterName||'',
                    email: values.email||'',
                    telNo: values.telNo||'',
                    contacterTitle: values.contacterTitle||'',
                    id: values.mainContacterId||'',
                    isMain: 1
                }

                values.customerContacterList ? (
                    values.customerContacterList = values.customerContacterList.filter((item)=> { return item}),
                        values.customerContacterList.forEach((item)=>{
                            item.isMain = 0;
                        }),
                        values.customerContacterList.push(mainContacter)
                ):(
                    values.customerContacterList = [mainContacter]
                );



                let resValue = {
                    ...values,
                    fileIds
                };

                if(values.saleMan){
                    resValue.departmentName = values.saleMan.split('-')[0]
                    resValue.employeeName = values.saleMan.split('-')[1]
                }

                if(this.state.option==="add" ){
                    if(this.state.source=='mall'){
                        resValue.source = 'mall';
                    }
                    this.props.asyncInsertCustomer(resValue,function(data){
                        _this.callbackAfterEdit(data,_this);
                    });
                }else{
                    this.props.asyncModifyCustomer(resValue,function(data){
                        _this.callbackAfterEdit(data,_this);
                    });
                }
            } else {
                message.error('存在信息不符合规则，请修改！');
            }
        });
    };

    beforeUpload = (file) => {
        const isValidatedFile = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp'
            || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' //doc 、docx
            || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' //xsl 、xsls
            || file.type === 'application/pdf' || file.type === 'text/plain' || file.type === 'application/zip' //pdf、txt、zip
            || /\.rar$/.test(file.name);  // rar格式的file.type为空（搞不懂），所以只能用名称判断了
        console.log('file type:', file.type);
        if (!isValidatedFile) {
            message.error(intl.get('customer.add.errorContent'));
        }
        const isLtSize = file.size / 1024 / 1024 <= 20;
        if (!isLtSize) {
            message.error(intl.get('customer.add.errorContent1'));
        }
        return isValidatedFile && isLtSize;
    };

    handleChange = (info) => {
        let fileList = [...info.fileList];

        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name}`+intl.get('customer.add.success'));
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name}`+intl.get('customer.add.error'));
        }
        if(info.file.status){
            let successFileList = fileList.filter((item)=>{
                return item.status;
            });
            this.setState({fileList:successFileList})
        }
    };

    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        /*if (keys.length === 1) {
            return;
        }*/
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    setProdNo = (e) => {
        this.setState({
            useSystemCode: e.target.checked
        },()=>{
            const {setFieldsValue} = this.props.form;
            setFieldsValue({
                displayCode:''
            });
        });
    };

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        let ids = (this.state.option === "edit");
        let data = {};

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

        const formItemInfoLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 0 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            }
        };

        const otherFormItemLayout = {
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
                fieldName:"customerName",
                label:intl.get('customer.add.customerName'),
                rules:[
                    {
                        required: true,
                        message: intl.get('customer.add.rule')
                    },
                    {
                        validator: (rules, val, callback) => {
                            if(this.state.comName&&val!=this.state.comName){
                                message.warn(intl.get('customer.add.rule1'));
                            }
                            callback();
                        }
                    },
                    {
                        validator: (rules, val, callback) => {
                            axios.get(`${BASE_URL}/customer/isExistName/${val}?customerNo=${this.props.match.params.id}`).then(res => {
                                if (res.data && res.data.retCode != 0 && res.data.retMsg) {
                                    callback(intl.get('customer.add.rule2'))
                                }
                                else {
                                    callback();
                                }
                            }).catch(error => {
                                callback(error);
                            });
                        }
                    }
                ],
                placeholder:intl.get('customer.add.placeholder'),
                maxLength:80
            },
            /*{
                fieldName:"contacterName",
                label:intl.get('customer.add.contacterName'),
                maxLength:25
            },
            {
                fieldName:"telNo",
                label:intl.get('customer.add.telNo'),
                maxLength:50
            },
            {
                fieldName:"email",
                label:intl.get('customer.add.email'),
                rules:[
                    {
                        type: "email",
                        message: intl.get('customer.add.rule3')
                    },
                ],
                maxLength:50
            },*/
            {
                fieldName:"levelId",
                label:intl.get('customer.add.levelId'),
                maxLength:50
            },
            {
                fieldName:"customerLoginName",
                label:intl.get('customer.add.customerLoginName'),
                rules:[
                    {
                        validator: (rules, val, callback) => {
                            if(val){
                                let _this = this;
                                axios.get(`${BASE_URL}/customer/isExistBindAccount/${val}?customerNo=${this.props.match.params.id}`).then(res => {
                                    if (res.data && res.data.retCode != 0 ) {
                                        callback( res.data.retMsg)
                                    }
                                    else {
                                        if(res.data.data){
                                            let comName = _this.props.form.getFieldValue('customerName');
                                            if(comName&&comName!=res.data.data){
                                                message.warn(intl.get('customer.add.rule4'));
                                            }
                                            this.setState({'comName':res.data.data});
                                        }
                                        callback();
                                    }
                                }).catch(error => {
                                    callback(error);
                                });
                            }else{
                                callback();
                            }

                        }
                    }
                ],
                // placeholder:"相互绑定百卓账号后，客户即可在线订货",
                maxLength:20
            },
            {
                fieldName:"legalRepresentative",
                label:intl.get('customer.add.legalRepresentative'),
                maxLength:25
            },
            {
                fieldName:"registeredAddress",
                label:intl.get('customer.add.registeredAddress'),
                maxLength:120
            },
            {
                fieldName:"licenseNo",
                label:intl.get('customer.add.licenseNo'),
                maxLength:50
            }
        ];


        const basicInfoInputArea = inputField.map((item,index)=>
            <Col span={8} key={index} style={{ textAlign: 'right' }}>
                <Form.Item label={item.label} {...formItemLayout}>
                    {
                        getFieldDecorator(item.fieldName, {
                            initialValue:data[item.fieldName],
                            ...defaultOptions,
                            rules: item.rules
                        })(
                            item.fieldName==="levelId"
                                ?<SelectCustomerLv showEdit={true}/>
                                : <Input placeholder={item.placeholder} maxLength={item.maxLength}/>
                        )
                    }
                </Form.Item>

            </Col>
        );

        //处理联系人模块
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');

        const formItems = keys.map((k, index) => (
            <>
                <Row>
                    <Col span={2}> </Col>
                    <Col span={5} key={k+"10"} style={{ textAlign: 'right' }}>
                        <Form.Item
                            {...formItemInfoLayout}
                            label={""}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`customerContacterList[${k}].contacterName`)(<Input addonBefore="联系人" placeholder="联系人"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={5} key={k+"11"} style={{ textAlign: 'right' }}>
                        <Form.Item
                            {...formItemInfoLayout}
                            label={""}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`customerContacterList[${k}].telNo`)(<Input addonBefore="联系电话"  placeholder="联系电话"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={5} key={k+"12"} style={{ textAlign: 'right' }}>
                        <Form.Item
                            {...formItemInfoLayout}
                            label={""}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`customerContacterList[${k}].email`)(<Input addonBefore="电子邮箱" placeholder="电子邮箱"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={5} key={k+"13"}>
                        <Form.Item
                            {...formItemInfoLayout}
                            label={""}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`customerContacterList[${k}].contacterTitle`)(
                                <Input placeholder="职务" addonBefore="职务" maxLength={20} style={{width: "90%"}}/>)}
                            <MinusCircleOutlined
                                style={{marginLeft: "2%"}}
                                onClick={() => this.remove(k)}
                            />
                        </Form.Item>
                        {
                            getFieldDecorator(`customerContacterList[${k}].id`)
                        }
                    </Col>
                </Row>
            </>
        ));

        return (
            <React.Fragment>
                <div className="content-hd">
                    {
                        getUrlParamValue('source')==='mall'?<Crumb data={[
                            {
                                url: '/mall/',
                                title: intl.get('customer.add.crumb')
                            },
                            {
                                url: '/mall/customer/',
                                title: intl.get('customer.add.crumb1')
                            },
                            {
                                title: this.state.option==="add"?intl.get('customer.add.crumb2'):intl.get('customer.add.crumb3')
                            }
                        ]}/>:<Crumb data={[
                            {
                                url: '/customer/',
                                title: intl.get('customer.add.crumb4')
                            },
                            {
                                title: this.state.option==="add"?intl.get('customer.add.crumb5'):intl.get('customer.add.crumb6')
                            }
                        ]}/>
                    }

                </div>
                <AddForm
                    onSubmit={this.handleSubmit}
                    loading={this.props.customerInfo.get('isFetching')}
                    confirmButtonRender={confirmButton=>{
                        if(this.props.location.state && (this.props.location.state.fromFourStep || this.props.location.state.fromExplore)){
                            return (
                                <Tooltip
                                    visible={true}
                                    type="info"
                                    title={intl.get('customer.add.title')}
                                    placement="right"
                                >
                                    {confirmButton}
                                </Tooltip>
                            )
                        }else{
                            return confirmButton
                        }
                    }}
                >
                    <div className="content-bd">
                        <Fold title={intl.get('customer.add.title1')}>
                            <Row>
                                {
                                    ids?(
                                        <Col span={8} key={'a1'}>
                                            <Form.Item label={"客户编号"} {...formItemLayout}>
                                                {
                                                    getFieldDecorator("displayCode", {
                                                        ...defaultOptions,
                                                    })(
                                                        <Input className={cx("readOnly")} maxLength={50} readOnly={true}/>
                                                    )
                                                }
                                            </Form.Item>
                                        </Col>
                                    ):(
                                        <Col span={8} key={'a1'}>
                                            <div className={cx("input-prodNo")}>
                                                <Form.Item label={"客户编号"} {...formItemLayout}>
                                                    {
                                                        getFieldDecorator("displayCode", {
                                                            ...defaultOptions,
                                                            rules:[
                                                                {
                                                                    required: !this.state.useSystemCode,
                                                                    message: "客户编号为必填项"
                                                                }
                                                            ]
                                                        })(
                                                            <Input maxLength={140} disabled={this.state.useSystemCode}/>
                                                        )
                                                    }
                                                </Form.Item>
                                            </div>
                                            <Checkbox onChange={this.setProdNo} className={cx("ck-prodNo")} checked={this.state.useSystemCode}>{intl.get("goods.add.ckProdNo")}</Checkbox>
                                        </Col>
                                    )

                                }
                                {basicInfoInputArea}
                                {/*<span><Icon type="info-circle" theme="filled" />绑定百卓账号后，即为好友关系，可在软件内给对方发订单</span>*/}
                                <Col span={8} key={10}>
                                    <Form.Item label={"客户分组"} {...formItemLayout}>
                                        {
                                            getFieldDecorator("groupName", {
                                                ...defaultOptions,
                                            })(
                                                <SelectGroupType type={"custom"}/>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Fold>
                        <Fold title={"联系人信息"}>
                            <Row>
                                <Col span={2} key={1}> </Col>
                                <Col span={5} key={2}>
                                    <Form.Item label={""} {...formItemInfoLayout}>
                                        {
                                            getFieldDecorator("contacterName", {
                                                ...defaultOptions,
                                            })(
                                                <Input placeholder={"联系人"} addonBefore="联系人" maxLength={25}/>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={5} key={3}>
                                    <Form.Item label={""} {...formItemInfoLayout}>
                                        {
                                            getFieldDecorator("telNo", {
                                                ...defaultOptions,
                                            })(
                                                <Input placeholder={"联系电话"} addonBefore="联系电话" maxLength={50}/>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={5} key={5}>
                                    <Form.Item label={""} {...formItemInfoLayout}>
                                        {
                                            getFieldDecorator("email", {
                                                ...defaultOptions,
                                            })(
                                                <Input placeholder={"电子邮箱"} addonBefore="电子邮箱" maxLength={50}/>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={5} key={4}>
                                    <Form.Item label={""} {...formItemInfoLayout}>
                                        {
                                            getFieldDecorator("contacterTitle", {
                                                ...defaultOptions,
                                            })(
                                                <Input placeholder={"职务"} addonBefore="职务" maxLength={20}/>
                                            )
                                        }
                                    </Form.Item>
                                    {
                                        getFieldDecorator(`mainContacterId`)
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col span={2} key={1}> </Col>
                                <Col span={22} key={2}>
                                    <div style={{paddingBottom: "15px"}}>其他联系人</div>
                                </Col>
                            </Row>
                            {formItems}
                            {
                                keys.length>3?null:(
                                    <Row>
                                        <Col span={2} key={1}> </Col>
                                        <Col span={22} key={2}>
                                            <Button  onClick={this.add} icon={<PlusOutlined />}>
                                                添加联系人
                                            </Button>
                                        </Col>
                                    </Row>
                                )
                            }
                        </Fold>
                        <Fold title={intl.get('customer.add.title2')}>
                            <Row>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Form.Item label={intl.get('customer.add.title3')}  {...formItemLayout}>
                                    {
                                        getFieldDecorator("followStatus", {
                                            initialValue:data.followStatus,
                                            ...defaultOptions,
                                        })(
                                            <Select>
                                                <Option value="初访">{intl.get('customer.add.option1')}</Option>
                                                <Option value="意向">{intl.get('customer.add.option2')}</Option>
                                                <Option value="报价">{intl.get('customer.add.option3')}</Option>
                                                <Option value="成交">{intl.get('customer.add.option4')}</Option>
                                                <Option value="搁置">{intl.get('customer.add.option5')}</Option>
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Form.Item label={intl.get('customer.add.saleMan')}  {...formItemLayout}>
                                    {
                                        getFieldDecorator("saleMan", {
                                            initialValue: data.departmentName && (data.departmentName+'-'+data.employeeName),
                                            ...defaultOptions,
                                        })(
                                            <SelectEmployeeFix
                                                showFullSize={true}
                                                showVisible={true}
                                                width={200}
                                            />
                                        )
                                    }
                                </Form.Item>
                            </Col>
                            </Row>
                        </Fold>
                        <Fold title={intl.get('customer.add.title4')}>
                            <DeliveryAddress {...this.props} formItemLayout={otherFormItemLayout}/>
                            <CustomField {...this.props}/>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={intl.get('customer.add.remarks')}
                                        {...fullFormItemLayout}
                                    >
                                        {
                                            getFieldDecorator("remarks", {
                                                initialValue: data.remarks,
                                                ...defaultOptions
                                            })(
                                                <TextArea rows={4} placeholder={intl.get('customer.add.remarks')}/>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        label={intl.get('customer.add.tempAtt')}
                                        {...formItemLayout}
                                    >
                                        {
                                            getFieldDecorator("tempAtt", {
                                                ...defaultOptions
                                            })(
                                                <React.Fragment>
                                                    <Upload
                                                        action={`${BASE_URL}/file/new_temp_attachs`}
                                                        name={"file"}
                                                        onChange={this.handleChange}
                                                        beforeUpload={this.beforeUpload}
                                                        multiple={true}
                                                        fileList={this.state.fileList}
                                                    >
                                                        {
                                                            this.state.fileList.length < 3 ? (
                                                                <Tooltip
                                                                    type="info"
                                                                    title={intl.get('customer.add.errorContent3')}
                                                                >
                                                                    <Button>
                                                                        <LegacyIcon type={this.state.loading ? 'loading' : 'upload'}/> {intl.get('customer.add.addAttr')}
                                                                    </Button>
                                                                </Tooltip>
                                                            ) : null
                                                        }
                                                    </Upload>
                                                </React.Fragment>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Fold>
                    </div>
                    <div style={{display: "none"}}>
                        {getFieldDecorator('id', {
                            initialValue: data.id
                        })(
                            <Input/>
                        )}
                        {getFieldDecorator('customerNo', {
                            initialValue: data.customerNo
                        })(
                            <Input/>
                        )}
                        {getFieldDecorator('levelName', {
                            initialValue: data.levelName
                        })(
                            <Input/>
                        )}
                    </div>
                </AddForm>
            </React.Fragment>
        );
    }
}




const mapStateToProps = (state) => ({
    customerInfo: state.getIn(['customerEdit', 'customerInfo']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncInsertCustomer:customerEdit.asyncInsertCustomer,
        asyncModifyCustomer:customerEdit.asyncModifyCustomer,
        asyncShowCustomer:customerEdit.asyncShowCustomer,
        asyncInsertMallCustomer:customerEdit.asyncInsertMallCustomer,
        asyncFetchCustomerPre:customerEdit.asyncFetchCustomerPre,
        setInitFinished: addFormActions.setInitFinished,
        asyncFetchMallPreData: mallHomeActions.asyncFetchPreData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(AddForm.create(CustomerAddForm))

