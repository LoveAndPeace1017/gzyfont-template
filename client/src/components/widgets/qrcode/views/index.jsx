import React from 'react';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Code from 'qrcode-react';

const cx = classNames.bind(styles);
const QrCode = ({...props}) => {

    return(
        <div className={cx("qr-wrap")}>
            <div className={cx("qr-bd")} id={props.id}>
                <Code value={props.value} alt={props.desc} size={120} />

                <div className={cx("qrcode-ope")}
                     style={{display:props.expire?"block":"none"}}
                >
                    <p>{props.errMsg}</p>
                    <a className={cx("qrcode-refresh")} onClick={props.onRefresh}>刷新</a>
                </div>
            </div>
            <p className="mt20">{props.desc}</p>
        </div>
    )
};

export default QrCode;