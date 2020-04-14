# aws-serverless-applications
:cloud: A deep study about serverless applications on aws

When we talk about **Serverless**, it basically means:
> You have a piece of code
>
> You want it to get executed by some event (HTTP, Topic Message, Cron, etc), only when this event happens
>
> You waits for an useful output

Example: 
- You have a brand that stores pictures, but in order to not get it expensive, you usually process the pictures to decrease its size
1. The picture is uploaded to AWS S3 (Bucket)
2. The AWS S3 triggers an event "PictureCreated"
3. The Lambda is invoked by the event "PictureCreated"
4. The Lambda processes the picture in order to decrease its size
5. The Lambda shuts down

In this study we'll be using the **Serverless Framework** which you can use for almost all the cloud platforms, with help of too many programming languages, such as **Javascript, C#, Python and so on**

## Summary

- [ Useful commands ](#useful-commands)
- [ How to init a project ](#how-to-init-a-project)
- [ Good practices ](#good-practices)

<a name="how-to-init-a-project"></a>

## How to init a project

After installing the framework, just type ```sls``` on terminal and follow the steps till you get your project started.

<a name="good-practices"></a>

## Good practices

1. After starting a new project, try to always get it deployed to the cloud asap in order to avoid some awful and unexpected environmental problems

<a name="useful-commands"></a>

## Useful commands
```sh
# Install the framework globally for javascript users
npm install -g serverless

# Init project
sls

# Deploy the project to the cloud
sls deploy

# Invoke the function on cloud
sls invoke -f $FUNCTION_NAME
# Ex: sls invoke hello

# Invoke the function locally
sls invoke local -f $FUNCTION_NAME
# Ex: sls invoke local -f hello

# Configure serverless dashboard
sls

# Listen for invocation logs (like a CloudWatch)
sls logs -f $FUNCTION_NAME -t
# Ex: sls logs -f hello -t
```
