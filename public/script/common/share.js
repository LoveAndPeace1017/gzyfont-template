
function getSignature({title, imgUrl, desc, link}) {
    $.get("/wxRequest/getSignature", {"url": location.href.split('#').toString()}).done(function (data) {
        // 注意这里的url，一定要这样写，也就是动态获取，不然也不会成功的。
        if (data.retCode===0) {
            var wx_info = data.data;
            if (wx_info.signature != null) {
                // 配置
                wx.config({
                    debug: false,   // 测试阶段，可以写为true，主要是为了测试是否配置成功
                    appId: wx_info.appId,
                    timestamp: wx_info.timestamp,
                    nonceStr: wx_info.nonceStr,
                    signature: wx_info.signature,
                    jsApiList: ['checkJsApi', 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
                });

                // 分享给朋友、QQ、微博
                var shareData = {
                    "imgUrl": imgUrl,
                    "title": title,
                    "desc": desc,
                    'link': link
                };
                // 分享到朋友圈
                var shareToTimeline = {
                    "imgUrl": imgUrl,
                    "title": title,
                    'link': link,
                    "desc": desc
                };
                wx.ready(function() {
                    wx.onMenuShareTimeline(shareToTimeline);
                    wx.onMenuShareAppMessage(shareData);
                    wx.onMenuShareQQ(shareData);
                    wx.onMenuShareQZone(shareData);
                    wx.updateAppMessageShareData(shareData);
                    wx.updateTimelineShareData(shareData);

                    wx.error(function(res) {
                        console(res.errMsg);
                    });
                });

                wx.checkJsApi({
                    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function(res) {
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                        console.log(JSON.stringify(res.checkResult));
                    }
                });
            }
        }
    }).fail(function (msg) {
        console.log("error:" + msg);
    });
}
