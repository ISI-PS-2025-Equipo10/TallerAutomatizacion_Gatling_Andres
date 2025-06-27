package Demo

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import Demo.Data._
import scala.util.Random

class LoginTest extends Simulation {

  val httpConf = http
    .baseUrl(url)
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")

  val loginScn = scenario("Login Test")
    .exec(
      http("POST Login")
        .post("/users/login")
        .body(StringBody(s"""{"email":"$email","password":"$password"}""")).asJson
        .check(status.is(200))
        .check(jsonPath("$.token").exists.saveAs("authToken"))
        .check(jsonPath("$.user._id").exists)
        .check(jsonPath("$.user.email").is(email))
    ).pause(3, 5)

  val contactScn = scenario("Contact Creation Test")
    .exec(
      http("Login for Token")
        .post("/users/login")
        .body(StringBody(s"""{"email":"$email","password":"$password"}""")).asJson
        .check(status.is(200))
        .check(jsonPath("$.token").saveAs("authToken"))
    ).exitHereIfFailed
    .pause(1, 2)
    .exec(
      http("Create Contact")
        .post("/contacts")
        .header("Authorization", "Bearer ${authToken}")
        .body(StringBody(session => {
          val randomId = Random.nextInt(10000)
          s"""{
            "firstName": "John$randomId",
            "lastName": "Doe",
            "birthdate": "1970-01-01",
            "email": "jdoe$randomId@fake.com",
            "phone": "8005555555",
            "street1": "1 Main St.",
            "street2": "Apartment A",
            "city": "Anytown",
            "stateProvince": "KS",
            "postalCode": "12345",
            "country": "USA"
          }"""
        })).asJson
        .check(status.is(201))
        .check(jsonPath("$._id").exists.saveAs("contactId"))
        .check(jsonPath("$.firstName").exists)
        .check(jsonPath("$.email").exists)
    ).pause(3, 5)

  setUp(
    loginScn.inject(
      rampUsersPerSec(1).to(2).during(5),
      constantUsersPerSec(1).during(8)
    ),
    contactScn.inject(
      rampUsersPerSec(1).to(1).during(3),
      constantUsersPerSec(1).during(6)
    )
  ).protocols(httpConf)
    .assertions(
      global.responseTime.max.lt(60000),
      global.responseTime.mean.lt(30000),
      global.successfulRequests.percent.gt(50)
    )
}
