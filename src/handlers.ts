import { sendEmail } from './send-email/send-email';
import { report } from './report/report';
import { SendEmailEvent, ReportEvent, ReturnCode } from './api-interface';


export async function sendEmailHandler(event: SendEmailEvent) {
    return await catcher(sendEmail, event);
};

export async function reportHandler(event: ReportEvent) {
    return await catcher(report, event);
};

// TODO : en l'état quoi qui se passe la fonction lambda succeed, à gérer
async function catcher(functionToCatch: Function, event: any) {
    console.log(JSON.stringify(event));
    let body;
    try {
        if (event.headers) {
            body = JSON.parse(event.body);
            if (event.headers['Content-Type'] !== 'application/json' && event.headers['content-type'] !== 'application/json') {
                throw new Error(`invalid Content-Type ${JSON.stringify(event.headers)}`);
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
        if (err.message.startsWith(ReturnCode.MISSING_ARGUMENTS)) {
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
            body: JSON.stringify(err.message),
            isBase64Encoded: false
        };
    }

}