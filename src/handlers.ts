import { sendEmail } from './send-email/send-email';
import { report } from './report/report';
import { SendEmailEvent, ReportEvent } from './api-interface';


export async function sendEmailHandler(event: SendEmailEvent) {
    return await catcher(sendEmail, event);
};

export async function reportHandler(event: ReportEvent) {
    return await catcher(report, event);
};

// TODO : en l'état quoi qui se passe la fonction lambda succeed, à gérer
// TODO : cover cette fonction
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
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(response),
            isBase64Encoded: false
        };
    } catch (err) {
        //TODO : distinguer erreur 400 et erreur 500
        console.log(JSON.stringify(err));
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(err.message),
            isBase64Encoded: false
        };
    }

}