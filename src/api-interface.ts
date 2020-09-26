// Must be sync with website/src/app/api-interface on website project

export interface SendEmailEvent {
    subject: string;
    body: string;
    emails: Array<string>; // email address list
};

export interface ReportEvent {
    subject: string;
    body: string;
    topic?: TopicId; // SNS Topic Arn
};

export enum TopicId {
    CONTACT = 'CONTACT'
}

export enum ReturnCode {
    SUCCESS = 'Success',
    MISSING_ARGUMENTS = 'Missing arguments'
}