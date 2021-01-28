module.exports = {

    url: 'https://paetz.me/motherhood/867atks/days',

    elements: {
        menuBar: by.xpath("//mat-icon[contains(text(),'menu')]"),
        editBtn: by.xpath("//mat-icon[contains(text(),'edit')]"),
        searchInput: by.name('q'),
        searchResultLink: by.css('div.g > h3 > a')
    },

    /**
     * enters a search term into Google's search box and presses enter
     * @param {string} searchQuery
     * @returns {Promise} a promise to enter the search values
     */
    preformSearch: function (searchQuery) {

        var selector = page.googleSearch.elements.searchInput;

        // return a promise so the calling function knows the task has completed
        return driver.findElement(selector).sendKeys(searchQuery, selenium.Key.ENTER);
    }
};