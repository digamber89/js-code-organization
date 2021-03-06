
$(function(){
		var common = {
			init: function(){
				//this is the only function that's expected to be called

				//call cache dom to set all the variables
				this.cacheDOM();

				this.eventListeners();
			},
			cacheDOM: function(){
				this.example = 6;
				//use $ sign to distinguish jQuery objects from other variables
				this.$body = $('.body');
				//we're expecting this will be calculated on DOM ready
				this.bodyHeight = this.$body.outerHeight();
			},
			eventListeners: function(){
				//here we set the event listenere
				

				//for html or other elements that are returned from ajax calls - we must use the format $('elemenet-selector').on('event','child-element-within-selector','function');
				//e.g.
				$('a.clickable').on('click',this.clickMe.bind(this));
			},
			clickMe: function(e){
				e.preventDefault();
				var $el = $(e.currentTarget);

			},
			showDetails: function(e){
				//The currentTarget event property returns the element whose event listeners triggered the event.
				e.preventDefault();//this is familiar isn't it
				
				//convert javascript to jquery object
				$el = $(e.currentTarget);
				//then you can do all sort of stuff with it.
				$attr = $el.attr('href');
				if($attr === '#'){
					alert(this.example);
				}
			}

		};
	console.log(common);
	common.init();
});