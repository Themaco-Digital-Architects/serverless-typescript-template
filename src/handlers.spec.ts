
import * as chai from 'chai';
import * as sinon from 'sinon';
const sinonTest = require('sinon-test')(sinon);
import 'mocha';
chai.use(require('chai-as-promised'));
import { sendEmailHandler, reportHandler } from './handlers';
import { ReportEvent, ReturnCode, SendEmailEvent, TopicId } from './api-interface';
import { expect } from 'chai';
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
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    },
    isBase64Encoded: false
}


describe.only('#handlers', () => {
    it('should succeed and call SES sendEmail', sinonTest(async function () {
        const stubSes = sinon.stub(ses, 'sendEmail').returns({ promise: () => Promise.resolve() });
        expect(await sendEmailHandler(sendEmailEvent)).deep.equals(successResponse);
    }))
    it('should call the report Handler with success', sinonTest(async function () {
        // const stubSns = sinon.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        expect(await reportHandler(reportEvent)).deep.equals(successResponse);
    }))
    it('should get a 400 error', sinonTest(async function () {
        // const stubSns = sinon.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        const truncEvent = { ...reportEvent };
        delete truncEvent.subject
        const adaptResponse = { ...missingArgsResponse };
        adaptResponse.body = `${adaptResponse.body}: {subject:undefined , body:Je ris de me voir si belle en ce miroir}`
        expect(await reportHandler(truncEvent)).deep.equals(adaptResponse);
    }))
    it.skip('should get a 500 error', sinonTest(async function () {
        // const stubSns = sinon.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        const throwErrorEvent = { ...reportEvent };
        //@ts-ignore
        throwErrorEvent.topic = function () { throw new Error('blop') };
        expect(await reportHandler(throwErrorEvent)).deep.equals(internalErrorResponse);
    }))
});

const reportEvent: ReportEvent = {
    subject: "La castafiore",
    body: "Je ris de me voir si belle en ce miroir",
    topic: TopicId.CONTACT
};

const sendEmailEvent: SendEmailEvent = {
    subject: "La castafiore",
    body: "Je ris de me voir si belle en ce miroir",
    emails: [
        "jean.guerin@themaco.fr",
        "contact@themaco.fr"
    ]
}