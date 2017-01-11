
$(document).ready(function(){
	$('#hamburger').click(function(){
		$(this).toggleClass('open');
	});


	var codepenTpl = $('#codepen-tempate').html();

	$('h2').click(function(e){
		if($(this).parent().hasClass('expand')){
			$(this).parent().removeClass('expand');
		}else{
			$(this).parent().addClass('expand');
		}

		var $codepenTarget = $(this).parent().find('.codepen-target');
		if(! $codepenTarget.hasClass('full')){
			var slugHash = $codepenTarget.data('slug-hash'),
				title = $codepenTarget.data('title');

			$codepenTarget.addClass('full');

			//build our piece
			var embedHTML = TemplateFactory(codepenTpl, {
					slugHash: slugHash,
					title: title
				});

			//put a blank svg in place
			$codepenTarget.html(embedHTML);
		}
	});

	/**
	 * Make pieces our of the given data object.
	 */
	function TemplateFactory(tpl, data) {
		var re = /<%(.*?)?%>/g;

		while(match = re.exec(tpl)) {

			tpl = tpl.replace(match[0], data[match[1]]);

			//not sure why, but the index gets messed up and misses the last template variable
			re.lastIndex -= 2;
		}
		return tpl;
	}
});
