import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Link} from "react-router-dom";
import {withRouter} from "react-router-dom";
import {Dropdown, Menu} from 'antd';
import Icon from 'components/widgets/icon';
import {CopyMenu, ModifyMenu, DeleteMenu, CommonItemMenu} from "components/business/authMenu";
import PrintDetail from 'components/business/printDetail';
import {AddPkgOpen} from "components/business/vipOpe";
import IntlTranslation from 'utils/IntlTranslation';
import HOT from  'pages/home/images/hot.png';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
import PropTypes from 'prop-types';

const CommonAction = {
    orderRecord: {
        label: <IntlTranslation intlKey="components.opeBar.index.orderRecord"/>,
        icon: 'icon-cart'
    },
    saleRecord: {
        label: <IntlTranslation intlKey="components.opeBar.index.saleRecord"/>,
        icon: 'icon-sale'
    },
    store: {
        label: <IntlTranslation intlKey="components.opeBar.index.store"/>,
        icon: 'icon-store'
    },
    order: {
        label: <IntlTranslation intlKey="components.opeBar.index.order"/>,
        path: '/purchase/add',
        icon: 'icon-cart'
    },
    sale: {
        label: <IntlTranslation intlKey="components.opeBar.index.sale"/>,
        path: '/sale/add',
        icon: 'icon-sale'
    },
    storeIn: {
        label: <IntlTranslation intlKey="components.opeBar.index.storeIn"/>,
        // path: '/inventory/inbound/add',
        icon: 'icon-store-in'
    },
    storeOut: {
        label: <IntlTranslation intlKey="components.opeBar.index.storeOut"/>,
        // path: '/inventory/outbound/add',
        icon: 'icon-store-out'
    },
    edit: {
        label: <IntlTranslation intlKey="components.opeBar.index.edit"/>,
        icon: 'icon-edit'
    },
    viewQuote: {
        label: <IntlTranslation intlKey="components.opeBar.index.viewQuote"/>,
        icon: 'file-text'
    },
    disable: {
        label: <IntlTranslation intlKey="components.opeBar.index.disable"/>,
        icon: 'icon-disabled'
    },
    receipt: {
        label: <IntlTranslation intlKey="components.opeBar.index.receipt"/>,
        icon: 'icon-receipt'
    },
    invoice: {
        label: <IntlTranslation intlKey="components.opeBar.index.invoice"/>,
        icon: 'icon-sale-invoice'
    },
    payment: {
        label: <IntlTranslation intlKey="components.opeBar.index.payment"/>,
        icon: 'icon-payment'
    },
    purchaseInvoice: {
        label: <IntlTranslation intlKey="components.opeBar.index.purchaseInvoice"/>,
        icon: 'icon-invoice'
    },
    addFriend: {
        label: <IntlTranslation intlKey="components.opeBar.index.addFriend"/>,
        icon: 'icon-add-friend'
    },
    delete: {
        label: <IntlTranslation intlKey="components.opeBar.index.delete"/>,
        icon: 'icon-delete'
    },
    copy: {
        label: <IntlTranslation intlKey="components.opeBar.index.copy"/>,
        icon: 'icon-copy'
    },
    shop: {
        label: <IntlTranslation intlKey="components.opeBar.index.shop"/>,
        icon: 'icon-mall'
    },
    /*inquiry: {
        label: '询价',
        path: '/inquiry/add',
        icon: 'icon-inquiry'
    },*/
    print: {
        label: <IntlTranslation intlKey="components.opeBar.index.print"/>,
        onClick: () => {
            let bdHtml = window.document.body.innerHTML;
            let printHtml = document.getElementById('printArea').innerHTML;
            window.document.body.innerHTML = printHtml;
            window.print();
            window.document.body.innerHTML = bdHtml;
            location.reload();
        },
        icon: 'icon-print'
    },
    export: {
        label: <IntlTranslation intlKey="components.opeBar.index.export"/>,
        onClick: () => {console.log('78')},
        icon: 'icon-export'
    },
    batchShelfLeft: {
        label: '批次查询',
        icon: 'icon-batch-shelf-copy'
    },
    rowMaterialOutbound: {
        label: '原料出库',
        icon: 'icon-cart'
    },
    finishProdInbound: {
        label: '成品入库',
        icon: 'icon-sale'
    },
    quotationSale:{
        label: '销售',
        icon: 'icon-sale'
    },
    multiSpec: {
        label: '添加规格',
        icon: 'icon-sale'
    },
    openBom: {
        label: '展开结构',
        icon: 'icon-export'
    },
    multiBomExport: {
        label: '导出',
        icon: 'icon-export'
    },
    requisitionOutbound: {
        label: '出库',
        icon: 'icon-store-out'
    },
    requisitionPurchase: {
        label: '采购',
        icon: 'icon-cart'
    },
    refund: {
        label: '退货',
        icon: 'icon-refund'
    },
    supplierQuotation: {
        label: "供应商报价",
        icon: 'icon-supplier'
    },
    quotation: {
        label: '供应商报价',
        icon: 'icon-in-out-com'
    },
    messageRecommend: {
        label: '短信提醒',
        icon: 'icon-message'
    }
};

/**
 * 详情页顶部操作
 *
 * @visibleName OpeBar（详情页顶部操作）
 * @author guozhaodong
 */
class OpeBar extends Component {

    static propTypes = {
        /**
         * 操作项数据，格式为  <br />
         * ```
         * [
         *    {
         *        name:'edit',
         *       module: 'stocktaking',
         *        path:`/inventory/stocktaking/modify/${info.get('checkNo')}`
         *    },
         *    {
         *        name: 'delete',
         *        module: 'stocktaking',
         *       onClick: () => {
         *           this.showDeleteConfirm();
         *       }
         *    }
         * ]
         * ```
         **/
        data: PropTypes.shape({
            /**
             * 操作项数据 <br />
             * name: 操作项英文名称，主要是为了调用常用的操作项，如edit, delete, copy <br />
             * label: 操作项中文名称，如修改、删除、复制 <br />
             * disabled: 禁用点击 <br />
             * path: Link组件的链接 <br />
             * href: a标签的链接 <br />
             * onClick: 点击的回调 <br />
             * icon: 图标 <br />
             * module: 权限模块， 如 purchase、 sale <br />
             * option: 权限类型，一般为 add、modify、delete、show <br />
             **/
            listData: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                label: PropTypes.string,
                disabled: PropTypes.bool,
                path: PropTypes.string,
                href: PropTypes.string,
                onClick: PropTypes.func,
                icon: PropTypes.string,
                module: PropTypes.string,
                option: PropTypes.string,
            }))
        })
    };

    multiBomExport = (value)=>{

    }

    render() {
        const {
            match: {params, path},
            data: {listData, moreData}
        } = this.props;

        const moreActionList = moreData && moreData.map((item) => {
            const commonAction = CommonAction[item.name];
            const path = item.path || (commonAction && commonAction.path);
            const href = item.href || (commonAction && commonAction.href);
            const icon = item.icon || (commonAction && commonAction.icon);
            if (path) {
                return (
                    <Menu.Item key={item.name}>
                        <Link to={path}>
                            {icon && <Icon type={icon}/>}
                            {item.label || (commonAction && commonAction.label)}
                        </Link>
                    </Menu.Item>
                )
            } else if (href) {
                return (
                    <Menu.Item key={item.name}>
                        <a href={href}>
                            {icon && <Icon type={icon}/>}
                            {item.label || (commonAction && commonAction.label)}
                        </a>
                    </Menu.Item>
                )
            } else {
                return (
                    <Menu.Item key={item.name} onClick={item.onClick || (commonAction && commonAction.onClick)}>
                        {icon && <Icon type={icon}/>}
                        {item.label || (commonAction && commonAction.label)}
                    </Menu.Item>
                );
            }
        });

        const menus = <Menu>
                            <Menu.Item onClick={()=>this.props.multiBomExport(1)} key={1}>
                                一阶展开
                            </Menu.Item>
                            <Menu.Item onClick={()=>this.props.multiBomExport(2)} key={2}>
                                二阶展开
                            </Menu.Item>
                            <Menu.Item onClick={()=>this.props.multiBomExport(3)} key={3}>
                                三阶展开
                            </Menu.Item>
                            <Menu.Item onClick={()=>this.props.multiBomExport(-1)} key={4}>
                                尾阶展开
                            </Menu.Item>
                      </Menu>;

        return (
            <React.Fragment>
                <div className={cx("ope-bar") + ' cf'}>
                    <ul className="cf">
                        {
                            listData && listData.map((item) => {
                                const commonAction = CommonAction[item.name];
                                const path = item.path || (commonAction && commonAction.path);
                                const href = item.href || (commonAction && commonAction.href);
                                const icon = item.icon || (commonAction && commonAction.icon);
                                const clickHandler = item.onClick || (commonAction && commonAction.onClick);
                                const authMenuProps = {
                                    className: "ope-item",
                                    key: item.name,
                                    disabled: item.disabled,
                                    icon: icon,
                                    to: path,
                                    label: item.label || (commonAction && commonAction.label),
                                    module: item.module,
                                    option: item.option,
                                    gaOption:item.name,
                                };
                                let itemStr;
                                if(item.hidden){
                                    return null;
                                }
                                if (path) {
                                    if (item.name === 'edit') {
                                        itemStr = <ModifyMenu {...authMenuProps}/>
                                    } else if (item.name === 'copy') {
                                        itemStr = <CopyMenu {...authMenuProps}/>
                                    } else if (item.name === 'refund') {
                                        itemStr = <CommonItemMenu {...authMenuProps}/>
                                    } else {
                                        itemStr = <li key={item.name} className={cx({'disabled': item.disabled})}>
                                            <Link to={path} disabled={item.disabled}>
                                                {icon && <Icon type={icon}/>}
                                                {item.label || (commonAction && commonAction.label)}
                                            </Link>
                                        </li>
                                    }
                                    return itemStr
                                } else if (href) {

                                    //如果是导出功能,采购,销售,出库,入库走自定义导出模块
                                    let needSpecialExportAry = ['purchase','sale','inbound','outbound','quotation','produceWork'];
                                    if(needSpecialExportAry.indexOf(item.module)>=0 && item.name === 'export'){
                                       return (<PrintDetail href={item.href} displayBillNo={item.displayBillNo} templateType={item.templateType}/>)
                                    }else{
                                        return (
                                            <li key={item.name} className={cx({'disabled': item.disabled})}>
                                                <a href={href} ga-data={'list-' + item.name}>
                                                    {icon && <Icon type={icon}/>}
                                                    {item.label || (commonAction && commonAction.label)}
                                                </a>
                                            </li>
                                        );
                                    }

                                } else if (clickHandler) {
                                    if(item.name === 'delete'){
                                        itemStr = <DeleteMenu {...authMenuProps} clickHandler={clickHandler}/>
                                    }else if (item.vipSource) {
                                        itemStr = <li key={item.name} ga-data={'list-' + item.name} style={{position: 'relative'}}>
                                            <AddPkgOpen
                                                onTryOrOpenCallback={() => {clickHandler()}}
                                                openVipSuccess={(type) => {clickHandler(type)}}
                                                source={item.vipSource}
                                                render={() => (
                                                    <React.Fragment>
                                                        {icon && <Icon type={icon}/>}
                                                        {item.label || (commonAction && commonAction.label)}
                                                        {item.hot && <img src={HOT} className={cx('icon-new')}/>}
                                                    </React.Fragment>
                                                )}
                                            />
                                        </li>
                                    }else{
                                        const itemProp = {
                                        className: cx({'disabled':item.disabled})
                                    };
                                    if(!item.disabled){
                                        itemProp.onClick = clickHandler
                                    }

                                    //加了权限的
                                    if(item.module && item.option){
                                        return <CommonItemMenu {...authMenuProps} className={authMenuProps.className + " " + itemProp.className} clickHandler={clickHandler} />
                                    }else{
                                        //如果是打印则独自处理
                                        if(item.name === 'print' && !item.module){
                                            itemStr =  <PrintDetail displayBillNo={item.displayBillNo} templateType={item.templateType}/>
                                        }else{
                                            itemStr = <li key={item.name} {...itemProp} ga-data={'list-' + item.name}>
                                                {icon && <Icon type={icon}/>}
                                                {item.label || (commonAction && commonAction.label)}
                                            </li>
                                        }

                                    }
                                }
                                return itemStr;
                            }else{
                                    if(item.name === 'multiBomExport' && !item.module){
                                        itemStr = <li key={item.name} ga-data={'list-' + item.name}>
                                           <Dropdown overlay={menus}>
                                               <span className={cx("bom-title")}>
                                                   {icon && <Icon type={icon}/>}
                                                   {item.label || (commonAction && commonAction.label)}
                                               </span>
                                           </Dropdown>
                                        </li>
                                        return itemStr;
                                    }
                             }
                        })
                        }
                        {
                            moreActionList && moreActionList.length > 0 && (
                                <li>
                                    <Dropdown overlay={(
                                        <Menu>
                                            {moreActionList}
                                        </Menu>
                                    )}>
                                        <a className="ant-dropdown-link" href="#">
                                            <Icon type="ellipsis"/>{intl.get("components.opeBar.index.more")} <Icon type="down"/>
                                        </a>
                                    </Dropdown>
                                </li>
                            )
                        }
                    </ul>

                    {/* <div className={cx("page-switch")}>
                        <Link to={{pathname: `${path.split(':')[0]}${params.id}`}} className={cx("prev")}><Icon
                            type="left"/></Link>
                        <Link to={{pathname: `${path.split(':')[0]}${params.id}`}} className={cx("next")}><Icon
                            type="right"/></Link>
                    </div>*/}
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(OpeBar);