import React, {Component} from 'react';
import {Breadcrumb} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";
import {Button} from 'antd';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import {actions as commonActions} from 'components/business/commonRequest/index';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
const cx = classNames.bind(styles);

class PrintStatus extends Component {

    constructor(props) {
        super(props);
        console.log(props,'props');
        this.state = {
            status: !!props.status
        }
    }

    changeStatus = ()=>{
        this.setState({
            status: true
        },()=>{
           this.props.asyncUpdatePrintStatus(this.props.billNo);
        });
    }

    render() {
        let status = this.state.status;

        return (
            <>
                <div className={cx("print-bom")}>
                    <span>打印状态：{status?'已打印':'未打印'}</span>
                    {
                        !status?
                        <>
                            <Button onClick={this.changeStatus}>设为已打印</Button>
                        </>:
                            null
                    }
                </div>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncUpdatePrintStatus:commonActions.asyncUpdatePrintStatus
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(withRouter(PrintStatus));

