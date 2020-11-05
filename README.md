# Auth Firebase micro-service

This is a boilerplate of Role-based micro-service API implemented as NodeJS Firebase Functions to authenticate and authorize users with firebase authentication.
It is designed for my FIrebase projects in particularly Task Management project.

## Setup

on 2020-10-20:

### Backend Firebase projects

Create Firebase projects:

- task-management : Production Environment
- task-management-stage : Stage Environments

### Set Stage project for development

Select "task-management-stage" project.
Set Firebase billing plan as "Blaze" "Pay as you go" to be able deploy serverless function.

On right side menu bar select Authentication item

- in "Sign-in method" tab enable "Email/Password"
- in "Users" tab add new root user

On right side menu bar select "Project overview" cog-weal "project settings" item.
Select Node.js under "Admin SDK configuration snippet" and "Generate new private key"
Database URL is there too.

### Set local application development environment

Install firebase-tools (firebase cli)

``` bash
npm install -g firebase-tools
```

Clone repository in local folder.

Create env.stage.json file under functions folder.

``` javascript
{
  "env": {
    "firebaseServiceAccount": {
      // content of generated private key goes here
    },
    "authRootUser": "root user email ",
    "firebaseDatabaseUrl": "https://your-task-management-stage-project-db-url"
  }
}
```

Open Terminal in project root and run

``` shell
npm install
```

### Deploy application to stage environment

Open Terminal in project root and run

``` shell
npm run deploy:stage
```

## Description

### Routes

|HTTP Verb|Path|Description|Authorization|
|---------|----|-----------|-------------|
|GET |/users |Lists all users |Only admins and managers have access|
|POST |/users |Creates new user |Only admins and managers have access|
|GET |/users/:id |Gets the :id user |Admins, managers, and the same user as :id have access|
|PATCH  |/users/:id |Updates the :id user |Admins, managers, and the same user as :id have access
|DELETE |/users/:id |Deletes the :id user |Admins, managers, and the same user as :id have access|

Inspired by  
How to Build a Role-based API with Firebase Authentication
https://www.toptal.com/firebase/role-based-firebase-authentication
