import React, {Component} from 'react';
import GoodsTable from './goodsTable'


function withFillGoods(WrappedComponent){
    return class WithFillGoods extends Component{
        render(){
            return(
                <GoodsTable {...this.props}>
                    {
                        WrappedComponent ? (props)=><WrappedComponent {...props}/>: null
                    }
                </GoodsTable>
            )
        }
    }

}


export default withFillGoods;

