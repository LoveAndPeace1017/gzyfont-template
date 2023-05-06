import React, { Component } from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select, Cascader, message, Modal } from 'antd';
import defaultOptions from 'utils/validateOptions';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import Area from 'components/widgets/area';
import {actions as warehouseActions} from "pages/warehouse/index";
const cx = classNames.bind(styles);

const Option = Select.Option;

class WarehouseAddForm extends Component {
    constructor(props){
        super(props);
    }

    onChange = (value,obj)=> {
        this.props.form.setFieldsValue({
            provinceText: obj[0]?obj[0].label:'',
            cityText: obj[1]?obj[1].label:'',
        });
    };

    componentDidMount(){
        if(!this.props.warehouseNames || this.props.warehouseNames.length===0){
            this.props.asyncFetchWarehouseList();
        }
    }

	render() {


		const { getFieldDecorator,getFieldValue } = this.props.form;
        let { data,warehouseNames} = this.props;

        if(!warehouseNames || warehouseNames.length===0){
            const {warehouseList} = this.props;
            let dataSource = warehouseList.getIn(['data','list']);
            dataSource = dataSource? dataSource.toJS():[];
            warehouseNames = dataSource.map(function(item){
                return {
                    id:item.id,
                    name:item.name};
            });
        }

        let warehouseNamesObj = {};
        let tempId = data.id||-1;
        warehouseNames.forEach(function(item){
            if(item.id!=tempId){
                warehouseNamesObj[item.name] = '';
            }
        });
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
					label={intl.get("warehouse.add.index.warehouseName")}
				>
					{getFieldDecorator('name', {
                        initialValue:data.name,
						...defaultOptions,
						rules: [
							{
								required: true,
								message: intl.get("warehouse.add.index.warehouseNameMessage1")
							},
                            {
                                max: 30,
                                message: intl.get("warehouse.add.index.warehouseNameMessage2")
                            },
							{
								validator: (rules, val, callback) => {
                                    if(val in warehouseNamesObj){
                                        callback(intl.get("warehouse.add.index.warehouseNameErrorMsg"))
                                    }else{
                                        callback();
                                    }
								}
							}
						],
					})(
						<Input placeholder={intl.get("warehouse.add.index.warehouseNamePlaceholder")}  maxLength={30}/>
					)}
				</Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("warehouse.add.index.warehouseAddress")}
                >
                    {getFieldDecorator('cityCode', {
                        initialValue: [data.provinceCode,data.cityCode],
                        rules: [
                            {
                                validator: (rules, val, callback) => {
                                    if(!val[0]&&getFieldValue('address')){
                                        callback(intl.get("warehouse.add.index.warehouseAddressMessage"))
                                    }else{
                                        callback();
                                    }
                                }
                            }
                        ]
                    })(
                        <Area onChange={this.onChange}/>
                    )}
                </Form.Item>

				<Form.Item
					{...formItemLayout}
					label={intl.get("warehouse.add.index.detailAddress")}
				>
                    {getFieldDecorator('address', {
                        initialValue:data.address,
                        ...defaultOptions,
                        rules: [
                            {
                                max: 120,
                                message: intl.get("warehouse.add.index.detailAddressMessage")
                            }
                        ]

                    })(
                        <Input placeholder={intl.get("warehouse.add.index.detailAddressPlaceholder")}  maxLength={120}/>
                    )}
				</Form.Item>
                <Form.Item>
                    {getFieldDecorator('id', {
                        initialValue:data.id
                    })(
                        <input type="hidden"  />
                    )}
                </Form.Item>
                <div style={{display:"none"}}>
                    {getFieldDecorator('provinceText', {
                        initialValue:data.provinceText
                    })(
                        <Input   />
                    )}
                    {getFieldDecorator('cityText', {
                        initialValue:data.cityText
                    })(
                        <Input  />
                    )}
                </div>
			</Form>
		);
	}
}


class WarehouseAdd extends Component {

    constructor(props) {
        super(props);
    }

    handleCreate = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const opeName = this.isEdit?'asyncModifyWarehouseInfo':'asyncInsertWarehouseInfo';
            this.props[opeName](values, (res) => {
                if (res.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchWarehouseList();
                    this.props.callback && this.props.callback(values.name);
                    message.success(intl.get("warehouse.add.index.operateMessageSuccess"));
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    alert(res.retMsg);
                }
            })
        })
    };

    render() {
        this.isEdit = Object.keys(this.props.data).length>0;
        const titleName =  this.isEdit ? intl.get("warehouse.add.index.modifyWarehouse") : intl.get("warehouse.add.index.addWarehouse");
        return (
            <Modal
                title={titleName}
                visible={this.props.visible}
                onCancel={this.props.onClose}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.warehouseList.get('isFetching')}
                destroyOnClose={true}
            >
                <WarehouseAddForm {...this.props} />
            </Modal>
        );
    }
}


const mapStateToProps = (state) => ({
    warehouseList: state.getIn(['warehouseIndex', 'warehouseList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWarehouseList:warehouseActions.asyncFetchWarehouseList,
        asyncInsertWarehouseInfo:warehouseActions.asyncInsertWarehouseInfo,
        asyncModifyWarehouseInfo:warehouseActions.asyncModifyWarehouseInfo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(WarehouseAdd))

