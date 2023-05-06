import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {asyncCheckModuleHasArriveUpperLimit} from 'pages/home/actions';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import {bindActionCreators} from "redux";

const dealClickHandler = ({props, module, option, to, clickHandler, asyncCheckModuleHasArriveUpperLimit, history, _this}) => {
    const moduleGroup = ['goods', 'inbound', 'outbound','stocktaking'];
    const optionGroup = ['add', 'copy'];
    var newClickHandler = clickHandler;
    if(moduleGroup.indexOf(module) !== -1 && optionGroup.indexOf(option) !== -1){
        newClickHandler = () => {
            asyncCheckModuleHasArriveUpperLimit(module, (res) => {
                if (res != true){
                    _this.setState({show:true})
                } else {
                    if(to){
                        history.push(to);
                    } else if (clickHandler) {
                        clickHandler();
                    }
                }
            });
        }
    }
    return newClickHandler;
};

function authAmountComponent(WrappedComponent) {
    class ContainerComponent extends  React.Component {
        constructor(props) {
            super(props);
            this.state = {
                show: false,
            }
        }

        closeModal = () =>{
            this.setState({show:false})
        };

        render() {
            let props = this.props;
            let _this = this;
            let {module,option, to, clickHandler, asyncCheckModuleHasArriveUpperLimit, history, staticContext, ...otherProps} = props;
            clickHandler = dealClickHandler({props, module, option, to, clickHandler,asyncCheckModuleHasArriveUpperLimit, history, _this});
            let newProps = {module,option, to, clickHandler};
            if(!clickHandler){
                delete newProps.clickHandler
            }
            return (
                <React.Fragment>
                    <LimitOnlineTip onClose={()=>this.closeModal()} show={this.state.show}/>
                    <WrappedComponent {...newProps} {...otherProps}/>
                </React.Fragment>
            );
        }
    }

    /*const mapStateToProps = state => ({
        checkModuleArriveUpperLimit: state.getIn(['home','checkModuleArriveUpperLimit'])
    });*/
    const mapDispatchToProps = dispatch => {
        return bindActionCreators({
            asyncCheckModuleHasArriveUpperLimit
        }, dispatch)
    };
    return withRouter(connect(null,mapDispatchToProps)(ContainerComponent));
}

export default authAmountComponent;