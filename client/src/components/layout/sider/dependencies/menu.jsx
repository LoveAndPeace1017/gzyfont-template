import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Link, NavLink, withRouter} from 'react-router-dom';
import {Modal, Menu as AntdMenu} from 'antd';
import Icon from 'components/widgets/icon';
import menuData from './menuData';
import {withMallExpired} from "components/business/vipOpe";
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import intl from 'react-intl-universal';

const SubMenu = AntdMenu.SubMenu;
const MenuItemGroup = AntdMenu.ItemGroup;
const MenuItem = AntdMenu.Item;

const mapStateToProps = state => ({
    collapsed: state.getIn(['sider', 'collapsed']),
    menuList: state.getIn(['auxiliaryMenu', 'menuList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

//此处pure:false关闭浅比较，不关闭路由变化不会重新渲染组件
@withRouter
@withMallExpired
@connect(mapStateToProps, mapDispatchToProps, undefined, {pure: false})
@withVipWrap
export default class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const pathname = this.props.history.location.current || this.props.history.location.pathname;
        let menuMap = this.props.menuList.get('menuMap') && this.props.menuList.get('menuMap').toJS();

        return (
            <AntdMenu
                mode="vertical"
                subMenuCloseDelay={0.4}
                selectedKeys={[pathname]}
            >
                <MenuItem key="/">
                    <NavLink to="/home" ga-data={'nav-home'}>
                        <Icon type="icon-home"/>
                        <span>{intl.get('home.menu.index')}</span>
                    </NavLink>
                </MenuItem>
                {
                    menuData && menuData.map(menu=>{
                        return(
                            <React.Fragment>
                                {
                                    menuMap[menu.key] ? (
                                        <SubMenu
                                            key={menu.key}
                                            className={`menu-${menu.key}`}
                                            icon={<Icon type={menu.icon}/>}
                                            title={menu.label}
                                            popupOffset={[8, -18]}
                                        >
                                            {
                                                menu.subMenuGroup && menu.subMenuGroup.map((subMenuGroup, index) => {
                                                    return (
                                                        <MenuItemGroup
                                                            key={index}
                                                            title={subMenuGroup.title}
                                                            style={subMenuGroup.title==='___'?{'border-left': 'none'}: {}}
                                                        >
                                                            {
                                                                subMenuGroup.subMenu && subMenuGroup.subMenu.map(subMenu => {
                                                                    let arr = subMenu.path.split('/');
                                                                    let gadata = arr.join('-');
                                                                    gadata = 'nav' + gadata;
                                                                    if (subMenu.path.substr(-1) === '/') {
                                                                        gadata = gadata + 'list';
                                                                    }
                                                                    let navLinkProps = {
                                                                        to: subMenu.path,
                                                                        'ga-data': gadata
                                                                    };
                                                                    // vipSource 需要校验当前的vip权限，校验成功后跳往指定链接
                                                                    if (subMenu.vipSource) {
                                                                        navLinkProps.onClick = () => {
                                                                            this.props.vipTipPop({
                                                                                source: subMenu.vipSource,
                                                                                module: subMenu.module,
                                                                                onTryOrOpenCallback: () => {
                                                                                    this.props.history.push(navLinkProps.to);
                                                                                }
                                                                            });
                                                                        };
                                                                    }
                                                                    return (
                                                                        <MenuItem key={subMenu.key}>
                                                                            {
                                                                                !subMenu.vipSource ? (
                                                                                    <NavLink {...navLinkProps}>
                                                                                        <span>{subMenu.label}</span>
                                                                                    </NavLink>
                                                                                ) : (
                                                                                    <a href="#!" {...navLinkProps}>{subMenu.label}</a>)
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </MenuItemGroup>
                                                    )
                                                })
                                            }
                                        </SubMenu>
                                    ) : null
                                }
                            </React.Fragment>
                        )
                    })
                }
                {
                    menuMap.downloadCenter && (
                        <MenuItem key="/downloadCenter">
                            <NavLink to="/downloadCenter" ga-data={'nav-downloadCenter'}>
                                <Icon type="icon-downloadCenter"/>
                                <span>{"下载中心"}</span>
                            </NavLink>
                        </MenuItem>
                    )
                }
            </AntdMenu>
        )
    }
}