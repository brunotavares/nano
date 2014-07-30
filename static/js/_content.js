(function(){

	$(document).ready(function() {

		$(document).on('click', '.member .expandable', function(e) {
			e.preventDefault();
			$(this).parents('.member').toggleClass('expanded');
		});
	});

}());