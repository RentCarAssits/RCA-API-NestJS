Feature: Create User
  As a system administrator
  I want to be able to create new users
  So that they can access the system

  Scenario: Create a new renter user
    Given I am on the Sign in Page
    When I enter the following user details:
      | Name      | John Doe         |
      | USER TYPE | RENTER           |
      | Email     | john@example.com |
      | Password  | Password123      |
      | FirstName | Jhon                         |
      | LastName  | JHONSON                      |
      | Address   | Jr Hernando Lavalle 140      |
      | DNI       | 78545489                     |
      | Phone Number  | +51 970444651            |
    And I click the "Sign in" button
    Then the user should be successfully created
    And the user should be able to log in in the web

  Scenario: Attempt to create a user without a name
    Given I am on the user administration page
    When I enter the following user details:
      | Name      |                  |
      | USER TYPE | RENTER           |
      | Email     | john@example.com |
      | Password  | Password123      |
      | FirstName | Jhon                         |
      | LastName  | JHONSON                      |
      | Address   | Jr Hernando Lavalle 140      |
      | DNI       | 78545489                     |
      | Phone Number  | +51 970444651            |
      And I click the "Sign in" button
    Then I should see an error message indicating that a name is required
