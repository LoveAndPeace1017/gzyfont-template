import React, { Component } from 'react';
import Header from 'components/layout/header';
import {AddToCartImg} from 'components/widgets/addCartBtn';
import arrow from 'images/arrow.png';
import prodImg60 from 'images/prodImg60.png';
import groy from 'images/groy.png';
import news from 'images/new.png';
import menu from 'images/menu.png';
import oldmenu from 'images/oldmenu.png';
import noProd from 'images/noProd.png';
import customer from 'images/customer.png';
import {formatCurrency} from 'utils/format';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
import {actions as newOrderListCompanyActions} from "../index";
import {getUrlParamValue} from 'utils/urlParam';
import {Link} from 'react-router-dom';
import {getCookie,deleteCookie} from 'utils/cookie';
import {actions as orderListOrder} from "../../newOrderList";

const cx = classNames.bind(styles);


const ProdCard = (props)=>{
    let {prod, supplierUserIdEnc, callback,preview} = props;
    return (

        <li>
            <div className={cx("prod-infor")}>
                <Link to={`${PROD_PATH}/onlineOrder/cartDetail/${supplierUserIdEnc}/${prod.supplierProductCode}`}>
                <div className={cx("prod-img")}>
                    <img src={prod.images&&prod.images.length>0?prod.images[0].thumbnailUri:prodImg60}/>
                </div>
                <div className={cx("prod-name")}>
                    {prod.name}
                </div>
                </Link>
                <div className={cx("prod-name")}>
                    <span className={cx("red")}>￥{prod.salePrice}</span>/件
                    <AddToCartImg prod={prod} supplierUserIdEnc={supplierUserIdEnc} callback={callback}
                                  preview={preview}
                    />
                </div>
            </div>
        </li>

    );
};

export class NewOrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuInvisible:true,
            preview:false,
            allProd:false,
            searchInput: '',
        }
    }

    getCartNum = ()=>{
        this.props.asyncFetchCartCount();
    };
    componentDidMount() {
      let id = this.props.match.params.id;
      if(!id){
          id = getUrlParamValue('userid');
          this.setState({
              preview:true,
          })
      }
      this.props.asyncFetchNewOnlineOrderCompanyListData({id:id});
      this.getCartNum();
    }

    shareWx = ()=>{
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "shareWx"});
        }else if(window.nativeHandler) {
            window.nativeHandler.popBack && window.nativeHandler.shareWx();
        }
    };
    //点击跳转购物车
    rightClick = () => {
        this.props.history.push(`${PROD_PATH}/onlineOrder/cartList/`);
    };
    leftClick = () =>{
        if(getCookie('preview')=='1'){
            deleteCookie('preview');
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
                window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "popBack"});
            }else if(window.nativeHandler) {
                window.nativeHandler.popBack && window.nativeHandler.popBack();
            }
        }else{
            this.props.history.goBack();
        }
    };
    changeMenu = () =>{
        if(this.state.menuInvisible){
            this.setState({menuInvisible:false});
            this.setState({allProd:true});
        }else{
            this.setState({menuInvisible:true});
            this.setState({allProd:false});
        }
    };

    handleChange = (e) => {
        let value = e.target.value;
        this.setState({searchInput: value});
    };

    handleEnter = (e) => {
        let keyNum = (e.keyCode ? e.keyCode : e.which);
        let value = e.target.value;
        if(keyNum === 13){
            let id = this.props.match.params.id;
            if(!id){
                id = getUrlParamValue('userid');
            }
            this.props.asyncFetchNewOnlineOrderCompanyListData({id:id,key:value});
        }
    };

    render() {
      let isShow;
      const type = true;
      const {newOrderCompanyList} = this.props;
      let dataSource = newOrderCompanyList.getIn(['listData']);
      console.log(newOrderCompanyList && newOrderCompanyList.toJS(),'dataSource');
      let companyInfor = dataSource ? dataSource.dataMallConfigBo:{};
      let wxAppletImgUrl = companyInfor.wxAppletImgUrl;
      dataSource = dataSource ? dataSource.data : [];
      let companyId = this.props.match.params.id;
      if(getCookie('preview')=='1'){
          companyId = getCookie('mobileUserId');
      }
      isShow = (dataSource.length>0)?true:false;
      return(
          <div>
              <Header navStatus={'companyIndex'} searchInput={this.state.searchInput} handleChange={this.handleChange} handleEnter={this.handleEnter} leftClick={this.leftClick} rightClick={this.rightClick}/>
              <div className={cx('container')}>
                  <div className={cx("company-infor")}>
                      <div className={cx("company-base-infor")}>
                          {companyInfor.mallName}
                          <p>
                              {companyInfor.mallContacter}&nbsp;&nbsp;&nbsp;
                              {companyInfor.mallPhone}
                          </p>
                          <Link to={`${PROD_PATH}/onlineOrder/companyIntroduce/${companyId}`}>
                           <img src={arrow}/>
                          </Link>
                      </div>
                      <div className={cx("company-menu")}>
                          {this.state.menuInvisible?(
                              <ul>
                                  <li className={cx("green")}>
                                      <img style={{marginRight:'5px'}} width={20} height={20} src={news}/>新品上架
                                  </li>
                                  <li onClick={this.changeMenu} className={cx("gray")}>
                                      <img style={{marginRight:'5px'}} width={20} height={20} src={oldmenu}/>全部商品
                                  </li>
                              </ul>
                          ):(
                              <ul>
                                  <li onClick={this.changeMenu} className={cx("gray")}>
                                      <img style={{marginRight:'5px'}} width={20} height={20} src={groy}/>新品上架
                                  </li>
                                  <li className={cx("green")}>
                                      <img style={{marginRight:'5px'}} width={20} height={20} src={menu}/>全部商品
                                  </li>
                              </ul>
                          )}

                      </div>
                  </div>
              {
                  isShow ? (
                          <div className={cx("produce-infor")}>
                              <ul>
                                  {
                                      dataSource.map((item, index) => {
                                          if(this.state.allProd){
                                              return (
                                                  <ProdCard key={index} preview={this.state.preview}
                                                            prod={item} supplierUserIdEnc={companyId}
                                                  />
                                              )
                                          }else{
                                              if(index<10){
                                                  return (
                                                      <ProdCard key={index} preview={this.state.preview}
                                                                prod={item} supplierUserIdEnc={companyId}
                                                                callback={this.getCartNum}
                                                      />
                                                  )
                                              }

                                          }

                                      })
                                  }

                              </ul>
                          </div>
                  ) : (
                          type ? (
                              <div className={cx("has-no-prod")}>
                                  <div>
                                      <img width={120} src={noProd}/>
                                      <p>店主很懒，暂没有可销售商品~~</p>
                                      <h2>如有需要，您可以查看上方联系方式联系公司哦</h2>
                                  </div>
                              </div>
                          ):(
                              <div className={cx("has-no-prod")}>
                                  <div>
                                      <img src={customer}/>
                                      <p>该店铺无法查看~</p>
                                      <h2>如有需要，您可以查看上方联系方式联系公司哦</h2>
                                  </div>
                              </div>
                          )
                  )
              }
              </div>
              <div className={cx("fix-share")} onClick={this.shareWx} style={{display:(this.state.preview&&wxAppletImgUrl)?'block':'none'}}>
                  <i className={cx("icon-share")}></i>
              </div>
          </div>
      )
    }
}

const mapStateToProps = (state) => ({
    newOrderCompanyList: state.getIn(['orderListCompanyListReducer', 'onlineOrderCompanyList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchNewOnlineOrderCompanyListData: newOrderListCompanyActions.asyncFetchNewOnlineOrderCompanyListData,
        asyncFetchCartCount: orderListOrder.asyncFetchCartCount,
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NewOrderList)
)



