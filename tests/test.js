// Import the dependencies for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index')

// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Contacts", () => {
    describe("GET /api/contacts", () => {
        // Test to get all contacts record
        it("should get all contacts record", (done) => {
             chai.request(app)
                 .get('/')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                  });
         });
        // Test to get single contact record
        it("should get a single contact record", (done) => {
             const id = '641878284fb93242b5ddfaf7';
             chai.request(app)
                 .get(`/${id}`)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                  });
         });
         
        // Test to get single contact record
        it("should not get a single contact record", (done) => {
             const id = 5;
             chai.request(app)
                 .get(`/${id}`)
                 .end((err, res) => {
                     res.should.have.status(404);
                     done();
                  });
         });
    });
});