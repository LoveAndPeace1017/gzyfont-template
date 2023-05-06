import React, {Component} from 'react';
import { message } from 'antd';
import moment from "moment-timezone/index";
import _ from "lodash";

export default class AddPage extends Component {
    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        }
    };

    static otherFormItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: '2d66'},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: '21d33'},
        }
    };

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

    // 审批选择模版页面取消操作
    extendApproveCancelModal = () => {
        let {submitData} = this.state;
        //commitFlag 0不提交 1提交
        submitData.commitFlag = 0;
        this.setState({submitData}, () => {
            this.closeModal('selectApprove');
            this.asyncSubmit();
        });
    };

    // 选择模版页面确认操作
    extendApproveOkModal = (approveId) => {
        let {submitData} = this.state;
        if(approveId){
            submitData.process = approveId;
            submitData.commitFlag = 1;
        }else{
            message.error('请选择审批流！');
            return false;
        }
        this.setState({submitData}, () => {
            this.closeModal('selectApprove');
            this.asyncSubmit();
        });
    };

    /**
     *  提交单据开始审批 取消操作,
     *  操作结果直接提交表单
     */
    cancelApproveOperate = (flag) => {
        let {submitData} = this.state;
        //commitFlag 0不提交 1提交
        submitData.json?(submitData.json.commitFlag = (flag?1:0)):( submitData.commitFlag = (flag?1:0));
        this.setState({submitData}, () => {
            this.closeModal('selectApprove');
            this.asyncSubmit();
        });
    };

    /**
     *   初始化自定义列表
     */
    initFormTags = (info, propValue) => {
        info.dataTagList = [];
        this.state.tags&&this.state.tags.forEach((item,index)=>{
            if(item.propName!=""){
                info.dataTagList.push({
                    index,
                    id:item.id,
                    mappingName:item.mappingName,
                    propName:item.propName,
                    propValue:info[propValue+item.mappingName.slice(-1)]
                })
            }
        });
        if (info.dataTagList.length===0){
            info.dataTagList = [{
                index:5,
                mappingName:"property_value1",
                propValue:"",
                propName:""
            }];
        }
        return info;
    };

    _setFormFn = (type) => {
        return 'setFormFieldBy'+ type.substring(0,1).toUpperCase()+type.substring(1);
    };

    setFormFieldByText = (fieldItem, key, info) => {
        if(info[fieldItem['BACKEND_KEY']]!=null){
            this.formRef.current.setFieldsValue({[key]: info[fieldItem['BACKEND_KEY']]});
        }
    };

    setFormFieldByDate = (fieldItem, key, info) => {
        if(info[fieldItem['BACKEND_KEY']]!=null){
            let date = moment(info[fieldItem['BACKEND_KEY']]);
            this.formRef.current.setFieldsValue({[key]: date});
        } else {
            this.formRef.current.setFieldsValue({[key]: moment()});
        }
    };

    setFormFieldByObject = (fieldItem, key, info) => {
        if(info[fieldItem['BACKEND_KEY']]!=null && info[fieldItem['BACKEND_VALUE']]!=null){
            let v_key = info[fieldItem['BACKEND_KEY']];
            let v_value = info[fieldItem['BACKEND_VALUE']];

            this.formRef.current.setFieldsValue({
                [key]: {key: v_key, label: v_value}
            });
        }
    };

    setFormFieldByAddress = (fieldItem, key, info) => {
        if(info[fieldItem['BACKEND_ADDRESS']]!=null){
            let address = info[fieldItem['BACKEND_ADDRESS']];
            if(info[fieldItem['BACKEND_PROVINCE_CODE']] && info[fieldItem['BACKEND_PROVINCE_TEXT']] &&
                info[fieldItem['BACKEND_CITY_CODE']] && info[fieldItem['BACKEND_CITY_TEXT']]){
                address =  info[fieldItem['BACKEND_PROVINCE_CODE']]+ ' '+
                    info[fieldItem['BACKEND_PROVINCE_TEXT']]+ ' '+
                    info[fieldItem['BACKEND_CITY_CODE']]+ ' '+
                    info[fieldItem['BACKEND_CITY_TEXT']]+ ' '+
                    info[fieldItem['BACKEND_ADDRESS']];
            }
            this.formRef.current.setFieldsValue({[key]: address});
        }
    };

    setFormFieldByTag = (fieldItem, key, info) => {
        let dataTagList = info[fieldItem['BACKEND_KEY']] || [{
            index:5,
            mappingName:"property_value1",
            propValue:"",
            propName:""
        }];
        this.formRef.current.setFieldsValue({dataTagList: dataTagList});
        if(dataTagList && dataTagList.length>0){
            for(let i = 0; i < dataTagList.length; i++){
                this.formRef.current.setFieldsValue({['propName']: {[dataTagList[i].index]: dataTagList[i].propName}});
                this.formRef.current.setFieldsValue({['propValue']: {[dataTagList[i].index]: dataTagList[i].propValue}});
                this.formRef.current.setFieldsValue({['mappingName']: {[dataTagList[i].index]: dataTagList[i].mappingName}});
            }
        }
    };

    setFormFieldByCustomTag = (fieldItem, key, info) => {
        let propertyValues = info[fieldItem['BACKEND_KEY']];
        this.formRef.current.setFieldsValue({
            [key]: propertyValues
        });
    };

    initFormField = (keyMap, info) => {
        if(!info || Object.prototype.toString.call(info) !== '[object Object]'){
            return false;
        }
        for(let key in keyMap){
            let fieldItem = keyMap[key];
            let fn = this._setFormFn(fieldItem['TYPE']);
            this[fn] && this[fn](fieldItem, key, info);
        }
    };

    //获取连续新建的状态
    getContinueCreateFlag = () =>{
        let key = this.state.typeKey;
        this.props.asyncFetchGetContinueCreate(key,(data)=>{
            if(data.retCode == '0'){
                this.setState({
                    continueAddFlag:!!data.data
                })
            }
        })
    };

    // 预处理自定义物品字段
    preProcessDataTags = (out, tags) => {
        _.forEach(tags, (tag) => {
            let mappingName = tag.mappingName;
            if(tag.type === 'date' && out[mappingName]){
                out[mappingName] = moment(out[mappingName]);
            }else if(tag.type === 'select' && out[mappingName]){
                out[mappingName] = out[mappingName] * 1;
            }
        });
        return out;
    };

    setContinueAddFlag = (e) =>{
        let key = this.state.typeKey;
        this.props.asyncFetchSetContinueCreate(key,e.target.checked?1:0);
        this.setState({
            continueAddFlag:e.target.checked
        })
    };
}