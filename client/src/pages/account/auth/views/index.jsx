import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Checkbox, Select } from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import groupList from './data';
import intl from 'react-intl-universal';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

import {asyncFetchSubAccountAuth, emptySubAccountAuth} from '../actions'
import {AUTH_ADD, AUTH_APPROVE, AUTH_DELETE, AUTH_MODIFY, AUTH_READ, AUTH_APPENDIX} from '../actionsTypes'
import * as constants from 'utils/constants'

const {Option} = Select;

//表格内容区的高度
const TABLE_SCROLL_HEIGHT = constants.MODAL_MARGIN + constants.MODAL_HEADER_HEIGHT + constants.MODAL_FOOTER_HEIGHT
    + 47;

class Index extends Component {
    state = {
        readAuthDisabled: [],
    };

    optionTypes(authList){
        let hasAddCheck,
            hasDeleteCheck,
            hasModifyCheck,
            hasReadCheck,
            hasApproveCheck,
            hasAppendixCheck;
        authList.forEach(item=>{
            if(item.key === AUTH_ADD){
                hasAddCheck = true
            }else if(item.key === AUTH_DELETE){
                hasDeleteCheck = true;
            }else if(item.key === AUTH_MODIFY){
                hasModifyCheck = true;
            }else if(item.key === AUTH_READ){
                hasReadCheck = true;
            }else if(item.key === AUTH_APPROVE){
                hasApproveCheck = true;
            }else if(item.key === AUTH_APPENDIX){
                hasAppendixCheck = true;
            }
        });
        return {
            hasAddCheck,
            hasDeleteCheck,
            hasModifyCheck,
            hasReadCheck,
            hasApproveCheck,
            hasAppendixCheck
        }
    }

    isAllOptionChecked(authList,values){
        const isOnlyRead = authList.length === 1 && authList[0].key === AUTH_READ;
        let {hasAddCheck,hasDeleteCheck,hasModifyCheck,hasReadCheck,hasApproveCheck,hasAppendixCheck} = this.optionTypes(authList);
        return (((hasAddCheck?values.add: true)
            && (hasDeleteCheck?values.delete:true)
            && (hasModifyCheck? values.modify: true)
            && (hasApproveCheck? values.approve: true)
            && (hasReadCheck?values.read:true))
            && (hasAppendixCheck?values.read:true)
            || (isOnlyRead && values.read))
    }

    toggleAllModuleOption(authList,groupId,moduleId,isSelected){
        const { setFieldsValue} = this.props.form;
        let {hasAddCheck,hasDeleteCheck,hasModifyCheck,hasReadCheck,hasApproveCheck,hasAppendixCheck} = this.optionTypes(authList);
        const isOnlyRead = authList.length === 1 && authList[0].key === AUTH_READ;
        if(isOnlyRead){
            setFieldsValue({
                [groupId + '-' + moduleId + '-' + AUTH_READ]: isSelected
            });
        }else{
            hasAddCheck && setFieldsValue({
                [groupId + '-' + moduleId + '-' + AUTH_ADD]: isSelected,
            });
            hasDeleteCheck && setFieldsValue({
                [groupId + '-' + moduleId + '-' + AUTH_DELETE]: isSelected
            });
            hasModifyCheck && setFieldsValue({
                [groupId + '-' + moduleId + '-' + AUTH_MODIFY]: isSelected
            });
            hasReadCheck && setFieldsValue({
                [groupId + '-' + moduleId + '-' + AUTH_READ]: isSelected
            });
            hasApproveCheck && setFieldsValue({
                [groupId + '-' + moduleId + '-' + AUTH_APPROVE]: isSelected
            });
            hasAppendixCheck && setFieldsValue({
                [groupId + '-' + moduleId + '-' + AUTH_APPENDIX]: isSelected
            });
            this.setState((prevState => {
                return {
                    readAuthDisabled: {
                        ...prevState.readAuthDisabled,
                        [moduleId]: isSelected
                    }
                }
            }));
        }

    }
    componentDidMount() {
        //初始化列表数据
        let _this = this;
        this.props.asyncFetchSubAccountAuth(this.props.userId,function(data){
            let readAuthDisabled = {};
            groupList.map(group => {
                let defaultGroupChecked = true;
                group.moduleList.forEach(module => {
                    if (data.authMap) {
                        let values = {
                            add: data.authMap[module.key].add,
                            delete: data.authMap[module.key].delete,
                            modify: data.authMap[module.key].modify,
                            read: data.authMap[module.key].show,
                            approve: data.authMap[module.key].approve,
                            appendix: data.authMap[module.key].appendix,
                        };

                        const isOnlyRead = module.authList.length === 1 && module.authList[0].key === AUTH_READ;
                        module.checked = _this.isAllOptionChecked(module.authList,values);
                        //分组默认值
                        defaultGroupChecked = defaultGroupChecked && module.checked;

                        //设置查看权禁用状态
                        if(!isOnlyRead &&(values.add || values.delete || values.modify || values.approve || values.appendix)){
                            readAuthDisabled[module.moduleId] = true;
                        }
                    }
                });

                group.checked = defaultGroupChecked;
                return group;
            });
            _this.setState({
                readAuthDisabled
            });
            console.log('readAuthDisabled')
        });
    }

    handleAuthCheck = (groupId, moduleList, moduleId, authList, authKey, e) => {
        const {getFieldValue, setFieldsValue} = this.props.form;

        const authModuleValues = moduleList.map(item => {
            return getFieldValue(groupId + '-' + item.moduleId);
        });
        //过滤出模块中值为假的,返回一个数组
        const authModuleUnChecked = authModuleValues.filter(val => {
            return !val
        });

        let authValue = {
            add : getFieldValue(groupId + '-' + moduleId + '-' + AUTH_ADD),
            delete : getFieldValue(groupId + '-' + moduleId + '-' + AUTH_DELETE),
            modify: getFieldValue(groupId + '-' + moduleId + '-' + AUTH_MODIFY),
            approve : getFieldValue(groupId + '-' + moduleId + '-' + AUTH_APPROVE),
            appendix: getFieldValue(groupId + '-' + moduleId + '-' + AUTH_APPENDIX),
            read : getFieldValue(groupId + '-' + moduleId + '-' + AUTH_READ)
        };
        authValue[authKey.split('_')[1].toLowerCase()] = e.target.checked;

        const isOnlyRead = authList.length === 1 && authList[0].key === AUTH_READ;

        //勾选的不是查看权，则把查看权勾选上
        if (e.target.checked) {
            //新增、删除、修改、审批都勾选上则勾选对应的模块名称
            if (isOnlyRead || this.isAllOptionChecked(authList, authValue)) {
                //所有模块都勾选上，分组名称才勾选上（当只有一个没有勾选上时）
                if (authModuleUnChecked.length === 1) {
                    setFieldsValue({
                        [groupId]: true
                    })
                }

                setFieldsValue({
                    [`${groupId}-${moduleId}`]: true
                });
            }

            if (authKey !== AUTH_READ) {
                //设置查看权勾选
                setFieldsValue({
                    [`${groupId}-${moduleId}-${AUTH_READ}`]: true
                });
                this.setState((prevState => {
                    return {
                        readAuthDisabled: {
                            ...prevState.readAuthDisabled,
                            [moduleId]: true
                        }
                    }
                }))
            }
        }
        else {
            //新增、删除、修改全部取消勾选则移除查看的禁用
            if (!authValue.add && !authValue.delete && !authValue.modify && !authValue.approve && authKey !== AUTH_READ) {
                this.setState((prevState => {
                    return {
                        readAuthDisabled: {
                            ...prevState.readAuthDisabled,
                            [moduleId]: false
                        }
                    }
                }));
            }

            //新增、删除、修改只要有一个取消勾选则取消对应模块名称勾选
            setFieldsValue({
                [groupId]: false,
                [`${groupId}-${moduleId}`]: false
            });

        }
    };
    //勾选模块
    handleModuleCheck = (groupId, moduleList, moduleId, authList, e) => {
        const {getFieldValue, setFieldsValue} = this.props.form;

        const authModuleValues = moduleList.map(item => {
            return getFieldValue(groupId + '-' + item.moduleId);
        });

        //过滤出数组中为值为假的
        const authModuleUnChecked = authModuleValues.filter(val => {
            return !val
        });

        if (e.target.checked) {
            //所有模块都勾选上，分组名称才勾选上（当只有一个没有勾选上时）
            if(authModuleUnChecked.length === 1){
                setFieldsValue({
                    [groupId]: true
                })
            }
            this.toggleAllModuleOption(authList,groupId,moduleId,true);
        }
        else {
            //只要有一个模块取消勾选，分组名称就取消勾选
            setFieldsValue({
                [groupId]: false
            });
            this.toggleAllModuleOption(authList,groupId,moduleId,false);

        }
    };

    //勾选分组
    handleGroupCheck = (groupId, moduleList, e) => {
        const {setFieldsValue} = this.props.form;

        if (e.target.checked) {
            moduleList.forEach(module => {
                const authList = module.authList;
                this.toggleAllModuleOption(authList,groupId,module.moduleId,true);
                setFieldsValue({
                    [groupId + '-' + module.moduleId]: true
                });
            });
        }else{
            moduleList.forEach(module => {
                const authList = module.authList;
                this.toggleAllModuleOption(authList,groupId,module.moduleId,false);
                setFieldsValue({
                    [groupId + '-' + module.moduleId]: false
                });
            });
        }
    };



    componentWillUnmount() {
        this.props.emptySubAccountAuth();
    }

    render() {
        const {subAccountAuth, form: {getFieldDecorator}} = this.props;
        const subAccountAuthData = subAccountAuth.getIn(['data', 'data']);
        const vipInfo = subAccountAuthData && subAccountAuthData.get('vipInfo');
        const startTime = vipInfo && vipInfo.get('startTime');
        const endTime = vipInfo && vipInfo.get('endTime');
        let authMap = subAccountAuth && subAccountAuth.getIn(['data', 'authMap']);
        authMap = authMap && authMap.toJS();

        console.log(authMap,'authMap');

        const userName =  vipInfo && vipInfo.get('userName');
        const userNameMain =  vipInfo && vipInfo.get('userNameMain');

        const tBody = groupList.map(group => { //模块分组
            if(authMap){
                //分组索引用：记录循环的模块为当前分组下第几个模块
                let groupIndex = 0;
                let sTime = new Date().getTime();
                let rst = group.moduleList.map(module => {  //模块
                    groupIndex++;
                    const _isAdd = authMap[module.key].add;
                    const _isDelete = authMap[module.key].delete;
                    const _isModify = authMap[module.key].modify;
                    const _isRead = authMap[module.key].show;
                    const _isApprove = authMap[module.key].approve;
                    const _isAppendix = authMap[module.key].appendix;
                    const defaultDataRange = authMap[module.key].dataRange;
                    const isOnlyRead = module.authList.length === 1 && module.authList[0].key === AUTH_READ;

                    let hasAddCheck,
                        hasDeleteCheck,
                        hasModifyCheck,
                        hasReadCheck,
                        hasApproveCheck,
                        hasAppendixCheck;
                    module.authList.forEach(item => {
                        if (item.key === AUTH_ADD) {
                            hasAddCheck = true
                        }
                        else if (item.key === AUTH_DELETE) {
                            hasDeleteCheck = true;
                        }
                        else if (item.key === AUTH_MODIFY) {
                            hasModifyCheck = true;
                        }
                        else if (item.key === AUTH_READ) {
                            hasReadCheck = true;
                        }
                        else if (item.key === AUTH_APPROVE) {
                            hasApproveCheck = true;
                        }
                        else if (item.key === AUTH_APPENDIX){
                            hasAppendixCheck = true;
                        }
                    });
                    module.checked = (((hasAddCheck ? hasAddCheck && _isAdd : true)
                        && (hasDeleteCheck ? hasDeleteCheck && _isDelete : true)
                        && (hasModifyCheck ? hasModifyCheck && _isModify : true)
                        && (hasApproveCheck ? hasApproveCheck && _isApprove : true)
                        && (hasAppendixCheck ? hasAppendixCheck && _isAppendix : true)
                        && (hasReadCheck ? hasReadCheck && _isRead : true)) || (isOnlyRead && _isRead));


                    return (
                        <tr key={module.moduleId}>
                            {/*分组*/}
                            {groupIndex === 1 ? (
                                <td rowSpan={group.moduleList.length}>
                                    {
                                        getFieldDecorator(group.groupId, {
                                            valuePropName: 'checked',
                                            initialValue: group.checked
                                        })(
                                            <Checkbox
                                                onChange={this.handleGroupCheck.bind(this, group.groupId, group.moduleList)}
                                            >
                                                {group.groupName}
                                            </Checkbox>
                                        )
                                    }
                                </td>
                            ) : null}
                            {/*模块*/}
                            <td>
                                {
                                    getFieldDecorator(`${group.groupId}-${module.moduleId}`, {
                                        valuePropName: 'checked',
                                        initialValue: module.checked
                                    })(
                                        <Checkbox
                                            onChange={this.handleModuleCheck.bind(this, group.groupId, group.moduleList, module.moduleId, module.authList)}
                                        >
                                            {module.moduleName}
                                        </Checkbox>
                                    )
                                }
                                {/*数据范围*/}
                                {
                                    module.dataRangeList && module.dataRangeList.length > 0 ? (
                                        <div className={cx('data-range')}>
                                            {
                                                getFieldDecorator('dataRange-' + module.moduleId, {
                                                    initialValue: defaultDataRange
                                                })(
                                                    <Select
                                                        size="small"
                                                    >
                                                        {
                                                            module.dataRangeList && module.dataRangeList.map(dataRange => {
                                                                return (
                                                                    <Option
                                                                        key={dataRange.value}
                                                                        value={dataRange.value}
                                                                    >
                                                                        {dataRange.name}
                                                                    </Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </div>
                                    ) : null
                                }
                            </td>
                            {/*权限*/}
                            <td>
                                {
                                    module.authList && module.authList.map(auth => {
                                        let defaultChecked;
                                        if (auth.key === AUTH_ADD && _isAdd) {
                                            defaultChecked = true;
                                        }
                                        if (auth.key === AUTH_DELETE && _isDelete) {
                                            defaultChecked = true;
                                        }
                                        if (auth.key === AUTH_MODIFY && _isModify) {
                                            defaultChecked = true;
                                        }
                                        if (auth.key === AUTH_READ && _isRead) {
                                            defaultChecked = true;
                                        }
                                        if (auth.key === AUTH_APPROVE && _isApprove) {
                                            defaultChecked = true;
                                        }
                                        if (auth.key === AUTH_APPENDIX && _isAppendix) {
                                            defaultChecked = true;
                                        }
                                        return (
                                            <span key={auth.key}>
                                            {
                                                getFieldDecorator(`${group.groupId}-${module.moduleId}-${auth.key}`, {
                                                    valuePropName: 'checked',
                                                    initialValue: defaultChecked
                                                })(
                                                    <Checkbox
                                                        disabled={auth.key === AUTH_READ ? this.state.readAuthDisabled[module.moduleId] : false}
                                                        onChange={this.handleAuthCheck.bind(this, group.groupId, group.moduleList, module.moduleId, module.authList, auth.key)}
                                                    >
                                                        {auth.name}
                                                    </Checkbox>
                                                )
                                            }
                                        </span>
                                        )
                                    })
                                }
                            </td>
                        </tr>
                    );
                });
                let eTime = new Date().getTime();
                console.log('offset:',eTime-sTime);
                return rst;
            }else{
                return null;
            }

        });

        return (
            <Form>
                <div className={cx("auth-notice")}>
                    <p>{intl.get("account.auth.userName")}：{userName}</p>
                    <p>{intl.get("account.auth.time")}： {startTime ? moment(startTime).format('YYYY年MM月DD日') : null}--{endTime ? moment(endTime).format('YYYY年MM月DD日') : null}</p>
                </div>
                <div className={cx("auth-box") + " mt10"} style={{maxHeight: `calc(100vh - ${TABLE_SCROLL_HEIGHT}px)`}}>
                    <table className={cx("tb-auth")}>
                        <colgroup>
                            <col width="15%"/>
                            <col width="35%"/>
                            <col width="50%"/>
                        </colgroup>
                        <tbody>
                        {tBody}
                        </tbody>
                    </table>
                    <div>
                        {
                            getFieldDecorator('userId',{
                                    initialValue: this.props.userId
                            })(
                                <Input type="hidden"/>
                            )
                        }
                        {
                            getFieldDecorator('userNameSub',{
                                initialValue: this.props.loginName
                            })(
                                <Input type="hidden"/>
                            )
                        }
                        {
                            getFieldDecorator('userNameMain',{
                                initialValue: userNameMain
                            })(
                                <Input type="hidden"/>
                            )
                        }
                    </div>
                </div>
            </Form>
        );
    }
}


const mapStateToProps = (state) => ({
    subAccountAuth: state.getIn(['accountAuth', 'subAccountAuth']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSubAccountAuth,
        emptySubAccountAuth
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Index))
