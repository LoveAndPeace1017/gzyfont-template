import AuthValueLabel from '../dependencies/AuthLabel'
import React from 'react';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';


const cx = classNames.bind(styles);

/**
 * 信息，一般用于单条信息展示
 *
 * @visibleName AttributeInfo（信息）
 * @author guozhaodong
 */
export default function AttributeInfo(props) {
    let {data, module, option} = props;
    return (
        <React.Fragment key={data.name}>
            <div className={cx(["attr-info", {"attr-title-info": data.highlight}])}>
                <span className={cx("attr-key")}>{ data.outType!=undefined ?data.name + "："+data.outType:data.name + "："}</span>
                <span className={cx("attr-value")}>
                    {(module&&module!==undefined&&option&&option!==undefined)?
                        data.isLink?<Link className={cx("special-a")} to={data.href}><AuthValueLabel {...props} value={data.value || '-'}/></Link>:<AuthValueLabel {...props} value={data.value || '-'}/>:
                        data.isLink?<Link className={cx("special-a")} to={data.href}>{data.value || '-'}</Link>:(data.value || '-')
                    }
                </span>
            </div>
        </React.Fragment>
    );
}

AttributeInfo.propTypes = {
    /**
     *  属性信息对象
     **/
    data: PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ])
    }),
    /**
     * 是否高亮
     **/
    highlight: PropTypes.bool,
    /**
     * 属性值是否有链接
     **/
    isLink: PropTypes.bool,
    /**
     * 链接地址, isLink为真才有效
     **/
    href: PropTypes.string,
    /**
     * 上游单据编号, isLink为真才有效
     **/
    fkSaleOrderBillNo: PropTypes.string,
};
