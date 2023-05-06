import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, message, Modal, Tree} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Tooltip from 'components/widgets/tooltip';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";

const cx = classNames.bind(styles);
import stylesCate from "../styles/index.scss";

const cxCate = classNames.bind(stylesCate);

import Add from './add';
import {asyncFetchCateList, asyncDelCate} from "../actions";

const {DirectoryTree, TreeNode} = Tree;
const confirm = Modal.confirm;

class Index extends Component {

    state = {
        addModalVisible: false,
        curCateData: ''
    };

    openModal = ({code, cateName, parentCatCode, parentCatName, level}) => {
        this.setState({
            addModalVisible: true,
            curCateData: {
                code,
                cateName,
                parentCatCode,
                parentCatName,
                level
            }
        });
    };

    closeModal = () => {
        this.setState({
            addModalVisible: false
        })
    };

    deleteConfirm = (code) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get('common.confirm.content1'),
            onOk() {
                _this.props.asyncDelCate(code, (res) => {
                    if (res.data.retCode === '0') {
                        message.success(intl.get('common.confirm.success'));
                        //重新获取列表数据
                        _this.props.asyncFetchCateList();
                    }
                    else {
                        alert(res.data.retMsg)
                    }
                })
            },
            onCancel() {
            },
        });
    };

    // 根据父级找到所有子级节点
    getByParentCode(parentCatCode) {
        const {cateList} = this.props;
        const cateListData = cateList.getIn(['data', 'catTree']);

        return cateListData && cateListData.filter(item => {
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
            return subNodes.map(item => {
                return (
                    <TreeNode title={
                        <React.Fragment>
                            {item.get('code')==='other' || item.get('code')==='sync'?(<span className={cxCate("tree-title")}>{item.get('name')}<span className="gray">{intl.get("auxiliary.category.tip1")}</span></span>):<span className={cxCate("tree-title")}>{item.get('name')}</span>}
                            <div className={cxCate("tree-ope")} onClick={(e) => {
                                e.stopPropagation()
                            }}>

                                {item.get('level') === '3'|| item.get('code') === 'other' || item.get('code')==='sync' ? null : (
                                    <React.Fragment>
                                        <a href="#!" className={cxCate("add")}
                                           onClick={this.openModal.bind(this, {
                                               parentCatCode: item.get('code'),
                                               parentCatName: item.get('name'),
                                               level: item.get('level') === '1'?'2':'3'
                                           })}>{intl.get("auxiliary.category.add")}</a>
                                        <span className={cxCate("split")}/>
                                    </React.Fragment>
                                )}
                                { item.get('code') === 'other' || item.get('code')==='sync' ? null :(<React.Fragment>
                                <a href="#!" className={cxCate("modify")}
                                   onClick={this.openModal.bind(this, {
                                       code: item.get('code'),
                                       cateName: item.get('name'),
                                       parentCatCode: item.get('parentCatCode'),
                                       parentCatName: item.get('parentCatName')
                                   })}>{intl.get("common.confirm.editor")}</a>
                                <span className={cxCate("split")}/>
                                </React.Fragment>)}
                                {
                                    item.get('code') === 'other' || item.get('code')==='sync' ? null : this.getByParentCode(item.get('code')).size > 0? (
                                        <Tooltip
                                            type="info"
                                            title={intl.get("common.confirm.tip2")}
                                        >
                                            <a href="#!" className={cxCate(["delete", "disabled"])}>{intl.get("common.confirm.delete")}</a>
                                        </Tooltip>
                                    ) : (
                                        <a href="#!" className={cxCate("delete")}
                                           onClick={this.deleteConfirm.bind(this, item.get('code'))}>{intl.get("common.confirm.delete")}</a>
                                    )
                                }

                            </div>
                        </React.Fragment>
                    }
                              key={item.get('code')}
                              isLeaf={item.get('level') === '3'}
                    >
                        {this.renderTreeNodes(item.get('code'))}
                    </TreeNode>
                );
            });
        }
    };

    componentDidMount() {
        this.props.asyncFetchCateList();
    }

    render() {

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    <Button type="primary" icon={<PlusOutlined />}
                            onClick={this.openModal.bind(this, {
                                level: '1'
                            })}>{intl.get("common.confirm.new")}</Button>
                </div>
                <div className={cx("aux-list")+" "+cxCate("aux-cate-list")}>
                    <table className={cxCate("tb-cate")}>
                        <thead>
                        <tr>
                            <th className={cxCate("name")}>{intl.get("auxiliary.category.name")}</th>
                            <th className={cxCate("ope")}>{intl.get("auxiliary.category.action")}</th>
                        </tr>
                        </thead>
                    </table>
                    <div className={cxCate("tree-wrap")}>
                        <DirectoryTree
                            onSelect={this.onSelect}
                            onExpand={this.onExpand}
                            switcherIcon={<React.Fragment/>}
                        >
                            {this.renderTreeNodes()}
                        </DirectoryTree>
                    </div>
                </div>
                <Add
                    visible={this.state.addModalVisible}
                    curCateData={this.state.curCateData}
                    onClose={this.closeModal.bind(this, 'addModalVisible')}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Index)
