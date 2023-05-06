import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Layout, Select, message, Button, Checkbox} from 'antd';
const { Content } = Layout;
const { TextArea } = Input;
import Upload from 'components/widgets/upload';
import defaultOptions from 'utils/validateOptions';
import axios from 'utils/axios';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {actions as supplierEdit} from '../index'
import {reducer as provinceAndCity} from "components/widgets/area";
import AddForm, {actions as addFormActions}  from 'components/layout/addForm'
import Crumb from 'components/business/crumb';
import Fold from 'components/business/fold';
import Tooltip from 'components/widgets/tooltip';
import Tip from 'components/widgets/tip';
import CustomField from 'components/business/customField';
import DeliveryAddress from 'components/business/deliveryAddress';
import {SelectGroupType} from 'pages/auxiliary/group';
import {Modal} from "antd/lib/index";
const cx = classNames.bind(styles);
let id = 0;

class SupplierAddForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            supplier:{},
            editableField:['displayCode','code','name','contacterName','mobile','email','supplierLoginName','remarks','dataTagList', 'legalRepresentative','registeredAddress','licenseNo', 'id'],
            option:'add',
            useSystemCode: true,
            tags:[],
            fileList: []
        };
    }
    initForm = (supplier)=>{
        // 处理交货地址
        // 处理自定义字段
        supplier.dataTagList = [];
        this.state.tags&&this.state.tags.forEach((item,index)=>{
            if(item.propName!=""){
                supplier.dataTagList.push({
                    index,
                    id:item.id,
                    mappingName:item.mappingName,
                    propName:item.propName,
                    propValue:supplier["propertyValue"+item.mappingName.slice(-1)]
                })
            }
        });
        if (supplier.dataTagList.length===0){
            supplier.dataTagList = [{
                index:5,
                mappingName:"property_value1",
                propValue:"",
                propName:""
            }];
        }

        let obj = {};
        this.state.editableField.forEach((item)=> {
            supplier[item] && (obj[item] = supplier[item]);
        });

        this.state.option === 'edit' ? (obj.groupName = supplier['groupId']+"" || "0") : null;

        this.props.form.setFieldsValue(obj);
        this.initContactInfo(supplier);
        this.props.setInitFinished();
    };
    componentDidMount() {
        //初始化供应商数据
        let _this = this;
        let supplierNo = this.props.match.params.id;
        this.props.asyncFetchSupplierPre(data => {
            if(data.data&&data.data.tags){
                _this.setState({tags:data.data.tags});
                _this.initForm({});
            }
            if(supplierNo){
                this.setState({option:'edit'});
                this.props.asyncShowSupplier(this.props.match.params.id,function(data){
                    let supplier = data.data||{};
                    let newFileInfo = supplier.fileInfo && supplier.fileInfo.map((file, index) => {
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
                    supplier.fileInfo && _this.setState({fileList: newFileInfo});
                    _this.initForm(supplier);
                });
            }
        });
    }
    //初始化联系人信息
    initContactInfo = (info)=>{
        console.log(info,'info');
        let {setFieldsValue} = this.props.form;
        let supplierContacterList = info.supplierContacterList;
        if(supplierContacterList){
            let otherContactInfo = [];
            let mainContacterInfo;
            let keysAry = [];
            let i = 0;
            supplierContacterList.forEach((item)=>{
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
                mobile:mainContacterInfo.mobile,
                email:mainContacterInfo.email,
                contacterTitle:mainContacterInfo.contacterTitle,
                mainContacterId: mainContacterInfo.id,
                keys: keysAry,
            });

            otherContactInfo && otherContactInfo.forEach((item,index)=>{
                //[`customerLevelPrices[${recId}].salePrice`]
                setFieldsValue({
                    [`supplierContacterList[${index}].contacterName`]: item.contacterName,
                    [`supplierContacterList[${index}].mobile`]: item.mobile,
                    [`supplierContacterList[${index}].email`]: item.email,
                    [`supplierContacterList[${index}].contacterTitle`]: item.contacterTitle,
                    [`supplierContacterList[${index}].id`]: item.id,
                });
            });
        }
    }

    clearUpCustomField = (values)=>{
        console.log(values, 'values');
        // 处理自定义字段
        // 需要和后端确认分别在什么时候使用propValue1和property_value1
        let tempArr = [];
        if(values.propName){
            values.propName.forEach((item,index)=>{
                if(item) {
                    values['propertyValue'+values.mappingName[index].slice(-1)] = values.propValue[index];
                    tempArr.push({
                        mappingName: values.mappingName[index],
                        propValue: values.propValue[index],
                        propName: values.propName[index],
                        customInfoType: 'SupplierCustomPropInfo'
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
            displayId && _this.props.history.push(`/supplier/show/${displayId}`);
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
        let _this = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values,'values');
                this.clearUpCustomField(values);
                let fileIds = this.state.fileList.map(item => item.response.fileId);

                //对数据进行处理
                values.groupName && (values.groupId = values.groupName);

                let mainContacter = {
                    contacterName: values.contacterName||'',
                    email: values.email||'',
                    mobile: values.mobile||'',
                    contacterTitle: values.contacterTitle||'',
                    id: values.mainContacterId||'',
                    isMain: 1
                }

                values.supplierContacterList ? (
                    values.supplierContacterList = values.supplierContacterList.filter((item)=> { return item}),
                    values.supplierContacterList.forEach((item)=>{
                        item.isMain = 0;
                    }),
                    values.supplierContacterList.push(mainContacter)
                ):(
                    values.supplierContacterList = [mainContacter]
                );


                let resValue = {
                    ...values,
                    fileIds
                };

                if(this.state.option==="add" ){
                    this.props.asyncInsertSupplier(resValue,function(data){
                        _this.callbackAfterEdit(data,_this);
                    });
                }else{
                    this.props.asyncModifySupplier(resValue,function(data){
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
        if (!isValidatedFile) {
            message.error(intl.get("supplier.add.tip1"));
        }
        const isLtSize = file.size / 1024 / 1024 <= 20;
        if (!isLtSize) {
            message.error(intl.get("supplier.add.tip2"));
        }
        return isValidatedFile && isLtSize;
    };

    handleChange = (info) => {
        let fileList = [...info.fileList];

        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name}`+ intl.get("supplier.add.success"));
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name}`+ intl.get("supplier.add.error"));
        }
        if(info.file.status){
            let successFileList = fileList.filter((item)=>{
                return item.status;
            });
            this.setState({fileList:successFileList});
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
        let ids = this.props.match.params.id;
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
                fieldName:"name",
                label: intl.get("supplier.add.name"),
                rules:[
                    {
                        required: true,
                        message: intl.get("supplier.add.tip3")
                    },
                    {
                        validator: (rules, val, callback) => {
                            if(this.state.comName&&val!=this.state.comName){
                                message.warn(intl.get("supplier.add.validate1"));
                            }
                            callback();
                        }
                    },
                    {
                        validator: (rules, val, callback) => {
                            axios.get(`${BASE_URL}/supplier/isExistName/${val}?code=${this.props.match.params.id}`).then(res => {
                                if (res.data && res.data.retCode == 0 && res.data.data) {
                                    callback(intl.get("supplier.add.validate2"))
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
                placeholder: intl.get("supplier.add.placeholder"),
                maxLength:80
            },
            /*{
                fieldName:"contacterName",
                label:intl.get("supplier.add.contacterName"),
                maxLength:25
            },
            {
                fieldName:"mobile",
                label:intl.get("supplier.add.mobile"),
                maxLength:50
            },
            {
                fieldName:"email",
                label:intl.get("supplier.add.email"),
                rules:[
                    {
                        type: "email",
                        message: intl.get("supplier.add.rule")
                    },
                ],
                maxLength:50
            },*/
            {
                fieldName:"supplierLoginName",
                label:intl.get("supplier.add.supplierLoginName"),
                rules:[
                    {
                        validator: (rules, val, callback) => {
                            if(val){
                                let _this = this;
                                axios.get(`${BASE_URL}/supplier/isExistBindAccount/${val}?code=${this.props.match.params.id}`).then(res => {
                                    if (res.data && res.data.retCode != 0 ) {
                                        callback( res.data.retMsg)
                                    }
                                    else {
                                        if(res.data.data){
                                            let comName = _this.props.form.getFieldValue('name');
                                            if(comName&&comName!=res.data.data){
                                                message.warn(intl.get("supplier.add.validate3"));
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
                // placeholder:"相互绑定百卓账号后，可在线给供应商发订单",
                maxLength:20
            },
            {
                fieldName:"legalRepresentative",
                label:intl.get("supplier.add.legalRepresentative"),
                maxLength:25
            },
            {
                fieldName:"registeredAddress",
                label:intl.get("supplier.add.registeredAddress"),
                maxLength:120
            },
            {
                fieldName:"licenseNo",
                label:intl.get("supplier.add.licenseNo"),
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
                            item.fieldName==="levelName"
                            ?(
                                <Select>
                                    <Option value=""></Option>
                                </Select>
                            )
                            :<Input placeholder={item.placeholder} maxLength={item.maxLength}/>
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
                            {getFieldDecorator(`supplierContacterList[${k}].contacterName`)(<Input addonBefore="联系人" placeholder="联系人"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={5} key={k+"11"} style={{ textAlign: 'right' }}>
                        <Form.Item
                            {...formItemInfoLayout}
                            label={""}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`supplierContacterList[${k}].mobile`)(<Input addonBefore="联系电话"  placeholder="联系电话"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={5} key={k+"12"} style={{ textAlign: 'right' }}>
                        <Form.Item
                            {...formItemInfoLayout}
                            label={""}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`supplierContacterList[${k}].email`)(<Input addonBefore="电子邮箱" placeholder="电子邮箱"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={5} key={k+"13"}>
                        <Form.Item
                            {...formItemInfoLayout}
                            label={""}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`supplierContacterList[${k}].contacterTitle`)(
                                <Input placeholder="职务" addonBefore="职务" maxLength={20} style={{width: "90%"}}/>)}
                            <MinusCircleOutlined
                                style={{marginLeft: "2%"}}
                                onClick={() => this.remove(k)}
                            />
                        </Form.Item>
                        {
                            getFieldDecorator(`supplierContacterList[${k}].id`)
                        }
                    </Col>
                </Row>
            </>
        ));


		return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/supplier/',
                            title: intl.get("supplier.add.crumb")
                        },
                        {
                            title: this.state.option==="add"?intl.get("supplier.add.crumb1"):intl.get("supplier.add.crumb2")
                        }
                    ]}/>
                </div>
                <AddForm onSubmit={this.handleSubmit} loading={this.props.supplierInfo.get('isFetching')}>
                    <div className="content-bd">
                        <Fold title={intl.get("supplier.add.title")}>
                            <Row>
                                {
                                    ids?(
                                        <Col span={8} key={'a1'}>
                                            <Form.Item label={"供应商编号"} {...formItemLayout}>
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
                                                <Form.Item label={"供应商编号"} {...formItemLayout}>
                                                    {
                                                        getFieldDecorator("displayCode", {
                                                            ...defaultOptions,
                                                            rules:[
                                                                {
                                                                    required: !this.state.useSystemCode,
                                                                    message: "供应商编号为必填项"
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
                                    <Form.Item label={"供应商分组"} {...formItemLayout}>
                                        {
                                            getFieldDecorator("groupName", {
                                                ...defaultOptions,
                                            })(
                                                <SelectGroupType type={"supply"}/>
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
                                            getFieldDecorator("mobile", {
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
                        <Fold title={intl.get("supplier.add.title1")}>
                            <CustomField {...this.props}/>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={intl.get("supplier.add.remark")}
                                        {...otherFormItemLayout}
                                    >
                                        {
                                            getFieldDecorator("remarks", {
                                                initialValue: data.remarks,
                                                ...defaultOptions
                                            })(
                                                <TextArea rows={4} placeholder={intl.get("supplier.add.remark")}/>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        label={intl.get("supplier.add.tempAtt")}
                                        {...formItemLayout}
                                    >
                                        {
                                            getFieldDecorator("tempAtt", {
                                                ...defaultOptions
                                            })(
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
                                                                title={intl.get("supplier.add.tip4")}
                                                            >
                                                                <Button>
                                                                    <LegacyIcon type={this.state.loading ? 'loading' : 'upload'}/> {intl.get("supplier.add.addAtt")}
                                                                </Button>
                                                            </Tooltip>
                                                        ) : null
                                                    }
                                                </Upload>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Fold>
                        <div style={{display: "none"}}>
                            {getFieldDecorator('id', {
                                initialValue: data.id
                            })(
                                <Input/>
                            )}
                            {getFieldDecorator('code', {
                                initialValue: data.code
                            })(
                                <Input/>
                            )}
                        </div>
                    </div>
                </AddForm>
            </React.Fragment>
        );
	}
}




const mapStateToProps = (state) => ({
    supplierInfo: state.getIn(['supplierEdit', 'supplierInfo']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncInsertSupplier:supplierEdit.asyncInsertSupplier,
        asyncModifySupplier:supplierEdit.asyncModifySupplier,
        asyncShowSupplier:supplierEdit.asyncShowSupplier,
        asyncFetchSupplierPre:supplierEdit.asyncFetchSupplierPre,
        setInitFinished: addFormActions.setInitFinished
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(AddForm.create(SupplierAddForm))

