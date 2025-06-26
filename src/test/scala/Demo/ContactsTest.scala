package Demo

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import Demo.Data._
import scala.util.Random

class ContactsTest extends Simulation{

  val httpConf = http
    .baseUrl(url)
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")
    .requestTimeout(120000) // 120 segundos

  // 2 Scenario Definition
  val scn = scenario("Contact Creation Load Test")
    // Primero hacer login para obtener el token
    .exec(http("Login for Token")
      .post("/users/login")
      .body(StringBody(s"""{"email":"$email","password":"$password"}"""))
      .check(status.is(200))
      .check(jsonPath("$.token").saveAs("authToken"))
    )
    .pause(1, 2) // Pausa después del login
    
    // Crear contacto usando el token obtenido
    .exec(http("Create Contact")
      .post("/contacts")
      .header("Authorization", "Bearer ${authToken}")
      .body(StringBody(session => {
        val randomId = Random.nextInt(10000)
        s"""{
          "firstName": "John${randomId}",
          "lastName": "Doe",
          "birthdate": "1970-01-01",
          "email": "jdoe${randomId}@fake.com",
          "phone": "8005555555",
          "street1": "1 Main St.",
          "street2": "Apartment A",
          "city": "Anytown",
          "stateProvince": "KS",
          "postalCode": "12345",
          "country": "USA"
        }"""
      }))
      .check(status.is(201))
      .check(jsonPath("$._id").exists.saveAs("contactId"))
      .check(jsonPath("$.firstName").exists)
      .check(jsonPath("$.email").exists)
    )
    .pause(3, 5) // Pausa más larga entre creaciones de contactos

  // 3 Load Scenario - Prueba muy ligera de creación de contactos
  setUp(
    scn.inject(
      rampUsersPerSec(1).to(1).during(3),  // Solo 1 usuario por segundo durante 3 segundos
      constantUsersPerSec(1).during(8),    // Mantiene 1 usuario por segundo durante 8 segundos
      rampUsersPerSec(1).to(1).during(2)   // Termina con 1 usuario por segundo durante 2 segundos
    )
  ).protocols(httpConf)
   .assertions(
     global.responseTime.max.lt(20000),    // Tiempo de respuesta máximo menor a 20 segundos (muy tolerante)
     global.responseTime.mean.lt(10000),   // Tiempo de respuesta promedio menor a 10 segundos
     global.successfulRequests.percent.gt(75) // Al menos 75% de requests exitosos
   )
}
