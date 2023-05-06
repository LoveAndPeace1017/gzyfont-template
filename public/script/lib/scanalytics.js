/**
 * @author wangmei 2021/02/05
 * 神策统计
 */
(function(para) {
    var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
    if(typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
    return false;
}
    w['sensorsDataAnalytic201505'] = n;
    w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
    var ifs = ['track','quick','register','registerPage','registerOnce','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus'];
    for (var i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
}
    if (!w[n]._t) {
    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
    x.async = 1;
    x.src = p;
    x.setAttribute('charset','UTF-8');
    w[n].para = para;
    y.parentNode.insertBefore(x, y);
}
})({
    sdk_url: 'https://static.sensorsdata.cn/sdk/1.16.3/sensorsdata.min.js',
    name: 'sensors',
    server_url: 'https://fa.micstatic.com/sc/sa?project=abiz',
    heatmap:{scroll_notice_map:'not_collect'},
    is_track_single_page:true
});
sensors.registerPage({
    platform_type: '4',   //1:PC端，2:触屏端，3:百卓官网，4:进销存
    sdk: '进销存'
});
sensors.quick('autoTrack');
