import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import 'url-search-params-polyfill';
import _ from 'lodash';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import { Form, Modal, Button, message } from 'antd';
import SpecGoodsTable from './specGoodsTable';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from 'moment-timezone';
import {asyncAddGoodsForDetail} from 'pages/goods/multiGoodsAdd/actions';

moment.tz.setDefault("Asia/Shanghai");

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addGoods: state.getIn(['multiGoodsAdd', 'addGoods'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddGoodsForDetail
    }, dispatch)
};

/**
 * 多规格表格
 *
 * @visibleName Index（多规格table）
 * @author jinb
 */
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {
    formRef = React.createRef();

    static propTypes = {
        /**
         *   弹层的显示与隐藏
         **/
        visible: PropTypes.bool,
        /**
         *   规格属性数组
         **/
        specDefine: PropTypes.array,
        /**
         *   规格对应的物品数据
         **/
        specProds: PropTypes.object,
        /**
         *   规格最大数量
         **/
        maxLength: PropTypes.number,
        /**
         *   物品编号
         **/
        billNo: PropTypes.string
    };

    constructor(props) {
        super(props);

        let specObj = this.initSpecName(props.specDefine);
        this.state = {
            specDefine: props.specDefine,
            ...specObj
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.specDefine.length!==this.state.specDefine.length || this.mergeSpecGroup(prevProps.specDefine)!==this.mergeSpecGroup(this.state.specDefine)){
            this.setState({
                specDefine: prevProps.specDefine,
                ...this.initSpecName(prevProps.specDefine)
            })
        }
    }

    mergeSpecGroup = (specDefine) => {
        return specDefine.map(item=>item.specName).join('&&&');
    };

    // 初始化规格名称
    initSpecName = (specDefine) => {
        let obj = {}, out = {};
        specDefine.forEach(item =>
            obj[item.specName] = item.specValues);
        let keys = Object.keys(obj);
        for(let i=0;i<3;i++){
            out['specName'+(i+1)] = keys[i] || '';
        }
        return out;
    };

    // 新增规格提交
    handleSubmit = async (values) => {
        console.log(values, 'values');
        let formData = values.mulSpecList;
        // 校验规格最大数量
        await this.validateMaxLength(formData);
        // 校验已经填写的表单中是否存在相同的规格
        let specObj = await this.validateSpecRepeatToForm(formData);
        // 与后台已经存在的后台数据进行校验
        await this.validateSpecRepeatToBackendData(specObj);
        // 初始化提交表单的数据 dataSpecList
        this.dealDataSpecList(values);
        // 初始化提交表单的数据 mulSpecList
        this.dealMulSpecList(values);
        // 提交规格表单数据给后台
        this.asyncSubmitSpecData(values);
    };

    // 校验规格最大数量
    validateMaxLength = (formData) => {
        return new Promise((resolve, reject) => {
            let {specProds, maxLength} = this.props;
            if(Object.keys(specProds).length + formData.length > maxLength){
                message.warning(`生成的组合数量不能超过${maxLength}个！`);
                reject();
            }
            resolve();
        });
    };

    // 给对象排序
    sortObject = (obj) => {
        let out = {};
        let array = Object.keys(obj).sort();
        array.forEach(item => {
            out[item] = obj[item];
        });
        return out
    };

    // 校验已经填写的表单中是否存在相同的规格
    validateSpecRepeatToForm = (formData) => {
        return new Promise((resolve, reject) => {
            let specNum = this.props.specDefine.length;
            let specObj = {};
            for(let item of formData){
                let keyObj = {};
                for(let i=1;i<=specNum;i++){
                    keyObj[this.state['specName'+i]] = item['spec'+i];
                }
                let key = JSON.stringify(this.sortObject(keyObj));
                if(specObj[key]){
                    message.warning(key+'为重复规格');
                    reject();
                    break;
                }
                specObj[key] = item;
            }
            resolve(specObj);
        })
    };

    // 与后台已经存在的后台数据进行校验
    validateSpecRepeatToBackendData = (specObj) => {
        return new Promise((resolve, reject) => {
            let {specProds} = this.props;
            for(let key in specObj){
                if(specProds[key]){
                    message.warning(key+'为重复规格');
                    reject();
                    break;
                }
                specProds[key] = specObj[key];
            }
            resolve();
        })
    };

    // 初始化提交表单的数据 dataSpecList
    dealDataSpecList = (values) => {
        // specDefine
        let {specDefine} = this.props;
        let dataSpecList = _.cloneDeep(specDefine);
        dataSpecList= dataSpecList.map(item => {
           item.specValues = JSON.parse(item.specValues);
           return item;
        });
        for(let item of values.mulSpecList){
            for(let i=0;i<dataSpecList.length;i++){
                for(let j=1;j<=dataSpecList.length;j++){
                    if(dataSpecList[i].specName===this.state['specName'+j] && dataSpecList[i].specValues.indexOf(item['spec'+j])===-1){
                        dataSpecList[i].specValues.push(item['spec'+j]);
                    }
                }
            }
        }
        values.dataSpecList = dataSpecList;
    };

    // 初始化提交表单的数据 mulSpecList
    dealMulSpecList = (values) => {
        let {specDefine} = this.props;
        values.mulSpecList = values.mulSpecList.map(item => {
            let specData = {};
            for(let i=1;i<=specDefine.length;i++){
                specData[this.state['specName'+i]] = item['spec'+i];
            }
            item.specData = JSON.stringify(specData);
            return item;
        });
    };

    // 提交规格表单数据给后台
    asyncSubmitSpecData = (values) => {
        let {billNo} = this.props;
        console.log(values, 'values');
        this.props.asyncAddGoodsForDetail(billNo, values, (res) => {
            if(res.data && res.data.retCode==='0'){
                message.success('操作成功!');
                this.props.onOk && this.props.onOk();
            } else {
                message.error(res.data.retValidationMsg.msg[0].msg);
            }
        })
    };

    getSpecGoodsTableRef = (specGoodsTableRef) => {
        this.specGoodsTableRef = specGoodsTableRef;
    };

    render() {
        let {specName1, specName2, specName3} = this.state;

        const tailLayout = {
            wrapperCol: { offset: 20, span: 16 },
        };

        return (
            <React.Fragment>
                <Modal
                    title={'添加规格'}
                    visible={this.props.visible}
                    onCancel={this.props.onClose}
                    width={1200}
                    destroyOnClose={true}
                    forceRender={true}
                    footer={null}
                >
                    <Form ref={this.formRef}
                          onFinish={(values) => {
                              this.handleSubmit(values);
                          }}
                    >
                        {
                            this.formRef.current  && (
                                <SpecGoodsTable
                                    formRef={this.formRef}
                                    dataPrefix={'mulSpecList'}
                                    specName1={specName1}
                                    specName2={specName2}
                                    specName3={specName3}
                                    source={'detail'}
                                    getRef={this.getSpecGoodsTableRef}
                                />
                            )
                        }

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                确定
                            </Button>
                            <Button onClick={this.props.onClose} style={{marginLeft: 10}}>
                                取消
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        )
    }
}

