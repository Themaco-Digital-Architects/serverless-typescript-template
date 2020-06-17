import { SendEmailEvent } from '../api-interface';
const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
export const ses = new AWS.SES({ region: process.env.REGION });
const EMAILS = {
    source: process.env.SOURCE_EMAIL,
    reply_to: process.env.REPLY_TO_EMAIL
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
        throw new Error(`Missing argument: ${subject} , ${body} , ${emails}`);
    }
    const emailParams = buildEmailInfo(subject, body);
    const params = {
        Destination: {
            ToAddresses: emails
        },
        Message: {
            Body: {
                // Html: {
                //     Data: emailParams.emailBody.html
                // },
                Text: {
                    Data: emailParams.emailBody.txt
                }
            },
            Subject: {
                Data: emailParams.subject
            }
        },
        Source: emailParams.emailSource,
        ReplyToAddresses: emailParams.ReplyToAddresses
    };
    console.log(params);
    return await ses.sendEmail(params).promise();
};

function buildEmailInfo(subject: string, body: string) {
    return {
        'emailBody': { txt: body },
        'subject': subject,
        'emailSource': EMAILS.source,
        'ReplyToAddresses': [EMAILS.reply_to]
    };

}