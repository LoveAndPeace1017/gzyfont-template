import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Modal, Row, Col, Input, message, Spin, Select, Alert} from 'antd';
import {withRouter} from "react-router-dom";
import intl from 'react-intl-universal';
import Crumb from 'components/business/crumb';
import Fold from 'components/business/fold';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import Tooltip from 'components/widgets/tooltip';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import {addPage} from  'components/layout/listPage';
import MultiGoods from 'components/business/multiGoods';
import MultiUnit from 'components/business/multiUnit';
import {asyncAddGoods, asyncFetchPreData, asyncFetchGoodsById, asyncFetchCheckName} from '../actions';
import {actions as customerLvActions} from 'pages/auxiliary/customerLv';
import {actions as mallHomeActions} from 'pages/mall/home'
import formMap from '../dependencies/initFormMap';
import NewProdDesc from '../../add/views/NewProdDesc';
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);
import {getUrlParamValue} from 'utils/urlParam';
import filterImgXss from 'utils/filterImgXss';

const mapStateToProps = (state) => ({
    addGoods: state.getIn(['multiGoodsAdd', 'addGoods']),
    goodsInfo: state.getIn(['multiGoodsAdd', 'goodsInfo']),
    preData: state.getIn(['multiGoodsAdd', 'preData']),
    customerLvList: state.getIn(['auxiliaryCustomerLv', 'customerLvList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddGoods,
        asyncFetchPreData,
        asyncFetchGoodsById,
        asyncFetchCheckName,
        setInitFinished: addFormActions.setInitFinished,
        asyncFetchCustomerLvList: customerLvActions.asyncFetchCustomerLvList,
        asyncFetchMallPreData: mallHomeActions.asyncFetchPreData
    }, dispatch)
};


@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@formCreate
export default class MultiGoodsAdd extends addPage {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            showTip: false,
            unitFlag: 0
        }
    }

    changeUnitFn = (unitFlag) =>{
        this.setState({
            unitFlag
        });
    };

    getRef = (prodDescRef) => {
        this.prodDescRef = prodDescRef
    };

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };

    // 给对象排序
    sortObject = (obj) => {
        let out = {};
        let array = Object.keys(obj).sort();
        array.forEach(item => {
            out[item] = obj[item];
        });
        return out
    };

    handleSubmit = (values) => {
        //处理产品描述
        let prodDesc = this.prodDescRef.state.content||'';
        prodDesc = filterImgXss(prodDesc);
        const prodImg = prodDesc.match(/<img/g);
        const imgCount = prodImg && prodImg.length;
        if(imgCount>10){
            Modal.error({
                title: intl.get('common.confirm.title'),
                content: intl.get('common.confirm.content2')
            });
            return false;
        }

        //处理附件信息
        let fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);

        //物品类目
        let categoryCode;
        let categoryName;
        if(values.category.value !== '' && values.category.label !== ''){
            categoryCode = values.category.value;
            categoryName = values.category.label;
        }

        let mulSpecList = values.mulSpecList;
        let dataSpecList = values.dataSpecList;
        if(mulSpecList){
            for(let i=0;i<mulSpecList.length;i++){
                //默认是有3种规格
                let specData = {};
                if(!mulSpecList[i].disabled){
                    for(let j=0;j<=2;j++){
                        if(mulSpecList[i]["spec"+(j+1)]){
                            let specName = dataSpecList[j].specName;
                            specData[specName] = mulSpecList[i]["spec"+(j+1)]
                        }
                    }
                    mulSpecList[i].specData = JSON.stringify(this.sortObject(specData));
                    delete mulSpecList[i].imageUrl;
                    mulSpecList[i].images = mulSpecList[i].ffsKey ? [{ffsKey: mulSpecList[i].ffsKey}] : null;
                }else{
                    mulSpecList.splice(i, 1);
                    i--;
                }
            }
        }
        values.mulSpecList = mulSpecList;


        if(mulSpecList && mulSpecList.length>200){
            message.error("最多不能新增超过200种规格类型的物品！");
            return false;
        }

        const lvDataSource =  this.getCustomerLvDataSource() || [];
        values.customerLevelPrices = lvDataSource;

        console.log(values,'values');

        this.props.asyncAddGoods({
            ...values,
            categoryCode,
            categoryName,
            prodDesc,
            fileIds
        }, (res) => {
            if (res.data.retCode === '0') {
                message.success(intl.get('common.confirm.success'));
                let url = `/goods/`;
                this.props.emptyFieldChange();
                this.props.history.push(url);
            }else{
                message.error(res.data.retMsg||res.data.retValidationMsg.msg[0].msg);
            }
        })

    };

    initForm = (goods)=>{
        goods = this.initFormData(goods);
        this.initFormField(formMap, goods);
    };

    /** 初始化表单数据 */
    initFormData = (goods) => {
        //初始化附件信息
        if(goods.fileInfo){
            this.otherInfoRef.initFileList(goods.fileInfo)
        }
        return goods;
    };

    closeModals = () =>{
        this.setState({showTip:false})
    };

    componentDidMount() {
        const {match} = this.props;
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;

        if(!id){
            this.props.asyncFetchCustomerLvList();
        }

        this.props.asyncFetchPreData(data=>{
           if(data.retCode === '0'){
               if(data.tags){
                   this.otherInfoRef.createCustomFields(data.tags);
                   this.initForm({});
               }
           }
           this.props.setInitFinished();
        });
    }

    getCustomerLvDataSource = () => {
        const {goodsInfo, match, customerLvList} = this.props;
        let customerLevel;

        const customerLvListData = customerLvList && customerLvList.getIn(['data']);
        let id = match.params.id || match.params.copyId;
        if(id){
            customerLevel = goodsInfo && goodsInfo.getIn(['data', 'priceList']);
            return customerLevel && customerLevel.size>0 && customerLevel.map((item, index) => {
                return {
                    key: item.get('recId') || index,
                    name: item.get('name'),
                    percentage:item.get('percentage'),
                    salePrice:item.get('salePrice'),
                    id: item.get('id'),
                    recId: item.get('recId') || index
                }
            }).toJS();
        } else{
            if(customerLvListData && customerLvListData.size>0 && (!customerLvListData.get('retCode'))){
                return customerLvListData.map((item) => {
                    return {
                        key: item.get('recId'),
                        name: item.get('name'),
                        percentage:item.get('percentage'),
                        salePrice:item.get('salePrice'),
                        id: item.get('id'),
                        recId: item.get('recId')
                    }
                }).toJS();
            }
        }
    };

    render() {

        const {goodsInfo, match, preData} = this.props;

        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;

        const goodsInfoData = goodsInfo && goodsInfo.getIn(['data', 'data']);
        const picList = goodsInfo && goodsInfo.get('picList');
        const code = preData.getIn(['data', 'code']);

        console.log(picList&&picList.toJS(),'picList');

        //初始化页面数据
        let baseInfo;
        let customerLevel;
        let prodDesc;
        let dataProductSyncBo, micPid, isCnGoods;
        if(id){
            //基础信息
            baseInfo = goodsInfoData;
            //级别信息
            customerLevel = goodsInfo && goodsInfo.getIn(['data', 'priceList']);

            //内贸站物品部分字段为只读
            dataProductSyncBo = goodsInfo && goodsInfo.getIn(['data', 'dataProductSyncBo']);

            prodDesc = dataProductSyncBo && dataProductSyncBo.get('prodDesc') || '';

            micPid = dataProductSyncBo && dataProductSyncBo.get('micPid');

            isCnGoods = !!micPid
        }

        const lvDataSource =  this.getCustomerLvDataSource() || [];

        return (
            <React.Fragment>
                <div className="content-hd">
                    {
                        <Crumb data={[
                            {
                                url: '/goods/',
                                title: intl.get("goods.add.crumb5")
                            },
                            {
                                title: this.props.match.params.id ? "修改多规格物品" : "新建多规格物品"
                            }
                        ]}/>
                    }

                </div>
                <Spin
                    spinning={goodsInfo.get("isFetching") || this.props.preData.get('isFetching')}
                >
                    <AddForm
                        {...this.props}
                        formRef={this.formRef}
                        onSubmit={this.handleSubmit}
                        loading={this.props.addGoods.get('isFetching')}
                        confirmButtonRender={confirmButton=>{
                            if(this.props.location.state && (this.props.location.state.fromFourStep || this.props.location.state.fromExplore)){
                                return (
                                    <Tooltip
                                        visible={true}
                                        type="info"
                                        placement="right"
                                        title={intl.get("goods.add.tip3")}
                                    >
                                        {confirmButton}
                                    </Tooltip>
                                )
                            }else{
                                return confirmButton
                            }
                        }}
                    >
                        {
                            this.formRef.current && (
                                <div className="content-bd">
                                    <Fold
                                        title={intl.get("goods.add.base")}
                                    >
                                        <AddForm.BaseInfo>
                                            <BaseInfo {...this.props} changeUnitFn={this.changeUnitFn} formRef={this.formRef} initBaseInfo={baseInfo} code={code} isCnGoods={isCnGoods} customerLvListDataSource={lvDataSource}/>
                                        </AddForm.BaseInfo>

                                    </Fold>

                                    {
                                        this.state.unitFlag === 1 ? (
                                        <Fold title={"多单位"}>
                                            <MultiUnit type={"new"} formRef={this.formRef}/>
                                        </Fold>) : null
                                    }


                                    <Fold
                                        title="规格型号"
                                    >
                                        <AddForm.ProdList>
                                            <MultiGoods formRef={this.formRef}/>
                                        </AddForm.ProdList>
                                    </Fold>

                                    <Fold
                                        title={intl.get("goods.add.title3")}
                                    >
                                        <Row>
                                            <Col span={24}>
                                                <NewProdDesc getRef={this.getRef} prodDesc={filterImgXss(prodDesc)}/>
                                            </Col>
                                        </Row>
                                    </Fold>
                                    <Fold
                                        title={intl.get("goods.add.title4")}
                                    >
                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props} getRef={this.getOtherInfoRef} formRef={this.formRef}  initBaseInfo={baseInfo}/>
                                        </AddForm.OtherInfo>
                                    </Fold>
                                </div>
                            )
                        }

                    </AddForm>
                </Spin>
                <LimitOnlineTip onClose={()=>this.closeModals()} show={this.state.showTip}/>
            </React.Fragment>
        );
    }
}



