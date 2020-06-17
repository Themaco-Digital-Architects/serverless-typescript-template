import { report, sns } from './report';
import * as chai from 'chai';
import * as sinon from 'sinon';
const sinonTest = require('sinon-test')(sinon);
import 'mocha';
chai.use(require('chai-as-promised'));

import { ReportEvent, TOPIC_ID } from '../api-interface';


function event(): ReportEvent {
    return {
        subject: "La castafiore",
        body: "Je ris de me voir si belle en ce miroir",
        topic: TOPIC_ID.CONTACT
    }
}


describe('Test send SNS handler', () => {
    it('should succeed and call SNS publish', sinonTest(async function () {
        const stubSns = sinon.stub(sns, 'publish').returns({ promise: () => Promise.resolve('success') });
        const result = await report(event());
        chai.expect(stubSns.calledOnce).to.be.true;
        chai.expect(result).to.be.equal('success');
    }))
    it('should succeed and call SNS publish without a topic', sinonTest(async function () {
        //const stubSns = sinon.stub(sns, 'publish').returns({ promise: () => Promise.resolve('success') });
        const eventItem = event();
        delete eventItem.topic;
        const result = await report(eventItem);
        //chai.expect(stubSns.calledOnce).to.be.true;
        chai.expect(result).to.be.equal('success');
    }))
});