import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Application } from "express";

function initFirebaseApp(app: Application): functions.HttpsFunction {

  let appOptions:any = undefined;
  
  const config = functions.config();
  
  if(config['env']) {
    appOptions = {
      credential: admin.credential.cert(config.env.firebaseServiceAccount),
      databaseURL: config.env.firebaseDatabaseUrl
    };
  }
  admin.initializeApp(appOptions);

  return functions.https.onRequest(app);
}

export default initFirebaseApp;

