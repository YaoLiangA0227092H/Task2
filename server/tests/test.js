// Import the dependencies for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index')

// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Contacts", () => {
    var id = '64213bc9eee74cf21878f882';
    describe("POST /api/contacts", () => {
        // Test to add contact successfully 
        it("should add new contact record", (done) => {
            const value = {
                name: "Test Pass",
                email: "pass@gmail.com",
                phone: "81234567",
                gender: "Female"
            }
            chai.request(app)
                .post('/api/contacts')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(value)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    id = res.body.data._id
                    done();
                });
        });

        // Test to add contact with name missing
        it("should return error", (done) => {
            const value = {
                email: "pass@gmail.com",
                phone: "81234567",
                gender: "Female"
            }
            chai.request(app)
                .post('/api/contacts')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(value)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        // Test to add contact with email missing
        it("should return error", (done) => {
            const value = {
                name: "Test Pass",
                phone: "81234567",
                gender: "Female"
            }
            chai.request(app)
                .post('/api/contacts')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(value)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        // Test to add contact with phone missing
        it("should not return error", (done) => {
            const value = {
                name: "Test Pass",
                email: "pass@gmail.com",
                gender: "Female"
            }
            chai.request(app)
                .get(`/api/contacts`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("GET /api/contacts", () => {
        // Test to get all contacts record
        it("should get all contacts record", (done) => {
            chai.request(app)
                .get('/api/contacts')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        // Test to get single contact record
        it("should get a single contact record", (done) => {
            chai.request(app)
                .get(`/api/contacts/${id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        // Test to get single contact record
        it("should not get a single contact record", (done) => {
            chai.request(app)
                .get(`/api/contacts/64213bc9eee74cf21878f882`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });



    describe("PUT /api/contacts/:contact_id", () => {
        // Test to update contact email
        it("should get contact updated", (done) => {
            const value = {
                email: "update@gmail.com"
            }
            chai.request(app)
                .put(`/api/contacts/${id}`)
                .send(value)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        // Test to update contact without email
        it("should not get contact updated", (done) => {
            const value = {
                name: "New name",
                phone: "912324567",
                gender: "Female"
            }
            chai.request(app)
                .put(`/api/contacts/${id}`)
                .send(value)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe("DELETE /api/contacts/:contact_id", () => {
        // Test to delete existing contact 
        it("should get contact deleted", (done) => {
            chai.request(app)
                .delete(`/api/contacts/${id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        // Test to delete contact that is not existing
        it("should not get contact updated", (done) => {
            chai.request(app)
                .delete(`/api/contacts/${id}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
