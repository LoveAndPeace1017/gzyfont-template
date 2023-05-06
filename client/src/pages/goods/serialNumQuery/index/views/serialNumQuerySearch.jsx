import React, {Component} from 'react';
import {Input, Modal} from 'antd';
import {AddPkgOpen} from "components/business/vipOpe";
import {EllipsisOutlined} from '@ant-design/icons';
import ChooseSerialNum from './chooseSerialNum';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import PropTypes from 'prop-types';

import styles from "../styles/index.scss";
const cx = classNames.bind(styles);


/**
 *  物品弹层选择序列号功能
 *
 * @visibleName SerialNumQuerySearch(物品弹层选择序列号功能)
 * @author jinb
 *
 */

export default class SerialNumQuerySearch extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         */
        value: PropTypes.string,
        /**
         * 选中option或者value变化的回调函数
         * @param {string} value 选择的值
         */
        onChange: PropTypes.func,
        /**
         * 自定义的选择框后缀图标
         */
        suffixIcon: PropTypes.element,
        /**
         * 可输入最大字符长度
         */
        maxLength: PropTypes.number,
        /**
         * 样式
         */
        style: PropTypes.object,
        /**
         * 暗注释
         */
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        maxLength: 100
    };

    static getDerivedStateFromProps(nextProps, prevState) {
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
        const value = props.value || '';
        this.state = {
            serialModalVisible: false,
            value
        }
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

    //获取弹层中的form
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    // 修改store里的单据中的序列号
    handleCreate = () => {
        let serialNumber = this.formRef.state.serialNumber;
        let serialText = serialNumber.join(',');
        this.setState({value: serialText});
        this.props.onChange(serialText, serialNumber.length);
        this.closeModal('serialModalVisible')
    };

    render() {
        return (
            <React.Fragment>
                <div className={cx("suggest-search")}>
                    <Input
                        readOnly={true}
                        value={this.state.value !== ''? this.state.value: undefined}
                        placeholder={this.props.placeholder}
                        style={{width:'100%', ...this.props.style}}
                        onClick={() => this.openModal('serialModalVisible')}
                        readonly="readonly"
                        suffix={(
                            <a href="#!" onClick={() => this.openModal('serialModalVisible')}>
                                <EllipsisOutlined style={{fontSize: "16px"}}/>
                            </a>
                        )}
                        className={cx("suggest")}
                    />
                </div>
                <Modal
                    title={intl.get("goods.serialNumQuery.selectS")}
                    visible={this.state.serialModalVisible}
                    onCancel={()=>this.closeModal('serialModalVisible')}
                    width={1200}
                    onOk={this.handleCreate}
                    destroyOnClose={true}
                >
                    <ChooseSerialNum
                        serialNumber={this.state.value}
                        wrappedComponentRef={this.saveFormRef}
                    />
                </Modal>
            </React.Fragment>
        )
    }
}

