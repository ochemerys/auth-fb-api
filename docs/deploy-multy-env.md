# Deploy to multiple environments with Firebase CLI

Adding and switching between environments with the Firebase CLI is one command: ```firebase use```.

## Adding a new environment

After first initialization of Firebase project with ```firebase init```, .firebasesrc file is created which contains the default alias for the project

```javascript
{
  "projects": {
    "default": "my-firebase-prod-project"
  }
}
```

This is a default project. In this case deployment by default will go to ***my-firebase-prod-project*** Firebase project.

We can specify which project we want to deploy our Functions to. The ```use``` command allows to add another project.

```shell
firebase use --add
```

Select the project from the list of available Firebase projects to use for a different environment, and then give it an alias (***staging*** for example). It adds ***staging*** alias to .firebasesrc file.

```javascript
{
  "projects": {
    "default": "my-firebase-prod-project",
    "staging": "my-firebase-staging-project"
  }
}
```

## Switching environments

To switch to another environment is just to provide the alias in the ```use``` command.

```shell
firebase use staging # sets environment to the staging alias
```

or

```shell
firebase use default # sets environment to the default alias
```

## Deployment to different environments

```deploy``` command can also specify the environment using the -P flag:

```shell
firebase deploy -P staging # deploy to staging alias
```
