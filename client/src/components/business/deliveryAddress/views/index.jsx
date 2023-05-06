import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Input, Row, Cascader } from "antd";

import classNames from 'classnames/bind';
import styles from '../styles/index.scss';

import {actions as areaActions} from 'components/widgets/area/index';
import {bindActionCreators} from "redux";
import {reducer as provinceAndCity} from "components/widgets/area";
import {connect} from "react-redux";

const cx = classNames.bind(styles);

let id = 5;
//自定义项
const defaultAddress = {
    index:5,
    provinceCode:"",
    cityCode:"",
    provinceText:"",
    cityText:"",
    address:"",
};
export  class DeliveryAddress extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //初始化列表数据
        this.props.asyncGetProvinceList();
    }
    displayRender = (label)=>{
        return label.join(' ');
    };
    onChange = (value,obj,index)=> {
        let provinceText,cityText;
        if(obj.length===0){
            provinceText = cityText = "";
        }else{
            provinceText = obj[0].label;
            cityText = obj[1].label;
        }
        this.props.form.setFieldsValue({
            [`provinceText[${index}]`]: provinceText,
            [`cityText[${index}]`]: cityText,
        });
    };
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const customerAddressList = form.getFieldValue('customerAddressList');
        // We need at least one address
        if (customerAddressList.length === 1) {
            return;
        }
        // can use data-binding to set
        form.setFieldsValue({
            customerAddressList: customerAddressList.filter((address) => address.index !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const customerAddressList = form.getFieldValue('customerAddressList');
        let temp = {
            ...defaultAddress,
            index:++id
        };
        const nextKeys = customerAddressList.concat(temp);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            customerAddressList: nextKeys,
        });
    };

    render() {

        const {areaInfo} = this.props;
        let label = this.props.label?this.props.label: intl.get("components.deliveryAddress.index.address");
        let maxNum = this.props.maxNum?this.props.maxNum:5;
        let options = areaInfo.getIn(['areaList']);
        options = options? options.toJS():[];

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        getFieldDecorator('customerAddressList', { initialValue: [defaultAddress] });
        const customerAddressList = getFieldValue('customerAddressList');
        const len = customerAddressList.length;
        const formItems = customerAddressList.map((address, index) => (
            <Row key={address.index}>
                <Col span={16}>
                    <Form.Item
                        {...formItemLayout }
                        label={index === 0 ? label : (<React.Fragment></React.Fragment>)}
                        required={false}
                        colon={index === 0}
                        key={address.index}
                    >
                        <div className={cx("field-name")} >
                            {getFieldDecorator(`cityCode[${address.index}]`, {
                                initialValue: address.provinceCode?[address.provinceCode,address.cityCode]:[],
                            })(
                                <Cascader options={options}
                                          displayRender={this.displayRender}
                                          onChange={(value,obj)=>this.onChange(value,obj,address.index)} placeholder={intl.get("components.deliveryAddress.index.cityCodePlaceholder")}/>
                            )}
                        </div>
                        <div className={cx("field-val")} >
                            {getFieldDecorator(`address[${address.index}]`, {
                                initialValue: address.address
                            })(
                                <Input placeholder={intl.get("components.deliveryAddress.index.addressPlaceholder")} maxLength={120} />
                            )}
                        </div>
                        {
                            maxNum===1?null:
                                <div className={cx("field-ope")} >
                                    {len < maxNum ?
                                        <PlusCircleOutlined onClick={this.add} /> : ""}
                                    {len > 1 ?
                                        <MinusCircleOutlined onClick={() => this.remove(address.index)} /> : ""}

                                </div>
                        }

                    </Form.Item>
                    <div style={{display:"none"}}>
                        {getFieldDecorator(`provinceText[${address.index}]`, {initialValue:address.provinceText})(<Input />)}
                        {getFieldDecorator(`cityText[${address.index}]`, {initialValue:address.cityText})(<Input />)}
                    </div>
                </Col>
            </Row>
        ));

        return (
            <React.Fragment>
                {formItems}
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => ({
    areaInfo: state.getIn(['provinceAndCity', 'proviceAndCityInfo']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncGetProvinceList:areaActions.asyncGetProvinceList,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DeliveryAddress))