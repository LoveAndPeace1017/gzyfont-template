import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Input, Table, Form, Row, Col } from 'antd';
import 'url-search-params-polyfill';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {PlusOutlined,MinusOutlined,DeleteOutlined,LoadingOutlined} from '@ant-design/icons';
import Upload from 'components/widgets/upload';
import {AuthInput} from 'components/business/authMenu';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from 'moment-timezone';
import {message} from "antd/lib/index";
moment.tz.setDefault("Asia/Shanghai");
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

/**
 * 多规格表格(下)
 *
 * @visibleName Index（多规格table）
 * @author jinb
 */
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: [{key: 0}],
            currentKey: 0,
            loading: false,   // 上传按钮的加载状态
        };
        this.dataPrefix = this.props.dataPrefix;
    }

    componentDidMount() {
        this.props.getRef(this);
    }

    // 控制一个规格恢复或删除的状态
    handleOneSpecDisabledStatus = (key, flag) => {
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        let formData = getFieldValue([this.dataPrefix]);
        formData[key].disabled = flag;
        setFieldsValue({[this.dataPrefix]: formData});
    };

    // 一键填充
    oneKeyFill=()=>{
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        let formData = getFieldValue([this.dataPrefix]);

        let minQuantity, maxQuantity;
        //找到第一个有效数据
        for (let i = 0; i < formData.length; i++) {
            let tempMinQuantity = Number(formData[i].minQuantity);
            let tempMaxQuantity = Number(formData[i].maxQuantity);
            if(tempMinQuantity < tempMaxQuantity){
                minQuantity = formData[i].minQuantity;
                maxQuantity = formData[i].maxQuantity;
                break;
            }
        }
        if(minQuantity && maxQuantity){
            for (let i = 0; i < formData.length; i++) {
                formData[i].minQuantity = minQuantity;
                formData[i].maxQuantity = maxQuantity;
            }
            setFieldsValue({[this.dataPrefix]: formData});
        } else {
            message.error('整数部分不能超过10位，小数点后不能超过3位！库存下限不能高于库存上限！')
        }
    };

    beforeUpload = (file) => {
        const isIMG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp';
        if (!isIMG) {
            message.error(intl.get("goods.add.errorInfo3"));
        }
        const isLtSize = file.size / 1024 / 1024 <= 1;
        if (!isLtSize) {
            message.error(intl.get("goods.add.errorInfo1"));
        }
        return isIMG && isLtSize;
    };

    handleChange = (info, key) => {
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        let formData = getFieldValue([this.dataPrefix]);

        if (info.file.status === 'uploading') {
            this.setState({ loading: true, currentKey: key });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl =>{
                let data = info.file.response.data;
                let ffsKey = data && data.ffsKey;
                formData[key].imageUrl = imageUrl;
                formData[key].ffsKey = ffsKey;
                setFieldsValue({[this.dataPrefix]: formData});
                this.setState({
                    loading: false,
                });
            });
        }
    };

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    // 新增
    addOneSpecData = (index) => {
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        let formData = getFieldValue([this.dataPrefix]);
        formData.splice(index+1, 0, {key: 1});
        let dataSource = formData.map((item, index) => {
            item.key = index;
            return item;
        });
        this.setState({dataSource});
        setFieldsValue({[this.dataPrefix]: formData});
    };

    // 删除该行
    removeOneSpecData = (index) => {
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        let formData = getFieldValue([this.dataPrefix]);
        formData.splice(index, 1);
        let dataSource = formData.map((item, index) => {
            item.key = index;
            return item;
        });
        this.setState({dataSource});
        setFieldsValue({[this.dataPrefix]: formData});
    };

    // 校验相同物品条码
    validateSameSpec = (type, curValue) => {
        let {getFieldValue} = this.props.formRef.current;
        let formData = getFieldValue([this.dataPrefix]);

        const values = formData.map(item => {
            const value = getFieldValue([this.dataPrefix, item.key, type]);
            if (value) {
                return value;
            }
        }).filter(item => item);
        console.log(values, 'values');
        if(!values && values.length===0) return false; //可以为空
        let num = 0;
        values.forEach((item => {
            if(item===curValue){
                num++;
            }
        }));
        return num > 1; // 数量大于1则返回true
    };

    render() {
        let {dataSource, loading, currentKey} = this.state;
        let {specName1, specName2, specName3, source} = this.props;
        let {getFieldValue} = this.props.formRef.current;
        let specDisabled = (source==='add');
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        let priceDecimalNum =  Number(getCookie("priceDecimalNum")||3);
        let prefixColumn = [{
            title: '',
            key: 'ope',
            dataIndex: 'ope',
            width: 60,
            render: (value, record, index) => {
                return (
                    <React.Fragment>
                        {/*新增规格页面使用*/}
                        {
                            source === 'add' && (
                                getFieldValue([this.dataPrefix, record.key, 'disabled']) ? (
                                    <a href="#!" className={cx('add-item')} onClick={() => this.handleOneSpecDisabledStatus(record.key, false)}>恢复</a>
                                ) : (
                                    <a href="#!" className={cx('add-item')} onClick={() => this.handleOneSpecDisabledStatus(record.key, true)}><DeleteOutlined style={{fontSize: "16px"}}/></a>
                                )
                            )
                        }
                        {/*详情页新增规格时使用*/}
                        {
                            source === 'detail' && (
                                <React.Fragment>
                                    <a href="#!" className={cx('add-item')} onClick={() => this.addOneSpecData(index)}><PlusOutlined style={{fontSize: "16px"}}/></a>
                                    {
                                        dataSource.length > 1 ? (
                                            <a href="#!" className={cx('delete-item')} onClick={() => this.removeOneSpecData(index)}><MinusOutlined style={{fontSize: "16px"}}/></a>
                                        ) : null
                                    }
                                </React.Fragment>
                            )
                        }

                        <div style={{display:"none"}}>
                            <Form.Item
                                name={[this.dataPrefix, record.key, 'disabled']}
                                initialValue={false}
                            >
                                <Input type="hidden"/>
                            </Form.Item>

                            <Form.Item name={[this.dataPrefix, record.key, 'ffsKey']}>
                                <Input type="hidden"/>
                            </Form.Item>
                            <Form.Item name={[this.dataPrefix, record.key, 'imageUrl']}>
                                <Input type="hidden"/>
                            </Form.Item>
                        </div>
                    </React.Fragment>
                )
            }
        }];


        let specColumn = [];

        specName1 && (specColumn = specColumn.concat(
            {
                title: specName1,
                dataIndex: 'spec1',
                width: 150,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                label=""
                                name={[this.dataPrefix, record.key, "spec1"]}
                                rules={[
                                    {
                                        required: true,
                                        message: '该项为必填项'
                                    }
                                ]}
                            >
                                <Input maxLength={20} disabled={specDisabled}/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            }
        ));

        specName2 && (specColumn = specColumn.concat(
            {
                title: specName2,
                dataIndex: 'spec2',
                width: 150,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                label=""
                                name={[this.dataPrefix, record.key, "spec2"]}
                                rules={[
                                    {
                                        required: true,
                                        message: '该项为必填项'
                                    }
                                ]}
                            >
                                <Input maxLength={20} disabled={specDisabled} />
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            }
        ));

        specName3 && (specColumn = specColumn.concat(
            {
                title: specName3,
                dataIndex: 'spec3',
                width: 150,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                label=""
                                name={[this.dataPrefix, record.key, "spec3"]}
                                rules={[
                                    {
                                        required: true,
                                        message: '该项为必填项'
                                    }
                                ]}
                            >
                                <Input maxLength={20} disabled={specDisabled}/>
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            }
        ));


        const commonColumns = [
            {
                title: '主图',
                dataIndex: 'url',
                width: 60,
                render: (value, record, index) => {
                    let imageUrl = getFieldValue([this.dataPrefix, record.key, 'imageUrl']);
                    let isDisabled = getFieldValue([this.dataPrefix, record.key, 'disabled']);
                    return (
                        <React.Fragment>
                            <Upload
                                action={`${BASE_URL}/goods/temp_photos`}
                                name="photo"
                                listType= "picture-card"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                                onChange={(info) => this.handleChange(info, record.key)}
                                onRemove={this.handleRemove}
                                disabled={isDisabled}
                                className={cx("upload-item")}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} /> : ((loading && currentKey===record.key) ? <LoadingOutlined /> : <PlusOutlined />)}
                            </Upload>
                        </React.Fragment>
                    )
                }
            },{
            title: '物品编号(不填写默认带入系统编号)',
            dataIndex: 'displayCode',
            width: 250,
            render: (value, record, index) => {
                return (
                    <React.Fragment>
                        <Form.Item
                            label=""
                            name={[this.dataPrefix, record.key, "displayCode"]}
                        >
                            <Input maxLength={50} disabled={getFieldValue([this.dataPrefix, record.key, 'disabled'])}/>
                        </Form.Item>
                    </React.Fragment>
                )
            }
        },{
            title: <div className="tb-fill-wrap">库存上下限<a href="#!" className={"fr"} onClick={this.oneKeyFill}>一键填充</a></div>,
            dataIndex: 'minQuantity',
            width: 300,
            render: (value, record, index) => {
                return (
                    <React.Fragment>
                        <Row>
                            <Col span={11}>
                                <Form.Item
                                    label=""
                                    name={[this.dataPrefix, record.key, "minQuantity"]}
                                    rules={[
                                        {
                                            validator: (rules, val, callback) => {
                                                let {getFieldValue} = this.props.formRef.current;
                                                const maxQuantity = getFieldValue([this.dataPrefix, record.key, "maxQuantity"]);
                                                if (val) {
                                                    let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                    if (Number.isNaN(val) || !reg.test(val)) {
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
                                    ]}
                                >
                                    <Input placeholder={intl.get("goods.add.limitUp")}
                                           maxLength={11+Number(quantityDecimalNum)}
                                           disabled={getFieldValue([this.dataPrefix, record.key, 'disabled'])}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <span className={cx('table-line')}>-</span>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    label=""
                                    name={[this.dataPrefix, record.key, "maxQuantity"]}
                                    rules={[
                                        {
                                            validator: (rules, val, callback) => {
                                                let {getFieldValue} = this.props.formRef.current;
                                                const minQuantity = getFieldValue([this.dataPrefix, record.key, "minQuantity"]);
                                                if (val) {
                                                    let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                    if (Number.isNaN(val) || !reg.test(val)) {
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
                                    ]}
                                >
                                    <Input placeholder={intl.get("goods.add.limitDown")}
                                           maxLength={11+Number(quantityDecimalNum)}
                                           disabled={getFieldValue([this.dataPrefix, record.key, 'disabled'])}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </React.Fragment>
                )
            }
        },{
            title: '物品条码',
            dataIndex: 'proBarCode',
            width: 150,
            render: (value, record, index) => {
                return (
                    <React.Fragment>
                        <Form.Item
                            label=""
                            name={[this.dataPrefix, record.key, "proBarCode"]}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        if (this.validateSameSpec('proBarCode', value)) {
                                            callback('该条码已存在');
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input placeholder={intl.get("goods.add.placeholder1")}
                                   maxLength={50}
                                   disabled={getFieldValue([this.dataPrefix, record.key, 'disabled'])}
                            />
                        </Form.Item>
                    </React.Fragment>
                )
            }
        },{
            title: '基准采购价',
            dataIndex: 'orderPrice',
            width: 100,
            render: (value, record, index) => {
                return (
                    <React.Fragment>
                        <Form.Item
                            label=""
                            name={[this.dataPrefix, record.key, "orderPrice"]}
                            rules={[
                                {
                                    validator: (rules, val, callback) => {
                                        if (val) {
                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                            if (val && !reg.test(val)) {
                                                callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                            } else {
                                                callback();
                                            }
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ]}
                        >
                            <AuthInput module="purchasePrice" option="show" noAuthRender="**" maxLength={14} disabled={getFieldValue([this.dataPrefix, record.key, 'disabled'])}/>
                        </Form.Item>
                    </React.Fragment>
                )
            }
        },{
            title: '基准销售价',
            dataIndex: 'salePrice',
            width: 100,
            render: (value, record, index) => {
                return (
                    <React.Fragment>
                        <Form.Item
                            label=""
                            name={[this.dataPrefix, record.key, "salePrice"]}
                            rules={[
                                {
                                    validator: (rules, val, callback) => {
                                        if (val) {
                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                            if (val && !reg.test(val)) {
                                                callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                            } else {
                                                callback();
                                            }
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ]}
                        >
                            <AuthInput maxLength={14} module="salePrice" option="show" noAuthRender="**" disabled={getFieldValue([this.dataPrefix, record.key, 'disabled'])}/>
                        </Form.Item>
                    </React.Fragment>
                )
            }
        }];


        let columns = prefixColumn.concat(specColumn).concat(commonColumns);

        //计算宽度
        const tableWidth = columns.reduce(function(width, item) {
            return width + (item.width !== undefined ? item.width : 200) / 1;
        }, 0);


        return (
            <React.Fragment>
                <Table
                    bordered
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    className={cx("goods-table")}
                    style={{marginTop: '20px'}}
                    scroll={{x: tableWidth}}
                />
            </React.Fragment>
        )
    }
}

