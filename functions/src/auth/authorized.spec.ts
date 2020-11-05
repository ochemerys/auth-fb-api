import { authRootUser } from '../config/app-env-variables';
import { isAuthorized } from './authorized';
import { Request, Response, NextFunction } from "express";

describe("isAuthorized", () => {

  let next: NextFunction;
  beforeEach(() => {
    next = jest.fn();
  });

  it("should authorize root user", () => {
    jest.mock('../config/app-env-config');
    const opts = { hasRole: [], allowSameUser: false }
    const res = {
      locals: { 
        email: authRootUser, // 'root-user-email@domain.com',
      }
    } as Partial<Response>;
    const req = {
      params: {}
    } as Partial<Request>;

    isAuthorized(opts)(<Request>req, <Response>res, next);

    expect(next).toHaveBeenCalled();
  }); 

  it("should authorize the same user", () => {
    const opts = { hasRole: [], allowSameUser: true }
    const res = {
      locals: { 
        uid: '123'
      }
    } as Partial<Response>;
    const req = {
      params: {id: '123'}
    } as Partial<Request>;
    isAuthorized(opts)(<Request>req, <Response>res, next);
    expect(next).toHaveBeenCalled();
  });  

  it("should authorize user with proper role", () => {
    const userRole: Array<'admin' | 'manager' | 'user'> = ['admin'];
    const opts = { hasRole: userRole, allowSameUser: false }
    const res = {
      locals: { 
        role: 'admin', 
      }
    } as Partial<Response>;
    const req = {
      params: {}
    } as Partial<Request>;
    isAuthorized(opts)(<Request>req, <Response>res, next);
    expect(next).toHaveBeenCalled();
  }); 
  
  // 403 access to the requested resource is forbidden
  it("should not authorize user without role", () => {
    const userRole: Array<'admin' | 'manager' | 'user'> = ['admin'];
    const opts = { hasRole: userRole, allowSameUser: false }
    const res = {
      locals: { 
      },
      status: jest.fn(() => res),
      send: jest.fn(() => res),
    } as Partial<Response>;
    const req = {
      params: {}
    } as Partial<Request>;

    isAuthorized(opts)(<Request>req, <Response>res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  }); 

  // 403 access to the requested resource is forbidden
  it("should not authorize user without valid role", () => {
    const userRole: Array<'admin' | 'manager' | 'user'> = ['admin'];
    const opts = { hasRole: userRole, allowSameUser: false }
    const res = {
      locals: { 
        role: 'test', 
      },
      status: jest.fn(() => res),
      send: jest.fn(() => res),
    } as Partial<Response>;
    const req = {
      params: {}
    } as Partial<Request>;

    isAuthorized(opts)(<Request>req, <Response>res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  }); 

});