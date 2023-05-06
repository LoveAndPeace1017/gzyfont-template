import React, { Component } from 'react';
import { Col, Row, message } from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import SuggestSearch from  'components/business/suggestSearch';
import OrderBy from  'components/business/orderBy';
import {AddToCartBtn} from 'components/widgets/addCartBtn';
import {companyMenu as CompanyMenu} from 'pages/onlineOrder/customerIntroduce';
import {bindActionCreators} from "redux";
import {actions as onlineOrderAllProdActions} from "../index";
import {getUrlParamValue} from 'utils/urlParam';
import {Link} from "react-router-dom";
import ShoppingCart from 'components/business/shoppingCart';
import {toJS} from "immutable";
import {connect} from "react-redux";
import {actions as onlineOrderHomeActions} from "../../home";
const cx = classNames.bind(styles);


class onlineOrderAllProd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preview:false,
        }
    }

    orderToList = (data) =>{
        let params={};
        if(data.orderFlag == 'orderByTime'){
            //-1默认排序，0升序，1降序
            //判断当前排序状态
            if(data.orderState == -1){
                params.orderByTime=0;
            }else if(data.orderState == 0){
                params.orderByTime=1;
            }else if(data.orderState == 1){
                params.orderByTime=0;
            }
            params.orderByPrice = -1;
        }else{
            //-1默认排序，0升序，1降序
            //判断当前排序状态
            if(data.orderState == -1){
                params.orderByPrice=0;
            }else if(data.orderState == 0){
                params.orderByPrice=1;
            }else if(data.orderState == 1){
                params.orderByPrice=0;
            }
            params.orderByTime = -1;
        }
        let id;
        if('previewComId' in this.props){
            id = this.props.previewComId;
        }else{
            id = this.props.match.params.id
        }
        const key = getUrlParamValue('key');
        params.id = id;
        params.key = key;
        this.props.asyncFetchCartAllProdData(params);

    };

    componentDidMount() {
        let id;
        if('previewComId' in this.props){
            id = this.props.previewComId;
            this.setState({
                preview:true
            })
        }else{
            id = this.props.match.params.id
        }
        const key = getUrlParamValue('key');
        //初始化页面的排序规则
        const {orderByTime,orderByPrice}= this.props.allProdList && this.props.allProdList.toJS();
        this.props.asyncFetchCartAllProdData({orderByTime:orderByTime,orderByPrice:orderByPrice,id:id,key:key});
        //初始化购物车的数量
        //获取购物车数量
        this.props.asyncFetchCartCount();
    }

    //搜索功能
    onSearch = (value)=>{
        let companyId;
        if('previewComId' in this.props){
            companyId = this.props.previewComId;
        }else{
            companyId = this.props.match.params.id
        }
        let key = value;
        const {orderByTime,orderByPrice}= this.props.allProdList && this.props.allProdList.toJS();
        this.props.asyncFetchCartAllProdData({orderByTime:orderByTime,orderByPrice:orderByPrice,id:companyId,key:key});
    };

	render() {
	    const {orderByTime,orderByPrice}= this.props.allProdList && this.props.allProdList.toJS();
        const {allProdList,cartAmount} = this.props;
        let companyId;
        if('previewComId' in this.props){
            companyId = this.props.previewComId;
        }else{
            companyId = this.props.match.params.id
        }
        let dataSource = allProdList.getIn(['listData']);
        let companyInfor = dataSource ? dataSource.dataMallConfigBo:{};
        let count = dataSource?dataSource.count:0;
        const key = getUrlParamValue('key');
        console.log(key,'key');
        dataSource = dataSource ? dataSource.data : [];

        console.log(allProdList&&allProdList.toJS(),'allProdList');
		return(
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            title: 'previewComId' in this.props?'我的商城':'在线订货',
                            url: 'previewComId' in this.props?'/mall':'/onlineOrder'
                        },
                        {
                            title: 'previewComId' in this.props?'预览我的商城':'店铺首页'
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <ShoppingCart cartAmount={cartAmount}/>
                    </div>
                </Content.ContentHd>
                <Content.ContentBd>
					 <div className={cx("wild-hd")+" clearfix"}>
						 <div title={companyInfor.mallName} className={cx("customer-title")}>
                             {companyInfor.mallName}
						 </div>
						 <div className={cx("customer-information")}>
                               <span className={cx("gray")}>联系人：</span>{companyInfor.mallContacter} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							   <span className={cx("gray")}>联系电话：</span>{companyInfor.mallPhone} <br/>
                                共计<span className={cx("red")}>{count}</span>种在售商品
						 </div>
                         <div style={{marginTop:"20px"}} className={cx("float-right")}>
                             <div className={cx("list-search")}>
                                 <SuggestSearch
                                     placeholder={'物品编号/物品名称/商品条码/规格型号'}
                                     onSearch={this.onSearch}
                                     maxLength={30}
                                     url={`/online/order/search/tips`}
                                     params={{mallUserId: companyId}}
                                     defaultValue={key}
                                 />
                             </div>
                         </div>
					 </div>

                    <CompanyMenu data={[
                        {
                            title: '首页',
                            url: 'previewComId' in this.props?'/mall/preview':'/onlineOrder/'+companyId+'/customerIndex',
                            isCurrent: false
                        },
                        {
                            title: '所有商品',
                            url: 'previewComId' in this.props?'/mall/preview/product':'/onlineOrder/customer/prodAll/'+companyId,
                            isCurrent: true
                        },
                        {
                            title: '公司介绍',
                            url: 'previewComId' in this.props?'/mall/preview/introduce':'/onlineOrder/customer/introduce/'+companyId,
                            isCurrent: false
                        },
                        {
                            title: '商城小程序',
                            url: '#',
                            isCurrent: false,
                            imgUrl: `${companyInfor.wxAppletImgUrl}`
                        },
                    ]}/>

                    <div className={cx("new-product")}>
                        <OrderBy orderToList={this.orderToList} data={{title:'按上架时间排序',orderState:orderByTime,orderFlag:'orderByTime'}}/>
                        <OrderBy orderToList={this.orderToList} data={{title:'按价格排序',orderState:orderByPrice,orderFlag:'orderByPrice'}}/>
                    </div>

                    <Row className={cx("customer-prod")}>
                        {
                            (dataSource.length == 0)
                                ? (
                                    <div style={{padding:"100px",textAlign:"center"}}>
                                        店主很懒，暂时没有可销售的商品 如果需要，您可以查看上方联系方式联系公司哦
                                    </div>
                                )
                                : dataSource.map((item, index) => {
                                    return (
                                        <Col key={index} className={cx("customer-prod-col")} span={4}>
                                            <div className={cx("prod-detail")}>
                                                <div className={cx("prod-detail-inner")}>
                                                    <Link to={`/onlineOrder/cartDetail/${companyId}/${item.code}`}>
                                                    <div className={cx("img-box")}>
                                                      <img src={item.images&&item.images.length>0?item.images[0].thumbnailUri:'/images/server/noPic.jpg'}/>
                                                    </div>
                                                    <div className={cx("prod-infor")}>
                                                        <p>
                                                            {item.name}
                                                        </p>
                                                        <p className={cx("red")}>
                                                            ￥ {item.salePrice}
                                                        </p>
                                                    </div>
                                                    </Link>
                                                    <AddToCartBtn prod={item} supplierUserIdEnc={companyId}
                                                                  selfClassName={cx("addCar")} preview={this.state.preview}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })
                        }

					 </Row>
				</Content.ContentBd>
			</React.Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
    allProdList: state.getIn(['onlineOrderAllProdList', 'onlineOrderAllProdList']),
    cartAmount: state.getIn(['onlineOrderCartListHomeIndex', 'onlineOrderHomeListOrderList','cartAmount'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartAllProdData: onlineOrderAllProdActions.asyncFetchCartAllProdData,
        asyncFetchCartCount: onlineOrderHomeActions.asyncFetchCartCount,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(onlineOrderAllProd);

