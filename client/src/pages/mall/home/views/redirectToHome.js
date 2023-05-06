import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {actions as mallHomeActions} from 'pages/mall/home'
import {bindActionCreators} from "redux";
import {Spin} from "antd";

const redirectToHome = (WrappedComponent) => {
    const mapStateToProps = (state) => ({
        mallPreData: state.getIn(['mallHome', 'preData']),
    });

    const mapDispatchToProps = dispatch => {
        return bindActionCreators({
            asyncFetchMallPreData: mallHomeActions.asyncFetchPreData
        }, dispatch)
    };

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(
        class RedirectToHome extends WrappedComponent{

            componentDidMount(){
                this.props.asyncFetchMallPreData((data)=>{
                    if(!data.data || !data.data.available){
                        this.props.history.replace('/mall/');
                    }
                });
            }



            render() {
                const available = this.props.mallPreData.getIn(['data', 'data', 'available']);
                //商城状态
                if (available) {
                    return super.render();
                }
                else{
                    return <Spin size="large"
                                 className="gb-data-loading"/>
                }
                // else if(!mallStatus || mallStatus === 0){
                //     this.props.history.replace('/mall/');
                //     return null;
                // }
            }
        }
    ))
};

export default redirectToHome;