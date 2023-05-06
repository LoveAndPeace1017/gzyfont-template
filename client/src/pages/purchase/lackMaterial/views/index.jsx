import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Form,  Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Modal,
    Table,
    InputNumber,
    Button,
    Input,
    Menu,
    Dropdown,
    message,
    Spin,
    Select,
    Layout,
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchLackMaterialList
} from '../actions';

const cx = classNames.bind(styles);

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import Crumb from 'components/business/crumb';
import {Amount} from 'components/business/amount';
import {CopyMenu, ModifyMenu, DeleteMenu} from 'components/business/authMenu';
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import {FittingTab} from 'components/business/goodsPop';
import HeaderWrap from '../dependencies/headerWrap';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import {parse} from "url";
import defaultOptions from 'utils/validateOptions';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import * as constants from 'utils/constants';
import {actions as fittingActions} from "../../../fitting/index";
import {
  EllipsisOutlined
} from '@ant-design/icons';
const FormItem = Form.Item;
const EditableContext = React.createContext();


const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {

    // save = (value) => {
    //     const { record, handleSave } = this.props;
    //     console.log('save:',value);
    //     this.form.validateFields((error, values) => {
    //         if (error ) {
    //             return;
    //         }
    //         handleSave({ ...record, num:value });
    //     });
    // };

    save = (value) => {
        const { record, handleSave } = this.props;
        handleSave({ ...record, num:value });
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                <div className="tb-input-wrap">
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            initialValue: record[dataIndex],
                                            ...defaultOptions,
                                            rules: [
                                                {
                                                    required:true,
                                                    message: intl.get("purchase.lackMaterial.index.message1")
                                                },
                                                {
                                                    validator: (rules, value, callback) => {
                                                        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
                                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                        if (Number.isNaN(value) || !reg.test(value)) {

                                                            callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ],
                                        })(
                                            <InputNumber onChange={this.save} />
                                        )}
                                    </FormItem>
                                </div>
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

export class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            finishProductPopVisible: false,
            selectedRowKeys: [], // Check here to configure the default column
            selectedRows: [],
            selectedFittingRowKeys: [],
            selectedFittingRows: [],
            tempSelectedFittingRowKeys: [],
            tempSelectedFittingRows: [],
            warehouseName: '',
        };
    }


    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchLackMaterialList();
        let params = new URLSearchParams(this.props.location.search);
        const source = params && params.get('source');
        if(source === 'sale'){
            let selectedFittingRows = JSON.parse(localStorage.getItem("fittingProdList"));
            let selectedFittingRowKeys = selectedFittingRows.map(item => item.prodNo);
            this.setState({selectedFittingRows, selectedFittingRowKeys});
        }
    }

    closeModal = (tag) => {
        this.setState({
            [tag]:false
        })
    };
    openModal = (tag) => {
        this.setState({
            [tag]:true
        })
    };

    //选中项批量删除
    selectGoods = (visibleKey) => {
        this.openModal(visibleKey);
    };

    onSelectFittingRowChange = (selectedFittingRowKeys,selectedFittingRows)=>{
        this.setState({
            tempSelectedFittingRowKeys: selectedFittingRowKeys,
            tempSelectedFittingRows: selectedFittingRows,
        })
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedRowKeys, selectedRows});
    };

    // 成品
    chooseFinishProd = () => {
        let {selectedFittingRows, warehouseName} = this.state;
        if(selectedFittingRows.length > 0) {
            let regFlag = false;

            let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');

            for(var i = 0; i < selectedFittingRows.length; i++ ){
                if (Number.isNaN(selectedFittingRows[i].num) || !reg.test(selectedFittingRows[i].num)) {
                    regFlag = true;
                    break;
                }
            }
            if(!regFlag){
                this.props.asyncFetchLackMaterialList({prodList: selectedFittingRows, warehouseName});
            }
        } else {
            message.info(intl.get("purchase.lackMaterial.index.message3"));
        }
    };

    // 将缺料数量大于0的产品加入到采购订单
    addProdToPurchase = () => {
        let {selectedRows} = this.state;
        if (selectedRows.length > 0) {
            console.log(selectedRows, 'selectedRows');
            let prodList = selectedRows.map(item => {
                return {code: item.prodNo, quantity: item.componentQuantity}
            });
            localStorage.setItem('lackMaterial', JSON.stringify(prodList));
            window.open('/purchase/add?type=lackMaterial');
        } else {
            message.info(intl.get("purchase.lackMaterial.index.message4"));
        }
    };

    // 将缺料数量大于0的产品加入到请购订单
    addProdToRequisition = () => {
        let {selectedRows} = this.state;
        if (selectedRows.length > 0) {
            console.log(selectedRows, 'selectedRows');
            let prodList = selectedRows.map(item => {
                return {code: item.prodNo, quantity: item.componentQuantity}
            });
            localStorage.setItem('lackMaterial', JSON.stringify(prodList));
            this.props.history.push('/purchase/requisitionOrder/add/?type=lackMaterial');

        } else {
            message.info(intl.get("purchase.lackMaterial.index.message4"));
        }
    };

    handleSave = (row) => {
        let { selectedFittingRowKeys, selectedFittingRows } = this.state;
        let currentIndex = selectedFittingRowKeys.indexOf(row.key);
        if(selectedFittingRows.length!==0&&currentIndex!==-1){
            selectedFittingRows[currentIndex].num = row.num;
            this.setState({selectedFittingRows});
            this.props.setFittingList(row);
        }
    };

    onOk = () => {
        let {tempSelectedFittingRowKeys, tempSelectedFittingRows} = this.state;
        if(tempSelectedFittingRowKeys.length === 0) {
            this.closeModal('finishProductPopVisible');
        } else if(tempSelectedFittingRowKeys.length > 20) {
            message.info(intl.get("purchase.lackMaterial.index.message5"));
        } else {
            let regFlag = false;
            let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
            for(var i = 0; i < tempSelectedFittingRows.length; i++ ){
                if (Number.isNaN(tempSelectedFittingRows[i].num) || !reg.test(tempSelectedFittingRows[i].num)) {
                    regFlag = true;
                    break;
                }
            }
            if(!regFlag){
                this.setState({selectedFittingRowKeys: tempSelectedFittingRowKeys, selectedFittingRows: tempSelectedFittingRows});
                this.closeModal('finishProductPopVisible');
            }else{
                message.error("组数格式错误，请填写正确的格式");
            }
        }

    };


    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        const { selectedFittingRows } = this.state;
        let { lackMaterialList } = this.props;
        let dataSource = lackMaterialList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        const finishedProduct = selectedFittingRows.length > 0 ? selectedFittingRows : [{}];
        let i = 1;
        finishedProduct.forEach(function(item){
            item.serial = i++;
        });
        const subProdList = dataSource.length > 0 ?  dataSource : [{}];

        const commonColumn = [
            {title: intl.get("purchase.lackMaterial.index.serial"), dataIndex: 'serial', key: 'serial', width: constants.TABLE_COL_WIDTH.SERIAL},
            {title: intl.get("purchase.lackMaterial.index.displayCode"), dataIndex: 'displayCode'},
            {
                title: intl.get("purchase.lackMaterial.index.prodName"), dataIndex: 'prodName',
                render: (prodName) => (
                    <React.Fragment>
                        <span>{prodName}</span>
                    </React.Fragment>
                ),
            },
            {title: intl.get("purchase.lackMaterial.index.description"), dataIndex: 'description'},
            {title: intl.get("purchase.lackMaterial.index.brand"), dataIndex: 'brand'},
            {title: intl.get("purchase.lackMaterial.index.produceModel"), dataIndex: 'produceModel'},
            {title: intl.get("purchase.lackMaterial.index.unit"), dataIndex: 'unit', width: constants.TABLE_COL_WIDTH.UNIT}
        ];

        let columns1 =  commonColumn.concat([
            {
                title: <span><span className={'required'}>*</span>{intl.get("purchase.lackMaterial.index.groupAmounts")}</span>,
                dataIndex: 'num',
                editable:true,
            },
            {
                title: '', dataIndex: 'choose', width: 100,
                render: () => (
                    <React.Fragment>
                        <p onClick={() => this.selectGoods('finishProductPopVisible')} className={cx("choose-trigger")} style={{float: 'right',cursor: 'pointer',fontSize: '12px'}}>选择成品</p>
                    </React.Fragment>
                ),
            },
        ]);

        columns1 = columns1.map((col) => {
            if (!col.editable) {
                if (!col.render) {
                    col.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        let columns2 =  commonColumn.concat([
            {title: "库存数量", dataIndex: 'currentQuantity'},
            {title: intl.get("purchase.lackMaterial.index.needQuantity"), dataIndex: 'needQuantity'},
            {
                title: intl.get("purchase.lackMaterial.index.componentQuantity"), dataIndex: 'componentQuantity',
                render: (text) => (
                    <React.Fragment>
                        <span className={text > 0 ? 'txt-clip red': 'txt-clip '} title={fixedDecimal(text,quantityDecimalNum)}>{fixedDecimal(text,quantityDecimalNum)}</span>
                    </React.Fragment>
                ),
            },
        ]);

        columns2 = columns2.map((col) => {
            if (!col.render) {
                col.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
            }
            return col;
        });

        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/purchase/',
                            title: intl.get("purchase.lackMaterial.index.purchase")
                        },
                        {
                            title: intl.get("purchase.lackMaterial.index.lackMaterialQuery")
                        }
                    ]}/>
                </div>

                <div className="content-index-bd">
                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <Form >
                                <div className={cx('warehouse')}>
                                    <span className={cx('wh-title')}>{intl.get("purchase.lackMaterial.index.selectWarehouse")}</span>
                                    <SelectDeliveryAddress placeholder={intl.get("purchase.lackMaterial.index.allWarehouse")} isWareHouses={true} onChange={(value) => this.setState({warehouseName: value})}/>
                                </div>

                                <HeaderWrap title={intl.get("purchase.lackMaterial.index.selectFinishProduct")}
                                            titleDetail={intl.get("purchase.lackMaterial.index.selectFinishProductMessage")}
                                            btnTitle={intl.get("purchase.lackMaterial.index.query")}
                                            btnIcon="search"
                                            onChange={this.chooseFinishProd}
                                />
                                <Table dataSource={finishedProduct} className={cx("tb-finished-prod")} columns={columns1}
                                       pagination={false} components={components}
                                />


                                <div className={cx('lm-header-wrap')}>
                                    <div className={cx('lm-title')}>配件</div>
                                    <Button type="primary" icon={<LegacyIcon type={'shopping-cart'} />} className={cx('lm-btn')} style={{"right": "100px"}} onClick={() => this.addProdToRequisition()}>请购</Button>
                                    <Button type="primary" icon={<LegacyIcon type={'shopping-cart'} />} className={cx('lm-btn')} onClick={() => this.addProdToPurchase()}>采购</Button>
                                </div>

                                <Table dataSource={subProdList} className={cx("tb-finished-prod")} columns={columns2}
                                rowSelection={rowSelection} pagination={false}  loading={lackMaterialList.get('isFetching')}
                                />
                            </Form>
                        </div>
                    </div>
                </div>

                <Modal
                    visible={this.state.finishProductPopVisible}
                    visibleFlag={'finishProductPopVisible'}
                    title={intl.get("purchase.lackMaterial.index.lackMaterialQuery")}
                    width={''}
                    destroyOnClose={true}
                    onOk={this.onOk}
                    onCancel={() => this.closeModal('finishProductPopVisible')}
                    className={cx("goods-pop") + " list-pop"}
                >
                    <FittingTab
                        selectedFittingRowKeys={this.state.selectedFittingRowKeys}
                        selectedFittingRows={this.state.selectedFittingRows}
                        onSelectFittingRowChange={this.onSelectFittingRowChange}
                    />
                </Modal>
            </React.Fragment>


        )
    }
}

const mapStateToProps = (state) => ({
    fittingList: state.getIn(['fittingIndex', 'fittingList']),
    lackMaterialList: state.getIn(['purchaseLackMaterial', 'lackMaterialList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchLackMaterialList,
        setFittingList:fittingActions.setFittingList,
        // setCurrentFittingInfo:fittingActions.setCurrentFittingInfo,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Index))
