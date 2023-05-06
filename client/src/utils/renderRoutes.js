import React from 'react';
import { Route, Switch } from 'react-router-dom';

const renderRoutes = (routes, extraProps = {}, switchProps = {}) => routes ? (
    <Switch {...switchProps}>
        {routes.map((route, i) => (
            <Route
                key={route.key || i}
                path={route.path}
                exact={route.exact}
                strict={route.strict}
                render={(props) => {
                    //路由配置中的当前菜单赋值给location对象，方便菜单定位
                    props.location.uid = route.uid;
                    props.location.current = route.customCurrent || route.current; //先获取自定义的current（也就是url中的），没有再去获取route中定义的current

                    let searchObj = {};
                    if(!!props.location.search){
                        for(let val of props.location.search.substr(1).split('&')){
                            let valArr = val.split('=');
                            searchObj[valArr[0]] = valArr[1];
                        }
                    }
                    props.location.searchObj = searchObj;

                    let bodyClass = (route.path === '/' && 'home' || route.uid || route.path).replace(/\//g, '-');
                    if(bodyClass[0] === '-') bodyClass = bodyClass.slice(1);
                    if(bodyClass[bodyClass.length-1] === '-') bodyClass = bodyClass.slice(0, -1);
                    document.getElementsByTagName('body')[0].className = 'bd-'+bodyClass;

                    if (route.isAuthed == '1') {
                        return <route.component {...props} {...extraProps} route={route} />
                    }
                    return (
                        <div>暂无权限，可联系管理员开通。</div>
                    )
                }}
            />
        ))}
    </Switch>
) : null;

export default renderRoutes;