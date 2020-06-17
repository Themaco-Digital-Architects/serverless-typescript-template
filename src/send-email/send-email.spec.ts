import { sendEmail, ses } from './send-email';
import * as chai from 'chai';
import * as sinon from 'sinon';
const sinonTest = require('sinon-test')(sinon);
import 'mocha';
chai.use(require('chai-as-promised'));

import { SendEmailEvent } from '../api-interface';


const event: SendEmailEvent = {
    subject: "La castafiore",
    body: "Je ris de me voir si belle en ce miroir",
    emails: [
        "jean.guerin@themaco.fr",
        "contact@themaco.fr"
    ]
}


describe('Test send-email handler', () => {
    it('should succeed and call SES sendEmail', sinonTest(async function () {
        const stubSes = sinon.stub(ses, 'sendEmail').returns({ promise: () => Promise.resolve('success') });
        const result = await sendEmail(event);
        chai.expect(stubSes.calledOnce).to.be.true;
        chai.expect(result).to.be.equal('success');
    }))
});