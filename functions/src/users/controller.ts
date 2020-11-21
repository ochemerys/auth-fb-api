import * as admin from 'firebase-admin';
import { Request, Response } from "express";

import { AuthUser } from '../@types/auth-user';
import * as auth from '../@wrappers/fb-auth';
// import * as functions from 'firebase-functions';

export async function create(req: Request, res: Response) {
  try {
    // functions.logger.log('create:: req.body:', req.body);
    const { displayName, password, email, role } = JSON.parse(req.body);

    if (!displayName || !password || !email || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    const { uid } = await auth.createUser({
      displayName,
      password,
      email
    });

    await auth.setCustomUserClaims(uid, { role });

    return res.status(201).send({ uid });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function all(req: Request, res: Response) {
  try {
    const listUsers = await auth.listUsers();
    const users = listUsers.users.map(mapUser);
    return res.status(200).send({ users });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function get(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await auth.getUser(id);
    // functions.logger.log('patch:: user:', user);
    // functions.logger.log('patch:: mapped user:', mapUser(user));
    return res.status(200).send({ user: mapUser(user) });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function patch(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { displayName, password, email, role } = JSON.parse(req.body);

    if (!id || !displayName || !email || !role) {
        return res.status(400).send({ message: 'Missing fields' });
    }

    let userData;
    if (password) {
      userData = { displayName, password, email };
    } else {
      userData = { displayName, email };
    }
    await auth.updateUser(id, userData);
    await auth.setCustomUserClaims(id, { role });

    const user = await auth.getUser(id);
    // functions.logger.log('patch:: user:', mapUser(user));
    return res.status(200).send({ user: mapUser(user) });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params
    await auth.deleteUser(id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}

function mapUser(user: admin.auth.UserRecord): AuthUser {
  const customClaims = (user.customClaims || { role: '' }) as { role?: string }
  const role = customClaims.role ? customClaims.role : ''
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime
  }
}

function handleError(res: Response, err: any) {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}