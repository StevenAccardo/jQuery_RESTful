$(function() {

	var $orders = $('#orders');//This is caching the DOM, so the script only has to look at it once. It stores all the instances of elements with the id="orders". This is for the GET call.

	var $name = $('#name');
	var $drink = $('#drink'); //These are caching the DOM for the POST portion.


	var orderTemplate = $('#order-template').html();



/* The 2nd oldest version, and the first version using Mustache.js. This whole commented section was set equal too the variable orderTemplate above.
	"" +
	"<li>" +
	"<button data-id='{{id}}' class='remove'>X</button>" +//Delete button that stores the id of the object in the data-id attribute
	"<p><strong>Name:</strong> {{name}}</p>" +
	"<p><strong>Drink:</strong> {{drink}}</p>" +
	"</li>";//Template created for us with Mustach.js
	*/


	function addOrder(order) {//Created a function to populate a template each time that an item is added
		$orders.append(Mustache.render(orderTemplate, order));//NEW WAY using Mustache.js. Pass in the template variable, and then pass in the object

		//$orders.append('<li>Name: ' +order.name+ ', Drink: ' +order.drink+ '</li>');//Takes the element with the id="orders" and appends the the info to it for each object passed into the function
																					//OLD WAY WITHOUT MUSTACHE
	}

	$.ajax({
		type: 'GET', //Don't have to add this because it is default
		url: 'http://rest.learncode.academy/api/alina/friends',//Tells the script where to pull the data from
		success: function(orders) { //On success, envoke this function that passes in the data we are trying to retrieve
			$.each(orders, function(i, order) { //The "each" method goes through each item in the array and allows you run a function on that item. The array in this case is the retrieved data "orders". "i" in the 2nd function is the index of the array, and the second argument is the name of the data, you can call it whatever you want
				addOrder(order); 
			});
		}, 
		error: function() {
			alert('error loading orders');
		}
	});

	$('#add-order').on('click', function(){
		var order = {
			name: $name.val(),
			drink: $drink.val(),
		};

		$.ajax({
			type: 'POST',
			url: 'http://rest.learncode.academy/api/alina/friends',
			data: order, //Loads the info being posted which was stored in the variable "data" above
			success: function(newOrder) { //On success, we get back the info we posted, and we store that in "newOrder"
				addOrder(newOrder);
			},
			error: function() {
				alert('error saving the order');
			}
		});

	});

	//$('.remove').on('click', function() { //This doesn't work because the AJAX is Asynchronous, so this function is working at the same time as the GET call is retrieving the data, but the script runs this before the data has come back from the API. So to this function, it looks as if there is no data to remove
	$orders.delegate('.remove', 'click', function(){ //Uses the orders variable where "#orders" was cached from the DOM earlier to listen for a click event specifically in those parent element, and only fire when a .remove element is clicked.

		var $li = $(this).closest('li'); //Using 'this'to determine whatever element was just clicked it then traverses up the HTML code searching for the first 'li' that it comes across. That li is stored in a variable.
		$.ajax({
			type: 'DELETE',
			url: 'http://rest.learncode.academy/api/alina/friends/' + $(this).attr('data-id'), //tags the data-id for the object to the url
			success: function() {
				$li.fadeOut(300, function(){
					$('this').remove();
				});
			}
		});
	});


	$orders.delegate('.editOrder', 'click', function(){
		var $li = $(this).closest('li');
		$li.find('input.name').val($li.find('span.name').html());
		$li.find('input.drink').val($li.find('span.drink').html());
		$li.addClass('edit');
	});

	$orders.delegate('.cancelEdit', 'click', function(){
		$(this).closest('li').removeClass('edit');
	});

	$orders.delegate('.saveEdit', 'click', function(){
		var $li = $(this).closest('li');
		var order = {
			name: $li.find('input.name').val(),
			drink: $li.find('input.drink').val()
		};

		$.ajax({
			type: 'PUT',
			url: 'http://rest.learncode.academy/api/alina/friends/' + $li.attr('data-id'),
			data: order, //Loads the info being posted which was stored in the variable "data" above
			success: function(newOrder) { //On success, we get back the info we posted, and we store that in "newOrder"
				$li.find('span.name').html(order.name);
				$li.find('span.drink').html(order.drink);
				$li.removeClass('edit');
			},
			error: function() {
				alert('error updating the order');
			}
		});

	});
});

