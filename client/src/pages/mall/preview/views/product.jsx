import React, {Component} from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {getCookie} from 'utils/cookie';
import CustomerAllProd from 'pages/onlineOrder/customerAllProd'


class MallProdPreview extends Component {
    render(){
        /*const {currentAccountInfo} =this.props;
        const accountInfo = currentAccountInfo.get('data');
        const mainUserIdEnc = accountInfo && accountInfo.get('mainUserIdEnc');*/
        const userIdEnc = getCookie('uid');
        return(
            <div>
                <CustomerAllProd previewComId={userIdEnc}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});


export default withRouter(connect(mapStateToProps)(MallProdPreview))