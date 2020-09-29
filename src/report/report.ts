import { ReportEvent, ReturnCode, TopicId } from '../api-interface';
const AWSXRay = require('aws-xray-sdk-core');
import * as AWS from 'aws-sdk';
export const sns = AWSXRay.captureAWSClient(new AWS.SNS({ region: process.env.REGION }));

const topics: Map<TopicId, string | undefined> = new Map();
topics.set(TopicId.CONTACT, process.env.CONTACT_TOPIC);

/**
 * Send a notification with SNS service to a chosen endpoint
 * @return {Promise<{ MessageId: string }>} : return AWS promise request
 */
export async function report({ subject, body, topic }: ReportEvent): Promise<ReturnCode> {
    if (!subject || !body) {
        throw new Error(`${ReturnCode.MISSING_ARGUMENTS}: {subject:${subject} , body:${body}}`);
    }
    if (!topic) {
        topic = TopicId.CONTACT;
    }
    const params: AWS.SNS.PublishInput = {
        TopicArn: topics.get(topic),
        Message: body,
        Subject: subject
    };
    console.log(params);
    await sns.publish(params).promise();
    return ReturnCode.SUCCESS;
};
