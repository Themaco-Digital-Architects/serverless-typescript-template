import { ReturnCode, SendEmailEvent } from '../api-interface';
const AWSXRay = require('aws-xray-sdk-core');
import * as AWS from 'aws-sdk';
export const ses = AWSXRay.captureAWSClient(new AWS.SES({ region: process.env.REGION }));
const EMAILS = {
    source: process.env.SOURCE_EMAIL as string,
    reply_to: process.env.REPLY_TO_EMAIL as string
}

/**
 * Send an email via Amazon SES service
 * @param {Object} emailData : data of the email
 * @param {Object[]} emailsLists : list of emails to send it
 * @return {Promise<{ MessageId: string }>} : return AWS promise request
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
 */
export async function sendEmail({ subject, body, emails }: SendEmailEvent): Promise<any> {
    if (!subject || !body || emails.length === 0) {
        throw new Error(`${ReturnCode.MISSING_ARGUMENTS}:{ subject:${subject}, body:${body}, emails:${emails}}`);
    }
    const params: AWS.SES.SendEmailRequest = {
        Destination: {
            ToAddresses: emails
        },
        Message: {
            Body: {
                Text: {
                    Data: body
                }
            },
            Subject: {
                Data: subject
            }
        },
        Source: EMAILS.source,
        ReplyToAddresses: [EMAILS.reply_to]
    };
    console.log(params);
    await ses.sendEmail(params).promise();
    return ReturnCode.SUCCESS;
};
