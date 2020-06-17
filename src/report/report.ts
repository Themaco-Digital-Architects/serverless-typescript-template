import { ReportEvent, TOPIC_ID } from '../api-interface';
const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
export const sns = new AWS.SNS({ region: process.env.REGION });

const topics: Map<TOPIC_ID, string | undefined> = new Map();
topics.set(TOPIC_ID.CONTACT, process.env.CONTACT_TOPIC);

/**
 * Send a notification with SNS service to a chosen endpoint
 * @return {Promise<{ MessageId: string }>} : return AWS promise request
 */
export async function report({ subject, body, topic }: ReportEvent): Promise<any> {
    if (!subject || !body) {
        // TODO : passer erreur missing argument en lib
        throw new Error(`Missing argument: ${subject} , ${body}`);
    }
    if (!topic) {
        topic = TOPIC_ID.CONTACT;
    }
    const params = {
        TopicArn: topics.get(topic),
        Message: body,
        Subject: subject
    };
    console.log(params);
    return await sns.publish(params).promise();
};
