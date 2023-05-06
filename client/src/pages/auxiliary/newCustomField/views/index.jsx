import React, {Component} from 'react';
import {Button, message, Modal, Table} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import { PlusOutlined, MenuOutlined } from '@ant-design/icons';
import Add from './add';
import {asyncAddNewCustomField, asyncFetchNewCustomFieldList} from '../actions';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

const {Column} = Table;
const confirm = Modal.confirm;
const typeMap = {
    text : '文本',
    number: '数值',
    select: '单选项',
    date: '日期'
};


class Index extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        customFieldName: '',
        id:'',
        required: false,
        type: 'text',
        extra: {},
        dataSource: []
    };

    DraggableContainer = props => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd}
            {...props}
        />
    );

    DraggableBodyRow = ({ className, style, ...restProps }) => {
        const {dataSource} = this.state;
        const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        const {dataSource} = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
            console.log('Sorted items: ', newData);
            this.setState({
                dataSource: newData
            });
        }
    };

    openModal = (id, customFieldName, required, type, extra) => {
            this.setState({
                addModalVisible:true,
                id,
                customFieldName,
                required,
                type,
                extra
            });
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    deleteConfirm = (id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get("auxiliary.customField.deleteContent"),
            onOk() {
                _this.props.asyncAddNewCustomField('del', {id:id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.fetchData();
                        message.success(intl.get('common.confirm.success'));
                    }
                    else {
                        message.error(res.data.retMsg+res.data.retValidationMsg.msg[0].msg);
                    }
                })
            },
            onCancel() {
            },
        });
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = ()=>{
        this.props.asyncFetchNewCustomFieldList(this.props.type,(data)=>{
           let dataSource = data.data.map((item, index) => {
                return {
                    key: index + 1,
                    serial: index + 1,
                    index: item.index,
                    customFieldName: item.propName,
                    id: item.id,
                    required: item.required?'是':'否',
                    type: typeMap[item.type],
                    action: {
                        id:item.id,
                        customFieldName:item.propName,
                        required: item.required,
                        type: item.type,
                        extra: item.extra
                    }
                }
            });
           this.setState({dataSource});
        });
    }

    render() {
        let dataSource = this.state.dataSource;
        const {customFieldList,currentAccountInfo,customFieldAmount=10} = this.props;
        let customFieldListData = customFieldList.getIn([this.props.type, 'data']);
        customFieldListData = customFieldListData?customFieldListData.toJS():[];
        const accountInfo = currentAccountInfo.get('data');
        const DragHandle = sortableHandle(() => (
            <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
        ));

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    {
                        customFieldListData.length <= (customFieldAmount-1) && (accountInfo && accountInfo.get('mainUserFlag'))?
                            <Button type="primary" icon={<PlusOutlined />}
                                    onClick={()=>this.openModal()}>{intl.get('common.confirm.new')}</Button>:
                            null
                    }

                </div>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        rowKey="index"
                        components={{
                            body: {
                                wrapper: this.DraggableContainer,
                                row: this.DraggableBodyRow,
                            },
                        }}
                        loading={customFieldList.get('isFetching')}
                        className={cx("tb-aux")}
                        scroll={{y: 400}}
                    >
                        {/*<Column
                            title={"排序"}
                            dataIndex="sort"
                            key="sort"
                            width="8%"
                            render={
                                () => <DragHandle />
                            }
                        />*/}
                        <Column
                            title={intl.get("auxiliary.customField.serial")}
                            dataIndex="serial"
                            key="serial"
                            width="15%"
                        />
                        <Column
                            title={intl.get("auxiliary.customField.customFieldName")}
                            dataIndex="customFieldName"
                            key="customFieldName"
                            width="30%"
                        />
                        <Column
                            title={"字段类型"}
                            dataIndex="type"
                            key="type"
                            width="30%"
                        />
                        <Column
                            title={"是否必填"}
                            dataIndex="required"
                            key="required"
                            width="10%"
                        />
                        {
                            accountInfo && accountInfo.get('mainUserFlag')?
                                <Column
                                    title={intl.get("auxiliary.customField.action")}
                                    dataIndex="action"
                                    key="action"
                                    width="15%"
                                    align="center"
                                    render={({id, customFieldName, required, type, extra}) =>
                                        <React.Fragment>
                                            <a href="#!" className="ope-item"
                                               onClick={this.openModal.bind(this, id, customFieldName, required, type, extra)}>{intl.get('common.confirm.editor')}</a>
                                            <span className="ope-split">|</span>
                                            <a href="#!" className="ope-item"
                                               onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                        </React.Fragment>
                                    }
                                />:
                                null
                        }

                    </Table>
                </div>
                <Add
                    visible={this.state.addModalVisible}
                    moduleName={this.props.type}
                    id={this.state.id}
                    customFieldName={this.state.customFieldName}
                    required={this.state.required}
                    type={this.state.type}
                    extra={this.state.extra}
                    fetchData={this.fetchData}
                    onClose={this.closeModal.bind(this,'addModalVisible')}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        customFieldList: state.getIn(['auxiliaryNewCustomField', 'newCustomFieldList']),
        currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchNewCustomFieldList,
        asyncAddNewCustomField
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)

