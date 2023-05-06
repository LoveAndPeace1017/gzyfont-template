import React, {Component} from 'react';
import PpopTable from './ppopTable';
import PpomTable from './ppomTable';


function withFillGoods(WrappedComponent){
    return class WithFillGoods extends Component{
        render(){
            let { dataPrefix } = this.props;
            return(
                <React.Fragment>
                    {
                        dataPrefix === 'ppopList' ? (
                            <PpopTable {...this.props}>
                                {WrappedComponent ? (props)=><WrappedComponent {...props}/>: null}
                            </PpopTable>
                        ) : (
                            <PpomTable {...this.props}>
                                {WrappedComponent ? (props)=><WrappedComponent {...props}/>: null}
                            </PpomTable>
                        )
                    }
                </React.Fragment>
            )
        }
    }

}


export default withFillGoods;

