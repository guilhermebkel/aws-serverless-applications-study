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

- [ Projects inside this repository ](#projects-inside-this-repository)
- [ How to init a project ](#how-to-init-a-project)
- [ Good practices ](#good-practices)
- [ Useful commands ](#useful-commands)
- [ Common errors ](#common-errors)

<a name="projects-inside-this-repository"></a>

## Projects inside this repository

1. **image-analysis:** A lambda the makes a simple image analysis based on the image url sent to it via HTTP Request.
```sh
# patterns
- Factory Programming Pattern

# aws
- AWS Rekognition
- AWS Translate

# libs
- Axios.js
```
2. **dynamo-event-source:** A lambda triggered by the event of putting data on DynamoDB.
```sh
# patterns
- Decorator Programming Pattern
- Factory Programming Pattern
- Serverless Mocked Data Test Pattern

# aws
- AWS DynamoDB

# libs
- Joi.js
```
3. **scheduler:** A cron lambda that gets invoked to read random website page data.
```sh
# patterns
- Multiple Environments Pattern
- Serverless Modulated Configuration Pattern

# aws
- AWS DynamoDB

# libs
- Axios.js
- Cheerio.js
```

4. **meme-maker:** A lambda that receives a image url and some text in order to turn it into a meme.
```sh
# patterns
- Decorator Programming Pattern
- Serverless Mocked Data Test Pattern

# aws
- AWS Lambda Layers

# libs
- Axios.js
- Joi.js
- GraphicsMagick
```

4. **stream-processing:** A lambda that processes data by chunk using SQS and S3 services.
```sh
# patterns
- Factory Programming Pattern
- Serverless Mocked Data Test Pattern

# aws
- AWS S3
- AWS SQS

# libs
- LocalStack
```

<a name="how-to-init-a-project"></a>

## How to init a project

After installing the framework, just type ```sls``` on terminal and follow the steps till you get your project started.

<a name="good-practices"></a>

## Good practices

1. After starting a new project, try to always get it deployed to the cloud asap in order to avoid some awful and unexpected environmental problems

2. Trigger the lambda on the cloud and mock the received data, in order to make all your tests around it.
<a name="common-errors"></a>

## Common errors

1. My docker is running, I use the flag **--docker** with **sls** command and still receive the error: ```Please start the Docker daemon to use the invoke local Docker integration.```
- Solution: Execute the command as root user (add **sudo** before the command).

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
sls dashboard

# Listen for invocation logs (like a CloudWatch)
sls logs -f $FUNCTION_NAME -t
# Ex: sls logs -f hello -t

# Make requests to invoke function based on the request.json file
sls invoke local -f $FUNCTION_NAME --path request.json
# Ex: sls invoke local -f image-analysis --path request.json

# Setup aws credentials for serverless framework
serverless config credentials --provider aws --key $YOUR_ACCESS_KEY --secret $YOUR_SECRET_KEY
```
