import React, { Component } from 'react';

import Header from 'components/layout/header';
import {actions as newOrderCompanyActions} from '../index'
import {formatCurrency} from 'utils/format';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
import {actions as newOrderListActions} from "../../newOrderList";
import {getCookie,deleteCookie} from 'utils/cookie';

const cx = classNames.bind(styles);


export class OrderListCompanyIntroduce extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.asyncFetchCustomerInformationData({id:id});
        this.props.asyncFetchCartCount();
    }

    componentWillUnmount () {

    }
    //点击跳转购物车
    rightClick = () => {
        this.props.history.push(`${PROD_PATH}/onlineOrder/cartList/`);
    };

    callPhone = (phone) => {
        console.log(phone);
    }

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
    }


    render() {
      const {newOrderCompany} = this.props;
      let dataSource = newOrderCompany.getIn(['listData']);
      dataSource = dataSource ? dataSource.data : {};
        dataSource = dataSource||{};
      return(
          <div>
              <Header navStatus={'companyIntroduce'} leftClick={this.leftClick} rightClick={this.rightClick}/>
              <div className={cx('container')}>
                  <div className={cx("company-infor")}>
                      <div className={cx("company-base-infor")}>
                          {dataSource.mallName}
                          <p>
                              联系人 {dataSource.mallContacter}
                          </p>
                      </div>
                      <div className={cx("company-menu")}>
                           <ul>
                               <li>
                                   <span>
                                        联系电话：
                                   </span>
                                   <div className={cx("detail-something")}>
                                       {dataSource.mallPhone}
                                       {dataSource.mallPhone && <span className={cx("call-phone")}><a href={"tel:"+dataSource.mallPhone}>拨打</a></span>}
                                   </div>
                               </li>
                               <li>
                                   <span>
                                        咨询电话：
                                   </span>
                                   <div className={cx("detail-something")}>
                                       {dataSource.mallCsline}
                                       {dataSource.mallCsline && <span className={cx("call-phone")}><a href={"tel:"+dataSource.mallCsline}>拨打</a></span>}

                                   </div>
                               </li>
                               <li>
                                   <span>
                                        经营地址：
                                   </span>
                                   <div className={cx("detail-something")}>
                                       {dataSource.provinceText+dataSource.cityText+dataSource.mallAddress}
                                   </div>
                               </li>
                               <li>
                                   <span>
                                        公司描述：
                                   </span>
                                   <div className={cx("detail-something")}>
                                       {dataSource.mallDesc}
                                   </div>
                               </li>
                           </ul>
                      </div>
                  </div>
              </div>
          </div>
      )
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCustomerInformationData: newOrderCompanyActions.asyncFetchCustomerInformationData,
        asyncFetchCartCount:newOrderListActions.asyncFetchCartCount
    }, dispatch)
};

const mapStateToProps = (state) => ({
    newOrderCompany: state.getIn(['orderListCompanyInforReducer', 'onlineOrderCompanyInfor'])
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OrderListCompanyIntroduce)
)


