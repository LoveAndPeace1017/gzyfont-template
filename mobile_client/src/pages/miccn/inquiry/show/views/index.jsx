import React, { Component } from 'react';
import Header from 'components/layout/header';
import Icon from 'components/widgets/icon';
import {asyncFetchInquiryDetail} from '../actions';
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


export class InquiryDetail extends Component {
    constructor(props) {
        super(props);
    }

    contactInfo = (inquiryData) => {
        //ContactInfoFlag：0-不公开   1-公开  2-报价后公开          MiccnQuotationNum：为真---当前账号已对该询价单报价
        let contactInfo = <React.Fragment>
            <AttrItem label="公司名称">{inquiryData.get("ComName")}</AttrItem>
            <AttrItem label="联系人">{inquiryData.get("UserName")}</AttrItem>
            <AttrItem label="联系电话">{inquiryData.get("Mobile") || inquiryData.get("ComTel")}</AttrItem>
            <AttrItem label="邮箱">{inquiryData.get("Email")}</AttrItem>
        </React.Fragment>;
        if (inquiryData.get("ContactInfoFlag") === '0') {
            contactInfo = <div className={cx("no-data")}>对方未公开联系信息</div>;
        } else if (inquiryData.get("ContactInfoFlag") === '2' && !inquiryData.get("MiccnQuotationNum")) {
            contactInfo = <div className={cx("no-data")}>报价后可见联系信息</div>;
        }
        return contactInfo;
    };


    generateBusinessMode = (BusinessMode)=>{
        // 经营模式
        const BUSINESS_MODE ={
            1: '生产制造',
            2: '贸易批发',
            3: '商业服务',
            4: '其他组织'
        };
        let businessModeName = '';
        if (BusinessMode) {
            const businessModes = BusinessMode.split(",");
            businessModeName = businessModes.map(item=>{
                return BUSINESS_MODE[item];
            }).join(',');
        }
        return businessModeName;
    };

    generateCertRequireName = (CertRequire, FactoryCertText, OtherCertText)=>{
        const REQUIRE_NAME_MAP = {
            1: '工商营业执照',
            2: '税务登记证',
            3: '组织结构代码证',
            4: '经营许可证',
            5: '产品认证报告'
        };
        let certRequireName = '';
        if (CertRequire) {
            const certRequires = CertRequire.split(",");
            for (let certRequire of certRequires) {
                if (certRequire != 6 && certRequire != 7) {
                    certRequireName += REQUIRE_NAME_MAP[certRequire] + "，"
                }
            }
            certRequireName = certRequireName.substr(0, certRequireName.length - 1)
        }
        if (FactoryCertText) {
            certRequireName += "，" + FactoryCertText
        }
        if (OtherCertText) {
            certRequireName += "，" + OtherCertText
        }
        return certRequireName;
    };

    handleShare=()=>{
        const {match:{url}} = this.props;
        var restUrl =  url + (url.indexOf('?')===-1?'?':'&') + 'pageType=share';

        const inquiryDetailData = this.props.inquiryDetail.getIn(['data', 'data']);
        const inquiryData = inquiryDetailData?inquiryDetailData:fromJS({});
        let infoTitle = '询价单:' + inquiryData.get("InfoTitle");

        // console.log(`${PROD_PATH}`, restUrl, 'restUrl');
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "shareWx", url: `https://erp.abiz.com${restUrl}`, title: infoTitle});
        }else if(window.nativeHandler) {
            window.nativeHandler.popBack && window.nativeHandler.shareWx(`https://erp.abiz.com${restUrl}`,infoTitle);
        }
    };

    componentDidMount() {
        const {match:{params}} = this.props;
        this.props.asyncFetchInquiryDetail(params.logonUserName, params.inquiryId);
    }

    render() {

        const {inquiryDetail, location:{search}} = this.props;
        const searchQuery = parse(search, true);
        const pageType = searchQuery.query.pageType;
        const inquiryDetailData = inquiryDetail.getIn(['data', 'data']);
        const inquiryData = inquiryDetailData?inquiryDetailData:fromJS({});
        return(
            <div className={cx('container')}>
                {!pageType && <Header navStatus={'inquiry'} rightContent={<span onClick={this.handleShare}><Icon type="icon-share"/></span>}>询价单详情</Header>}
                {
                    inquiryDetail.get('isFetching')?<Spin className="gb-data-loading"/>:(
                        <div className={cx('main')}>
                            <ScrollContainer className={cx("scroll-container")}>
                                <Fold title={inquiryData.get("InfoTitle")} subTitle={inquiryData.get("ConfirmStatus") === '3'?<span className={cx("icon-verify")}>核</span>:null}>
                                    <div className={cx("inq-detail")}>
                                        <p className={cx("inq-detail-deadline")}>距离报价结束还剩 <span>{transformExpiredDay(inquiryData.get("EffectiveTime")) || null}</span> 天</p>
                                        <p className={cx("inq-detail-com")}>{inquiryData.get("ComName")}</p>
                                        <p className={cx("inq-detail-date")}>截止日期：{format(inquiryData.get("EffectiveTime"), 'YYYY-MM-DD')}</p>
                                        <div className={cx("quotation-info")}>
                                            已有 {inquiryData.get("QuotationNum")} 人报价
                                        </div>
                                    </div>
                                </Fold>
                                {
                                    inquiryData.get("products") && inquiryData.get("products").map((prod, index)=>{
                                        return (
                                            <Fold title={`询价物品${inquiryData.get("products").size>1?index+1:''}`} key={prod.get("EncodeInquiryProdId")}>
                                                <AttrItem label="物品名称">{prod.get("ProdName")}</AttrItem>
                                                <AttrItem label="采购量">{prod.get("PurchaseQuantity")}{prod.get("PurchaseUnitText")}</AttrItem>
                                                <AttrItem label="规格属性">{prod.get("ItemSpec")}</AttrItem>
                                            </Fold>
                                        )
                                    })
                                }

                                <Fold title="采购要求">
                                    <AttrItem label="报价含税要求">
                                        {
                                            inquiryData.get("TaxFlag") == '1' ? `报价要求含税${inquiryData.get("TaxRate")}%，发票类别为${inquiryData.get("InvoiceType")}`:`报价 无需含税`
                                        }
                                    </AttrItem>
                                    <AttrItem
                                        label="交货地"
                                        isHidden={!(inquiryData.get("DeliveryProvince") && inquiryData.get("DeliveryCity"))}
                                    >
                                        {(!inquiryData.get("DeliveryProvince") || inquiryData.get("DeliveryProvince") == '&nbsp;' || inquiryData.get("DeliveryProvince") == '&nbsp') ? '' : inquiryData.get("DeliveryProvince")}
                                        {(!inquiryData.get("DeliveryCity") || inquiryData.get("DeliveryCity") == '&nbsp;' ||inquiryData.get("DeliveryCity") == '&nbsp') ?  '' : inquiryData.get("DeliveryCity")}
                                    </AttrItem>
                                    <AttrItem label="所在地区" isHidden={!inquiryData.get("ProviderAddress")}>
                                        {inquiryData.get("ProviderAddress")}
                                    </AttrItem>
                                    <AttrItem label="经营模式" isHidden={!inquiryData.get("BusinessMode")}>
                                        {this.generateBusinessMode(inquiryData.get("BusinessMode"))}
                                    </AttrItem>
                                    <AttrItem label="注册资本" isHidden={!inquiryData.get("RegistFund")}>
                                        {inquiryData.get("RegistFund")} 万元以上
                                    </AttrItem>
                                    <AttrItem label="证照要求" isHidden={!inquiryData.get("CertRequire")}>
                                        {this.generateCertRequireName(inquiryData.get("CertRequire"), inquiryData.get("FactoryCertText"), inquiryData.get("OtherCertText"))}
                                    </AttrItem>
                                    <AttrItem label="补充说明" isHidden={!inquiryData.get("Description")}>
                                        {inquiryData.get("Description")}
                                    </AttrItem>
                                </Fold>
                                <Fold title="联系信息">
                                    {this.contactInfo(inquiryData)}
                                </Fold>
                            </ScrollContainer>
                            <div className={cx("footer-ope")}>
                                {
                                    pageType === 'share' ? <a href="https://erp.abiz.com/register/invite?source=005&trench=7">马上报价</a> :
                                        <Link to={`${PROD_PATH}/miccn/quotation/add/${this.props.match.params.inquiryId}`}>马上报价</Link>
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    inquiryDetail: state.getIn(['inquiryShowReducer', 'inquiryDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInquiryDetail
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(InquiryDetail)
);

