var bodyParser = require('body-parser');
var Promise = require('bluebird');
var Users = Promise.promisifyAll(require('../models/users'));
var Efforts = Promise.promisifyAll(require('../models/efforts'));
var Segments = Promise.promisifyAll(require('../models/segments'));
var Challenges = Promise.promisifyAll(require('../models/challenges'));
var strava = require('../strava');

module.exports = function(app, express) {
  var apiRouter = express.Router();

  // users route
  apiRouter.route('/users')
    .get(function(req, res) {
    //   Users.findAsync({})
    //   .then(function (users) {
        res.json({ message: users });   
      // })
    });

  // specific user route
  apiRouter.route('/users/:user_id')
    .get(function(req, res) {
      res.json({ message: 'this is a specific user!' });   
    });

  // challenges route
  apiRouter.route('/challenges')
    .get(function(req, res) {
      res.json({ message: 'this returns all challenges!' });   
    });

  // specific challenge route
  apiRouter.route('/challenges/:challenge_id')
    .get(function(req, res) {
      res.json({ message: 'this is a specific challenge!' });   
    });

  // athletes route
  apiRouter.route('/athletes')
    .get(function(req, res) {
      res.json({ message: 'this returns all athletes!' });   
    });

  // specific athlete route
  apiRouter.route('/athletes/:athlete_id')
    .get(function(req, res) {
      res.json({ message: 'this is a specific athlete!' });   
    });

  // segments route
  apiRouter.route('/segments')
    .get(function(req, res) {
      res.json({ message: 'this returns all segments!' });   
    });

  // specific segment route
  apiRouter.route('/segments/:segment_id')
    .get(function(req, res) {
      res.json({ message: 'this is a specific segment!' });   
    });

  // efforts route
  apiRouter.route('/efforts')
    .get(function(req, res) {
      res.json({ message: 'this returns all efforts!' });   
    });

  // specific segment effort route
  apiRouter.route('/efforts/:effort_id')
    .get(function(req, res) {
      res.json({ message: 'this is a specific effort!' });   
    });

  // register/login route
  apiRouter.route('/register')
    .get(function(req, res) {
      // Redirect the browser to the Strava OAuth grant page.
      res.redirect(strava.getOAuthRequestAccessUrl());
    });

  // Handle the OAuth callback from Strava, and exchange the temporary code for an access token.
  apiRouter.route('/registercode')
    .get(function(req, res) {
      var stravaCode = req.query.code;

      if (stravaCode == null) {
        var description = 'Query parameter "code" is missing';
        console.log(description);
        sendErrorMessage(res, description);
      } else {
        registerAthlete(stravaCode);
      }
    });

  // Directly register a bearer token.  Primarily useful in a development setting.
  apiRouter.route('/registertoken')
    .get(function(req, res) {
      var stravaToken = req.query.token;

      if (stravaToken == null) {
        var description = 'Query parameter "token" is missing';
        console.log(description);
        sendErrorMessage(res, description);
      } else {
        registerAthleteToken(stravaToken, function(err) {
          if (err) sendErrorMessage(res, "Unable to register Strava token");
          else res.redirect('./');
        });
      }   
    });

  return apiRouter;
};