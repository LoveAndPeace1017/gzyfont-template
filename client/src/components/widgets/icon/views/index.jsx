import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import '../iconfont';
import PropTypes from "prop-types";
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);


/**
 * 图标，这个组件是对`antd`的`Icon`组件进行了二次封装，调用这个组件你可以使用`antd`的所有`Icon`，另外你还可以自定义图标，自定义的图标目前放在阿里的iconfont上进行托管。
 *
 * @visibleName Icon（图标）
 * @author guozhaodong
 */
const Icon = ({prefix, className, ...props}) => {
    const IconFont = createFromIconfontCN({
    });
    const {type} = props;
    const classNames = className?cx(type)+ " " + className:cx(type);
    return <i><IconFont {...props} className={classNames}/></i>
};

Icon.propTypes = {
    /**
     * 图标type的前缀，如果有前缀表示是自定义的图标，默认值为icon一般不需要修改
     **/
    prefix: PropTypes.string
};
Icon.defaultProps = {
    prefix: 'icon'
};


export default Icon;