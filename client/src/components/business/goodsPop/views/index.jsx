import React, {Component} from 'react';
import intl from 'react-intl-universal';
import '@ant-design/compatible/assets/index.css';
import { Modal, Tabs, message, Spin} from 'antd';
const TabPane = Tabs.TabPane;


import styles from "../styles/index.scss";
import classNames from "classnames/bind";

import GoodsTab from "../dependencies/goodsTab";
import FittingTab from "../dependencies/fittingTab";
import ProduceFittingTab from "../dependencies/produceFittingTab";
import {bindActionCreators} from "redux";
import {getCookie} from 'utils/cookie';
import {actions as fittingActions} from "pages/fitting/index";
import {actions as produceActions} from "pages/produceOrder/index";
import {connect} from "react-redux";
import loading from '../../../../images/loading.gif';

const cx = classNames.bind(styles);
const defaultGoods = {
    key:'id-0',
    serial:'1',
    id:'id-0',
    code:"",
    name:"",
    model:"",
    unit:""
};
class GoodsPop extends Component{
    constructor(props){
        super(props);
        this.state = {
            exportModalVisible:false,
            loading:false,
            customerSearchBtnVisible:false,
            params:{},
            selectedRows:[],
            selectedRowKeys:[],
            selectedFittingRows:[],
            selectedFittingRowKeys:[],
            tempSelectedFittingRowKeys: [],
            tempSelectedFittingRows: [],
            tabPanel:'goods',
            isFetching: false
        }
    }

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    openModal = ()=>{
        this.setState({
            exportModalVisible:true
        });
    };
    closeModal = ()=>{
        this.setState({
            exportModalVisible:false
        });
    };
    onSelectRowChange = (selectedRowKeys,selectedRows)=>{
        let maxLength = this.props.maxLength;
        if(selectedRowKeys.length>maxLength){
            message.error(`最多可选择${maxLength}条物品`);
            return false;
        }
        this.setState({
            selectedRowKeys,
            selectedRows,
            tabPanel:'goods',
        })
    };

    setIsFetching = (isFetching) => {
        this.setState({
            isFetching
        })
    };


    onSelectFittingRowChange = (selectedFittingRowKeys,selectedFittingRows)=>{
        this.setState({
            tempSelectedFittingRowKeys: selectedFittingRowKeys,
            tempSelectedFittingRows: selectedFittingRows,
            tabPanel:'fitting',
        })
    };

    onSelectProduceFittingRowChange = (selectedFittingRowKeys,selectedFittingRows)=>{
        this.setState({
            tempSelectedFittingRowKeys: selectedFittingRowKeys,
            tempSelectedFittingRows: selectedFittingRows,
            tabPanel:'produceFitting',
        })
    };

    onOk = ()=>{
        console.log('tabPanel:',this.state.tabPanel);
        if(this.state.tabPanel === 'goods'){
            let list = this.state.selectedRows;
            if(!list || list.length===0){
                list = [defaultGoods];
            }else{
                let errors = [];
                list.forEach(item=>{
                    if(item.form){
                        item.form.validateFields({force: true}, (error, values)=>{
                            if(error) {
                                errors.push(true)
                            }
                        })
                    }else{
                        errors.push(false);
                    }
                });
                if(errors.some(item=>item)) return;
                list = list.filter((item)=>{
                    return item.key!='id-0';
                });
                list = list.map((item,index)=>({
                    ...item,
                    serial:index+1
                }));
            }
            if(this.state.selectedRowKeys.filter(t=> !!t).length === 0) {
                message.info(intl.get("components.goodsPop.index.message1"));
            } else {
                this.props.onOk(list,this.props.visibleFlag, this.state.tabPanel);
            }
        } else if(this.state.tabPanel === 'produceFitting'){
            let {tempSelectedFittingRowKeys, tempSelectedFittingRows} = this.state;
            //数量精度
            let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
            let regFlag = false;
            for(var i = 0; i < tempSelectedFittingRows.length; i++ ){
                if (Number.isNaN(tempSelectedFittingRows[i].quantity) || !reg.test(tempSelectedFittingRows[i].quantity)) {
                    regFlag = true;
                    break;
                }
            }
            if(!regFlag) {
                this.setState({
                    selectedFittingRowKeys: tempSelectedFittingRowKeys,
                    selectedFittingRows: tempSelectedFittingRows
                });
                tempSelectedFittingRows = tempSelectedFittingRows.map(item => {
                    item.level = item.level || '1';
                    return item;
                });
                this.props.asyncFetchProduceFittingList({bomList: tempSelectedFittingRows}, (data) => {
                    if (data.retCode === '0') {
                        let list = data.list;
                        this.props.onOk(list,this.props.visibleFlag, this.state.tabPanel, tempSelectedFittingRows);
                    }
                });
            } else {
                message.error("数量格式错误，请填写正确的格式");
            }
        } else{
            let {tempSelectedFittingRowKeys, tempSelectedFittingRows} = this.state;

            let list = this.state.tempSelectedFittingRows;
            if(!list || list.length===0){
                this.props.onCancel();
            }else if(list.length>20) {
                message.info(intl.get("components.goodsPop.index.message2"));
            } else{
                //数量精度
                let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
                let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                let regFlag = false;
                for(var i = 0; i < tempSelectedFittingRows.length; i++ ){
                    if (Number.isNaN(tempSelectedFittingRows[i].num) || !reg.test(tempSelectedFittingRows[i].num)) {
                        regFlag = true;
                        break;
                    }
                }
                if(!regFlag){
                    // this.onChangeSpinPop();
                    this.setState({ isFetching: true });
                    this.setState({selectedFittingRowKeys: tempSelectedFittingRowKeys, selectedFittingRows: tempSelectedFittingRows});
                    this.props.asyncFetchProdCombinationsList({prodList: tempSelectedFittingRows},(data)=>{
                        if(data.retCode === '0'){
                            var list = data.data.prodList.map((item)=>{
                                return {
                                    ...item,
                                    code: item.prodNo,
                                    name: item.prodName,
                                    //salePrice: (item.salePrice && item.salePrice !== 0) ? item.salePrice : item.discountSalePrice
                                }
                            });
                            list = list.length===0?[defaultGoods]:list;
                            this.props.onOk(list,this.props.visibleFlag, this.state.tabPanel, tempSelectedFittingRows, ()=> {
                                this.setState({ isFetching: false });
                            });
                        }
                    });
                }else{
                    message.error("组数格式错误，请填写正确的格式");
                }
            }

        }

    };

    handleTabClick=(tabKey)=>{
        this.setState({
            tabPanel: tabKey
        })
    };

    render(){

        let {popType} = this.props;
        return(
            <Modal
                {...this.props}
                title={intl.get("components.goodsPop.index.chooseProd")}
                width={''}
                destroyOnClose={true}
                onOk={this.onOk}
                className={cx("goods-pop") + " list-pop"}
            >
                {
                    popType ==="goods" ? (
                        <GoodsTab {...this.props}
                                  onSelectRowChange={this.onSelectRowChange}
                        />
                    ): popType ==="produceGoods" ? (
                        <Tabs defaultActiveKey="goods" onTabClick={this.handleTabClick}>
                            <TabPane tab={intl.get("components.goodsPop.index.goods")} key="goods">
                                <GoodsTab {...this.props} display={true}
                                    // selectedRows={this.state.selectedRows}
                                          onSelectRowChange={this.onSelectRowChange}
                                /></TabPane>
                            <TabPane tab={'多级BOM'} key="produceFitting">
                                <ProduceFittingTab {...this.props}
                                                   onSelectFittingRowChange={this.onSelectProduceFittingRowChange}
                                /></TabPane>
                        </Tabs>
                    ) : (
                        <Tabs defaultActiveKey="goods" onTabClick={this.handleTabClick}>
                            <TabPane tab={'我的物品'} key="goods">
                                <GoodsTab {...this.props} display={true}
                                    // selectedRows={this.state.selectedRows}
                                          onSelectRowChange={this.onSelectRowChange}
                                /></TabPane>
                            <TabPane tab={'多级BOM'} key="fitting">
                                <Spin spinning={this.state.isFetching}
                                      indicator={
                                          <React.Fragment>
                                              <img src={loading} style={{marginTop: '50px', width: '130px', height:'auto'}}/>
                                              <p>别着急，数据拼命加载中！</p>
                                          </React.Fragment>
                                      }>
                                    <FittingTab {...this.props}
                                                onSelectFittingRowChange={this.onSelectFittingRowChange}
                                    />
                                </Spin>
                            </TabPane>
                        </Tabs>
                    )
                }
            </Modal>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getLocalFittingInfo:fittingActions.getLocalFittingInfo,
        asyncFetchProdCombinationsList: fittingActions.asyncFetchProdCombinationsList,
        asyncFetchProduceFittingList: produceActions.asyncFetchProduceFittingList
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(GoodsPop)