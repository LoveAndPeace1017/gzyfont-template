import React, { Component } from 'react';
class RenderNode extends Component {
    render() {
        const {creator,documentType} = this.props;
        return (
            <React.Fragment>
                {creator} 发来一条 <span style={{color: "red"}}>{documentType}</span> 请您审批
            </React.Fragment>
        );
    }
}

export default RenderNode;