import { sendEmail } from './send-email/send-email';
import { report } from './report/report';
import { SendEmailEvent, ReportEvent, ReturnCode } from './api-interface';

type HttpEvent = { body: object, headers: { 'Content-Type': ContentType, 'Access-Control-Allow-Origin': string }, isBase64Encoded: boolean }
type FunctionsEvent = SendEmailEvent | ReportEvent
export enum ContentType {
    JSON = 'application/json'
}

export async function sendEmailHandler(event: SendEmailEvent | HttpEvent) {
    return await catcher(sendEmail, event);
};

export async function reportHandler(event: ReportEvent | HttpEvent) {
    return await catcher(report, event);
};

// TODO : en l'état quoi qu'il se passe la fonction lambda succeed, à gérer
async function catcher(functionToCatch: Function, event: FunctionsEvent | HttpEvent) {
    console.log(JSON.stringify(event));
    let body;
    try {
        if (isHttpEvent(event)) {
            body = JSON.parse(JSON.stringify(event.body));
            if (event.headers['Content-Type'] !== ContentType.JSON) {
                throw new Error(`invalid Content-Type ${event.headers}`);
            };
        } else {
            body = event;
        }
        const response = await functionToCatch(body);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
            body: response,
            isBase64Encoded: false
        };
    } catch (err) {
        console.log(JSON.stringify(err));
        if (err.message?.startsWith(ReturnCode.MISSING_ARGUMENTS)) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
                body: err.message,
                isBase64Encoded: false
            };
        }
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: err.message ? JSON.stringify(err.message) : err,
            isBase64Encoded: false
        };
    }
}

function isHttpEvent(event: any): event is HttpEvent {
    return !!(event as HttpEvent).headers
}
