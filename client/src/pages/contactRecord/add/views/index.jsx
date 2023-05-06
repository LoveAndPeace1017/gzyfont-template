import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, DatePicker } from 'antd';
const TextArea = Input.TextArea;
import defaultOptions from 'utils/validateOptions';
import intl from 'react-intl-universal';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import AttachmentUpload from 'components/business/attachmentUpload';
import {bindActionCreators} from "redux";
const cx = classNames.bind(styles);


class ContactRecordAddForm extends Component {
    constructor(props){
        super(props);
    }
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
        fileList: [],
        flag: true
    };

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
        // this.props.form.setFieldsValue({
        //     [field]: moment(value),
        // })
    };

    onStartChange = (value) => {
        this.onChange('startValue', value);
    };

    onEndChange = (value) => {
        this.onChange('endValue', value);
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    };

	render() {

		const { getFieldDecorator } = this.props.form;
        let data = this.props.data||{};

        //处理下载附件
        if(data && data.fileInfo && this.state.flag){
            let newFileInfo = data.fileInfo.map((file, index) => {
                file.uid = -(index+1);
                file.url = `${BASE_URL}/file/download/?url=/file/download/${file.fileId}`;
                file.name = file.fileName;
                file.status = 'done';
                file.response = {
                    fileId: file.fileId
                };
                return file;
            });
            this.setState({fileList: newFileInfo,
                flag: false});
        }
        const {  endOpen } = this.state;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 10 },
			}
		};

		return (
			<Form>
				<Form.Item
					{...formItemLayout}
					label={intl.get("contactRecord.add.contactTime")}
				>
					{getFieldDecorator('contactTime', {
                        initialValue:moment(data.contactTime),
						rules: [
							{
								required: true,
								message: intl.get("contactRecord.add.rule1")
							},
						],
					})(
                        <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}/>
					)}
				</Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("contactRecord.add.nextContactTime")}
                >
                    {getFieldDecorator('nextContactTime', {
                        initialValue: moment(data.nextContactTime),
                    })(
                        <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}/>
                    )}
                </Form.Item>

				<Form.Item
					{...formItemLayout}
					label={intl.get("contactRecord.add.content")}
				>
                    {getFieldDecorator('content', {
                        initialValue:data.content,
                        ...defaultOptions,
                        rules: [
                            {
                                required: true,
                                message: intl.get("contactRecord.add.rule2")
                            },
                        ]
                    })(
                        <TextArea style={{height: 160}} maxLength={1000}/>
                    )}
				</Form.Item>
                <Form.Item
                    label={intl.get("contactRecord.add.tempAtt")}
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator("tempAtt", {
                            ...defaultOptions
                        })(
                            <AttachmentUpload
                                maxLength={'5'}
                                fileList={this.state.fileList}
                                handleChange={(fileList) => this.setState({fileList})}
                            />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('id', {
                        initialValue:data.id
                    })(
                        <input type="hidden"  />
                    )}
                    {getFieldDecorator('customerNo', {
                        initialValue:this.props.customerNo
                    })(
                        <input type="hidden"  />
                    )}
                </Form.Item>

			</Form>
		);
	}
}

export default connect()(Form.create()(ContactRecordAddForm))

