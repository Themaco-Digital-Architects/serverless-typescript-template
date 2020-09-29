import * as chai from 'chai';
import * as sinon from 'sinon';
import SinonTest = require('sinon-test');
const sinonTest = SinonTest(sinon);
import 'mocha';
chai.use(require('chai-as-promised'));
import { expect } from 'chai';

import { sendEmailHandler, reportHandler, ContentType } from './handlers';
import { ReportEvent, ReturnCode, SendEmailEvent, TopicId } from './api-interface';
import { ses } from './send-email/send-email';
import { sns } from './report/report';

const successResponse = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    },
    body: ReturnCode.SUCCESS,
    isBase64Encoded: false
}

const missingArgsResponse = {
    statusCode: 400,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    },
    body: `${ReturnCode.MISSING_ARGUMENTS}`,
    isBase64Encoded: false
}

const internalErrorResponse = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: 'newError',
    isBase64Encoded: false
}

const wrongContentTypeResponse = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: "\"invalid Content-Type [object Object]\"",
    isBase64Encoded: false
}



describe('#handlers', () => {
    it('should succeed and call SES sendEmail', sinonTest(async function (this: sinon.SinonStatic) {
        this.stub(ses, 'sendEmail').returns({ promise: () => Promise.resolve() });
        expect(await sendEmailHandler(sendEmailEvent)).deep.equals(successResponse);
    }))
    it('should call the report Handler with success', sinonTest(async function (this: sinon.SinonStatic) {
        this.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        expect(await reportHandler(reportEvent)).deep.equals(successResponse);
    }))
    it('should call the report with an httpEvent with success', sinonTest(async function (this: sinon.SinonStatic) {
        this.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        expect(await reportHandler(reportEventHTTP)).deep.equals(successResponse);
    }))
    it('should get a 500 error due to invalid calling header', sinonTest(async function (this: sinon.SinonStatic) {
        const httpEventWError = { ...reportEventHTTP };
        // @ts-ignore
        httpEventWError.headers["Content-Type"] = 'blob';
        expect(await reportHandler(httpEventWError)).deep.equals(wrongContentTypeResponse);
    }))
    it('should get a 400 error', sinonTest(async function (this: sinon.SinonStatic) {
        const truncEvent = { ...reportEvent };
        delete truncEvent.subject
        const adaptResponse = { ...missingArgsResponse };
        adaptResponse.body = `${adaptResponse.body}: {subject:undefined , body:Je ris de me voir si belle en ce miroir}`
        expect(await reportHandler(truncEvent)).deep.equals(adaptResponse);
    }))
    it('should get a 500 error', sinonTest(async function (this: sinon.SinonStatic) {
        this.stub(sns, 'publish').returns({ promise: () => Promise.reject(internalErrorResponse.body) });
        expect(await reportHandler(reportEvent)).deep.equals(internalErrorResponse);
    }))
});

const reportEventHTTP = {
    headers: {
        'Content-Type': ContentType.JSON,
        'Access-Control-Allow-Origin': '*'
    },
    body: {
        subject: "La castafiore",
        body: "Je ris de me voir si belle en ce miroir",
        topic: TopicId.CONTACT
    },
    isBase64Encoded: false
};


const reportEvent: ReportEvent = {
    subject: "La castafiore",
    body: "Je ris de me voir si belle en ce miroir",
    topic: TopicId.CONTACT
};

const sendEmailEvent: SendEmailEvent = {
    subject: "La castafiore",
    body: "Je ris de me voir si belle en ce miroir",
    emails: [
        "tintin@themaco.fr",
        "milou@themaco.fr"
    ]
}