import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import {Table, Menu, Dropdown} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {Auth} from 'utils/authComponent';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import FileView from 'components/business/fileView';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import {ResizeableTitle} from 'components/business/resizeableTitle';
import {AddPkgOpen} from 'components/business/vipOpe';
import {backProcessBtnStatus, processTitleMap} from './data';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const cx = classNames.bind(styles);

const renderContent = (value, row, index, authModule, authOption) => {
    const obj = {
        children: <span className={cx('txt-clip')} title={value}>{value}</span>,
    };
    if (authModule && authOption) {
        obj.children = <Auth module={authModule} option={authOption}>{(isAuthed) => isAuthed ?
            <React.Fragment>
                <span className={cx('txt-clip')} title={value}>{value}</span>
            </React.Fragment> : PRICE_NO_AUTH_RENDER}</Auth>
    }
    return obj;
};

const mapStateToProps = (state) => ({
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfig: fieldConfigActions.asyncSaveFieldConfig,
    }, dispatch)
};

/**
 *功能介绍：
 *用于详情页面展示工序列表
 * 涉及模块：
 * @visibleName processList（工序列表）
 * @author jinb
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class ProcessList extends Component {
    constructor(props){
        super(props);
        this.state = {
            mainColumns: [],
            columns: []
        };
    }

    static propTypes = {
        /**
         *   字段的key，如果传入则会覆盖默认的key
         *   默认值{
            serial: serial,
            processCode: processCode,
            processName: processName,
            processStatus: processStatus,
            expectStartDate: expectStartDate,
            expectEndDate: expectEndDate,
            actualStartDate: actualStartDate,
            actualEndDate: actualEndDate,
            expectCount: expectCount,
            finishCount: finishCount,
            scrapCount: scrapCount,
            yieldRate: yieldRate,
            caName: caName,
            officerName: officerName,
        }
         **/
        dataName: PropTypes.object,
        /**
         *  当前所属模块名称
         **/
        moduleType: PropTypes.string,
        /**
         *   保存配置字段的模块类型，需要和后端确认，如采购'purchase_order'
         **/
        fieldConfigType: PropTypes.string
    };

    static defaultProps = {
        defaultAuthType: 'show',
        PRICE_NO_AUTH_RENDER,
    };

    componentWillUnmount() {
        if (this.props.fieldConfigType) {
            this.props.asyncSaveFieldConfig(this.props.fieldConfigType);
            this.props.emptyFieldConfig();
        }
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    handleResize = (index, columns) => (e, { size }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
        };
        this.setState({ columns: nextColumns });
    };

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
        let columns = [
            {
                title: "序号",
                key: 'serial',
                dataIndex: 'serial',
                width: 60,
                render: renderContent
            },
            {
                title: "顺序号",
                key: 'orderNo',
                dataIndex: 'orderNo',
                width: 60,
                render: renderContent
            },
            {
                title: "工序编号",
                key: 'processCode',
                dataIndex: 'processCode',
                columnName: 'processCode',
                width: 120,
                render: renderContent
            },
            {
                title: "工序名称",
                key: 'processName',
                dataIndex: 'processName',
                columnName: 'processName',
                width: 150,
                render: renderContent
            },
            {
                title: "状态",
                key: 'processStatus',
                dataIndex: 'processStatus',
                width: 60,
                render: (value) => {
                    return <span>{processTitleMap[value]}</span>
                }
            },
            {
                title: "计划开始时间",
                key: 'expectStartDate',
                dataIndex: 'expectStartDate',
                width: 150,
                render: (value) => {
                    return <span>{value}</span>
                }
            },
            {
                title: "计划结束时间",
                key: 'expectEndDate',
                dataIndex: 'expectEndDate',
                width: 150,
                render: (value) => {
                    return <span>{value}</span>
                }
            },
            {
                title: "实际开始时间",
                key: 'actualStartDate',
                dataIndex: 'actualStartDate',
                width: 150,
                render: (value) => {
                    return <span>{value}</span>
                }            },
            {
                title: "实际结束时间",
                key: 'actualEndDate',
                dataIndex: 'actualEndDate',
                width: 150,
                render: (value) => {
                    return <span>{value}</span>
                }
            },
            {
                title: "计划产量",
                key: 'expectCount',
                dataIndex: 'expectCount',
                width: 80,
                render: renderContent
            },
            {
                title: "完工数量",
                key: 'reportCount',
                dataIndex: 'reportCount',
                width: 80,
                render: (reportCount, row) => {
                    return (
                        <Dropdown className={'list-sale-prodAbstract'}
                                  overlay={() => (
                                      <Menu className={cx('abstract-drop-menu') + ' list-prodAbstract'}>
                                          <Menu.Item>
                                              <div className={cx("abstract-drop")}>
                                                  <ul>
                                                      {
                                                          row.reports && row.reports.map((item, index) =>
                                                              <li key={index}>
                                                                  <span className={cx('prod-tit')}>{item.employeeName}</span>
                                                                  <span className={cx('prod-desc')}>{item.reportCount}</span>
                                                              </li>
                                                          )
                                                      }
                                                  </ul>
                                              </div>
                                          </Menu.Item>
                                      </Menu>
                                  )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={reportCount}>{reportCount}</span>
                                <DownOutlined className="ml5"/>
                            </span>
                        </Dropdown>
                    )
                }
            },
            {
                title: "良品数量",
                key: 'finishCount',
                dataIndex: 'finishCount',
                width: 80,
                render: (finishCount, row) => {
                    return (
                        <Dropdown className={'list-sale-prodAbstract'}
                                  overlay={() => (
                                      <Menu className={cx('abstract-drop-menu') + ' list-prodAbstract'}>
                                          <Menu.Item>
                                              <div className={cx("abstract-drop")}>
                                                  <ul>
                                                      {
                                                          row.reports && row.reports.map((item, index) =>
                                                              <li key={index}>
                                                                  <span className={cx('prod-tit')}>{item.employeeName}</span>
                                                                  <span className={cx('prod-desc')}>{item.finishCount}</span>
                                                              </li>
                                                          )
                                                      }
                                                  </ul>
                                              </div>
                                          </Menu.Item>
                                      </Menu>
                                  )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={finishCount}>{finishCount}</span>
                                <DownOutlined className="ml5"/>
                            </span>
                        </Dropdown>
                    )
                }
            },
            {
                title: "不良数量",
                key: 'scrapCount',
                dataIndex: 'scrapCount',
                width: 80,
                render: (scrapCount, row) => {
                    return (
                        <Dropdown className={'list-sale-prodAbstract'}
                                  overlay={() => (
                                      <Menu className={cx('abstract-drop-menu') + ' list-prodAbstract'}>
                                          <Menu.Item>
                                              <div className={cx("abstract-drop")}>
                                                  <ul>
                                                      {
                                                          row.reports && row.reports.map((item, index) =>
                                                              <li key={index}>
                                                                  <span className={cx('prod-tit')}>{item.employeeName}</span>
                                                                  <span className={cx('prod-desc')}>{item.scrapCount}</span>
                                                              </li>
                                                          )
                                                      }
                                                  </ul>
                                              </div>
                                          </Menu.Item>
                                      </Menu>
                                  )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={scrapCount}>{scrapCount}</span>
                                <DownOutlined className="ml5"/>
                            </span>
                        </Dropdown>
                    )
                }
            },

            {
                title: "良品率",
                key: 'yieldRate',
                dataIndex: 'yieldRate',
                width: 80,
                render: renderContent
            },
            {
                title: "工作中心",
                key: 'caName',
                dataIndex: 'caName',
                columnName: 'caName',
                width: 100,
                render: renderContent
            },
            {
                title: "负责人",
                key: 'officerName',
                dataIndex: 'officerName',
                columnName: 'officerName',
                width: 100,
                render: renderContent
            },
            {
                title: "备注",
                key: 'remarks',
                dataIndex: 'remarks',
                columnName: 'remarks',
                width: 100,
                render: renderContent
            },
            {
                title: "附件",
                dataIndex: 'opt',
                className: 'g-remarks',
                width: 350,
                render: (ope,data) => (
                    <React.Fragment>
                        {
                            data.fileInfo && data.fileInfo.map((file) => {
                                return (
                                    <div key={file.get('fileId')}>
                                        <a style={{color: '#499fff'}}
                                           href={`${BASE_URL}/file/download/?url=/file/download/${file.get('fileId')}`}
                                        >
                                            {file.get('fileName')}
                                        </a>
                                        <FileView fileId={file.get('fileId')} fileName={file.get('fileName')}/>
                                    </div>
                                )
                            })
                        }
                    </React.Fragment>
                ),
            },
            {
                title: "操作",
                key: 'operate',
                dataIndex: 'operate',
                width: 220,
                fixed: 'right',
                render: (value, row) => {
                    let {id, billNo, processStatus, processCode, caCode} = row;
                    let {startWorkOperateForProcess, bookWorkOperateProcess, closeOperateForProcess, restartOperateForProcess, produceRecord, messageRecommend} = this.props;
                    let {startWorkFlag, bookWorkFlag, closeFlag, restartFlag} = backProcessBtnStatus(processStatus, null);
                    return (
                        <React.Fragment>
                            {startWorkFlag && (<a href="#!" className={cx("ml10")} onClick={() => startWorkOperateForProcess(id, billNo)}>开工</a>)}
                            {bookWorkFlag && (<a href="#!" className={cx("ml10")} onClick={() => bookWorkOperateProcess(id, billNo, caCode)}>报工</a>)}
                            {closeFlag && (<a href="#!" className={cx("ml10")} onClick={() => closeOperateForProcess(id, billNo)}>关闭</a>)}
                            {restartFlag && (<a href="#!" className={cx("ml10")} onClick={() => restartOperateForProcess(id, billNo)}>重启</a>)}
                            <span className={cx("ml10")} style={{'color': '#0066dd', 'cursor': 'pointer'}} onClick={() => produceRecord(processCode)}>生产记录</span>
                            <AddPkgOpen
                                onTryOrOpenCallback={() => messageRecommend({billNo, caCode, id})}
                                openVipSuccess={() => messageRecommend({billNo, caCode, id})}
                                source={'smsNotify'}
                                style={{'display': 'inline-block'}}
                                render={() => (
                                    <a href="#!" className={cx("ml10")}>短信提醒</a>
                                )}
                            />
                        </React.Fragment>
                    )
                }
            }
        ];

        this.setState({mainColumns: columns, columns});
    }

    render() {
        let {productList} = this.props;
        console.log(productList,'productList');
        let {columns, mainColumns} = this.state;
        //处理字段配置
        const configFields = this.props.goodsTableConfig.get('data');

        let visibleColumns = configFields && mainColumns.filter(column => {
            let isExistCustomField = false;
            //如果不是可配置的字段则为真(显示出来) 否则  是可配置字段&&visibleFlag=1  && （是自定义字段 && 后端返回存在的自定义字段  || 不是自定义字段）
            return configFields.every(field => {
                let flag = false;
                if(field.get('columnName') !== column.columnName){
                    flag = true;
                }else if(field.get('columnName') === column.columnName && field.get('visibleFlag') === 1){
                    //自定义字段title从后端取
                    column.isCustomField ? column.title = field.get('label'):void 0;
                    flag = true;
                    isExistCustomField = true;
                }
                return flag;
            }) && (!column.isCustomField || column.isCustomField && isExistCustomField);
        });

        for(let i = 0; i< visibleColumns.length; i++){
            for(let j = 0; j < columns.length; j++){
                if(visibleColumns[i].dataIndex === columns[j].dataIndex){
                    visibleColumns[i].width = columns[j].width;
                    break;
                }
            }
        }

        let tableWidth = visibleColumns && visibleColumns.reduce(function(width, item) {
            return width + item.width;
        }, 0);

        visibleColumns = visibleColumns && visibleColumns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index, visibleColumns)
            }),
        }));

        return (
            <div className="detail-table-wrap">
                <Table columns={visibleColumns}
                       dataSource={Array.from(productList)}
                       bordered
                       pagination={false}
                       components={this.components}
                       scroll={{x: 768}}/>
            </div>
        )
    }
}
