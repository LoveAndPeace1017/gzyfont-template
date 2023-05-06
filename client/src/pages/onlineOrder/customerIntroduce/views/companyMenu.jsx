import React, {Component} from 'react';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import {Link} from "react-router-dom";
const cx = classNames.bind(styles);

class companyMenu extends Component {
    render() {
        const {data} = this.props;
        return (
            <div className={cx("common-menu")}>
                <ul className={cx("clearfix")}>
                    {
                        data && data.map((item, index) =>{
                        if(item.url=='#' && item.imgUrl=="undefined"){
                            return false;
                        }
                        return <div key={index}>
                            {item.isCurrent ? (
                                <Link to={item.url}>
                                <li className={cx("current")}>
                                    {item.title}
                                    {item.url==='#'?(<div className={cx("customer-app-big")}>
                                                      <img src={item.imgUrl} width="170" height="170"/>
                                                      <p>微信扫一扫进入商城小程序</p>
                                                   </div>):null}
                                </li>
                                </Link>
                             ):(
                                <Link to={item.url}>
                                <li>
                                    {item.title}
                                    {item.url==='#'?(<div className={cx("customer-app-big")}>
                                        <img src={item.imgUrl} width="170" height="170"/>
                                        <p>微信扫一扫进入商城小程序</p>
                                    </div>):null}
                                </li>
                                </Link>
                            )}
                            </div>
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default companyMenu;