/**!
 * 栅格图片与代码自动生成工具
 * author: wuzhou
 * date:2017-08-13
 */
(function browserCheck() {
    if (!document.addEventListener) {
        layer.open({
            content: '浏览器太老啦！哥帮你介绍几个高级浏览器！',
            end: function() {
                self.location = 'https://browsehappy.com/?locale=en';
            }
        });
    }
})();

(function(win, $) {

    if (!window.Util) {
        window.Util = {};
    }
    $.extend(Util, {
        clearHtml: function(html) {
            return html.replace(/(\r\n|\n|\r)/g, "")
                .replace(/[\t ]+\</g, "<")
                .replace(/\>[\t ]+\</g, "><")
                .replace(/\>[\t ]+$/g, ">");
        }
    });

    var $totalWidth = $('#totalWidth'),
        $gridNum = $('#gridNum'),
        $gridBtn = $('#gridBtn'),
        $padGridBtn = $('#padGridBtn');

    // 生成图片
    var makePic = function(pack) {
        $.each(pack, function(index, el) {
            el.canvasId = "myCanvas" + index;
        });

        var canvasTmpl = Util.clearHtml($('#canvas-tmpl').html()),
            M = Mustache;
        M.parse(canvasTmpl);

        if (pack.length) {

            $("#picArea").html(M.render(canvasTmpl, { items: pack }));

            $.each(pack, function(index, el) {
                var curGridWidth = this.gridWidth,
                    curGridSpacing = this.gridSpacing,
                    curGridNum = this.gridNum;

                var canvasPack = document.getElementById(this.canvasId),
                    canvasInfo = canvasPack.getContext("2d");
                canvasInfo.fillStyle = "#ffe873";
                canvasInfo.fillRect(0, 0, this.totalWidth, 100);
                for (var i = 1; i < curGridNum; i++) {
                    var startPoint = (i * curGridWidth) + (i - 1) * curGridSpacing;
                    canvasInfo.fillStyle = "#ffffff";
                    canvasInfo.fillRect(startPoint, 0, curGridSpacing, 100);
                }
                //  保存图片
                var type = 'png';
                var imgData = canvasPack.toDataURL(type);
                var _fixType = function(type) {
                    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
                    var r = type.match(/png|jpeg|bmp|gif/)[0];
                    return 'image/' + r;
                };
                imgData = imgData.replace(_fixType(type), 'image/octet-stream');
                var saveFile = function(data, filename) {
                    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                    save_link.href = data;
                    save_link.download = filename;

                    var event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    save_link.dispatchEvent(event);
                };
                var filename = 'grid_' + (new Date()).getTime() + '.' + type;

                $("#btn-" + this.canvasId).on('click', function() {
                    saveFile(imgData, filename);
                });
                // 生成css
                $("#css-" + this.canvasId).on('click', function() {
                    layer.open({
                        type: 2,
                        title: false,
                        shadeClose: true,
                        closeBtn: 1,
                        scrollbar: false,
                        shade: [0.5, "#000"],
                        area: ['500px', '500px'],
                        content: ['images/generateCss.html?&' + curGridWidth + '&' + curGridNum + '&' + curGridSpacing]
                    });
                });

            });

        }
    };

    var gridCreate = function(totalWidth, gridNum, padTag) {
        var self = this;
        // 获取最大格宽
        var maxSingleWith = Math.floor(totalWidth / gridNum);
        var pack = [];
        for (var i = 1; i < maxSingleWith; i++) {

            // 判断剩余的宽度是否能整除格数减一
            var divisionTag = (totalWidth - (gridNum * i)) % (gridNum - 1);

            if (divisionTag === 0) {
                // 格间距
                var gridSpacing = (totalWidth - (gridNum * i)) / (gridNum - 1);
                // 格宽大于格间距
                if (gridSpacing < i) {
                    pack.push({ "totalWidth": totalWidth, "gridNum": gridNum, "gridWidth": i, "gridSpacing": gridSpacing });
                }

            }
        }

        if (!padTag) {
            if (pack.length) {
                makePic(pack);
            } else {
                $('#picArea').html("<span class='container ewb-nullInfo'>完蛋啦，/(ㄒoㄒ)/~~，没有符合的栅格！</span>")
            }
        } else {
            if (pack.length) {
                return true;
            } else {
                return false;
            }
        }

    };


    $gridBtn.on('click', function() {
        var totalWidth = $('#totalWidth').val(),
            gridNum = $('#gridNum').val();

        if (totalWidth.trim() === "" || totalWidth.trim() == 0) {
            layer.tips("栅格总宽度不能为空或者零", "#totalWidth");
            return;
        }
        if (gridNum.trim() === "" || gridNum.trim() == 0) {
            layer.tips("栅格个数不能为空或零", "#gridNum");
            return;
        }
        $('#picArea').empty();

        gridCreate(totalWidth, gridNum, false);

    });

    $padGridBtn.on('click', function() {
        var gridNum = $('#gridNum').val();
        if (gridNum.trim() === "" || gridNum.trim() == 0) {
            layer.tips("栅格个数不能为空或零", "#gridNum");
            return;
        }
        var padStr = [];
        for (var i = 760; i < 768; i++) {
            var padTag = gridCreate(i, gridNum, true);
            if (padTag) {
                padStr.push(i);
            }
        }
        if (padStr.length) {
            layer.msg('此栅格个数适合响应式，pad端宽度可以为：' + padStr.toString(), { icon: 1 });
        } else {
            layer.msg('此栅格个数不适合响应式', { icon: 2 });
        }


    });

}(this, jQuery));