import React, { Component } from 'react';

import classNames from "classnames/bind";

import styles from "../styles/index.scss";
const cx = classNames.bind(styles);


class CartHeader extends  Component {
    constructor(props) {
        super(props);
    }
    render() {
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
                                <th className="" width="10%">商品信息</th>
                                <th className="" width="30%"/>
                                <th className="" width="15%">物品编号</th>
                                <th className="" width="15%">单价</th>
                                <th className="" width="15%">数量</th>
                                <th className="" width="15%">金额</th>
                            </tr>
                        </thead>
                    </table>
                </span>
            </React.Fragment>
        )
    }
}

export default CartHeader
