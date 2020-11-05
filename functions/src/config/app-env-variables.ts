import * as functions from 'firebase-functions';

let authRootUser = '';

const config = functions.config();

if(config['env']) {
  authRootUser = config.env.authRootUser;
}

export { authRootUser };

