// define(['./mc_base'], function(MCBASE){

/*
 * 医疗可视化平台-固定表头表格
 * date：20this.scrollbarWidth-01-04
 * 
 */
var FixedHeadTable = function() {
    if (!(this instanceof FixedHeadTable)) {
        return new FixedHeadTable();
    }
}

var template =  '<div class="fixedHeadTable">' +
                    '<div class="transverseRollingWrap">' +
                    '</div>' +
                    '<div class="topLeftFixedWrap zIndex30 fixedWrap">' +
                        '<table class="topLeftFixed">' +
                        '</table>' +
                    '</div>' +
                    '<div class="topRightFixedWrap zIndex30 rightFixedWrap fixedWrap">' +
                        '<table class="topRightFixed">' +
                        '</table>' +
                    '</div>' +
                    '<div class="topMiddleFixedWrap zIndex20 fixedWrap">' +
                        '<table class="topMiddleFixed">' +
                        '</table>' +
                    '</div>' +
                    '<div class="middleLeftFixedWrap zIndex20 fixedWrap">' +
                        '<table class="middleLeftFixed">' +
                        '</table>' +
                    '</div>' +
                    '<div class="middleRightFixedWrap zIndex20 rightFixedWrap fixedWrap">' +
                        '<table class="middleRightFixed">' +
                        '</table>' +
                    '</div>' +
                    '<div class="bottomLeftFixedWrap zIndex30 fixedWrap">' +
                        '<table class="bottomLeftFixed">' +
                        '</table>' +
                    '</div>' +
                    '<div class="bottomMiddleFixedWrap zIndex20 fixedWrap">' +
                        '<table class="bottomMiddleFixed">' +
                        '</table>' +
                    '</div>' +
                    '<div class="bottomRightFixedWrap zIndex30 rightFixedWrap fixedWrap">' +
                        '<table class="bottomRightFixed">' +
                        '</table>' +
                    '</div>' +
                '</div>';

FixedHeadTable.prototype = $.extend(new E_Base(), {
    init: function(cfg) {
        cfg = cfg || {};
        cfg.option = cfg.option || {};
        this.prefixClass = cfg.option.prefixClass || null;
        this.scrollbarWidth = 10;
        this.setOption(cfg.option);
        if (cfg.dom) {
            this.setDom(cfg.dom);
        }
        if (cfg.clickCallback) {
            this.setClickCallback(cfg.clickCallback);
        }
        this.render();
        this.bindEvent();
    },
    setDom: function(dom) {
        this.wrap = this._setDom(dom);
        if (!this.wrap || !this.wrap.length) {
            console.log('配置项缺失');
            return false;
        }
        if (this.prefixClass && this.prefixClass != '') {
            this.wrap.addClass(this.prefixClass);
        }
    },
    setOption: function(option) {
        // option = _.defaults( option, this.defaultOption );
        option = $.extend(true, this.defaultOption, option);
        this.option = $.extend(this.option, option);
        this.setData(option.data);
    },
    setData: function(data) {
        data = data || {};
        this.option.data = $.extend(this.option.data, data);
        this.formerData = $.extend(true, {}, this.option.data);
    },
    setClickCallback: function(fn, layout, qlik) {
        this.clickCallback = fn || null;
        this.yjslayout = layout;
        this.yjsqlik = qlik;
    },
    bindEvent: function() { 
        var self = this;
        var data = self.option.data;
        this.wrap.off()
            .on('click', '.wrap', function(ev) {
                ev.stopPropagation();
            })
        $('.transverseRollingWrap').off().on('scroll', function(){
            self.wrap.find('.middleLeftFixed').css('margin-top', -$(this).scrollTop() + 'px');
            self.wrap.find('.middleRightFixed').css('margin-top', -$(this).scrollTop() + 'px');
            self.wrap.find('.topMiddleFixed').css('margin-left', -$(this).scrollLeft() + 'px');
            self.wrap.find('.bottomMiddleFixed').css('margin-left', -$(this).scrollLeft() + 'px');
        })
    },
    // 
    initHtml: function(data){
        this.wrap.html(template);
        $transverseRollingWrap = $('.transverseRollingWrap');
        $transverseRollingWrap.html(data.html);
        this.assembleHtml($transverseRollingWrap.children().html());
        this.setBgColor();
    },
    assembleHtml: function(temp){
        var fixed = this.option.data.fixed;
        if(fixed.top && fixed.left){
            this.partAssembleHtml($('.topLeftFixed'), {rows: fixed.top, cols: fixed.left}, 'topLeft', temp);
        }
        if(fixed.top && fixed.right){
            this.partAssembleHtml($('.topRightFixed'), {rows: fixed.top, cols: fixed.right}, 'topRight', temp);
        }
        if(fixed.top){
            this.partAssembleHtml($('.topMiddleFixed'), {rows: fixed.top}, 'topMiddle', temp);
        }
        if(fixed.bottom){
            this.partAssembleHtml($('.bottomMiddleFixed'), {rows: fixed.bottom}, 'bottomMiddle', temp);
        }
        if(fixed.left){
            this.partAssembleHtml($('.middleLeftFixed'), {left: fixed.left}, 'middleLeft', temp);
        }
        if(fixed.right){
            this.partAssembleHtml($('.middleRightFixed'), {right: fixed.right}, 'middleRight', temp);
        }
        if(fixed.bottom && fixed.left){
            this.partAssembleHtml($('.bottomLeftFixed'), {rows: fixed.bottom, cols: fixed.left}, 'bottomLeft', temp);
        }
        if(fixed.bottom && fixed.right){
            this.partAssembleHtml($('.bottomRightFixed'), {rows: fixed.bottom, cols: fixed.right}, 'bottomRight', temp);
        }
    },
    partAssembleHtml: function($obj, nc, flag, temp){
        $obj.html(temp);
        if(flag == 'middleRight' && this.wrap[0].offsetHeight >= $obj[0].offsetHeight){
            $obj.parent().css('right', 0);
        }
        if(flag == 'bottomMiddle' && this.wrap[0].offsetWidth >= $obj[0].offsetWidth){
            $obj.parent().css('bottom', 0);
        }
        if(_.indexOf(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'], flag) > -1 && (this.wrap[0].offsetHeight >= $obj[0].offsetHeight || this.wrap[0].offsetWidth >= $obj[0].offsetWidth)){
            $obj.addClass('noDisplay');
            return;
        }
        if(_.indexOf(['topMiddle', 'bottomMiddle'], flag) > -1 && this.wrap[0].offsetHeight >= $obj[0].offsetHeight){
            $obj.addClass('noDisplay');
            return;
        }
        if(_.indexOf(['middleLeft', 'middleRight'], flag) > -1 && this.wrap[0].offsetWidth >= $obj[0].offsetWidth){
            $obj.addClass('noDisplay');
            return;
        }
        $obj.removeClass('noDisplay');
        this.splitDomByNumClass($obj.find('tr'), nc, flag);
        /*if(this.wrap.height() >= $obj.height()){
            $obj.addClass('noDisplay');
        }else{
            $obj.removeClass('noDisplay');
            this.splitDomByNumClass($obj.find('tr'), nc, flag);
        }*/
    },
    // 根据数字或类来拆分table，隐藏该隐藏的部分
    splitDomByNumClass: function(dom, nc, flag){
        switch (flag){
            case 'topRight':
            case 'topLeft': 
               $.each(dom, function(idx, item){
                   if(idx > nc.rows - 1){
                       ($(item).find('td')).addClass('invisible');
                   }else{
                       $.each($(item).find('td'), function(jdx, jtem){
                           if(_.isString(nc.cols)){
                               !$(jtem).hasClass(nc.cols) ? $(jtem).addClass('invisible') : (flag == 'topLeft' ? $(jtem).addClass('topLeftBg') : $(jtem).addClass('topRightBg'));
                           }else{
                                flag == 'topLeft' && (jdx > nc.cols - 1 ? $(jtem).addClass('invisible') : $(jtem).addClass('topLeftBg'));
                                flag == 'topRight' && (jdx + nc.cols < $(item).find('td').length ? $(jtem).addClass('invisible') : $(jtem).addClass('topRightBg'));
                           }
                       })
                   }
               })
               break;
            case 'bottomRight':
            case 'bottomLeft': 
               $.each(dom, function(idx, item){
                   if(idx + nc.rows < dom.length){
                       ($(item).find('td')).addClass('invisible');
                   }else{
                       $.each($(item).find('td'), function(jdx, jtem){
                           if(_.isString(nc.cols)){
                               !$(jtem).hasClass(nc.cols) ? $(jtem).addClass('invisible') : (flag == 'bottomLeft' ? $(jtem).addClass('bottomLeftBg') : $(jtem).addClass('bottomRightBg'));
                           }else{
                                flag == 'bottomLeft' && (jdx > nc.cols - 1 ? $(jtem).addClass('invisible') : $(jtem).addClass('bottomLeftBg'));
                                flag == 'bottomRight' && (jdx + nc.cols < $(item).find('td').length ? $(jtem).addClass('invisible') : $(jtem).addClass('bottomRightBg'));
                           }
                       })
                   }
               })
               break;
            case 'topMiddle':
            case 'bottomMiddle':
                $.each(dom, function(idx, item){
                    flag == 'topMiddle' && ((idx > nc.rows - 1) ? ($(item).find('td')).addClass('invisible') : ($(item).find('td')).addClass('topMiddleBg'));
                    flag == 'bottomMiddle' && ((idx + nc.rows < dom.length) ? ($(item).find('td')).addClass('invisible') : ($(item).find('td')).addClass('bottomMiddleBg'));
                })
                break;
            case 'middleLeft':
                if(_.isString(nc.left)){
                    dom.find('td').addClass('middleLeftBg').not('.' + nc.left).addClass('invisible');
                    break;
                }
            case 'middleRight':
                if(_.isString(nc.right)){
                    dom.find('td').addClass('middleRightBg').not('.' + nc.right).addClass('invisible');
                    break;
                }
                $.each(dom, function(idx, item){
                    $.each($(item).find('td'), function(jdx, jtem){
                        if(flag == 'middleLeft'){
                            jdx > nc.left - 1 ? ($(jtem).addClass('invisible')) : $(jtem).addClass('middleLeftBg');
                        }
                        if(flag == 'middleRight'){
                            jdx + nc.right < $(item).find('td').length ? ($(jtem).addClass('invisible')) : $(jtem).addClass('middleRightBg');
                        }
                    })
                })
            
        }

    },
    setBgColor: function(bgColors){
        bgColors = bgColors || this.option.data.bgColors;
        _.each(bgColors, function(value, key, list){
            $('.' + key).css('background-color', value);
        })
    },
    resetWidthHeight: function(){
        var $obj = $('.transverseRollingWrap>table');
        $obj[0].offsetWidth + this.scrollbarWidth < this.wrap[0].offsetWidth && this.wrap.width($obj[0].offsetWidth + this.scrollbarWidth);
        $obj[0].offsetHeight + this.scrollbarWidth < this.wrap[0].offsetHeight && this.wrap.height($obj[0].offsetHeight + this.scrollbarWidth);
        $obj[0].offsetHeight + this.scrollbarWidth > this.height && this.wrap.height(this.height);
    },
    render: function(data) {
        data = data || this.option.data;
        this.initHtml(data);
        this.bindEvent();
        this.resetWidthHeight();
        if(!this.height){
            this.height = this.wrap[0].offsetHeight;
        }
    },
});

// return FixedHeadTable;
// });


