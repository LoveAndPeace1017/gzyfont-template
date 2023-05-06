import React, { Component } from 'react';
import _ from 'lodash';

import Icon from 'components/widgets/icon';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import prodImg380 from 'images/prodImg380.png';
import {LeftOutlined} from '@ant-design/icons';
import {RightOutlined} from '@ant-design/icons';



const cx = classNames.bind(styles);

// jquery offset原生实现
function offset(target) {
    var top = 0,
        left = 0

    while(target.offsetParent) {
        top += target.offsetTop
        left += target.offsetLeft
        target = target.offsetParent
    }

    return {
        top: top,
        left: left,
    }
}

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            containerStyle: {},
            thumbGroupLength: 0,
            mouseEnterIndex: -1,
            xRatio: 2,
            yRatio: 2,
            targetWidth: 0,
            targetHeight: 0,
            offsetTop: 0,
            offsetLeft: 0
        };
    }
    componentDidMount() {
        this.props.imgInfoWrap && this.setState({thumbGroupLength: Math.ceil(this.props.imgInfoWrap.length/5)});
    };
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        nextProps.imgInfoWrap && this.setState({thumbGroupLength: Math.ceil(nextProps.imgInfoWrap.length/5)});
    }
    //产品没要求图片大小，所以init方法暂时不用
    // init = ($source, $target, img) => {
    //     this.setState({
    //         targetWidth: $target.outerWidth,
    //         targetHeight: $target.outerHeight,
    //         sourceWidth: $source.outerWidth,
    //         sourceHeight: $source.outerHeight,
    //         xRatio: (img.width - $target.outerWidth) / $source.outerWidth,
    //         yRatio: (img.height - $target.outerHeight) / $source.outerHeight,
    //         offsetTop: $source.offsetTop,
    //         offsetLeft: $source.offsetLeft
    //     })
    // };

    move = (e, top, left, img) => {
        let {  xRatio, yRatio } = this.state;
        (typeof top == 'string') && (top.indexOf('px') !== -1)  && (top = top.split('px')[0] * 1);
        (typeof left == 'string') && (left.indexOf('px') !== -1) && (left = left.split('px')[0] * 1);
        let targetTop = Math.max(Math.min(top, 380), 0);
        let targetLeft = Math.max(Math.min(left, 380), 0);

        img.style.left = (targetLeft * - xRatio) + 'px';
        img.style.top = (targetTop * - yRatio) + 'px';
    };

    handMouseEnter = () => {
        let maskDiv = document.getElementById('mask');
        let targetDiv = document.getElementById('target');
        maskDiv.style.display = 'block';
        targetDiv.style.display = 'block';
    };

    handMouseLeave = () => {
        let maskDiv = document.getElementById('mask');
        let targetDiv = document.getElementById('target');
        maskDiv.style.display = 'none';
        targetDiv.style.display = 'none';
    };

    dealPosition = (oEvent, maskDiv, mScrollLeft, scrollLeft, sourceScrollLeft) => {
        if (mScrollLeft < sourceScrollLeft + 90) {
            maskDiv.style.left = 0 + 'px';
        }
        if (mScrollLeft > sourceScrollLeft + 290) {
            maskDiv.style.left = 200 + 'px';
        }
        if (mScrollLeft >= sourceScrollLeft + 90 && mScrollLeft <= sourceScrollLeft + 290) {
            maskDiv.style.left = oEvent.clientX + scrollLeft - sourceScrollLeft - 90 + 'px';
        }
    };

    handleMouseMove = (e) => {
        let oEvent = e || event;
        let maskDiv = document.getElementById('mask');
        let rootSourceDiv = document.getElementById('rootSource');
        let targetImg = document.getElementById('target').querySelector('img');

        // let sourceScrollTop = rootSourceDiv.offsetTop;
        let sourceScrollTop = offset(rootSourceDiv).top;
        // let sourceScrollLeft = rootSourceDiv.offsetLeft;
        let sourceScrollLeft = offset(rootSourceDiv).left;
        console.log('sourceScrollTop:'+ sourceScrollTop, 'sourceScrollLeft:' + sourceScrollLeft)

        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

        let mScrollTop = oEvent.clientY + scrollTop;
        let mScrollLeft = oEvent.clientX + scrollLeft;

       if (mScrollTop < sourceScrollTop + 90) {
            maskDiv.style.top = 0 + 'px';
            this.dealPosition(oEvent, maskDiv, mScrollLeft, scrollLeft, sourceScrollLeft);
            this.move(e, 0, maskDiv.style.left, targetImg);
        } else if (mScrollTop > sourceScrollTop + 290) {
            maskDiv.style.top = 200 + 'px';
            this.dealPosition(oEvent, maskDiv, mScrollLeft, scrollLeft, sourceScrollLeft);
            this.move(e, 200, maskDiv.style.left, targetImg);
        } else if (mScrollTop >= sourceScrollTop + 90 && mScrollTop <= sourceScrollTop + 290) {
            maskDiv.style.top = oEvent.clientY + scrollTop - sourceScrollTop - 90 + 'px';
            this.dealPosition(oEvent, maskDiv, mScrollLeft, scrollLeft, sourceScrollLeft);
            this.move(e, maskDiv.style.top, maskDiv.style.left, targetImg);
        }
    };

    sliderLeft = () => {
        this.state.currentIndex > 0 && this.setState(prevState => ({
            containerStyle: { transitionDuration: '500ms', transform: 'translate3d('+ -350*(prevState.currentIndex - 1)+'px, 0, 0)'},
            currentIndex: prevState.currentIndex - 1,
        }))
    };
    sliderRight = () => {
        this.state.currentIndex < (this.state.thumbGroupLength - 1)  && this.setState(prevState => ({
            containerStyle: { transitionDuration: '500ms', transform: 'translate3d('+ -350*(prevState.currentIndex + 1)+'px, 0, 0)'},
            currentIndex: prevState.currentIndex + 1
        }))
    };

    changeProd  = _.throttle(function (index) {
        this.setState({mouseEnterIndex: index});
        document.getElementById('source').querySelector('img').src = this.props.imgInfoWrap[index].uri;
        document.getElementById('target').querySelector('img').src = this.props.imgInfoWrap[index].uri;
    }, 200);

    handleEnter = (index) => {
        this.changeProd(index);
    };

    render() {
        const {currentIndex, containerStyle, thumbGroupLength, mouseEnterIndex} = this.state;
        const {imgInfoWrap, isGoods} = this.props;
        return (
            <React.Fragment>
                <div className={cx(["content-lt", {"from-goods": isGoods === true}])} id="rootSource">
                    <div className={cx("tab-pane")}>
                        <div className={cx(["vertical-img", "source-img"])} id="source" style={{position: 'relative'}}>
                            {
                                (imgInfoWrap && imgInfoWrap.length > 0) ?
                                    (
                                        <a href="#!" className={cx("box-img")}>
                                            <img src={
                                                imgInfoWrap && imgInfoWrap[0] && imgInfoWrap[0].uri
                                            } alt=""/>
                                            {/*<i className={cx("zoom-mask")} id="mask"/>*/}
                                        </a>
                                    ) : (
                                        <img src={prodImg380} alt=""/>
                                    )
                            }
                        </div>
                    </div>

                    {
                        (imgInfoWrap && imgInfoWrap.length > 0) && (
                            <div className={cx("tab-content")} >
                                <a href="#!" className={cx(["paging", {"arrowStyle": currentIndex === 0}])} onClick={() => {this.sliderLeft()}}>
                                    <LeftOutlined className={cx(["icon-arrow-large", "icon-arrow-left"])} style={{float: 'left'}}/>
                                </a>
                                <div className={cx("tab-content-container")}>
                                    <ul className={cx("nav-tabs")} style={containerStyle}>
                                        {
                                            imgInfoWrap && imgInfoWrap.map((item, index) => {
                                                return (
                                                    <li className={cx(["tab-trigger", {"active": mouseEnterIndex === index}])} key={index} onMouseEnter={() => this.handleEnter(index)}>
                                                        <div className={cx("vertical-img")}>
                                                            <a href="#!" className={cx("box-img")}>
                                                                <img src={item.thumbnailUri} alt="" />
                                                            </a>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <a href="#!" className={cx(["paging", "next", {"arrowStyle": currentIndex === (thumbGroupLength -1)}])} onClick={() => this.sliderRight()}>
                                    <RightOutlined className={cx(["icon-arrow-large", "icon-arrow-right"])}  style={{float: 'left'}}/>
                                </a>
                            </div>
                        )
                    }

                  {/*  <div className={cx(["tab-pane", "target-pane"])} id="target">
                        <div className={cx(["vertical-img", "target-img"])} >
                            <img src={
                                imgInfoWrap && imgInfoWrap[0] && imgInfoWrap[0].uri
                            } alt=""/>
                        </div>
                    </div>*/}

                </div>
            </React.Fragment>
        )
    }
}

export default Carousel
