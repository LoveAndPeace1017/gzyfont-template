import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Input, Checkbox, Select, TreeSelect, Row } from 'antd';
import {AddPkgOpen} from 'components/business/vipOpe';
const Option = Select.Option;
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import intl from 'react-intl-universal';
import {SelectGoodsCate} from 'pages/auxiliary/category';
import Auxiliary from 'pages/auxiliary';
import {AuthInput} from 'components/business/authMenu';
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);


class BaseInfo extends Component {

    state = {
        useSystemCode: true,
        auxiliaryVisible: false,
        auxiliaryKey: '',
        equalProdVisible: false
    };

    handleClose(type) {
        this.setState({
            [type]: false
        })
    }

    closeEqualTip = ()=>{
        this.setState({
            equalProdVisible: false
        });
    };


    setProdNo = (e) => {
        const {setFieldsValue} = this.props.form;
        this.setState({
            useSystemCode: e.target.checked
        });
        if (e.target.checked) {
            const displayCode = this.props.code;
            setFieldsValue({
                displayCode
            })
        } else {
            setFieldsValue({
                displayCode: ''
            })
        }
    };

    prodNoChange = () => {
        this.setState({
            useSystemCode: false
        })
    };

    componentDidMount() {
    }

    handleSalePriceChange = (priceListDataSource, e) => {
        const {form: {setFieldsValue, getFieldValue}} = this.props;
        let priceDecimalNum = getCookie("priceDecimalNum");
        const value = e.target.value;
        priceListDataSource && priceListDataSource.forEach(item => {
            const percentage = getFieldValue(`customerLevelPrices[${item.key}].percentage`);
            if (percentage) {
                setFieldsValue({
                    [`customerLevelPrices[${item.key}].salePrice`]: value ? fixedDecimal(value * percentage / 100, priceDecimalNum) : ''
                })
            }
        });
        this.setState({
            salePriceDisabled: !value
        })
    };

    render() {

        const {form: {getFieldDecorator, getFieldValue, setFieldsValue}, customerLvList, initBaseInfo, isCnGoods, customerLvListDataSource} = this.props;
        const {match} = this.props;

        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            }
        };

        getFieldDecorator("code", {
            ...defaultOptions,
            initialValue: match.params.id
        });

        return (
            <div className={cx('baseInfo')}>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.displayCode")}
                            {...formItemLayout}
                        >
                            {
                                match.params.id ? (
                                    <div style={{position: "relative",top: "20px"}}>
                                        {initBaseInfo && initBaseInfo.get("displayCode")}
                                    </div>
                                ) : (
                                    <React.Fragment>
                                        <div className={cx("input-prodNo")}>
                                            {
                                                getFieldDecorator("displayCode", {
                                                    ...defaultOptions,
                                                    initialValue: this.props.code,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: intl.get("goods.add.validate1")
                                                        }
                                                    ]
                                                })(
                                                    <Input maxLength={50} placeholder={intl.get("goods.add.placeholder")}
                                                           onChange={this.prodNoChange}/>
                                                )
                                            }
                                        </div>
                                        <Checkbox className={cx("ck-prodNo")} checked={this.state.useSystemCode}
                                                  onChange={this.setProdNo}>{intl.get("goods.add.ckProdNo")}</Checkbox>
                                    </React.Fragment>
                                )
                            }

                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <div style={{display: this.state.equalProdVisible ? 'block' : 'none'}} className={cx("equalProd")}>
                            <Icon onClick={this.closeEqualTip} type="close"/>
                            {intl.get("goods.add.tip1")}
                        </div>
                        <Form.Item
                            label={intl.get("goods.add.name")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("name", {
                                    ...defaultOptions,
                                    initialValue: initBaseInfo && initBaseInfo.get("name"),
                                    rules: [
                                        {
                                            required: true,
                                            message: intl.get("goods.add.validate2")
                                        },
                                        {
                                            max: 100,
                                            message: intl.get("goods.add.validate3")
                                        },
                                        {
                                            validator: (rules, val, callback) => {
                                               this.props.asyncFetchCheckName(val,(data)=>{
                                                   this.setState({
                                                       equalProdVisible: data.retCode != '0'
                                                   });
                                               });
                                                callback()
                                            }
                                        }
                                    ]
                                })(
                                    <Input maxLength={100} />
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.unit")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("unit", {
                                    ...defaultOptions,
                                    initialValue: initBaseInfo && initBaseInfo.get("unit"),
                                    rules: [
                                        {
                                            required: true,
                                            message: intl.get("goods.add.validate4")
                                        }
                                    ]
                                })(
                                    <SelectUnit showEdit={true} carryDefaultValue={false}/>
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.description")}
                            {...formItemLayout}
                        >
                            {
                                (match.params.id && initBaseInfo && initBaseInfo.get("specGroup")) ?
                                    (
                                        getFieldDecorator("description", {
                                            ...defaultOptions,
                                            initialValue: initBaseInfo && initBaseInfo.get("description")
                                        })(
                                            <Input disabled={true} placeholder={'设置物品规格型号'} maxLength={1000} />
                                        )

                                    ): (
                                        getFieldDecorator("description", {
                                            ...defaultOptions,
                                            initialValue: initBaseInfo && initBaseInfo.get("description")
                                        })(
                                            <Input placeholder={'设置物品规格型号'} maxLength={1000} />
                                        )
                                   )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.category")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("category", {
                                    ...defaultOptions,
                                    initialValue: {
                                        value: initBaseInfo ? initBaseInfo.get("categoryCode") : '',
                                        label: initBaseInfo ? initBaseInfo.get("categoryName") : ''
                                    }
                                })(
                                    <SelectGoodsCate hideCnGroup/>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.minQuantity")}
                            {...formItemLayout}
                        >

                            <Form.Item
                                style={{display: 'inline-block', width: 'calc(50% - 12px)'}}
                            >
                                {
                                    getFieldDecorator("minQuantity", {
                                        ...defaultOptions,
                                        initialValue: initBaseInfo && fixedDecimal(initBaseInfo.get("minQuantity"), quantityDecimalNum),
                                        rules: [
                                            {
                                                validator: (rules, val, callback) => {
                                                    const maxQuantity = this.props.form.getFieldValue('maxQuantity');
                                                    if (val) {
                                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                        if (val && !reg.test(val)) {
                                                            callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                        }
                                                        if (val < 0) {
                                                            callback(intl.get("goods.add.validate6"))
                                                        } else if (maxQuantity && val > maxQuantity * 1.0) {
                                                            callback(intl.get("goods.add.validate7"));
                                                        } else {
                                                            callback();
                                                        }
                                                    } else {
                                                        callback();
                                                    }

                                                }
                                            }
                                        ]
                                    })(
                                        <Input placeholder={intl.get("goods.add.limitUp")} maxLength={11+Number(quantityDecimalNum)}/>
                                    )
                                }
                            </Form.Item>
                            <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}/>
                            <Form.Item style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
                                {
                                    getFieldDecorator("maxQuantity", {
                                        ...defaultOptions,
                                        initialValue: initBaseInfo && fixedDecimal(initBaseInfo.get("maxQuantity"), quantityDecimalNum),
                                        rules: [
                                            {
                                                validator: (rules, val, callback) => {
                                                    const minQuantity = this.props.form.getFieldValue('minQuantity');
                                                    if (val) {
                                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                        if (val && !reg.test(val)) {
                                                            callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                        }
                                                        if (val <= 0) {
                                                            callback(intl.get("goods.add.validate9"))
                                                        } else if (minQuantity && val < minQuantity * 1.0) {
                                                            callback(intl.get("goods.add.validate10"));
                                                        } else {
                                                            callback();
                                                        }
                                                    } else {
                                                        callback();
                                                    }

                                                }
                                            }
                                        ]
                                    })(
                                        <Input placeholder={intl.get("goods.add.limitDown")} maxLength={11+Number(quantityDecimalNum)}/>
                                    )
                                }
                            </Form.Item>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.orderPrice")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("orderPrice", {
                                    initialValue: initBaseInfo && fixedDecimal(initBaseInfo.get("orderPrice"), priceDecimalNum),
                                    rules: [
                                        {
                                            validator: (rules, val, callback) => {
                                                if (val) {
                                                    let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                                    if (val && !reg.test(val)) {
                                                        callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                                    }
                                                    callback();
                                                } else {
                                                    callback();
                                                }
                                            }
                                        }
                                    ],
                                    ...defaultOptions
                                })(
                                    <AuthInput module="purchasePrice" option="show" noAuthRender="**" maxLength={11+Number(quantityDecimalNum)}/>
                                )
                            }

                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.salePrice")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("salePrice", {
                                    initialValue: initBaseInfo && fixedDecimal(initBaseInfo.get("salePrice"), priceDecimalNum),
                                    ...defaultOptions,
                                    rules: [{
                                        required: this.props.source === 'mall',
                                        message: intl.get("goods.add.tip2")
                                    },{
                                        validator: (rules, val, callback) => {
                                            if (val) {
                                                let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                                if (val && !reg.test(val)) {
                                                    callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                                }
                                                callback();
                                            } else {
                                                callback();
                                            }
                                        }
                                    }]
                                })(
                                    //<Input maxLength={14} onChange={this.handleSalePriceChange.bind(this, customerLvListDataSource)} disabled={this.props.isCnGoods}/>
                                    <AuthInput maxLength={11+Number(quantityDecimalNum)}
                                               onChange={this.handleSalePriceChange.bind(this, customerLvListDataSource)}
                                               module="salePrice" option="show" noAuthRender="**"/>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.proBarCode")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("proBarCode", {
                                    ...defaultOptions,
                                    initialValue: initBaseInfo && initBaseInfo.get("proBarCode")
                                })(
                                    <Input placeholder={intl.get("goods.add.placeholder1")} maxLength={50}/>
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.brand")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("brand", {
                                    ...defaultOptions,
                                    initialValue: initBaseInfo && initBaseInfo.get("brand")
                                })(
                                    <Input maxLength={30}/>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.produceModel")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("produceModel", {
                                    ...defaultOptions,
                                    initialValue: initBaseInfo && initBaseInfo.get("produceModel")
                                })(
                                    <Input maxLength={100}/>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'保质期管理'}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("expirationFlag", {
                                    initialValue:(initBaseInfo && initBaseInfo.get("expirationFlag")) || false,
                                    ...defaultOptions,
                                })(
                                    <Select>
                                        <Option value={false}>关闭</Option>
                                        <Option value={true}>
                                            <AddPkgOpen
                                                cancelCallback={() => setFieldsValue({expirationDay: false})}
                                                source={'batchShelfLeft'}
                                                render={() => (
                                                    <React.Fragment>
                                                        开启
                                                    </React.Fragment>
                                                )}
                                            />
                                        </Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>
                {
                    getFieldValue('expirationFlag')=== true && (
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    label={'保质期（天）'}
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator("expirationDay", {
                                            ...defaultOptions,
                                            initialValue: initBaseInfo && initBaseInfo.get("expirationDay"),
                                            rules: [
                                                {
                                                    validator: (rules, val, callback) => {
                                                        if(val){
                                                            if(!/^[1-9]+[0-9]*$/.test(val)){
                                                                callback('该项必须为正整数');
                                                            } else {
                                                                callback();
                                                            }
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }
                                            ]
                                        })(
                                            <Input maxLength={5} placeholder={'请输入保质期'}/>
                                        )
                                    }
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label={'报警天数'}
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator("alarmDay", {
                                            ...defaultOptions,
                                            initialValue: initBaseInfo && initBaseInfo.get("alarmDay"),
                                            rules: [
                                                {
                                                    validator: (rules, val, callback) => {
                                                        if(val){
                                                            if(!/^[1-9]+[0-9]*$/.test(val)){
                                                                callback('该项必须为正整数');
                                                            } else {
                                                                callback();
                                                            }
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }
                                            ]
                                        })(
                                            <Input maxLength={5} placeholder={'请输入报警天数'}/>
                                        )
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                    )
                }
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={'辅助单位'}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("unitFlag", {
                                    initialValue:(initBaseInfo && (initBaseInfo.get("unitFlag")?1:0)) || 0,
                                    ...defaultOptions,
                                })(
                                    <Select>
                                        <Option value={0}>关闭</Option>
                                        <Option value={1}>开启</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.purchaseLead")}
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator("purchaseLead", {
                                    ...defaultOptions,
                                    initialValue: initBaseInfo && initBaseInfo.get("purchaseLead"),
                                    rules: [
                                        {
                                            validator: (rules, val, callback) => {
                                                if (val) {
                                                    if(!/^[1-9]+[0-9]*$/.test(val)){
                                                        callback('该项必须为正整数');
                                                    } else {
                                                        callback();
                                                    }
                                                } else {
                                                    callback();
                                                }
                                            }
                                        }
                                    ]
                                })(
                                    <Input maxLength={10}/>
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.handleClose.bind(this, 'auxiliaryVisible')}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo)