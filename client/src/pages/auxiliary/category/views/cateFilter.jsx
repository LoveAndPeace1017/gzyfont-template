import React, {Component} from 'react';
import {Button, message, Modal, Spin, Tree} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Tooltip from 'components/widgets/tooltip';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";

const cx = classNames.bind(styles);
import stylesCate from "../styles/index.scss";

const cxCate = classNames.bind(stylesCate);

import {asyncFetchCateList, asyncDelCate} from "../actions";

const {TreeNode} = Tree;

class CateFilter extends Component {
    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if(nextProps.catCode || nextProps.expandedKeys){
            return {
                selectedKeys: [nextProps.catCode],
                expandedKeys: nextProps.expandedKeys
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            selectAll: false,
            selectedKeys: [],
            expandedKeys: []
        };
    }

    // 根据父级找到所有子级节点
    getByParentCode(parentCatCode) {
        const {cateList} = this.props;
        const cateListData = cateList.getIn(['data', 'catTree']);

        return cateListData && cateListData.filter(item => {
            let itemParentCatCode = item.get('parentCatCode');
            if(itemParentCatCode === ''){
                itemParentCatCode = undefined;
            }
            return  itemParentCatCode === parentCatCode;
        })
    }

    renderTreeNodes = parentCatCode => {
        const subNodes = this.getByParentCode(parentCatCode);
        if (subNodes && subNodes.size > 0) {
            return subNodes.map(item => {
                return (
                    <TreeNode
                        title={item.get('name')}
                        key={item.get('code')}
                    >
                        {this.renderTreeNodes(item.get('code'))}
                    </TreeNode>
                );
            });
        }
    };

    selectAll = () => {
        this.setState({
            selectAll: true,
            selectedKeys: []
        });
        this.props.onSelect();
    };

    select = (selectedKeys) =>{
        this.setState({
            selectAll: false,
            selectedKeys
        });
        this.props.onSelect(selectedKeys);
    };

    expand = (expandedKeys) => {
        this.setState({
            expandedKeys
        });
        this.props.onExpand(expandedKeys);
    };

    componentDidMount() {
        this.props.asyncFetchCateList();
    }

    render() {

        return (
            <React.Fragment>
                <Spin
                    spinning={this.props.cateList.get('isFetching') }
                >
                    <div>
                        <span className={cxCate(["tree-all",{"tree-all-selected": this.state.selectAll}])} onClick={this.selectAll}>{intl.get("auxiliary.category.allGoods")}</span>
                    </div>
                    <Tree
                        onSelect={this.select}
                        onExpand={this.expand}
                        className={cxCate("tree-filter")}
                        selectedKeys={this.state.selectedKeys}
                        expandedKeys={this.state.expandedKeys}
                    >
                        {this.renderTreeNodes()}
                    </Tree>
                </Spin>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cateList: state.getIn(['auxiliaryCate', 'cateList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCateList,
        asyncDelCate
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(CateFilter)
