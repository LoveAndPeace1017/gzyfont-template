import React,{Component} from 'react';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {getCookie} from 'utils/cookie';
import axios from 'utils/axios';

const cx = classNames.bind(styles);

class Wxacode extends Component{
    constructor(props){
        super(props);
        this.state = {
            appid:getCookie('appid'),
            secret:getCookie('secret'),
            accessToken:getCookie('accessToken'),
        }
    }
    getCode = ()=>{
        let params = {
            scene:'a=1'
        };
        let arr = ['scene', 'page', 'width', 'auto_color', 'line_color', 'is_hyaline'];
        arr.forEach((prop)=>{
            if(this.props[prop]){
                params[prop] = this.props[prop];
            }
        });

        return this.getAccessToken().then((accessToken)=>{
            return  axios.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`,params)
                .then(res=>{
                    if(res.errcode){
                        return Promise.reject(res.errmsg);
                    }else{
                        return 'data:image/png;base64,'+res;
                    }
                }).catch(err=>{
                    return Promise.reject(err);
                });
        }).catch(err=>{
            return Promise.reject(err);
        });


    };
    getAccessToken = ()=>{
        let {appid,secret} = this.props;
        let accessToken = '';
        if(!appid){
            accessToken = getCookie('accessToken');
            if(accessToken){
                return Promise.resolve(accessToken);
            }else{
                appid = getCookie('appid');
                secret = getCookie('secret');
            }
        }
        return axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
            .then(res=>{
                if(res.errcode==0){
                    return Promise.resolve(res.access_token);
                }else{
                    return Promise.reject(res.errmsg);
                }
            }).catch(err=>{
                return Promise.reject(err);
            });
    };

    componentDidMount() {
        this.getCode().then((url) => {
            this.setState({
                imageUrl:url
            });
        }).catch(err => {
            this.setState({
                error:err
            });
        });
    }

    render(){
        return (
          <div style={{display:this.props.visible?'block':'none'}}>
              {
                  this.state.imgUrl?
                      <img src={this.state.imgUrl} alt="" width={this.props.width?this.props.width:'200'}/>:
                      <span>{this.state.error}</span>
              }
          </div>
        );
    }
}
export default Wxacode;