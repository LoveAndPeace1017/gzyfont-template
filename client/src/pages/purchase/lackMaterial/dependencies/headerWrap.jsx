import React, {Component} from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button } from 'antd';
import Icon from 'components/widgets/icon';
import classNames from "classnames/bind";
import styles from '../styles/index.scss';

const cx = classNames.bind(styles);

export default class HeaderWrap extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {title, titleDetail, btnTitle, btnIcon, onChange} = this.props;

        return (
            <React.Fragment>
                <div className={cx('lm-header-wrap')}>
                    <div className={cx('lm-title')}>{title}</div>
                    {
                        titleDetail && (
                            <div className={cx('lm-title-detail')}>
                                <Icon type="exclamation-circle" theme={'filled'} style={{marginRight: '6px', color:'#0066DD'}}/>{titleDetail}
                            </div>
                        )
                    }
                    {
                        btnTitle && (
                            <Button type="primary" icon={<LegacyIcon type={btnIcon} />} className={cx('lm-btn')} onClick={() => onChange()}>{btnTitle}</Button>
                        )
                    }
                </div>
            </React.Fragment>
        );
    }
}