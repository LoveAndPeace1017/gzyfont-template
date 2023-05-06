import React, {Component} from 'react';
import {Cascader} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import {asyncGetProvinceList} from '../actions'

class Area extends Component {

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

        const value = props.value || [];

        this.state = {
            value
        };
    }


    handleChange = (value, obj) => {

        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value, obj);
        }
    };

    displayRender = (label) => {
        return label.join(' ');
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncGetProvinceList();
    }


    render() {
        const {areaInfo} = this.props;
        let options = areaInfo.getIn(['areaList']);
        options = options ? options.toJS() : [];
        return (
            <Cascader
                value={this.state.value}
                options={options}
                displayRender={this.displayRender}
                onChange={this.handleChange} placeholder={this.props.placeholder?this.props.placeholder:'--请选择--'}/>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        areaInfo: state.getIn(['provinceAndCity', 'proviceAndCityInfo']),
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncGetProvinceList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Area)
