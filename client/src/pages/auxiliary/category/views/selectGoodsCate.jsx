import React, {Component} from 'react';
import {TreeSelect} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import Auxiliary from 'pages/auxiliary';
import {asyncFetchCateList} from '../actions'

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

const {TreeNode} = TreeSelect;


/**
 * 选择物品类目
 *
 * @visibleName SelectGoodsCate（选择物品类目）
 * @author guozhaodong
 *
 */
class SelectGoodsCate extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         * */
        value: PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
        }),
        /**
         * 是否需要隐藏平台同步产品类目
         * */
        hideCnGroup: PropTypes.bool,
        /**
         * value值变化之后的回调
         * */
        onChange: PropTypes.func,
        /**
         * 是否隐藏最下方的管理入口
         * */
        hideManage: PropTypes.bool
    };

    static defaultProps ={
        hideCnGroup: false,
        hideManage: false
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
            value: value.value || '',
            label: value.label || '',
            auxiliaryVisible: false,
            auxiliaryKey: ''
        };
    }

    handleOpen(type, auxiliaryKey) {
        this.setState({
            [type]: true,
            auxiliaryKey
        })
    }

    handleClose(type) {
        this.setState({
            [type]: false
        })
    }

    // 根据父级找到所有子级节点
    getByParentCode(parentCatCode) {
        const {cateList} = this.props;
        const cateListData = cateList.getIn(['data', 'catTree']);

        return cateListData && cateListData.size>0 && cateListData.filter(item => {
            let itemParentCatCode = item.get('parentCatCode');
            if(itemParentCatCode === ''){
                itemParentCatCode = undefined;
            }
            return itemParentCatCode === parentCatCode;
        })
    }


    renderTreeNodes = parentCatCode => {
        const subNodes = this.getByParentCode(parentCatCode);
        if (subNodes && subNodes.size > 0) {
            let tempSubNodes = subNodes;
            if(this.props.hideCnGroup){
                tempSubNodes = subNodes.filter(item=> item.get('code') !== 'sync')
            }
            return tempSubNodes.map(item => {
                return (
                    <TreeNode value={item.get('code')} title={item.get('name')} key={item.get('recId')}>
                        {this.renderTreeNodes(item.get('code'))}
                    </TreeNode>
                );
            });
        }
    };


    handleChange = (value) => {

        const valueObj = value ? value : {
            value: '',
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
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchCateList();
    }


    render() {
        const cateListData = this.props.cateList.getIn(['data', 'catTree']);
        return (
            <React.Fragment>
                <TreeSelect
                    style={{minWidth: 200}}
                    value={this.state.value?{value: this.state.value, label: this.state.label}:undefined}
                    onChange={this.handleChange}
                    dropdownStyle={{maxHeight: 430, overflow: 'hidden'}}
                    placeholder={intl.get("auxiliary.category.category")}
                    allowClear={!!this.state.value}
                    showSearch
                    labelInValue
                    showCheckedStrategy={TreeSelect.SHOW_ALL}
                >
                    {cateListData && cateListData.size>0?this.renderTreeNodes():''}
                    {this.props.hideManage?'':(
                        <TreeNode
                            title={(
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    return false;
                                }}
                                     className={cx("mag-wrap")}
                                >
                                    <a href="#!" className={cx("mag-btn")}
                                       onClick={() => this.handleOpen('auxiliaryVisible', 'category')}>{intl.get('common.confirm.manage')}</a>
                                </div>
                            )}
                            className={cx("cate-manage")}
                            key={'add'}
                            selectable={false}
                            disableCheckbox={true}
                        >
                        </TreeNode>
                    )}

                </TreeSelect>
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.handleClose.bind(this, 'auxiliaryVisible')}
                />
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        cateList: state.getIn(['auxiliaryCate', 'cateList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCateList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectGoodsCate)
