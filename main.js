$(function() {

	var $orders = $('#orders');
	var $name = $('#name');
	var $drink = $('#drink'); 
	var orderTemplate = $('#order-template').html();
	var endpointURL = 'http://rest.learncode.academy/api/cafe/drinks'

	function addOrder(order) {
		$orders.append(Mustache.render(orderTemplate, order));
	
	}

		/********************
				GET
		*******************/

	$.ajax({
		type: 'GET', 
		url: endpointURL,
		success: function(orders) { 
			$.each(orders, function(i, order) { 
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

		/********************
				POST
		*******************/

		$.ajax({
			type: 'POST',
			url: endpointURL,
			data: order, 
			success: function(newOrder) { 
				addOrder(newOrder);
			},
			error: function() {
				alert('error saving the order');
			}
		});

	});

		/********************
				Delete
		*******************/

	$orders.delegate('.remove', 'click', function(){ 

		var $li = $(this).closest('li'); 
		$.ajax({
			type: 'DELETE',
			url: endpointURL + '/' + $(this).attr('data-id'),
			success: function() {
				$li.fadeOut(300, function(){
					$('this').remove();
				});
			}
		});
	});

		/********************
				Edit
		*******************/

	$orders.delegate('.editOrder', 'click', function(){
		var $li = $(this).closest('li');
		$li.find('input.name').val($li.find('span.name').html());
		$li.find('input.drink').val($li.find('span.drink').html());
		$li.addClass('edit');
	});

		/********************
				Cancel
		*******************/

	$orders.delegate('.cancelEdit', 'click', function(){
		$(this).closest('li').removeClass('edit');
	});

		/********************
				Save
		*******************/

	$orders.delegate('.saveEdit', 'click', function(){
		var $li = $(this).closest('li');
		var order = {
			name: $li.find('input.name').val(),
			drink: $li.find('input.drink').val()
		};

		$.ajax({
			type: 'PUT',
			url: endpointURL + '/' + $li.attr('data-id'),
			data: order,
			success: function(newOrder) { 
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

