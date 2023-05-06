import React, { Component } from 'react';
import {
    Form,
    Col,
    Row,
    message,
    Select,
    Radio,
    Table,
    Checkbox,
    Input,
    Button,
    Modal,
    InputNumber,
} from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import {AddToCartBtn} from 'components/widgets/addCartBtn';
import {bindActionCreators} from "redux";
import {actions as customerTemplateAction} from "../index";
import {asyncFetchNewCustomFieldList} from "../../../auxiliary/newCustomField/actions";
import {getUrlParamValue} from 'utils/urlParam';
import {getCookie} from 'utils/cookie';
import {pageType,template,inboundDictionaries,outboundDictionaries,purchaseDictionaries,saleDictionaries,produceDictionaries,requisitionDictionaries,subcontractDictionaries,quotationDictionaries,
         produceWorkDictionaries,fontSizeMap,templateTypeMap,customFieldMap} from './templateDictionaries';
import {Link, withRouter} from "react-router-dom";
import {toJS} from "immutable";
import {connect} from "react-redux";

import { MenuOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import ProdDesc from './prodDesc';
import {Prompt} from "react-router";
import img1 from "../images/tiplst.jpeg";
import OptimizationComponent from "./optimizationComponent";
import moment from "moment/moment";
const {Option} = Select;
const cx = classNames.bind(styles);


class customTemplate extends OptimizationComponent {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            radio: 1,
            //初始化默认纸张选择类型
            pageType: 'a4_h',
            //初始模板类型
            templateType: 'EnterWarehouse_0',
            templateStr: '',
            defaultTemplate: false,
            tableObj:{},
            tableObj1:{},
            dataSource: [],
            dataSource1: [],
            maxRow: 5,
            templateName:'',
            editorH: 717,
            editorW: 1046,
            //判断页面是否进行操作
            formHasChanged: false,
            fontSize: '14',
            dateFormat: "1",
            tipFlag: true,
            tipFlag1: true,
            Dictionaries: {}
        }
    }

    componentDidMount() {
        this.fetchDate()
    }

    //处理修改数据
    dealEditors = async(data) =>{
        if(data.data){
            let dataSource = data.data.data;
            //处理表格数据
            let Dictionaries = this.getDictionaries(dataSource.billType);
            //优先给字典添加自定义字段
            //表头表尾
            let ary = await this.dealNewCustomFields('other',dataSource.billType);
            Dictionaries.other && (Dictionaries.other = Dictionaries.other.concat(ary));
            //单据物品自定义字段
            let ary1 = await this.dealNewCustomFields('table',dataSource.billType);
            Dictionaries.table && (Dictionaries.table = Dictionaries.table.concat(ary1));
            //物品自定义字段
            let ary2 = await this.dealNewCustomFields('goods',dataSource.billType);
            Dictionaries.table && (Dictionaries.table = Dictionaries.table.concat(ary2));
            //成品物品自定义字段
            let ary3 = await this.dealNewCustomFields('mGoods',dataSource.billType);
            Dictionaries.materialTable && (Dictionaries.materialTable = Dictionaries.materialTable.concat(ary3));
            //原料物品自定义字段
            let ary4 = await this.dealNewCustomFields('pGoods',dataSource.billType);
            Dictionaries.productTable && (Dictionaries.productTable = Dictionaries.productTable.concat(ary4));

            let tabAry = [];
            dataSource.prodFieldList.map((item,index)=>{
                tabAry.push(item.fieldName);
            });
            let tabObj = {};
            let newDataSource = [];

            //需要对老数据进行处理
            if(dataSource.sortAryStr){
                //处理字段的顺序
                let sortAry = dataSource.sortAryStr.split(',');
                for(let j=0;j<sortAry.length;j++){
                    newDataSource.push({
                        key: j,
                        index: j+1,
                        name: sortAry[j].split('-')[0].replace('~','-'),
                        action: [false,sortAry[j].split('-')[1]]
                    });
                    if(tabAry.indexOf(sortAry[j].split('-')[1]) !== -1){
                        tabObj[sortAry[j].split('-')[1]] = true;
                    }else{
                        tabObj[sortAry[j].split('-')[1]] = false;
                    }
                }

            }else{
                let DictionariesTable =  (dataSource.billType ==='ProduceOrder' || dataSource.billType ==='Subcontract')?Dictionaries.productTable:Dictionaries.table;
                DictionariesTable.map((item,index)=>{
                    var obj = {
                        key: index,
                        index: index+1,
                        name:`【${item.name}】`,
                        action: [item.displayShow,item.key]
                    }
                    newDataSource.push(obj)
                    if(tabAry.indexOf(item.key)!== -1){
                        tabObj[item.key] = true;
                    }else{
                        tabObj[item.key] = false;
                    }
                });
            }
            //如果是老数据，需要在原先的数据中添加新的物品自定义字段
            //通过updateTime进行判断，如果updateTime在设置的特定时间之前，证明是老数据，需要对数据进行填充
            //1655384400000 2022.6.16 21:00 之前的进行修改
            //如果更新出错，强制让数据出现，可以通过设置cookie的方法
            //设置cookie =》getCustomGoodsData === 9999
            if(dataSource.updatedTime < 1655384400000 || getCookie('getCustomGoodsData') === '9999'){
                let arys = [];
                (dataSource.billType ==='ProduceOrder' || dataSource.billType ==='Subcontract')?arys = ary4:arys = ary2;
                arys && arys.length>0 && arys.map((item,index)=>{
                    let obj = {
                        key: index+50,
                        index: index+51,
                        name:`【${item.name}】`,
                        action: [item.displayShow,item.key]
                    }
                    tabObj[item.key] = false;
                    newDataSource.push(obj);
                });
            }

            let tabObj1 = {};
            let newDataSource1 = [];
            let tabAry1 = [];
            //如果是生产订单数据，对数据单独处理。
            if(dataSource.billType === 'ProduceOrder' || dataSource.billType ==='Subcontract'){
                dataSource.materialFieldList.map((item,index)=>{
                    tabAry1.push(item.fieldName);
                });
                if(dataSource.sortmAryStr){
                    //处理字段的顺序
                    let sortAry1 = dataSource.sortmAryStr.split(',');
                    for(let j=0;j<sortAry1.length;j++){
                        newDataSource1.push({
                            key: j,
                            index: j+1,
                            name: sortAry1[j].split('-')[0].replace('~','-'),
                            action: [false,sortAry1[j].split('-')[1]]
                        });
                        if(tabAry1.indexOf(sortAry1[j].split('-')[1])!== -1){
                            tabObj1[sortAry1[j].split('-')[1]] = true;
                        }else{
                            tabObj1[sortAry1[j].split('-')[1]] = false;
                        }
                    }

                }else{
                    Dictionaries.materialTable.map((item,index)=>{
                        var obj = {
                            key: index,
                            index: index+1,
                            name:`【${item.name}】`,
                            action: [item.displayShow,item.key]
                        }
                        newDataSource1.push(obj)
                        if(tabAry1.indexOf(item.key)!== -1){
                            tabObj1[item.key] = true;
                        }else{
                            tabObj1[item.key] = false;
                        }
                    });
                }


                //如果是老数据，需要在原先的数据中添加新的物品自定义字段
                //主要是处理生产单和委外加工单的自定义字段
                if(dataSource.updatedTime < 1655384400000 || getCookie('getCustomGoodsData') === '9999'){
                    let arys = ary3;
                    arys && arys.length>0 && arys.map((item,index)=>{
                        let obj = {
                            key: index+50,
                            index: index+51,
                            name:`【${item.name}】`,
                            action: [item.displayShow,item.key]
                        }
                        tabObj1[item.key] = false;
                        newDataSource1.push(obj);
                    });
                }

            }

            this.formRef.current.setFieldsValue({
                templateName: dataSource.templateName,
                maxRow: dataSource.maxRow,
            });

            this.setState({
                templateName:dataSource.templateName,
                maxRow:dataSource.maxRow,
                pageType:dataSource.paperSize,
                templateType:dataSource.billType,
                defaultTemplate:(dataSource.isDefault==1),
                templateStr:dataSource.content,
                tableObj:tabObj,
                tableObj1:tabObj1,
                fontSize:dataSource.wordSize,
                dateFormat:dataSource.dateFormat||"1",
                dataSource: newDataSource,
                dataSource1: newDataSource1,
                Dictionaries
            });

            setTimeout(()=>{
                this.changePaper(dataSource.paperSize);
            },600);

        }
    }

    fetchDate = ()=>{
        let templatesId = this.props.match.params.id||this.props.match.params.copyId||this.props.match.params.recommendId;
        let urlTemplateType = getUrlParamValue('templateType');
        urlTemplateType && this.setState({templateType:urlTemplateType});
        if(templatesId){
            //修改操作或复制操作
            let _this = this;
            this.props.asyncCustomerTemplatesDetail({id:templatesId},(data)=>{
                _this.dealEditors(data);
            })
        }else{
            //进入页面初始化表格字段的state
            setTimeout(()=>{
                this.inintTableData();
            },50)
        }
    }

    //初始化表格数据
    inintTableData = async()=>{
        let Dictionaries = this.getDictionaries();
        //如果是生产订单，对字典做特殊处理
        let templateType =this.state.templateType;
        let tableObj = {};
        let tableObj1 = {};
        const dataSource = [];
        const dataSource1 = [];
        if(templateType === 'ProduceOrder' || templateType === 'Subcontract'){
            //成品表格区
            let ary = await this.dealNewCustomFields('pGoods');
            Dictionaries.productTable = Dictionaries.productTable.concat(ary);
            Dictionaries.productTable.map((item,index)=>{
                tableObj[item.key] = item.displayShow;
                var obj = {
                    key: index,
                    index: index+1,
                    name:`【${item.name}】`,
                    action: [item.displayShow,item.key]
                }
                dataSource.push(obj)
            });
            let ary1 = await this.dealNewCustomFields('mGoods');
            Dictionaries.materialTable = Dictionaries.materialTable.concat(ary1);
            //原料表格区
            Dictionaries.materialTable.map((item,index)=>{
                tableObj1[item.key] = item.displayShow;
                var obj = {
                    key: index,
                    index: index+1,
                    name:`【${item.name}】`,
                    action: [item.displayShow,item.key]
                }
                dataSource1.push(obj)
            });

        }else{

            let ary = await this.dealNewCustomFields('other');
            Dictionaries.other = Dictionaries.other.concat(ary);

            let ary1 = await this.dealNewCustomFields('table');
            Dictionaries.table = Dictionaries.table.concat(ary1);

            let ary2 = await this.dealNewCustomFields('goods');
            Dictionaries.table = Dictionaries.table.concat(ary2);

            Dictionaries.table.map((item,index)=>{
                tableObj[item.key] = item.displayShow;
                var obj = {
                    key: index,
                    index: index+1,
                    name:`【${item.name}】`,
                    action: [item.displayShow,item.key]
                }
                dataSource.push(obj);
            });
        }
        this.setState({tableObj,dataSource,tableObj1,dataSource1,Dictionaries},()=>{
            this.dealEditor();
        });
    }

    //根据单据类型返回词典
    getDictionaries = (type) =>{
        let Dictionaries;
        let templateType = (type?type:this.state.templateType);
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
                break;
            case 'PurchaseOrder':
                Dictionaries = purchaseDictionaries;
                break;
            case 'SaleOrder':
                Dictionaries = saleDictionaries;
                break;
            case 'ProduceOrder':
                Dictionaries = produceDictionaries;
                break;
            case 'Subcontract':
                Dictionaries = subcontractDictionaries;
                break;
            case 'QuotationOrder':
                Dictionaries = quotationDictionaries;
                break;
            case 'RequisitionOrder':
                Dictionaries = requisitionDictionaries;
                break;
            case 'ProduceWork':
                Dictionaries = produceWorkDictionaries;
        }
        return  Dictionaries;
    }


    //处理新版本自定义字段
    dealNewCustomFields = (type,billType) => {
        let templateType = billType || this.state.templateType;
        let field = customFieldMap[templateType];
        let data = this.getDictionaries(billType);
        let preDataLength = 0;
        switch(type){
            case 'goods':
                data['table'] && (preDataLength = data['table'].length);
                break;
            case 'pGoods':
                data['productTable'] && (preDataLength =  data['productTable'].length);
                break;
            case 'mGoods':
                data['materialTable'] && (preDataLength = data['materialTable'].length);
                break;
            default:
                data[type] && (preDataLength = data[type].length);
        }
        return new Promise((resolve,reject)=>{
            let data = [];
            if(field && preDataLength === field[type+'Length']){
                this.props.asyncFetchNewCustomFieldList(field[type],(list)=>{
                    list.data.forEach((item)=>{
                        if(item.propName){
                            if(type === 'table'){
                                let obj = {
                                    key: item.mappingName,
                                    name: item.propName,
                                    displayShow : false
                                }
                                data.push(obj);
                            }else if(type === 'goods'||type === 'mGoods'||type === 'pGoods'){
                                let obj = {
                                    key: 'prod_'+item.mappingName,
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
                        }

                    });
                    type === 'table'? (field['goodsLength'] = field['tableLength']+data.length):null;
                    resolve(data);
                });
            }else{
                resolve(data);
            }
        });
    }

    //处理富文本内容
    dealEditor = ()=>{
        let Dictionaries;
        let templateType = this.state.templateType;
        Dictionaries = this.state.Dictionaries;

        let templateStr = '';
        templateStr = templateStr + `<h3 style="text-align: center;"><span style="font-weight: 700;">________公司${template[templateType].name}订单标题</span></h3>`;
        //处理表头
        let topInfor  = '';
        templateStr = templateStr+`<div>${topInfor}</div>`;
        //加一行空格
        templateStr = templateStr + '<p><br></p>';
        //处理表格
        let tr1 = '';
        let tr2 = '';
        let tab = '';

        let tr11 = '';
        let tr22 = '';
        let tab1 = '';

        if(templateType === 'ProduceOrder' || templateType === 'Subcontract'){
            //如果是生产订单，初始化渲染2个Table
            //成品表格区域
            Dictionaries && Dictionaries.productTable.map((item, index) => {
                if(item.key !== 'allAmount' && item.key !== 'allPrice'){
                    if(item.displayShow){
                        tr1 = tr1 +`<th style="text-align: center;font-weight: normal" id="ts1-${item.key}">${item.name}</th>`;
                        tr2 = tr2 +`<th style="text-align: center;font-weight: normal;" id="ts2-${item.key}">{${item.name}}</th>`;
                    }else{
                        tr1 = tr1 +`<th style="text-align: center;font-weight: normal;display: none;" id="ts1-${item.key}">${item.name}</th>`;
                        tr2 = tr2 +`<th style="text-align: center;font-weight: normal;display: none;" id="ts2-${item.key}">{${item.name}}</th>`;
                    }
                }
            });
            //原料表格区域
            Dictionaries && Dictionaries.materialTable.map((item, index) => {
                if(item.key !== 'allAmount' && item.key !== 'allPrice'){
                    if(item.displayShow){
                        tr11 = tr11 +`<th style="text-align: center;font-weight: normal" id="ts11-${item.key}">${item.name}</th>`;
                        tr22 = tr22 +`<th style="text-align: center;font-weight: normal;" id="ts22-${item.key}">{${item.name}}</th>`;
                    }else{
                        tr11 = tr11 +`<th style="text-align: center;font-weight: normal;display: none;" id="ts11-${item.key}">${item.name}</th>`;
                        tr22 = tr22 +`<th style="text-align: center;font-weight: normal;display: none;" id="ts22-${item.key}">{${item.name}}</th>`;
                    }
                }
            });

        }else{
            Dictionaries && Dictionaries.table.map((item, index) => {
                if(item.key != 'allAmount' && item.key != 'allPrice'){
                    if(item.displayShow){
                        tr1 = tr1 +`<th style="text-align: center;font-weight: normal" id="ts1-${item.key}">${item.name}</th>`;
                        tr2 = tr2 +`<th style="text-align: center;font-weight: normal" id="ts2-${item.key}">{${item.name}}</th>`;
                    }else{
                        tr1 = tr1 +`<th style="text-align: center;font-weight: normal;display: none;" id="ts1-${item.key}">${item.name}</th>`;
                        tr2 = tr2 +`<th style="text-align: center;font-weight: normal;display: none;" id="ts2-${item.key}">{${item.name}}</th>`;
                    }
                }
            });
        }

        tab = `<table id="template-tables" style="table-layout: fixed;word-wrap: break-word" border="1" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>${tr1}</tr><tr>${tr2}</tr></tbody></table>`;

        tab1 = `<table id="template-tables1" style="table-layout: fixed;word-wrap: break-word;margin-top: 40px" border="1" width="100%" cellPadding="0" cellSpacing="0" ><tbody><tr>${tr11}</tr><tr>${tr22}</tr></tbody></table>`;
        //特殊模板，额外添加一个tab
        (templateType === 'ProduceOrder' || templateType === 'Subcontract')?templateStr = templateStr + tab + tab1:templateStr = templateStr + tab;

        templateStr = templateStr + '<p><br></p>';
        //处理表尾
        let bottomInfor  = '';
        templateStr = templateStr+`<div>${bottomInfor}</div>`;
        this.setState({templateStr:templateStr});
    }

    getRef = (prodDescRef) => {
        this.prodDescRef = prodDescRef
    };
    //纸张类型change方法
    handleChange= (e) =>{
        this.setState({pageType:e,formHasChanged:true});
        this.changePaper(e);
    }

    //改变表格区与字体大小
    handleFontChange = (e)=>{
        this.setState({fontSize:e,formHasChanged:true});
    }

    //纸张大小变化
    changePaper= (type)=>{
        let e = (type?type:this.state.pageType);
        this.setState({
            editorH: pageType[e].h+96,
            editorW: pageType[e].w,
        });
        let targetObj = document.getElementById("tincyEditor").nextSibling;
        targetObj.style.width = pageType[e].w+'px';
        targetObj.style.minHeight = pageType[e].h+96+'px';
        targetObj.style.maxHeight = pageType[e].h+96+'px';
        targetObj.style.margin = '0 auto';
    }

    //模板类型change方法
    handleTemplateTypeChange = (e)=>{
        let _this = this;
        Modal.confirm({
            title:'提示信息',
            content:'确定要切换单据类型嘛？  切换后，页面数据将会初始化。',
            okText:'确定',
            cancelText:'取消',
            onOk:()=>{
                _this.setState({
                    templateType:e,
                    formHasChanged:true
                },()=>{
                    _this.inintTableData();
                });
            }
        });

    }

    //改变是否是默认模板
    handleChangeDefaultTemplateKey = (e) =>{
        this.setState({defaultTemplate:e.target.checked})
    }

    //提交模板
    handleSubmit = ()=>{
        this.formRef.current.validateFields().then((values)=>{

            this.setState({formHasChanged:false});
            //处理需要提交的数据
            //0 不是 1是
            values['isDefault'] = this.state.defaultTemplate?1:0;
            values['paperSize'] = this.state.pageType;
            values['billType'] = this.state.templateType;
            values['content'] = this.prodDescRef.state.content;
            values['wordSize'] = this.state.fontSize;
            values['dateFormat'] = this.state.dateFormat;
            //添加固定字段判断是否为新版本添加的模板，用来处理老数据
            values['newAddForCustomField'] = 1;
            let templateInforsm = this.prodDescRef.state.content;
            let deleteTabFlag = templateInforsm.indexOf('id="template-tables"')===-1;
            let produceTabFlag = (this.state.templateType === 'ProduceOrder'|| this.state.templateType === 'Subcontract') && (templateInforsm.indexOf('id="template-tables1"')===-1)
            //如果表格被删除给出提示
            if(deleteTabFlag || produceTabFlag){
                message.warn('表格已被删除，打印时表格信息会缺失！');
            }
            //其他字段的数据源
            let tabObj = this.state.tableObj;
            let prodFieldList = [];
            for (var item in tabObj){
                if(tabObj[item]){
                    prodFieldList.push({fieldName:item})
                }
            }
            values['prodFieldList'] = prodFieldList;
            //解析富文本的数据
            let otherObj = this.prodDescRef.state.content;
            let fieldList = [];
            otherObj.replace(/\【(.+?)\】/g,(str)=>{
                let getStr = str.split('【')[1].split('】')[0];
                // < => &lt;
                // > => &gt;
                getStr = getStr.replace('&lt;','<');
                getStr = getStr.replace('&gt;','>');
                //遍历字典得到对应英文
                let Dictionaries = this.state.Dictionaries.other;
                for(var i = 0;i<Dictionaries.length;i++){
                    if(Dictionaries[i].name == getStr){
                        fieldList.push({fieldName:Dictionaries[i].key});
                        break;
                    }
                }
            });
            values['fieldList'] = fieldList;
            let dataSource = this.state.dataSource;
            //为方便后端处理，对排序数据进行处理生成字符串
            let dealAry = [];
            for(let i=0;i<dataSource.length;i++){
                //如果在设置的时候就存在-，则替换成~
                dataSource[i].name = dataSource[i].name.replace('-','~');
                dealAry.push(dataSource[i].name+'-'+dataSource[i].action[1])
            }
            values['sortAryStr'] = dealAry.toString();
            //如果类型是生产单据，需要添加另外一组table数据和对应的排序str字符串
            if(this.state.templateType === 'ProduceOrder'|| this.state.templateType === 'Subcontract'){
                let tabObj = this.state.tableObj1;
                let materialFieldList = [];
                for (let item in tabObj){
                    if(tabObj[item]){
                        materialFieldList.push({fieldName:item})
                    }
                }
                values['materialFieldList'] = materialFieldList;

                //排序Str
                let dataSource = this.state.dataSource1;
                //为方便后端处理，对排序数据进行处理生成字符串
                let sortmAryStr = [];
                for(let i=0;i<dataSource.length;i++){
                    dataSource[i].name = dataSource[i].name.replace('-','~');
                    sortmAryStr.push(dataSource[i].name+'-'+dataSource[i].action[1])
                }
                values['sortmAryStr'] = sortmAryStr.toString();
            }


            //数据处理结束
            let id = this.props.match.params.id;

            id?(this.props.asyncEditorCustomerTemplates({values:values,id:id},(data)=>{
                if(data.data.retCode == '0'){
                    message.success('修改模板成功!');
                    this.props.history.push(`/template/list`);
                }else{
                    message.warn(data.data.retMsg);
                }
            })):(
                this.props.asyncCustomerTemplates(values,(data)=>{
                    if(data.retCode == '0'){
                        this.props.match.params.copyId?message.success('复制模板成功!'):message.success('新增模板成功!');
                        this.props.history.push(`/template/list`);
                    }else{
                        message.warn(data.retMsg);
                    }
                })
            )
        });

    }


    render() {

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            }
        };

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            title: '自定义模板列表',
                            url: '/template/list'
                        },
                        {
                            title: this.props.match.params.id ? '修改自定义模板' : (this.props.match.params.copyId?'复制自定义模板':'新建自定义模板')
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Row>
                        <Col span={6}>
                            <div className={cx("wild-tab")}>
                                <strong>表头表尾</strong>
                                <span className={cx("tab-title")}>可复制需要打印的单据信息，粘贴到右侧的编辑区域。</span>
                                <div className={cx("tb-infor")}>
                                    <div className={cx("tb-inners")}>
                                        {this.dealTable()}
                                    </div>
                                </div>
                            </div>
                            <div className={cx("wild-tab")}>
                                <strong>{(this.state.templateType === "ProduceOrder" || this.state.templateType === "Subcontract")?"成品表格区":"表格区"}</strong>
                                <span className={cx("tab-title")}>勾选对应字段即可加入打印模板。</span>
                                <div className={cx("tb-infor")}>
                                    <div style={{display: this.state.tipFlag?"block":"none"}} className={cx("tb-tips")}>
                                        <img src={img1} alt="tp"/>
                                        <div onClick={()=>{this.setState({tipFlag: false})}} className={cx("tp-close")}> </div>
                                    </div>
                                    <div className={cx("tb-inners")}>
                                        {this.dealTable1()}
                                    </div>
                                </div>
                            </div>
                            {
                                (this.state.templateType === "ProduceOrder" || this.state.templateType === "Subcontract")?(
                                    <div className={cx("wild-tab")}>
                                        <strong>原料表格区</strong>
                                        <span className={cx("tab-title")}>勾选对应字段即可加入打印模板。</span>
                                        <div className={cx("tb-infor")}>
                                            <div style={{display: this.state.tipFlag1?"block":"none"}} className={cx("tb-tips")}>
                                                <img src={img1} alt="tp"/>
                                                <div onClick={()=>{this.setState({tipFlag1: false})}} className={cx("tp-close")}> </div>
                                            </div>
                                            <div className={cx("tb-inners")}>
                                                {this.dealTable2()}
                                            </div>
                                        </div>
                                    </div>
                                ):null
                            }
                        </Col>
                        <Col span={18}>
                            <Form ref={this.formRef}>
                                <Row>
                                    <Col span={6}>
                                        <Form.Item
                                            label="模板名称"
                                            {...formItemLayout}
                                            name={"templateName"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '模板名称为必填项！'
                                                }
                                            ]}
                                        >
                                            <Input  onChange={this.changeText} placeholder={"模板名称"}  maxLength={25}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}> </Col>
                                    <Col span={8}>
                                           <span className={cx('btn-label')}>单据类型：
                                               <Select value={this.state.templateType} style={{ width: 140 }} onChange={this.handleTemplateTypeChange}>
                                                   {
                                                       templateTypeMap.map((item)=>{
                                                           return  <Option key={item.key} value={item.key}>{item.name}</Option>
                                                       })
                                                   }
                                                </Select>
                                           </span>
                                    </Col>
                                    <Col span={9}>
                                           <span className={cx('btn-label')}>表格日期格式：<Select value={this.state.dateFormat} style={{ width: 160 }} onChange={this.handleDateTypeChange}>
                                                             <Option key="1" value={"1"}>YYYY-MM-DD（例：1988-01-01）</Option>
                                                             <Option key="2" value={"2"}>YYYY年MM月DD日（例：1988年01月01日）</Option>
                                                             <Option key="3" value={"3"}>YYYYMMDD（例：19980101）</Option>
                                                           </Select>
                                             </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <Form.Item
                                            label="最大行数："
                                            {...formItemLayout}
                                            name={"maxRow"}
                                            initialValue={this.state.maxRow}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '列表最大行数为必填项！'
                                                }
                                            ]}
                                        >
                                            <InputNumber onChange={this.changeText} min={1} max={10000} precision={0} placeholder={"最大行数"} style={{width: 80}} maxLength={25}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={8}>
                                           <span className={cx('btn-label')}>纸张尺寸：
                                               <Select value={this.state.pageType} style={{ width: 140 }} onChange={this.handleChange}>
                                                   {
                                                       fontSizeMap.map((item)=>{
                                                           return <Option key={item.key} value={item.key}>{item.name}</Option>
                                                       })
                                                   }
                                                </Select>
                                            </span>
                                    </Col>
                                    <Col span={9}>
                                           <span className={cx('btn-label')}>表格区字号：
                                               <Select value={this.state.fontSize} style={{ width: 160 }} onChange={this.handleFontChange}>
                                                   {
                                                       ['8','9','10','11','12','14','16','18','24','36','48','56','72'].map((item)=>{
                                                           return <Option key={item}>{item}px</Option>
                                                       })
                                                   }
                                                </Select>
                                            </span>
                                    </Col>
                                </Row>

                                <div className={cx("wild-btn")} style={{textAlign:'left',color:'#333'}}>
                                    <ExclamationCircleOutlined style={{marginRight: '6px', color:'#0066DD'}}/>{"若要修改表格表头显示名称，请修改表格第一行字段名称，请勿复制整个列表区域！否则可能会造成数据错乱。"}
                                </div>
                                <ProdDesc getRef={this.getRef} height={this.state.editorH} width={this.state.editorW} templateStr={this.state.templateStr}/>
                            </Form>

                        </Col>
                    </Row>
                    <div className={cx("tem-ft")}>
                        <Checkbox onChange={this.handleChangeDefaultTemplateKey} checked={this.state.defaultTemplate}>设为默认模板</Checkbox>
                        <Button  onClick={this.handleSubmit}  type={"primary"}>确定</Button>
                        <Button  onClick={this.cancle} type={"default"}>取消</Button>
                    </div>
                </Content.ContentBd>
                <Prompt message="页面还没有保存，确定离开?" when={this.state.formHasChanged} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    customTemplate: state.getIn(['customerTemplates', 'customTemplate'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncCustomerTemplates: customerTemplateAction.asyncCustomerTemplates,
        asyncEditorCustomerTemplates: customerTemplateAction.asyncEditorCustomerTemplates,
        asyncCustomerTemplatesDetail: customerTemplateAction.asyncCustomerTemplatesDetail,
        asyncFetchNewCustomFieldList
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(customTemplate)
)

