import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Crumb from 'components/business/crumb';
import {message, Modal, Table, Layout} from 'antd';

import {AttributeBlock} from 'components/business/attributeBlock';
import OpeBar from 'components/business/opeBar';
import classNames from "classnames/bind";
import styles from '../styles/index.scss';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {asyncFetchInquiryDetail, asyncDeleteInquiryInfo} from '../../index/actions';
import QuoteListPop from "../../index/views/quoteList";

const cx = classNames.bind(styles);
const confirm = Modal.confirm;

class InquiryDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewQuoteVisible: false,
            showComparedVisible: false
        }
    }

    componentDidMount() {
        const {match} = this.props;
        const id = match.params.id;
        if (id) {
            // this.props.asyncFetchAbizCate();
            this.props.asyncFetchInquiryDetail(id, (data) => {
                let errorMsg = data.retCode != 0 && data.retMsg;
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("inquiry.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            })
        }
    }

    operateBar = () => {
        return <OpeBar data={{
            listData: [
                {
                    name: 'viewQuote',
                    onClick: this.showViewQuoteModal
                },
                {
                    name: 'delete',
                    module: 'inquiry',
                    onClick: this.deleteConfirm
                }
            ]
        }}/>;
    };

    showViewQuoteModal = () => {
        this.setState({
            viewQuoteVisible: true,
        });
    };

    hideViewQuoteModal = () => {
        this.setState({
            viewQuoteVisible: false,
        });
    };

    onSelectRowChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    };

    showComparedModal = () => {
        this.setState({
            showComparedVisible: true,
        });
    };

    hideComparedModal = () => {
        this.setState({
            showComparedVisible: false,
        });
    };

    deleteConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;

        let self = this;
        Modal.confirm({
            title: intl.get("inquiry.show.index.warningTip"),
            okText: intl.get("inquiry.show.index.okText"),
            cancelText: intl.get("inquiry.show.index.cancelText"),
            content: intl.get("inquiry.show.index.deleteConfirmContent"),
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteInquiryInfo([id], function (res) {
                        resolve();
                        if (res.retCode == 0) {
                            message.success(intl.get("inquiry.show.index.deleteSuccessMessage"));
                            self.props.history.push('/inquiry/')
                        } else {
                            message.error(res.retMsg);
                        }
                    });
                }).catch(() => {
                    //alert("操作失败")
                })
            },
            onCancel() {
            },
        });
    };

    inquiryTopAttrInfo = () => {
        let {inquiryDetail} = this.props;
        inquiryDetail = inquiryDetail.get('data');
        if (!inquiryDetail) {
            return null;
        }

        const data = [{
            name: intl.get("inquiry.show.index.infoTitle"),
            value: inquiryDetail && inquiryDetail.infoTitle
        }, {
            name: intl.get("inquiry.show.index.addedTime"),
            value: inquiryDetail && inquiryDetail.addedTime && moment(inquiryDetail.addedTime).format('YYYY-MM-DD')
        }, {
            name: intl.get("inquiry.show.index.effectiveTime"),
            value: inquiryDetail && inquiryDetail.effectiveTime && moment(inquiryDetail.effectiveTime).format('YYYY-MM-DD')
        }];

        return <div className={"detail-main-attr cf"}><AttributeBlock data={data}/></div>
    };

    inquiryProductList = () => {
        const inquiryDetail = this.props.inquiryDetail.get('data');
        if (!inquiryDetail) {
            return null;
        }

        let productList = inquiryDetail.products;
        if (!productList) {
            return null;
        }

        const columns = [{
            title: intl.get("inquiry.show.index.serial"),
            key: 'serial',
            dataIndex: 'serial',
            className: 'g-id'
        }, {
            title: intl.get("inquiry.show.index.prodName"),
            key: 'prodName',
            dataIndex: 'prodName',
            className: 'g-tit'
        }, {
            title: intl.get("inquiry.show.index.itemSpec"),
            key: 'itemSpec',
            dataIndex: 'itemSpec',
            className: 'g-desc',
        }, {
            title: intl.get("inquiry.show.index.purchaseUnitText"),
            key: 'purchaseUnitText',
            align: 'center',
            dataIndex: 'purchaseUnitText',
            className: 'g-unit'
        }, {
            title: intl.get("inquiry.show.index.cateName"),
            key: 'cateName',
            dataIndex: 'cateName',
            className: 'g-custom'
        }, {
            title: intl.get("inquiry.show.index.purchaseQuantity"),
            align: 'right',
            key: 'purchaseQuantity',
            dataIndex: 'purchaseQuantity',
            className: 'g-quantity'
        }];

        return <div className="detail-table-wrap"><Table bordered columns={columns} dataSource={productList} scroll={{x: 'auto'}}/></div>
    };

    supplierList = () => {
        const inquiryDetail = this.props.inquiryDetail.get('data');
        if (!inquiryDetail || inquiryDetail.inviteFlag == 0) {
            return null;
        }

        const columns = [{
            title: intl.get("inquiry.show.index.name"),
            key: 'name',
            dataIndex: 'name',
        }, {
            title: intl.get("inquiry.show.index.email"),
            key: 'email',
            dataIndex: 'email',
        }];

        const supplierList = (inquiryDetail.suppliersNameList.split(',') || []);
        const emailList = (inquiryDetail.suppliersEmailList.split(',') || []);

        const data = supplierList.map((value, index) => {
            return {
                name: value,
                email: emailList[index]
            }
        });

        return (
            <div>
                <div style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    fontSize: '14px',
                    color: '#666',
                    marginRight: '10px'
                }}>
                    {intl.get("inquiry.show.index.appointSupplier")}：
                </div>
                <Table style={{display: 'inline-block', width: '500px'}} columns={columns} dataSource={data} bordered
                       pagination={false}/>
            </div>
        )
    };

    inquiryFootAttrInfo = () => {
        const inquiryDetail = this.props.inquiryDetail.get('data');
        if (!inquiryDetail) {
            return null;
        }

        let contactInfoPublicMode;
        switch (inquiryDetail.contactInfoFlag) {
            case '0':
                contactInfoPublicMode = intl.get("inquiry.show.index.contactInfoFlag_1");
                break;
            case '1':
                contactInfoPublicMode = intl.get("inquiry.show.index.contactInfoFlag_2");
                break;
            case '2':
                contactInfoPublicMode = intl.get("inquiry.show.index.contactInfoFlag_3");
                break;
        }

        return (
            <div className="detail-sub-attr">
                <AttributeBlock data={[
                    {
                        name: intl.get("inquiry.show.index.deliveryAddressName"),
                        value: inquiryDetail.deliveryAddressName
                    },
                    {
                        name: intl.get("inquiry.show.index.description"),
                        value: inquiryDetail.description
                    }
                ]}/>
                <div>
                    <div style={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: '14px',
                        color: '#666',
                        marginRight: '10px',
                        lineHeight: '30px'
                    }}>{intl.get("inquiry.show.index.tempt")}：
                    </div>
                    <div style={{display: 'inline-block', lineHeight: '30px'}}>
                        {
                            inquiryDetail.attachments.map((attachInfo) => {
                                return (
                                    <div key={attachInfo.id}>
                                        <a style={{color: '#499fff'}} target='_blank'
                                           href={`http://www.abiz.com/inquiries/attachs/${inquiryDetail.inquiryIdEnc}/${attachInfo.attachmentIdEnc}`}>
                                            {attachInfo.name}
                                        </a>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <AttributeBlock data={[
                    {
                        name: intl.get("inquiry.show.index.inquiryWay"),
                        value: inquiryDetail.inviteFlag == 0 ? intl.get("inquiry.show.index.inquiryWayStatus_1") : (inquiryDetail.publicInquiryFlag == 0 ? intl.get("inquiry.show.index.inquiryWayStatus_2") : intl.get("inquiry.show.index.inquiryWayStatus_3"))
                    },
                    {
                        name: intl.get("inquiry.show.index.openingContactInfo"),
                        value: contactInfoPublicMode
                    }
                ]}/>
                {this.supplierList()}
                <AttributeBlock
                    data={[{
                        name: intl.get("inquiry.show.index.comName"),
                        value: inquiryDetail.comName
                    }, {
                        name: intl.get("inquiry.show.index.username"),
                        value: inquiryDetail.username
                    }, {
                        name: intl.get("inquiry.show.index.comTel"),
                        value: inquiryDetail.comTel
                    }]}
                />
            </div>
        )
    };

    render() {
        const {match} = this.props;
        const id = match.params.id;
        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {title: intl.get("inquiry.show.index.inquiry")},
                        {url: '/inquiry', title: intl.get("inquiry.show.index.inquiryList")},
                        {title: intl.get("inquiry.show.index.detail")}
                    ]}
                    />
                </div>
                <div className="detail-content">
                    {this.operateBar()}
                    <div className="detail-content-bd">
                        {this.inquiryTopAttrInfo()}
                        {this.inquiryProductList()}
                        {this.inquiryFootAttrInfo()}
                    </div>
                </div>

                <Modal
                    title={intl.get("inquiry.show.index.receivedOrder")}
                    visible={this.state.viewQuoteVisible}
                    footer={null}
                    onCancel={this.hideViewQuoteModal}
                    width={800}
                    destroyOnClose={true}
                >
                    <QuoteListPop inquiryId={id}/>
                </Modal>

            </Layout>

        );
    }
}

const mapStateToProps = (state) => ({
    inquiryDetail: state.getIn(['inquiryIndex', 'inquiryInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInquiryDetail,
        asyncDeleteInquiryInfo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(InquiryDetail)