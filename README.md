# Auth Firebase micro-service

This is my boilerplate Role-based micro-service API implemented as NodeJS Firebase Functions to authenticate and authorize users with firebase authentication.
It is a authorization micro-service of Task Management Firebase project.

## Setup

### Backend Firebase projects

Create Firebase projects:

- task-management : Production Environment
- task-management-stage : Stage Environments

### Configuration

on 2020-10-20:

Go to Project Settings - "Service accounts" tab
In "Admin SDK configuration snippet" section select "Node js"
Copy databaseURL

### Install

Install firebase-tools

Open Terminal, go to project root and run

``` shell
npm install
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
