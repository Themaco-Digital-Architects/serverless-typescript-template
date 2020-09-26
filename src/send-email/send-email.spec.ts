import { sendEmail, ses } from './send-email';
import * as chai from 'chai';
import * as sinon from 'sinon';
const sinonTest = require('sinon-test')(sinon);
import 'mocha';
chai.use(require('chai-as-promised'));

import { ReturnCode, SendEmailEvent } from '../api-interface';


const event: SendEmailEvent = {
    subject: "La castafiore",
    body: "Je ris de me voir si belle en ce miroir",
    emails: [
        "jean.guerin@themaco.fr",
        "contact@themaco.fr"
    ]
}

describe('#send-email', () => {
    it('should succeed and call SES sendEmail', sinonTest(async function () {
        const stubSes = sinon.stub(ses, 'sendEmail').returns({ promise: () => Promise.resolve() });
        const result = await sendEmail(event);
        chai.expect(stubSes.calledOnce).to.be.true;
        chai.expect(result).to.be.equal(ReturnCode.SUCCESS);
    }))
    it('should not tolerate the lack of body', sinonTest(async function () {
        //const stubSes = sinon.stub(ses, 'sendEmail').returns({ promise: () => Promise.resolve() });
        const fakeEvent = { ...event };
        delete fakeEvent.body
        chai.expect(sendEmail(fakeEvent)).to.be.rejectedWith(ReturnCode.MISSING_ARGUMENTS);
        // TODO : sinonTest ne semble pas encapsuler chaque test, impossible de restub sns
        //chai.expect(stubSes.calledOnce).to.be.true;
    }))
});