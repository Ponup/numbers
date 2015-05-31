
define( [ 'api' ], function( Api ) {

	return {
		saveScore: function( score )
		{
			Api.saveScore( 'numbers', {
				'game_level_number': score.level,
				'player_name': score.player,
				'value': score.score
			});
		},

		retrieveScores: function( callback )
		{
			Api.retrieveScores( 'numbers', 10, callback );
		}
	};
});

