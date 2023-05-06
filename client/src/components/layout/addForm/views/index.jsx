import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox } from "antd";
import IntlTranslation from 'utils/IntlTranslation'
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {Prompt} from "react-router";
import _ from 'lodash'
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


    return connect(mapStateToProps, mapDispatchToProps)(Form.create({
        onValuesChange: (props) => {
            if (props.addForm.get('initFinished')) {
                props.fieldChange()
            }
        }
    })(class Add extends Component {

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
    }));
}

/**
 * `AddForm`组件是对`antd`的`Form`组件进行了二次封装，同时它也提供了`create`方法可以获取表单的一些方法
 *  另外它提供了一个离开页面表单未保存的弹框提示，这个弹框只有在页面表单元素没有任何改变的情况下才会触发.
 *  完成这个监听的动作需要在我们调用表单的页面（一般为我们的新增修改页面）添加一个方法`emptyFieldChange`,**需要在页面的请求完成后调用，防止初始化对表单的赋值触发了该提示弹层**.
 *
 * @visibleName AddForm（表单）
 * @author guozhaodong
 */
class AddForm extends Component {

    static propTypes = {
        /**
         * 表单体
         **/
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element)
        ]).isRequired,
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
        confirmButtonText:PropTypes.oneOfType([
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
    };

    static defaultProps = {
        confirmButtonText: <IntlTranslation intlKey = "home.account.ok"/>,
        cancelButtonText: <IntlTranslation intlKey = "home.account.cancel"/>
    };

    handleSubmit = _.debounce((e) => {
        e.persist();
        e.preventDefault();
        this.props.onSubmit(e)
    }, 500);

    render() {
        const confirmButton =(
            <Button type="primary" loading={this.props.loading}
                    onClick={this.handleSubmit}
                    ga-data={'global-form-submit-ok'}>
                {this.props.confirmButtonText}
            </Button>
        );
        return (
            <Form id={this.props.id}>
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


