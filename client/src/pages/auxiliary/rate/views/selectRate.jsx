import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {is} from 'immutable';
import intl from 'react-intl-universal';
import {asyncFetchExpressList, emptyRateListCache} from '../actions'

import RateAdd from './add';
import Auxiliary from 'pages/auxiliary';

import classNames from "classnames/bind";
import styles from "../../project/styles/index.scss";
import PropTypes from "prop-types";
const cx = classNames.bind(styles);

const {Option} = Select;

/**
 * 税率下拉选择框
 *
 * @visibleName SelectRate（税率选择框）
 * @author guozhaodong
 */
class SelectRate extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         */
        // value: PropTypes.string,
        /**
         * 选中option的回调函数
         * @param {string} value 选择的值
         */
        onChange: PropTypes.func,
        /**
         * 最小宽度
         * */
        minWidth: PropTypes.string,
        /**
         * 是否禁用
         * */
        disabled: PropTypes.bool,
        /**
         * 是否显示新建、管理操作
         * */
        showEdit: PropTypes.bool
    };

    static defaultProps = {
        minWidth: '120px',
        showEdit: false,
        disabled: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                value: nextProps.value || 0
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || '';

        this.state = {
            value,
            rateAddVisible: false
        };

        this.setDefaultFlag = false;
        this.initSet = true;
    }

    openModal = (type, auxiliaryKey, auxiliaryTabKey) => {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    };

    closeModal = (type) =>{
        this.setState({
            [type]: false
        })
    };

    handleChange = (value) => {

        if(!value){
            value = ''
        }

        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    };

    //设置初始值
    // setDefault = ()=>{
    //     const { rateList } = this.props;
    //     const rateListData = rateList && rateList.getIn(['rate', 'data', 'data']);
    //
    //     //设置缓存数据默认值
    //     if(rateListData && !this.setDefaultFlag){
    //         let commonSelectedValue = 0;
    //         rateListData.forEach(item=>{
    //             if(item.get('isCommon') === 1){
    //                 this.setDefaultFlag = true;
    //                 commonSelectedValue = item.get('paramName');
    //             }
    //         });
    //         this.handleChange(commonSelectedValue)
    //     }
    // };


    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     // this.setDefaultFlag = this.props.resetDefault;
    //     //没有值传进来就来赋初始值
    //     //已存在的第二行第三行触发
    //     if(prevProps.value !== this.props.value && this.initSet){
    //         this.setDefault();
    //     }
    // }

    componentWillUnmount() {
        //当组件销毁时，把请求的数据缓存清除
        this.props.emptyRateListCache();
    }


    render() {
        const { rateList, showEdit } = this.props;
        const rateListData = rateList && rateList.getIn(['rate', 'data', 'data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    {
                        rateListData && (
                            <Select
                                {...this.props}
                                value={this.state.value.toString()}
                                onChange={(value) => this.handleChange(value)}
                                style={{minWidth: this.props.minWidth}}
                                disabled={this.props.disabled}
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        {
                                            !!showEdit && (
                                                <div className={cx('dropdown-action') + " cf"}>
                                                    <a href="#!" className="fl" onClick={()=>this.openModal('rateAddVisible')}>{intl.get('common.confirm.new')}</a>
                                                    <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'tax', 'rate')}>{intl.get('common.confirm.manage')}</a>
                                                </div>
                                            )
                                        }
                                    </div>
                                )}
                            >
                                {
                                    rateListData && rateListData.map(item => {
                                        return  <Option key={item.get('id')}
                                                        value={item.get('paramName')}>{item.get('paramName')+'%'}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                </div>

                <RateAdd onClose={this.closeModal.bind(this, 'rateAddVisible')} visible={this.state.rateAddVisible} callback={(unit) => {
                    this.props.asyncFetchExpressList('rate', () => {
                        this.handleChange(unit);
                    });
                }}/>
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    defaultTabKey={this.state.auxiliaryTabKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.closeModal.bind(this, 'auxiliaryVisible')}
                />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        rateList: state.getIn(['auxiliaryRate', 'rateList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchExpressList,
        emptyRateListCache
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectRate)
