import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, Upload, Button, message
} from 'antd';

import Icon from 'components/widgets/icon';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import erweima from  '../img/erweima.jpg';


const cx = classNames.bind(styles);


class limitOnlineTip extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let {width,show} = this.props;
        width = width?width:800;
        return(
            <React.Fragment>
                <Modal
                    title={intl.get("components.limitOnlineTip.index.onlineTip")}
                    width={width}
                    // className={className}
                    visible={show}
                    onCancel={this.props.onClose}
                    footer={null}
                    destroyOnClose={true}
                >
                    {
                        show &&
                        <div>
                            <div className={cx("wild-tip")}>
                                <div className={cx("infor-left")}>
                                    {/*<h2>云空间已超上限</h2>*/}
                                    <h3>
                                        <strong>{intl.get("components.limitOnlineTip.index.msg1")}</strong>{intl.get("components.limitOnlineTip.index.msg2")}
                                    </h3>
                                    <h3>
                                        {intl.get("components.limitOnlineTip.index.msg3")}
                                    </h3>
                                    <h3>
                                        {intl.get("components.limitOnlineTip.index.msg4")}
                                    </h3>
                                    <h3>
                                        {intl.get("components.limitOnlineTip.index.msg5")}
                                        <br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {intl.get("components.limitOnlineTip.index.msg6")}
                                    </h3>
                                    <a target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("components.limitOnlineTip.index.msg7")}</a>
                                </div>
                                <div className={cx("infor-right")}>
                                    <img src={erweima} alt="tp"/>
                                </div>
                            </div>
                            <div className={cx("infor-foot")}>
                                <Button onClick={this.props.onClose} type={"primary"}>{intl.get("components.limitOnlineTip.index.msg8")}</Button>
                            </div>
                        </div>
                    }
                </Modal>
            </React.Fragment>
            
        )
    }
};

export default limitOnlineTip;