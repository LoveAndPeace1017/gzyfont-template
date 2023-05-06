import React, { Component } from 'react';
import { Col, Row, message } from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import {AddToCartBtn} from 'components/widgets/addCartBtn';
import ShoppingCart from 'components/business/shoppingCart';
import {bindActionCreators} from "redux";
import {actions as onlineOrderHomeActions} from "../index";

import {connect} from "react-redux";
import {Link} from "react-router-dom";
const cx = classNames.bind(styles);


class onlineOrderHome extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
       this.props.asyncFetchCartHomeData();
       this.props.asyncFetchCartCount();
    }

	render() {
        const {home} = this.props;
        let cartAmount = home && home.toJS().cartAmount;
        let dataSource = home.getIn(['listData']);
        dataSource = dataSource ? dataSource.data : [];
        console.log(dataSource,'dataSource');
        let hasData = dataSource.length>0?true:false;
		return(
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            title: '在线订货'
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <ShoppingCart cartAmount={cartAmount}/>
                    </div>
                </Content.ContentHd>
                {hasData?
                    <Content.ContentBd>
                    {
                        (dataSource.length==0)
                            ?null
                            :dataSource.map((item,index)=>{
                                return (
                                    <React.Fragment key={index}>

                                        <div className={cx("wild-hd")+" clearfix"}>
                                            <div title={item.mallName} className={cx("customer-title")}>
                                                {item.mallName}
                                            </div>
                                            <div className={cx("customer-information")}>
                                                <span className={cx("gray")}>联系人：</span>{item.mallContacter} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span className={cx("gray")}>联系电话：</span>{item.mallPhone} <br/>
                                                共计<span className={cx("red")}>{item.total}</span>种在售商品
                                            </div>
                                            {item.wxAppletImgUrl?
                                                <div className={cx("customer-app")}>
                                                    <img src={item.wxAppletImgUrl} width="40" height="40"/>
                                                    <div className={cx("customer-app-big")}>
                                                        <img src={item.wxAppletImgUrl} width="170" height="170"/>
                                                        <p>微信扫一扫进入商城小程序</p>
                                                    </div>
                                                </div>:null
                                            }

                                            <div className={cx("go-room")}>
                                                <Link to={"/onlineOrder/"+item.paseUserId+"/customerIndex"}>
                                                    <div>
                                                        进入店铺
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                        <Row className={cx("customer-prod")}>
                                            {
                                                (item.dataList.length==0)
                                                    ?(
                                                        <div style={{padding:"100px",textAlign:"center"}}>
                                                            店主很懒，暂时没有可销售的商品 如果需要，您可以查看上方联系方式联系公司哦
                                                        </div>
                                                    )
                                                    :item.dataList.map((prod,index)=> {
                                                        return (
                                                            <Col key={index} span={4}>
                                                                <div key={index} className={cx("prod-detail")}>
                                                                    <div className={cx("prod-detail-inner")}>
                                                                        <Link to={`/onlineOrder/cartDetail/${item.paseUserId}/${prod.supplierProductCode}`}>
                                                                        <div className={cx("img-box")}>
                                                                            <img src={prod.images&&prod.images.length>0?prod.images[0].thumbnailUri:'/images/server/noPic.jpg'}/>
                                                                        </div>

                                                                        <div className={cx("prod-infor")}>
                                                                            <p>
                                                                                {prod.name}
                                                                            </p>
                                                                            <p className={cx("red")}>
                                                                                ￥{prod.salePrice}
                                                                            </p>
                                                                        </div>
                                                                        </Link>
                                                                        <AddToCartBtn prod={prod} supplierUserIdEnc={item.paseUserId}
                                                                            selfClassName={cx("addCar")}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )
                                                    })
                                            }
                                        </Row>
                                    </React.Fragment>
                                )
                            })
                    }
                </Content.ContentBd>:
                <Content.ContentBd>
                    <div className={cx("has-no-data")}>
                        <img src="/images/server/customer.png"/>
                        <p>没有供应商对您开放商城哦</p>
                    </div>
                </Content.ContentBd>}
			</React.Fragment>

		)
	}
}
const mapStateToProps = (state) => ({
    home: state.getIn(['onlineOrderCartListHomeIndex', 'onlineOrderHomeListOrderList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartCount: onlineOrderHomeActions.asyncFetchCartCount,
        asyncFetchCartHomeData: onlineOrderHomeActions.asyncFetchCartHomeData,
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(onlineOrderHome)

