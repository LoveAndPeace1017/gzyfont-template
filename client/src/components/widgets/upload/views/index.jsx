import React from 'react';
import {Upload as AntdUpload} from 'antd';
import {getCookie} from "utils/cookie";


/**
 * 该组件是对`antd`的`Upload`组件进行的二次封装，主要是为了统一设置请求头和一些参数
 *
 * @visibleName Upload（上传）
 * @author guozhaodong
 */
const Upload = ({style, ...props}) => {
    return <AntdUpload {...props} headers={{'x-csrf-token': getCookie('csrfToken')}}/>
};

Upload.defaultProps = {

};

export default Upload;