import React, {Component} from 'react';
import {message} from 'antd';
import _ from "lodash";
import moment from "moment-timezone/index";

export default class detailPage extends Component {
    closeModal = (tag)=>{
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };

    openModal = (tag)=>{
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };
    // 选择模版页面确认操作
    extendApproveOkModal = (approveId,billNo,type,callback) => {
        if(!approveId){
            message.error('请选择审批流！');
            return false;
        }
        this.closeModal('selectApprove');
        this.asyncApproveOperate({operate: 2,approveId,billNo,type}, callback);
    };

    extendApproveCancelModal = () => {
        this.closeModal('selectApprove');
    };
    //直接审批
    cancelApproveGoOperate =(billNo,type,callback) => {
        this.asyncApproveOperate({operate: 2,billNo,type},callback);
    };

    // 具体审批相关的异步操作的集合  如operate 反驳1  提交 2  撤回 3  审批通过4
    asyncApproveOperate = (params, callback) => {
        //审批通过 和 撤回 加上disabled属性，防止重复点击
        if(params.operate === 4){
            this.setState({approveBtnFlag: true});
        }else if(params.operate === 3){
            this.setState({approveRevertBtnFlag: true});
        }

        this.props.asyncOperateApprove(params, (res) => {
            if(res && res.data.retCode === "0"){
                message.success('操作成功!');
                setTimeout(()=>{
                    this.setState({approveBtnFlag:false,approveRevertBtnFlag: false});
                },2000);
                callback && callback();
            } else {
                message.error(res.data.retMsg);
            }
        })
    };

    // 处理单个自定义字段的值
    preProcessDataTagValue = (tag, value) => {
        if (!value) return;
        if (tag.type === 'date') {
            value = moment(value).format('YYYY-MM-DD');
        } else if (tag.type === 'select') {
            let extra = tag.extra;
            let options = extra.options;
            value = options.filter(item => item.key == value)[0].value;
        }
        return value;
    };

    // 批量处理自定义字段的值
    multiPreProcessDataTagValue = (tags, data) => {
        tags.forEach(tag => { // 处理自定义字段中的特殊值
            let propertyValue = this.preProcessDataTagValue(tag, data[tag.mappingName]);
            if(propertyValue){
                data[tag.mappingName] = propertyValue;
            }
        });
        return data;
    }
}