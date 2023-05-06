import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import { AutoComplete, Input  } from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {asyncFetchSuggestsByKey} from '../actions'

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

/**
 * 联想搜索框
 * @visibleName SuggestInput（联想搜索框）
 * @author jinb
 */
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

@connect(mapStateToProps, mapDispatchToProps)
export default class SuggestInput extends Component {
    static propTypes = {
        /**  下拉菜单和选择器同宽。默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 **/
        dropdownMatchSelectWidth: PropTypes.any,
        /**  搜索框暗注释 **/
        placeholder: PropTypes.string,
        /** 搜索框样式 **/
        style: PropTypes.object,
        /** 联想匹配到的选项，选择某一下拉项后的回调**/
        onSearch: PropTypes.func,
        /** 联想搜索的接口地址（后端的接口），如果接口为/pc/v1/${userIdEnc}/saleorders/search/tips，那么url="/saleorders/search/tips" **/
        url: PropTypes.string.isRequired,
        /** 联想搜索的接口地址前缀（后端的接口），默认的接口前缀为/pc/v1/${userIdEnc} **/
        urlPrefix: PropTypes.string,
        /** 搜索框默认值  **/
        defaultValue: PropTypes.string,
        /** 搜索框可输入最大字符数 **/
        maxLength: PropTypes.number,
        /** 搜索框的值 **/
        value: PropTypes.string,
        /** 搜索框后缀图标 **/
        suffixIcon: PropTypes.bool,
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
        const value = props.value ||
            props.defaultValue || undefined;
        this.state = {
            value
        }
    }

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    // 搜索建议词发生变化
    handleSearch = (value) => {
        const {url, urlPrefix} = this.props;
        // 获取搜索建议词
        if(url) this.props.asyncFetchSuggestsByKey(url, urlPrefix, value, this.props.params);

    };

    // 当输入发生变化
    handleChange = (value) => {
        // 如果没有值，执行列表搜索操作
        if(!value) {
            value = '';
            this.handleSearchByKey(value);
        }
        this.setState({value});
    };

    // 键盘enter事件
    handleEnter = (event) => {
        if(event.keyCode === 13){
            let value = e.target.value;
            this.handleSearchByKey(value);
        }
    };

    // 搜索操作
    handleSearchByKey = (value) => {
        const {onSearch} = this.props;
        if(onSearch) onSearch(value);
    };

    // 初始化select数据
    initSelectOption = (data) => {
        if(data && data.size>0){
            return data.map(item => {
                    return {
                        value: item,
                        label: (
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span>{item}</span>
                            </div>
                        )
                    }
                }
            )
        }
        return null;
    };

    render() {
        const {value} = this.state;
        const {suggests, style, dropdownMatchSelectWidth, placeholder} = this.props;
        const suggestsData = suggests && suggests.getIn(['data', 'data']);
        let options = this.initSelectOption(suggestsData);
        return (
            <div className={cx('suggest-input')}>
                <AutoComplete
                    allowClear
                    value={value}
                    dropdownMatchSelectWidth={dropdownMatchSelectWidth || true}
                    style={{ width: 350 , ...style}}
                    options={options}
                    onSelect={this.handleSearchByKey}
                    onSearch={this.handleSearch}
                    onChange={this.handleChange}
                    onInputKeyDown={this.handleEnter}
                >
                    <Input.Search size="middle"
                                  onSearch={this.handleSearchByKey}
                                  placeholder={placeholder}
                                  enterButton />
                </AutoComplete>
            </div>
        );
    }
}

