# Themaco template - Serverless Application on Typescript
This project uses mainly AWS ressources. For git repository and code build, it is easily adaptable to other platforms (Github, Bitbucket...).
We aim to use as few dependencies as possible.
Scripts are not tested on Windows OS yet.

## Startup
1. Fork from [github project] (https://github.com/Themaco-Digital-Architects/serverless-typescript-template)
2. Create an AWS account and add you account credentials `aws configure`
3. Create a Git repository and set up pipeline with AWS deploy capabilities (cf : ./buildspec.yml:phases:build:commands)
4. Commit and push 


## Project presentation
This template is a starter project. It is designed to be a base for new projects, offers only a sample function.
- buildspec.yml : used by [Code pipeline from AWS] (https://aws.amazon.com/fr/codepipeline/), test, build and deploy with [Cloudformation] (https://aws.amazon.com/fr/cloudformation/).
- env.json : NOT IMPLEMENTED YET
- package.json : standard in javascript projects. mostly interesting for **scripts**
- template.yml : [SAM from AWS](https://docs.aws.amazon.com/serverless-application-model/) is based on this to deploy on AWS Cloudformation. New functions, APIs, Layers, should be added to this file.
- ./src : this folder contains both .spec.ts and src .ts. At root you can find common files which will be presented later on.
- many folders are generated during test, build and deployement but are included in .gitignore, don't need to be presented. 

## Tests
# Test framework
We use [MochaJs] (https://mochajs.org/) as test framework
We believe that maintaining a 100% coverage is a good practice to ensure code reliability. That why this rule is hard code in `npm run test`. You must remove it from there if it is inconvient for your work. NOT IMPLEMENTED YET.

# SAM tests
SAM, based on a Docker, offers the possibility to locally tests function. You need to follow [AWS CLI] (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-test-and-debug.html) set up instruction. On visual studio code, for example, a AWS toolkit also necessary (amazonwebservices.aws-toolkit-vscode). 
It is mandatory to use `npm run sam`.
You should be able to use breakpoint on your code. NOT IMPLEMENTED YET

## Proposed architecture

# Scripts explanations