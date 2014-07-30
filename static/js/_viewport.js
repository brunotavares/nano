/*global global, Router, prettyPrint, SEARCH_DATA*/
(function(){
	'use strict';

	var indexContent = global.indexContent.html,
		contentCache = {},
		externalRegex= /^(http|https|file):\/\//;

	function setContent(html) {
		$('#content-body').html(html).scrollTop(0);
		prettyPrint();
	}

	function onRouterChange(route) {
		var url, member;

		route = decodeURIComponent(route).split('-m-');

		url = route[0];
		member = route[1];

		if (!route) {
			highlightNavigationItem('');
			setContent(indexContent);
			prettyPrint();
		}
		else if (url) {
			highlightNavigationItem(url);
			loadContent(url, member);
		}
		else {
			setContent('<h1>Not found...</h1>');
		}
	}

	function focusMember(member) {
		var elHeight, elOffsetTop, windowHeight, scrollTop,
			el = document.getElementById(member);

		if (el && el.scrollIntoView) {
			el.scrollIntoView();
		}
	}

	function loadContent(url, member) {
		if (url) {
			if (contentCache[url]) {
				setContent(contentCache[url]);
				focusMember(member);
			}
			else {
				$.ajax({
					crossDomain: true,
					dataType: 'jsonp',
					jsonpCallback: 'callback',
					url: url,
					success: function(data) {
						contentCache[url] = data.html;
						setContent(data.html);
						focusMember(member);
					}
				});
			}
		}
	}

	function highlightNavigationItem(route) {
		route = route.split('#')[0];

		var highlightedEl = $('.active', '#side-nav'),
			el = $(document.getElementById('side-nav-'+ route));

		if (highlightedEl) {
			highlightedEl.removeClass('active');
		}

		if (el) {
			el.addClass('active');
			el.parents('.items-wrapper').show();
		}
	}

	function changeHash(href) {
		href = href.replace(/(.+)#/,'$1-m-');
		window.location.hash = href;
	}

	$(document).ready(function() {

		// Tree Navigation
		$('#side-nav a').click(function(e) {
			var el = $(this);

			if (el.hasClass('class-namespace')) {
				e.preventDefault();
				el.toggleClass('expanded');
				el.next().slideToggle();
			}
		});

		// local vs external links
		$(document).on('click', 'a', function(e) {
			var href = $(this).attr('href'),
				target = $(this).attr('target');

			if (target !== '_blank' && href && !externalRegex.test(href)) {
				e.preventDefault();
				changeHash(href);
			}
		});

		//search
		$('#search').select2({
			minimumInputLength: 2,
			width: 230,
			data: SEARCH_DATA,
			formatResult: function(result) {
				var defaultResult = $.fn.select2.defaults.formatResult.apply(this, arguments);

	            return 	'<div class="name">'+ defaultResult +'</div>' +
	            		'<div class="longname">' + result.longname +'</div>';
	        }
		}).
		on('select2-selecting', function(e) {
			var input = $(this),
				href = e.choice.href;
			e.preventDefault();

			window.setTimeout(function(){
				input.select2('close');
				changeHash(href);
			}, 1);

			return false;
		});

		// route
		onRouterChange('');
		Router.setup(onRouterChange);
	});

}());