import React, {Component} from 'react';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select ,Col, Row, Form, Button} from 'antd';
import {connect} from 'react-redux';
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import {newAddForm as AddForm, actions as addFormActions} from 'components/layout/addForm';
import {addPage} from  'components/layout/listPage';
import CopyFromSale from 'components/business/copyFromSaleWithCheckbox';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import {bindActionCreators} from "redux";
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {asyncGetNextBom, asyncAddMrpCount,asyncGetBomChilren,dispatchUpDateTime,dispatchEmptyData,asyncFetchPreData} from "../actions";
import BaseInfo from './baseInfo';
import ProdList from './prodList';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class Add extends addPage {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            goodsPopVisible: false,  // 选择物品弹层
            copyFromSaleVisible: false,
            purchaseList: [],
            formHasChanged: false
        }
    }

    componentDidMount(){
        this.initPreData();
        this.props.setInitFinished();
    }

    componentWillUnmount(){
        this.props.dispatchEmptyData();
    }

    /** 初始化数据 */
    initPreData = () => {
        this.props.asyncFetchPreData(data=>{
            if(data.retCode === '0') {
                // console.log(data.warehouseName, 'warehouseName');
                this.formRef.current.setFieldsValue({
                    warehouseName: [data.warehouseName]
                });
            }
        });
    };

    closeModal = (tag) => {
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };

    openModal = (tag) => {
        let obj = {
            formHasChanged: true
        };
        obj[tag] = true;
        this.setState(obj);
    };

    selectGoods = (ids, visibleKey) => {
        this.setState({
            formHasChanged: true
        });
        this.openModal(visibleKey);
    };

    //获取列表数据
    handleGetData = () =>{
        let saleProdList = this.state.purchaseList;
        if(saleProdList.length === 0){
            return false;
        }
        //验证表单提交获取数据
        this.formRef.current.validateFields().then(values => {
            this.props.asyncGetNextBom({
                saleProdList,
                netFlag: values.netFlag,
                warehouseName: values.warehouseName.join(','),
                stockRule: values.stockRule?values.stockRule.join(','):''
            },(data)=>{
                this.distributeInfo(data);
            });
        });

    };

    handleGoodsOnOk = (selectedRows, visibleKey) => {
        this.closeModal(visibleKey);
        const prodList = selectedRows.map(item => {
            return {
                prodNo: item.code || item.productCode,
                grossQuantity: item.quantity
            }
        });
        //验证表单提交获取数据
        this.formRef.current.validateFields().then(values => {
            this.props.asyncGetNextBom({
                prodList,
                netFlag: values.netFlag,
                warehouseName: values.warehouseName.join(','),
                stockRule: values.stockRule?values.stockRule.join(','):''
            },(data)=>{
                this.distributeInfo(data);
            });
        });
    };
    //分发异步带入数据
     distributeInfo = (data)=>{
        if(data && data.length>0){
            for(let i=0;i<data.length;i++){
                setTimeout(()=>{
                    this.props.asyncGetBomChilren(data[i]);
                },200);
            }
        }
    }

    onOk = (purchaseList)=>{
        this.setState({
            purchaseList
        },()=>{
            this.closeModal('copyFromSaleVisible');
            //获取数据
            this.handleGetData();
        });
    };

    handleCreate = () => {
        this.formRef.current.validateFields().then((values)=>{
            console.log(values,'values');
            let {getNextBomData} = this.props;
            const prodList = getNextBomData && getNextBomData.getIn(['data','data']);
            let dataSource = prodList && prodList.toJS() || [];

            if(dataSource.length === 0){
                message.error('请选择一条销售订单！')
            }else{
                let requireDateFlag = true;
                for(let j=0;j<dataSource.length;j++){
                    let item = dataSource[j];
                    if(item.id.split('-').length === 1 && !item.requiredDate){
                        requireDateFlag = false;
                        break;
                    }
                }
                if(requireDateFlag){
                    let _this = this;
                    this.props.emptyFieldChange();
                    this.props.asyncAddMrpCount({
                        netFlag: values.netFlag,
                        warehouseName: values.warehouseName.join(','),
                        stockRule: values.stockRule?values.stockRule.join(','):'',
                        prodList: dataSource
                    },(res)=>{
                        console.log(res,'res');
                        if (res.retCode === '0') {
                            Modal.info({
                                title: 'Mrp运算中',
                                content: (
                                    <div>
                                        <p>运算将持续一段时间，待运算完成再次进入进入详情页即可查看运算结果</p>
                                    </div>
                                ),
                                onOk() {
                                    //路由跳转
                                    _this.setState({
                                        formHasChanged: false
                                    },()=>{
                                        _this.props.history.push(`/productControl/mrpCount/list`);
                                    });
                                },
                            });
                        } else {
                            message.error(res.data.retMsg);
                        }
                    });
                }else{
                    message.error('需求日期为必填项！');
                }

            }

        })
    };

    render() {

        let {getNextBomData} = this.props;
        const prodList = getNextBomData && getNextBomData.getIn(['data','data']);
        console.log(prodList,'prodListff');
        console.log(getNextBomData && getNextBomData.toJS(),'getNextBomData');
        let footerBar = <React.Fragment>
            <Button type="primary" htmlType="button"  onClick={()=>this.handleCreate()}>保存</Button>
            <Button type="default" onClick={this.props.history.goBack}>取消</Button>
        </React.Fragment>;

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/productControl/mrpCount/list',
                            title: "模拟生产列表"
                        },
                        {
                            title: "新建模拟生产"
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <AddForm
                        {...this.props}
                        formRef={this.formRef}
                       /* onSubmit={this.handleCreate}*/
                        loading={this.props.addMrpCount.get('isFetching')}
                        footerBar={footerBar}
                    >
                        {
                            this.formRef.current && (
                               <>
                                <AddForm.BaseInfo>
                                    <BaseInfo {...this.props} getChange={this.handleGetData}/>
                                </AddForm.BaseInfo>
                                <div className={cx("btn-copy")}>
                                    <Button type="sub" ga-data={"purchase-copy-from-sale"}
                                            onClick={() => this.selectGoods([], 'copyFromSaleVisible')}>从销售订单复制</Button>

                                    <Button type="sub" style={{"marginLeft": "20px"}}
                                            onClick={() => this.selectGoods([], 'goodsPopVisible')}>选择物品</Button>
                                </div>
                                <AddForm.ProdList>
                                   <ProdList
                                       {...this.props}
                                       formRef={this.formRef}
                                       prodList={prodList}
                                       getBomChilren={this.props.asyncGetBomChilren}
                                       dispatchUpDateTime={this.props.dispatchUpDateTime}
                                   />
                                 </AddForm.ProdList>
                               </>
                            )
                        }
                    </AddForm>
                </Content.ContentBd>
                <CopyFromSale
                    visible={this.state.copyFromSaleVisible}
                    visibleFlag={'copyFromSaleVisible'}
                    onOk={this.onOk}
                    onCancel={() => this.closeModal('copyFromSaleVisible')}
                    popType={'goods'}
                    unitPriceSource='orderPrice'
                    copySource={'purchase'} //复制按钮的来源
                />

                <SelectGoodsOrFitting
                    visible={this.state.goodsPopVisible}
                    visibleFlag={'goodsPopVisible'}
                    onOk={this.handleGoodsOnOk}
                    onCancel={() => this.closeModal('goodsPopVisible')}
                    selectType={"checkbox"}
                    popType={'goods'}
                    condition={{disableFlag: 0}}
                    hideFields={['orderPrice', 'salePrice']}
                    editFields={[{
                        dataIndex:'quantity',
                        editable:true,
                        title: '需求数量',
                        width: 110
                    }]}
                    selectedRowKeys={[]}
                    selectedRows={[]}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        getNextBomData: state.getIn(['mrpCountReduceAdd', 'getNextBomData']),
        addMrpCount: state.getIn(['mrpCountReduceAdd', 'addMrpCount'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncGetNextBom,
        asyncAddMrpCount,
        asyncGetBomChilren,
        dispatchUpDateTime,
        dispatchEmptyData,
        asyncFetchPreData,
        setInitFinished: addFormActions.setInitFinished
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(AddForm.create(Add))
