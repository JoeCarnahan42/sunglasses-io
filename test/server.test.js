const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app/server"); // Adjust the path as needed

const should = chai.should();
chai.use(chaiHttp);

// TODO: Write tests for the server
// Routes to support:
// GET: brands(DONE), brands/:id/products(DONE), products(DONE), me/cart(DONE)
// POST: login(DONE), me/cart - post item to the cart, me/cart/:productId - change quantity of item in cart
// DELETE: me/cart/:productId - remove item from cart

describe("Brands", () => {
  describe("/GET brands", () => {
    it("should GET an array of brands with id's when there are any", (done) => {
      const brands = [{ id: "1", name: "Nike" }];
      // Figure out how to implement negative test
      chai
        .request(server)
        .get("/api/brands")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.greaterThan(0);
          done();
        });
    });
  });
  describe("/GET products", () => {
    it("should GET all products", (done) => {
      chai
        .request(server)
        .get("/api/products")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });
  describe("/GET brands/:id/products", () => {
    it("should GET all products of specified brand", (done) => {
      chai
        .request(server)
        .get("/api/brands/1/products")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });
});

describe("Login", () => {
  describe("/POST login", () => {
    it("should login successfully with correct credentials", (done) => {
      // Write Test
      const loginCreds = {
        username: "yellowleopard753",
        password: "jonjon",
      };

      chai
        .request(server)
        .post("/api/login")
        .send(loginCreds)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("string");
          done();
        });
    });
    it("should fail if credentials are incorrect", (done) => {
      const loginCreds = {
        username: "incorrect",
        password: "wrongPass",
      };

      chai
        .request(server)
        .post("/api/login")
        .send(loginCreds)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("error");
          done();
        });
    });
    it("should fail if a username is not entered", (done) => {
      const loginCreds = {
        password: "jonjon",
      };

      chai
        .request(server)
        .post("/api/login")
        .send(loginCreds)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("error");
          done();
        });
    });
    it("should fail if a password is not entered", (done) => {
      const loginCreds = {
        username: "yellowleopard753",
      };

      chai
        .request(server)
        .post("/api/login")
        .send(loginCreds)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("error");
          done();
        });
    });
  });
});

describe("Cart", () => {
  describe("/api/me/cart", () => {
    it("should return a cart array", (done) => {
      chai
        .request(server)
        .get("/api/me/cart")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });
});
