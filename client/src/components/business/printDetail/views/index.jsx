import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {Dropdown, Menu,Modal,Table,message,Button} from 'antd';
import Icon from 'components/widgets/icon';
import styles from "../styles/index.scss";
import {convertCurrency} from 'utils/digitalConversion';
import {formatCurrency} from 'utils/format';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import classNames from "classnames/bind";
import {dealHtmlToXLSX} from './XLSX';
import {asyncCustomerTemplatesList,asyncCustomerTemplatesGetData,asyncCustomerTemplatesDirectPrint} from '../../../../pages/customTemplates/index/actions';
import {asyncFetchNewCustomFieldList} from "../../../../pages/auxiliary/newCustomField/actions";
import {asyncFetchVipValueAdded} from "../../../../pages/vipService/actions";
import {pageType, template,inboundDictionaries,outboundDictionaries,purchaseDictionaries,saleDictionaries,produceDictionaries,subcontractDictionaries,requisitionDictionaries,quotationDictionaries,produceWorkDictionaries} from "../../../../pages/customTemplates/add/views/templateDictionaries";
import {bindActionCreators} from "redux";
import {asyncFetchVipService} from "../../../../pages/vipService/actions";
import {connect} from "react-redux";
import moment from "moment/moment";
import intl from 'react-intl-universal';
import HtmlToDocx from 'html-docx';


const cx = classNames.bind(styles);
const outTypeMap = {
    0:'内部领用',
    1:'盘点出库',
    2:'销售出库',
    3:'采购退货',
    4:'其他出库',
    5:'调拨出库',
    6:'委外领料',
    7:'生产领料'
};

const inTypeMap = {
    0:'采购入库',
    1:'其他入库',
    2:'盘点入库',
    3:'销售退货',
    4:'调拨入库',
    5:'生产入库',
    6:'委外成品入库',
    7:'生产退料',
    8:'委外退料'
};

const approveStatusMap = {
    0: "未提交",
    1: "通过",
    2: "驳回",
    3: "审批中"
}

const orderTitleMap = {
    0: '下达',
    1: '上线',
    2: '完成',
    3: '关闭'
}

const customFieldMap = {
    'SaleOrder':{
        table: 'sale_prod',
        other: 'sale'
    },
    'QuotationOrder':{
        other: 'quotation',
        otherLength: 36
    }
}

class PrintDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            templateVisible: false,
            selectedRowKeys: [],
            dataSource:[]
        }
        this.allImgBase64Ary = {};
    }

    //选择模板确定打印
    doPrint = (displayBillNo,templateType,exportType)=>{
        const {href} = this.props;
        if(this.state.selectedRowKeys.length === 0){
            message.error(intl.get("components.printDetail.tip"));
        }else{
            this.props.asyncCustomerTemplatesGetData({recId:this.state.selectedRowKeys[0],billNo:displayBillNo,billType:templateType},(data)=>{
                this.printAtLast(data.data,exportType);
            });
        }
    }

    //处理新版本自定义字段
    dealNewCustomFields = (type,templateType) => {
        let field = customFieldMap[templateType] && customFieldMap[templateType][type];
        return new Promise((resolve,reject)=>{
            let data = [];
            if(field){
                this.props.asyncFetchNewCustomFieldList(field,(list)=>{
                    list.data.forEach((item)=>{
                        if(type === 'table'){
                            let obj = {
                                key: item.mappingName,
                                name: item.propName,
                                displayShow : false
                            }
                            data.push(obj);
                        }else{
                            let obj = {
                                key: item.mappingName,
                                name: item.propName,
                                display: [
                                    templateType
                                ],
                                location: "other",
                                SaleOrder: false
                            }
                            data.push(obj);
                        }

                    });
                    resolve(data);
                });
            }else{
                resolve(data);
            }
        });
    }

    //tabProdList=>页面详情页的表格数据
    //prodFieldList=>模板里的列表数据
    //id=>需要处理table的ID
    //maxRow=>一页最多显示几条数据（如果是生产订单，默认设置为1000，使其一页显示）
    //wordSize=>字体大小
    //dateFormat=>时间格式
    //thFlag=>获取第二行th的id标识
    processTable = (content,tabProdList,prodFieldList,id,maxRow,wordSize,dateFormat,pageSize,thFlag,exportType)=>{
        //剔除table文本重写
        let allPageStr = '';
        let aryInfor = [];
        //数量精度
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        //价格精度
        let priceDecimalNum =  Number(getCookie("priceDecimalNum")||3);
        //获取页面上原生的table并剔除出来单独处理
        let tableStart = content.indexOf('<table id="'+id+'"');
        let tableEnd = content.indexOf('</table>',tableStart);
        aryInfor[1] = content.substring(tableStart,tableEnd+8);
        aryInfor[0] = content.substring(0,tableStart);
        aryInfor[2] = content.substring(tableEnd+8,content.length);

        let tableInfor = aryInfor[1].split('</tr>');

        //取得表格第二列的样式
        let secondTr = tableInfor[1].slice(tableInfor[1].indexOf('<tr'),tableInfor[1].indexOf('>')+1);

        console.log(secondTr,'secondTr');
        console.log(prodFieldList,'prodFieldList');

        //let indexSuffer = tableInfor[0].indexOf('<th id="ts1-prodCustomNo"');

        //获取table表头数据
        let tabHead = tableInfor[0]+'</tr>';

        //分为几页
        let pageNum = Math.ceil(tabProdList.length/maxRow);

        let allThAry = [];
        let amount = 0;
        let quantity = 0;

        let dateFormatType = "YYYY-MM-DD";
        if(dateFormat == "2"){
            dateFormatType = "YYYY年MM月DD日";
        }else if(dateFormat =="3"){
            dateFormatType = "YYYYMMDD";
        }

        for(var j=0;j<tabProdList.length;j++){
            let trInfor = ``;
            for(var i=0;i<prodFieldList.length;i++){
                //剔除总数量和总价格
                if(prodFieldList[i].fieldName != 'allAmount' && prodFieldList[i].fieldName != 'allPrice') {
                    //需要获取对应的th样式，将对应的样式带入到对应th中，使其在页面上生效。
                    //
                    let pointStr = `id="${thFlag}-${prodFieldList[i].fieldName}"`;
                    let pointContent = content.split(pointStr)[1];
                    if(pointContent){
                        let styleStatPoint = pointContent.indexOf('style="')+7;
                        let styleEndPoint = pointContent.indexOf('"',styleStatPoint);
                        //styleStatPoint= 6 表示没有style属性
                        let styleContent =  styleStatPoint === 6? '':pointContent.substring(styleStatPoint,styleEndPoint);
                        styleContent = styleContent + `font-size: ${wordSize}px`;
                        console.log(styleContent,'styleContent');
                        //
                        if(prodFieldList[i].fieldName == 'serialNumber'){
                            trInfor = trInfor + `<th style="${styleContent}">${j+1}</th>`
                        }else if(prodFieldList[i].fieldName == 'thumbnailUri') {
                            //处理图片，如果是导出功能，将图片以base64处理存储
                            const {href} = this.props;
                            if(href){
                                //tabProdList[j]['thumbnailUri'] && this.mainImgtoBase64("/api/file/img/download?url="+tabProdList[j]['thumbnailUri'],'img-'+i+'-'+j);
                                trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j]['thumbnailUri'] == undefined ? ' ' : '<img id="img-'+i+'-'+j+'"width="75" height="75"  src="'+this.dealImgUrl(tabProdList[j]['thumbnailUri'])+'"/>'}</th>`
                            }else{
                                trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j]['thumbnailUri'] == undefined ? ' ' : '<img width="75" height="75" src="https://erp.abiz.com/api/file/img/download?url='+tabProdList[j]['thumbnailUri']+'"/>'}</th>`
                            }
                        }else if(prodFieldList[i].fieldName == 'amount'){
                            //对小数点进行2位截取处理
                            trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j][prodFieldList[i].fieldName] == undefined ? ' ' : formatCurrency(tabProdList[j][prodFieldList[i].fieldName])}</th>`

                        }else if(prodFieldList[i].fieldName == 'property_value1'||prodFieldList[i].fieldName == 'property_value2'||prodFieldList[i].fieldName == 'property_value3'||prodFieldList[i].fieldName == 'property_value4'||prodFieldList[i].fieldName == 'property_value5'){

                            trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j]["propertyValues"] == undefined ? ' ' : (tabProdList[j]["propertyValues"][prodFieldList[i].fieldName] || '')}</th>`

                        }else if(prodFieldList[i].fieldName == 'quantity' || prodFieldList[i].fieldName == 'recQuantity'){

                            trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j][prodFieldList[i].fieldName] == undefined ? ' ' : fixedDecimal(tabProdList[j][prodFieldList[i].fieldName],quantityDecimalNum)}</th>`

                        }else if(prodFieldList[i].fieldName == 'untaxedPrice' || prodFieldList[i].fieldName == 'unitPrice' || prodFieldList[i].fieldName == 'tax' || prodFieldList[i].fieldName == 'untaxedAmount'){

                            trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j][prodFieldList[i].fieldName] == undefined ? ' ' : fixedDecimal(tabProdList[j][prodFieldList[i].fieldName],priceDecimalNum)}</th>`

                        }else if(prodFieldList[i].fieldName == 'unitConverter'){
                            //多单位的关系处理
                            trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j][prodFieldList[i].fieldName] == undefined ? ' ' : '1'+tabProdList[j]["recUnit"]+'='+tabProdList[j]["unitConverter"]+tabProdList[j]["unit"]}</th>`
                        } else if(prodFieldList[i].fieldName == 'expirationDate' || prodFieldList[i].fieldName == 'productionDate' || prodFieldList[i].fieldName == 'saleDeliveryDeadlineDate' ||  prodFieldList[i].fieldName == 'deliveryDeadlineDate' || prodFieldList[i].fieldName == 'expectStartDate' || prodFieldList[i].fieldName == 'expectEndDate' || prodFieldList[i].fieldName == 'actualStartDate' || prodFieldList[i].fieldName == 'actualEndDate'){
                            //对日期做特殊化处理
                            trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j][prodFieldList[i].fieldName] == undefined ? ' ' : moment(tabProdList[j][prodFieldList[i].fieldName]).format(dateFormatType)}</th>`
                        } else{
                            trInfor = trInfor + `<th style="${styleContent}">${tabProdList[j][prodFieldList[i].fieldName] == undefined ? ' ' : tabProdList[j][prodFieldList[i].fieldName]}</th>`
                        }
                    }else{
                        trInfor = trInfor + `<th>${tabProdList[j][prodFieldList[i].fieldName] == undefined ? ' ' : tabProdList[j][prodFieldList[i].fieldName]}</th>`
                    }
                }
            }
            allThAry.push(`${secondTr+trInfor}</tr>`);
            amount = amount + tabProdList[j].amount;
            quantity = quantity + tabProdList[j].quantity;
        }

        if(pageNum>1){
            //处理分成多个页数显示打印
            for(let k=0;k<pageNum;k++){
                let tabInfor = tabHead;
                if(k+1==pageNum){
                    //处理表格数据
                    for(var u=k*maxRow;u<allThAry.length;u++){
                        tabInfor = tabInfor + allThAry[u];
                    }

                }else{
                    //处理表格数据
                    for(var u=k*maxRow;u<(k+1)*maxRow;u++){
                        tabInfor = tabInfor + allThAry[u];
                    }
                }
                tabInfor = tabInfor + '</tbody></table>';
                //在table下面加一个合计
                allPageStr = allPageStr + `<div id="html-content" class="print-template" style="width: ${pageType[pageSize].w}px;height: ${pageType[pageSize].h==988 ?"auto":(pageType[pageSize].h-85)+"px"}">${aryInfor[0]}${tabInfor}${aryInfor[2]}<div id="main"></div><div class="change-line"></div></div>`
            }

        }else{
            let tabInfor = tabHead;
            //处理表格数据
            for(var t=0;t<allThAry.length;t++){
                tabInfor = tabInfor + allThAry[t];
            }
            tabInfor = tabInfor + '</tbody></table>';
            allPageStr =  `<div id="html-content" class="print-template" style="width: ${pageType[pageSize].w}px;height: ${pageType[pageSize].h==988 ?"auto":(pageType[pageSize].h-85)+"px"}">${aryInfor[0]}${tabInfor}${aryInfor[2]}<div id="main"></div><div class="change-line"></div></div>`;
        }

        return allPageStr;
    }

    //根据单据类型返回词典
    getDictionaries = (type,name) =>{
        let Dictionaries;
        let templateType = type;
        let zhName = '';
        switch (templateType){
            case 'EnterWarehouse_0':
            case 'EnterWarehouse_1':
            case 'EnterWarehouse_2':
            case 'EnterWarehouse_3':
            case 'EnterWarehouse_4':
            case 'EnterWarehouse_5':
            case 'EnterWarehouse_6':
            case 'EnterWarehouse_7':
            case 'EnterWarehouse_8':
                Dictionaries = inboundDictionaries;
                zhName = '入库单';
                break;
            case 'OutWarehouse_0':
            case 'OutWarehouse_1':
            case 'OutWarehouse_2':
            case 'OutWarehouse_3':
            case 'OutWarehouse_4':
            case 'OutWarehouse_5':
            case 'OutWarehouse_6':
            case 'OutWarehouse_7':
                Dictionaries = outboundDictionaries;
                zhName = '出库单';
                break;
            case 'PurchaseOrder':
                Dictionaries = purchaseDictionaries;
                zhName = '采购单';
                break;
            case 'SaleOrder':
                Dictionaries = saleDictionaries;
                zhName = '销售单';
                break;
            case 'ProduceOrder':
                Dictionaries = produceDictionaries;
                zhName = '生产单';
                break;
            case 'Subcontract':
                Dictionaries = subcontractDictionaries;
                zhName = '委外加工单';
                break;
            case 'QuotationOrder':
                Dictionaries = quotationDictionaries;
                zhName = '报价单';
                break;
            case 'RequisitionOrder':
                zhName = '请购单';
                Dictionaries = requisitionDictionaries;
                break;
            case 'ProduceWork':
                zhName = '生产工单';
                Dictionaries = produceWorkDictionaries;
        }
        return  name?zhName:Dictionaries;
    }

    getBase64Image = (img,url)=>{
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        if(url.indexOf('.png')>=0){
            var dataURL = canvas.toDataURL("image/png");
        }else{
            var dataURL = canvas.toDataURL("image/jpeg");  // 可选其他值 image/jpeg
        }
        return dataURL;
    }

    mainImgtoBase64 = (src,type) =>{
        var image = new Image();
        let _this = this;
        image.src = src; // 处理缓存
        image.crossOrigin = "*";  // 支持跨域图片
        image.onload = function(){
            var base64 = _this.getBase64Image(image,src);
            _this.allImgBase64Ary[type] = base64;
        }
        image.onerror = function(error){
            console.log(error,'error');
        }
    }

    dealImgUrl = (url)=>{
        let urlAry = url.split('prod/');
        if(urlAry.length === 2){
            return urlAry[0]+urlAry[1]
        }else{
            return url;
        }
    }

    //根据选择模板打印
    printAtLast = async(data,exportType) =>{
       //模板数据
        let {href} = this.props;
       let templateData = data.templateData;
       let pageSize = templateData.paperSize;
       let content = templateData.content;

       let Dictionaries = this.getDictionaries(templateData.billType);
       let ary = await this.dealNewCustomFields('other',templateData.billType);
       Dictionaries.other = Dictionaries.other.concat(ary);

       let dataOther = data.data;
       let _this = this;

       //数量精度
       let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
       //处理非表格区域数据
       let DictionariesOther =  Dictionaries.other;
       let content1 = content.replace(/\【(.+?)\】/g,(str)=>{
           let getStr = str.split('【')[1].split('】')[0];
           //将符号替换
           getStr = getStr.replace('&lt;','<');
           getStr = getStr.replace('&gt;','>');
           let getSrtToData;
           //convertCurrency(amount.toFixed(2))
           for(var i = 0;i<DictionariesOther.length;i++){
               if(DictionariesOther[i].name == getStr){
                   //处理需要特别处理的字段[enterType,enterDate,outDate,outType]
                   if(DictionariesOther[i].key == 'enterType'){

                       getSrtToData = dataOther['enterType']!= undefined?inTypeMap[dataOther['enterType']]:' ';

                   }else if(DictionariesOther[i].key == 'taxAllAmountUp'){

                       getSrtToData = dataOther['taxAllAmount']!= undefined?convertCurrency(dataOther['taxAllAmount'].toFixed(2)):' ';

                   }else if(DictionariesOther[i].key == 'aggregateAmountUp'){

                       getSrtToData = dataOther['aggregateAmount']!= undefined?convertCurrency(dataOther['aggregateAmount'].toFixed(2)):' ';

                   }else if(DictionariesOther[i].key == 'currencyAggregateAmountUp'){

                       getSrtToData = dataOther['currencyAggregateAmount']!= undefined?convertCurrency(dataOther['currencyAggregateAmount'].toFixed(2)):' ';

                   } else if(DictionariesOther[i].key == 'totalQuantity' || DictionariesOther[i].key == 'planeQuantity' || DictionariesOther[i].key == 'produceQuantity' || DictionariesOther[i].key == 'inQuantity'|| DictionariesOther[i].key == 'materialPlaneQuantity'|| DictionariesOther[i].key == 'materialTotalQuantity'|| DictionariesOther[i].key == 'materialAmount'|| DictionariesOther[i].key == 'materialQuantity'|| DictionariesOther[i].key == 'productAllocatedAmount' || DictionariesOther[i].key == 'productProcessCost'|| DictionariesOther[i].key == 'productAmount'){

                       getSrtToData = dataOther[DictionariesOther[i].key]!= undefined?fixedDecimal(dataOther[DictionariesOther[i].key],quantityDecimalNum):' ';

                   } else if(DictionariesOther[i].key == 'orderStatus'){

                       getSrtToData = dataOther['orderStatus']!= undefined?(dataOther['orderStatus']===1?"未完成":"已完成"):' ';

                   } else if(DictionariesOther[i].key == 'produceType'){

                       getSrtToData = dataOther['produceType']!= undefined?(dataOther['produceType']===1?"委外加工":"内部制造"):' ';

                   } else if(DictionariesOther[i].key == 'sheetStatus'){

                       getSrtToData = dataOther['sheetStatus']!= undefined?(orderTitleMap[dataOther['sheetStatus']]):' ';

                   } else if(DictionariesOther[i].key == 'taxAllAmount'||DictionariesOther[i].key == 'discountAmount'||DictionariesOther[i].key == 'aggregateAmount'||DictionariesOther[i].key == 'currencyAggregateAmount'){

                       getSrtToData = dataOther[DictionariesOther[i].key]!= undefined?formatCurrency(dataOther[DictionariesOther[i].key]):' ';

                   }else if(DictionariesOther[i].key == 'addedName'){

                       getSrtToData = dataOther['addedName']!= undefined?dataOther['addedName']:(dataOther['addedLoginName']?dataOther['addedLoginName']:' ');

                   }else if(DictionariesOther[i].key == 'updatedName'){

                       getSrtToData = dataOther['updatedName']!= undefined?dataOther['updatedName']:(dataOther['updatedLoginName']?dataOther['updatedLoginName']:' ');

                   }else if(DictionariesOther[i].key == 'approveStatus'){

                       getSrtToData = dataOther['approveStatus']!= undefined?(approveStatusMap[dataOther['approveStatus']]):' ';

                   }else if(DictionariesOther[i].key == 'outType'){

                       getSrtToData = dataOther['outType']!= undefined?outTypeMap[dataOther['outType']]:' ';

                   }else if(DictionariesOther[i].key== 'addedTime' ||  DictionariesOther[i].key== 'updatedTime'){

                       getSrtToData = dataOther[DictionariesOther[i].key]!= undefined?moment(dataOther[DictionariesOther[i].key]).format("YYYY-MM-DD HH:mm:SS"):' ';

                   }else if(DictionariesOther[i].key == 'enterDate' || DictionariesOther[i].key== 'outDate' || DictionariesOther[i].key== 'purchaseOrderDate' || DictionariesOther[i].key== 'saleOrderDate' || DictionariesOther[i].key== 'approvedTime' || DictionariesOther[i].key== 'orderDate' || DictionariesOther[i].key== 'remindDate' || DictionariesOther[i].key== 'requestDate' || DictionariesOther[i].key== 'expiredDate' || DictionariesOther[i].key== 'quotationDate' || DictionariesOther[i].key== 'expectStartDate' || DictionariesOther[i].key== 'expectEndDate' || DictionariesOther[i].key== 'actualStartDate' || DictionariesOther[i].key== 'actualEndDate'){

                       getSrtToData = dataOther[DictionariesOther[i].key]!= undefined?moment(dataOther[DictionariesOther[i].key]).format("YYYY-MM-DD"):' ';

                   }else if(DictionariesOther[i].key == 'deliveryProvinceText'){
                       //处理交付地址
                       getSrtToData = dataOther[DictionariesOther[i].key]!= undefined?`${dataOther[DictionariesOther[i].key]}-${dataOther['deliveryCityText']}-${dataOther['deliveryAddress']}`:dataOther['deliveryAddress']!= undefined?dataOther['deliveryAddress']:" ";
                   }else if(DictionariesOther[i].key == 'deliveryAddress'){
                       getSrtToData = dataOther['outProvinceText']!= undefined?`${dataOther['outProvinceText']}-${dataOther['outCityText']}-${dataOther['outAddress']}`:' ';
                   }else{
                       getSrtToData = dataOther[DictionariesOther[i].key]!= undefined?dataOther[DictionariesOther[i].key]:' ';
                   }
                   break;
               }
           }
           return getSrtToData;
       });

        console.log(content1,'content1');

       //如果是导出excel需要对dom做相应的处理
        href && exportType === 'excel' && (
            content1 = dealHtmlToXLSX(content1).content
        )

        console.log(content1,'content2');

       //处理多少数据一页
       let allPageStr = '';
       //对生产订单走分支处理
        if(templateData.billType === 'ProduceOrder'){
            //如果表格缺失，直接打印
            let deleteTabFlag1 = content1.indexOf('id="template-tables1"') === -1;
            if(deleteTabFlag1){
                allPageStr = `<div id="html-content" class="print-template" style="width: ${pageType[pageSize].w}px;height: ${pageType[pageSize].h==988 ?"auto":(pageType[pageSize].h-85)+"px"};">${content1}<div id="main"></div><div class="change-line"></div></div>`;
            }else{
                //处理第一个Table
                allPageStr = this.processTable(content1,data.data.pmsProduceOrderProductList,templateData.prodFieldList,'template-tables',1000,templateData.wordSize||14,templateData.dateFormat||"1",templateData.paperSize,'ts2',exportType);
                //处理第二个Table
                allPageStr = this.processTable(allPageStr,data.data.pmsProduceOrderMaterialList,templateData.materialFieldList,'template-tables1',1000,templateData.wordSize||14,templateData.dateFormat||"1",templateData.paperSize,'ts22',exportType);
            }
        }else if(templateData.billType === 'Subcontract'){
            //如果表格缺失，直接打印
            let deleteTabFlag1 = content1.indexOf('id="template-tables1"') === -1;
            if(deleteTabFlag1){
                allPageStr = `<div id="html-content" class="print-template" style="width: ${pageType[pageSize].w}px;height: ${pageType[pageSize].h==988 ?"auto":(pageType[pageSize].h-85)+"px"};">${content1}<div id="main"></div><div class="change-line"></div></div>`;
            }else{
                //处理第一个Table
                allPageStr = this.processTable(content1,data.data.enterProdList,templateData.prodFieldList,'template-tables',1000,templateData.wordSize||14,templateData.dateFormat||"1",templateData.paperSize,'ts2',exportType);
                //处理第二个Table
                allPageStr = this.processTable(allPageStr,data.data.outProdList,templateData.materialFieldList,'template-tables1',1000,templateData.wordSize||14,templateData.dateFormat||"1",templateData.paperSize,'ts22',exportType);
            }
        }else{
            //如果表格缺失，直接打印
            let deleteTabFlag = content1.indexOf('id="template-tables"') === -1;

            if(deleteTabFlag){
                allPageStr = `<div id="html-content" class="print-template" style="width: ${pageType[pageSize].w}px;height: ${pageType[pageSize].h==988 ?"auto":(pageType[pageSize].h-85)+"px"};">${content1}<div id="main"></div><div class="change-line"></div></div>`;
            }else{
                allPageStr = this.processTable(content1,data.data.prodList,templateData.prodFieldList,'template-tables',templateData.maxRow,templateData.wordSize||14,templateData.dateFormat||"1",templateData.paperSize,'ts2',exportType);
            }
        }

        href && exportType === 'word' && (
          this.exportWord(allPageStr)
        );

        href && exportType === 'excel' && (
            this.exportExcel(allPageStr)
        );

        !href && !exportType  && (
            this.printData(allPageStr)
        );

    }
    //导出word
    exportWord = (allPageStr)=>{
        const {templateType} = this.props;
        //自定义导出功能（完善）
        let domDiv = document.createElement("div");
        let _this = this;
        domDiv.setAttribute('id','docx-dom');
        domDiv.style.display = "none";
        domDiv.innerHTML = allPageStr;

        let domDiv1 = document.createElement("div");
        domDiv1.style.display = "none";
        domDiv1.setAttribute('id','html-docx-config');
        domDiv1.innerHTML = '<div id="page-header" textAlign="right"></div>';
        domDiv.prepend(domDiv1);
        document.body.appendChild(domDiv);
        //对页面的dom进行处理
        //处理掉th中样式为none的dom元素
        let tableDom = document.getElementById('template-tables');
        if(tableDom){
            let allTh = tableDom.getElementsByTagName("th");
            let length = allTh.length;
            let deleteIdAry = [];
            for(let m =0;m<length;m++){
                if(allTh[m].style.display === 'none'){
                    deleteIdAry.push(allTh[m].id);
                }
            }
            //解决react虚拟dom删除元素不立即生效
            deleteIdAry.forEach((item)=>{
                document.getElementById(item).remove();
            });

            //处理img标签
            /*let allImg = tableDom.getElementsByTagName("img");
            for(let k=0;k<allImg.length;k++){
                setTimeout(()=>{
                    let id = allImg[k].id;
                    allImg[k].setAttribute('src',_this.allImgBase64Ary[id]);
                },500);
            }*/

        }
        //如果是生产订单，对table也要处理
        let tableDom1 = document.getElementById('template-tables1');
        if(tableDom1 && (templateType === 'ProduceOrder'||templateType === 'Subcontract')){
            let allTh1 = tableDom1.getElementsByTagName("th");
            let length1 = allTh1.length;
            let deleteIdAry1 = [];
            for(let m =0;m<length1;m++){
                if(allTh1[m].style.display === 'none'){
                    deleteIdAry1.push(allTh1[m].id);
                }
            }
            //解决react虚拟dom删除元素不立即生效
            deleteIdAry1.forEach((item)=>{
                document.getElementById(item).remove();
            });

        }
        setTimeout(()=>{
            //处理导出的文件名称
            let cnName = this.getDictionaries(templateType,true)+ moment(new Date().getTime()).format("YYYY-MM-DD");

            HtmlToDocx({
                exportElement: '#html-content', // 需要转换为word的html标签
                exportFileName: `${cnName||'导出模板'}.docx`, // 转换之后word文档的文件名称
                StringStyle: '', // css样式以字符窜的形式插入进去
                margins:{top: 1440,right: 1440,bottom: 1440,left: 1440,header: 0,footer: 720,gutter: 0} // word的边距配置
            });

            document.getElementById('docx-dom').remove();

        },2000);

        this.closeTemplate();

    }
    //导出excel
    exportExcel = (allPageStr)=>{
        allPageStr = dealHtmlToXLSX(allPageStr).content;

        const {templateType} = this.props;
        let domDiv = document.createElement("div");
        let _this = this;
        domDiv.setAttribute('id','docx-dom');
        domDiv.style.display = "none";
        domDiv.innerHTML = allPageStr;

        let domDiv1 = document.createElement("div");
        domDiv1.style.display = "none";
        domDiv1.setAttribute('id','html-docx-config');
        domDiv1.innerHTML = '<div id="page-header" textAlign="right"></div>';
        domDiv.prepend(domDiv1);
        document.body.appendChild(domDiv);
        //对页面的dom进行处理
        //处理掉th中样式为none的dom元素
        let tableDom = document.getElementById('template-tables');
        if(tableDom){
            let allTh = tableDom.getElementsByTagName("th");
            let length = allTh.length;
            let deleteIdAry = [];
            for(let m =0;m<length;m++){
                if(allTh[m].style.display === 'none'){
                    deleteIdAry.push(allTh[m].id);
                }
            }
            //解决react虚拟dom删除元素不立即生效
            deleteIdAry.forEach((item)=>{
                document.getElementById(item).remove();
            });

            //处理img标签
            /*let allImg = tableDom.getElementsByTagName("img");
            for(let k=0;k<allImg.length;k++){
                setTimeout(()=>{
                    let id = allImg[k].id;
                    allImg[k].setAttribute('src',_this.allImgBase64Ary[id]);
                },500);
            }*/

        }
        //如果是生产订单，对table也要处理
        let tableDom1 = document.getElementById('template-tables1');
        if(tableDom1 && (templateType === 'ProduceOrder'||templateType === 'Subcontract')){
            let allTh1 = tableDom1.getElementsByTagName("th");
            let length1 = allTh1.length;
            let deleteIdAry1 = [];
            for(let m =0;m<length1;m++){
                if(allTh1[m].style.display === 'none'){
                    deleteIdAry1.push(allTh1[m].id);
                }
            }
            //解决react虚拟dom删除元素不立即生效
            deleteIdAry1.forEach((item)=>{
                document.getElementById(item).remove();
            });

        }

        let cnName = this.getDictionaries(templateType,true)+ moment(new Date().getTime()).format("YYYY-MM-DD");

        var oTable = document.getElementById("html-content").innerHTML;
        var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
        excelFile += "<head><meta charset='UTF-8'><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>";
        excelFile += "<body>";
        excelFile += oTable;
        excelFile += "</body>";
        excelFile += "</html>";

        console.log(excelFile,'excelFile');

        /*let excelBlob = new Blob([excelFile], {type:"application/vnd.ms-excel"});
        var a = document.createElement("a");
        a.href = URL.createObjectURL(excelBlob);
        a.download = cnName+".xls";
        a.click();*/

        var link = "data:application/vnd.ms-excel;base64," + this.base64(excelFile);
        var a = document.createElement("a");
        a.download = cnName+".xls";
        a.href = link;
        a.click();

        //去除先前生成dom
        document.getElementById('docx-dom').remove();
        this.closeTemplate();
    }

    //打印
    printData = (allPageStr) => {
        //打印功能
        let newWindow = window.open('about:blank');
        newWindow.document.title = '打印模板';
        newWindow.document.body.innerHTML =allPageStr;
        setTimeout(()=>{
            newWindow.print();
        },800);
    }

    base64 = (content) => {
        return window.btoa(unescape(encodeURIComponent(content)));
    };

    //关闭弹层
    closeTemplate = ()=>{
        this.setState({
            templateVisible:false
        });
    }

    //选择模板
    chooseTemplate = (displayBillNo,templateType)=>{
        let _this = this;
        this.props.asyncCustomerTemplatesList({billType:templateType},(data)=>{
            if(data.VALUE_ADDED.vipState == 'TRY'||data.VALUE_ADDED.vipState == 'OPENED'){
                this.setState({
                    templateVisible:true,
                    dataSource: data.data
                });
            }else if(data.VALUE_ADDED.vipState == 'NOT_OPEN'){
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    title: intl.get('common.confirm.title'),
                    content:  (
                        <div>
                            {intl.get("components.vipOpe.addPkgOpen.bomVipContent")}
                        </div>
                    ),
                    okText: intl.get('vipService.index.open'),
                    onOk() {
                        _this.props.asyncFetchVipValueAdded((datas)=> {
                            if (datas.retCode == "0") {
                                _this.setState({
                                    templateVisible:true,
                                    dataSource: data.data
                                });
                            }
                        });
                    }
                });
            }else{
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    title: intl.get('common.confirm.title'),
                    content:  (
                        <div>
                            <p>{intl.get("components.vipOpe.addPkgOpen.bomVipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("components.vipOpe.addPkgOpen.treatyText")}</a>
                        </div>
                    )
                });
            }

        })

    }
    //直接打印
    directPrint = (displayBillNo,templateType)=>{
        this.props.asyncCustomerTemplatesDirectPrint({billNo:displayBillNo,billType:templateType},(data)=>{
            if(!data.data.status && data.data.status !== undefined){
                //调用初始打印模式
                let bdHtml = window.document.body.innerHTML;
                let printHtml = document.getElementById('printArea').innerHTML;
                window.document.body.innerHTML = printHtml;
                window.print();
                window.document.body.innerHTML = bdHtml;
                location.reload();
            }else{
                this.printAtLast(data.data);
            }

        });
    }

    //新建模板
    createNewTemplate = (type) =>{
        this.props.asyncFetchVipService((data)=>{
            let dataSource = data.data;
            if(dataSource.VALUE_ADDED.vipState == 'TRY'||dataSource.VALUE_ADDED.vipState == 'OPENED'){
                this.props.history.push(`/template/new?templateType=${type}`)
            }else if(dataSource.VALUE_ADDED.vipState == 'NOT_OPEN'){
                let _this = this;
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    title: intl.get('common.confirm.title'),
                    content:  (
                        <div>
                            {intl.get("components.vipOpe.addPkgOpen.bomVipContent")}
                        </div>
                    ),
                    okText: intl.get('vipService.index.open'),
                    onOk() {
                        _this.props.asyncFetchVipValueAdded((datas)=> {
                            if (datas.retCode == "0") {
                                _this.props.history.push(`/template/new?templateType=${type}`)
                            }
                        });
                    }
                });
            }else{
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    title: intl.get('common.confirm.title'),
                    content:  (
                        <div>
                            <p>{intl.get("components.vipOpe.addPkgOpen.bomVipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("components.vipOpe.addPkgOpen.treatyText")}</a>
                        </div>
                    )
                });
            }
        })
    }


    onSelectChange = (selectedRowKeys)=>{
        this.setState({selectedRowKeys});
    }

    render() {

        const {displayBillNo,templateType,href} = this.props;
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let tempColumns = [
            {
                dataIndex: "templateName",
                key: "templateName",
                title: intl.get("components.printDetail.templateName")
            },
            {
                dataIndex: "paperSize",
                key: "paperSize",
                title: intl.get("components.printDetail.paperSize"),
                render: (type)=>{
                    return pageType[type].name
                }
            },
            {
                dataIndex: "isDefault",
                key: "isDefault",
                title: intl.get("components.printDetail.isDefault"),
                render: (key)=>{
                    return key==1?'是':'否'
                }
            }];


        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={()=>this.directPrint(displayBillNo,templateType)} target="_blank">
                        {intl.get("components.listOpeBar.index.print-1")}
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={()=>this.chooseTemplate(displayBillNo,templateType)} target="_blank">
                        {intl.get("components.listOpeBar.index.print-2")}
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={()=>this.createNewTemplate(templateType)} target="_blank">
                        {intl.get("components.listOpeBar.index.print-3")}
                    </a>

                   {/* <Link to={`/template/new?templateType=${templateType}`}>
                        新建模板
                    </Link>*/}
                </Menu.Item>
            </Menu>
        );

        const menu1 = (
            <Menu>
                <Menu.Item>
                    <a href={href}>
                        {intl.get("components.listOpeBar.index.print-4")}
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={()=>this.chooseTemplate(displayBillNo,templateType)} target="_blank">
                        {intl.get("components.listOpeBar.index.print-5")}
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={()=>this.createNewTemplate(templateType)} target="_blank">
                        {intl.get("components.listOpeBar.index.print-3")}
                    </a>
                </Menu.Item>
            </Menu>
        );



        let footer = href?(
            [
                <Button key="back" onClick={this.closeTemplate}>
                    取消
                </Button>,
                <Button key="export1" type="primary" onClick={()=>this.doPrint(displayBillNo,templateType,'word')}>
                    导出Word
                </Button>,
                <Button key="export2" type="primary" onClick={()=>this.doPrint(displayBillNo,templateType,'excel')}>
                    导出Excel
                </Button>
            ]
        ):(
            [
                <Button key="back" onClick={this.closeTemplate}>
                    取消
                </Button>,
                <Button key="print" type="primary" onClick={()=>this.doPrint(displayBillNo,templateType)}>
                    打印
                </Button>
            ]
        );


        return (
            <React.Fragment>
                <Dropdown overlay={href?menu1:menu}>
                    {
                        href? (<li key="print" ga-data={'list-export'}>
                                  <Icon type={"icon-export"}/>{intl.get("components.opeBar.index.export")}
                              </li>):
                              (<li key="print" ga-data={'list-print'}>
                                <Icon type={"icon-print"}/>{intl.get("components.listOpeBar.index.print")}
                              </li>)
                    }

                </Dropdown>
                <Modal
                    title={intl.get("components.printDetail.choose")}
                    visible={this.state.templateVisible}
                   /* onOk={()=>this.doPrint(displayBillNo,templateType)}*/
                    onCancel={this.closeTemplate}
                    width={900}
                    footer={footer}
                >
                    <div className={"tb-inner"}>
                        <Table rowSelection={rowSelection} dataSource={this.state.dataSource} columns={tempColumns} scroll={{ y: 280 }}  pagination={false}/>
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncCustomerTemplatesList,
        asyncCustomerTemplatesGetData,
        asyncCustomerTemplatesDirectPrint,
        asyncFetchVipValueAdded,
        asyncFetchVipService,
        asyncFetchNewCustomFieldList
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(withRouter(PrintDetail))

