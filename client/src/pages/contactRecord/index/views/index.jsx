import React, { Component } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import {Table, Button, Divider, Modal,message } from "antd";
const confirm = Modal.confirm;
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import {actions as contactRecordActions} from '../index';
import FileView from 'components/business/fileView';
import ExportButton from 'components/business/exportModal';
import ContactRecordAdd from 'pages/contactRecord/add';
import {reducer as contactRecordIndex} from "../index";
import { Resizable } from 'react-resizable';

const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
            columns:[{
                title: intl.get("contactRecord.index.serial"),
                dataIndex: 'serial',
                width: 50,
                key: 'serial'
            }, {
                title: intl.get("contactRecord.index.contactTime"),
                dataIndex: 'contactTime',
                width: 150,
                render:(contactTime)=>(<span>{moment(contactTime).format('YYYY-MM-DD')}</span>)
            }, {
                title: intl.get("contactRecord.index.nextContactTime"),
                dataIndex: 'nextContactTime',
                width: 150,
                render:(nextContactTime)=>(<span>{nextContactTime?moment(nextContactTime).format('YYYY-MM-DD'):""}</span>)
            }, {
                title: intl.get("contactRecord.index.content"),
                dataIndex: 'content',
                width: 200,
                render:(content)=>(<span title={content}>{content}</span>)
            },{
                title: "添加人",
                dataIndex: 'addedLoginName',
                width: 200,
                render:(addedLoginName)=>(<span title={addedLoginName}>{addedLoginName}</span>)
            },{
                title: "添加日期",
                dataIndex: 'addedTime',
                width: 200,
                render:(addedTime)=>(<span>{addedTime?moment(addedTime).format('YYYY-MM-DD'):""}</span>)
            },{
                title: intl.get("contactRecord.index.fileInfor"),
                dataIndex: 'fileInfor',
                width: 150,
                render: (ope,data) => (
                    <React.Fragment>
                        {
                            data.fileInfo && data.fileInfo.map((file) => {
                                return (
                                    <div key={file.fileId}>
                                        <a style={{color: '#499fff'}}
                                           href={`${BASE_URL}/file/download/?url=/file/download/${file.fileId}`}
                                        >
                                            {file.fileName}
                                        </a>
                                        <FileView fileId={file.fileId} fileName={file.fileName}/>
                                    </div>
                                )
                            })
                        }
                    </React.Fragment>
                ),
            },{
                title: intl.get("contactRecord.index.ope"),
                dataIndex: 'ope',
                width: 200,
                render: (ope,data) => (
                    <React.Fragment>
                        <a href="#!" onClick={()=>this.openModal("edit",data.id)}>{intl.get("common.confirm.editor")}</a>
                        <Divider type="vertical" />
                        <a href="#!" onClick={()=>this.showConfirm(data.id)}>{intl.get("common.confirm.delete")}</a>
                    </React.Fragment>
                ),
            }]
        };
    }
    componentDidMount() {
        //初始化列表数据
        if(this.props.customerNo){
            this.props.asyncFetchContactRecordList({
                customerNo:this.props.customerNo
            });
        }
    }

    openModal = (type,id)=>{
        console.log(6);
        if(type === "edit"){
            this.props.getLocalContactRecordInfo(id);
        }
        this.setState({
            modalVisible: true,
            type
        })
    };
    closeModal = ()=>{
        this.setState({
            modalVisible: false,
        });
    };
    showConfirm = (id)=>{
        let _this = this;
        confirm({
            title: intl.get("common.confirm.title"),
            content: intl.get("contactRecord.index.content1"),
            onOk() {
                _this.props.asyncDeleteContactRecordInfo(id,function(res){
                    if (res.retCode === '0') {
                        message.success(intl.get("common.confirm.success"));
                        _this.props.asyncFetchContactRecordList({
                            customerNo:_this.props.customerNo
                        });
                    }else {
                        alert(res.retMsg);
                    }
                });
            },
            onCancel() {},
        });
    };

    //新增子账号提交操作
    handleCreate = () => {
        const form = this.formRef.props.form;
        let _this = this;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.fileIds = this.formRef.state.fileList.map(item => item.response.fileId);

            if (_this.state.type === 'add') {
                _this.props.asyncInsertContactRecordInfo(values,function(res){
                    if (res.retCode === '0') {
                        message.success(intl.get("common.confirm.success"));
                        _this.closeModal();
                        _this.props.asyncFetchContactRecordList({
                            customerNo:_this.props.customerNo
                        });
                    }else {
                        Modal.error({
                            title: intl.get("common.confirm.title"),
                            content: res.retMsg
                        });
                    }
                });
            }
            else if (_this.state.type === 'edit') {
                _this.props.asyncModifyContactRecordInfo(values,function(res){
                    if (res.retCode === '0') {
                        message.success(intl.get("common.confirm.success"));
                        _this.closeModal();
                        _this.props.asyncFetchContactRecordList({
                            customerNo:_this.props.customerNo
                        });
                    }else {
                        Modal.error({
                            title: intl.get("common.confirm.title"),
                            content: res.retMsg
                        });
                    }
                });
            }
        });
    };

    //获取弹层中的form
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };


    render() {
        const {contactRecordList, customerNo, customerName} = this.props;

        let dataSource = contactRecordList.getIn(['data','list']);
        dataSource = dataSource? dataSource.toJS():[];

        let curContactRecordInfo = contactRecordList.getIn(['data','contactRecord']);
        curContactRecordInfo = curContactRecordInfo? curContactRecordInfo.toJS():{};

        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));

        console.log(columns,'columns');

        return (
            <div>
                <div className="mul-account">
                    <div style={{padding: '10px',textAlign: 'right'}} className={styles['account-ope']}>
                        <Button style={{"marginRight": '10px'}} onClick={()=>this.openModal("add")} icon={<LegacyIcon type={"plus"} />} htmlType={'button'} type={"primary"}>{intl.get("contactRecord.index.new")}</Button>
                        <ExportButton  gadata={'batch-export-all'}  type={'contactRecord'} condition={{customerNo: customerNo}} name={customerName}/>
                    </div>
                    <Table bordered
                           dataSource={dataSource}
                           columns={columns}
                           components={this.components}
                           pagination={false}
                           loading={contactRecordList.get('isFetching')}
                    />
                </div>

                <Modal
                    title={(this.state.type==="add"?intl.get("common.confirm.new"):intl.get("common.confirm.editor"))+intl.get("contactRecord.index.history")}
                    width={800}
                    className={cx("modal-mul-account")}
                    visible={this.state.modalVisible}
                    onCancel={this.closeModal}
                    onOk={()=>this.handleCreate(this.state.type)}
                    destroyOnClose={true}
                    confirmLoading={contactRecordList.get('confirmFetching')}
                >
                    <ContactRecordAdd  data={curContactRecordInfo}
                                       customerNo={this.props.customerNo}
                                   wrappedComponentRef={this.saveFormRef}
                    />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    contactRecordList: state.getIn(['contactRecordIndex', 'contactRecordList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchContactRecordList:contactRecordActions.asyncFetchContactRecordList,
        getLocalContactRecordInfo:contactRecordActions.getLocalContactRecordInfo,
        asyncModifyContactRecordInfo:contactRecordActions.asyncModifyContactRecordInfo,
        asyncInsertContactRecordInfo:contactRecordActions.asyncInsertContactRecordInfo,
        asyncDeleteContactRecordInfo:contactRecordActions.asyncDeleteContactRecordInfo,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
