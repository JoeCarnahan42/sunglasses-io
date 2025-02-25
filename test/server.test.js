const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app/server"); // Adjust the path as needed

const should = chai.should();
chai.use(chaiHttp);

// TODO: Write tests for the server
// Routes to support:
// GET: brands(DONE), brands/:id/products(DONE), products(DONE), me/cart
// POST: login, me/cart, me/cart/:productId
// DELETE: me/cart/:productId

describe("Brands", () => {
  describe("/GET brands", () => {
    it("should return all brands", (done) => {
      chai
        .request(server)
        .get("/brands")
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
        .get("/products")
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
        .get("/brands/1/products")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });
});

// describe("Login", () => {
//   describe("/POST login", () => {
//     it("should login successfully with correct credentials", (done) => {
//       // Write Test
//     });
//   });
// });

// describe("Cart", () => {
//   describe("/GET me/cart", () => {
//     it("should return all items in the cart if a user is logged in", (done) => {});
//   });

//   describe("/POST me/cart", () => {});

//   describe("/POST me/cart/:productId", () => {
//     it("should POST a specifit item to the cart", (done) => {});
//   });

//   describe("/DELETE me/cart/:productId", () => {
//     it("should DELETE a specific item from the cart", (done) => {});
//   });
// });
