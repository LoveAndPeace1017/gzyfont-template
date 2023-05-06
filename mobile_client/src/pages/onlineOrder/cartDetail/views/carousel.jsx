import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            imgHeight: 250,
            slideIndex: 0,
        }
    }

    render() {
        const {images} = this.props;

        return (
            <div style={{position: 'relative',height: this.state.imgHeight}}>
                {
                    images && (
                        <Carousel autoplay={false} infinite afterChange={index => this.setState({slideIndex: index})}>
                            {
                                images.map((image, index) => (
                                    <a key={index}
                                       style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight,position: 'relative'}}
                                    >
                                        <img src={image.uri}
                                             alt=''
                                             style={{ width: '100%', verticalAlign: 'top' }}
                                             onLoad={() => {
                                                 window.dispatchEvent(new Event('resize'));
                                                 this.setState({ imgHeight: 'auto' });
                                             }}
                                        />
                                    </a>
                                ))
                            }
                        </Carousel>
                    )
                }
                {
                    images && (
                        <p className={cx('slider-amount')}><span className={cx('current-index')}>{this.state.slideIndex + 1}</span>/{images.length}</p>
                    )
                }
            </div>
        )
    }
}