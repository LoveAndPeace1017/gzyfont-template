$(function(){

    function copyText() {
        var inputFocus = document.getElementById('copyArea');
        inputFocus.focus();
        inputFocus.select();
        // 当没有值的时候，手机上获取焦点全选，某些情况下可能有问题，目前没有复现
        var valueLen = inputFocus.value.length;
        /*
        * 当type=number时，在谷歌模拟器里面会直接报错误，因为这种类型不支持selectionStart,
        * 但在有些安卓手机浏览器中不行，检测inputFocus.selectionStart会为true，设置的时候会报错，
        * 所以前面的select()方法还是必要的。
        */
        try {
          if (inputFocus.selectionStart && valueLen) {
            inputFocus.selectionStart = 0;
            inputFocus.selectionEnd = valueLen;
          }
        } catch(e) {
          console.info(e)
        } 
        document.execCommand('Copy');

        return false;
    }

    document.querySelector('.js-invite-join').ontouchend = function(e) {
        copyText();
        $('#tip').show();
        setTimeout(function () {
            $('#tip').hide();
        }, 3000);
    };
});