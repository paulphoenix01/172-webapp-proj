$(document).ready(function(){
	$('.delete-course').on('click', function(){
		var id = $(this).data('id');
		var url = '/delete/'+id;
		if(confirm('Delete Course?')){
			$.ajax({
				url: url,
				type:'DELETE',
				success: function(result){
					console.log('Deleting Course...');
					window.location.href='/';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});

	$('.edit-course').on('click', function(){
		$('#edit-form-name').val($(this).data('name'));
		$('#edit-form-description').val($(this).data('description'));
		$('#edit-form-prereq').val($(this).data('prereq'));
		$('#edit-form-id').val($(this).data('id'));
	});
});