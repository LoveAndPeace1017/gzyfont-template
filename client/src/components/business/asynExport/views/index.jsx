import React, {Component} from 'react';
import {withRouter, Link} from "react-router-dom";
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import {Button,Modal,message} from 'antd';
const cx = classNames.bind(styles);
class AsynExport extends Component {


    constructor(props) {
        super(props);
        this.state = {
            condition:{},
            disabled: false,
            time: 60
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }


    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(!this.compareObj(this.props.condition,nextProps.condition)){
            this.endCont();
        }
    }


    clickAsycFn = ()=>{
        const {condition, clickFn,type} = this.props;
        console.log(condition,'condition');
        if(type && type === 'grossProfitCustomer' && !condition.customerName){
            message.error('至少选择一个客户！');
            return false;
        }
        this.setState({
            disabled: true
        });
        clickFn(condition,(data)=>{
            if(data.retCode == 0){
                let modal =  Modal.success({
                    content: (
                        <div>
                            报表正在生成中，完成后可在<span style={{cursor: "pointer",color:"blue"}} onClick={()=>{modal.destroy();this.props.history.push(`/downloadCenter`);}}>下载中心</span>下载
                        </div>
                    )

                });
                this.startCont();
            }else{
                Modal.warning({
                    content: (
                        <div>
                            {data.retMsg}
                        </div>
                    )

                });
                this.endCont();
            }

        });

    }

    //比较2个对象是否相同（用最基础的比较方法）
    compareObj = (pre,now) =>{
        return JSON.stringify(pre) === JSON.stringify(now);
    }


    //开始计时
    startCont = () =>{
        this.timer = setInterval(()=>{
            let time = this.state.time;
            time = time - 1;
            if(time == 0){
                this.endCont();
            }else{
                this.setState({
                    time
                })
            }
        },1000);
    };

    //清除倒计时
    endCont = () =>{
        clearTimeout(this.timer);
        this.setState({
            time: 60,
            disabled: false
        })
    }


    render() {
        return (
            <React.Fragment>
                <Button disabled={this.state.disabled} onClick={()=>this.clickAsycFn()} style={{marginLeft: "10px"}}>生成并导出{
                    this.state.disabled?"("+this.state.time+"s)":null
                }</Button>
            </React.Fragment>
        )
    }
}

export default withRouter(AsynExport)