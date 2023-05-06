import React, {Component} from 'react';
import Icon from 'components/widgets/icon';

import classNames from 'classnames/bind';
//import styles from '../styles/index.scss';

//const cx = classNames.bind(styles);

export default class BatchPopTitle extends Component {
    render() {
        return (
            <div>
                <strong>{this.props.title}</strong>
                <Icon type="info-circle" style={{fontSize: '14px', marginLeft: '40px', marginRight: '8px', color: '#1890ff'}}/>
                <span style={{
                    fontSize: '14px',
                    fontWeight: 'normal',
                    color: '#666'
                }}>{this.props.infoTip}</span>
            </div>
        );
    }
}

