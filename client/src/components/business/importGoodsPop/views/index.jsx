import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, Tabs, message, Button, Progress
} from 'antd';
import Icon from 'components/widgets/icon';

const TabPane = Tabs.TabPane;


import styles from "../styles/index.scss";
import classNames from "classnames/bind";

import GoodsTab from "../dependencies/goodsTab";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {asyncImportCnGoods, emptyImportCnGoods, importCnGoodsPercent} from '../actions'
import {actions as goodsIndexActions} from 'pages/goods/index'
import {AddButton} from "components/business/authMenu";

const cx = classNames.bind(styles);

//可选择的物品条数最大值
const GOODS_MAX_NUMBER = 1000;

class ImportGoodsPop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            params: {},
            selectedRows: [],
            selectedRowKeys: [],
            importModalVisible:false
        };
        this.myReq = null
    }

    onSelectRowChange = (selectedRowKeys, selectedRows) => {
        console.log('goodspop onSelectRowChange:', selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    };

    percentStep = () => {
        let percent = this.props.importCnGoods.get('percent') + 10;
        if (percent >= 100) {
            percent = 99;
        }
        if (percent <= 99) {
            this.props.importCnGoodsPercent(percent);
            this.myReq = window.requestAnimationFrame(this.percentStep)
        }
        if (percent === 99) {
            window.cancelAnimationFrame(this.myReq)
        }
    };

    onOk = () => {
        let prodIds = this.state.selectedRowKeys;
        if (prodIds.length === 0) {
            Modal.error({
                title: intl.get("components.importGoodsPop.index.warningTip"),
                content: intl.get("components.importGoodsPop.index.msg1")
            })
        }else if(prodIds.length > GOODS_MAX_NUMBER){
            Modal.error({
                title: intl.get("components.importGoodsPop.index.warningTip"),
                content: `${intl.get("components.importGoodsPop.index.msg2")} ${GOODS_MAX_NUMBER} ${intl.get("components.importGoodsPop.index.msg3")}`
            })
        }
        else {
            console.log('prodIds:' + prodIds);
            this.props.asyncImportCnGoods(prodIds, (res) => {
                if (res.retCode === '0') {
                    this.props.asyncFetchGoodsList({init: true});
                    message.success(`${intl.get("components.importGoodsPop.index.msg4")} ${res.data} ${intl.get("components.importGoodsPop.index.msg5")}`).then(() => {
                        this.props.emptyImportCnGoods()
                    });
                }else{
                    alert(res.retMsg)
                }
            });
            let timer = setInterval(() => {
                let percent = this.props.importCnGoods.get('percent') + 20;
                if (percent >= 99) {
                    percent = 99;
                    clearInterval(timer);
                }
                this.props.importCnGoodsPercent(percent)
            }, 100);
            // this.myReq = window.requestAnimationFrame(this.percentStep);
            this.closeModal();
        }
    };
    openModal = ()=>{
        this.setState({
            importModalVisible:true
        });
    };
    closeModal = ()=>{
        this.setState({
            importModalVisible:false
        });
    };

    render() {
        const {importCnGoods} = this.props;
        let importProgressStr = null;
        if (importCnGoods.get('isFetching') || importCnGoods.getIn(['data', 'data'])) {
            let percent = importCnGoods.get('percent');
            if(importCnGoods.getIn(['data', 'data'])){ //如果后端返回导入成功，则进度条直接到100
                percent = 100;
            }
            importProgressStr = (
                <div className="ant-message">
                    <span>
                        <div className="ant-message-notice">
                            <div className="ant-message-notice-content">
                                <div className="ant-message-custom-content">
                                    <div className={cx("progress-wrap")}>
                                        <Progress
                                            percent={percent}
                                            status="active"
                                            showInfo={false}
                                        />
                                        <span className={cx("progress-info")}>{intl.get("components.importGoodsPop.index.hasImport")}<em>{percent}%</em></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </span>
                </div>
            )
        }
        return (
            <React.Fragment>
                {importProgressStr}
            <AddButton
                module="goods"
                ga-data={this.props.gadata}
              /*  icon="icon-import"*/
                clickHandler={()=>this.openModal()}
                label={intl.get("components.importGoodsPop.index.tradeImport")}/>
            <Modal
                title={intl.get("components.importGoodsPop.index.modalTitle")}
                onOk={this.onOk}
                visible={this.state.importModalVisible}
                onCancel={this.closeModal}
                destroyOnClose={true}
                className={cx("goods-pop")+" list-pop"}
                width={''}
            >
                <GoodsTab {...this.props}
                          onSelectRowChange={this.onSelectRowChange}
                />
            </Modal>
            </React.Fragment>
        )
    }
};

const mapStateToProps = (state) => ({
    importCnGoods: state.getIn(['importGoodsPop', 'importCnGoods'])
});
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncImportCnGoods,
        emptyImportCnGoods,
        importCnGoodsPercent,
        asyncFetchGoodsList: goodsIndexActions.asyncFetchGoodsList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportGoodsPop)