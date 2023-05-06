import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import 'url-search-params-polyfill';
import _ from 'lodash';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import { Form, Modal, Button, message } from 'antd';
import SuppliyQuotationTable from './suppliyQuotationTable';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from 'moment-timezone';
import {asyncAddGoodsForDetail} from 'pages/goods/multiGoodsAdd/actions';

moment.tz.setDefault("Asia/Shanghai");

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addGoods: state.getIn(['multiGoodsAdd', 'addGoods'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddGoodsForDetail
    }, dispatch)
};


@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {
    formRef = React.createRef();
    dataPrefix = 'ProductQuotationV2';
    source='quotation_supply';
    static propTypes = {
        /**
         *   弹层的显示与隐藏
         **/
        visible: PropTypes.bool,
        /**
         *   规格属性数组
         **/
        specDefine: PropTypes.array,
        /**
         *   规格对应的物品数据
         **/
        specProds: PropTypes.object,
        /**
         *   规格最大数量
         **/
        maxLength: PropTypes.number,
        /**
         *   物品编号
         **/
        billNo: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate(){
       this.initInfo()
    }

    initInfo = () => {
        this.prodRef.initInfo();
    }

    getProdRef = (prodRef)=>{
        this.prodRef = prodRef;
    };


    // 新增规格提交
    handleSubmit = (values) => {
        //对供应商字段处理
        let ProductQuotationV2 = values.ProductQuotationV2;
        ProductQuotationV2.forEach((item)=>{
            item.supplierCode = item.supplierCode.value;
            item.productCode = this.props.productCode;
        });
        console.log(values, 'values');
        this.props.asyncAddQuotationGoods('',values,(data)=>{
            if(data.data.retCode === "0"){
                message.success('操作成功！');
                this.prodRef.props.clearAllRows();
                this.prodRef.initSupplier();
                this.props.onOk();
            }else{
                message.error(data.data.retMsg||'操作失败');
            }
        });
    };


    render() {
        const tailLayout = {
            wrapperCol: { offset: 20, span: 16 },
        };
        const {goodsName,taxRate,asyncShowSupplier,productCode,unit,unitFlag} = this.props;
        console.log(unit,'unit');
        return (
            <React.Fragment>
                <Modal
                    title={`添加"${productCode}-${goodsName}"报价记录`}
                    visible={this.props.visible}
                    onCancel={this.props.onClose}
                    width={1200}
                    destroyOnClose={true}
                    forceRender={true}
                    footer={null}
                >
                    <Form ref={this.formRef}
                          onFinish={(values) => {
                              this.handleSubmit(values);
                          }}
                    >
                        {
                            this.formRef.current && (
                                <SuppliyQuotationTable dataPrefix={this.dataPrefix}
                                          getRef={this.getProdRef}
                                          formRef={this.formRef}
                                          asyncShowSupplier={asyncShowSupplier}
                                          defaultForm={{taxRate,unit}}
                                          unitFlag={unitFlag}
                                          productCode={productCode}
                                          source={this.source}
                                />
                            )
                        }

                        <Form.Item {...tailLayout}>
                            <div style={{marginTop: "20px",marginLeft: "38px"}}>
                                <Button type="primary" htmlType="submit">
                                    确定
                                </Button>
                                <Button onClick={this.props.onClose} style={{marginLeft: 10}}>
                                    取消
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        )
    }
}

