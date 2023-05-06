import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Tree, Modal, Alert, Spin} from "antd";

import classNames from 'classnames/bind';
import styles from '../styles/index.scss';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const cx = classNames.bind(styles);
import {asyncFetchAbizAllCate} from '../actions'

const {TreeNode} = Tree;

class CateContent extends Component {

    state = {
        expandedKeys: [],
        autoExpandParent: true,
        selectedKeys: [],
        selectedCatePath: ''
    };

    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };


    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        console.log('selectedKeys', selectedKeys);
        const selectedKeysHasChild = info.selectedNodes[0] && info.selectedNodes[0].dataRef.hasChild;
        if(selectedKeysHasChild){
            // this.onExpand([...this.state.expandedKeys, ...selectedKeys])
        }else{
            this.setState({
                selectedKeys,
                selectedCatePath: info.selectedNodes[0]&& info.selectedNodes[0].catNameCnJoin
            });
            this.props.setOkButtonDisabled(selectedKeysHasChild === undefined? true: selectedKeysHasChild)
        }

    };

    renderTreeNodes = (data, parentCatNameCn) => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.catNameCn} key={item.catCode} dataRef={item}>
                    {this.renderTreeNodes(item.children, parentCatNameCn === undefined? item.catNameCn: parentCatNameCn + '>' + item.catNameCn)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.catNameCn} key={item.catCode} dataRef={item} catNameCnJoin={parentCatNameCn + '>' + item.catNameCn}/>;
    });

    componentDidMount() {
        this.props.onRef(this);
        this.props.asyncFetchAbizAllCate();
    }

    render() {
        const {abizAllCate} = this.props;

        let treeData = abizAllCate && abizAllCate.getIn(['data', 'children']);
        treeData = treeData && treeData.toJS();
        return (
            <div className={cx("abiz-cate")}>
                {
                    treeData && treeData.length > 0 ? (
                        <Tree
                            onExpand={this.onExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                        >
                            {this.renderTreeNodes(treeData)}
                        </Tree>
                    ) : (
                        <Spin className="gb-data-loading"/>
                    )
                }
            </div>
        )
    }
}

class AbizAllCate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            okButtonDisabled: true
        }
    }

    handleOk = () => {
        const selectedKeys = this.cateRef.state.selectedKeys;
        const selectedCatePath = this.cateRef.state.selectedCatePath;
        this.props.onOk(selectedKeys, selectedCatePath);
        this.setState({
            okButtonDisabled: true
        });
        this.props.onClose();
    };

    getRef = (cateRef) => {
        this.cateRef = cateRef
    };

    setOkButtonDisabled=(selectedKeysHasChild)=>{
      this.setState({
          okButtonDisabled: selectedKeysHasChild
      })
    };

    render() {

        return (
            <Modal
                title={intl.get("components.abizCate.abizAllCate.allCatalog")}
                visible={this.props.visible}
                onCancel={this.props.onClose}
                width={800}
                onOk={this.handleOk}
                okButtonProps={{disabled: this.state.okButtonDisabled}}
                // confirmLoading={this.props.addDept.get('isFetching')}
                destroyOnClose={true}
            >
                <CateContent {...this.props} onRef={this.getRef} setOkButtonDisabled={this.setOkButtonDisabled}/>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    abizAllCate: state.getIn(['abizCate', 'abizAllCate'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchAbizAllCate
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(AbizAllCate)