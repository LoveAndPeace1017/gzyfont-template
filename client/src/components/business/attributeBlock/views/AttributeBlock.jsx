import React from 'react';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import AttributeInfo from './AttributeInfo'
import PropTypes from  'prop-types';

/**
 * 信息列表，一般用于多条信息展示
 *
 * @visibleName AttributeBlock（信息列表）
 * @author guozhaodong
 */
export default  function AttributeBlock(props) {
    let { data, customClassName} = props;
    return (
        <div className={cx(customClassName)}>
            {
                data&&data.map((item) => {
                    return <AttributeInfo {...props} key={item.name} data={item} />
                })
            }
        </div>
    );
}

AttributeBlock.propTypes = {
    /**
     *  属性信息数组
     **/
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string
    })),
    /**
     *  自定义的className
     **/
    customClassName: PropTypes.string
};

AttributeBlock.defaultProps = {
    customClassName: 'attr-row'
};



