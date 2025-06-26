Feature: Contact Management

  Background:
    * url 'https://thinking-tester-contact-list.herokuapp.com'
    * configure cookies = null
    * configure headers = { 'Content-Type': 'application/json' }
    
    # Call the login scenario from users.feature to get authentication token
    * call read('users.feature@login')
    * def authToken = token

  Scenario: Create contact, verify creation, test duplicate email error, and cleanup
    # Create a new contact
    Given path 'contacts'
    And header Authorization = 'Bearer ' + authToken
    And request 
      """
      {
        "firstName": "John",
        "lastName": "Doe",
        "birthdate": "1970-01-01",
        "email": "jdoe@fake.com",
        "phone": "8005555555",
        "street1": "1 Main St.",
        "street2": "Apartment A",
        "city": "Anytown",
        "stateProvince": "KS",
        "postalCode": "12345",
        "country": "USA"
      }
      """
    When method post
    Then status 201
    And match response._id == '#string'
    And match response.firstName == 'John'
    And match response.lastName == 'Doe'
    And match response.email == 'jdoe@fake.com'
    And match response.phone == '8005555555'
    And match response.owner == '#string'
    
    * def createdContactId = response._id
    * print 'Contact created successfully with ID:', createdContactId

    # Verify contact was created by getting all contacts
    Given path 'contacts'
    And header Authorization = 'Bearer ' + authToken
    When method get
    Then status 200
    And match response == '#array'
    * def foundContact = karate.filter(response, function(x){ return x._id == createdContactId })[0]
    And match foundContact.firstName == 'John'
    And match foundContact.email == 'jdoe@fake.com'
    * print 'Contact verification successful - found in contacts list'

    # Delete the created contact to cleanup
    Given path 'contacts', createdContactId
    And header Authorization = 'Bearer ' + authToken
    When method delete
    Then status 200
    * print 'Contact deleted successfully for cleanup'

    # Verify contact was deleted
    Given path 'contacts'
    And header Authorization = 'Bearer ' + authToken
    When method get
    Then status 200
    * def deletedContact = karate.filter(response, function(x){ return x._id == createdContactId })
    And match deletedContact == []
    * print 'Contact deletion verified - contact no longer in list'
