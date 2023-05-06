import React from 'react';
import { Route, Switch } from 'react-router-dom';

const renderRoutes = (routes, extraProps = {}, switchProps = {}) => routes ? (
    <Switch {...switchProps}>
        {routes.map((route, i) => (
            <Route
                key={route.key || i}
                path={PROD_PATH + route.path}
                exact={route.exact}
                strict={route.strict}
                render={(props) => {
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