import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import PropTypes from 'prop-types';
import AbizAllCate from '../dependencies/abizAllCate';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
const {Option} = Select;

/**
 * 百卓物品匹配类目，目前用在询价单新增页面
 *
 * @visibleName AbizCate（百卓物品匹配类目）
 * @author guozhaodong
 */
class AbizCate extends Component {

    static propTypes = {
        /**
         * 初始的下拉选项列表数据
         * eg: {0_2744070000: ["家具摆设","桌类家具","咖啡桌和茶几"],1_2744070000: ["家具摆设","桌类家具","咖啡桌和茶几"]}
         **/
        initOptions: PropTypes.object,
        /**
         * 下拉选项是否展开
         **/
        open: PropTypes.bool,
        /**
         * 当下拉选项展开时的回调
         **/
        onDropdownVisibleChange: PropTypes.func,
        /**
         * 当value改变的回调
         **/
        handleChange: PropTypes.func,
        /**
         * 当选择所有类目之后的回调
         **/
        onSelectAllCate: PropTypes.func,
        /**
         * placeholder
         **/
        placeholder: PropTypes.string,
        /**
         * 是否禁用
         **/
        disabled: PropTypes.bool
    };

    static defaultProps = {
        placeholder: ''
    };

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || {};

        this.state = {
            key: value.key || '',
            label: value.label || '',
            abizAllCateVisible: false
        };
    }

    openModal = (tag)=>{
        this.setState({
            [tag]:true
        })
    };

    closeModal = (tag)=>{
        this.setState({
            [tag]:false
        })
    };

    beforeChange = (callback)=>{
        if(this.props.beforeChange){
            this.props.beforeChange(callback);
        }else{
            callback();
        }
    };

    handleChange = (value) => {
        this.beforeChange(()=>{

            const valueObj = value ? value : {
                key: '',
                label: ''
            };

            if (!('value' in this.props)) {
                this.setState({
                    ...valueObj
                });
            }

            const onChange = this.props.onChange;
            if (onChange) {
                onChange(valueObj);
            }
        })
    };


    render() {
        const {initOptions } = this.props;

        const selectProps = {
            allowClear: true,
            value: {key: this.state.key, label: this.state.label},
            placeholder: this.props.placeholder || '',
            onChange: this.handleChange,
            disabled: this.props.disabled,
            style: {minWidth: '150px'}
        };

        if('open' in this.props){
            selectProps.open = this.props.open;
        }
        if('onDropdownVisibleChange' in this.props){
            selectProps.onDropdownVisibleChange = this.props.onDropdownVisibleChange;
        }

        return (
            <React.Fragment>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        {...selectProps}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                <div className={cx('dropdown-action') + " cf"}>
                                <span className="fl">
                                    {intl.get("components.abizCate.index.message1")}
                                    <a href="#!" onClick={()=>this.openModal('abizAllCateVisible')}>
                                        {intl.get("components.abizCate.index.message2")}
                                    </a>
                                </span>
                                </div>
                            </div>
                        )}
                        labelInValue
                    >
                        {
                            initOptions && Object.keys(initOptions).map(function(cateCode){
                                const catCode = cateCode.split('_')[1];
                                return <Option key={catCode}
                                               value={catCode}
                                >{initOptions[cateCode].join('>')}</Option>
                            })
                        }
                    </Select>
                </div>
                <AbizAllCate
                    visible={this.state.abizAllCateVisible}
                    onClose={()=>this.closeModal('abizAllCateVisible')}
                    onOk={this.props.onSelectAllCate}
                />
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(AbizCate)
