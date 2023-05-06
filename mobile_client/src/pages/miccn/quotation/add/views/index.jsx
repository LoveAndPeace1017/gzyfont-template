import React, { Component } from 'react';

import { List, InputItem, DatePicker, Modal, Toast, ImagePicker } from 'antd-mobile';
import Header from 'components/layout/header';
import Fold from 'components/widgets/fold';
import AttrItem from 'components/widgets/attrItem';
import ScrollContainer from 'components/widgets/scrollContainer';
import {Spin} from "antd";
import {ButtonGroup} from './extra';


import {asyncFetchInitQuotationDetail, asyncAddQuotation, asyncAppUploadPic} from '../actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatCurrency} from 'utils/format';
import axios from 'utils/axios';
import tempData from './data';
const {taxGroup, freightGroup, sexGroup, invoiceTypeRange} = tempData;

import {withRouter} from "react-router-dom";
import {format} from "date-fns";
import locale from 'antd-mobile/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {reducer as quotationAddReducer} from "../index";
import {fromJS} from "immutable";
const cx = classNames.bind(styles);

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            taxGroup: [...taxGroup],
            freightGroup: [...freightGroup],
            sexGroup: [...sexGroup],
            files: [],
            comName: '',
            userEmail: '',
            userGender: '1',
            userMobile: '',
            userName: '',
            quotationProds: [],
            freightFlag: '0',
            taxFlag: '0',
            quotationDesc: '',
            taxRate: '',
            tempAttIds: '',
            csrf_token: ''
        };
    }

    componentDidMount() {
        const {match:{params}} = this.props;
        this.props.asyncFetchInitQuotationDetail({inquiryId: params.inquiryId}, (data) => {
            if(data.retCode ==='0'){
                let backData = data.data;
                if(backData.linkinfo){
                    let {comName,userEmail, userGender, userMobile, userName } = backData.linkinfo;
                    userGender = userGender || '1';
                    this.setState({comName,userEmail, userGender, userMobile, userName});
                }
                if(backData.quotation){
                    let {quotationProds, freightFlag, taxFlag, quotationDesc, taxRate } = backData.quotation;
                    freightFlag = freightFlag || '0';
                    taxFlag = taxFlag || '0';

                    for(var i=0; i<quotationProds.length; i++){
                        this.setState({['visible'+(i+1)]: false});
                    }
                    this.setState({quotationProds, freightFlag, taxFlag, quotationDesc, taxRate });
                }
                if(backData.csrf_token){
                    this.setState({csrf_token: backData.csrf_token});
                }
            } else {
                Toast.fail(data.retMsg, 1);
            }
        });
    }

    openModal = (tag)=>{
        this.setState({
            [tag]:true
        })
    };

    closeModal = (tag)=>{
        this.setState({
            [tag]:false
        })
    };

    onChange = (tag, value, idx) => {
        console.log(tag, value, idx, 'sss');
        let {quotationProds} = this.state;
        quotationProds[idx][tag] = value;
        this.setState({quotationProds});
    };

    imgOnChange = (files, type, index) => {
        let tempAttIds = this.state.tempAttIds;
        console.log(files, 'files');
        if(type === 'add'){
            let file = files[files.length-1].file;
            let param = new FormData(); //创建form对象
            param.append('file',file);//通过append向form对象添加数据
            let config = {
                headers:{'Content-Type':'multipart/form-data'}
            }; //添加请求头
            var _this = this;
            if(file.size / 1024 / 1024 <= 2) {
                _this.setState({files});
                axios.post(`${BASE_URL}/mobile/miccn/quotation/app_temp_attachs`,param,config)
                    .then(response=>{
                        let id = response.data.id;

                        if(tempAttIds.length > 0){
                            tempAttIds = tempAttIds+`,${id}`;
                        }else {
                            tempAttIds = id.toString();
                        }
                        _this.setState({tempAttIds});
                    });
            } else {
                Toast.fail('请上传2M以下的图片！', 1);
            }
        }

        if(type === 'remove'){
            let ids = tempAttIds.split(',');
            tempAttIds = ids.slice(0, index).concat(ids.slice(index+1));
            this.setState({files});
        }

    };

    onTimeOk = (date, idx) => {
        let {quotationProds} = this.state;
        quotationProds[idx].effectiveTime = date;
        console.log(date - new Date(), 'date');
        this.setState({['visible'+(idx+1)]: false, quotationProds});
    };

    submit = () => {
        let message = this.isNull();
        if (message !== '') {
            Toast.fail(message, 1);
            return false;
        }
        const {match:{params}} = this.props;
        var self = this;

        const {taxFlag, freightFlag,taxRate, quotationDesc, quotationProds,
            comName,userEmail:email, userGender:gender, userMobile:mobile, userName, tempAttIds, csrf_token} = this.state;
        let extraParams = {taxFlag, freightFlag, quotationDesc, quotationProds, comName, email, gender, mobile, userName, tempAttIds, csrf_token};
        if(taxFlag === '1')  extraParams.taxRate = taxRate ;
        this.props.asyncAddQuotation(params.inquiryId, extraParams, (id) => {
            self.props.history.push(`${PROD_PATH}/miccn/quotation/${id}`)
        });
    };

    //非空检测
    isNull = () => {
        const {quotationProds, comName,userEmail, userGender, userMobile, userName, taxFlag, taxRate} = this.state;
        let message = '';

        for(var i=0; i<quotationProds.length; i++){
            if(!quotationProds[i].unitPriceNew && quotationProds[i].unitPriceNew ==''){
                message = '请输入单价';
                return message;
            } else if(!/^(0|[1-9]\d{0,7})(\.\d{1,3})?$/.test(quotationProds[i].unitPriceNew)){
                message = '单价最多输入8位整数3位小数！';
                return message;
            } else if(!quotationProds[i].effectiveTime && quotationProds[i].effectiveTime =='') {
                message = '请选择价格有效期限';
                return message;
            } else if (quotationProds[i].effectiveTime <= new Date()) {
                message = '请选择应大于当前日期';
                return message;
            } else if (!quotationProds[i].shipDate || quotationProds[i].shipDate == '') {
                message = '请输入交货期';
                return message;
            }
        }

        if(taxFlag === '1'){
            if(!taxRate || taxRate == ''){
                message = '请输入税率';
            } else if(!/^(?:0|[1-9][0-9]?|9)$/.test(taxRate)){
                message = '税率只能输入2位正整数';
            }
            return message;
        } else if (!comName || comName == '') {
            message = '请输入公司名称';
            return message;
        } else if (!userName || userName == '') {
            message = '请输入您的姓名';
            return message;
        } else if (!userMobile || userMobile == '') {
            message = '请输入联系电话';
            return message;
        } else if (!userEmail || userEmail == '') {
            message = '请输入电子邮箱';
            return message;
        } else if (!userGender || userGender == '') {
            message = ' 请选择性别';
            return message;
        } else {
            return message;
        }
    };

    render() {
        const {files, taxGroup, freightGroup, sexGroup,
            taxFlag, taxRate, freightFlag, quotationDesc, quotationProds,
            comName,userEmail, userGender, userMobile, userName,} = this.state;

        const {initQuotationDetail} = this.props;

        let inquiryDetailData = initQuotationDetail.getIn(['data', 'data', 'inquiry']) ;

        const inquiryData = inquiryDetailData?inquiryDetailData:fromJS({});

        return(
            <div className={cx('container')}>
                <Header navStatus={'quotationAdd'}/>

                {
                    initQuotationDetail.get('isFetching') ? <Spin className="gb-data-loading"/> : (
                        <div className={cx('main')}>
                            <ScrollContainer className={cx("scroll-container")}>
                                <Fold title={inquiryData.get('infoTitle')}>
                                    <AttrItem label="公司名称">{inquiryData.get('comName')}</AttrItem>
                                    <AttrItem label="交货地">{inquiryData.get('deliveryProvince')} {inquiryData.get('deliveryCity')}</AttrItem>
                                    <AttrItem label="报价含税要求">
                                        {
                                            inquiryData.get('taxFlag')==='0' ? '报价不含税': (
                                                '报价要求含税'+ (inquiryData.get('taxRate') ? inquiryData.get('taxRate') : 0 ) + '% '
                                            )
                                        }
                                        {
                                            (inquiryData.get('taxInvoice') && invoiceTypeRange[inquiryData.get('taxInvoice')]) ? '，发票类别为'+invoiceTypeRange[inquiryData.get('taxInvoice')] : ''
                                        }
                                    </AttrItem>
                                </Fold>

                                {
                                    quotationProds && quotationProds.map((prod, index) => {
                                        return (
                                            <div className={cx('list-detail')} style={{'marginTop': '10px'}} key={index}>
                                                <List className="my-list">
                                                    <InputItem
                                                        disabled
                                                    ><span className={cx('list-title')}>报价信息{quotationProds.length>1?index+1:''}</span></InputItem>

                                                    <InputItem
                                                        placeholder=""
                                                        disabled
                                                        value={prod.prodName}
                                                    ><span className={cx('list-title')}>物品名称</span></InputItem>

                                                    <InputItem
                                                        placeholder=""
                                                        disabled
                                                        value={prod.inquiryProdItemSpec}
                                                    ><span className={cx('list-title')}>规格属性</span></InputItem>

                                                    <InputItem
                                                        placeholder=""
                                                        disabled
                                                        value={prod.purchaseQuantity}
                                                    ><span className={cx('list-title')}>采购量</span><span className={cx('amount')}>{prod.purchaseUnitText}</span></InputItem>

                                                    <InputItem
                                                        placeholder="输入单价（必填）"
                                                        maxLength={20}
                                                        value={prod.unitPriceNew}
                                                        onChange={(value) => this.onChange('unitPriceNew', value, index)}
                                                    ><span className={cx('list-title')}>单价</span><span className={cx('amount')}>元</span></InputItem>

                                                    <Item arrow="horizontal" multipleLine onClick={() => {this.setState({['visible'+(index+1)]: true })}}>
                                                <span className={cx('price')}>
                                                    <label htmlFor="" className={cx('price-title')}>价格有效期：</label>
                                                    <span>
                                                        {prod.effectiveTime ? format(prod.effectiveTime, 'YYYY-MM-DD') : ''}
                                                    </span>
                                                </span>
                                                    </Item>

                                                    <InputItem
                                                        placeholder="输入天数（必填）"
                                                        maxLength={10}
                                                        value={prod.shipDate}
                                                        onChange={(value) => this.onChange('shipDate', value, index)}
                                                    ><span className={cx('list-title')}>交货期</span><span className={cx('amount')}>天</span></InputItem>
                                                </List>
                                                <DatePicker
                                                    visible={this.state['visible'+(index+1)]}
                                                    mode="date"
                                                    title=""
                                                    value={prod.effectiveTime ? new Date(prod.effectiveTime) : now}
                                                    locale={locale}
                                                    onOk={(date) => this.onTimeOk(date, index)}
                                                    onDismiss={() => this.setState({ ['visible'+(index+1)]: false })}
                                                >
                                                </DatePicker>
                                            </div>
                                        )
                                    })
                                }


                                <div className={cx('list-detail')}>
                                    <List className="my-list">
                                        <InputItem
                                            disabled
                                        ><span className={cx('list-title')}>其他信息</span></InputItem>

                                        <Item extra={
                                            <ButtonGroup
                                                dataSource={taxGroup}
                                                defaultValue={taxFlag}
                                                onChange={(val) => this.setState({taxFlag: val})}
                                            />
                                        }><span className={cx('list-title')}>报价是否含税</span></Item>

                                        <div style={{'display': taxFlag==='0' ? 'none' : 'block'}}>
                                            <InputItem
                                                placeholder=""
                                                maxLength={2}
                                                value={taxRate}
                                                onChange={(val) => this.setState({taxRate: val})}
                                            ><span className={cx('list-title')}>税率</span><span className={cx('amount')}>%</span></InputItem>
                                        </div>

                                        <Item extra={
                                            <ButtonGroup
                                                dataSource={freightGroup}
                                                defaultValue={freightFlag}
                                                onChange={(val) => this.setState({freightFlag: val})}
                                            />
                                        }><span className={cx('list-title')}>报价是否含运费</span></Item>

                                        <InputItem
                                            placeholder="其他说明，如：优惠信息/公司信息说明等"
                                            maxLength={50}
                                            value={quotationDesc}
                                            onChange={(val) => this.setState({quotationDesc: val})}
                                        ><span className={cx('list-title')}>补充说明</span></InputItem>

                                        <Item extra={
                                            <ImagePicker
                                                files={files}
                                                onChange={this.imgOnChange}
                                                onImageClick={(index, fs) => console.log(index, fs)}
                                                selectable={files.length < 4}
                                                multiple={false}
                                            />
                                        }><span className={cx('list-title')}>附件</span></Item>

                                        <span className={cx('list-desc')}>注：请登录中国制造网内贸站下载附件</span>
                                    </List>
                                </div>

                                <div className={cx('list-detail')}>
                                    <List className="my-list">
                                        <InputItem
                                            disabled
                                        ><span className={cx('list-title')}>联系信息</span></InputItem>

                                        <InputItem
                                            placeholder="输入公司信息（必填）"
                                            maxLength={80}
                                            value={comName}
                                            onChange={(val) => this.setState({comName: val})}
                                        ><span className={cx('list-title')}>公司名称</span></InputItem>

                                        <div className={cx('name-group')}>
                                            <InputItem
                                                placeholder="输入姓名（必填）"
                                                maxLength={25}
                                                value={userName}
                                                onChange={(val) => this.setState({userName: val})}
                                            >
                                                <span className={cx('list-title')}>您的姓名</span>
                                                <div style={{'position': 'absolute', 'right': 0, 'top': '10px', 'width': '110px'}}>
                                                    <ButtonGroup
                                                        btnStyle={{'padding': '0 2px', 'marginRight': '15px'}}
                                                        dataSource={sexGroup}
                                                        defaultValue={userGender}
                                                        onChange={(val) => this.setState({userGender: val})}
                                                    />
                                                </div>
                                            </InputItem>
                                        </div>

                                        <InputItem
                                            placeholder="输入联系电话（必填）"
                                            maxLength={24}
                                            value={userMobile}
                                            onChange={(val) => this.setState({userMobile: val})}
                                        ><span className={cx('list-title')}>联系电话</span></InputItem>

                                        <InputItem
                                            placeholder="输入电子邮箱（必填）"
                                            maxLength={50}
                                            value={userEmail}
                                            onChange={(val) => this.setState({userEmail: val})}
                                        ><span className={cx('list-title')}>电子邮箱</span></InputItem>
                                    </List>
                                </div>
                            </ScrollContainer>
                            <div className={cx("footer-ope")}>
                                <a onClick={this.submit}>马上报价</a>
                            </div>
                        </div>
                    )
                }

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    initQuotationDetail: state.getIn(['quotationAddReducer', 'initQuotationDetail']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInitQuotationDetail,
        asyncAddQuotation,
        asyncAppUploadPic
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Index)
);

