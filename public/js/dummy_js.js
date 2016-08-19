$(function(){
	var $orders= $('#orders');
	var $name= $('#name');
	var $drink= $('#drink');
	$.ajax({
		url: '/path/to/file',
		type: 'default GET (Other values: POST)',
		dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
		data: {param1: 'value1'},
		success: function(orders){
			$.each(data, function(i,order) {
				$orders.append('<li>Name: '+ order.name +' , Drink: ' + order.drink +'</li>');
			});
		},
		error:(function() {
			alert("Error loading..  ");
		}
	});
		$('#add-order').on('click', function(){
			var order={
				name: $name.val();
				drink: $drink.val();
			}
		});
});