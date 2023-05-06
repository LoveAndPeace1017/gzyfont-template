import React, { Component } from 'react';
import { Col, Row, message } from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import SuggestSearch from  'components/business/suggestSearch';
import {companyMenu as CompanyMenu} from 'pages/onlineOrder/customerIntroduce';
import {AddToCartBtn} from 'components/widgets/addCartBtn';
import ShoppingCart from 'components/business/shoppingCart';
import {bindActionCreators} from "redux";
import {actions as onlineOrderHomeIndexActions} from "../index";
import {actions as onlineOrderHomeActions} from "../../home/index"

import {toJS} from "immutable";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
const cx = classNames.bind(styles);


class onlineOrderIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preview:false,
        }
    }
    componentDidMount() {
        let id;
        if('previewComId' in this.props){
            id = this.props.previewComId;
            this.setState({
                preview:true,
            })
        }else{
            id = this.props.match.params.id
        }
        this.props.asyncFetchHomeIndexData({id:id});
        //获取购物车数量
        this.props.asyncFetchCartCount();
    }

    //搜索功能
    onSearch = (value)=>{
        console.log(value);
        let companyId;
        if('previewComId' in this.props){
            companyId = this.props.previewComId;
        }else{
            companyId = this.props.match.params.id
        }
        this.props.history.push(`/onlineOrder/customer/prodAll/${companyId}?key=${value}`);
    };
	render() {
        const {homeIndex,cartAmount} = this.props;
        let companyId;
        if('previewComId' in this.props){
            companyId = this.props.previewComId;
        }else{
            companyId = this.props.match.params.id
        }
        let dataSource = homeIndex.getIn(['listData']);
        console.log(dataSource,'dataSource');
        let companyInfor = (dataSource && dataSource.dataMallConfigBo)?dataSource.dataMallConfigBo:{};

        let count = dataSource?dataSource.count:0;
        dataSource = (dataSource && dataSource.data)? dataSource.data : [];

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
                                 />
                             </div>
                         </div>
					 </div>

                    <CompanyMenu data={[
                        {
                            title: '首页',
                            url: 'previewComId' in this.props?'/mall/preview':'/onlineOrder/'+companyId+'/customerIndex',
                            isCurrent: true
                        },
                        {
                            title: '所有商品',
                            url: 'previewComId' in this.props?'/mall/preview/product':'/onlineOrder/customer/prodAll/'+companyId,
                            isCurrent: false
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

                    <p className={cx("new-product")}>—新品上架—</p>

                    <Row className={cx("customer-prod")}>
                        {
                            (dataSource.length==0)
                                ?(
                                    <div style={{padding:"100px",textAlign:"center"}}>
                                        <img style={{marginBottom:"10px"}} src={'/images/server/customer.png'}/><br/>店主很懒，暂时没有可销售的商品 如果需要，您可以查看上方联系方式联系公司哦
                                    </div>
                                )
                                :dataSource.map((item,index)=>{
                                    if(index<4){
                                        return (
                                            <div key={index}>
                                                <Col span={6}>
                                                    <div className={cx("prod-detail-big")}>
                                                        <div className={cx("prod-detail-inner")}>
                                                            <Link to={`/onlineOrder/cartDetail/${companyId}/${item.supplierProductCode}`}>
                                                            <div className={cx("img-box")}>
                                                              <img src={item.images&&item.images.length>0?item.images[0].thumbnailUri:'/images/server/noPic.jpg'}/>
                                                            </div>
                                                            <div className={cx("prod-detail-info")}>
                                                                <p className={cx("name")}>{item.name}</p>
                                                                <p className={cx("price")}>￥ {item.salePrice}</p>
                                                            </div>
                                                            </Link>
                                                            <AddToCartBtn prod={item} supplierUserIdEnc={companyId}
                                                                          selfClassName={cx("addCar")} preview={this.state.preview}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </div>
                                        )
                                    }
                                })
                        }
                    </Row>
                    <Row className={cx("customer-prod")}>
                        {
                            (dataSource.length==0)
                                ?null
                                :dataSource.map((item,index)=>{
                                    if(index>3 && index<10){
                                        return (
                                            <div key={index}>
                                                <Col span={4}>
                                                    <div className={cx("prod-detail")}>
                                                        <div className={cx("prod-detail-inner")}>
                                                            <Link to={`/onlineOrder/cartDetail/${companyId}/${item.supplierProductCode}`}>
                                                            <div className={cx("img-box-st")}>
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
                                            </div>
                                        )
                                    }
                                })
                        }
					 </Row>
				</Content.ContentBd>
			</React.Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
    homeIndex: state.getIn(['onlineOrderHomeIndex', 'onlineOrderHomeIndex']),
    cartAmount: state.getIn(['onlineOrderCartListHomeIndex', 'onlineOrderHomeListOrderList','cartAmount'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchHomeIndexData: onlineOrderHomeIndexActions.asyncFetchHomeIndexData,
        asyncFetchCartCount: onlineOrderHomeActions.asyncFetchCartCount,
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(onlineOrderIndex)

