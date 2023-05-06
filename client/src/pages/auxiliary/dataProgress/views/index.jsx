import React, {Component} from 'react';
import {Button, message, Modal, Table, Switch,Row ,Col,Alert,Select} from 'antd';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {getCookie,setCookie} from 'utils/cookie';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
const { Option } = Select;
import { asyncFetchDataProgressList, asyncModifyDataProgress} from "../actions";



class DataProgress extends Component{

    state = {
        priceDecimalNum : 3,
        quantityDecimalNum: 3,
        prePriceDecimalNum: 3,
        preQuantityDecimalNum: 3,
    }


    selectChange = (e,type)=>{
        this.setState({
            [type]:e
        });
    }

    save = ()=>{
        let {prePriceDecimalNum,preQuantityDecimalNum} = this.state;
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '小数位一旦调至高位数则无法降低，确认调整么？',
            okText: '确认',
            cancelText: '取消',
            onOk : ()=>{
                this.props.asyncModifyDataProgress({
                    priceDecimalNum:prePriceDecimalNum,
                    quantityDecimalNum: preQuantityDecimalNum
                },(data)=>{
                    if(data.retCode == 0){
                        this.setState({
                            priceDecimalNum: prePriceDecimalNum,
                            quantityDecimalNum: preQuantityDecimalNum
                        });
                        //保存成功后写入数据进度的cookie
                        setCookie("priceDecimalNum",prePriceDecimalNum||3);
                        setCookie("quantityDecimalNum",preQuantityDecimalNum||3);

                        Modal.confirm({
                            title: '提示',
                            icon: <ExclamationCircleOutlined />,
                            content: '设置成功，是否立即刷新页面生效？',
                            okText: '确认',
                            cancelText: '取消',
                            onOk : ()=>{
                                window.location.reload();
                            }
                        });

                    }else{
                        message.error("未知异常！")
                    }
                });
            }
        });

    }

    componentDidMount() {
        this.props.asyncFetchDataProgressList((data)=>{
            this.setState({
                priceDecimalNum:data.priceDecimalNum || 3,
                quantityDecimalNum: data.quantityDecimalNum || 3,
                prePriceDecimalNum: data.priceDecimalNum || 3,
                preQuantityDecimalNum : data.quantityDecimalNum || 3,
            });
            console.log(data,'data');
        });
    }

    render() {
       let quantityDecimalNum = this.state.quantityDecimalNum;
       let priceDecimalNum = this.state.priceDecimalNum;

        let preQuantityDecimalNum = this.state.preQuantityDecimalNum;
        let prePriceDecimalNum = this.state.prePriceDecimalNum;

        return (
            <React.Fragment>
                <div>
                    <Alert message="小数位一旦调至高位数，则无法降低，请谨慎操作！" type="error" showIcon />
                </div>
                <div>
                    <Row style={{marginBottom:"20px",marginTop: "20px"}}>
                        <Col span={3}  style={{textAlign:"right",position: "relative" ,top: "4px"}}>
                            数量小数位：
                        </Col>
                        <Col span={7}>
                            <Select onChange={(e)=>this.selectChange(e,'preQuantityDecimalNum')} value={preQuantityDecimalNum} style={{width: "100%"}}>
                                {
                                    [3,4,5,6,7,8,9].map((item)=>{
                                        if(item>=quantityDecimalNum){
                                            return <Option value={item}>{item}</Option>
                                        }else{
                                            return <Option disabled value={item}>{item}</Option>
                                        }
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={3}  style={{textAlign:"right",position: "relative" ,top: "4px"}}>
                            单价小数位：
                        </Col>
                        <Col span={7}>
                            <Select onChange={(e)=>this.selectChange(e,'prePriceDecimalNum')} value={prePriceDecimalNum} style={{width: "100%"}}>
                                {
                                    [3,4,5,6,7,8,9].map((item)=>{
                                        if(item>=priceDecimalNum){
                                            return <Option value={item}>{item}</Option>
                                        }else{
                                            return <Option disabled value={item}>{item}</Option>
                                        }
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={4}  style={{textAlign:"right"}}>
                            <Button onClick={this.save}  type="primary">保存</Button>
                        </Col>
                    </Row>

                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auxiliaryDataProgressList: state.getIn(['auxiliaryDataProgress', 'auxiliaryDataProgressList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchDataProgressList,
        asyncModifyDataProgress,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(DataProgress)

