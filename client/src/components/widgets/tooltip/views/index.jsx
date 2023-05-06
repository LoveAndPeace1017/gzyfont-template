import React from 'react';
import {Tooltip as AntdTooltip} from 'antd';

import "../styles/index.scss";
import PropTypes from "prop-types";
import Tip from "../../tip/views";


/**
 * Tooltip气泡提示，该组件是对`antd`的`Tooltip`组件进行了二次封装（主要是改了样式，但是后来交互视觉又打算用`antd`自带的`Tooltip`，所以后面应该不会用，有可能会被废弃）
 *
 * @visibleName Tooltip（气泡提示）
 * @author guozhaodong
 */
const Tooltip = ({type, ...props}) => {
    return(
        <AntdTooltip
            overlayClassName = {`ant-tooltip-${type}`}
            {...props}
        >
            {props.children}
        </AntdTooltip>
    )
};

Tooltip.propTypes = {
    /**
     * 提示类型
     */
    type: PropTypes.oneOf(['info'])
};

Tooltip.defaultProps = {
    type: 'info'
};

export default Tooltip;