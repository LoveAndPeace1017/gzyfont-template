import React, {Component} from 'react';
import {Modal, Progress} from 'antd';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const cx = classNames.bind(styles);
import Icon from 'components/widgets/icon';
import {Link} from 'react-router-dom';
import phone from '../images/phone.png'


export class Index extends Component {
    render(){
        return(
            <React.Fragment>
                <Modal
                    title={"微信分享"}
                    visible={this.props.visible}
                    footer={null}
                    onCancel={this.props.onClose}
                    width={800}
                    destroyOnClose={true}
                >
                    <div className={cx("share")+ " clearfix"}>
                        <div className={cx("wecode")}>
                            <img src={this.props.imgUrl}/>
                            <p>微信扫描二维码</p>
                        </div>
                        <div className={cx("phone")}>
                            <img src={phone} width={300} height={296} alt={"微信扫描二维码"}/>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)