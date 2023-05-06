import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Modal, Row, Col, Input, message, Spin, Select, Alert} from 'antd';
import {withRouter} from "react-router-dom";
import intl from 'react-intl-universal';
import Crumb from 'components/business/crumb';
import Fold from 'components/business/fold';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import Tip from 'components/widgets/tip';
import Tooltip from 'components/widgets/tooltip';
import MultiUnit from 'components/business/multiUnit';
import AddForm, {actions as addFormActions}  from 'components/layout/addForm'
import {asyncAddGoods, asyncFetchPreData, asyncFetchGoodsById, asyncFetchCheckName} from '../actions';
import {actions as customerLvActions} from 'pages/auxiliary/customerLv';
import {actions as mallHomeActions} from 'pages/mall/home'
import NewProdDesc from './NewProdDesc';
import BaseInfo from './baseInfo';
import Price from './price';
import ProdPic from './prodPic';

import OtherInfo from './otherInfo';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);
import {getUrlParamValue} from 'utils/urlParam';
import filterImgXss from 'utils/filterImgXss';

class SupplierAddForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            showTip: false,
        }
    }

    getRef = (prodDescRef) => {
        this.prodDescRef = prodDescRef
    };

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //处理客户级别
                const customerLevelPrices = values.customerLevelPrices && values.customerLevelPrices.filter(item=>{
                    return item;
                });

                //处理下多单位的数据
                let otherUnits = values.otherUnits;
                if(otherUnits){
                    let filteOtherUnits = otherUnits.filter(item => !!item);
                    if(this.props.match.params.copyId){
                        filteOtherUnits = filteOtherUnits.map(item => {
                            let {recId, ...out} = item;
                            return out;
                        })
                    }
                    values.otherUnits = filteOtherUnits;
                }
                //进入页面预先给的code
                const code = this.props.preData.getIn(['data', 'code']);
                //处理图片数据
                const picList = this.props.goodsInfo.get('picList');

                const imagesList = picList.map(item=>{
                   if(item.get('status') && item.get('status') === "done"){
                       return{
                           ffsKey: item.get('ffsKey'),
                           id: item.get('id'),
                           productCode:code,
                           thumbnailUri: item.get('thumbnailUri'),
                           uri: item.get('url')
                       }
                   }
                }).toJS();
                const images = imagesList.filter(item=>{
                    return item && (item.ffsKey || item.thumbnailUri || item.uri)
                });

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
                // 从商城添加导入的物品默认上架
                values.source = getUrlParamValue('source');
                this.props.asyncAddGoods(values.code, {
                    ...values,
                    categoryCode,
                    categoryName,
                    images,
                    customerLevelPrices,
                    prodDesc,
                    fileIds
                }, (res) => {
                    if (res.data.retCode === '0') {
                        let displayId = res.data.data;
                        message.success(intl.get('common.confirm.success'));
                        this.props.emptyFieldChange();
                        //如果从引导过来则进入商城物品列表页
                        if(this.props.location.state && (this.props.location.state.fromFourStep || this.props.location.state.fromExplore)){
                            this.props.asyncFetchMallPreData(); //引导需要获取探索我的商城任务完成状态
                            this.props.history.push(`/mall/goods/`, {...this.props.location.state, fromGuideAdd: true});
                        }else{
                            let url = `/goods/show/${displayId}`;
                            if(getUrlParamValue('source')==='mall'){
                                url = `/goods/show/${displayId}?source=mall&current=/mall/goods/`;
                            }
                            displayId && this.props.history.push(url);
                        }

                    }
                    else if(res.data.retCode === '2002'){ //物品编号已存在
                        Modal.error({
                            title: intl.get('common.confirm.title'),
                            content: res.data.retValidationMsg.msg[0].msg
                        })
                    }else if(res.data.retCode === '2001'){ //物品编号已存在
                        Modal.error({
                            title: intl.get('common.confirm.title'),
                            content: res.data.retMsg
                        })
                    }  else {
                        if(res.data.retCode == undefined && res.data.status === false){
                            this.setState({showTip:true})
                        }else{
                            alert(res.data.retMsg)
                        }
                    }
                })
            } else {
                message.error('存在信息不符合规则，请修改！');
            }
        });
    };

    initForm = (goods)=>{
        //初始化附件信息
        if(goods.fileInfo){
            this.otherInfoRef.initFileList(goods.fileInfo)
        }
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
                   if(data.tags){
                       this.otherInfoRef.createCustomFields(data.tags);
                   }
                   this.initForm({});
               }
           }
            if (id) {
                this.props.asyncFetchGoodsById(id, res=>{
                    const data = res.toJS();
                    let goods = data.data||{};
                    this.initForm(goods);
                    this.props.setInitFinished();
                })
            }else{
                this.props.setInitFinished();
            }
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

        const {form: {getFieldValue},goodsInfo, match, preData} = this.props;

        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;

        const goodsInfoData = goodsInfo && goodsInfo.getIn(['data', 'data']);
        const picList = goodsInfo && goodsInfo.get('picList');
        const code = preData.getIn(['data', 'code']);

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
                        getUrlParamValue('source')==='mall'?<Crumb data={[
                            {
                                url: '/mall/',
                                title: intl.get("goods.add.crumb1")
                            },
                            {
                                url: '/mall/goods',
                                title: intl.get("goods.add.crumb2")
                            },
                            {
                                title: this.props.match.params.id?intl.get("goods.add.crumb3"):intl.get("goods.add.crumb4")
                            }
                        ]}/>:<Crumb data={[
                            {
                                url: '/goods/',
                                title: intl.get("goods.add.crumb5")
                            },
                            {
                                title: this.props.match.params.id?intl.get("goods.add.crumb6"):intl.get("goods.add.crumb7")
                            }
                        ]}/>
                    }

                </div>
                <Spin
                    spinning={goodsInfo.get("isFetching") || this.props.preData.get('isFetching')}
                >
                    <AddForm
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
                        <div className="content-bd">
                            <Fold
                                title={intl.get("goods.add.base")}
                            >
                                <div>
                                    <BaseInfo {...this.props} source={getUrlParamValue('source')} initBaseInfo={baseInfo} code={code} isCnGoods={isCnGoods} customerLvListDataSource={lvDataSource}/>
                                </div>

                            </Fold>

                            {
                                getFieldValue('unitFlag') == 1?(
                                    <Fold title={"多单位"}>
                                        <MultiUnit {...this.props} type={"old"} initBaseInfo={baseInfo} />
                                    </Fold>
                                ):null
                            }

                            <Fold
                                title={intl.get("goods.add.title")}
                                subTitle={intl.get("goods.add.tip4")}
                            >
                                <Price  {...this.props}  initBaseInfo={baseInfo} initCustomerLevel={customerLevel} isCnGoods={isCnGoods} customerLvListDataSource={lvDataSource}/>
                            </Fold>
                            <Fold
                                title={intl.get("goods.add.title2")}
                                subTitle={
                                    <Tip
                                        type="info"
                                    >
                                        {intl.get("goods.add.tip5")}
                                    </Tip>
                                }
                            >
                                <Row>
                                    <Col span={24}>
                                        <ProdPic {...this.props} picList={picList} isCnGoods={isCnGoods}/>
                                    </Col>
                                </Row>


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
                                <OtherInfo  {...this.props} getRef={this.getOtherInfoRef}  initBaseInfo={baseInfo}/>
                            </Fold>
                        </div>
                    </AddForm>
                </Spin>
                <LimitOnlineTip onClose={()=>this.closeModals()} show={this.state.showTip}/>
            </React.Fragment>
        );
    }
}


const mapStateToProps = (state) => ({
    addGoods: state.getIn(['goodsAdd', 'addGoods']),
    goodsInfo: state.getIn(['goodsAdd', 'goodsInfo']),
    preData: state.getIn(['goodsAdd', 'preData']),
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        AddForm.create(SupplierAddForm)
    )
)

