import React, { Component } from 'react';
import renderRoutes from 'utils/renderRoutes';

//包含所有的公共样式
import 'styles/common.scss';
//覆盖ant样式
import 'styles/ant.scss';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

 class Index extends Component {
	render() {
        const {routes} =this.props;
		return (
			<React.Fragment>
                {renderRoutes(routes)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => {
	return bindActionCreators({

	}, dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps, undefined, {pure: false})(Index)
