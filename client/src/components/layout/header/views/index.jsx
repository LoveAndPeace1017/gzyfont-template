import React, { Component } from 'react';
import {Layout,Select} from "antd";
const { Option } = Select;
import {Link} from 'react-router-dom';
import ToolBar from '../dependencies/toolbar';
import Icon from 'components/widgets/icon';
import logo from '../images/logo_new.png';
import dz_logo_01 from '../images/yuanzheng.png';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {getCookie,setCookie,setDomainCookie} from 'utils/cookie';
import {emit} from 'utils/emit';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const AntdHeader = Layout.Header;
import {AddPkgOpen} from 'components/business/vipOpe';
import arrow from 'images/arrow-down.png';
import {asyncFetchSwitchLanguage} from '../../../../pages/vipService/actions';
const cx = classNames.bind(styles);
import {actions as commonActions} from 'components/business/commonRequest/index';

const COMPANY_MAP = {
    yuanzheng: {
        logo: dz_logo_01
    }
};

/**
 * 头部
 *
 * @visibleName Header（头部）
 * @author guozhaodong
 *
 */
class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			showFavoritePop:false,
			lang: 'zhCN'
		}
	}

	componentDidMount() {
		let favoriteCookieFlag = getCookie('favoritePop');
		let _this = this;
		this.props.isPopShow({
			clickSource:'favorite',
			isClick:'0'
		},(res)=>{
			if(res.data == '0' && favoriteCookieFlag !=1){
				_this.setState({
					showFavoritePop:false
				});
			}
		});
        document.onclick=this.handleHide;

        this.initLanguage();

	}

	initLanguage = () =>{
        let language = getCookie('language');
        this.setState({
            lang:language
        });
	}

	addToFavorite = ()=>{
		if ('sidebar' in window && 'addPanel' in window.sidebar) {
			window.sidebar.addPanel(location.href,"百卓优采","");
		} else if( /*@cc_on!@*/false) { // IE Favorite
			window.external.AddFavorite(location.href,"百卓优采");
		} else { // webkit - safari/chrome
			alert('请按 ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D 将页面加入收藏夹');
		}
		this.props.isPopShow({
			clickSource:'favorite',
			isClick:'1'
		});
	};
	closeFavoritePop = ()=>{
		setCookie('favoritePop',1);
		this.setState({
			showFavoritePop:false
		});
	};

    handleChange(val) {
    	this.setState({
			lang:val
		});
        this.props.asyncFetchSwitchLanguage({configValue:val});
        setDomainCookie('language',val);
		// 发送消息
		emit.emit('change_language', val);
    }

    handleShow(e){
        e.nativeEvent.stopImmediatePropagation();
    	let dom = document.getElementById("language-option");
    	let style = dom.style.display;
    	if(style == "block"){
            dom.style.display = "none";
		}else{
            dom.style.display = "block";
		}
	}

    handleHide(){
        let dom = document.getElementById("language-option");
        let style = dom.style.display;
        style == "block" && (dom.style.display = "none");
	}

	render() {
        let dzCompanyName = getCookie('dzCompanyName');

        return(
			<AntdHeader className={cx('header')}>
				<h1 className={cx('logo')}>
					<Link to="/home">
						{
                            dzCompanyName && dzCompanyName !== 'undefined' ? (
                                <img src={COMPANY_MAP[dzCompanyName].logo} alt="百卓优采云进销存" />
							) : (
                                <img src={logo} alt="百卓优采云进销存" />
							)
						}

					</Link>
				</h1>
				<div className={cx("add-favorite")} style={{display:this.state.showFavoritePop?'block':'none'}}>
					<Icon type="close" onClick={this.closeFavoritePop}/>
					<p>点击后则将“erp.abiz.com”地址<br />添加至浏览器收藏夹</p>
					<a href="#!" onClick={this.addToFavorite}  rel="sidebar">添加至收藏夹</a>
				</div>
				<ToolBar/>
                <div className={cx("language-c")}>
					{/*<Select style={{width:"120px"}} size={"large"} value={this.state.lang} onChange={this.handleChange.bind(this)}>
						<Option value="zhCN">中文</Option>
						<Option value="enUS">English</Option>
						<Option value="zhTW">繁體</Option>
					</Select>*/}
					<div className={cx("language-selected")} onClick={this.handleShow.bind(this)}>
						{
						   this.state.lang == "enUS"?"English":(this.state.lang == "zhTW"?"繁體":"简体中文")
					     }
                        <img src={arrow} alt="tp" style={{marginLeft: "6px"}}/>
					 </div>
					<ul id={"language-option"} className={cx("language-ul")} style={{display:"none"}}>
                        <AddPkgOpen
                            onTryOrOpenCallback={()=>this.handleChange("zhCN")}
                            source={'multiLanguage'}
                            render={() => (
                                <li style={{marginBottom: "14px"}}>简体中文</li>
                            )}
                        />
                        <AddPkgOpen
                            onTryOrOpenCallback={()=>this.handleChange("enUS")}
                            source={'multiLanguage'}
                            render={() => (
                                <li>English</li>
                            )}
                        />
						{/*<AddPkgOpen
                            onTryOrOpenCallback={()=>this.handleChange("zhTW")}
                            source={'multiLanguage'}
                            render={() => (
                                <li>繁體</li>
                            )}
						/>*/}
					</ul>
				</div>
			</AntdHeader>
		)
	}
}
const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		isPopShow: commonActions.isPopShow,
        asyncFetchSwitchLanguage:asyncFetchSwitchLanguage
	}, dispatch)
};
export default connect(null,mapDispatchToProps)(Header);
