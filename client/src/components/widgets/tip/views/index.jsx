import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
import PropTypes from 'prop-types';


/**
 * Tip提示
 *
 * @visibleName Tip（提示）
 * @author guozhaodong
 */
const Tip = ({type, ...props}) => {
    return (
        <span className={cx(["tip", `tip-${type}`])}>
            <LegacyIcon type={`${type}-circle`} theme="filled"/>
            {props.children}
        </span>
    );
};
Tip.propTypes = {
    /**
     * 提示类型
     */
    type: PropTypes.oneOf(['info'])
};

Tip.defaultProps = {
  type: 'info'
};

export default Tip;