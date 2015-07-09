var SimpleGallery = (function ($) {
    function SimpleGallery() {
        this.init.apply(this, arguments);
    }

    $.extend(SimpleGallery.prototype, {
        defaults: {
            images: []
            , current: 0
            , selector: "a[data-index]"
        }
        , init: function (options) {
            $.extend(true, this, this.defaults, options);
            this.parseImages();
            this.preloadImages();

            var galleryObj = this;
            $(this.selector).on("click", function (event) {
                event.preventDefault();

                var startIndex = $(this).data("index");
                
                galleryObj.showGallery(startIndex, event.pageX, event.pageY - $(window).scrollTop());
            });
        }
        , parseImages: function () {
            if (this.images.length > 0)
                return;

            var galleryObj = this;
            $(this.selector).each(function (i) {
                var dataIndex = $(this).data("index");
                if (dataIndex === undefined)
                    dataIndex = i;
                if (galleryObj.images[dataIndex] == undefined)
                    galleryObj.images[dataIndex] = this.href;
            });
        }
        , preloadImages: function () {
            for (var i in this.images) {
                new Image().src = this.images[i];
            }
        }
        , showGallery: function (startIndex, x, y) {
            this.current = startIndex;
            // удалим старую галерею
            $(".gallery-frame").remove();
			
            $('<div class="gallery-frame" style="width: 0; height: 0; top: ' + y + 'px; left: ' + x + 'px;">' +
                '<table>' +
                    '<tr>' +
                        '<td>' +
                            '<img class="gallery-image" src="' + this.images[startIndex] + '" alt="" />' +
                            '<span class="gallery-prev"></span>' +
                            '<span class="gallery-next"></span>' +
                            '<span class="gallery-close">' +
                                '<i class="fa fa-times"></i>' +
                            '</span>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
            '</div>')
                .prependTo("body")
                .animate({
                    width: "100%"
                    , height: "100%"
                    , top: 0
                    , left: 0
                }
                , {
                    duration: 200
                    , complete: function () {
                        // уберем скрол с body
                        $("body").css({
                            width: 100
                            , height: 100
                            , overflow: "hidden"
                        });
                    }
                });

            $(".gallery-prev").on("click", $.proxy(this.prev, this));
            $(".gallery-next").on("click", $.proxy(this.next, this));
            $(".gallery-close").on("click", $.proxy(this.close, this));
        }
        , next: function () {
            this.current++;
            if (this.current >= this.images.length)
                this.current = 0;

            if (this.images[this.current] === undefined) {
                this.next();
                return;
            }

            $(".gallery-image").attr("src", this.images[this.current]);
        }
        , prev: function () {
            this.current--;
            if (this.current <= 0)
                this.current = this.images.length - 1;

            if (this.images[this.current] === undefined) {
                this.prev();
                return;
            }

            $(".gallery-image").attr("src", this.images[this.current]);
        }
        , close: function () {
            $(".gallery-frame").remove();
            $("body").css({
                width: "auto"
                , height: "auto"
                , overflow: "visible"
            });
        }
    });
    return SimpleGallery;
}($));