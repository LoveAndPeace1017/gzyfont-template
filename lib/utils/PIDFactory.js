const moment = require('moment');
const Buffer = require('buffer/').Buffer;
const Constants = require('../constants');

let generatePID = function(req){
    let str,ip,date,random;
    ip = req.realIp;
    date = new moment(new Date()).format('YYYYMMDDHHmmssSSS');
    random = Math.ceil(Math.random()*100000000);
    str = Buffer.from(ip+date+random).toString('base64');
    str = str.split('=')[0];
    str = str.slice(1)+str.substr(0,1);
    return str;
};
module.exports = {
    createPID:function(req,res){
        const COOKIE_DOMAIN = req.headers.host;
        let pid = req.cookies.pid;
        if(!pid){
            pid = generatePID(req);
            res.cookie('pid',pid,{domain:COOKIE_DOMAIN,httpOnly: false, maxAge: Constants.COOKIE_MAX_AGE, sameSite: false});
        }
    }
};