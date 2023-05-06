import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncAddProject, asyncFetchProjectList} from "../actions";

import {ProjectAdd} from 'pages/auxiliary/project';
import Auxiliary from 'pages/auxiliary';

const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import PropTypes from "prop-types";
const cx = classNames.bind(styles);

/**
 * 选择项目
 *
 * @visibleName SelectProject（选择项目）
 * @author guozhaodong
 *
 */
class SelectProject extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         */
        value: PropTypes.string,
        /**
         * 选中option的回调函数
         * @param {string} value 选择的值
         */
        onChange: PropTypes.func,
        /**
         * 暗注释
         * */
        placeholder: PropTypes.string,
        /**
         * 是否显示新建、管理操作
         * */
        showEdit: PropTypes.bool
    };

    static defaultProps = {
        placeholder: intl.get("auxiliary.project.select"),
        showEdit: false
    };

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                value: nextProps.value
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || undefined;

        this.state = {
            value,
            projectAddVisible: false,
        };
    }

    openModal = (type, auxiliaryKey, auxiliaryTabKey) => {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    };

    closeModal = (type) =>{
        this.setState({
            [type]: false
        })
    };

    handleChange = (value) => {

        if(!value){
            value = ''
        }

        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    };

    componentDidMount() {
        //初始化列表数据
        let params = {};
        if(this.props.showVisible){
            params.visibleFlag = true;
        }
        this.props.asyncFetchProjectList(params);
    }


    render() {
        const { projectList, showEdit, showSearch, showVisible} = this.props;
        const projectListData = projectList && projectList.getIn(['data', 'data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div>
                    <Select
                        allowClear
                        showSearch={showSearch || false}
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{minWidth: '200px'}}
                        placeholder={this.props.placeholder}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('projectAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'order', 'project')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            projectListData && projectListData.map(item => {
                                if(this.props.showVisible){
                                    if(item.get('visibleflag') === 0){
                                        return <Option key={item.get('recId')}
                                                       value={item.get('projectName')}>{item.get('projectName')}</Option>
                                    }
                                }else{
                                    return <Option key={item.get('recId')}
                                                   value={item.get('projectName')}>{item.get('projectName')}</Option>
                                }
                            })
                        }
                    </Select>
                </div>

                <ProjectAdd onClose={this.closeModal.bind(this, 'projectAddVisible')} visible={this.state.projectAddVisible} callback={(projectName) => {
                    this.props.asyncFetchProjectList({visibleFlag: showVisible}, () => {
                        this.handleChange(projectName);
                    });
                }}/>
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    defaultTabKey={this.state.auxiliaryTabKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.closeModal.bind(this, 'auxiliaryVisible')}
                />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        projectList: state.getIn(['auxiliaryProject', 'projectList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProjectList,
        asyncAddProject,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectProject)
