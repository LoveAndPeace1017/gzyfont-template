$(function() {
    $(document).ready(function(){

        //模块2功能
        var slide = $('.features-lst');
        var clone =  slide.find('li').first().clone();
        slide.append(clone);
        //圆点随图片数量动态生成
        var dot = $('.features-menu').find('li');
        dot.first().addClass('current');

        //鼠标点击事件
        dot.hover(function(){
            var index = $(this).index();
            slide.stop().animate({left:-(index*1190)},500)
            dot.eq(index).addClass('current').siblings().removeClass('current');
        })

    });

   /* $(document).scroll(function() {
        var scroH = $(document).scrollTop();  //滚动高度
        if(scroH >1705){
            $('.js-op-hd-4st').css('position','relative');
        }else{
            $('.js-op-hd-4st').css('position','fixed');
        }
    });*/
})