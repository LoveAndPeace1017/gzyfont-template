import React, {Component} from 'react';
import {Button, message, Modal, Table, TimePicker ,Row ,Col,Checkbox,Select} from 'antd';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Tip from 'components/widgets/tip';
import Icon from 'components/widgets/icon';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {getCookie,setCookie} from 'utils/cookie';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
const { Option } = Select;
import {asyncFetchWorkTime, asyncUpdateWorkTime} from "../actions";



class WorkTime extends Component{

    state = {
        checkAry: [],
        count: 0,
        time: [moment('8:00', 'HH:mm'),moment('18:00', 'HH:mm')],
        saveBtnDisabledFlag: true
    }

    save = ()=>{
        let {count,time} = this.state;
        if(!count){
            message.error('工作日为必填项！');
        }else if(!time){
            message.error('工作时间为必填项！');
        }else{
            let params = {
                startTime: time[0].format('HH:mm'),
                endTime:time[1].format('HH:mm'),
                workDay: count,
                legalDay: count === 128?1:0
            };
            this.props.asyncUpdateWorkTime(params,(data)=>{
                if(data.retCode == '0'){
                    this.setState({
                        saveBtnDisabledFlag: true
                    },()=>{
                        message.success('修改成功！');
                    });
                }else{
                    message.error('修改失败！');
                }
            });
        }
    }

    //计算
    conutCheck = (count)=>{
        //共有一周7天加法定工作日选项
        let days = 8;
        let checkAry = [];
        let newCount = 0;
        for(let i=0;i<days;i++){
           let flag = !!(count & 1);
           count = count  >> 1;
           if(flag){
               checkAry.push(Math.pow(2,i));
               newCount = newCount + Math.pow(2,i);
           }
        }
        count === 128?(this.setState({
            checkAry,
            count: newCount,
            time: []
        })):(
            this.setState({
                checkAry,
                count: newCount
            })
        )

    }

    onChange = (checkedValues) => {
        let count = 0;
        for(let i=0;i<checkedValues.length;i++){
            count = count + checkedValues[i];
        }
        if(checkedValues[checkedValues.length-1] === 128){
            count = 128;
        }
        this.setState({
            saveBtnDisabledFlag: false
        },()=>{
            this.conutCheck(count);
        });
    }

    timeChange = (time) =>{
        if(time[0].unix() === time[1].unix()){
            return false;
        }else{
            this.setState({
                time,
                saveBtnDisabledFlag: false
            });
        }
    }

    componentDidMount() {
        //this.conutCheck(31);
        this.props.asyncFetchWorkTime((data)=>{
            if(data.retCode === '0'){
                let dataSource = data.data;
                let time = [moment(dataSource.startTime,'HH:mm'),moment(dataSource.endTime,'HH:mm')];
                this.setState({
                    time
                },()=>{
                    this.conutCheck(dataSource.workDay);
                })
            }else{
                message.error('发生未知异常')
            }
            console.log(data,'data');
        });
    }

    render() {

        let {count} = this.state;

        let options = [
            { label: '星期一', value: 1, disabled:count===128},
            { label: '星期二', value: 2, disabled:count===128},
            { label: '星期三', value: 4, disabled:count===128},
            { label: '星期四', value: 8, disabled:count===128},
            { label: '星期五', value: 16, disabled:count===128},
            { label: '星期六', value: 32, disabled:count===128},
            { label: '星期日', value: 64, disabled:count===128},
            { label: '法定工作日', value: 128}
        ];

        return (
            <React.Fragment>
                <div className={cx("content-hd")}>
                    <h3 className={cx("title-d")}>工作日</h3>
                    <Checkbox.Group options={options} value={this.state.checkAry} onChange={this.onChange} />
                    <h3 className={cx("title-d-s")}>工作时间</h3>
                    <div>
                        <TimePicker.RangePicker format={'HH:mm'} value={this.state.time} onChange={this.timeChange}/>
                    </div>
                    <div className={cx("bt-save")}>
                        <Button onClick={this.save} disabled={this.state.saveBtnDisabledFlag} type={"primary"}>保存</Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWorkTime,
        asyncUpdateWorkTime,
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(WorkTime)

