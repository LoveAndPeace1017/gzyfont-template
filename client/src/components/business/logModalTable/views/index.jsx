import React, {Component} from 'react';
import { Modal, Table } from 'antd';
import ListModalTable from 'components/business/listModalTable';
import IntlTranslation from 'utils/IntlTranslation';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const logColumns = {
    interchangeColumns: [{
        align: 'center',
        title: <IntlTranslation intlKey="components.logModalTable.index.serial"/>,
        dataIndex: 'serial',
        key: 'serial',
        width: 80
    }, {
        align: 'left',
        title:  <IntlTranslation intlKey="components.logModalTable.index.operateTime"/>,
        dataIndex: 'operateTime',
        width: 150,
        key: 'operateTime',
    }, {
        align: 'left',
        width: 200,
        title:  <IntlTranslation intlKey="components.logModalTable.index.role"/>,
        dataIndex: 'role',
        key: 'role',
    }, {
        align: 'left',
        title:  <IntlTranslation intlKey="components.logModalTable.index.context"/>,
        width: 300,
        dataIndex: 'context',
        key: 'context',
    }],
    operationColumns: [{
        align: 'center',
        title:  <IntlTranslation intlKey="components.logModalTable.index.serial"/> ,
        dataIndex: 'serial',
        key: 'serial',
        width: 80
    }, {
        align: 'left',
        width: 200,
        title:  <IntlTranslation intlKey="components.logModalTable.index.operateLoginName"/>,
        dataIndex: 'operateLoginName',
        key: 'operateLoginName',
    }, {
        align: 'left',
        title:  <IntlTranslation intlKey="components.logModalTable.index.context"/>,
        width: 300,
        dataIndex: 'operation',
        key: 'operation',
    }, {
        align: 'left',
        title:  <IntlTranslation intlKey="components.logModalTable.index.operateTime"/>,
        dataIndex: 'operateTime',
        width: 150,
        key: 'operateTime',
    }]
};

export default class LogModalTable extends Component {
    render() {
        const { title, width, columns, logVisible, logData, cancelCallBack } = this.props;

        return (
            <Modal
                title= {title}
                width={width || 800}
                visible={logVisible}
                footer={null}
                onCancel={() => {
                    cancelCallBack();
                }}
                destroyOnClose={true}
            >
                <ListModalTable columns={logColumns[columns]}
                                dataSource={Array.from(logData)}
                                pagination={false}
                                isNeedDrag
                                scroll={{y: 350}}/>
            </Modal>
        )
    }
}