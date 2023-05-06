import React, { Component } from 'react';
import Header from 'components/layout/header';
import Icon from 'components/widgets/icon';
import {asyncFetchQuotationDetail} from '../actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
import Fold from 'components/widgets/fold';
import AttrItem from 'components/widgets/attrItem';
import ScrollContainer from 'components/widgets/scrollContainer';
import {fromJS} from 'immutable';
import {format} from "date-fns";
import {Spin} from "antd";
import {parse} from "url";
const cx = classNames.bind(styles);

const transformExpiredDay= (date)=>{
    const interval = date - new Date().getTime();
    let day = Math.ceil(interval / 24 / 60 / 60 / 1000);
    return day < 0 ? 0 : day;
};


export class QuotationDetail extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {match:{params}} = this.props;
        this.props.asyncFetchQuotationDetail(params.quotationId);
    }

    render() {

        const {quotationDetail} = this.props;
        const quotationDetailData = quotationDetail.getIn(['data', 'data']);
        const inquiryData = quotationDetailData?quotationDetailData.get('inquiry'):fromJS({});
        const quotationData = quotationDetailData?quotationDetailData.get('quotation'):fromJS({});
        const supplierData = quotationDetailData?quotationDetailData.get('supplier'):fromJS({});
        return(
            <div className={cx('container')}>
                <Header navStatus={'quotation'}>报价单详情</Header>
                {
                    quotationDetail.get('isFetching')?<Spin className="gb-data-loading"/>:(
                        <div className={cx('main')}>
                            <ScrollContainer className={cx("scroll-container")}>
                                <Fold title={inquiryData.get("infoTitle")}>
                                    <AttrItem label="公司名称">{inquiryData.get("comName")}</AttrItem>
                                    <AttrItem label="交货地">{inquiryData.get("deliveryAddressName")}</AttrItem>
                                    <AttrItem label="报价含税要求">
                                        {
                                            inquiryData.get("TaxFlag") == '1' ? `报价要求含税${inquiryData.get("TaxRate")}%，发票类别为${inquiryData.get("InvoiceType")}`:`报价 无需含税`
                                        }
                                    </AttrItem>
                                </Fold>
                                {
                                    quotationData.get("quotationProds") && quotationData.get("quotationProds").map((prod, index)=>{
                                        return (
                                            <Fold title={`报价信息${quotationData.get("quotationProds").size>1?index+1:''}`} key={prod.get("quotationProdId")}>
                                                <AttrItem label="物品名称">{prod.get("prodName")}</AttrItem>
                                                <AttrItem label="规格属性">{prod.get("inquiryProdItemSpec")}</AttrItem>
                                                <AttrItem label="采购量">{prod.get("purchaseQuantity")}{prod.get("purchaseUnitText")}</AttrItem>
                                                <AttrItem label="单价">{prod.get("unitPriceNew")}{prod.get("unitPriceText")}</AttrItem>
                                                <AttrItem label="价格有效期">{format(prod.get("effectiveTime"), 'YYYY-MM-DD')}</AttrItem>
                                                <AttrItem label="交货期">{prod.get("shipDate")}天</AttrItem>
                                            </Fold>
                                        )
                                    })
                                }

                                <Fold title="其他信息">
                                    <AttrItem label="报价是否含税">
                                        {quotationData.get("taxFlag") == '1'?`报价要求含税${quotationData.get("taxRate")}%`:`否`}
                                    </AttrItem>
                                    <AttrItem label="报价是否含运费">
                                        {quotationData.get("freightFlag") == "1" ?"是":"否"}
                                    </AttrItem>
                                    <AttrItem label="补充说明">
                                        {quotationData.get("quotationDesc")}
                                    </AttrItem>
                                    <AttrItem label="上传附件">
                                        {
                                            quotationData.get("attachment") && quotationData.get("attachment").size >0 && '请登录中国制造网内贸站下载附件'
                                        }
                                        {/*{quotationData.get("attachment") && quotationData.get("attachment").map((item, index)=>{
                                            return <span key={index}><img src={item.src}/></span>
                                        })}*/}
                                    </AttrItem>
                                </Fold>
                                {
                                    inquiryData.get("contactInfoFlag")!=='0' && (
                                        <Fold title="联系信息">
                                            <AttrItem label="公司信息">{supplierData.get("comName")}</AttrItem>
                                            <AttrItem label="您的姓名">{supplierData.get("userName")} {quotationData.get("gender") === "1"?"先生":"女士"}</AttrItem>
                                            <AttrItem label="您的电话">{supplierData.get("userMobile") || quotationData.get("comTel")}</AttrItem>
                                            <AttrItem label="电子邮箱">{supplierData.get("userEmail")}</AttrItem>
                                        </Fold>
                                    )
                                }
                            </ScrollContainer>

                            <div className={cx("footer-ope")}>
                                {/*
                                    1）	当前询价单的使用状态=启用
                                    2）	当前询价单的报名截止日期≥系统当前日期
                                    3）	当前询价单的人工核实状态≠暂停/删除
                                */}
                                <Link
                                    to={`${PROD_PATH}/miccn/quotation/add/${inquiryData.get("inquiryIdEnc")}`}
                                    disabled={!(inquiryData.get("effectiveTime")>= new Date().getTime()
                                        && inquiryData.get("businessFlag") === "1"
                                        && (inquiryData.get("confirmStatus") === "0" || inquiryData.get("confirmStatus") === "3"))}
                                >重新报价
                                </Link>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    quotationDetail: state.getIn(['quotationShowReducer', 'quotationDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchQuotationDetail
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(QuotationDetail)
);

