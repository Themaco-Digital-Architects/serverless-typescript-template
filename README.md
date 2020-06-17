# Themaco template - Serverless Application with Typescript
This project uses mainly AWS ressources. For git repository and code build, it is easily adaptable to other platforms (Github, Bitbucket...).
We aim to use as few dependencies as possible.
Scripts are not tested on Windows OS yet.

## Startup
1. Fork from [github project](https://github.com/Themaco-Digital-Architects/serverless-typescript-template)
2. Create an AWS account and add you account credentials `aws configure`
3. In code, search for XXX and replace value with your own.
4. Create a Git repository and set up pipeline with AWS deploy capabilities (cf : ./buildspec.yml:phases:build:commands)
5. Commit and push 

**Warning** : Be careful to check the IAM policy between different service and in particular the PermissionsBoundary


## Project presentation
This template is a starter project. It is designed to be a base for new projects, offers only a sample function.
- buildspec.yml : used by [Code pipeline from AWS](https://aws.amazon.com/fr/codepipeline/), test, build and deploy with [Cloudformation](https://aws.amazon.com/fr/cloudformation/).
- env.json : NOT IMPLEMENTED YET
- package.json : standard in javascript projects. mostly interesting for **scripts**
- template.yml : [SAM from AWS](https://docs.aws.amazon.com/serverless-application-model/) is based on this to deploy on AWS Cloudformation. New functions, APIs, Layers, should be added to this file.
- ./src : this folder contains both .spec.ts and src .ts. At root you can find common files which will be presented later on.
- many folders are generated during test, build and deployement but are included in .gitignore, don't need to be presented. 

## Tests
### Test framework
We use [MochaJs](https://mochajs.org/) as test framework
We believe that maintaining a 100% coverage is a good practice to ensure code reliability. That why this rule is hard code in `npm run test`. You must remove it from there if it is inconvient for your work. NOT IMPLEMENTED YET.

### SAM tests - run locally
SAM, based on a Docker, offers the possibility to locally tests function. You need to follow [AWS CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-test-and-debug.html) set up instruction. On visual studio code, for example, a AWS toolkit also necessary (amazonwebservices.aws-toolkit-vscode). 
It is mandatory to use `npm run sam`.
You should be able to use breakpoint on your code. NOT IMPLEMENTED YET

### AWS console tests
The structure allow you to develop directy on AWS console. This could be very useful to test for example interaction with other service, response to an API request... This is a good alternative to SAM run locally.

## Proposed architecture
Following the template file :  
- Layers : We only created one layer but other layers are very easy to add. The NodeModuleLayer allow you to run code with very low size on AWS, and nice thing to have, to debug directly on AWS website as the code is below 3 MBytes.
- ApiGatewayAPI : We defined an API which can be linked with any lambda function. This part is quite tricky to configure. The testFunction, which has only InlineCode, is provided to quick check that API is available.
- reportFunction : Lambda **example function**. This function should publish on an SNS topic when call with a API POST request.

./src/ structure : 
The idea here was to get close of an angular.io structure (for example). 
- Each lambda function has its owns folder (./src/*/), with the src code (`*.ts`), the test code (`*.spec.ts`) and an event example (`*.event.json`). 
- Route files are common for all functions. 
- - Handlers contains invocation function but also the error handler / catcher. 
- - api-interface.ts is file shared with the front (should be in a share library) to have TS type on interface request.

## Scripts explanations
