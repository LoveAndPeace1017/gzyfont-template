import React from 'react';
import {Table, Input, Form, DatePicker, Divider, Modal, Spin, Checkbox, Button, message, Row, Col} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import {checkWareArriveUpperLimit, dealCheckWareUpperLimitData, actions as wareUpperLimitActions} from 'components/business/checkWareArriveUpperLimit';
import styles from "../../../../components/business/batchEditPop/styles/index.scss";
import classNames from "classnames/bind";
import PropTypes from "prop-types";
import intl from 'react-intl-universal';
const cx = classNames.bind(styles);
import {SerialNumQuerySearch} from 'pages/goods/serialNumQuery/index';
import {EllipsisOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {SelectBatchShelf} from 'components/business/batchShelfLeft';
import {asyncAddSale, asyncFetchPreData} from 'pages/inventory/inbound/add/actions';
import {actions as approveActions, SelectApproveItem, BACKEND_TYPES, withApprove} from 'components/business/approve';
import {addPage} from  'components/layout/listPage';
import {emptyFieldChange} from 'components/layout/addForm/actions';
import {asyncFetchBatchShelfList} from 'components/business/batchShelfLeft/actions';
import {SelectDept} from 'pages/auxiliary/dept';
import {SelectEmployee} from 'pages/auxiliary/employee';
import {withRouter} from "react-router-dom";
import {getCookie} from 'utils/cookie';


const mapStateToProps = (state) => ({
    warehouseList: state.getIn(['warehouseIndex', 'warehouseList']),
    billListInfo: state.getIn(['saleIndex', 'batchWareOutPre'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        emptyFieldChange,
        asyncAddSale,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncCheckWareArriveUpperLimit: wareUpperLimitActions.asyncCheckWareArriveUpperLimit,
        asyncFetchPreData,
        asyncFetchBatchShelfList
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withApprove
export default class productEnterWarehousePop extends addPage {
    formRef = React.createRef();

    static propTypes = {
        /** modal是否可见 */
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
    };


    constructor(props) {
        super(props);
        this.state = {
            BatchShelfVisible: false,
            open: false,
            isLoading: false,
            dataPrefix: 'prodList',
            currentKey: 0,
            formData: [{key: 0}],
            productCode: '',
            warehouseName: '',
            limitOnlineTip: false,
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 0,  // 当前模块是否开启审批权限 0 无 1 有
            approveStatus: 0,   //审批状态 0 未提交  1 通过  2 反驳  3 审批中
            submitData: {}, // 新增最终提交表单的信息
            idx: 0,  // 当前的所在行号
        };
    }

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    closeModals = () =>{
        this.setState({limitOnlineTip:false})
    };

    onCancelCallback = () => {
        this.setState({
            currentKey: 0,
            enterType: 5, // 5: 内部制造  6: 委外加工
            idx: 0,
            formData: [{key: 0}],
        });
        this.formRef.current.resetFields();
    };

    initData = (dataSource, otherData) => {
        let { currentKey,dataPrefix } = this.state;
        let formData = dataSource.map(item => {
            return {...item,key: currentKey++};
        });
        this.setState({
            formData,
            currentKey,
            enterType: otherData.enterType
        }, () => {
            dataSource.forEach((item, index) => {
                this.formRef.current.setFieldsValue({
                    [dataPrefix]:{
                        [index]: {
                            // id: item.key,
                            key: index,
                            // serial: item.serial || '',
                            prodNo: item.prodNo || '',
                            prodName: item.prodName || '',
                            prodCustomNo: item.prodCustomNo || '',
                            descItem: item.descItem || '',
                            unit: item.unit || '',
                            recUnit: item.recUnit || '',
                            unitConverterText: item.unitConverterText || '',
                            quantity: item.quantity || 0,
                            recQuantity: item.recQuantity || 0,
                            displayCode: item.displayCode,
                            expirationFlag: !!item.expirationFlag,
                            expirationDay: item.expirationDay || 0,
                            remarks: item.remarks
                        }
                    }
                });
            });
            this.formRef.current.setFieldsValue({
                enterType: otherData.enterType,
                projectName: otherData.projectName,
                warehouseName: '',
                totalQuantity: 0,
                fkProduceNo: otherData.billNo,
                enterDate: moment().format('YYYY-MM-DD')
            });

            if(otherData.enterType === 5){
                this.formRef.current.setFieldsValue({
                    otherEnterWarehouseName: otherData.departmentName || '',
                    otherEnterWarehouseContacterName: otherData.employeeName || '',
                })
            }

            if(otherData.enterType === 6){
                this.formRef.current.setFieldsValue({
                    supplierCode: otherData.supplierCode || '',
                    supplierName: otherData.supplierName || '',
                    supplierContacterName: otherData.supplierContacterName || '',
                    supplierMobile: otherData.supplierMobile || ''
                })
            }

            this.calcTotalAmount(this.formRef.current.getFieldValue(dataPrefix));
        });

        this.props.asyncFetchPreData(data=>{
            if(data.retCode === '0'){
                //设置仓库的默认值
                const warehouses = data.warehouses;
                let initWareHouses;
                if(warehouses){
                    for(let item of warehouses){
                        if(item['isCommon']===1){
                            initWareHouses = item.name;
                            break;
                        }
                    }
                }

                if(data.tags){
                    this.formRef.current.setFieldsValue({
                        warehouseName:initWareHouses
                    });
                }
            }
        });
    };

    calcTotalAmount = (goodsObj) => {
        let { currentKey } = this.state;
        if(!goodsObj || currentKey === 0) return 0;

        let totalAmount = 0;
        for(let item in goodsObj){
            let _quantity = Number(goodsObj[item].quantity);
            totalAmount += _quantity === +_quantity ? _quantity : 0;
        }

        this.formRef.current.setFieldsValue({totalQuantity: totalAmount});
    }


    onDropdownVisibleChange = (open) => {
        if (open) {
            if (this.props.billListInfo.getIn(['data', 'warehouseVipInfo', 'expired'])) {
                Modal.confirm({
                    title: intl.get("components.batchEditPop.wareEnterBatchEdit.title2"),
                    content: intl.get("components.batchEditPop.wareEnterBatchEdit.content"),
                    okText: intl.get("components.batchEditPop.wareEnterBatchEdit.ok"),
                    onOk() {
                        window.open('https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true');
                    }
                });
                return;
            }
        }
        this.setState({
            open
        })
    };

    onFinish = async (values) => {
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('inbound', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    /** 处理表单提交数据*/
    dealSubmitFormInfo = (values) => {
        // this.dealCustomField(values); //处理自定义字段
        this.dealProdList(values);  // 处理物品列表
        // this.dealOtherInfo(values);  // 处理其他信息
    };
    /** 处理自定义字段 */
    dealCustomField = (values)=>{
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
                        customInfoType: 'PurchaseCustomPropInfo'
                    });
                }
            });
        }
        values.dataTagList = tempArr;
        values.dataTagList.forEach((item)=>{
            this.state.tags.some((tag)=>{
                if(tag.mappingName === item.mappingName){
                    item.id = tag.id;
                }
            })
        });
    };
    /** 处理物品列表*/
    dealProdList = (values) => {
        let prodOrder = values.prodList;
        let newProdAry = [];
        values.prod = values.prodList;
        if(prodOrder){
            for(let i=0;i<prodOrder.length;i++){
                let key = prodOrder[i].key;

                newProdAry.push(values.prod[key])
            }
        }
        let filterData = newProdAry || values.prod;

        values.prodList = filterData.filter(item => {
            if(item && item.serialNumber) {
                item.serialNumberList = item.serialNumber.split(',');
            }
            if(item){
                item.propertyValues = {
                    property_value1: item.itemPropertyValue1,
                    property_value2: item.itemPropertyValue2,
                    property_value3: item.itemPropertyValue3,
                    property_value4: item.itemPropertyValue4,
                    property_value5: item.itemPropertyValue5
                };
                if(!item.unit){ // 新建的物品
                    item.unit = item.recUnit;
                }
            }
            return item && Object.entries(item).some(v => {
                return (v[0] === 'prodName' && v[1] && v[1] !== ''); //物品名称必须要有值，否则这行物品数据会被过滤掉
            });
            return item;
        });
    };
    /** 处理其他信息*/
    dealOtherInfo = (values) => {
        let {currentInBoundType, fkPurchaseOrderBillNo} = this.state;
        if(this.props.match.params.copyId) values.billNo = '';  // 复制状态将id置为0
        values.fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
        values.fkPurchaseOrderBillNo = fkPurchaseOrderBillNo;
        values.discountAmount = values.discountAmount || 0;
        if(currentInBoundType===0){
            if(values.supplier){
                values.supplierCode = values.supplier.key;
                values.supplierName = values.supplier.label;
            }
        } else if(currentInBoundType===3){
            if(values.customer){
                values.customerCode = values.customer.key;
                values.customerName = values.customer.label;
            }
        }
    };

    /**  后端校验工作，如符合条件则提交表单 */
    /**  后端校验工作，如符合条件则提交表单 */
    backendValidateAndSubmit = async (module, values) => {
        /** 校验库存上限*/
        await this.validateWarehouseArriveUpperLimit(module, values);
        /**  校验仓库的Vip是否到期 */
        await this.validateWarehouseVip(module, values);
        /**  审批是否开启*/
        if(await this.backApproveFlag(module)){  // 审批开启
            /** 校验审批操作,如果符合条件，执行提交操作，审批为所有操作最后一步*/
            await this.validateApproveStatus(module, values);
        } else {
            /** 审批未开启 执行保质期相关校验 */
            await this.validateExpirationDate(module, values);
            await new Promise( (resolve, reject) => {
                this.setState({submitData: values}, () => {
                    this.cancelApproveOperate();
                    reject();
                });
            })
        }
    };
    /** 校验库存上限*/
    validateWarehouseArriveUpperLimit = (module, values) => {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let {billNo, prodList, warehouseName} = values;
            let initWareParams = dealCheckWareUpperLimitData(billNo, prodList, warehouseName, module);
            _this.props.asyncCheckWareArriveUpperLimit(initWareParams, (res) => {  // 校验是否达到上限
                // data 为 0代表正常操作  1 允许超卖  2 不允许超卖
                // 1 表示允许超卖， 点击确定继续执行表单操作
                if(res===1) {
                    checkWareArriveUpperLimit(res, module, ()=> resolve(), ()=> reject());
                } else{
                    resolve();
                }
            });
        })
    };
    /**  校验仓库的Vip是否到期 */
    validateWarehouseVip = (module, values) => {
        const { warehouseList } = this.props;
        const warehouses = warehouseList && warehouseList.getIn(['data','list']);
        let commonWarehouse = '';
        warehouses.map((item)=>{
            if(item.get('isCommon') === 1){
                commonWarehouse = item.get('name');
            }
        })
        //处理仓库是否为常用仓库
        let _this = this;
        return new Promise(function (resolve, reject) {
            if(commonWarehouse === values.warehouseName){
                resolve()
            }else{
                //判断增值包vip是否到期
                _this.props.vipTipPop({source:"warehouse",expireCallback:()=>{
                        reject()
                    },onTryOrOpenCallback:()=>{
                        resolve()
                    }})
            }
        });
    };
    /** 返回审批状态 */
    backApproveFlag = (module) => {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.props.asyncGetApproveStatus({types: BACKEND_TYPES[module]}, (res) => {
                if(res.data.retCode === "0") {
                    resolve(res.data.data==="1")
                } else {
                    reject();
                }
            });
        });
    };
    /** 校验审批操作*/
    validateApproveStatus = (module, values) => {
        let {match} = this.props;
        let {approveModuleFlag, approveStatus} = this.state;
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.setState({submitData: values},() => {
                _this.props.submitApproveProcess(() => {
                    _this.cancelApproveOperate();  // 取消操作
                    reject();
                }, () => {
                    // 非复制状态， 且当前单据的审批状态为反驳状态 2，则直接提交
                    if(!match.params.copyId && approveModuleFlag===1 && approveStatus===2) {
                        _this.cancelApproveOperate(true);
                    } else {
                        _this.openModal('selectApprove'); // 否则进入审批流的过程，并提交表单
                    }
                    reject();
                });
            });
        });
    };
    /** 校验批次保质期 */
    validateExpirationDate = (module, values) => {
        //判断否是保质期物品
        let prodList = values.prodList;
        let flag = false;

        for(let i=0;i<prodList.length;i++){
            if(prodList[i].expirationFlag){
                flag = true;
                break
            }
        }
        let _this = this;
        return new Promise(function (resolve, reject) {
            if(!flag){
                resolve()
            }else{
                //判断保质期vip是否到期
                _this.props.vipTipPop({source:"batchShelfLeft",expireCallback:()=>{
                        reject()
                    },onTryOrOpenCallback:()=>{
                        resolve()
                    }})

            }
        })
    };

    asyncSubmit = () => {
        let values = this.state.submitData;
        this.props.asyncAddSale(values.billNo, values, (res) => {  // 校验是否到达上限后在提交表单
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success(intl.get("inbound.add.index.operateSuccessMessage"));
                let url = `/inventory/inbound/show/${displayId}`;
                this.props.history.push(url);
            } else if (res.data.retCode === '2019'){
                Modal.info({
                    icon: <ExclamationCircleOutlined/>,
                    title: intl.get("inbound.add.index.warningTip"),
                    content: (
                        <div>
                            <p>{intl.get("inbound.add.index.vipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("inbound.add.index.treatyText")}</a>
                        </div>
                    )
                });
                return false;
            } else {
                if(res.data && res.data.retCode === undefined && !res.data.status){
                    this.setState({showTip:true})
                }else{
                    Modal.error({
                        title: intl.get("inbound.add.index.warningTip"),
                        content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||res.data.retMsg
                    });
                }
            }
        })
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
            this.fillGoods(newItems, 'batchShelfLeft');
        }
        this.setState({BatchShelfVisible: false});
    };
    dealCurrentItem = (list) => {
        let {setFieldsValue} = this.formRef.current;
        let {idx, dataPrefix} = this.state;
        let {batchNo, productionDate, expirationDate} = list;
        setFieldsValue({[dataPrefix]: {[idx]: {batchnoFlag: true}}});
        setFieldsValue({[dataPrefix]: {[idx]: {batchNo}}});
        setFieldsValue({[dataPrefix]: {[idx]: {productionDate: moment(productionDate)}}});
        setFieldsValue({[dataPrefix]: {[idx]: {expirationDate: moment(expirationDate)}}});
    };
    dealNewItem = (lists) => {
        let {getFieldValue} = this.formRef.current;
        let {currentKey, dataPrefix} = this.state;
        let currentGoodItem = getFieldValue([dataPrefix, currentKey]);
        return lists.map(item => {
            let {key, ...newItem} = item;
            return {...currentGoodItem, ...newItem, productCode: currentGoodItem.prodNo,  batchnoFlag: true}
        });
    };
    handleChange = (e,key) => {
        let {getFieldValue, setFieldsValue} = this.formRef.current;
        let { dataPrefix } = this.state;
        let productCode = getFieldValue([dataPrefix, key, 'prodNo']);
        let batchno = e.target.value;
        if(productCode && batchno){
            this.props.asyncFetchBatchShelfList({productCode, batchno}, (res)=> {
                if(res.data && res.data.retCode==="0"){
                    let dataSource = res.data.data;
                    if(dataSource && dataSource.length > 0){
                        let {productionDate, expirationDate} = dataSource[0];
                        setFieldsValue({[dataPrefix]: {[key]: {['batchnoFlag']: true}}});
                        setFieldsValue({[dataPrefix]: {[key]: {['productionDate']: moment(productionDate)}}});
                        setFieldsValue({[dataPrefix]: {[key]: {['expirationDate']: moment(expirationDate)}}});
                    } else {
                        setFieldsValue({[dataPrefix]: {[key]: {['batchnoFlag']: ''}}});
                        setFieldsValue({[dataPrefix]: {[key]: {['productionDate']: ''}}});
                        setFieldsValue({[dataPrefix]: {[key]: {['expirationDate']: ''}}});
                    }
                    this.setState({flag: false});
                }
            })
        }
    }
    handleOpen = (record) => {
        let {dataPrefix} = this.state;
        let {getFieldValue} = this.formRef.current;
        let productCode = getFieldValue([dataPrefix, record.key, 'prodNo']);
        let warehouseName = getFieldValue('warehouseName');
        if(!getFieldValue([dataPrefix, record.key, 'expirationFlag'])){
            return false;
        }
        this.setState({BatchShelfVisible: true, productCode, warehouseName, idx:record.key});
    }


    //部门选择
    handleDeptChange = (value) => {
        const {setFieldsValue} = this.formRef.current;
        this.setState({depId: value});
        //选择部门后人员下拉选项变动
        setFieldsValue({ employeeName: null });
    };


    render() {
        const {dataPrefix, formData, productCode, warehouseName, enterType} = this.state;
        const { showBatchNoFlag } = this.props;
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        let priceDecimalNum =  Number(getCookie("priceDecimalNum")||3);

        const formItemLayout = {
            labelCol: {
                xs: {span: 16},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 8},
                sm: {span: 16},
            }
        };

        let tableColumns = [
            {
                width: 50,
                title: "序号",
                key: 'serial',
                dataIndex: 'serial',
                align: 'center',
                render: (text, record, index) => (
                    <React.Fragment>
                        <span>{index+1}</span>
                        <div style={{display:"none"}}>
                            <Form.Item
                                name={[dataPrefix, record.key, 'key']}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={[dataPrefix, record.key, 'id']}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={[dataPrefix, record.key, 'prodNo']}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={[dataPrefix, record.key, 'expirationFlag']} // 当前单据的批次号是非开启
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={[dataPrefix, record.key, 'batchnoFlag']} // 批次号是否存在
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={[dataPrefix, record.key, 'expirationDay']} // 批次号是否存在
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </React.Fragment>
                )
            },
            {
                width: 120,
                title: "物品编号",
                key: 'prodCustomNo',
                dataIndex: 'prodCustomNo',
                align: 'left',
                render: (text, record, index) => {
                    return (
                        <Form.Item
                            name={[dataPrefix, record.key, 'prodCustomNo']}
                        >
                            <span className="txt-clip" title={text}>{text}</span>
                            <Input type="hidden" value={text}/>
                        </Form.Item>
                    )
                }
            },
            {
                width: 200,
                title: "物品名称",
                key: 'prodName',
                dataIndex: 'prodName',
                align: 'left',
                render: (text, record, index) => {
                    return (
                        <Form.Item
                            name={[dataPrefix, record.key, 'prodName']}
                        >
                            <span className="txt-clip" title={text}>{text}</span>
                            <Input type="hidden" value={text}/>
                        </Form.Item>
                    )
                }
            },
            {
                width: 150,
                title: "规格型号",
                key: 'descItem',
                dataIndex: 'descItem',
                align: 'left',
                render: (text, record, index) => {
                    return (
                        <Form.Item
                            name={[dataPrefix, record.key, 'descItem']}
                        >
                            <span className="txt-clip" title={text}>{text}</span>
                            <Input type="hidden" value={text}/>
                        </Form.Item>
                    )
                }
            },
            {
                width: 80,
                title: "单位",
                key: 'unit',
                dataIndex: 'unit',
                align: 'left',
                render: (text, record, index) => {
                    return (
                        <Form.Item
                            name={[dataPrefix, record.key, 'unit']}
                        >
                            <span className="txt-clip" title={text}>{text}</span>
                            <Input type="hidden" value={text}/>
                        </Form.Item>
                    )
                }
            },
            {
                width: 200,
                title: intl.get("components.goods.goodsTable.serialNumber"),
                key: 'serialNumber',
                dataIndex: 'serialNumber',
                columnName: 'serialNumber',
                align: 'left',
                render: (text, record, index) =>
                    <>
                        <Form.Item
                            name={[dataPrefix, record.key, 'serialNumber']}
                        >
                            <SerialNumQuerySearch
                                {...this.props}
                                onChange={(serialNumber, recQuantity) => {
                                    this.formRef.current.setFieldsValue({
                                        [dataPrefix]: {
                                            [record.key]: {
                                                serialNumber,
                                                recQuantity,
                                                quantity: recQuantity
                                            }
                                        }
                                    });
                                    this.calcTotalAmount(this.formRef.current.getFieldValue(dataPrefix));
                                }}
                            />
                        </Form.Item>
                    </>
            },
        ]

        if(!!showBatchNoFlag){
            tableColumns.push(
                {
                    width: 200,
                    title: "批次号",
                    key: 'batchNo',
                    originalKey: 'batchNo',
                    columnName: 'batchNo',
                    maxLength: 50,
                    align: 'left',
                    render: (text, record,  index, dataSource)=> {
                        let expirationFlag = !!record && record.expirationFlag;

                        return (
                            <Form.Item
                                validateTrigger="onBlur"
                                name={[dataPrefix, record.key, 'batchNo']}
                                rules={[
                                    {
                                        validator: (rules, value) =>  {
                                            if(!expirationFlag) {
                                                return Promise.resolve();
                                            } else if(!value || value === '') {
                                                return Promise.reject(`此项为必填项!`)
                                            } else {
                                                return Promise.resolve();
                                            }
                                        }
                                    }
                                ]}
                            >

                                <Input
                                    disabled={!expirationFlag}
                                    onBlur={(e)=>this.handleChange(e, record.key)}
                                    placeholder={''}
                                    style={{width:'100%'}}
                                    suffix={(
                                        <a href="#!"
                                           onClick={() => this.handleOpen(record)}>
                                            <EllipsisOutlined style={{fontSize: "16px"}}/>
                                        </a>
                                    )}
                                    className={cx("suggest")}
                                />
                            </Form.Item>
                        )
                    }
                },
                {
                    width: 200,
                    title: "生产日期",
                    key: 'productionDate',
                    dataIndex: 'productionDate',
                    align: 'left',
                    render: (text, record, index) => {
                        let expirationFlag = !!record && record.expirationFlag;
                        // let batchnoFlag = !!record && record.batchnoFlag;
                        let batchnoFlag = !!this.formRef.current && this.formRef.current.getFieldValue([dataPrefix, record.key, 'batchnoFlag']);

                        return (
                            <Form.Item
                                name={[dataPrefix, index, 'productionDate']}
                                rules={[
                                    {
                                        validator: (rules, val) =>  {
                                            if(!expirationFlag) {
                                                return Promise.resolve();
                                            } else if (!val || !val.format() || val.format().trim() === '') {
                                                return Promise.reject(`此项为必填项!`)
                                            } else {
                                                return Promise.resolve();
                                            }
                                        }
                                    }
                                ]}
                            >
                                <DatePicker
                                    disabled={!(expirationFlag && !batchnoFlag)}
                                    // disabled={!expirationFlag}
                                    onChange={(val, dateString) => {
                                        if(!dateString) return;
                                        record.productionDate = dateString;
                                        let expirationDay = !!record && record.expirationDay;
                                        this.formRef.current.setFieldsValue({
                                            [dataPrefix]: {
                                                [record.key]: {
                                                    ['expirationDate']: moment(val).add(expirationDay-1, 'days')
                                                }
                                            }
                                        })
                                    }}
                                />
                            </Form.Item>
                        )
                    }
                },
                {
                    width: 200,
                    title: "到期日期",
                    key: 'expirationDate',
                    dataIndex: 'expirationDate',
                    align: 'left',
                    render: (text, record, index) => {
                        let expirationFlag = !!record && record.expirationFlag;
                        // let batchnoFlag = !!record && record.batchnoFlag;
                        // let _expirationFlag = !!this.formRef.current && this.formRef.current.getFieldValue([dataPrefix, record.key, 'expirationFlag']);
                        let batchnoFlag = !!this.formRef.current && this.formRef.current.getFieldValue([dataPrefix, record.key, 'batchnoFlag']);
                        let productionDate =!!this.formRef.current && this.formRef.current.getFieldValue([dataPrefix, record.key, 'productionDate']);
                        let _this = this;

                        return (
                            <Form.Item
                                name={[dataPrefix, record.key, 'expirationDate']}
                                rules={[
                                    {
                                        validator: (rules, val) =>  {
                                            if(!expirationFlag) {
                                                return Promise.resolve();
                                            } else if (!val || !val.format() || val.format().trim() === '') {
                                                return Promise.reject(`此项为必填项!`)
                                            } else if(val.format() && !!this.formRef.current && this.formRef.current.getFieldValue([dataPrefix, record.key, 'productionDate']) && this.formRef.current.getFieldValue([dataPrefix, record.key, 'productionDate']).isAfter(val.format(), 'date')){
                                                return Promise.reject(`到期日期不能早于生产日期!`)
                                            } else {
                                                return Promise.resolve();
                                            }
                                        }
                                    },
                                    // {
                                    //     rule: (val, record) =>  {
                                    //         let productionDate = !!this.formRef.current && this.formRef.current.getFieldValue([dataPrefix, record.key, 'productionDate']);
                                    //         return val && productionDate && productionDate.isAfter(val, 'date');
                                    //     },
                                    //     message: '到期日期不能早于生产日期'
                                    // }
                                ]}
                            >
                                <DatePicker
                                    onChange={(date, dateString) => {
                                        if(!!dateString) return;
                                        record.expirationDate = dateString
                                    }}
                                    disabled={!(expirationFlag && !batchnoFlag)}
                                    // disabled={!expirationFlag}
                                />
                            </Form.Item>
                        )
                    }
                }
            )
        }

        tableColumns.push(
            {
                width: 120,
                title: () => <><span className="required">*</span>入库数量</>,
                key: 'quantity',
                dataIndex: 'quantity',
                align: 'left',
                render: (text, record, index) => {
                    return (
                        <Form.Item style={{margin: 0}}
                                   name={[dataPrefix, record.key, 'quantity']}
                                   rules={[
                                       {
                                           validator: (rules, value, callback) => {
                                               let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+quantityDecimalNum+'})?$/');
                                               if (value && !reg.test(value)) {
                                                   return Promise.reject(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                               } else if(value === '0' || value === 0) {
                                                   return Promise.reject(`数量不能为0！`)
                                               } else if(!value || String(value).trim() === ''){
                                                   return Promise.reject(`此项为必填项!`);
                                               } else {
                                                   return Promise.resolve();
                                               }
                                           }
                                       }
                                   ]}
                        >
                            <Input style={{textAlign: 'left'}}
                                   onBlur={(e) => {
                                       record.unitPrice = e.target.value;
                                       this.calcTotalAmount(this.formRef.current.getFieldValue(dataPrefix));
                                   }}
                            />
                        </Form.Item>
                    );
                }
            },
            {
                width: 120,
                title: '含税单价',
                key: 'unitPrice',
                dataIndex: 'unitPrice',
                align: 'left',
                render: (text, record, index) => {
                    return (
                        <Form.Item style={{margin: 0}}
                                   name={[dataPrefix, record.key, 'unitPrice']}
                                   rules={[
                                       {
                                           validator: (rules, value, callback) => {
                                               let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+priceDecimalNum+'})?$/');
                                               if (value && !reg.test(value)) {
                                                   return Promise.reject(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                               }  else {
                                                   return Promise.resolve();
                                               }
                                           }
                                       }
                                   ]}
                        >
                            <Input style={{textAlign: 'left'}}
                                   onBlur={(e) => record.unitPrice = e.target.value}
                            />
                        </Form.Item>
                    );
                }
            },
            {
                width: 200,
                title: "备注",
                key: 'remarks',
                maxLength: 2000,
                dataIndex: 'remarks',
                align: 'left',
                render: (text, record, index) => {
                    return (
                        <Form.Item
                            name={[dataPrefix, record.key, 'remarks']}
                        >
                            <Input  value={text}/>
                        </Form.Item>
                    )
                }
            }
        );


        return (
            <React.Fragment>
                <Modal
                    {...this.props}
                    title={'成品入库'}
                    width={1366}
                    destroyOnClose={true}
                    forceRender={true}
                    footer={null}
                    onCancel={this.props.onCancel}
                >
                    <div className={cx('content-height')}>
                        <Spin
                            spinning={this.state.isLoading}
                        >
                            <Form
                                ref={this.formRef}
                                onFinish={this.onFinish}
                            >
                                <div>
                                    <Row>
                                        <Col span={8}>
                                            {
                                                enterType === 5 && (
                                                    <Form.Item
                                                        name={'otherEnterWarehouseName'}
                                                        {...formItemLayout}
                                                        label={'生产部门'}
                                                    >
                                                        <SelectDept
                                                            handleDeptChange={this.handleDeptChange}
                                                            showEmployeeVisible={true}
                                                            showEdit={true}
                                                        />
                                                    </Form.Item>
                                                )
                                            }
                                        </Col>
                                        <Col span={8}>
                                            {
                                                enterType === 5 && (
                                                    <Form.Item
                                                        name={'otherEnterWarehouseContacterName'}
                                                        {...formItemLayout}
                                                        label={'生产人'}
                                                    >
                                                        <SelectEmployee
                                                            depId={this.state.depId}
                                                            showVisible={true}
                                                            showEdit={true}
                                                        />
                                                    </Form.Item>
                                                )
                                            }
                                        </Col>

                                        <Col span={8}>
                                            <Form.Item
                                                name={'warehouseName'}
                                                label={intl.get("components.batchEditPop.wareEnterBatchEdit.warehouseName")}
                                                style={{float: 'right', marginRight: '15px'}}
                                                {...formItemLayout}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: intl.get("components.batchEditPop.wareEnterBatchEdit.rule2")
                                                    }
                                                ]}
                                            >
                                                {

                                                    <SelectDeliveryAddress isWareHouses={true}
                                                                           open={this.state.open}
                                                                           onDropdownVisibleChange={this.onDropdownVisibleChange}
                                                                           style={{minWidth: '120px', width: '150px'}}/>

                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <div className={cx('clear')}>
                                        <Form.Item
                                            hidden={true}
                                            name={'enterType'}
                                        >
                                            <Input />
                                        </Form.Item>
                                        {
                                            enterType === 6 && (
                                                <>
                                                    <Form.Item
                                                        name={'supplierCode'}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={'supplierName'}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={'supplierContacterName'}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={'supplierMobile'}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </>
                                            )
                                        }
                                        <Form.Item
                                            name={'projectName'}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={'fkProduceNo'} // 上游单据
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={'enterDate'} // 入库日期
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                </div>
                                <div style={{overflowX:'auto'}}>
                                    <Table
                                        bordered
                                        dataSource={formData}
                                        pagination={false}
                                        columns={tableColumns}
                                    />
                                </div>
                                <div style={{marginTop:'10px',textAlign:'right', height:'30px',lineHeight:'30px'}}>
                                    <span>
                                        入库总数:
                                            <React.Fragment>
                                                <Form.Item name="totalQuantity"
                                                       {...formItemLayout}
                                                       // initialValue={formatCurrency(0, 3)}
                                                       className={'form-x'}
                                                       style={{display: 'inline-block'}}
                                                >
                                                    <Input style={{width: "100px",background:'#fff', border:'none', color:'#ff6060', fontWeight:'bold'}} disabled />
                                                </Form.Item>
                                            </React.Fragment>
                                    </span>
                                </div>

                                <Divider style={{margin:'5px 0 15px'}} />

                                <Form.Item>
                                    <div className={'float-right'}>
                                        <Button type="primary" htmlType="submit">
                                            确定
                                        </Button>
                                        <Button onClick={this.props.onCancel} style={{marginLeft: 10}}>
                                            取消
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </Spin>
                    </div>
                </Modal>
                <LimitOnlineTip onClose={()=>this.closeModals()} show={this.state.limitOnlineTip}/>
                <SelectBatchShelf
                    visible={this.state.BatchShelfVisible}
                    onOk={(selectedRows) => this.confirmOperate(selectedRows)}
                    onCancel={()=>{this.setState({BatchShelfVisible: false})}}
                    productCode={productCode}
                    warehouseName={warehouseName}
                />
                <SelectApproveItem
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.inbound}
                />
            </React.Fragment>
        );
    }
}
