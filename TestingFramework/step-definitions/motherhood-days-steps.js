module.exports = function () {

    this.When(/^I navigate to "([^"]*)"$/, function (url) {

        return helpers.loadPage(url);
    });

    this.Then(/^I navigate to Paetz motherhood$/, function (keywords) {

        // resolves if an item on the page contains text
        return driver.findElements(by.xpath("//button[contains(text(),'Paetz Motherhood')]"))
    });

    this.Then(/^I should see some results$/, function () {

        // driver wait returns a promise so return that
        return driver.wait(until.elementsLocated(by.css('div.g')), 10000).then(function() {

            // return the promise of an element to the following then.
            return driver.findElements(by.css('div.g'));
        })
        .then(function (elements) {

            // verify this element has children
            expect(elements.length).to.not.equal(0);
        });
    });
    this.Then(/^I take a screenshot$/, function (keywords) {

        // resolves if an item on the page contains text
        return driver.takeScreenshot().then(
            function(image, err) {
                require('fs').writeFile('out.png', image, 'base64', function(err) {
                    console.log(err);
                });
            }
        );
    });
};
