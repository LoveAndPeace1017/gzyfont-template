import React, {Component} from 'react';
import * as constants from 'utils/constants';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Button, Input, message } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import ListModalTable from 'components/business/listModalTable';
import {actions as auxiliaryWorkCenterActions} from 'pages/auxiliary/workCenter';
import {asyncMessageRecommend} from '../actions';
import {getCookie} from 'utils/cookie';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
const cx = classNames.bind(styles);

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

/**
 * @visibleName MessageRecommendPop（消息提醒）
 * @author jinb
 */
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncMessageRecommend,
        asyncFetchWorkCenterDetail: auxiliaryWorkCenterActions.asyncFetchWorkCenterDetail,
    }, dispatch)
};

@withRouter
@connect(null, mapDispatchToProps)
export default class MessageRecommendPop extends Component{
    constructor(props) {
        super(props);
        this.state = {
            formList: [],
            selectedRowKeys: [],
            selectedRows: [],
            condition: {}
        }
    }

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    // 初始化新增工单操作
    initOperate = async() => {
        await this.getWorkCenterDetail();
    };

    // 工序 报工操作
    getWorkCenterDetail =  () => {
        let { caCode } = this.props.info;
        return new Promise((resolve, reject) => {
            if(caCode){
                this.props.asyncFetchWorkCenterDetail(caCode, (res) => {
                    if(res && res.retCode==='0'){
                        let pwceList = res.data.pwceList;  // 工作中心对应的员工列表
                        let formList = pwceList && pwceList.map((item, index) => {
                            let out = {key: index, ...item};
                            return out;
                        });
                        this.setState({
                            formList,
                            selectedRows: formList,
                            selectedRowKeys: formList.map(item => item.key)
                        });
                        resolve();
                    }
                });
            }
        });
    };

    handleSave  = (row, type) => {
        let {selectedRowKeys, selectedRows} = this.state;
        console.log(row, 'row');
        let currentIndex = selectedRowKeys.indexOf(row.key);
        if(selectedRowKeys.length!==0 && currentIndex!==-1){
            selectedRows[currentIndex][type] = row[type];
            this.setState({ selectedRows });
        }
    };

    onSelectRowChange = (newSelectedRowKeys,newSelectedRows) => {
        this.setState({
            selectedRowKeys:newSelectedRowKeys,
            selectedRows:newSelectedRows
        });
    };


    onOk = ()=>{
        let list = this.state.selectedRows;
        let {billNo, id} = this.props.info;
        if(!list || list.length===0){
            message.error('请选择单据');
            return;
        }
        let reg = /^1[0-9]{10}$/;
        let uList = _.filter(list, (o)=> reg.test(o.mobile));
        if(uList.length !== list.length){
            message.error('请输入正确的手机号格式');
            return;
        }
        this.props.asyncMessageRecommend({billNo, id, array: uList}, (res) => {
            if(res.retCode === '0'){
                message.success("操作成功!");
            } else {
                message.error(res.retMsg);
            }
            this.setState({
                selectedRowKeys:[],
                selectedRows:[],
                formList:[]
            })
        });
        this.props.onCancel();
    };

    render(){
        let dataSource = this.state.formList;

        let columns = [
            {title: "工作中心",dataIndex: 'caName', width: 110},
            {title: "部门",dataIndex: 'departmentName', width: 250},
            {title: "员工",dataIndex: 'employeeName', width: 250},
            {title: "手机号",dataIndex: 'mobile',editable:true, required: true, fixed: 'right', width: 120,
                render: (value, record, index) => (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                <div className={"tb-input-wrap"}>
                                    <Form.Item style={{margin: 0}}>
                                        {form.getFieldDecorator('mobile', {
                                            initialValue: record.mobile,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '手机号码为必填'
                                                },
                                                {
                                                    pattern: new RegExp(/^1[0-9]{10}$/, "g"),
                                                    message: '请输入正确的手机号格式'
                                                }
                                            ],
                                        })(
                                            <Input maxLength={11} placeholder="填写手机号码" onChange={(e) => this.handleSave({...record, mobile: e.target.value}, 'mobile')} />
                                        )}
                                    </Form.Item>
                                </div>
                            )}
                        }
                    </EditableContext.Consumer>
                )
            },
        ];

        columns = columns.map((col) => {
            if (!col.editable) {
                if(!col.render){
                    col.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                return col;
            }
            return {
                ...col,
                title: () => {
                    return (
                        <React.Fragment>
                            {
                                col.required ? (<span className="required">*</span>) : null
                            }
                            {col.title}
                        </React.Fragment>
                    )
                },
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        const components = {
            body: {
                row: EditableFormRow
            },
        };

        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            type:'checkbox',
            onChange: this.onSelectRowChange,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        return(
            <Form style={{overflow: 'hidden'}}>
                <div className="mt10">
                    <ListModalTable dataSource={dataSource} columns={columns}
                                    isNeedDrag={true}
                                    className={cx('sale-order-pop')}
                                    rowSelection={rowSelection}
                                    components={components}
                                    pagination={false}
                                    // loading={messageRecommendList.get('isFetching')}
                    />
                </div>
                <div className={cx('modal-btn')}>
                    <Button type="primary" onClick={this.onOk}>
                        确定
                    </Button>
                    <Button onClick={this.props.onCancel} style={{marginLeft: 10}}>
                        取消
                    </Button>
                </div>
            </Form>

        )
    }
}


