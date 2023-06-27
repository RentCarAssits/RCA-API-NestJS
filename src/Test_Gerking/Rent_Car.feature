Feature: Rent a Car
  As a renter
  I want to be able to rent a car
  So that I can travel comfortably

  Scenario: Successfully rent a car
    Given I am on the car rental page
    When I select the following rental options:
      | Start Date    | 2023-06-15  |
      | End Date      | 2023-06-20  |
    And I click the "Rent" button
    Then a rental confirmation message should be displayed
    And the car reservation should be recorded in my account

  Scenario: Attempt to rent a with dates not valid
    Given I am on the car rental page
    When I do not select any car type
    And I select the following rental dates:
      | Start Date    | 2023-06-15  |
      | End Date      | 2021-02-20  |
    And I click the "Rent" button
    Then I should see an error message indicating that selecting a car type is required


