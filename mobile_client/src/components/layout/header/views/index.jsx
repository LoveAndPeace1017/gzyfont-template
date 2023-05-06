import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { NavBar } from 'antd-mobile';
import Icon from 'components/widgets/icon';
import {LeftOutlined} from '@ant-design/icons';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const cx = classNames.bind(styles);

class Header extends Component {
	constructor(props){
		super(props);
	}
	render() {
		const { navStatus, leftClick, rightClick, rightBtnStatus, history, cartAmount,handleChange,handleEnter,searchInput} = this.props;
		console.log('cartAmount:',cartAmount);

		const navWrap = {
			'orderList' : {
                'navTitle': '在线订货',
				'leftShow': false
			},
            'companyIndex' : {
                'navTitle': '',
                'leftShow': true,
                'middle': true
            },
            'companyIntroduce' : {
                'navTitle': '公司介绍',
                'leftShow': true
            },
			'cartList' : {
                'navTitle': '购物车',
                'leftShow': true
			},
			'cartDetail': {
                'navTitle': '产品详情',
                'leftShow': true
			},
            'orderConfirm': {
                'navTitle': '确认订单',
                'leftShow': true
            },
			'orderConfirmEdit': {
                'navTitle': '编辑收货信息',
                'leftShow': true
			},
			'inquiry': {
                'navTitle': '',
                'leftShow': true,
				'middle': true
			},
			'contact': {
                'navTitle': '',
                'leftShow': true,
                'middle': true
			},
			'quotation': {
				'navTitle': '',
				'leftShow': true,
				'middle': true
			},
			'quotationAdd': {
                'navTitle': '填写报价单',
                'leftShow': true,
			},
			"repeatProduct": {
                'navTitle': '',
                'leftShow': true,
                'middle': true
			}
		};

		return(
			<NavBar
				mode="dark"
				leftContent={navWrap[navStatus].leftShow && <LeftOutlined />}
				style={{'background': '#2DA66A'}}
				onLeftClick = {() => {
					if (leftClick){
						leftClick();
					} else {
						history.goBack();
					}
				}}
				rightContent={
					this.props.rightContent ||
					<span onClick={rightClick}>
						{
							navStatus === 'orderList' ? (
								<span className={cx('cart-icon')}>
									<Icon type="shopping-cart" style={{ fontSize: '24px' }} />
									<span className={cx('circle')}>{cartAmount}</span>
								</span>
							) : null
						}
                        {
                            navStatus === 'companyIntroduce' ? (
                                <span className={cx('cart-icon')}>
									<Icon type="shopping-cart" style={{ fontSize: '24px' }} />
									<span className={cx('circle')}>{cartAmount}</span>
								</span>
                            ) : null
                        }
                        {
                            navStatus === 'companyIndex' ? (
                                <span className={cx('cart-icon')}>
									<Icon type="shopping-cart" style={{ fontSize: '24px' }} />
									<span className={cx('circle')}>{cartAmount}</span>
								</span>
                            ) : null
                        }

						{
							navStatus === 'cartList' ? (
								rightBtnStatus === 1 ? (<span>管理</span>) :
									rightBtnStatus === 2 ? (<span>完成</span>) : ''
							) : null
						}

						{
							navStatus === 'orderConfirmEdit' ? (
								<Icon type="check" style={{ fontSize: '18px' }}/>
							) : null
						}
					</span>
				}
			>
				<span className={cx('title')}>
					{
                        !navWrap[navStatus].middle ? navWrap[navStatus].navTitle : this.props.children || (
							<React.Fragment>
								{
                                    navStatus==='companyIndex' && (
                                        <input style={{borderRadius:'10px',width:'280px'}} type="text"
                                               value={searchInput}
                                               placeholder={'请输入产品名称'}
                                               className={cx('search-input')}
                                               onChange={handleChange}
                                               onKeyPress={handleEnter}
                                        />
									)
								}

                                {
                                    navStatus==='inquiry' && (
                                        <div className={cx('tab-wrap')}>
											<a className={cx(['tab-left', 'active'])}>询价</a>
                                            <a  className={cx('tab-middle')} onClick={() => {this.props.history.push(`${PROD_PATH}/miccn/contact/list/`)}}>联系信</a>
                                            <a  className={cx('tab-right')} onClick={() => {this.props.history.push(`${PROD_PATH}/miccn/repeatProduct`)}}>重发产品</a>
										</div>
                                    )
                                }

                                {
                                    navStatus==='contact' && (
                                        <div className={cx('tab-wrap')}>
                                            <a className={cx('tab-left')} onClick={() => {this.props.history.push(`${PROD_PATH}/miccn/inquiry`)}}>询价</a>
                                            <a className={cx(['tab-middle', 'active'])}>联系信</a>
                                            <a  className={cx('tab-right')} onClick={() => {this.props.history.push(`${PROD_PATH}/miccn/repeatProduct`)}}>重发产品</a>
										</div>
                                    )
                                }

                                {
                                    navStatus==='repeatProduct' && (
                                        <div className={cx('tab-wrap')}>
                                            <a className={cx('tab-left')} onClick={() => {this.props.history.push(`${PROD_PATH}/miccn/inquiry`)}}>询价</a>
                                            <a className={cx('tab-middle')} onClick={() => {this.props.history.push(`${PROD_PATH}/miccn/contact/list/`)}}>联系信</a>
                                            <a className={cx(['tab-middle', 'active'])}>重发产品</a>
                                        </div>
                                    )
                                }
							</React.Fragment>
						)
					}

				</span>
			</NavBar>
		)
	}
}

const mapStateToProps = (state) => ({
	cartAmount: state.getIn(['orderListNewReducer', 'onlineOrderNewList', 'cartAmount'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({})
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Header)
);
