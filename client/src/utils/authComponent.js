import React from 'react';
import {connect} from "react-redux";
import {isAuthed} from 'utils/isHasAuth';


export function isAuth(accountInfo, module, option, authCombineType){

    let authed;
    if(accountInfo.get('comName')&&!accountInfo.get('mainUserFlag')) {
        if(option&&option=='main'){
            // 该功能仅主账号可用
            authed = false;
        }
        let authMap = accountInfo.get('authMap').toJS();
        authed = isAuthed(authMap, module, option, authCombineType)
    }else{
        authed = true;
    }
    return authed;
}

/**
 * 高阶组件的方式，比较适合页面元素固定通用性的元素
 * **/
function authComponent(WrappedComponent) {

    class ContainerComponent extends  React.Component{
        static defaultProps = {
            noAuthRender: null,
            noAuthRenderProps: undefined
        };

        render() {
            const {currentAccountInfo,module,option, noAuthRenderProps, noAuthRender,gaOption, ...otherProps} =this.props;

            const accountInfo = currentAccountInfo.get('data');
            let authed = isAuth(accountInfo, module, option);
            if(!module) authed = true;
            //如果对没有权限的组件需要传入一些特殊的属性，比如输入框变为禁用可以传递这个属性 noAuthRenderProps={{disabled: true}}
            if(noAuthRenderProps){
                let newProps = {};
                if(!authed){
                    newProps={
                        ...noAuthRenderProps
                    }
                }
                return <WrappedComponent {...otherProps} {...newProps}/>;
            }else{
                if (authed) {
                    let finalOption = '';
                    if(gaOption){
                        if(gaOption!=="null"){
                            finalOption = gaOption;
                        }else{
                            finalOption = option;
                        }
                    }else{
                        finalOption = option;
                    }
                    return <WrappedComponent {...otherProps} module={module} option={finalOption}/>;
                }else {
                    return noAuthRender;
                }
            }

        }
    };

    const mapStateToProps = state => ({
        currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
    });
    return connect(mapStateToProps,null )(ContainerComponent)

}

/**
 * children as function方式，可以在页面直接获取是否包含某个模块的权限
 * **/
class AuthRender extends React.Component{

    render(){
        const {currentAccountInfo,module,option, authCombineType} =this.props;
        const accountInfo = currentAccountInfo.get('data');
        const authed = isAuth(accountInfo, module, option, authCombineType);
        return this.props.children(authed)?this.props.children(authed):null
    }
}

const mapStateToProps = state => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
});

export const Auth = connect(mapStateToProps)(AuthRender);

export default authComponent;