import { Request, Response } from "express";
import * as admin from 'firebase-admin';

import { create, all, get, patch, remove } from './controller';
import * as auth from '../@wrappers/fb-auth';

admin.initializeApp();

describe("user controller", () => {

  let res: Partial<Response>;
  let requestValidBody: any;
  let requestValidPartialBody: any;
  let errMessage: string;
  let missingMessage: string;
  beforeEach(() => {
    res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res),
    } as Partial<Response>;
    requestValidBody = {
      displayName: 'test user',
      password: 'P1SWD',
      email: 'test@tester.com',
      role: 'admin'
    };
    requestValidPartialBody = {
      displayName: 'test user',
      email: 'test@tester.com',
      role: 'admin'
    };
    errMessage = 'Something went wrong';
    missingMessage = 'Missing fields';
  });

  describe('create', () => {

    it("should not create invalid user", async () => {
      const req = {
        body: JSON.stringify({})
      };

      await create(<Request>req, <Response>res);

      expect(res.send).toHaveBeenCalledWith({ message: missingMessage });
      expect(res.status).toHaveBeenCalledWith(400);
    }); 

    it("should create valid user", async () => {
      const req = {
        body: JSON.stringify(requestValidBody)
      };

      const user: Partial<admin.auth.UserRecord> = {uid: 'A1SDF'};
      jest.spyOn(auth, 'createUser')
        .mockReturnValue(Promise.resolve(<admin.auth.UserRecord>user));
      jest.spyOn(auth, 'setCustomUserClaims').mockImplementation(() => Promise.resolve());

      await create(<Request>req, <Response>res);

      expect(res.send).toHaveBeenCalledWith({ uid: user.uid});
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should process errors", async () => {
      const req = {
        body: JSON.stringify(requestValidBody)
      };
  
      jest.spyOn(auth, 'createUser')
        .mockImplementation(() => {
          const err: any = new Error(errMessage);
          err.code = 'ERR'
          throw err;
        });
  
        await create(<Request>req, <Response>res);

        expect(res.send).toHaveBeenCalledWith({ message: `ERR - ${errMessage}` });
        expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('all', () => {
    it("should return a list of registered users", async () => {
      const req = {} as Partial<Request>;

      const users:any = {users: []}; 
      jest.spyOn(auth, 'listUsers')
        .mockReturnValue(Promise.resolve(users));

      await all(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(200);
    }); 

    it("should process errors", async () => {
      const req = {} as Partial<Request>;
  
      jest.spyOn(auth, 'listUsers')
        .mockImplementation(() => {
          const err: any = new Error(errMessage);
          err.code = 'ERR'
          throw err;
        });
  
        await all(<Request>req, <Response>res);

        expect(res.send).toHaveBeenCalledWith({ message: `ERR - ${errMessage}` });
        expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('get', () => {
    it("should return requested user", async () => {
      const req = {
        params: {id: 'ASD1FG'}
      } as Partial<Request>;

      const user: Partial<admin.auth.UserRecord> = {
        uid: 'A1B',
        customClaims: { 
          role: 'manager' 
        },
        metadata: {
          lastSignInTime: '2020-01-01',
          creationTime: '2002-01-01',
          toJSON: () => Object
        }
      }; 
      jest.spyOn(auth, 'getUser')
        .mockReturnValue(Promise.resolve(<admin.auth.UserRecord>user));

      await get(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(200);
    }); 

    it("should process errors", async () => {
      const req = {
        params: {id: 'ASD1FG'}
      } as Partial<Request>;
  
      jest.spyOn(auth, 'getUser')
        .mockImplementation(() => {
          const err: any = new Error(errMessage);
          err.code = 'ERR'
          throw err;
        });
  
        await get(<Request>req, <Response>res);

        expect(res.send).toHaveBeenCalledWith({ message: `ERR - ${errMessage}` });
        expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('patch', () => {
    it("should not update invalid user", async () => {
      const req = {
        params: {},
        body: JSON.stringify({})
      };

      await patch(<Request>req, <Response>res);

      expect(res.send).toHaveBeenCalledWith({ message: missingMessage });
      expect(res.status).toHaveBeenCalledWith(400);
    }); 

    it("should patch user with all valid properties", async () => {
      requestValidPartialBody
      const req = {
        params: {id: 'AS1DF'},
        body: JSON.stringify(requestValidBody)
      } as Partial<Request>;

      const user: Partial<admin.auth.UserRecord> = {
        uid: 'A1B',
        metadata: {
          lastSignInTime: '2020-01-01',
          creationTime: '2002-01-01',
          toJSON: () => Object
        }
      }; 
      jest.spyOn(auth, 'updateUser').mockImplementation(() => Promise.resolve(<admin.auth.UserRecord>user));
      jest.spyOn(auth, 'setCustomUserClaims').mockImplementation(() => Promise.resolve());
      jest.spyOn(auth, 'getUser')
        .mockReturnValue(Promise.resolve(<admin.auth.UserRecord>user));

      await patch(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should patch user with partial valid properties", async () => {
      const req = {
        params: {id: 'AS1DF'},
        body: JSON.stringify(requestValidPartialBody)
      } as Partial<Request>;

      const user: Partial<admin.auth.UserRecord> = {
        uid: 'A1B',
        metadata: {
          lastSignInTime: '2020-01-01',
          creationTime: '2002-01-01',
          toJSON: () => Object
        }
      }; 
      jest.spyOn(auth, 'updateUser').mockImplementation(() => Promise.resolve(<admin.auth.UserRecord>user));
      jest.spyOn(auth, 'setCustomUserClaims').mockImplementation(() => Promise.resolve());
      jest.spyOn(auth, 'getUser')
        .mockReturnValue(Promise.resolve(<admin.auth.UserRecord>user));

      await patch(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should process errors", async () => {
      const req = {
        params: {id: 'AS1DF'},
        body: JSON.stringify(requestValidBody)
      } as Partial<Request>;
  
      jest.spyOn(auth, 'updateUser')
        .mockImplementation(() => {
          const err: any = new Error(errMessage);
          err.code = 'ERR'
          throw err;
        });
  
        await patch(<Request>req, <Response>res);

        expect(res.send).toHaveBeenCalledWith({ message: `ERR - ${errMessage}` });
        expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('remove', () => {
    it("should remove existing user", async () => {
      const req = {
        params: {id: 'AS1DF'},
      } as Partial<Request>;

      jest.spyOn(auth, 'deleteUser').mockImplementation(() => Promise.resolve());

      await remove(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should process errors", async () => {
      const req = {
        params: {id: 'AS1DF'},
      } as Partial<Request>;
  
      jest.spyOn(auth, 'deleteUser')
        .mockImplementation(() => {
          const err: any = new Error(errMessage);
          err.code = 'ERR'
          throw err;
        });
  
        await remove(<Request>req, <Response>res);

        expect(res.send).toHaveBeenCalledWith({ message: `ERR - ${errMessage}` });
        expect(res.status).toHaveBeenCalledWith(500);
    });
  });

});
