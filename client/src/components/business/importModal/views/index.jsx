import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, Button, message, Input
} from 'antd';

import Icon from 'components/widgets/icon';
import Upload from 'components/widgets/upload';
import {AddButton} from "components/business/authMenu";
import LimitOnlineTip from 'components/business/limitOnlineTip';


import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import IntlTranslation from 'utils/IntlTranslation';
import {serializeUrl} from "../../../../utils/urlParam";
import {
    LoadingOutlined,
    UploadOutlined
} from '@ant-design/icons';
import {Radio} from "antd/lib/index";
const RadioGroup = Radio.Group;
const cx = classNames.bind(styles);

function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}

const map = {
    goods:{
        name:"components.importModal.index.goods",
        tempUrl:"/prods/excel/template",
        uploadUrl:"/prods/excel",
        compareFileUrl:"/prods/excel/error",
    },
    bom:{
        name:"components.importModal.index.multiBom",
        tempUrl:"/production-bom/excel/template",
        uploadUrl:"/production-bom/excel",
        compareFileUrl:"/production-bom/excel/error",
    },
    mallGoods:{
        name:"components.importModal.index.goods",
        tempUrl:"/prods/excel/template",
        uploadUrl:"/mall/prods/excel4mall",
        compareFileUrl:"/prods/excel/error",
    },
    customer:{
        name:"components.importModal.index.customer",
        tempUrl:"/customers/excel/template",
        uploadUrl:"/customers/excel",
        compareFileUrl:"/customers/excel/error",
    },
    supplier:{
        name:"components.importModal.index.supplier",
        tempUrl:"/suppliers/excel/template",
        uploadUrl:"/suppliers/excel",
        compareFileUrl:"/suppliers/excel/error",
    },
    purchase:{
        name:"components.importModal.index.purchase",
        modalTitle: <IntlTranslation intlKey="components.importModal.index.importPurchaseOrder"/>,
        templateName:<IntlTranslation intlKey="components.importModal.index.purchaseOrder"/>,
        tempUrl:"/purchases/excel/template",
        uploadUrl:"/purchases/excel",
        compareFileUrl:"/purchases/excel/error",
    },
    inquiry:{
        name:"components.importModal.index.inquiry",
        tempUrl:""
    },
    sale:{
        name:"components.importModal.index.sale",
        modalTitle: <IntlTranslation intlKey="components.importModal.index.importSaleOrder"/>,
        templateName:<IntlTranslation intlKey="components.importModal.index.saleOrder"/>,
        tempUrl:"/saleorders/excel/template",
        uploadUrl:"/saleorders/excel",
        compareFileUrl:"/saleorders/excel/error",
    },
    requisition:{
        name:"components.importModal.index.requisition",
        modalTitle: "导入请购单",
        templateName: "请购单",
        tempUrl:"/requisition/excel/template",
        uploadUrl:"/requisition/excel",
        compareFileUrl:"/requisition/excel/error",
    },
    quotation:{
        name:"components.importModal.index.quotation",
        modalTitle: "导入报价单",
        templateName: "报价单",
        tempUrl:"/quotationorders/excel/template",
        uploadUrl:"/quotationorders/excel",
        compareFileUrl:"/quotationorders/excel/error",
    },
    inbound: [
        {
            name:"components.importModal.index.inbound",
            modalTitle: <IntlTranslation intlKey="components.importModal.index.importInboundOrder"/>,
            templateName:<IntlTranslation intlKey="components.importModal.index.purchaseInboundOrder"/>,
            tempUrl:"/enterwares/excel/purchase/template",
            uploadUrl:"/enterwares/excel/purchase",
            compareFileUrl:"/enterwares/excel/purchase/error",
        },{
            name:"components.importModal.index.inbound",
            modalTitle: <IntlTranslation intlKey="components.importModal.index.importInboundOrder"/>,
            templateName:<IntlTranslation intlKey="components.importModal.index.produceInboundOrder"/>,
            tempUrl:"/enterwares/excel/template",
            uploadUrl:"/enterwares/excel",
            compareFileUrl:"/enterwares/excel/error",
        },{
            name:"components.importModal.index.inbound",
            modalTitle: <IntlTranslation intlKey="components.importModal.index.importInboundOrder"/>,
            templateName:<IntlTranslation intlKey="components.importModal.index.otherInbound"/>,
            tempUrl:"/enterwares/excel/other/template ",
            uploadUrl:"/enterwares/excel/other",
            compareFileUrl:"/enterwares/excel/other/error",
        }
    ],
    outbound:[
        {
            name:"components.importModal.index.outbound",
            modalTitle: <IntlTranslation intlKey="components.importModal.index.importOutboundOrder"/>,
            templateName:<IntlTranslation intlKey="components.importModal.index.saleOutbound"/>,
            tempUrl:"/outwares/excel/sale/template",
            uploadUrl:"/outwares/excel/sale",
            compareFileUrl:"/outwares/excel/sale/error",
        },
        {
            name:"components.importModal.index.outbound",
            modalTitle: <IntlTranslation intlKey="components.importModal.index.importOutboundOrder"/>,
            templateName:<IntlTranslation intlKey="components.importModal.index.innerOutbound"/>,
            tempUrl:"/outwares/excel/template",
            uploadUrl:"/outwares/excel",
            compareFileUrl:"/outwares/excel/error",
        }
    ]
};

class ImportModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            importModalVisible:false,
            loading:false,
            customerSearchBtnVisible:false,
            params:{},
            showTip: false,
            activeIndex: 0,
            specificateName1: "",
            specificateName2: "",
            specificateName3: "",
        }
    }
    openModal = ()=>{
        this.setState({
            importModalVisible:true
        });
    };
    closeModal = ()=>{
        this.setState({
            importModalVisible:false
        });
    };

    handleChange = (info) => {
        let _this = this;
        if (info.file.status === 'done') {
            let response = info.file.response;
            if(response.retCode==0){
                if(info.file.response.showFileName){
                    /**
                     *  module 与权限有关
                     *  type  与类型有关， 有权限 只传递module， 无权限只传递type
                     */
                    const {module, type} = _this.props.importModule;
                    let importType = module || type;
                    let data = isArray(map[importType]) ? map[importType][this.state.activeIndex] : map[importType];
                    const downloadUrl = `/api/file/download?url=${data.compareFileUrl}&filename=${response.showFileName}&downloadFileName=${response.realFileName}`;
                    Modal.confirm({
                        title: intl.get("components.importModal.index.fileImportFailure"),
                        content: <div>{intl.get("components.importModal.index.failureMsg")}</div>,
                        okText:intl.get("components.importModal.index.download"),
                        cancelText:intl.get("components.importModal.index.cancel"),
                        onOk(){
                            location.href = downloadUrl;
                        },
                        onCancel(){}
                    });
                }else{
                    Modal.success({
                        title: intl.get("components.importModal.index.fileImportSuccess"),
                        content: <div>
                            <p>{intl.get("components.importModal.index.totalAmount")}：{response.totalNum}</p>
                            <p>{intl.get("components.importModal.index.successAmount")}：{response.successNum}</p>
                            <p>{intl.get("components.importModal.index.failureAmount")}：{response.failNum}</p>
                        </div>
                    });
                    this.closeModal();
                    this.props.refresh();
                }

            } else if(response.retCode==2001 && response.retMsg === 'limitException'){
                this.setState({showTip:true});
            } else{
                Modal.error({
                    title: intl.get("components.importModal.index.fileImportFailure"),
                    content:  <p>{info.file.response.retMsg}</p>
                });
            }

        }
        else if (info.file.status === 'error') {
            message.error(intl.get("components.importModal.index.fileImportFailure")+"："+info.file.retMsg);
            this.closeModal();
            this.props.refresh();
        }
    };

    beforeUpload=(file)=> {
        const isExcel = file.type === 'application/vnd.ms-excel';
        console.log('file type:',file.type);
        if (!isExcel) {
            message.error(intl.get("components.importModal.index.typeError"));
        }
        return isExcel ;
    };

    closeModals = () =>{
        this.setState({showTip:false})
    };

    multiGoodsChange = (e,type) =>{
        this.setState({
            ["specificateName"+type]: e.target.value
        })
    }

    downMultiGoods = ()=>{
       let {specificateName1,specificateName2,specificateName3} = this.state;
       if(specificateName1 || specificateName2 || specificateName3){
           let url = '/excel/multispecific/template';
           let params = JSON.stringify({
               specificateName1:specificateName1,
               specificateName2:specificateName2,
               specificateName3:specificateName3
           })
           let lastUrl = `${BASE_URL}/file/multi/download?url=${url}&params=${params}`;
           let creatA = document.createElement('a');
           creatA.href = lastUrl;
           creatA.click();
           creatA.remove();
       }else{
           message.error('至少填写一个规格值才可以下载模板！')
       }
    }

    onChangeBoundData = (val) => {
        this.setState({activeIndex: val})
    };

    render(){

        let {width, importModule,multiGoods} = this.props;
        let {type,text,params, module, customStep2Text} = importModule;
        text = text?text:intl.get("components.importModal.index.import");

        /**
         *  module 与权限有关
         *  type  与类型有关， 有权限 只传递module， 无权限只传递type
         */
        let importType = module || type;

        width = width?width:800;
        multiGoods?text = '多规格物品':null
        let data = isArray(map[importType]) ? map[importType][this.state.activeIndex] : map[importType];
        let url = serializeUrl(data.uploadUrl, params);

        return(
            <React.Fragment>
                {
                    module ? (
                        <AddButton
                            module={module}
                            ga-data={this.props.gadata}
                            clickHandler={()=>this.openModal()}
                            label={text}/>
                    ) : (
                        <Button onClick={()=>this.openModal()} ga-data={this.props.gadata}>{text}</Button>
                    )
                }


                <Modal
                    title={!multiGoods?(data.modalTitle || intl.get("components.importModal.index.import")+ intl.get(data.name)+ intl.get("components.importModal.index.info")):"导入多规格物品"}
                    width={width}
                    // className={className}
                    visible={this.state.importModalVisible}
                    onCancel={this.closeModal}
                    footer={null}
                    destroyOnClose={true}
                >
                    {
                        multiGoods?(
                            <div>
                                <li className={cx("lst-detail")}>
                                    <span className={cx("lst-order")}>1</span>
                                     <ul className={cx("multi-ul")}>
                                         <li>
                                             规格1：<Input value={this.state.specificateName1} onChange={(value)=>this.multiGoodsChange(value,'1')} placeholder={"请输入规格名称"}/>
                                         </li>
                                         <li>
                                             规格2：<Input value={this.state.specificateName2} onChange={(value)=>this.multiGoodsChange(value,'2')} placeholder={"请输入规格名称"}/>
                                         </li>
                                         <li>
                                             规格3：<Input value={this.state.specificateName3} onChange={(value)=>this.multiGoodsChange(value,'3')} placeholder={"请输入规格名称"}/>
                                         </li>
                                     </ul>
                                </li>
                                <li className={cx("lst-detail")}>
                                    <span className={cx("lst-order")}>2</span>
                                    <span style={{marginLeft: '10px'}}>
                                        {intl.get("components.importModal.index.downloadNew")}
                                        <span onClick={()=>this.downMultiGoods()} style={{marginLeft: '20px', color: '#499fff', cursor: "pointer"}}>多规格物品导入模板</span>
                                    </span>
                                </li>
                                <li className={cx("lst-detail")}>
                                    <span className={cx("lst-order")}>3</span>
                                    <span style={{marginLeft: '10px'}}>
                                        向Excel模板中添加数据
                                        <span style={{marginLeft: '10px', color: 'red'}}>注意：不能改变模板中的栏目及格式！</span>
                                    </span>
                                </li>
                                <li  className={cx("lst-detail")}>
                                    <span className={cx("lst-order")}>4</span>
                                    <span style={{marginLeft: '10px'}}>上传添加好数据的Excel文件</span>
                                    <Upload
                                        action={`${BASE_URL}/file/upload`}
                                        name={"file"}
                                        data={{url:"/prods/excel4multispecific"}}
                                        onChange={this.handleChange}
                                        beforeUpload={this.beforeUpload}
                                    >
                                        <Button>
                                            {
                                                this.state.loading ? <LoadingOutlined />: <UploadOutlined />
                                            }
                                            {intl.get("components.importModal.index.upload")}
                                        </Button>
                                    </Upload>
                                </li>
                            </div>
                        ):(
                            <div>
                                {
                                    isArray(map[type]) && (
                                        <RadioGroup onChange={(e) => this.onChangeBoundData(e.target.value)} value={this.state.activeIndex} style={{margin: '5px 0 15px'}}>
                                            {
                                                map[type].map((item, index) =>
                                                    <Radio key={index} value={index}>{item.templateName}</Radio>
                                                )
                                            }
                                        </RadioGroup>
                                    )
                                }
                                <ul>
                                    <li className={cx("lst-detail")}>
                                        <span className={cx("lst-order")}>1</span>
                                        <span>{intl.get("components.importModal.index.downloadNew")}
                                            <a style={{marginLeft: '20px', color: '#499fff'}} href={`${BASE_URL}/file/download?url=${data.tempUrl}`}>{data.templateName || intl.get(data.name)}{intl.get("components.importModal.index.importTemplate")}</a>
                                </span>
                                    </li>
                                    <li  className={cx("lst-detail")}>
                                        <span className={cx("lst-order")}>2</span>
                                        {
                                            customStep2Text?(
                                                <span>{customStep2Text}</span>
                                            ):(
                                                <span>{intl.get("components.importModal.index.msg1")} {intl.get(data.name)} {intl.get("components.importModal.index.msg2")} </span>
                                            )
                                        }
                                        <br/>
                                        <em className="red" style={{position: "absolute",left: "62px",bottom: "-2px"}}>{intl.get("components.importModal.index.msg3")}</em>
                                    </li>
                                    <li  className={cx("lst-detail")}>
                                        <span className={cx("lst-order")}>3</span>
                                        <span>{intl.get("components.importModal.index.msg4")}
                                            <Upload
                                                action={`${BASE_URL}/file/upload`}
                                                name={"file"}
                                                data={{url:url}}
                                                onChange={this.handleChange}
                                                beforeUpload={this.beforeUpload}
                                            >
                                        <Button>
                                            {
                                                this.state.loading ? <LoadingOutlined />: <UploadOutlined />
                                            }
                                            {intl.get("components.importModal.index.upload")}
                                        </Button>
                                    </Upload>
                                </span>
                                    </li>
                                </ul>
                                <span className={"light-grey"}>{intl.get("components.importModal.index.tip")}</span>
                            </div>
                        )
                    }

                </Modal>
                <LimitOnlineTip onClose={()=>this.closeModals()} show={this.state.showTip}/>
            </React.Fragment>
            
        )
    }
};

export default ImportModal;