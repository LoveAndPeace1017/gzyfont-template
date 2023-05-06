/**
 *  WithResizeableTitle table主题拖动的行为进行封装
 *  author jinb
 *  2020/5/14
 */
import React, {Component} from 'react';
import {Table} from "antd";
import ResizeableTitle from './resizeableTitle';

export default class ResizeableTable extends Component {
    constructor(props) {
        super(props);
        let columns = props.columns;
        this.state = {
            columns: columns || []
        };
    }

    components = {
        header: {
            cell: ResizeableTitle
        },
    };

    handleResize = (index) => (e, { size }) => {
        let nextColumns = [...this.state.columns];
        nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
        };
        this.setState({ columns: nextColumns });
    };

    render() {
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));

        const components = {...this.components, ...this.props.components};

        return (
            <React.Fragment>
                <Table
                    {...this.props}
                    columns={columns}
                    components={components}
                >
                    {this.props.children}
                </Table>
            </React.Fragment>
        );
    }
}