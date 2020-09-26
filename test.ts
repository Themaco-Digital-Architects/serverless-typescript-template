import * as chai from 'chai';

// Init. chai-as-promised for all tests files.
chai.use(require('chai-as-promised'));

describe("Launching unit tests", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });
    require('./src/report/report.spec');
    require('./src/send-email/send-email.spec');
    require('./src/handlers.spec');
});
