"use strict";

process.env.SECRET = "toes";
///08
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Sequelize, DataTypes } = require("sequelize");
const base64 = require("base-64");
// const UsersSchema = require("../src/models/users");
const { users } = require("../src/models/");
///
const supertest = require("supertest");

const server = require("../src/server").server;
const { db } = require("../src/models/index");

const mockRequest = supertest(server);

//08
const sequelize = new Sequelize("postgres://postgres@localhost:5432/testing");
// const food = UsersSchema(sequelize, DataTypes);
// const clothes = UsersSchema(sequelize, DataTypes);
// const users = UsersSchema(sequelize, DataTypes);

beforeAll(async () => {
  await sequelize.sync;
});
afterAll(async () => {
  await sequelize.drop;
});
//

// let users = {
//   admin: { username: "admin", password: "password" },
//   editor: { username: "editor", password: "password" },
//   user: { username: "user", password: "password" },
// };

// beforeAll(async (done) => {
//   await db.sync();
//   done();
// });
// afterAll(async (done) => {
//   await db.drop();
//   done();
// });

// describe("Auth Router", () => {
//   Object.keys(users).forEach((userType) => {

describe(` test`, () => {
  // nnnn
  //   it("can create one", async (done) => {
  //     let userInfo = {
  //       username: "gggg",
  //       password: "0000",
  //       role: "writer",
  //     };

  //     let user = await users.create(userInfo);
  //     let isValid = await bcrypt.compare(userInfo.password, user.password);
  //     // const response = await mockRequest.post("/signup").send(users[userType]);
  //     // const userObject = response.body;

  //     expect(isValid.status).toBe(201);
  //     expect(user.id).toBeTruthy();
  //     expect(isValid).toBeTruthy();
  //     // expect(userObject.user.username).toEqual(users[userType].username);
  //     // done();
  //   });
  it("can create one", async (done) => {
    const response = await mockRequest.post("/signup").send(users[userType]);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(users[userType].username);
    done();
  });
  it("can signin with basic", async (done) => {
    const response = await mockRequest
      .post("/signin")
      .auth(users[userType].username, users[userType].password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(users[userType].username);
    done();
  });

  it("can signin with bearer", async (done) => {
    // First, use basic to login to get a token
    const response = await mockRequest
      .post("/signin")
      .auth(users[userType].username, users[userType].password);

    const token = response.body.token;

    // First, use basic to login to get a token
    const bearerResponse = await mockRequest
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    // Not checking the value of the response, only that we "got in"
    expect(bearerResponse.status).toBe(200);
    done();
  });
});

describe("bad logins", () => {
  it("basic fails with known user and wrong password ", async (done) => {
    const response = await mockRequest.post("/signin").auth("admin", "xyz");
    const userObject = response.body;

    expect(response.status).toBe(403);
    expect(userObject.user).not.toBeDefined();
    expect(userObject.token).not.toBeDefined();
    done();
  });

  it("basic fails with unknown user", async (done) => {
    const response = await mockRequest.post("/signin").auth("nobody", "xyz");
    const userObject = response.body;

    expect(response.status).toBe(403);
    expect(userObject.user).not.toBeDefined();
    expect(userObject.token).not.toBeDefined();
    done();
  });

  it("bearer fails with an invalid token", async (done) => {
    // First, use basic to login to get a token
    const bearerResponse = await mockRequest
      .get("/users")
      .set("Authorization", `Bearer foobar`);

    // Not checking the value of the response, only that we "got in"
    expect(bearerResponse.status).toBe(403);
    done();
  });
});
//   });
// });
