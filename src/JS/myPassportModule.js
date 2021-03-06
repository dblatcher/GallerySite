var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
fs = require("fs");

var adminPath = '/admin'; 

var users; 
try {
	users = JSON.parse(fs.readFileSync('./users.json', 'utf8'))
	console.log('imported user list, ' + users.length + ' user accounts.');
} catch(err) {
	
	console.log('failed to import user list - it will not be possible to log-on to the admin areas of the site.')
	if (err.code == "ENOENT") {
		console.log('The file "users.json" is missing from root. See "template for users_json.txt" for instructions.')
	} else {
		console.log('Error in "users.json" :  ' + err.message);
	}
	
	users = [];
}


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var rightUser;
	users.forEach( (userInList)=> {
		if (userInList.id === id) {rightUser = userInList}
	});
  done(null, rightUser);
});

passport.use(new LocalStrategy(function(username, password, done) {
	var user = null;
	users.forEach( (userInList)=> {
		if (userInList.username === username) {user = userInList};
	})
	
	if (!user) {
		return done(null, false, { message: 'Login failed.' });
	}
	if (user.password !== password) {
		return done(null, false, { message: 'Login failed.' });
	}
	return done(null, user);

}));

function checkIfUserLoggedIn(req, res, next) {
	if (req.user) { next();	}
	else {
		req.session.message = "You need to Log in before seeing that page!";
		console.log(req.get('referer'))
		res.redirect(adminPath);
	}
}

function checkUserBeforeAcceptingPost(req, res, next) {
	if (req.user) { next();	}
	else {
		console.log( '#blocked a POST request - no credentials#' );
		res.status(401);
		res.send({success:false, message:"You don't have permission!"});
		return false;
	}
}

function attemptLogIn(req, res, next) {
  // app uses formidable to parse forms, which puts the data on req.fields
	//passport looks for it on req.body, so:
	req.body = req.fields;
	
  passport.authenticate('local', function(err, user, info) {		
		if (info) {req.session.message = info.message};
 		
    if (err) { return next(err); }
		if (!user) { 
			return res.redirect(adminPath); 
		}
		
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect(adminPath);
    });
		
  })(req, res, next);
};

function logUserOut (req, res) {
	req.logout();
  res.redirect('back');
}


module.exports ={
	checkIfUserLoggedIn:checkIfUserLoggedIn,
	checkUserBeforeAcceptingPost:checkUserBeforeAcceptingPost,
	attemptLogIn:attemptLogIn,
	logUserOut:logUserOut
};