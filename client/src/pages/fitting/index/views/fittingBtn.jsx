import React, {Component} from 'react';
import {Button} from 'antd';
import Icon from 'components/widgets/icon';
import intl from 'react-intl-universal';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {AddButton} from "components/business/authMenu";
import FittingIndex from 'pages/fitting/index';
import {Modal} from "antd/lib/index";

const cx = classNames.bind(styles);

export default class FittingBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fittingVisible: false
        };
    }

    openModal = ()=>{
        this.setState({
            fittingVisible:true
        });
    };
    closeModal = ()=>{
        this.setState({
            fittingVisible:false
        });
    };


    render() {
        return (
            <React.Fragment>
                <span onClick={()=>this.openModal()}>
                    {this.props.children}
                </span>
                <Modal
                    title={intl.get("fitting.index.title")}
                    width={''}
                    className={cx("modal-mul-account")+ " list-pop list-pop-no-footer"}
                    visible={this.state.fittingVisible}
                    footer = {null}
                    onCancel={()=>this.closeModal()}
                    destroyOnClose={true}
                >
                    <FittingIndex/>
                </Modal>
            </React.Fragment>
        )
    }
};

