import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {DatePicker, message, Tooltip, Form, Table, Select} from "antd";
import {formatCurrency, removeCurrency} from 'utils/format';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
import { Resizable } from 'react-resizable';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

const { Option } = Select;

class ProdList extends Component {


    bomSelectChange = (id,value)=>{
        let dataAry = (value+'').split('&*');
        this.props.getBomChilren({id:id,code:dataAry[0],dayProductivity:dataAry[1] && dataAry[1]})
    }

    timeChange = (id,value) =>{
        this.props.dispatchUpDateTime({
            id:id,
            requiredDate:value
        })
    }

    render() {
        const {getFieldValue} = this.props.formRef && this.props.formRef.current;
        let {prodList} = this.props;
        let dataSource = prodList && prodList.toJS() || [];
        dataSource.forEach((item,index)=>{
            item.serial = index+1;
            item.key= index+1;
        });
        console.log(dataSource,'dataSource');

        const columns = [
            {
              title: "序号",
              key: 'serial',
              width: 50,
              dataIndex: 'serial',
            },
            {
                title: "销售单号",
                key: 'saleCustomNo',
                width: 160,
                dataIndex: 'saleCustomNo',
            },
            {
                title: "销售日期",
                key: 'saleDate',
                width: 160,
                dataIndex: 'saleDate',
                render: (saleDate, record) => {
                    return (
                        <span className="txt-clip" title={saleDate}>
                                {saleDate && moment(saleDate).format('YYYY-MM-DD')}
                        </span>
                    )
                }
            },
            {
                title: "物品编号",
                key: 'prodCustomNo',
                width: 160,
                dataIndex: 'prodCustomNo',
            },
            {
                title: "物品名称",
                key: 'prodName',
                width: 160,
                dataIndex: 'prodName',
            },
            {
                title: "上级物品编号",
                key: 'prodCustomMain',
                width: 160,
                dataIndex: 'prodCustomMain',
            },
            {
                title: "上级物品名称",
                key: 'prodNameMain',
                width: 160,
                dataIndex: 'prodNameMain',
            },
            {
                title: "BOM编号",
                key: 'bomList',
                dataIndex: 'bomList',
                width: 160,
                render:(bomList,items) =>(
                    <Select value={items.combineBomCode} onChange={(value)=>this.bomSelectChange(items.id,value)}>
                        {
                            bomList.map((item,index)=>{
                                return <Option key={index} value={item.bomCode+"&*"+(item.dayProductivity||"")}>{item.bomCode}</Option>
                            })
                        }
                    </Select>
                )
            },
            {
                title: "需求日期",
                key: 'requiredDate',
                dataIndex: 'requiredDate',
                width: 200,
                render:(requiredDate,items) =>{
                    if(items.id.split('-').length === 1){
                        return <div>
                                   <span style={{color:"red",marginRight: "5px"}}>*</span>
                                   <DatePicker value={moment.isMoment(requiredDate)?requiredDate: (requiredDate ? moment(requiredDate) : null)} onChange={(value)=>this.timeChange(items.id,value)}/>
                                </div>


                    }
                }
            },
            {
                title: "库存量",
                key: 'stockNum',
                width: 120,
                dataIndex: 'stockNum',
            },
            {
                title: "可用库存",
                key: 'usableNum',
                width: 120,
                dataIndex: 'usableNum',
            },
            {
                title: "毛需求",
                key: 'grossQuantity',
                width: 120,
                dataIndex: 'grossQuantity',
            },
            {
                title: "净需求",
                key: 'netQuantity',
                width: 120,
                dataIndex: 'netQuantity'
            },
            {
                title: "建议量",
                key: 'suggestQuantity',
                width: 120,
                dataIndex: 'suggestQuantity',
            }
        ];

        return (
            <React.Fragment>
                <div style={{
                    borderRight: "1px solid #d2d2d2"
                }}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        scroll={{
                            x:true
                        }}
                    />
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    goodsInfo: state.getIn(['goods', 'goodsInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdList)