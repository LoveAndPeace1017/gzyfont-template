import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input } from 'antd';
import {bindActionCreators} from "redux";
import defaultOptions from 'utils/validateOptions';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class ResetPwdForm extends Component {

	componentDidMount() {
		this.props.getCurForm({
			resetForm: this.props.form
		});
	}

	//判断新密码和确认密码是否相等
	isPwdEqual = (comparePwd, rules, val, callback) => {
		const comparePwdVal = this.props.form.getFieldValue(comparePwd);
		if(comparePwdVal && comparePwdVal !== val){
			callback(intl.get("account.add.rule7"))
		}
		callback();
	};

	render() {
		const { form: {getFieldDecorator}} = this.props;
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

		//设置userId输入框中的值（提交时候要）
		getFieldDecorator('userId',{
			initialValue: this.props.userId
		})

		const regLetterOrNum = /^[0-9a-zA-Z]+$/;  //数字或者字母
		return (
			<Form>

				<Form.Item
					{...formItemLayout}
					label={intl.get("account.add.newPassword")}
				>
					{getFieldDecorator('newPassword', {
						...defaultOptions,
						rules: [
							{
								required: true,
								message: intl.get("account.add.rule8")
							},
							{
								min: 6,
								message: intl.get("account.add.rule9")
							},
							{
								max: 20,
								message: intl.get("account.add.rule9")
							},
							{
								pattern: regLetterOrNum,
								message: intl.get("account.add.rule9")
							},
							{
								validator: this.isPwdEqual.bind(this, 'confirmPassword')
							}
						],
					})(
						<Input.Password placeholder={intl.get("account.add.placeHolder")} maxLength={20} />
					)}
				</Form.Item>
				<Form.Item
					{...formItemLayout}
					label={intl.get("account.add.confirmPassword")}
				>
					{getFieldDecorator('confirmPassword', {
						...defaultOptions,
						rules: [
							{
								required: true,
								message: intl.get("account.add.rule10")
							},
							{
								min: 6,
								message: intl.get("account.add.rule11")
							},
							{
								max: 20,
								message: intl.get("account.add.rule11")
							},
							{
								pattern: regLetterOrNum,
								message: intl.get("account.add.rule11")
							},
							{
								validator: this.isPwdEqual.bind(this, 'newPassword')
							}
						],
					})(
						<Input.Password placeholder={intl.get("account.add.placeHolder")} maxLength={20} />
					)}
				</Form.Item>
			</Form>
		);
	}
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
	}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ResetPwdForm))
