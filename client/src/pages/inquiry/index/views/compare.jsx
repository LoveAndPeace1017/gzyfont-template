import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Table, Button, Checkbox, message,} from "antd";

import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import {bindActionCreators} from "redux";
import {asyncCompareQuotation} from "../actions";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import XLSX from 'xlsx';
import {actions as supplierEdit} from "../../../supplier/add";


const cx = classNames.bind(styles);


class CompareQuotation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            originalData:{
                inquiryInfo:{},
                quotations:[],
            },
            showBlank:true,
            showSame:true,
        };
    }
    compareQuotation = (info)=>{
        let {inquiry,quotations} = info;
        let inquiryProds = quotations[0].prod;
        let data = [];
        let diffData = [];
        let notEmptyData = [];
        let inquiryTime = moment(inquiry.addedTime).format('YYYY-MM-DD')
        let prodProp = [
            {name: 'prodName',key:''},
            {name: intl.get("inquiry.index.compare.unitPrice"),key:'unitPrice'},
            {name: intl.get("inquiry.index.compare.totalPrice"),key:'totalPrice'},
            {name: intl.get("inquiry.index.compare.effectiveTime"),key:'effectiveTime',value:(value)=>inquiryTime+'-'+moment(value).format('YYYY-MM-DD')},
            {name: intl.get("inquiry.index.compare.shipDate"),key:'shipDate'},
            {name: intl.get("inquiry.index.compare.description"),key:'description'},
        ];
        inquiryProds.forEach((prod,prodIndex)=>{
            prodProp.forEach((prop,propIndex)=>{
                let item = {
                    key: prodIndex*prodProp.length+propIndex
                };
                if(prop.name=='prodName'){
                    item.name = prod.prodName+',  '+intl.get("inquiry.index.compare.purchase")+prod.purchaseQuantity+prod.purchaseUnitText;
                    quotations.forEach((quo,index)=>{
                        item[index+1+""]="";
                    });
                }else{
                    item.name = prop.name;
                    let blankFlag = true;
                    let sameFlag = true;
                    let propValue = '#';
                    let min = -1;
                    quotations.forEach((quo,index)=>{
                        if(prop.value){
                            item[index+1+""] = prop.value(quo.prod[prodIndex][prop.key],quo.prod[prodIndex]);
                        }else{
                            item[index+1+""] = quo.prod[prodIndex][prop.key];
                        }
                        if(prop.name==intl.get("inquiry.index.compare.unitPrice")){
                            if(min==-1||Number(item[index+1+""])<min){
                                min = Number(item[index+1+""]);
                            }
                        }
                        if(blankFlag && item[index+1+""]){
                            blankFlag = false
                        }
                        if(sameFlag){
                            if(propValue=='#'){
                                propValue = item[index+1+""];
                            }else if( item[index+1+""] != propValue){
                                sameFlag = false
                            }
                        }
                    });
                    if((prop.name==intl.get("inquiry.index.compare.unitPrice"))){
                        item.min = min;
                    }
                    item.blankFlag = blankFlag;
                    item.sameFlag = sameFlag;
                }
                data.push(item);
                if(!item.blankFlag){
                    notEmptyData.push(item);
                }
                if(!item.sameFlag){
                    diffData.push(item);
                }
            });
        });
        let otherProps = [
            {name: intl.get("inquiry.index.compare.totalAmount"),key:''},
            {name: intl.get("inquiry.index.compare.offerTotalPrice"),key:'totalPrice'},
            {name: intl.get("inquiry.index.compare.other"),key:''},
            {name: intl.get("inquiry.index.compare.taxFlag"),key:'taxFlag',value:(value,data)=>value=='0'? intl.get("inquiry.index.compare.no"): intl.get("inquiry.index.compare.containTax")+data.taxRate+'%'},
            {name: intl.get("inquiry.index.compare.hasFreight"),key:'hasFreight',value:(value)=>value? intl.get("inquiry.index.compare.yes"): intl.get("inquiry.index.compare.no")},
            {name: intl.get("inquiry.index.compare.quotationDesc"),key:'quotationDesc'},
            {name: intl.get("inquiry.index.compare.addedTime"),key:'addedTime',value:(value)=>moment(value).format('YYYY-MM-DD')},
            {name: intl.get("inquiry.index.compare.attachments"),key:'attachments'},
            {name: intl.get("inquiry.index.compare.supplierBasicInfo"),key:''},
            {name: intl.get("inquiry.index.compare.userName"),key:'userName'},
            {name: intl.get("inquiry.index.compare.mobile"),key:'mobile',value:(value,data)=>value?value:data.comTel},
        ];
        otherProps.forEach((prop,propIndex)=>{
            let item = {
                key:"other"+propIndex,
                name:prop.name
            };

            if(prop.name==intl.get("inquiry.index.compare.totalAmount") ||prop.name==intl.get("inquiry.index.compare.other") ||prop.name==intl.get("inquiry.index.compare.supplierBasicInfo")){
                quotations.forEach((quo,index)=>{
                    item[index+1+""]="";
                });
            }else{
                let blankFlag = true;
                let sameFlag = true;
                let propValue = '#';
                let min = -1;
                quotations.forEach((quo,index)=>{
                    if(prop.value){
                        item[index+1+""] = prop.value(quo[prop.key],quo);
                    }else{
                        item[index+1+""]=quo[prop.key];
                    }
                    if(prop.name==intl.get("inquiry.index.compare.offerTotalPrice")){
                        if(min==-1||Number(item[index+1+""])<min){
                            min = Number(item[index+1+""]);
                        }
                    }
                    if(blankFlag && item[index+1+""]){
                        blankFlag = false
                    }
                    if(sameFlag){
                        if(propValue=='#'){
                            propValue = item[index+1+""];
                        }else if( !item[index+1+""] || item[index+1+""] !=propValue){
                            sameFlag = false
                        }
                    }
                });
                if(prop.name==intl.get("inquiry.index.compare.offerTotalPrice")){
                    item.min = min;
                }
                item.blankFlag = blankFlag;
                item.sameFlag = sameFlag;
            }
            data.push(item);
            if(!item.blankFlag){
                notEmptyData.push(item);
            }
            if(!item.sameFlag){
                diffData.push(item);
            }
        });
        console.log(data);
        this.setState({
            dataSource:data,
            notEmptyDataSource:notEmptyData,
            diffDataSource:diffData
        });
    };
    componentDidMount() {
        if(this.props.selectedRowKeys){
            this.props.asyncCompareQuotation({
                inquiryId:this.props.inquiryId,
                ids:this.props.selectedRowKeys
            },(data)=>{
                if(data.retCode==0){
                    let quotations = data.data.quotations;
                    quotations.sort(function (a,b){
                        return a.addedTime - b.addedTime;
                    });
                    data.data.quotations = quotations;
                    this.compareQuotation(data.data);
                    this.setState({
                        originalData:data.data
                    });
                }else{
                    message.error(data.retMsg);
                }
            });
        }
    }
    cancelCompare = (id)=>{
        const {originalData} = this.state;
        let quotations = originalData.quotations.filter((quotation)=>{
            return quotation.quotationId != id;
        });
        originalData.quotations = quotations
        this.compareQuotation(originalData);
        this.setState({
            originalData:originalData
        });
    };
    addToSupplier = (supplier)=>{
        this.props.asyncInsertSupplier(supplier,(data)=>{
            if (data.retCode == 0) {
                let originalData = this.state.originalData;
                let quotations = originalData.quotations.map((quo)=>{
                   if(quo.comName == supplier.name){
                       quo.supplier = {};
                   }
                   return quo;
                });
                originalData.quotations = quotations;
                this.setState({
                    originalData
                });
                message.success(intl.get("inquiry.index.compare.operateSuccessMessage"));
            }else {
                alert(data.retMsg)
            }
        });
    };
    toggleBlank = (e)=>{
        this.setState({
            showBlank:e.target.checked
        })
    };
    toggleSame = (e)=>{
        this.setState({
            showSame:e.target.checked
        })
    };

    exportData = ()=>{
        // let div = document.getElementById('compareQuotationTable');
        // let tables = div.getElementsByTagName('table');
        // let htmlstr = '';
        // let thead = tables[0].getElementsByTagName('thead')[0].outerHTML;
        // let tbody = tables[1].getElementsByTagName('tbody')[0].outerHTML;
        // if(tables.length==2){
        //     htmlstr = "<table>" + thead + tbody + "</table>";
        // }else{
        //     htmlstr = div.outerHTML;
        // }
        // console.log('htmlstr:');
        // let workbook = XLSX.read(htmlstr, {type:'string'});
        // console.log('wb:',JSON.stringify(workbook));
        // XLSX.writeFile(workbook, '对比报价单.xls');
        // let data = {
        //     cols: [{ name: "A", key: 0 }, { name: "B", key: 1 }, { name: "C", key: 2 }],
        //     data: [
        //         [ "id"],
        //         [    1, "sheetjs",    7262 ],
        //         [    2, "js-xlsx",    6969 ]
        //     ]
        // };
        // const ws = XLSX.utils.aoa_to_sheet(data.data);
        // const wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        // /* generate XLSX file and send to client */
        // XLSX.writeFile(wb, "sheetjs.xlsx");
        const {originalData} = this.state;
        const {inquiry={},quotations=[]} = originalData;
        let dataSource = [];
        if(!this.state.showSame){
            dataSource = this.state.diffDataSource;
        }else if(!this.state.showBlank){
            dataSource = this.state.notEmptyDataSource;
        }else{
            dataSource =  this.state.dataSource;
        }
        let A2 = `${intl.get("inquiry.index.compare.inquiryDate")}：${moment(inquiry.addedTime).format('YYYY-MM-DD')}  ${intl.get("inquiry.index.compare.inquiryTitle")}：${inquiry.infoTitle}`;
        let length = dataSource.length + 3;
        let quotationsNum = quotations.length;
        let cols = ['A','B','C','D','E','F'];
        let colsLenArr = [{wch:30}];
        quotations.forEach((quo)=>{
            colsLenArr.push({wch:30});
        });
        let merges = [
            {s:{r:0,c:0},e:{r:0,c:quotationsNum}},
            {s:{r:1,c:0},e:{r:1,c:quotationsNum}}
        ];


        let sheet1 = {
            "!ref": "A1:"+cols[quotations.length]+length,
            '!cols':colsLenArr,
            A1:{t:'s', v: intl.get("inquiry.index.compare.watchInquiryOrder")},
            A2:{t:'s', v: A2},
        };
        let row = {
            name: intl.get("inquiry.index.compare.offerSupplier")
        };
        quotations.forEach((quo,index)=> {
            row[index + 1 + ""] = quo.companyName;
        });
        dataSource.unshift(row);
        dataSource.forEach((row,index)=>{
            sheet1['A'+(index+3)] = {t:'s', v:row.name}
            if (row.name==intl.get("inquiry.index.compare.supplierBasicInfo")||row.name==intl.get("inquiry.index.compare.other") ||row.name==intl.get("inquiry.index.compare.totalAmount") ||row.name==intl.get("inquiry.index.compare.supplierBasicInfo") ||row.name.indexOf(`  ${intl.get("inquiry.index.compare.purchase")}`)!=-1) {
                merges.push({s:{r:index+2,c:0},e:{r:index+2,c:quotationsNum}});
            }if(row.name==intl.get("inquiry.index.compare.attachments")){
                quotations.forEach((quo,qIndex)=>{
                    let attachments = row[qIndex+1+''];
                    let value = '';
                    if(attachments.length==0){
                        value = '--';
                    }else{
                        attachments.forEach((attach)=>{
                            value = value + attach.name + ",";
                        });
                        value = value.substring(0,value.length-1);
                    }
                    sheet1[cols[qIndex+1]+(index+3)] = {t:'s', v:value}
                });
            }else{
                quotations.forEach((quo,qIndex)=>{
                    sheet1[cols[qIndex+1]+(index+3)] = {t:'s', v:row[qIndex+1+'']}
                });
            }
        });
        sheet1["!merges"] = merges;

        console.log('sheet1:',sheet1);

        XLSX.writeFile({
            SheetNames:["Sheet1"],
            Sheets: {
                Sheet1:sheet1,
                // Sheet1: {
                //     "!ref": "A1:E3",
                //     A1:{t:'s', v:"查看报价单"},
                //     A2:{t:'s', v:"询价日期：2019-05-08    询价标题：我要给你个差评"},
                //     A3:{t:'s', v:"报价供应商"},
                //     B3:{t:'s', v:"供应商tmic602"},
                //     C3:{t:'s', v:"供应商tmic302"},
                //     D3:{t:'s', v:"供应商tmic301"},
                //     E3:{t:'s', v:"供应商tmic102"},
                //     "!merges":[
                //         {s:{r:0,c:0},e:{r:0,c:4}}, /* A1:A5 */
                //         {s:{r:1,c:0},e:{r:1,c:4}} /* A1:A5 */
                //     ],
                //     '!cols':[{wch:30},
                //         {wch:30},
                //         {wch:30},
                //         {wch:30},
                //         {wch:30},
                //     ]
                // }
            }
        }, 'test.xlsx');



    };


    render() {
        const {originalData} = this.state;
        const {inquiry={},quotations=[]} = originalData;
        const renderContent = (value, row, index) => {
            const obj = {
                children: <span className="txt-clip" title={value}>{value}</span>,
                props: {},
            };
            if(row.name==intl.get("inquiry.index.compare.unitPrice")||row.name==intl.get("inquiry.index.compare.offerTotalPrice")){
                obj.children = <span className="txt-clip" title={value} style={{'color':'#fd6215'}}>{value}</span>;
                if(row.min == value){
                    obj.props.style = {
                        'backgroundColor':'#e0fef6'
                    }
                }
            }
            if(row.name==intl.get("inquiry.index.compare.attachments")){
                if(value.length==0){
                    obj.children = '--';
                }else{
                    obj.children = <React.Fragment>
                        {
                            value.map((file,index)=> <p className={cx('attach-item') + ' txt-clip'}><a key={index} href={`http://www.abiz.com/vo/inquiry_attachs/${file.idEnc}`} title={file.name}>{file.name}</a></p>
                            )
                        }
                    </React.Fragment>
                }
            }
            if (row.name==intl.get("inquiry.index.compare.supplierBasicInfo") || row.name==intl.get("inquiry.index.compare.other") || row.name==intl.get("inquiry.index.compare.totalAmount") ||row.name==intl.get("inquiry.index.compare.supplierBasicInfo") || row.name.indexOf(`  ${intl.get("inquiry.index.compare.purchase")}`)!=-1) {
                obj.props.colSpan = 0;
            }
            return obj;
        };
        let columns = [
            {
                title: intl.get("inquiry.index.compare.offerSupplier"),
                dataIndex: 'name',
                width:120,
                // fixed: 'left',
                render: (text, row, index) => {
                    if (row.name==intl.get("inquiry.index.compare.offerSupplier") || row.name==intl.get("inquiry.index.compare.other") || row.name==intl.get("inquiry.index.compare.totalAmount") || row.name==intl.get("inquiry.index.compare.supplierBasicInfo") || row.name.indexOf(`  ${intl.get("inquiry.index.compare.purchase")}`)!=-1) {
                        return {
                            children: <strong className="txt-clip" title={text}>{text}</strong>,
                            props: {
                                colSpan: quotations.length+1,
                            },
                        };
                    }
                    return <span className="txt-clip" title={text}>{text}</span>;
                },
            },
        ];
        quotations.forEach((quo,index)=>{
            columns.push({
                title:  <div className={cx("cp-tb-tit")}>
                    <p>{quo.companyName}</p>
                    <div className={cx("cp-tb-ope")}>
                        {
                            quotations.length>1?<Button onClick={()=>this.cancelCompare(quo.quotationId)} size="small" type="primary" key={1}>{intl.get("inquiry.index.compare.cancelCompare")}</Button>:null
                        }
                        {
                            quo.supplier?null:<Button  key={2} onClick={()=>this.addToSupplier({
                                name:quo.comName,
                                contacterName:quo.userName,
                                mobile:quo.mobile||quo.comTel,
                                email:quo.email
                            })}  size="small"  type="primary">{intl.get("inquiry.index.compare.joinSupplierStock")}</Button>
                        }
                    </div>
                </div>,
                width: 230,
                dataIndex: index+1,
                render: renderContent
            });
        });
        let dataSource = [];
        if(!this.state.showSame){
            dataSource = this.state.diffDataSource;
        }else if(!this.state.showBlank){
            dataSource = this.state.notEmptyDataSource;
        }else{
            dataSource =  this.state.dataSource;
        }

        const tableWidth = columns && columns.reduce(function (width, item) {
            return width + (item.width ? item.width : 200) / 1;
        }, 0);

        return (
            <React.Fragment>
                <div className={cx("compare-wrap")}>
                    <div className={cx("ope-bar")}>
                        <Button className={cx("btn-export")} htmlType={'button'} onClick={this.exportData} type="primary">{intl.get("inquiry.index.compare.exportExcel")}</Button>
                        <Checkbox onChange={this.toggleBlank} checked={this.state.showBlank}>{intl.get("inquiry.index.compare.showBlankRow")}</Checkbox>
                        <Checkbox onChange={this.toggleSame} checked={this.state.showSame}>{intl.get("inquiry.index.compare.showSameRow")}</Checkbox>
                    </div>
                    <div className={cx("compare-content")} id={'compareQuotationTable'}>
                        <div className={cx("compare-inner")}>
                            <div className={cx("compare-hd")}>
                                <h3>{intl.get("inquiry.index.compare.watchInquiryOrder")}</h3>
                                <div className={cx("sub-title")}>
                                    <span>{intl.get("inquiry.index.compare.inquiryDate")}：{moment(inquiry.addedTime).format('YYYY-MM-DD')}</span><span>{intl.get("inquiry.index.compare.inquiryTitle")}：{inquiry.infoTitle}</span>
                                </div>
                            </div>
                            <div className={cx("compare-bd")}>
                                <Table columns={columns}
                                       dataSource={dataSource}
                                       bordered
                                       pagination={false}
                                       scroll={{x:tableWidth, y: 500}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncInsertSupplier:supplierEdit.asyncInsertSupplier,
        asyncCompareQuotation
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(CompareQuotation);