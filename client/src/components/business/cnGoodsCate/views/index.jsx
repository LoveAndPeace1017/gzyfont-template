import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import {asyncFetchCnGoodsCateList} from '../actions'
const {Option} = Select;
import PropTypes from 'prop-types';
import IntlTranslation from 'utils/IntlTranslation'

/**
 * 中文站物品类目，目前应该只用在导入内贸站物品的弹层筛选项上面
 *
 * @visibleName CnGoodsCate（中文站物品类目）
 * @author guozhaodong
 */
class CnGoodsCate extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         * */
        value: PropTypes.shape({
            key: PropTypes.string,
            label: PropTypes.string
        }),
        /**
         * 暗注释
         * */
        placeholder: PropTypes.string,
        /**
         * 选择后，执行onChange之前的回调
         * @param {func} callback 改变值的回调函数
         */
        beforeChange: PropTypes.func,
        /**
         * 选中 option的回调
         * @param {object} LabeledValue 选择的值
         **/
        onChange: PropTypes.func,
        /**
         * 是否禁用
         * */
        disabled: PropTypes.bool,
        /**
         * 是否展开下拉菜单
         **/
        open: PropTypes.bool,
        /**
         * 展开下拉菜单的回调
         * @param {bool} open 是否展开下拉
         **/
        onDropdownVisibleChange: PropTypes.func
    };

    static defaultProps = {
        placeholder: <IntlTranslation intlKey = "home.account.title1"/>,
        disabled: false
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
            label: value.label || ''
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

    componentDidMount() {
        this.props.asyncFetchCnGoodsCateList();
    }


    render() {
        const {cnGoodsCateList } = this.props;

        const cnGoodsCateListData = cnGoodsCateList.getIn(['data', 'data']);

        const selectProps = {
            allowClear: true,
            value: this.state.key && this.state.key !== ''?{key: this.state.key, label: this.state.label}:undefined,
            placeholder: this.props.placeholder,
            onChange: this.handleChange,
            disabled: this.props.disabled,
            style: {minWidth: '100px'}
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
                        labelInValue
                    >
                        {
                            cnGoodsCateListData && cnGoodsCateListData.map(function(item){
                                return <Option key={item.get('groupIdEnc')}
                                               value={item.get('groupIdEnc')}
                                >{item.get('groupName')}</Option>
                            })
                        }
                    </Select>
                </div>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        cnGoodsCateList: state.getIn(['cnGoodsCate', 'cnGoodsCateList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCnGoodsCateList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(CnGoodsCate)
