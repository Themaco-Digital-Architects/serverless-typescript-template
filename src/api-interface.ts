// Must be sync with website/src/app/api-interface on website project

export interface SendEmailEvent {
    subject: string;
    body: string;
    emails: Array<string>; // email address list
};

export interface ReportEvent {
    subject: string;
    body: string;
    topic?: TOPIC_ID; // SNS Topic Arn
};

export enum TOPIC_ID {
    CONTACT = 'CONTACT'
}