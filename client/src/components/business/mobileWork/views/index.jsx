import React, {Component} from 'react';
import {withRouter, Link} from "react-router-dom";
import { Row, Col, Input, Layout, Table, Modal, Button } from 'antd';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import Code from 'qrcode-react';
import wxAppImg from 'images/mWorkWxApp.jpg';
class MobileWork extends Component {
    //下载二维码
    downloadQrcode = ()=>{
        const canvasImg = document.getElementById('qrcode').firstChild;
        let a = document.createElement("a");
        a.download = '移动报工二维码';
        a.href = canvasImg.src;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    render() {
        return (
            <React.Fragment>
                 <div className={cx("qt-mobile-work")}>
                     <p>微信扫描二维码</p>
                     <div id={"qrcode"}>
                         <img width={160} src={wxAppImg} alt={"微信扫描二维码"}/>
                     </div>
                     <div className={cx("down-btn")}>
                         <Button type={"primary"} onClick={this.downloadQrcode}>下载</Button>
                     </div>
                 </div>
            </React.Fragment>
        )
    }
}

export default withRouter(MobileWork)