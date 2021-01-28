'use strict';
 
const assert = require('cucumber-assert');
const webdriver = require('selenium-webdriver');
const { urlIs } = require('selenium-webdriver/lib/until');
 
module.exports = function() {
 
  this.When(/^visit url "([^"]*)"$/, function (url, next) {
    this.driver.get(url).then(next);
  });
 
  this.When(/^field with name "First Item" is present check the box$/, function (next) {
      this.driver.findElement({ name: 'li1' })
      .click().then(next);
  });
 
  this.When(/^field with name "Second Item" is present check the box$/, function (next) {
      this.driver.findElement({ name: 'li3' })
      .click().then(next);
  });
 
  this.When(/^select the textbox add "([^"]*)" in the box$/, function (text, next) {
      this.driver.findElement({ id: 'sampletodotext' }).click();
      this.driver.findElement({ id: 'sampletodotext' }).sendKeys(text).then(next);
  });
 
  this.Then(/^click the "([^"]*)"$/, function (button, next) {
    this.driver.findElement({ id: button }).click().then(next);
  });
 
  this.Then(/^I must see title "([^"]*)"$/, function (titleMatch, next) {
    this.driver.getTitle()
      .then(function(title) {
        assert.equal(title, titleMatch, next, 'Expected title to be ' + titleMatch);
      });
  });

  this.When(/^I click on "([^"]*)"$/, function (element, next) {
    this.driver.findElement(element).click().then(next);
  })
};