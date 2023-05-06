import React, {Component} from 'react';
import Icon from 'components/widgets/icon';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default class AppSearch extends  Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: props.word,
            isClearBtnShow: false
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.word && nextProps.word !== this.state.searchInput){
            this.setState({searchInput: nextProps.word})
        }
    }

    handleEnter = (e) => {
        let keyNum = (e.keyCode ? e.keyCode : e.which);
        let value = e.target.value;
        if(keyNum === 13){
            this.doSearch(value);
        }
    };

    doSearch = (val) => {
        this.props.doSearch(val);
    };

    handleChange = (e) => {
        let value = e.target.value;
        let visibleFlag = (value.trim().length > 0);
        this.setState({searchInput: value, isClearBtnShow: visibleFlag});
    };

    clearSearchInfo = () => {
        this.setState({isClearBtnShow: false, searchInput: ''});
        this.props.doSearch('');
    };


    render() {
        const {searchInput, isClearBtnShow} = this.state;
        const {placeholder} = this.props;

        return (
            <React.Fragment>
                <div className={cx('search-bar')}>
                    <input type="text"
                           value={searchInput}
                           placeholder={placeholder || '请输入产品名称'}
                           className={cx('search-input')}
                           onChange={(e) => this.handleChange(e)}
                           onKeyPress={(e) => this.handleEnter(e)}
                    />
                    {/*<p className={cx('search-go-btn')} onClick={() => {this.doSearch(searchInput)}}>搜索</p>*/}
                    <span className={cx('search-filter')}>
                        <Icon type="icon-filter" style={{'fontSize': '16px'}} onClick={() => {this.props.changeStatus()}}/>
                    </span>
                    {
                        isClearBtnShow && (
                            <span className={cx('search-clear')} onClick={()=>{this.clearSearchInfo()}}>
                                <Icon type="close-circle"/>
                            </span>
                        )
                    }
                </div>
            </React.Fragment>
        )
    }
}

