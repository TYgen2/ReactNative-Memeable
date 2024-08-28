import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { tmpUser } from "../utils/constants.mjs";
import * as validator from "express-validator";
import * as helpers from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

// mocking the actual function
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    // can return whatever
    array: jest.fn(() => [{ msg: "Invalid WTF" }]),
  })),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password",
    displayName: "test_name",
  })),
}));

jest.mock("../utils/helpers.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock("../mongoose/schemas/user.mjs");

const mockReq = {
  findUserIndex: 1,
};

const mockRes = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  // e.g. res.status(400).send({ msg:"WTF" })
  // return mockRes can test the afterwards
  status: jest.fn(() => mockRes),
};

describe("get users", () => {
  it("should get user by id", () => {
    getUserByIdHandler(mockReq, mockRes);

    // check whether the function have been called
    expect(mockRes.send).toHaveBeenCalled();
    // check whether the recevied data matched the expected data
    expect(mockRes.send).toHaveBeenCalledWith(tmpUser[1]);
    // check how many times the function have been called
    expect(mockRes.send).toHaveBeenCalledTimes(1);
  });

  it("should call sendStatus with 404 when user not found", () => {
    const copyMockReq = { ...mockReq, findUserIndex: 100 };
    getUserByIdHandler(copyMockReq, mockRes);

    expect(mockRes.sendStatus).toHaveBeenCalled();
    expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
    expect(mockRes.sendStatus).toHaveBeenCalledTimes(1);
    // if sendStatus is called, send should not been called
    expect(mockRes.send).not.toHaveBeenCalled();
  });
});

describe("create users", () => {
  const mockReq = {};

  it("should return status 400 when there are errors", async () => {
    await createUserHandler(mockReq, mockRes);

    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockReq);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith([{ msg: "Invalid WTF" }]);
  });

  it("should return status 201 and the user created", async () => {
    // override the mock
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValueOnce({
        id: 1,
        username: "test",
        password: "hashed_password",
        displayName: "test_name",
      });

    await createUserHandler(mockReq, mockRes);

    expect(validator.matchedData).toHaveBeenCalledWith(mockReq);
    expect(helpers.hashPassword).toHaveBeenCalledWith("password");
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
    expect(User).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });

    expect(saveMethod).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.send).toHaveBeenCalledWith({
      id: 1,
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });
  });

  it("should return 400 when database fails to save user", async () => {
    // override the mock
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));
    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() => Promise.reject("Failed to save user"));
    await createUserHandler(mockReq, mockRes);

    expect(saveMethod).toHaveBeenCalled();
    expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
  });
});
