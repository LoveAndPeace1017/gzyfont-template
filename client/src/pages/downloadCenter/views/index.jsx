import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message, Modal, Checkbox, Table } from 'antd';
import intl from 'react-intl-universal';
import XLSX from 'xlsx';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
import {bindActionCreators} from "redux";
import {asyncFetchDownloadCenterList,asyncFetchDownloadCenter} from "../actions";
import {connect} from "react-redux";
import Crumb from 'components/business/crumb';
import Pagination from 'components/widgets/pagination';
import Tip from 'components/widgets/tip';
import {reducer as downLoadCenterReducer} from "../index";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
const {Column} = Table;
const confirm = Modal.confirm;

class Index extends Component {

	state = {
	};


	componentDidMount() {
		this.loadData()
	}

	loadData =(params)=>{
        this.props.asyncFetchDownloadCenterList(params && params);
	}

    onPageInputChange = (page,perPage) => {
        this.loadData({page,perPage});
    };

	//前端下载的方法
	downLoad = (data)=>{
		let taskId = data.key;
		let fileName = data.taskName;
		let reportType = data.reportType;
		this.props.asyncFetchDownloadCenter({taskId:taskId,reportType:reportType},(file)=>{
            console.log(file,'file');
            if (file && file.retCode == 0) {
                let wb = XLSX.utils.book_new();
                wb.SheetNames.push("Sheet1");
                //需要对导出数据进行多语言处理
                let commonData = file.tableData||[];

                let singleData = commonData[0];
                for(let p=0;p<singleData.length;p++){
                    if(singleData[p].indexOf('.')>=0){
                        commonData[0][p] = intl.get(singleData[p])
                    }
                }
                let worksheet = XLSX.utils.aoa_to_sheet(commonData);
                wb.Sheets["Sheet1"] = worksheet;
                XLSX.writeFile(wb, fileName+'.xls');
            }else{
                message.error("发生未知异常！");
			}
		});
	}

	render() {
		const {downloadCenterList} = this.props;
		const downloadCenterListData = downloadCenterList.getIn(['data', 'data']);
		console.log(downloadCenterListData && downloadCenterListData.toJS(),'downloadCenterListData');
        let paginationInfo = downloadCenterList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
		const dataSource = downloadCenterListData && downloadCenterListData.map((item, index) => {
			return {
				key: item.get('taskId'),
				serial: index + 1,
				taskName: item.get('taskName'),
                addedName: item.get('addedName'),
                addedTime: item.get('addedTime'),
                taskStatus: item.get('taskStatus'),
                reportType: item.get('reportType'),
				action: item.get('taskId')
			}
		}).toJS();

		return (
            <React.Fragment>

                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "下载中心"
                        }
                    ]}/>
                </div>

			    <div className="content-index-bd">
                    <div className={cx("top-tip")}>
                       <Tip>下载中心保留近3天生成的文件</Tip>
					</div>
					<Table
						dataSource={dataSource}
						pagination={false}
						loading={downloadCenterList.get('isFetching')}
						className={cx("tb-aux")}
						scroll={{y: 518}}
					>
						<Column
							title={"序号"}
							dataIndex="serial"
							key="serial"
							width="10%"
						/>
						<Column
							title={"文件名"}
							dataIndex="taskName"
							key="taskName"
							width="40%"
						/>
						<Column
							title={"提取人"}
							dataIndex="addedName"
							key="addedName"
							width="10%"
							align="center"
						/>
                        <Column
                            title={"提取时间"}
                            dataIndex="addedTime"
                            key="addedTime"
                            width="15%"
                            align="center"
                            render={(date) => (
                                <span className="txt-clip">
                                    {date ? moment(date).format('YYYY-MM-DD HH:mm:SS') : null}
                               </span>
                            )}
                        />
                        <Column
                            title={"状态"}
                            dataIndex="taskStatus"
                            key="taskStatus"
                            width="15%"
                            align="center"
                            render={(status) => (
                                <span className="txt-clip">
                                    {status==1?"已完成":status==2?"生成失败":"生成中"}
                               </span>
                            )}
                        />
                        <Column
                            title={"操作"}
                            dataIndex="action"
                            key="action"
                            width="10%"
                            align="center"
                            render={(id,data) => (
                                <React.Fragment>
									{
										data.taskStatus == 1?(<span style={{cursor: "pointer",color:"blue"}} className="txt-clip" onClick={()=>this.downLoad(data)}>下载</span>):
											                 (<span style={{cursor: "pointer",color:"#d2d2d2"}} className="txt-clip">下载</span>)
									}
								</React.Fragment>
                            )}
                        />
					</Table>
					<div style={{height:"10px"}}></div>
                    <Pagination {...paginationInfo}
                                onChange={this.onPageInputChange}
                    />
				</div>

			</React.Fragment>
        );
	}
}

const mapStateToProps = (state) => {
	return {
        downloadCenterList: state.getIn(['downLoadCenterReducer', 'downloadCenterList'])
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
        asyncFetchDownloadCenterList,
        asyncFetchDownloadCenter
	}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
