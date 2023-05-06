import React, {Component} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Select, Button } from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import {asyncFetchSuggestsByKey} from '../actions'
import PropTypes from 'prop-types';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const {Option} = Select;

/**
 * 联想搜索框
 *
 * @visibleName SuggestSearch（联想搜索框）
 * @author guozhaodong
 */
class SuggestSearch extends Component {

    static propTypes = {
        /**
         * 搜索框暗注释
         **/
        placeholder: PropTypes.string,
        /**
         * 联想匹配到的选项，选择某一下拉项后的回调
         **/
        onSearch: PropTypes.func,
        /**
         * 联想搜索的接口地址（后端的接口），如果接口为/pc/v1/${userIdEnc}/saleorders/search/tips，那么url="/saleorders/search/tips"
         **/
        url: PropTypes.string.isRequired,
        /**
         * 联想搜索的接口地址前缀（后端的接口），默认的接口前缀为/pc/v1/${userIdEnc}
         **/
        urlPrefix: PropTypes.string,
        /**
         * 搜索框默认值
         **/
        defaultValue: PropTypes.string,
        /**
         * 搜索框可输入最大字符数
         **/
        maxLength: PropTypes.number,
        /**
         * 搜索框值变化后的回调
         **/
        onSearchChange: PropTypes.func,
        /**
         * 搜索框的值
         **/
        value: PropTypes.string,
        /**
         * 搜索框后缀图标
         **/
        suffixIcon: PropTypes.bool,
        /**
         * 搜索框样式
         **/
        style: PropTypes.object
    };

    static defaultProps = {
        maxLength: 50
    };

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                value: nextProps.value
            };
        }
        return null;
    }

    constructor(props) {
        super(props);
        //值必须为undefined，才会显示placeholder
        const value = props.value || undefined;

        this.state = {
            value: value? value: props.defaultValue && props.defaultValue!==''?props.defaultValue:undefined
        };
    }

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    handleSearchChange = (value) => {
        const {url, urlPrefix} = this.props;
        const maxLength = this.props.maxLength;

        url && this.props.asyncFetchSuggestsByKey(url, urlPrefix, value, this.props.params);

        if(value && value.length<= maxLength){
            this.setState({value});
            this.triggerChange(value);

            const onSearchChange = this.props.onSearchChange;
            if (onSearchChange) {
                onSearchChange();
            }
        }
    };

    //只有输入框的值改变了才会触发,如果只用这个匹配朱来的下拉框只有一个值它和下拉框完全匹配，会自动选中，这样选择这个值的时候不会触发change事件
    handleChange = (value) => {
        if(!value){
            if (!('value' in this.props)) {
                this.setState({
                    value
                });
            }

            this.triggerChange(value);
            this.props.onSearch && this.props.onSearch(value?value:'');
        }
    };

    //只要选中就会触发，基于上面change实现不了所以就用select事件，但是如果清楚输入框的值是不能触发这个事件的，所以还需要上面change事件来弥补
    handleSelect = (value) => {
        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }

        this.triggerChange(value);
        this.props.onSearch && this.props.onSearch(value?value:'');
    };

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    };

    handleEnter=(e)=>{
        if(e.keyCode=== 13){
            this.props.onSearch(this.state.value?this.state.value:'');
        }
    };

    render() {

        const {suggests,url} = this.props;
        const suggestsData = suggests && suggests.getIn(['data', 'data']);
        return (
            <div className={cx("suggest-search")}>
                <Select
                    value={this.state.value &&this.state.value!==''?this.state.value:undefined}
                    showSearch
                    allowClear={true}
                    showArrow={this.props.suffixIcon ? true : false}
                    defaultActiveFirstOption={false}
                    onSearch={this.handleSearchChange}
                    onChange={this.handleChange}
                    filterOption={false}
                    placeholder={this.props.placeholder}
                    style={{width:'100%', ...this.props.style}}
                    suffixIcon={this.props.suffixIcon}
                    className={cx("suggest")}
                    dropdownClassName={cx("suggest-dropdown")}
                    onSelect={this.handleSelect}
                    onInputKeyDown={this.handleEnter}
                >
                    {
                        url && suggestsData && suggestsData.size>0 && suggestsData.map((item, index) =>
                            <Option
                                key={index}
                                value={item}
                            >
                                {item}
                            </Option>
                        )
                    }
                </Select>
                <Button type="primary" icon={<SearchOutlined />} ga-data={this.props['ga-data']} className={cx("search-btn")} onClick={()=>this.props.onSearch && this.props.onSearch(this.state.value?this.state.value:'')}/>
                {/*<Icon type="search" />*/}
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        suggests: state.getIn(['suggestSearch', 'suggests'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSuggestsByKey
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SuggestSearch)
