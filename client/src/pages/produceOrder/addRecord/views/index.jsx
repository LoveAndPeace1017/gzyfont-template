import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {Input, message, Spin, Form, Modal, Select, Row, Col} from 'antd';
import {EllipsisOutlined} from '@ant-design/icons';
const {TextArea} = Input;
import 'url-search-params-polyfill';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {getUrlParamValue} from 'utils/urlParam';
import defaultOptions from 'utils/validateOptions';
import Crumb from 'components/business/crumb';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import Content from 'components/layout/content';
import {Custom as CustomField} from 'components/business/customField';
import {asyncFetchPreData, asyncAddProduceOrderRecord, emptyDetailData} from '../actions';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import {addPage} from  'components/layout/listPage';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import {SelectWorkProcess} from 'pages/auxiliary/workProcedure';
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import formMap from '../dependencies/initFormMap';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addProduceOrderRecord: state.getIn(['produceOrderRecord', 'addProduceOrderRecord']),
    preData: state.getIn(['produceOrderRecord', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddProduceOrderRecord,
        emptyDetailData,
        setInitFinished: addFormActions.setInitFinished,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig
    }, dispatch)
};

/**
 * @visibleName Index（生产记录新建）
 * @author jinb
 */
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@formCreate
export default class Index extends addPage {
    formRef = React.createRef();
    getCustomRef = (customRef) => {
        this.customRef = customRef
    };

    constructor(props) {
        super(props);
        this.state = {
            goodsPopVisible: false,
            submitData: {}
        };
    }

    componentDidMount() {
        this.preDataProcess();
    }

    componentWillUnmount() {
        this.props.emptyDetailData();
        this.props.emptyFieldConfig();
    }

    // 初始化数据的流程
    preDataProcess = async () => {
        let params = new URLSearchParams(this.props.location.search);
        let info = {};
        for(const [key, value] of params.entries()){
            if(value) info[key] = value;
        }
        let preInfo = await this.initPreData();
        info = {...info, ...preInfo};
        this.initForm(info);
        this.props.setInitFinished();
    };

    // 初始化数据
    initPreData = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData(data=>{
                if(data.retCode === '0'){
                    if(data.tags){
                        this.customRef.createCustomFields(data.tags);
                        if(data.user){
                            let {departmentName, employeeName} = data.user;
                            let ourContacterName = departmentName + '-' + employeeName;
                            resolve({ourContacterName});
                        }
                    }
                    resolve();
                }
                reject();
            });
        })
    };

    initForm = (info) => {
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 初始化表单数据 */
    initFormData = (info) => {
        return info;
    };

    /** 处理表单提交数据 */
    dealSubmitFormInfo = (values) => {

    };

    handleSubmit = async (values) => {
        console.log('Received values of form: ', values);
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 提交表单数据 */
        this.asyncSubmit(values);
    };

    // 提交表单数据
    asyncSubmit=(values)=> {
        this.props.asyncAddProduceOrderRecord(values, (res) => {
            if (res.data.retCode === '0') {
                message.success('操作成功');
                this.props.emptyFieldChange();
                this.props.history.push('/blank');
                let uri = '/produceOrder/addRecord';
                let {produceBillNo, workBillNo, productCode, prodName, ourContacterName} = values;
                let saveMap = {produceBillNo, workBillNo, productCode, prodName, ourContacterName};
                let flag = true;
                for(let key in saveMap){
                    let prefix = flag ? '?' : '&';
                    if(saveMap[key]){
                        uri += prefix + key + '=' + saveMap[key];
                        flag = false;
                    }
                }
                this.props.history.replace(uri);
            } else {
                Modal.error({
                    title: '提示信息',
                    content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||res.data.retMsg
                })
            }
        })
    };

    onProductChange = (selectedRows, visibleKey) => {
        const {setFieldsValue} = this.formRef.current;
        this.closeModal(visibleKey);
        if (selectedRows.length > 0) {
            const item = selectedRows[0];
            setFieldsValue({
                prodName: item.prodName,
                productCode: item.code
            });
        }
    };

    showGoodsList = () => {
        this.openModal('goodsPopVisible');
    };

    resetDefaultFields = ()=>{
        this.props.asyncFetchPreData(()=>{
            this.props.setInitFinished();
        });
    };

    render() {
        const {match, preData} = this.props;
        // 物品弹层的所选行
        let getFieldValue = null;
        if(this.formRef && this.formRef.current) {
            getFieldValue = this.formRef.current.getFieldValue;
        }
        let code = getFieldValue && getFieldValue('productCode');
        let prodName = getFieldValue && getFieldValue('prodName');
        let selectedRows = code ? [{key: code, code, prodName}] : [];
        let selectedRowKeys = code ? [code] : [];

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/produceOrder/',
                            title: "生产管理"
                        },
                        {
                            title: "新建生产记录"
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin spinning={preData.get('isFetching')}>
                        <AddForm {...this.props}
                                 onSubmit={this.handleSubmit}
                                 formRef={this.formRef}
                                 isModify={!!match.params.id}
                                 loading={preData.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <Row>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="生产单"
                                                    name={"produceBillNo"}
                                                    {...addPage.formItemLayout}
                                                >
                                                    <Input disabled={true}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="工单"
                                                    name={"workBillNo"}
                                                    {...addPage.formItemLayout}
                                                >
                                                    <Input disabled={true}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="工序"
                                                    name={"processCode"}
                                                    {...addPage.formItemLayout}
                                                >
                                                    <SelectWorkProcess showEdit={true}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="生产物品"
                                                    name={"prodName"}
                                                    rules={[
                                                        { required: true,message: "该项为必填项"}
                                                    ]}
                                                    {...addPage.formItemLayout}
                                                >
                                                    <Input
                                                        allowClear={true}
                                                        readOnly={true}
                                                        onClick={this.showGoodsList}
                                                        suffix={<EllipsisOutlined style={{fontSize: "16px"}} onClick={this.showGoodsList}/>}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="序列号"
                                                    name={"serialNumber"}
                                                    {...addPage.formItemLayout}
                                                >
                                                    <Input maxLength={20}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="批次号"
                                                    name={"batchNo"}
                                                    {...addPage.formItemLayout}
                                                >
                                                    <Input maxLength={20}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    {...addPage.formItemLayout}
                                                    {...addPage.otherFormItemLayout}
                                                    name="content"
                                                    label={'记录内容'}
                                                >
                                                    <TextArea rows={4} maxLength={2000} />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col span={8}>
                                                <Form.Item
                                                    {...addPage.formItemLayout}
                                                    {...defaultOptions}
                                                    name="ourContacterName"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "该项为必填项"
                                                        }
                                                    ]}
                                                    required={true}
                                                    label={'经办人'}
                                                >
                                                    <SelectEmployeeFix
                                                        showSearch={true}
                                                        showFullSize={true}
                                                        showVisible={true}
                                                        width={200}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <CustomField
                                            getRef={this.getCustomRef}
                                            dataPrefix={'propertyValues'}/>

                                        <div style={{display: "none"}}>
                                            <Form.Item
                                                label=""
                                                name={"productCode"}
                                            >
                                                <Input type="hidden"/>
                                            </Form.Item>
                                        </div>

                                        <SelectGoodsOrFitting
                                            visible={this.state.goodsPopVisible}
                                            visibleFlag={'goodsPopVisible'}
                                            onOk={(selectedRows, visibleKey) => this.onProductChange(selectedRows, visibleKey)}
                                            onCancel={() => this.closeModal('goodsPopVisible')}
                                            selectType={'radio'}
                                            popType={'goods'}
                                            condition={{disableFlag: 0}}
                                            selectedRows={selectedRows}
                                            selectedRowKeys={selectedRowKeys}
                                            salePriceEditable={false}
                                        />
                                    </React.Fragment>
                                )
                            }
                        </AddForm>
                    </Spin>
                </Content.ContentBd>
            </React.Fragment>
        );
    }
}
