define( [ 'jquery' ], function( $ ) {

	function Api() {
	}

	Api.saveScore = function( gameName, score ) {
		var params = {
			'game_name': gameName,
			'game_level_number': score.game_level_number,
			'player_name': score.player_name,
			'value': score.value
		};
		$.ajax({
			type: 'POST',
			url: 'http://api.ponup.com/score/add',
			data: params
		});
	};

	Api.retrieveScores = function( gameName, limit, callback ) {
		var params = {
			'game_name': gameName,
			'limit': limit
		};
		$.ajax({
			url: 'http://api.ponup.com/score/list',
			data: params,
			success: callback
		});
	};

	return Api;

} );
