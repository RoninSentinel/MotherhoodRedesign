Feature: Automate a website
    Scenario: perform click events
      When visit url "https://paetz.me/motherhood/867atks/days"
      When field with name "MCC" is present check the box
      When field with name "MCC-B" is present check the box
      When select the textbox add "Let's add new to do item" in the box
      Then click the "addbutton"