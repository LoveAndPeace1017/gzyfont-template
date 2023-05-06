import React, { Component } from 'react';
import Crumb from 'components/business/crumb';
import {AttributeBlock} from 'components/business/attributeBlock';
import OpeBar from 'components/business/opeBar';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Table,Modal} from "antd";
import {getLoadData} from '../actions';

import styles from "../style/index.scss";
import classNames from "classnames/bind";


const cx = classNames.bind(styles);


const columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
}, {
    title: '物品编号',
    dataIndex: 'number',
    key: 'number',
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '规格型号',
    dataIndex: 'spec',
    key: 'spec',
}, {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
}, {
    title: '金额',
    dataIndex: 'money',
    key: 'money',
}, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
}, {
    title: '已入库数量',
    dataIndex: 'hasPut',
    key: 'hasPut',
}, {
    title: '未入库数量',
    dataIndex: 'noPut',
    key: 'noPut',
}];


class OnlineListDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.match.params.id,
            viewQuoteVisible: false,
            showComparedVisible: false,
            preview:false,
        };
    }

    operateBar = () => {
        return <OpeBar data={{
            listData: [
                {
                    name: 'viewQuote',
                    onClick: () => {
                        this.showViewQuoteModal();
                    }
                },
                {
                    name: 'delete',
                    module: 'purchase',
                    onClick: () => {
                        this.showConfirm();
                    }
                }
            ],
            moreData: [
                {
                    name: 'orderRecord',
                },
                {
                    name: 'saleRecord',
                },
                {
                    name: 'store',
                }
            ]
        }}/>;
    };

    showViewQuoteModal = () => {
        this.setState({
            viewQuoteVisible: true,
        });
    }


    onSelectRowChange = (selectedRowKeys,selectedRows)=>{
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    };


    showConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;

        let self = this;
        Modal.confirm({
            title: '提示信息',
            okText: '确定',
            cancelText: '取消',
            content: '确定要删除吗？',
            onOk() {
                return new Promise((resolve, reject) => {
                    axios.post(`${BASE_URL}/inquiry/show/:id/delete`, [id])
                        .then(function (res) {
                            resolve();

                            if (res.data.retCode === 0) {
                                Modal.success({
                                    title: '提示信息',
                                    content: '删除物品成功！'
                                });
                                self.props.history.replace('/inquiry/show/:id/')
                            } else {
                                Modal.error({
                                    title: '提示信息',
                                    content: res.data.retMsg
                                });

                            }

                        }).catch(() => reject());
                }).catch(() => {
                    //alert("操作失败")
                })

            },
            onCancel() {
            },
        });
    };

    onlineListTopAttrInfo = () => {
        const data = [{
            name: "采购单号",
            value: "RK-20190110-0005"
        }, {
            name: "采购日期",
            value: "2019-01-22"
        }, {
            name: "供应商",
            value: "水果供应商"
        }];
        return <AttributeBlock data={data}/>
    };

    onlineListFootAttrInfo = () => {
        const data = [{
            name: "交付时间",
            value: "2018-9-12"
        }, {
            name: "交付地址",
            value: "广西壮族自治区防城港市"
        }];
        return <AttributeBlock data={data}/>
    };

    onlineListBottomAttrInfo = () => {
        const classNames = 'footnote';
        const data = [{
            name: "制单人",
            value: "r&b"
        }, {
            name: "制单时间",
            value: "2019-01-13 23:50"
        }, {
            name: "最后修改人",
            value: "b&a"
        }, {
            name: "最后修改时间",
            value: "2019-01-13 23:50"
        }];
        return <AttributeBlock data={data} classNames={classNames}/>
    };

    componentDidMount(){
        this.props.getLoadData(this.state.id);
    };

    render() {

        return (
            <div>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: '询价'
                        },
                        {
                            url: '/inquiry/index',
                            title: '询价单列表'
                        },
                        {
                            url: '/inquiry/show',
                            title: '详情页'
                        }

                    ]}/>
                </div>
                <div className={cx("panel")}>
                    <div>
                        {this.operateBar()}
                    </div>
                    {this.onlineListTopAttrInfo()}
                       <Table dataSource={this.props.dataSource.get('dataSource').toJS()} columns={columns} />
                    {this.onlineListFootAttrInfo()}
                    <div className={cx("panel-bottom")}>
                        {this.onlineListBottomAttrInfo()}
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    dataSource: state.get('onlineOrderListDetails')
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getLoadData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OnlineListDetail)


