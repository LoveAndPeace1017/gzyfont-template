import React from 'react';
import {Pagination as AntdPagination} from 'antd';


/**
 * 该组件是对`antd`的`Pagination`组件进行的二次封装，主要是为了统一设置一些参数
 *
 * @visibleName Pagination（分页）
 * @author guozhaodong
 */
const Pagination = ({style, ...props}) => {
    return <AntdPagination {...props} style={{float: 'right', ...props.style}}/>
};

Pagination.defaultProps = {
    pageSizeOptions: ['20', '100', '200'],
    pageSize: 20,
    showSizeChanger: true,
    showQuickJumper: true,
};

export default Pagination;