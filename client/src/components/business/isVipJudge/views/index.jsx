import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {Modal} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import {asyncFetchVipValueAdded,asyncFetchVipService} from "../../../../pages/vipService/actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


class IsVipJudge extends Component {

    createNewTemplate = (type)=>{
        this.props.asyncFetchVipService((data)=>{
            let dataSource = data.data;
            if(dataSource.VALUE_ADDED.vipState == 'TRY'||dataSource.VALUE_ADDED.vipState == 'OPENED'){
                this.props.history.push(`/template/new?templateType=${type}`)
            }else if(dataSource.VALUE_ADDED.vipState == 'NOT_OPEN'){
                let _this = this;
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    title: intl.get("components.isVipJudge.index.warningTip"),
                    content:  (
                        <div>
                            {intl.get("components.isVipJudge.index.bomVipContent")}
                        </div>
                    ),
                    okText: intl.get("components.isVipJudge.index.open"),
                    onOk() {
                        _this.props.asyncFetchVipValueAdded((datas)=> {
                            if (datas.retCode == "0") {
                                _this.props.history.push(`/template/new?templateType=${type}`)
                            }
                        });
                    }
                });
            }else{
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    title: intl.get("components.isVipJudge.index.warningTip"),
                    content:  (
                        <div>
                            <p>{intl.get("components.isVipJudge.index.bomVipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">
                                {intl.get("components.isVipJudge.index.treatyText")}</a>
                        </div>
                    )
                });
            }
        })
    }


    render() {
        const {templateType} = this.props;
        return (
            <div style={{margin: "0 18px"}}>
                <Icon type={"icon-print"}/>
                <a style={{marginLeft: "3px"}} onClick={()=>this.createNewTemplate(templateType)} target="_blank">
                    {intl.get("components.isVipJudge.index.printTemplateConfig")}
                </a>
            </div>
        )


    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchVipValueAdded,
        asyncFetchVipService
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(withRouter(IsVipJudge))