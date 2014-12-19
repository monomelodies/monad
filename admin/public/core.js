
;(function($) {

var Monad = window.Monad || {}; 
window.resizeFileFrame = function(height, id) {
    $('[name=' + id + ']').parents('td').find('iframe').css({height: height});
};
var orig;
Monad = $.extend(Monad, {
    core: {
        select: {
            getSize : function() {
                return {width: this.getSize().x, height: this.getScrollSize().y};
            },
        },
        objectgroup : {
            expand : function() {
                var p = this.getParent('li.group');
                var size = p.retrieve('size');
                var u = p.getElements('ul')[0];
                u.set('morph', {
                    duration: 1000,
                    transition: Fx.Transitions.Elastic.easeOut,
                    link: 'chain'
                });
                u.morph({'height' : [0, size.y]});
                this.set('html', '[-]');
                this.removeEvent('click', Monad.core.objectgroup.expand);
                this.addEvent('click', Monad.core.objectgroup.collapse);
                return false;
            },
            collapse : function() {
                var p = this.getParent('li.group');
                var size = p.retrieve('size');
                var u = p.getElements('ul')[0];
                u.morph({'height' : [size.y, 0]});
                this.set('html', '[+]');
                this.removeEvent('click', Monad.core.objectgroup.collapse);
                this.addEvent('click', Monad.core.objectgroup.expand);
                return false;
            },
        },
        fieldset : {
            expand : function() {
                var p = this.getParent('fieldset');
                var size = p.retrieve('size');
                p.set('morph', {
                    duration: 1000,
                    transition: Fx.Transitions.Elastic.easeOut,
                    link: 'chain'
                });
                p.morph({'height' : [this.getSize().y, size.y]});
                p.removeClass('pretty');
                this.set('html', '[-]');
                this.removeEvent('click', Monad.core.fieldset.expand);
                this.addEvent('click', Monad.core.fieldset.collapse);
                return false;
            },
            collapse : function() {
                var p = this.getParent('fieldset');
                var size = p.retrieve('size');
                p.morph({'height' : [size.y, this.getSize().y]});
                this.set('html', '[+]');
                this.removeEvent('click', Monad.core.fieldset.collapse);
                this.addEvent('click', Monad.core.fieldset.expand);
                p.addClass('pretty');
                return false;
            },
        }
    },
    file: {
        upload: function(form) {
            form.addClass('uploading');
            var f = $('fieldset', form);
            var to;
            var progress = function() {
                var self = this, callee = arguments.callee;
                $.post(
                    '/progress.php',
                    {},
                    function(data) {
                        if (data && data.value < 100) {
                            $('progress').attr('value', data.value);
                            to = window.setTimeout(
                                function() { callee.call(self); },
                                1000
                            );
                        } else {
                            form.removeClass('uploading');
                        }
                    },
                    'json'
                );
            };
            progress();
            return true;
        },
        choose: function() {
            var w = $(window.parent).width(), h = $(window.parent).height();
            var pick = $(window.open(
                '/monad/' + Monolyth.language.code + '/monad/file/',
                'filebrowser',
                ['width=' + parseInt(w * .8), 'height=' + parseInt(h * .7)].
                    join(','),
                true
            ));
            return false;
        },
        select: function(id, src, alt) {
            $('body > div + div').remove();
            $('body > div').after(
                '<div><img src="' + src + '" alt="' + alt + '"></div>'
            );
            window.parent.Monad.file.set($('[name=element]').val(), id);
        },
        set: function(el, id) {
            $('[name=' + el + ']').val(id);
        },
        done: function(element, data) {
            $('body > div + div').remove();
            var i = $('<img>');
            i.load(function() { window.Monad.file.resize(element, this, $('body').height()) });
            $('body > div').after('<div>');
            i.attr('src', data.src);
            i.attr('alt', data.alt);
            $('body > div + div').append(i);
            window.parent.Monad.file.set(
                element,
                data.id
            );
        },
        remove: function(el) {
            var el = $('[name=' + el + ']');
            el.val('');
            console.log(el.get(0), el.parents('td'));
            var i = el.parents('td').find('iframe');
            i.attr('src', i.attr('src').replace(/\d+/, 0));
        },
        resize: function(element, img, height) {
            window.parent.resizeFileFrame(height, element);
            var $img = $(img);
            if ($img.width() > $('body').width()) {
                $img.width($('body').width());
            }
        }
    },
    languages: {
        hideAll: function() {
            $('option.lang').css({display: 'none'}).attr('disabled', 1);
        },
        showCurrent: function(val, cls) {
            // The currently selected element has a class,
            // signifying the language.
            Monad.languages.hideAll();
            if (!cls) {
                var cls = $('select[name=language] option[value=' + val + ']').
                                attr('class');
            }
            $('option.lang.' + cls).removeAttr('style').removeAttr('disabled');
        }
    },
});
$.fn.monadEditor = function(lang, options) {
    return this.each(function() {
        var settings = {
            language: lang,
            resize_enabled: false,
            bodyClass: 'editable',
            forcePasteAsPlainText: true,
            docType: '<!doctype html>',
            entities: false,
            entities_greek: false,
            toolbar: 'Full',
            disableNativeSpellChecker: true,
            filebrowserBrowseUrl: '/monad/' + lang + '/monad/file/',
            filebrowserImageBrowseUrl: '/monad/' + lang + '/monad/file/image/',
            filebrwoserFlashBrowseUrl: '/monad/' + lang + '/monad/file/flash/',
        };
        if (options) {
            $.extend(settings, options);
        }
        var $this = $(this), attr = null;
        if (attr = $this.attr('data-ckeditor')) {
            attr = Monolyth.Base64.decode(attr);
            $.extend(settings, $.parseJSON(attr));
        }
        $this.ckeditor(function() { }, settings);
    });
};

$(document).ready(function() {

$(document).html5();
var check = document.createElement('input');
check.setAttribute('type', 'date');
if (check.type === 'text' && $.fn.datepicker) {
    $('input[type=date]').datepicker();
    $('input[type=datetime]').datetimepicker({selectors: true});
}
$('.language').parents('.mg').slideUp(0);
$('.monad_tabs_menu a').click(function() {
    var $this = $(this), l = $this.attr('href').replace(/^#tab-/, '');
    if ($this.hasClass('active')) {
        return false;
    }
    $('.monad_tabs_menu a').removeClass('active');
    $this.addClass('active');
    $('.language').parents('.mg').fadeOut(200, function() {
        $('.language.' + l).parents('.mg').fadeIn(200);
    });
    return false;
});
$('.monad_tabs_menu a:first-child').removeClass('active').click();
$('.foreignkey').parents('form').submit(function() {
    var f = $(this);
    f.find('.foreignkey input').each(function() {
        var $this = $(this);
        $this.val($this.attr('data-value'));
    });
    return true;
});
$('.foreignkey input').click(function() {
    $('#monad-modal').remove();
    $('body').append('<div id="monad-modal"/>');
    var $this = $(this);
    var page = 1;
    var popup;
    var select = function(id, value) {
        $this.attr('data-value', id);
        $this.val(value);
        popup.remove();
        $('#monad-modal').remove();
    };
    $.get(
        '/monad/' + Monad.language + '/foreign-key/',
        {
            database: $this.attr('data-database'),
            'package': $this.attr('data-package'),
            target: $this.attr('data-target'),
            field: $this.attr('data-field'),
            page: page
        },
        function(data) {
            $('body').append('<div class="popup box foreign-key"/>');
            popup = $('.popup.box');
            popup.append('<header class="outer">' +
                '<b class="icons"><a href="#" class="icon cancel">[x]</a></b>' +
                '<h1>' + Monolyth.text.get('monad\\admin\\foreignkey/select') + '</h1>' +
                '</header>');
            popup.find('.icon.cancel').click(function() {
                popup.remove();
                $('#monad-modal').remove();
                return false;
            });
            popup.append('<div class="inner"/>');
            popup.find('.inner').append('<div class="buttons"><button>' +
                Monolyth.text.get('monad\\admin\\foreignkey/novalue') +
                '</button><hr></div>');
            popup.find('button').click(function() {
                select(null, '');
                return false;
            });
            updateFks(data);
        },
        'json'
    );
    var updateFks = function(data) {
        popup.find('.inner').find('table, ul.paginate').remove();
        var updateFks = arguments.callee;
        if (parseInt(data.pages) > 1) {
            var ul = $('<ul class="paginate"/>');
            if (page > 1) {
                ul.append('<li><a href="#" data-page="1">&laquo;</a></li>');
            }
            for (var i = 1; i <= data.pages; i++) {
                if (i == page) {
                    ul.append('<li><strong>' + i + '</strong></li>');
                } else {
                    ul.append('<li><a href="#" data-page="' + i + '">' + i + '</a></li>');
                }
            }
            if (page != data.pages) {
                ul.append('<li><a href="#" data-page=' + data.pages + '">&raquo;</a></li>');
            }
        }
        popup.find('.inner').prepend(ul);
        popup.find('.inner .paginate a').click(function() {
            page = $(this).attr('data-page');
            $.get(
                '/monad/' + Monad.language + '/foreign-key/',
                {
                    database: $this.attr('data-database'),
                    'package': $this.attr('data-package'),
                    target: $this.attr('data-target'),
                    field: $this.attr('data-field'),
                    page: page
                },
                updateFks,
                'json'
            );
            return false;
        });
        var t = $('<table class="foreign-key-select"/>');
        var h = $('<thead/>');
        var b = $('<tbody/>');
        var tr = $('<tr/>');
        for (var header in data.headers) {
            tr.append('<th>' + data.headers[header] + '</th>');
        }
        h.append(tr);
        t.append(h);
        for (var i = 0; i < data.items.length; i++) {
            ;(function(item) {
                var tr = $('<tr/>');
                for (var field in item) {
                    tr.append('<td>' + item[field] + '</td>');
                }
                b.append(tr);
                tr.click(function() {
                    select(item.id, item[$this.attr('data-field')]);
                    return false;
                });
            })(data.items[i]);
        }
        t.append(b);
        popup.find('.inner').prepend(t);
    };
    return false;
});
$('.monad_sortable td').each(function() {
    var $this = $(this);
    $this.css({width: $this.width()});
});
if ($.fn.sortable) {
    $('.monad_sortable tbody').sortable({
        containment: 'parent',
        handle: '.sort',
        forceHelperSize: true,
        start: function(event, ui) {
            ui.item.startPos = ui.item.index();
        },
        stop: function(event, ui) {
            // moved element.
            
            if ((ui.item.index() - ui.item.startPos) != 0) {
                $('tr', ui.item.parents('tbody')).each(function() {
                    $('td .icon.sort', $(this)).addClass("loading");
                });
                $.post(
                    '/monad/' + window.Monad.language + '/monad/ajax/reorder/', 
                    {
                        id: $('td.numeric', ui.item).html(),
                        move: (ui.item.index() - ui.item.startPos),
                        menu: 2,
                        parent: null
                    }, 
                    function(data) {
                        $('tr', ui.item.parents('tbody')).each(function() {
                            $('td .loading', $(this)).removeClass("loading");    
                        });
                    }
                );
            } 
        }
    }).disableSelection();
}
if ($.fn.draggable) {
    $('#filebrowser #files a').draggable({
        start: function(event, ui) {
            var $this = $(this);
            var o = $this.offset();
            $this.css({
                left: o.left,
                top: o.top
            });
            $this.fadeTo(400, .5);
        },
        scroll: false,
        refreshPositions: true,
        stop: function(event, ui) {
            var $this = $(this);
            $this.fadeTo(400, 1);
            $this.css({position: 'relative', left: 'auto', top: 'auto'});
            event.stopPropagation();
        }
    }).click(function(event) {
        var i = $('img', this);
        var src = i.attr('data-src');
        try {
            var funcnum = window.location.href.match(/CKEditorFuncNum=(\d+)/)[1];
            window.opener.CKEDITOR.tools.callFunction(funcnum, src);
        } catch (e) {
            window.opener.Monad.file.select(
                i.attr('data-id'),
                src,
                i.attr('alt')
            );
        }
        self.close();
        event.stopPropagation();
        return false;
    });
}
if ($.fn.droppable) {
    $('#filebrowser #folders a').droppable({
        drop: function(event, ui) {
            var $this = $(this);
            $this.removeClass('hover');
            $.post(
                '/monad/' + window.Monad.language + '/ajax/file/move/',
                {
                    folder: $this.attr('href').replace(/^.*?#/, ''),
                    file: ui.helper.attr('href').replace(/^.*?#/, '')
                },
                function(data) {
                    ui.helper.parent('li').remove();
                }
            );
        },
        over: function(event, ui) {
            $(this).addClass('hover');
        },
        out: function(event, ui) {
            $(this).removeClass('hover');
        }
    }).click(function() {
        var url = window.location.href;
        url = url.replace(/[?&]id=\d+/g, '').replace(/#.*$/, '');
        url += url.indexOf('?') == -1 ? '?' : '&';
        url += 'id=' + $(this).attr('href').replace(/^.*?#/, '');
        window.location.href = url;
        return false;
    });
}

$('.monad_inline.stacked').each(function() {
    var $this = $(this),
        hasValues = function(row) {
            var test = row.find('input, textarea, select').serializeArray();
            for (var i = 0; i < test.length; i++) {
                if (test[i].value.replace(/\s+/, '').length) {
                    return true;
                }
            }
            return false;
        };
    $this.find('.update').click(function() {
        $(this).parents('tr').toggleClass('editing');
        return false;
    });
    $this.find('.createrow').each(function() {
        var row = $(this);
        $('input, textarea, select', row).on('keyup change', function() {
            // Check if at least one of the fields still has data
            var last = $this.find('.createrow:last-child');
            if (hasValues(row) && hasValues(last)) {
                row.find('input, textarea, select').each(function() {
                    var e = $(this);
                    if (e.attr('data-required')) {
                        e.attr('required', true);
                    }
                });
                var newrow = row.clone(true);
                // Re-index elements so we can associate with the correct item:
                var idx = $(this).attr('name').match(/\[(\d+)\]/);
                idx = idx[1];
                var newidx = ++idx;
                last = row.parent().append(newrow).find('.createrow:last-child');
                last.find('input, textarea, select').each(function() {
                    var e = $(this);
                    e.val('');
                    e.attr(
                        'name',
                        e.attr('name').replace(/\[\d+\]/, '[' + newidx + ']')
                    );
                    e.attr('data-required', e.attr('required'));
                    e.removeAttr('required');
                });
            }
            return true;
        }).each(function() {
            var e = $(this);
            e.attr('data-required', e.attr('required'));
            e.removeAttr('required');
        });
        var f = row.parents('form');
        $('input, textarea, select', f).click(function() {
            var e = $(this);
            if (!e.is(':focus')) {
                e.focus();
            }
            return true;
        });
        f.submit(function() {
            $('.createrow:last-child', this).remove();
            return true;
        });
    });
});

$('.icon.delete').on('click', function() {
    if (!window.confirm(Monolyth.text.get('monad\\admin\\deleteconfirm'))) {
        return false;
    }
    var $this = $(this);
    if ($this.hasClass('media')) {
        return false;
    }
    var f = $this.parents('.monad_inline');
    if (f.length) {
        if (f.hasClass('stacked')) {
            $this.parents('tr').remove();
        } else {
            f = $('<form/>');
            f.attr('method', 'post');
            f.attr('action', $this.attr('href'));
            $('body').append(f);
            f.submit();
        }
        return false;
    } else {
        return true;
    }
});
$('#uploader button + button').click(function() {
    Monad.file.choose();
    return false;
});
var filters = function() {
    var $this = $(this);
    if ($this.attr('data-filter')) {
        var val = $this.val(),
            f = $('[name=' + $this.attr('data-filter') + ']');
        $('option', f).each(function() {
            var $this = $(this);
            if ($this.attr('data-filter') == val) {
                $this.stop().fadeIn();
            } else {
                $this.stop().fadeOut();
            }
        });
    }
};
$('select').each(filters);
$('body').on('change', 'select', filters);

$('#menu-container > a').click(function() {
    $(this).parent('#menu-container').toggleClass('expanded');
    return false;
});

});
$('#main h2').click(function() {
    var p = $(this).siblings('ul');
    if (p.hasClass('active')) {
        return false;
    }
    $('#main .active').removeClass('active');
    p.addClass('active');
    return false;
});
window.Monad = Monad;

})(jQuery);
