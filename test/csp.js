var request = require('supertest');
var path = require('path');
var liveServer = require('..').start({
	root: path.join(__dirname, "data"),
	port: 0,
	open: false
});

describe('CSP tests', function(){
	it('should have modified CSP', function(done){
		request(liveServer)
			.get('/')
			.expect(/nonce-/i)
			.expect(200, done);
	});
	it('should replace connect-src \'none\', rather than adding to it', function (done) {
		request(liveServer)
			.get('/csp/connect-src-none.html')
			.expect(/connect-src ws:/i)
			.expect(200, done);
	});
	it('should extend connect-src', function (done) {
		request(liveServer)
			.get('/csp/connect-src.html')
			.expect(/connect-src\s+ws: wss: http: https:\s+ws:\/\/example.com/i)
			.expect(200, done);
	});
	it('should extend script-src, handling non-existent default-src', function (done) {
		request(liveServer)
			.get('/csp/no-default-src.html')
			.expect(/"script-src 'nonce-[\da-z]+' 'self'"/i)
			.expect(200, done);
	});
});
