import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import { Button, Form, Checkbox, message } from "antd";
import {QuestionCircleOutlined} from '@ant-design/icons';
import IntlTranslation from 'utils/IntlTranslation';
import Tooltip from 'components/widgets/tooltip';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {Prompt} from "react-router";
import _ from 'lodash';
import intl from 'react-intl-universal';
const cx = classNames.bind(styles);
import PropTypes from "prop-types";

import {fieldChange, emptyFieldChange, resetInitFinished} from '../actions'

export function create(WrappedComponent) {
    const mapStateToProps = state => ({
        addForm: state.get('addForm')
    });

    const mapDispatchToProps = dispatch => {
        return bindActionCreators({
            fieldChange,
            emptyFieldChange,
            resetInitFinished
        }, dispatch)
    };


    return connect(mapStateToProps, mapDispatchToProps)(
        class Add extends Component {

            constructor(props) {
                super(props);
            }

            componentWillUnmount() {
                this.props.emptyFieldChange();
                this.props.resetInitFinished();
            }

            render() {
                return (
                    <React.Fragment>
                        <WrappedComponent {...this.props}/>
                        <Prompt  message={(location) => {
                            if(this.props.location.pathname === location.pathname){
                                return true;
                            }  else {
                                return intl.get("home.account.tip7");
                            }
                        }} when={this.props.addForm.get('fieldsChanged')}/>
                    </React.Fragment>
                )
            }
        });
}

class AddForm extends Component {

    static propTypes = {
        /**
         * 表单体
         **/
        /*children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element)
        ]).isRequired,*/
        /**
         * 表单底部操作条，可以传入自定义的`ReactElement`，不传则用默认的操作条（包含确定、取消按钮），如果传入`null`则不显示底部操作条
         **/
        footerBar: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object
        ]),
        /**
         * 底部操作条确定按钮文案
         **/
        confirmButtonText: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        /**
         * 底部操作条取消按钮文案
         **/
        cancelButtonText: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        /**
         * 底部操作条提交按钮是否显示`loading`
         **/
        loading: PropTypes.bool,
        /**
         *  当前新建页是否为修改页面
         **/
        isModify: PropTypes.bool,
        /**
         *  是否显示成品入库的checkBox
         **/
        showFinishProductInbound: PropTypes.bool,
    };

    static defaultProps = {
        confirmButtonText: <IntlTranslation intlKey = "home.account.ok"/>,
        cancelButtonText: <IntlTranslation intlKey = "home.account.cancel"/>
    };

    handleSubmit = _.debounce((values) => {
        this.props.onSubmit(values)
    }, 500);

    onCheck = async () => {
        try {
            const values = await this.props.formRef.current.validateFields();
            this.handleSubmit(values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            message.error('存在信息不符合规则，请修改！');
        }
    };

    render() {

        const confirmButton =(
            <Button type="primary" loading={this.props.loading}
                    onClick={this.onCheck}
                    ga-data={'global-form-submit-ok'}>
                {this.props.confirmButtonText}
            </Button>
        );
        return (
            <Form ref={this.props.formRef}
                  onValuesChange = {
                      (values)=>{
                          if (this.props.addForm.get('initFinished')) {
                              this.props.fieldChange()
                          }
                      }
                  }
                  id={this.props.id}
            >
                {this.props.children}
                {
                    this.props.footerBar === null?null:(
                        <div className={cx(["content-fd", {"content-fd-collapsed": this.props.collapsed}])}>
                            {
                                this.props.footerBar ? (
                                    <React.Fragment>
                                        {this.props.footerBar}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {
                                            this.props.confirmButtonRender?this.props.confirmButtonRender(confirmButton):confirmButton
                                        }
                                        <Button type="default" onClick={this.props.history.goBack}
                                                ga-data={'global-form-submit-cancel'}>
                                            {this.props.cancelButtonText}
                                        </Button>
                                    </React.Fragment>
                                )
                            }
                            {
                                (this.props.setContinueAddFlag && !this.props.isModify) ?
                                    (<Checkbox onChange={this.props.setContinueAddFlag} className={cx('continue-new')} checked={this.props.continueAddFlag}>
                                        连续新建</Checkbox>): null
                            }
                            {
                                (this.props.setFinishProductInboundFlag) ?
                                    (
                                        <React.Fragment>
                                            <Checkbox onChange={this.props.setFinishProductInboundFlag} className={cx('continue-new')}>
                                                成品入库</Checkbox>
                                            <Tooltip
                                                type="info"
                                                title={"将委外加工单中的成品直接做同步入库操作"}
                                            >
                                                <QuestionCircleOutlined  className={cx("scan-tip")}/>
                                            </Tooltip>
                                        </React.Fragment>
                                    ) : null
                            }
                        </div>
                    )
                }

            </Form>
        )
    }
}

const TopOpe = (props) => {
    return (
        <div className={cx("add-top-ope")}>
            <div className="ope-r">
                {props.children}
            </div>
        </div>
    )
};

const BaseInfo = (props) => {
    return (
        <div className={cx("add-base-info")}>
            {props.children}
        </div>
    )
};

const ProdList = (props) => {
    return (
        <div className={cx("add-prod-list")}>
            {props.children}
        </div>
    )
};

const OtherInfo = (props) => {
    return (
        <div className={cx("add-other-info")}>
            {props.children}
        </div>
    )
};

const mapStateToProps = state => ({
    collapsed: state.getIn(['sider', 'collapsed'])
});

const AddFormCopy = withRouter(connect(mapStateToProps)(AddForm));

AddFormCopy.create = create;

AddFormCopy.TopOpe = TopOpe;

AddFormCopy.BaseInfo = BaseInfo;

AddFormCopy.ProdList = ProdList;

AddFormCopy.OtherInfo = OtherInfo;

export default AddFormCopy;



