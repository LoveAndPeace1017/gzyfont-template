import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Menu, Dropdown, Modal, Tabs, message, Row, Col, Input } from 'antd';
import {Link} from 'react-router-dom';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {actions as commonActions} from 'components/business/commonRequest/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
const cx = classNames.bind(styles);

class mallLeader extends Component {
    constructor(props) {
        super(props);
        this.state={
            mallLeaderVisible:false
        }
    }

    closeLeader = () => {
        this.setState({
            mallLeaderVisible: false
        });
        this.props.isPopShow({isClick:'1',clickSource:'homeLeader'});
    };
    // toMall=()=>{
    //     this.props.asyncShowIndexLeader({isClick:'1'});
    //     this.props.history.push(`/mall`);
    // }
    componentDidMount() {
         this.props.isPopShow({clickSource:'homeLeader',isClick:'0'},(data)=>{
             this.setState({
                 mallLeaderVisible: data.data == "1"?false:true
            });
         });
    }
    render(){
        return(
            <React.Fragment>
                {this.state.mallLeaderVisible?(
                <div className={cx('mall-leader')}>
                    <div onClick={()=>this.closeLeader()} className={cx("close-leader")}>×</div>
                    <Row>
                        <Col span={24}>
                            <a className={cx("main-adv")} href="http://wpa.qq.com/msgrd?v=3&uin=1336529165&site=qq&menu=yes" target="_blank">
                                <img src="/images/server/lmzleader.png"/>
                               {/* <span className={cx('btn')}>立即咨询</span>*/}
                            </a>
                        </Col>
                    </Row>
                </div>):null}
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        isPopShow: commonActions.isPopShow
    }, dispatch)
};

export default withRouter(
    connect(null,mapDispatchToProps)(mallLeader)
)



