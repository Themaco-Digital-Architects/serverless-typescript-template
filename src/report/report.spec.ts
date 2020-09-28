import * as chai from 'chai';
import * as sinon from 'sinon';
import SinonTest = require('sinon-test');
const sinonTest = SinonTest(sinon);
import 'mocha';
chai.use(require('chai-as-promised'));
import { expect } from 'chai';

import { report, sns } from './report';
import { ReportEvent, ReturnCode, TopicId } from '../api-interface';

function event(): ReportEvent {
    return {
        subject: "La castafiore",
        body: "Je ris de me voir si belle en ce miroir",
        topic: TopicId.CONTACT
    }
}

describe('#report', function () {
    it('should succeed and call SNS publish', sinonTest(async function (this: sinon.SinonStatic) {
        const stubSns = this.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        expect(await report(event())).to.be.equal(ReturnCode.SUCCESS);
        expect(stubSns.calledOnce).to.be.true;
    }))
    it('should succeed and call SNS publish even if topic isn t specified', sinonTest(async function (this: sinon.SinonStatic) {
        const stubSns = this.stub(sns, 'publish').returns({ promise: () => Promise.resolve() });
        const fakeEvent = event();
        delete fakeEvent.topic
        expect(await report(fakeEvent)).to.be.equal(ReturnCode.SUCCESS);
        expect(stubSns.calledOnce).to.be.true;
    }))
    it('should not tolerate the lack of body', sinonTest(async function (this: sinon.SinonStatic) {
        const stubSns = this.stub(sns, 'publish');
        const fakeEvent = event();
        delete fakeEvent.body
        await expect(report(fakeEvent)).to.be.rejectedWith(ReturnCode.MISSING_ARGUMENTS);
        expect(stubSns.notCalled).to.be.true;
    }))
});