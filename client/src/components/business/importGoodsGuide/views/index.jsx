import React, {Component} from 'react'
import intl from 'react-intl-universal';
import {message, Progress} from "antd";
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {asyncFetchAutoImport, autoImportPromise} from "../actions";
import {connect} from "react-redux";
import ImportGoodsPop from 'components/business/importGoodsPop';
import {actions as commonRequestActions} from 'components/business/commonRequest';

const cx = classNames.bind(styles);


class ImportGoodsGuide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guideVisible: false,
            importGoodsPopVisible: false
        };
        this.autoImportSuccessGoodsNum = 0;
        this.firstAutoImport = true;
    }

    openModal = (visibleType) => {
        this.setState({
            [visibleType]: true
        })
    };

    closeModal = (visibleType) => {
        this.setState({
            [visibleType]: false
        })
    };

    closeGuide = () => {
        this.closeModal('guideVisible');
        this.props.getGuideVisible(false);
        const storage = window.localStorage;
        storage.setItem("isNotFirst", '1');
    };

    openGuide = () => {
        this.openModal('guideVisible');
        this.props.getGuideVisible(true)
    };

    openImportGoodsPop = ()=>{
        this.closeGuide();
        this.openModal('importGoodsPopVisible')
    };

    componentDidMount() {
        //点击拒绝后，标记一下存到本地
        const storage = window.localStorage;
        const isNotFirst = storage.getItem("isNotFirst");

        //发送自动导入请求
        this.props.asyncFetchAutoImport();

        //获取权限的请求和自动导入的请求都完成了，才能去判断是否出引导弹层
        Promise.all([commonRequestActions.comInfoPromise, autoImportPromise]).then(res => {
            if(this.firstAutoImport){
                //判断时候有进销存物品的新增权限
                const accountInfo = res[0];
                let authGoodsAdd = false;
                if (accountInfo.comName && !accountInfo.mainUserFlag) {
                    const authMap = accountInfo.authMap;
                    authGoodsAdd = authMap['goods']['add']
                }
                else if(accountInfo.mainUserFlag){
                    authGoodsAdd = true;
                }

                //内贸站有上架的物品&&有进销存物品新增权限&&第一次进入页面
                if (res[1].data > 0 && authGoodsAdd && isNotFirst !== '1') {
                    this.autoImportSuccessGoodsNum = res[1].data;
                    this.openGuide()
                }
            }

        }).catch(err => {
            console.log(err);
        });

        //间隔5分钟发一次自动导入的请求
        setInterval(()=>{
            this.firstAutoImport = false;
            this.props.asyncFetchAutoImport()
        }, 300000)
    }

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
                                        <span className={cx("progress-info")}>{intl.get("components.importGoodsGuide.index.hasImport")}<em>{percent}%</em></span>
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
                <div className={cx("guide")} style={this.state.guideVisible ? {display: "block"} : {display: "none"}}>
                    <div className={cx("guide-mask")}/>
                    <div className={cx("guide-transparent")}/>
                    <div className={cx("guide-wrap")}>
                        <p>{
                            this.autoImportSuccessGoodsNum > 0 ? (
                                <React.Fragment>
                                    {intl.get("components.importGoodsGuide.index.msg1")}<span className="green">{this.autoImportSuccessGoodsNum}</span>{intl.get("components.importGoodsGuide.index.msg2")}
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {intl.get("components.importGoodsGuide.index.msg3")}
                                </React.Fragment>
                            )
                        }</p>
                        <div className={cx("btn-wrap")}>
                            <a href="#!" className={cx("btn-refuse")} onClick={this.closeGuide}>{intl.get("components.importGoodsGuide.index.brutalReject")}</a>
                            <a href="#!" className={cx("btn-import")}
                               onClick={this.openImportGoodsPop}>{intl.get("components.importGoodsGuide.index.immediateImport")}</a>
                        </div>
                    </div>
                </div>
                <ImportGoodsPop
                    visible={this.state.importGoodsPopVisible}
                    onClose={() => this.closeModal('importGoodsPopVisible')}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    autoImport: state.getIn(['importGoodsGuide', 'autoImport']),
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
    importCnGoods: state.getIn(['importGoodsPop', 'importCnGoods'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchAutoImport
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(ImportGoodsGuide)
