import { report, sns } from './report';
import * as chai from 'chai';
import * as sinon from 'sinon';
const sinonTest = require('sinon-test')(sinon);
import 'mocha';
chai.use(require('chai-as-promised'));

import { ReportEvent, ReturnCode, TopicId } from '../api-interface';

function event(): ReportEvent {
    return {
        subject: "La castafiore",
        body: "Je ris de me voir si belle en ce miroir",
        topic: TopicId.CONTACT
    }
}

describe('#report', function () {
    it('should succeed and call SNS publish', sinonTest(async function () {
        const stubSns = sinon.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        chai.expect(await report(event())).to.be.equal(ReturnCode.SUCCESS);
        chai.expect(stubSns.calledOnce).to.be.true;
    }))
    it('should succeed and call SNS publish even if topic isn t specified', sinonTest(async function () {
        const stubSns = sinon.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        const fakeEvent = event();
        delete fakeEvent.topic
        chai.expect(await report(fakeEvent)).to.be.equal(ReturnCode.SUCCESS);
        chai.expect(stubSns.calledOnce).to.be.true;
    }))
    it('should not tolerate the lack of body', sinonTest(async function () {
        const stubSns = sinon.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        const fakeEvent = event();
        delete fakeEvent.body
        chai.expect(await report(fakeEvent)).to.be.rejectedWith(ReturnCode.MISSING_ARGUMENTS);
        chai.expect(stubSns.calledOnce).to.be.true;
    }))
});