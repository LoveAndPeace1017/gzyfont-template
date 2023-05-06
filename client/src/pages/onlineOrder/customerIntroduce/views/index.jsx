import React, { Component } from 'react';
import { Col, Row } from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import CompanyMenu from "./companyMenu";
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import SuggestSearch from  'components/business/suggestSearch';
import ShoppingCart from 'components/business/shoppingCart';
import {bindActionCreators} from "redux";
import {actions as onlineOrderCustomerIntroduceActions} from "../index";
import {actions as onlineOrderHomeActions} from "../../home/index"
import {connect} from "react-redux";
const cx = classNames.bind(styles);
import {Link} from "react-router-dom";
import {toJS} from "immutable";


class onlineOrderCustomerIntroduce extends Component {

    componentDidMount() {
        let id;
        if('previewComId' in this.props){
            id = this.props.previewComId;
        }else{
            id = this.props.match.params.id
        }
        this.props.asyncFetchCustomerData({id: id});
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
        this.props.history.push(`/onlineOrder/customer/prodAll/${companyId}?key=${value}`);
    };

    changeUndefined = (value)=>{
       return value == undefined ? '':value;
    }

	render() {
        const {customerIntroduce,cartAmount} = this.props;
        let companyId;
        if('previewComId' in this.props){
            companyId = this.props.previewComId;
        }else{
            companyId = this.props.match.params.id
        }
        let dataSource = customerIntroduce.getIn(['listData']);
        let companyInfor = dataSource ? dataSource.dataMallConfigBo:{};
        let count = dataSource?dataSource.count:0;
        dataSource = dataSource? ("data" in dataSource?dataSource.data:{}) : {};

        console.log(customerIntroduce&&customerIntroduce.toJS(),'customerIntroduce');

        console.log(dataSource.provinceText==undefined,'asd');

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
                            isCurrent: false
                        },
                        {
                            title: '所有商品',
                            url: 'previewComId' in this.props?'/mall/preview/product':'/onlineOrder/customer/prodAll/'+companyId,
                            isCurrent: false
                        },
                        {
                            title: '公司介绍',
                            url: 'previewComId' in this.props?'/mall/preview/introduce':'/onlineOrder/customer/introduce/'+companyId,
                            isCurrent: true
                        },
                        {
                            title: '商城小程序',
                            url: '#',
                            isCurrent: false,
                            imgUrl: `${companyInfor.wxAppletImgUrl}`
                        },
                    ]}/>

                    <div className={cx("company-detail")}>
                        <Row className={cx("common-row")}>
                            <Col span={8}>名称：{companyInfor.mallName}</Col>
                            <Col span={8}>联系人：{companyInfor.mallContacter}</Col>
                        </Row>
                        <Row className={cx("common-row")}>
                            <Col span={8}>联系电话：{companyInfor.mallPhone}</Col>
                            <Col span={8}>客服热线：{dataSource.mallCsline}</Col>
                        </Row>
                        <Row className={cx("common-row")}>
                            <Col span={24}>经营地址：{this.changeUndefined(dataSource.provinceText)+this.changeUndefined(dataSource.cityText)+this.changeUndefined(dataSource.mallAddress)}</Col>
                        </Row>
                        <Row className={cx("common-row")}>
                            <Col span={24}>公司描述：{dataSource.mallDesc}</Col>
                        </Row>
                    </div>

				</Content.ContentBd>
			</React.Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
    customerIntroduce: state.getIn(['onlineOrderCustomerIntroduce', 'onlineOrderCustomerIntroduce']),
    cartAmount: state.getIn(['onlineOrderCartListHomeIndex', 'onlineOrderHomeListOrderList','cartAmount'])
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCustomerData: onlineOrderCustomerIntroduceActions.asyncFetchCustomerData,
        asyncFetchCartCount:onlineOrderHomeActions.asyncFetchCartCount
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(onlineOrderCustomerIntroduce)


