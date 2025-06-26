Feature: Inicio de Sesión (Login)

  Background:
    * url 'https://thinking-tester-contact-list.herokuapp.com'
    * configure cookies = null
    * configure headers = { 'Content-Type': 'application/json' }

  @login
  Scenario: Login and get authentication token
    Given path 'users/login'
    And request 
      """
      {
        "email": "a@example.com",
        "password": "1234567"
      }
      """
    When method post
    Then status 200
    And match response.user._id == '#string'
    And match response.user.email == 'a@example.com'
    And match response.token == '#string'
    
    * def token = response.token
    * print 'Login successful, token extracted:', token

  Scenario: Login and extract token, then retrieve contacts
    Given path 'users/login'
    And request 
      """
      {
        "email": "a@example.com",
        "password": "1234567"
      }
      """
    When method post
    Then status 200
    And match response.user._id == '#string'
    And match response.user.email == 'a@example.com'
    And match response.token == '#string'

    * def authToken = response.token
    * print 'Login successful, token extracted:', authToken

    Given path 'contacts'
    And header Authorization = 'Bearer ' + authToken
    When method get
    Then status 200

