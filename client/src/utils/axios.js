import React, {Component} from 'react'
import IntlTranslation from 'utils/IntlTranslation'
import axios from 'axios';
import {Modal} from "antd";
import Icon from 'components/widgets/icon';
import {getCookie} from 'utils/cookie';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
//新建了一个axios的实例
const ajax = axios.create({
    headers:{
        'x-csrf-token': getCookie('csrfToken')
    }
});
var modal = {closed: true};

//增加了响应数据的拦截，当请求响应登录超时的时候，给页面一个弹层提醒
ajax.interceptors.response.use(function(response){
    /**
     *  retCode: 3 token失效或超时
     *  retCode: 1003 用户多人登录被踢
     */
    if(response.data && modal.closed){
        if(response.data.retCode === '3' || response.data.retCode === '1003' || response.data.retCode === '1023'){
            var title =  '提示', content = '登录超时，请重新登录';
            modal.closed = false;
            if(response.data.retCode === '1003'){
                title = <IntlTranslation intlKey = "home.account.rule5"/>;
                content = <IntlTranslation intlKey = "home.account.rule6"/>;
            }
            if(response.data.retCode === '1023'){
                title = "提示";
                content = response.data.retMsg;
            }
            Modal.warning({
                title: title,
                icon: <ExclamationCircleOutlined/>,
                content: content,
                onOk: function(){
                    modal.closed = true;
                    window.location.href = '/logout/'
                }
            });
        }
        //如果主账号状态码是1005，则给出弹框提示vip到期，并退出登录， 2010为子账号的的状态码
        if(response.data.retCode === '1005' || response.data.retCode === '2010'){
            var title =  '提示';
            let content = (<div>
                <p>您的主账号：{getCookie('mainUserName')}  服务已到期，无法进行操作，可续约后继续使用。</p>
                <p>详询客服：400-6979-890（转1）或</p>
                <p style={{paddingLeft:65}}>18402578025（微信同号）</p>
                <p><a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">立即续约</a></p>
            </div>);
            if(response.data.retCode === '2010'){
                content = (<div>
                    <p>子账号已到期，无法进行操作，可续约后继续使用。</p>
                    <p>详询客服：400-6979-890（转1）或</p>
                    <p style={{paddingLeft:65}}>18402578025（微信同号）</p>
                    <p><a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">立即续约</a></p>
                </div>);
            }
            modal.closed = false;
            Modal.warning({
                title: title,
                icon: <ExclamationCircleOutlined/>,
                content: content,
                onOk: function(){
                    modal.closed = true;
                    window.location.href = '/logout/'
                }
            });
        }
        //
        if(response.data.errorPlateForm && (response.data.retCode === '30' || response.data.retCode === '10')){
            Modal.warning({
                title: '提示',
                icon: <ExclamationCircleOutlined/>,
                content: response.data.retMsg,
                onOk: function(){
                    modal.closed = true;
                    window.location.href = '/logout/trace'
                }
            });
        }
    }
    return response;

}, function(){
    return Promise.reject(error);
});

export default ajax;