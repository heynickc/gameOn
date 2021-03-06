var request = require('supertest');
var util = require('util');
var chai = require('chai');
var should = chai.should();
var cheerio = require('cheerio');
var async = require('async');

var app = require('../app.js');
var User = require('../models/User');

describe('GET /signup', function () {
	it('should return 200 OK', function (done) {
		request(app)
			.get('/signup')
			.expect(200, done);
	});
});

describe('POST /signup', function () {

	beforeEach(function () {
		User.remove({}).exec();
	});

	it('should redirect to /', function (done) {
		request(app)
			.get('/signup')
			.end(function (err, res) {
				request(app)
					.post('/signup')
					.send({
						email: 'nickc@nickc.com',
						password: 'secretsauce',
						confirmPassword: 'secretsauce'
					})
					.end(function (err, res) {
						if (err) return done(err);
						res.statusCode.should.equal(302);
						res.headers.should.have.property('location').equal('/');
						return done();
					});
			});
	});

	it('new user creates a new user in the database', function (done) {
		request(app)
			.post('/signup')
			.send({
				email: 'nickc@nickc.com',
				password: 'secretsauce',
				confirmPassword: 'secretsauce'
			})
			.end(function (err, res) {
				if (err) return done(err);
				User.findOne({
					email: 'nickc@nickc.com'
				}, function (err, user) {
					if (err) return done(err);
					user.email.should.equal('nickc@nickc.com');
					return done();
				});
			});
	});

	it('saves user name in profile data in mongoose model', function (done) {
		request(app)
			.post('/signup')
			.send({
				email: 'nickc@nickc.com',
				name: 'nick',
				password: 'secretsauce',
				confirmPassword: 'secretsauce'
			})
			.end(function (err, res) {
				if (err) return done(err);
				User.findOne({
					email: 'nickc@nickc.com'
				}, function (err, user) {
					if (err) return done(err);
					user.email.should.equal('nickc@nickc.com');
					user.name.should.equal('nick');
					return done();
				});
			});
	});

	it('duplicate user redirects to signup', function (done) {
		request(app)
			.post('/signup')
			.send({
				email: 'nickc@nickc.com',
				password: 'secretsauce',
			})
			.end(function (err, res) {
				if (err) return done(err);
				request(app)
					.post('/signup')
					.send({
						email: 'nickc@nickc.com',
						password: 'secretsauce',
					})
					.end(function (err, res) {
						if (err) return done(err);
						res.statusCode.should.equal(302);
						res.headers.should.have.property('location').equal('/signup');
						return done();
					});
			});
	});

	afterEach(function () {
		User.remove({}).exec();
	});
});