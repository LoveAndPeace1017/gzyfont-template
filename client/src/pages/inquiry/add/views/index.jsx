import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Modal, Row, Input, message, Spin, Form} from 'antd';
import {withRouter} from "react-router-dom";

import Crumb from 'components/business/crumb';

import {newAddForm as AddForm, actions as addFormActions} from 'components/layout/addForm';
import Content from 'components/layout/content';
import {addPage} from  'components/layout/listPage';
import {asyncFetchPreData, asyncAddInquiry, asyncFetchInquiryById, emptyDetailData} from '../actions';
import {actions as customerShowActions} from 'pages/customer/add';

import BaseInfo from './baseInfo';
import ProdList from './prodList';
import OtherInfo from './otherInfo';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import 'url-search-params-polyfill';

const cx = classNames.bind(styles);

class InquiryAddForm extends addPage {
    formRef = React.createRef();

    getRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };

    componentDidMount() {
        this.props.asyncFetchPreData(data=>{
            let mainAddress = data.mainAddress;
            let inquiryInfoData = data.data;
            if(mainAddress){
                this.formRef.current.setFieldsValue({
                    mainAddress: mainAddress && [mainAddress.receiverProvinceCode, mainAddress.receiverCityCode]
                })
            }
            if(inquiryInfoData){
                this.formRef.current.setFieldsValue({
                    comName: inquiryInfoData.ourName,
                    userName: inquiryInfoData.ourContacterName,
                    comTel: inquiryInfoData.ourTelNo
                })
            }


            this.props.setInitFinished();
        });

    }

    componentWillUnmount() {
        this.props.emptyDetailData();
    }

    handleSubmit = (values) => {
        //处理物品信息
        const products = values.prod.filter(item=>{
            if(item){
                item.catCode = item.catCode?item.catCode.key:null;
                return item && Object.entries(item).some(v => {
                    return (v[0] === 'prodName' && v[1] && v[1] !== ''); //物品名称必须要有值，否则这行物品数据会被过滤掉
                });
            }
        });

        if(products.length > 10){
            Modal.error({
                title: intl.get("inquiry.add.index.warningTip"),
                content: intl.get("inquiry.add.index.errorMsg1")
            });
            return false;
        }

        //处理交货地
        let deliveryProvince = '';
        let deliveryCity = '';
        if(values.deliveryAddress){
            const deliveryAddressArr = values.deliveryAddress;
            deliveryProvince = deliveryAddressArr[0];
            deliveryCity = deliveryAddressArr[1];
        }

        //附件
        const fileList = this.otherInfoRef.state.fileList;
        const tempAttIds = [];
        fileList.length>0 && fileList.forEach(item=>{
            if(item.status === 'done' && item.response){
                tempAttIds.push(item.response)
            }
        });

        //供应商
        const suppliersList = this.otherInfoRef.state.suppliersList;
        const suppliersNameArr = [];
        const suppliersEmailArr = [];
        suppliersList.length>0 && suppliersList.forEach((item)=>{
            suppliersNameArr.push(item.name);
            suppliersEmailArr.push(item.email);
        });

        //备注
        const selfPurchaseCond = {
            [`${intl.get("inquiry.add.index.remarks")}`]: values.remarks
        };

        this.props.asyncAddInquiry({
            ...values,
            products,
            deliveryProvince,
            deliveryCity,
            tempAttIds,
            suppliersNameList: suppliersNameArr.join(','),
            suppliersEmailList: suppliersEmailArr.join(','),
            selfPurchaseCond
        }, (res) => {

            if (res.data.retCode === '0') {
                if(res.data.data.errors){
                    Modal.error({
                        title: intl.get("inquiry.add.index.warningTip"),
                        content: Object.values(res.data.data.errors)[0]
                    })
                }else if(res.data.data.businessError){
                    Modal.error({
                        title: intl.get("inquiry.add.index.warningTip"),
                        content: res.data.data.businessError
                    })
                }else{
                    let displayId = res.data.data.inquiryId;
                    message.success(intl.get("inquiry.add.index.operateSuccessMessage"));
                    this.props.emptyFieldChange();
                    displayId && this.props.history.push(`/inquiry/show/${displayId}`);
                }
            }
            else {
                alert(res.data.retMsg);
            }
        })

    };

    render() {

        const {inquiryInfo, preData} = this.props;

        const inquiryInfoData = preData && preData.getIn(['data', 'data']);

        const mainAddress = preData && preData.getIn(['data', 'mainAddress']);

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/inquiry/',
                            title: intl.get("inquiry.add.index.inquiry")
                        },
                        {
                            title: intl.get("inquiry.add.index.distributeInquiry")
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || inquiryInfo.get("isFetching")}
                    >
                        <AddForm
                            {...this.props}
                            formRef={this.formRef}
                            onSubmit={this.handleSubmit}
                            confirmButtonText={intl.get("inquiry.add.index.distribute")}
                            loading={this.props.addInquiry.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <AddForm.BaseInfo>
                                            <BaseInfo
                                                formRef={this.formRef}
                                                {...this.props}/>
                                        </AddForm.BaseInfo>
                                        <AddForm.ProdList>
                                            <ProdList
                                                formRef={this.formRef}
                                                {...this.props}
                                            />
                                        </AddForm.ProdList>
                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        getRef={this.getRef}
                                                        mainAddress={mainAddress}
                                                        inquiryInfoData={inquiryInfoData}
                                            />
                                        </AddForm.OtherInfo>
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


const mapStateToProps = (state) => ({
    addInquiry: state.getIn(['inquiryAdd', 'addInquiry']),
    inquiryInfo: state.getIn(['inquiryAdd', 'inquiryInfo']),
    preData:  state.getIn(['inquiryAdd', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddInquiry,
        asyncFetchInquiryById,
        emptyDetailData,
        asyncShowCustomer: customerShowActions.asyncShowCustomer,
        setInitFinished: addFormActions.setInitFinished
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        AddForm.create(InquiryAddForm)
    )
)

