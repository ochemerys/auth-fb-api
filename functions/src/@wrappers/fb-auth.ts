import * as admin from 'firebase-admin';

export async function createUser(args: admin.auth.CreateRequest): Promise<admin.auth.UserRecord> {
  return await admin.auth().createUser(args);
};

export async function listUsers(): Promise<admin.auth.ListUsersResult> {
  return await admin.auth().listUsers();
};

export async function setCustomUserClaims(uid:string, customUserClaims: Object | null): Promise<void> {
  await admin.auth().setCustomUserClaims(uid, customUserClaims);
  return;
};

export async function getUser(uid: string): Promise<admin.auth.UserRecord> {
  return await admin.auth().getUser(uid);;
};

export async function updateUser(uid: string, props: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> {
  return await admin.auth().updateUser(uid, props);
};

export async function deleteUser(uid:string): Promise<void> {
  await admin.auth().deleteUser(uid);
  return;
};
