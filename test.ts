describe("Launching unit tests", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });
    require('./src/report/report.spec');
    require('./src/send-email/send-email.spec');
    require('./src/handlers.spec');
});
