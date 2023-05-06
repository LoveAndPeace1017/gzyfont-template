import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Input, message, Modal } from 'antd';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const cx = classNames.bind(styles);
import {asyncAddSalePrice} from '../actions'
import Icon from 'components/widgets/icon';
import {Link} from 'react-router-dom';
import intl from 'react-intl-universal';


export class AddSalePrice extends Component {

    onOk = ()=>{
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let arr = [];
            for(let i=0;i<values.code.length;i++){
                arr.push({
                    code:values.code[i],
                    salePrice:values.salePrice[i],
                })
            }
            this.props.asyncAddSalePrice(arr, (res) => {
                if (res.retCode == '0') {
                    //重新获取列表数据
                    if(this.props.okCallback){
                        this.props.onClose();
                        this.props.okCallback();
                    }else{
                        message.success(intl.get('common.confirm.success'));
                    }
                }
                else {
                    Modal.error({
                        title: intl.get('common.confirm.title'),
                        content: res.retMsg
                    });
                }
            })
        })

    };


    render(){
        const { getFieldDecorator } = this.props.form;
        let columns = [{
            title: intl.get("goods.index.serial"),
            dataIndex: 'serial',
        },{
            title: intl.get("goods.index.displayCode"),
            dataIndex: 'displayCode',
        },{
            title: intl.get("goods.index.prodName"),
            dataIndex: 'prodName',
        },{
            title: intl.get("goods.index.salePrice"),
            dataIndex: 'salePrice',
            render:(salePrice, record)=>{
                return <Form.Item>
                    {
                        getFieldDecorator(`salePrice[${record.serial-1}]`, {
                            initialValue:'',
                            rules: [
                                {
                                    required: true,
                                    message: intl.get("goods.index.tip1"),
                                }
                            ]
                        })(
                            <Input maxLength={25}/>
                        )

                    }
                    {
                        getFieldDecorator(`code[${record.serial-1}]`, {
                            initialValue: record.prodNo
                        })(<Input type="hidden"/>)
                    }
                </Form.Item>
            }
        },
        ];

        return(
            <React.Fragment>
                <Modal
                    title={intl.get("goods.index.title1")}
                    visible={this.props.visible}
                    onCancel={this.props.onClose}
                    width={800}
                    onOk={this.onOk}
                    destroyOnClose={true}
                    okText={intl.get('common.confirm.okText')}
                    cancelText={intl.get('common.confirm.cancelText')}
                    okButtonProps={{
                        'ga-data': 'addPrice-ok'
                    }}
                    cancelButtonProps={{
                        'ga-data':'addPrice-cancel'
                    }}
                >
                    <Form>
                        <Table columns={columns} dataSource={this.props.dataSource} pagination={false}/>
                    </Form>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddSalePrice
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddSalePrice))