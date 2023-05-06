import React, { Component } from 'react';
import classNames from "classnames/bind";

import {formatCurrency} from 'utils/format';
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
import prodImg120 from 'images/prodImg120.png'

class CartTable extends  Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const {supplierName, dataSource} = this.props;

        return (
            <React.Fragment>
                <span className="ant-table">
                    <table className="">
                        <colgroup>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                        </colgroup>
                        <thead className="ant-table-thead">
                            <tr>
                                <th className="" colSpan={6} style={{textAlign: 'left', background: '#fff',border: 'none'}}>{supplierName}</th>
                            </tr>
                        </thead>

                            <tbody className="ant-table-tbody" style={{ background: '#fff',borderBottom: '1px dotted #e8e8e8'}}>
                            {
                                dataSource.map((item, index) =>
                                    <tr className="ant-table-row ant-table-row-level-0"  key={index} >
                                        <td className="" width="10%" style={{border: 'none'}}>
                                            <div className={cx("prod-img")}>
                                                <img src={item.thumbnailUri?item.thumbnailUri: prodImg120} alt=""/>
                                            </div>
                                        </td>
                                        <td className="" width="30%" style={{border: 'none'}}>
                                            <div className={cx("prod-intro-wrap")}>
                                                <a className={cx("prod-tit")} href="#!">{item.prodName}</a>
                                                <span className={cx("prod-kind")}>{item.descItem}</span>
                                            </div>
                                        </td>
                                        <td className="" width="15%" style={{border: 'none'}}>
                                            {item.supplierProductDisplayCode}
                                        </td>
                                        <td className="" width="15%" style={{border: 'none'}}>
                                            {formatCurrency(item.unitPrice)}
                                        </td>
                                        <td className="" width="15%" style={{border: 'none'}}>
                                            {item.quantity}{item.unit}
                                        </td>
                                        <td className="" width="15%" style={{border: 'none'}}>
                                            {item.amount}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </span>
            </React.Fragment>
        )
    };
}


export default CartTable
