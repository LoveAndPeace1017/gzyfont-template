import React from 'react'
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import zhTW from 'antd/lib/locale-provider/zh_TW';
import enUS from 'antd/lib/locale-provider/en_US';
import {emit} from 'utils/emit';

import intl from 'react-intl-universal';
import {closest} from 'utils/dom';
import {getCookie,setCookie,setDomainCookie} from 'utils/cookie';

const locales = {
    'enUS': require('./utils/json/en-US.json'),
    'zhCN': require('./utils/json/zh-CN.json'),
    'zhTW': require('./utils/json/zh_TW.json'),
};


const globalConfig ={
    autoInsertSpaceInButton: true, //按钮中 2 个汉字之间的空格
    getPopupContainer: (triggerNode)=>{
        //防止下拉框因滚动条滚动不跟随滚动问题，如果元素在contentWrap下面，则把其渲染父节点变成contentWrap
        if(triggerNode && closest(triggerNode, '#contentWrap')){
            return document.getElementById('contentWrap');
        }
        return document.body;
    }
};

class I18n extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            antdLang: zhCN,  // 修改antd  组件的国际化
            initDone: false
        }
    }

    componentDidMount() {
        // 监听语言改变事件
        emit.on('change_language', (lang)=> {
            this.setState({
                initDone: false
            },()=>{
                this.loadLocales(lang);
            });

        });
        let language = getCookie('language');
        // 初始化语言
        this.loadLocales(language || "zhCN");
    }

    loadLocales(lang = 'zhCN') {

        intl.init({
            currentLocale: lang,  // 设置初始语音
            locales,
        }).then(() => {
            this.setState({
                antdLang: lang === 'zhCN' ? zhCN : (lang === 'zhTW'? zhTW : enUS),
                initDone: true
            });
        });
    }

    render () {
        return this.state.initDone &&
        <ConfigProvider locale={this.state.antdLang}>
            <ConfigProvider {...globalConfig}>
                {this.props.children}
            </ConfigProvider>
        </ConfigProvider>;
    }
}

export default I18n;