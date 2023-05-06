import React, {Component} from 'react';
import Panel from 'components/business/panel';
import Icon from 'components/widgets/icon';
import {
    CaretDownOutlined,
} from '@ant-design/icons';
import intl from 'react-intl-universal';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {asyncFetchSaleKit} from "../actions";
import {actions as commonActions} from "components/business/commonRequest";
import {connect} from "react-redux";
import {message, Spin, Select, Row,Col} from "antd";

const cx = classNames.bind(styles);
import {Link, withRouter} from "react-router-dom";

class SalesKitPanel extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataType: "0",
            kitData: {},
            totalAmount:0,
            l1: 0,
            l2: 0,
            l3: 0,
            l4: 0,
            l5: 0,

        }
    }


    componentDidMount() {
       /* this.props.asyncFetchSaleKit({},(data)=>{


        })*/
       this.getSaleKitInfor()
    }
    //初始化页面数据
    getSaleKitInfor=()=>{
        let followStatusDataFlag = this.state.dataType;
        this.props.asyncFetchSaleKit({followStatusDataFlag:followStatusDataFlag},(data)=>{
             console.log(data,'kit');
             let list = data.hcfList;
             let l1 = 0;
             let l2 = 0;
             let l3 = 0;
             let l4 = 0;
             let l5 = 0;
             list && list.forEach((item)=>{
                 if(item.followStatus == '初访'){
                     l1 = item.count;
                 }
                 if(item.followStatus == '意向'){
                     l2 = item.count;
                 }
                 if(item.followStatus == '报价'){
                     l3 = item.count;
                 }
                 if(item.followStatus == '搁置'){
                     l5 = item.count;
                 }
             });
             l4 = data.orderAmount?data.orderAmount:0;
             this.setState({
                 totalAmount:data.totalAmount?data.totalAmount:0,
                 l1,
                 l2,
                 l3,
                 l4,
                 l5
             })
        })

    };
    //改变
    handleChange = (e)=>{
       this.setState({
           dataType:e
       },()=> {
           this.getSaleKitInfor();
       })
    };

    toAssignList = (followStatus) => {
        const title = 'customer';
        const condition = {followStatus};
        this.props.asyncFetchInitListCondition({TITLE: title, condition});
        this.props.history.push('/customer/');
    };

    toSaleList = () =>{
        let dateType = this.state.dataType;
        this.props.history.push('/sale/?dateType='+dateType);
    }

    render() {

        return (
            <React.Fragment>
                <Panel
                    title={intl.get("home.saleskitPanel.title")}
                    extra={
                        <Select
                            className={cx("panel-select")}
                            value={this.state.dataType}
                            suffixIcon={<CaretDownOutlined style={{pointerEvents:"none"}}/>}
                            onChange={this.handleChange}
                        >
                            <Select.Option value="2" className={cx("panel-select-option")}>本季</Select.Option>
                            <Select.Option value="1" className={cx("panel-select-option")}>{intl.get("home.saleskitPanel.month")}</Select.Option>
                            <Select.Option value="0" className={cx("panel-select-option")}>{intl.get("home.saleskitPanel.day")}</Select.Option>
                        </Select>
                    }
                >
                    <Row className={cx("kit-row")}>
                        <Col className={cx('kit-col')} span={12}>
                            <div>
                                <h2>{intl.get("home.saleskitPanel.customType1")}</h2>
                                <h3>{this.state.l1}</h3>
                            </div>
                        </Col>
                        <Col className={cx('kit-col')} span={12}>
                            <div>
                                <h2>{intl.get("home.saleskitPanel.customType2")}</h2>
                                <h3>{this.state.l2}</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row className={cx("kit-row")}>
                        <Col className={cx('kit-col')} span={12}>
                            <div>
                                <h2>{intl.get("home.saleskitPanel.customType3")}</h2>
                                <h3>{this.state.l3}</h3>
                            </div>
                        </Col>
                        <Col className={cx('kit-col')} span={12}>
                            <div className={cx('panel-tit-name')} onClick={()=>this.toSaleList()}>
                                <h2>{intl.get("home.saleskitPanel.newOrder")}</h2>
                                <h3>{this.state.l4}</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row className={cx("kit-row")}>
                        <Col className={cx('kit-col')} span={12}>
                            <div>
                                <h2>{intl.get("home.saleskitPanel.customType5")}</h2>
                                <h3>{this.state.l5}</h3>
                            </div>
                        </Col>
                        <Col className={cx('kit-col')} span={12}>
                            <h2>{intl.get("home.saleskitPanel.saleTotal")}</h2>
                            <h3>{'￥'+this.state.totalAmount}</h3>
                        </Col>
                    </Row>
                </Panel>

            </React.Fragment>

        )
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleKit,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
    }, dispatch)
};

export default withRouter(
    connect(null, mapDispatchToProps)(SalesKitPanel)
)
