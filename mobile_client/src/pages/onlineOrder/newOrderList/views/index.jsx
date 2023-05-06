import React, { Component } from 'react';

import { Drawer, Modal, Toast, PullToRefresh, ListView,Flex,WhiteSpace } from 'antd-mobile';
import Header from 'components/layout/header';
import prodImg120 from 'images/prodImg120.png';
import companyIcon from 'images/company.png';
import customer from 'images/customer.png';
import {formatCurrency} from 'utils/format';
import {setCookie,deleteCookie} from 'utils/cookie';

import {actions as newOrderListActions} from '../index'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {parse} from "url";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {Link} from "react-router-dom";
import {getUrlParamValue} from 'utils/urlParam';
import {withRouter} from "react-router-dom";



const cx = classNames.bind(styles);
const alert = Modal.alert;


export class NewOrderList extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        let self = this;
        const {match:{url}} = this.props;
        this.props.fetchMobileInfo(parse(this.props.location.search, true).query, function () {
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
                window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "showTab"});
            }else if(window.nativeHandler) {
                window.nativeHandler.showTab && window.nativeHandler.showTab();
            }
            let target = getUrlParamValue('target');
           if(target=='preview'){
                let token = getUrlParamValue('token');
                let clienttype = getUrlParamValue('clienttype');
                let userid = getUrlParamValue('userid');
                let search = `?token=${token}&clienttype=${clienttype}&userid=${userid}`;
                setCookie('preview','1',1);
                self.props.history.push(`${PROD_PATH}/preview`+search);
            }else{
                deleteCookie('preview');
                self.props.asyncFetchNewOnlineOrderListData();
                self.props.asyncFetchCartCount();
            }

        });
    }

    componentWillUnmount () {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "hideTab"});
        }else if(window.nativeHandler) {
            window.nativeHandler.hideTab && window.nativeHandler.hideTab();
        }
    }
    //点击跳转购物车
    rightClick = () => {
        this.props.history.push(`${PROD_PATH}/onlineOrder/cartList/`);
    };
    render() {
        const {newOrderList} = this.props;
        let dataSource = newOrderList.getIn(['listData']);
        dataSource = dataSource ? dataSource.data : [];
        console.log(dataSource,'dataSource');
        let isShow = dataSource.length>0?true:false;

      return(
                  <div>
                      <Header navStatus={'orderList'} rightClick={this.rightClick}/>
                      {
                          isShow ? (
                              <div className={cx('container')}>
                                  <div className={cx("container-inner")}>
                                      {
                                          (dataSource.length==0)
                                              ?null
                                              :dataSource.map((item,index)=>{
                                                  return(
                                                      <div key={index} className={cx("company-infor")}>
                                                          <div className={cx("company-title")}>
                                                              <img style={{marginBottom: '2px'}} width={20} height={20}
                                                                   src={companyIcon}/>{item.mallName}
                                                              <div className={cx("go-custom")}>
                                                                  <Link to={`${PROD_PATH}/onlineOrder/companyIndex/${item.paseUserId}`}>进店</Link>
                                                              </div>
                                                          </div>
                                                          <ul className={cx("prodList-ul")}>
                                                              {
                                                                  (item.dataList.length==0)
                                                                      ?null
                                                                      :item.dataList.map((items,index)=> {
                                                                          if(index<6){
                                                                              return (
                                                                                  <Link  key={index} to={`${PROD_PATH}/onlineOrder/cartDetail/${item.paseUserId}/${items.supplierProductCode}`}>
                                                                                  <li>
                                                                                      <div className={cx("prod-infor")}>
                                                                                          <div className={cx("prod-img")}>
                                                                                              <img src={items.images&&items.images.length>0?items.images[0].thumbnailUri:prodImg120}/>
                                                                                          </div>
                                                                                          <div className={cx("prod-price")}>
                                                                                              <span>￥{items.salePrice}</span>
                                                                                          </div>
                                                                                      </div>
                                                                                  </li>
                                                                                  </Link>
                                                                              )
                                                                          }
                                                                      })
                                                              }
                                                          </ul>
                                                      </div>
                                                  )
                                              })
                                      }
                                  </div>
                                  <WhiteSpace size="lg"/>
                              </div>
                          ) : (
                              <div className={cx("has-no-prod")}>
                                   <div>
                                       <img src={customer}/>
                                       <p>没有供应商对您开放商城哦~</p>
                                   </div>

                              </div>
                          )
                      }
                  </div>
      )
    }
}

const mapStateToProps = (state) => ({
    newOrderList: state.getIn(['orderListNewReducer', 'onlineOrderNewList']),

});
//newOrderListActions
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchMobileInfo: newOrderListActions.fetchMobileInfo,
        asyncFetchNewOnlineOrderListData: newOrderListActions.asyncFetchNewOnlineOrderListData,
        asyncFetchCartCount:newOrderListActions.asyncFetchCartCount
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NewOrderList)
)
