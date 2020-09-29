import * as chai from 'chai';
import * as sinon from 'sinon';
import SinonTest = require('sinon-test');
const sinonTest = SinonTest(sinon);
import 'mocha';
chai.use(require('chai-as-promised'));
import { expect } from 'chai';

import { sendEmail, ses } from './send-email';
import { ReturnCode, SendEmailEvent } from '../api-interface';


const event: SendEmailEvent = {
    subject: "La castafiore",
    body: "Je ris de me voir si belle en ce miroir",
    emails: [
        "tintin@themaco.fr",
        "milou@themaco.fr"
    ]
}

describe('#send-email', () => {
    it('should succeed and call SES sendEmail', sinonTest(async function (this: sinon.SinonStatic) {
        const stubSes = this.stub(ses, 'sendEmail').returns({ promise: () => Promise.resolve() });
        const result = await sendEmail(event);
        expect(stubSes.calledOnce).to.be.true;
        expect(result).to.be.equal(ReturnCode.SUCCESS);
    }))
    it('should not tolerate the lack of body', sinonTest(async function (this: sinon.SinonStatic) {
        const stubSes = this.stub(ses, 'sendEmail');
        const fakeEvent = { ...event };
        delete fakeEvent.body
        expect(sendEmail(fakeEvent)).to.be.rejectedWith(ReturnCode.MISSING_ARGUMENTS);
        chai.expect(stubSes.notCalled).to.be.true;
    }))
});