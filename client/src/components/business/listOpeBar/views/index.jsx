import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Link, withRouter} from 'react-router-dom';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import {
    Menu, Dropdown,Button, Input
} from 'antd';
import {getCookie,setCookie,setDomainCookie} from 'utils/cookie';
import Icon from 'components/widgets/icon';
import ImportButton from 'components/business/importModal';
import ExportButton from 'components/business/exportModal';
import ImportGoodsPop from 'components/business/importGoodsPop';
import SuggestSearch, { SuggestInput } from 'components/business/suggestSearch';
import {AddPkgOpen} from 'components/business/vipOpe';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {AddButton} from "components/business/authMenu";
import {actions as listTableActions} from 'components/business/listTable'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {offset} from 'utils/dom';
import HOT from  '../../../../pages/home/images/hot.png';
const cx = classNames.bind(styles);

class ListOpeBar extends Component {

    static defaultProps = {
        extraContent: null,
        filterToolBarVisible: false
    };

    toggleFold=()=>{
        const tbInner = document.querySelector('.tb-inner');
        this.props.onFilter(()=>{
            this.props.setTbOffsetTop(offset(tbInner).top - 60);
        });
    };

    reset = () => {
        if(this.suggestSearchRef){
            this.suggestSearchRef.setState({value: ""});
        }
        this.props.onSearch && this.props.onSearch("");  // 列表使用
        this.props.onReset && this.props.onReset(); // 报表使用
    };

    constructor(props) {
        super(props);
    }

    render() {

        const {visible, addUrl, addLabel, onFilter, onInvite, importType, miccnImportType, exportType, exportDataSource, exportCondition, beforeExport,
            onSearch, searchPlaceHolder, component, defaultValue, showPrint, onFitting, addClickHandler,multiGoodsType,recommendTemplateHandler,onMobileWork,exportClick} = this.props;
        let {importModule} = this.props;
        //该功能只给内部人员使用，手动添加cookie开启功能
        let getUserFlag = getCookie("multiadd");
        if(!importModule&&importType){
            importModule = {
                type:importType,
                module:importType
            };
        }

        return (
            <div
                className={cx("ope-bar") + " cf list-ope-bar"}
                style={{display: visible ? 'block' : 'none'}}
            >
                <div className={cx("bar-left")}>
                    {
                        onSearch ? (
                            <div className={cx("list-search")}>
                                <SuggestInput
                                    placeholder={searchPlaceHolder ? searchPlaceHolder : ''}
                                    onSearch={onSearch}
                                    defaultValue={defaultValue}
                                    urlPrefix={this.props.searchTipsUrlPrefix ? this.props.searchTipsUrlPrefix : ''}
                                    url={this.props.searchTipsUrl ? this.props.searchTipsUrl : ''}
                                    ga-data={'batch-search'}
                                    getRef={(child) => {
                                        this.suggestSearchRef = child;
                                    }}
                                />
                                {/*<SuggestSearch*/}
                                    {/*placeholder={searchPlaceHolder ? searchPlaceHolder : ''}*/}
                                    {/*onSearch={onSearch}*/}
                                    {/*defaultValue={defaultValue}*/}
                                    {/*urlPrefix={this.props.searchTipsUrlPrefix ? this.props.searchTipsUrlPrefix : ''}*/}
                                    {/*url={this.props.searchTipsUrl ? this.props.searchTipsUrl : ''}*/}
                                    {/*ga-data={'batch-search'}*/}
                                    {/*getRef={(child) => {*/}
                                        {/*this.suggestSearchRef = child;*/}
                                    {/*}}*/}
                                {/*/>*/}
                            </div>
                        ) : null
                    }
                    {
                        onFilter ? (
                            <div className={cx("filter-btn-wrap")}>
                                <Button onClick={this.toggleFold} ga-data={'batch-filter-toggle'}><Icon type={'icon-filter'}/>{this.props.filterToolBarVisible?intl.get("components.listOpeBar.index.close"):intl.get("components.listOpeBar.index.open")}{intl.get("components.listOpeBar.index.filter")}</Button>
                                <span className={cx(["icon-arrow", {"icon-arrow-fold": !this.props.filterToolBarVisible}])}><Icon type="up"/></span>
                                <Button onClick={this.reset}><ReloadOutlined />{intl.get("components.filterToolBar.index.reset")}</Button>
                            </div>
                        ) : null
                    }
                </div>
                <div className={cx("bar-right")}>
                    {
                        component ? (
                            <Button
                                ga-data={component.type + '-list'}
                                type={component.type} onClick={component.callback} icon={<LegacyIcon type={component.iconType} />}>
                                {component.text}</Button>
                        ) : null
                    }
                    {
                        recommendTemplateHandler?(
                            <Button type={"default"} className={cx("recommend-btn")} onClick={recommendTemplateHandler}>推荐模板</Button>
                        ) : null
                    }
                    {
                        onInvite ? (
                            <Button
                                gadata={'batch-invite'}
                                type="default" module={this.props.authModule} icon={<LegacyIcon type={'user-add'} />} option={"add"}
                                onClick={this.props.openInviteModal}
                            >
                                {intl.get("components.listOpeBar.index.inviteRegister")}
                            </Button>
                        ) : null
                    }
                    {
                        onFitting ? (
                            <AddPkgOpen
                                onTryOrOpenCallback={() => {this.props.history.push('/multiBom/list')}}
                                openVipSuccess={() => {this.props.history.push('/multiBom/list')}}
                                source={'fitting'}
                                style={{'display': 'inline-block'}}
                                render={() => (
                                    <Button gadata={'go-fitting'} type="default">
                                        <Icon type={"icon-fitting"} />多级BOM</Button>
                                )}
                            />
                        ) : null
                    }
                    {
                        exportType ? (
                            <ExportButton
                                gadata={'batch-export-all'}
                                dataSource={exportDataSource} type={exportType} condition={exportCondition} beforeExport={beforeExport}/>
                        ) : null
                    }
                    {
                        exportClick?(
                            <Button onClick={exportClick}><Icon type={'icon-export'}/>导出</Button>
                        ):null
                    }
                   {/* {
                        miccnImportType ? (
                            <ImportGoodsPop
                                gadata={'batch-import-miccn'}
                                option={"add"}  {...this.props} />
                        ) : null
                    }*/}
                    {
                        importModule ? (
                            <React.Fragment>
                                <Dropdown overlay={(
                                    <Menu className={cx("export-menu")}>
                                        <Menu.Item style={{textAlign: "center"}}>
                                            <ImportButton adata={'batch-import'} importModule={importModule} option={"add"} {...this.props} />
                                        </Menu.Item>
                                        {
                                            (multiGoodsType)?(
                                            <Menu.Item style={{textAlign: "center"}}>
                                                <ImportButton adata={'batch-import'} multiGoods={"goods"}  importModule={importModule} option={"add"} {...this.props} />
                                            </Menu.Item>): null
                                        }
                                        {
                                            miccnImportType?(
                                                <Menu.Item style={{textAlign: "center"}}>
                                                    <ImportGoodsPop gadata={'batch-import-miccn'} option={"add"}  {...this.props} />
                                                </Menu.Item>
                                            ):null
                                        }
                                    </Menu>
                                )} placement="bottomCenter">
                                    <Button icon={<Icon type={"icon-import"}/>}>
                                        导入
                                    </Button>
                                </Dropdown>
                            </React.Fragment>
                        ) : null
                    }
                    {
                        showPrint && (
                            <Button
                                ga-data={'batch-print'}
                                type='default' icon={<PrinterOutlined />} onClick={() => {
                                let bdHtml = window.document.body.innerHTML;
                                let printHtml = document.getElementById('printArea').innerHTML;
                                window.document.body.innerHTML = printHtml;
                                window.print();
                                window.document.body.innerHTML = bdHtml;
                                location.reload();
                            }}>
                                {intl.get("components.listOpeBar.index.print")}
                            </Button>
                        )
                    }
                    {
                        onMobileWork && (
                            <div className={cx("mobile-work")}>
                                <img src={HOT} className={cx('icon-new')}/>
                                <Button ga-data={'batch-print'}
                                        type='default'
                                        onClick={onMobileWork}                      >
                                    移动报工
                                </Button>
                            </div>
                        )
                    }
                    {this.props.extraContent}
                    {
                        addUrl||addClickHandler ? (
                            <AddButton addMenu={this.props.addMenu && this.props.addMenu}  clickHandler={addClickHandler} ga-data={'batch-add'} className="btn-list-add" module={this.props.authModule} type="primary" to={addUrl} icon="icon-plus" label={addLabel}/>
                        ) : null
                    }

                </div>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        setTbOffsetTop: listTableActions.setTbOffsetTop
    }, dispatch)
};

export default withRouter(
    connect(null, mapDispatchToProps)(ListOpeBar)
)
