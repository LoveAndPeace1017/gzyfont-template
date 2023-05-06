import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {
    Table,
    Button,
    message
} from 'antd';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {PictureOutlined} from '@ant-design/icons';
import recommendImg001 from '../image/recommend-001.png';
import recommendImg002 from '../image/recommend-002.png';
import recommendImg003 from '../image/recommend-003.png';
import recommendImg004 from '../image/recommend-004.png';
import recommendImg005 from '../image/recommend-005.png';
import recommendImg006 from '../image/recommend-006.png';
import recommendImg007 from '../image/recommend-007.png';
import recommendImg008 from '../image/recommend-008.png';
import recommendImg009 from '../image/recommend-009.png';
import recommendImg010 from '../image/recommend-010.png';
const cx = classNames.bind(styles);

export class Record extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[],
            selectedRowKeys: [],
            setId: ''
        }
    }

    componentDidMount() {

    }

    onSelectChange = (selectedRowKeys)=>{
        this.setState({selectedRowKeys});
    }

    runToAdd = () =>{
        if(this.state.selectedRowKeys.length === 0){
            message.error('请选择一个模板');
        }else{
            //单选，返回的是length为1的数组
            let recommendId = this.state.selectedRowKeys[0];
            this.props.history.push(`/template/recommend/${recommendId}`);
        }
    }


    render() {
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let columns = [{
            title: "序号",
            width: 50,
            dataIndex: 'serial'
        },{
            title: "模板名称",
            width: 400,
            dataIndex: 'name',
            render: (name,data) => {
                return <div className={cx("pic-dom")}>
                    <div className={cx("pic-out")}>
                        <PictureOutlined className={cx("pic-name")}/>{name}
                        <div className={cx("pic-inner")}>
                            <img width={600} height={400} src={data.imgSrc} alt="tp"/>
                        </div>
                    </div>
                </div>
            }
        },{
            title: "单据类型",
            width: 100,
            dataIndex: 'type'
        },{
            title: "纸张尺寸",
            width: 100,
            dataIndex: 'size'
        }];
        let recordDataSource = [{
            serial: 1,
            name: '采购入库单',
            type: '采购入库',
            size: '三联二等分',
            key: 'recommend-002',
            imgSrc: recommendImg002
        },{
            serial: 2,
            name: '生产单',
            type: '生产单',
            size: 'A4横向',
            key: 'recommend-003',
            imgSrc: recommendImg003
        },{
            serial: 3,
            name: '委外领料单',
            type: '委外领料',
            size: 'A4纵向',
            key: 'recommend-004',
            imgSrc: recommendImg004
        },{
            serial: 4,
            name: '销售出库单（通用）',
            type: '销售出库',
            size: 'A4纵向',
            key: 'recommend-005',
            imgSrc: recommendImg005
        },{
            serial: 5,
            name: '销售出库单（医药）',
            type: '销售出库',
            size: 'A4横向',
            key: 'recommend-006',
            imgSrc: recommendImg006
        },{
            serial: 6,
            name: '销售订单',
            type: '销售订单',
            size: '三联二等分',
            key: 'recommend-007',
            imgSrc: recommendImg007
        },{
            serial: 7,
            name: '采购订单',
            type: '采购订单',
            size: '三联二等分',
            key: 'recommend-008',
            imgSrc: recommendImg008
        },{
            serial: 8,
            name: '采购订单',
            type: '采购订单',
            size: 'A4纵向',
            key: 'recommend-009',
            imgSrc: recommendImg009
        },{
            serial: 9,
            name: '销售订单',
            type: '销售订单',
            size: '滚轴打印',
            key: 'recommend-010',
            imgSrc: recommendImg010
        }];
        return (
            <React.Fragment>
                <Table
                    bordered
                    columns={columns}
                    dataSource={recordDataSource}
                    rowSelection={rowSelection}
                    pagination={false}
                />
                <div className={cx("record-foot")}>
                    <Button className={cx("btn-lst")} onClick={this.runToAdd} type={"primary"}>确定</Button>
                    <Button className={cx("btn-lst")} onClick={this.props.onClose} type={"default"}>取消</Button>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Record);