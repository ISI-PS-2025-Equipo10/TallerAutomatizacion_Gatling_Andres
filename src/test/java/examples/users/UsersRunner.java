package examples.users;

import com.intuit.karate.junit5.Karate;

class UsersRunner {
    
    @Karate.Test
    Karate testUsers() {
        return Karate.run("users").relativeTo(getClass());
    }    
    @Karate.Test
    Karate testContacts() {
        return Karate.run("contacts").relativeTo(getClass());
    }    

}
