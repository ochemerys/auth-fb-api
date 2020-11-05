import { isAuthenticated } from './authenticated';
import { Request, Response, NextFunction } from "express";
import * as admin from 'firebase-admin';

admin.initializeApp();

describe("isAuthenticated", () => {

  let next: NextFunction;
  let res: Partial<Response>;
  let unAuthMessage: string;
  beforeEach(() => {
    next = jest.fn();
    res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res)
    } as Partial<Response>;
    unAuthMessage = 'Unauthorized';
  });

  it("should authenticate logged user", async () => {
    res.locals = {}
    const req = {
      headers: {authorization: 'Bearer H1J2G3F4D5F6G7HG'}
    } as Partial<Request>;

    const decodedToken = {
      uid: 'AS1DFG',
      role: 'admin',
      email: 'test@tester.com'
    } as Partial<admin.auth.DecodedIdToken>;

    jest.spyOn(admin.auth(), 'verifyIdToken')
      .mockReturnValue(Promise.resolve(<admin.auth.DecodedIdToken>decodedToken));
  
    await isAuthenticated(<Request>req, <Response>res, next);

    expect(next).toHaveBeenCalled();
  }); 

  it("should not authenticate request without authentication token", async () => {
    const req = {
      headers: {}
    } as Partial<Request>;

    await isAuthenticated(<Request>req, <Response>res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({ message: unAuthMessage });
    expect(res.status).toHaveBeenCalledWith(401);
  });  

  it("should not authenticate request with invalid type of authentication token", async () => {
    const req = {
      headers: {authorization: 'H1J2G3F4D 5F6G7HG'}
    } as Partial<Request>;

    await isAuthenticated(<Request>req, <Response>res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({ message: unAuthMessage });
    expect(res.status).toHaveBeenCalledWith(401);
  }); 


  it("should not authenticate request with invalid authentication token", async () => {
    const req = {
      headers: {authorization: 'Bearer:H1J2G3F4D5F6G7HG'}
    } as Partial<Request>;

    await isAuthenticated(<Request>req, <Response>res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({ message: unAuthMessage });
    expect(res.status).toHaveBeenCalledWith(401);
  }); 

  it("should not authenticate request with unverifiable authentication token", async () => {
    const req = {
      headers: {authorization: 'Bearer H1J2G3F4D5F6G7HG'}
    } as Partial<Request>;

    const decodedToken = {} as Partial<admin.auth.DecodedIdToken>;
    jest.spyOn(admin.auth(), 'verifyIdToken')
      .mockReturnValue(Promise.reject(<admin.auth.DecodedIdToken>decodedToken));

    await isAuthenticated(<Request>req, <Response>res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({ message: unAuthMessage });
    expect(res.status).toHaveBeenCalledWith(401);
  });
  
  it("should process errors", async () => {
    const req = {
      headers: {authorization: 'Bearer H1J2G3F4D5F6G7HG'}
    } as Partial<Request>;

    jest.spyOn(admin.auth(), 'verifyIdToken')
      .mockImplementation(() => {
        throw new Error();
      });

    await isAuthenticated(<Request>req, <Response>res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({ message: unAuthMessage });
    expect(res.status).toHaveBeenCalledWith(401);
  });

});