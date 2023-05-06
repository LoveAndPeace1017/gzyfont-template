import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form, DatePicker, Input, Button, message, Modal} from 'antd';
import {asyncFetchBacklog, asyncAddBacklog, asyncDeleteBacklog} from "../actions";
import {ResizeableTable} from 'components/business/resizeableTitle';
import Fold from 'components/business/fold';
import moment from "moment-timezone/index";
const {TextArea} = Input;

/**
 *
 * @visibleName Backlog（代办事项）
 * @author jinb
 */
const mapStateToProps = (state) => ({
    backlogInfo: state.getIn(['backlog', 'backlogInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchBacklog,
        asyncAddBacklog,
        asyncDeleteBacklog,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Backlog extends Component {
    formRef = React.createRef();

    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 12},
        }
    };

    state = {
        addModalVisible: false,
    };

    componentDidMount() {
        // 获取列表数据
        this.getBacklogList();
    };

    // 获取列表数据
    getBacklogList = () => {
        let {source, dataNo} = this.props;
        this.props.asyncFetchBacklog({source, billNo: dataNo});
    };


    // 添加代办事项
    handleAddRecord =  (values) => {
        let {source, dataNo, displayDataNo} = this.props;
        this.props.asyncAddBacklog({source, dataNo, displayDataNo, ...values}, (res) => {
            if (res.retCode === '0') {
                //重新获取列表数据
                message.success('操作成功');
                this.getBacklogList();
                this.closeModal('addModalVisible');
            }
            else {
                message.error(res.data.retMsg)
            }
        })
    };

    // 提交表单
    handleSubmit = async () => {
        const values = await this.formRef.current.validateFields();
        this.handleAddRecord(values);
    };

    // 删除操作
    deleteRecord = (recId) => {
        let {source, asyncDeleteBacklog} = this.props;
        let _this = this;
        Modal.confirm({
            title: "提示信息",
            content: <div><p>删除单据后无法恢复，确定删除吗？</p></div>,
            onOk() {
                return new Promise((resolve, reject) => {
                    asyncDeleteBacklog({source, recId}, (res) => {
                        resolve();
                        if (res.retCode === '0') {
                            message.success('删除成功');
                            _this.getBacklogList();
                        }
                        else {
                            message.error(res.retMsg);
                        }
                    });
                })
            }
        });
    };

    openModal = type => {
        this.setState({
            [type]: true
        })
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    render() {
        let {addModalVisible} = this.state;
        let {backlogInfo} = this.props;
        let backlogData = backlogInfo.getIn(['data', 'data']);
        let dataSource = backlogData && backlogData.toJS();

        let columns = [
            {
                title: "序号",
                dataIndex: 'serial',
                align: 'center',
                width: 100,
                render: (text, record, index) => <span>{index + 1}</span>
            },
            {
                title: "完成日期",
                dataIndex: 'backlogDate',
                align: 'left',
                width: 350,
                render: (backlogDate)=>{
                    return (<span>{backlogDate ? moment(backlogDate).format('YYYY-MM-DD') : ''}</span>)
                }
            },
            {
                title: "待办事项",
                dataIndex: 'todoRemarks',
                align: 'left',
                className: 'ant-table-selection-column'
            },
            {
                title: "操作",
                dataIndex: 'opt',
                align: 'center',
                width: 250,
                className: 'ant-table-selection-column',
                render: (value, row) => {
                    return (
                        <React.Fragment>
                            <a href="#!" onClick={() => this.deleteRecord(row.recId)}>删除</a>
                        </React.Fragment>
                    )
                }
            }
        ];

        return (
            <Fold title={"待办事项"}
                  rightContent={()=>{
                      return (
                          <React.Fragment>
                              <Button type="primary" onClick={this.openModal.bind(this, 'addModalVisible')}>添加</Button>
                          </React.Fragment>
                      )
                  }}
            >
                <div className="detail-table-wrap" style={{marginTop: '-16px'}}>
                    <ResizeableTable
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        pagination={false}
                        loading={false}
                        scroll={{x: 'auto'}}
                    />
                </div>
                <Modal
                    title={'添加待办事项'}
                    visible={addModalVisible}
                    onCancel={this.closeModal.bind(this, 'addModalVisible')}
                    width={800}
                    onOk={() => this.handleSubmit()}
                    destroyOnClose={true}
                >
                    <Form ref={this.formRef}>
                        <Form.Item
                            {...Backlog.formItemLayout}
                            label={'完成日期'}
                            initialValue={moment()}
                            name="backlogDate"
                            rules={[
                                {
                                    type: 'object',
                                    required: true,
                                    message: "此项为必填项!"
                                }
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            {...Backlog.formItemLayout}
                            name="todoRemarks"
                            label={'待办事项'}
                            rules={[
                                {
                                    required: true,
                                    message: "此项为必填项!"
                                }
                            ]}
                        >
                            <TextArea rows={4} maxLength={200}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </Fold>
        )
    }
}
