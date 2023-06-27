Feature: Rent a Car
  As a Renter
  I want to be able to POST a car

  Scenario: Successfully posted a car
    Given I am on the car rental page
    When I select the following rental options:
      | Car Image     | car1.png    |
      | Car Name      | Sedan       |
      | Car Brand     | Toyota      |
      | Car Model     | MAc Queen   |
      | Car State     | AVAILABLE   |
      | Rental Price  | 80          |
      | Rental Price  | DOLLAR      |
      | TIME UNIT     | DAY         |
      | DESCRIPTION   | COMO NUEVO  |
      | VEHICLE YEAR  | 2022-12-12  |
      | CATEGORIES    | NUEVO LAMBORGINI  |
    And I click the "SAVE" button
    Then a rental confirmation message should be displayed
    And the car reservation should be recorded in my account

 
  Scenario: Attempt to POST a car with invalid dates
    Given I am on the car rental page
    When I select the car type "SUV"
    And I select past rental dates
      | Car Image     | car1.png    |
      | Car Name      | Sedan       |
      | Car Brand     | Toyota      |
      | Car Model     | MAc Queen   |
      | Car State     | AVAILABLE   |
      | Rental Price  | -90          |
      | Rental Price  | DOLLAR      |
      | TIME UNIT     | DAY         |
      | DESCRIPTION   | COMO NUEVO  |
      | VEHICLE YEAR  | 2022-12-12  |
      | CATEGORIES    | NUEVO LAMBORGINI  |
    And I click the "save" button
    Then I should see an error message indicating that the rental dates are invalid
