var express = require('express');
var gameRouter = express.Router();

var router = function(games,navBar) {

	var foundGame;

	gameRouter.route('/')
		.get(function (req, res){
			res.redirect('/');
		});

	gameRouter.route('/:id')
		.get(function (req, res){
			var id = req.params.id;
			foundGame = findGame(id,games);
			
			if (foundGame) {
				res.render('game', {game:foundGame, navBar:navBar});
			} else {
				res.send('There is no game called \'' + id + '\'.');
			}
		});
	
	return gameRouter;
}	
	
function findGame(id,games) {
	var rightGame = {},loop;
	for (loop=0; loop<games.length; loop++){
		if (id === games[loop].gameName) {
			return games[loop];
		}
	}
	return false;
}
	
	
module.exports = router;