import React, {Component} from 'react';
import {Table,Modal,Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {asyncFetchBatchShelfList} from "../actions";
import {withRouter} from "react-router-dom";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

class SelectBatchShelf extends Component{
    constructor(props) {
        super(props);
        this.state={
            selectedRowKeys: [],
            selectedRows: [],
            dataSource: [],
            currentQuantityFlag: '1'
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.productCode !== this.props.productCode||
            prevProps.warehouseName !== this.props.warehouseName){
            this.asyncFetchBatchShelfList();
        }
    }

    asyncFetchBatchShelfList = () => {
        let {productCode, warehouseName} = this.props;
        let {currentQuantityFlag}= this.state;
        this.props.asyncFetchBatchShelfList({productCode, warehouseName, currentQuantityFlag}, (res)=> {
            if(res.data && res.data.retCode==="0"){
                let dataSource = res.data.data;
                dataSource = dataSource.map((item, idx)=> {
                    return {key: idx, ...item}
                });
                this.setState({dataSource});
            }
        })
    };

    onSelectChange = (selectedRowKeys, selectedRows)=>{
        this.setState({selectedRowKeys, selectedRows});
    };

    initRows = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        });
    };

    onCancel = () =>{
        this.props.onCancel();
        this.initRows();
    };

    onOk = (selectedRows) => {
        this.props.onOk(selectedRows);
        this.initRows();
    };

    selectOption = ()=>{
        return <div style={{paddingBottom: "10px"}}>
                    <span>库存数量: </span>
                    <Select onChange={this.optionChange} value={this.state.currentQuantityFlag} style={{width: "160px"}}>
                        <Select.Option value={"1"}>＞0</Select.Option>
                        <Select.Option value={"2"}>≤0</Select.Option>
                        <Select.Option value={""}>全部</Select.Option>
                    </Select>
                </div>
    }

    optionChange = (e)=>{
        this.setState({
            currentQuantityFlag:e
        },()=>{
            this.asyncFetchBatchShelfList();
        })

    }

    render() {
        const {selectedRowKeys, selectedRows, dataSource} = this.state;
        const rowSelection = {
            type: 'check',
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let columns = [
            {
                dataIndex: 'key',
                key: 'key',
                title: "序号",
                width: 50,
                render: (text) => <span>{text + 1}</span>
            },
            {
                dataIndex: "batchNo",
                key: "batchNo",
                title: "批次号"
            },
            {
                dataIndex: "productionDate",
                key: "productionDate",
                title: "生产日期",
                render: (text) => {
                    return moment(new Date(text)).format('YYYY-MM-DD')
                }
            },
            {
                dataIndex: "expirationDate",
                key: "expirationDate",
                title: "到期日期",
                render: (text) => {
                    return moment(new Date(text)).format('YYYY-MM-DD')
                }
            },
            {
                dataIndex: "currentQuantity",
                key: "currentQuantity",
                title: "库存数量"
            }
        ];

        return (
            <Modal
                title={'请选择批次号1'}
                visible={this.props.visible}
                onOk={()=>{this.onOk(selectedRows)}}
                onCancel={this.onCancel}
                destroyOnClose={true}
                width={800}
                okText="确定"
                cancelText="取消"
            >
                {this.selectOption()}
                <Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} scroll={{ y: 280 }}  pagination={false}/>
            </Modal>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchBatchShelfList
    }, dispatch)
};


export default withRouter(
    connect(null,mapDispatchToProps)(SelectBatchShelf)
)
