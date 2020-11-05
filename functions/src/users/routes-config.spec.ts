import express, { Application } from "express";

import { routesConfig } from './routes-config';

// mock controller dependency
jest.mock('./controller', () => ({
  __esModule: true,
  create: jest.fn(),
  all: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  remove: jest.fn()
}));

// mock authenticated dependency
jest.mock('../auth/authenticated', () => ({
  __esModule: true,
  isAuthenticated: jest.fn()
}));

// mock authorized dependency
jest.mock('../auth/authorized', () => ({
  __esModule: true,
  isAuthorized: () => jest.fn()
}));

// jest.mock('../auth/authorized', () => {
//   const actualModule = jest.requireActual('../auth/authorized'); 
//   return {
//     ...actualModule,
//     isAuthorized: () => jest.fn()
//   };
// });

// jest.mock('../auth/authorized');
// import { isAuthorized } from '../auth/authorized';
// const mockedIsAuthorized = isAuthorized as jest.MockedFunction< typeof isAuthorized>;



describe("router-config", () => {

  it("should implement post, get, patch, delete routes", () => {
    const app: Application = express();

    jest.spyOn(app, 'post');
    jest.spyOn(app, 'get');
    jest.spyOn(app, 'patch');
    jest.spyOn(app, 'delete');

    const callbackArray = [ 
      expect.any(Function), 
      expect.any(Function),
      expect.any(Function) ];

    routesConfig(app);

    expect(app.post).toHaveBeenCalledWith('/users', callbackArray);

    // TODO:
    // expect(mockedIsAuthorized).toHaveBeenCalledWith({ hasRole: ['admin', 'manager'] });
    
    expect(app.get).toHaveBeenCalledWith('/users/:id', callbackArray);
    expect(app.get).toHaveBeenCalledWith('/users', callbackArray);
    expect(app.patch).toHaveBeenCalledWith('/users/:id', callbackArray);
    expect(app.delete).toHaveBeenCalledWith('/users/:id', callbackArray);
  }); 

});