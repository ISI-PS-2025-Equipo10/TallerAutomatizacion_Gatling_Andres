import { $ } from '@wdio/globals'
import Page from './page.js';
class AddContactPage extends Page {
    public get inputFirstName () {
        return $('/html/body/div/form/p[1]/input[1]');
    }
    public get inputLastName () {
        return $('/html/body/div/form/p[1]/input[2]');
    }
    public get inputDateOfBirth () {
        return $('/html/body/div/form/p[2]/input');
    }
    public get inputEmail () {
        return $('/html/body/div/form/p[3]/input[1]');
    }

    public get inputPhone () {
        return $('/html/body/div/form/p[3]/input[2]');
    }
    public get inputAddress () {
        return $('/html/body/div/form/p[4]/input');
    }
    public get inputAddress2(){
        return $('/html/body/div/form/p[5]/input');
    }
    public get inputCity () {
        return $('/html/body/div/form/p[6]/input[1]');
    }
    public get inputState () {
        return $('/html/body/div/form/p[6]/input[2]');
    }
    public get inputPostal () {
        return $('/html/body/div/form/p[7]/input[1]');
    }
    public get inputCountry () {
        return $('/html/body/div/form/p[7]/input[2]');
    }

    public get btnSubmit () {
        return $('/html/body/div/p/button[1]');
    }

    public async addContact(
        firstName: string, 
        lastName: string, 
        dateOfBirth: string, 
        email: string, 
        phone: string, 
        address: string, 
        address2: string, 
        city: string, 
        state: string, 
        postal: string, 
        country: string
    ) {
        await this.inputFirstName.setValue(firstName);
        await this.inputLastName.setValue(lastName);
        await this.inputDateOfBirth.setValue(dateOfBirth);
        await this.inputEmail.setValue(email);
        await this.inputPhone.setValue(phone);
        await this.inputAddress.setValue(address);
        await this.inputAddress2.setValue(address2);
        await this.inputCity.setValue(city);
        await this.inputState.setValue(state);
        await this.inputPostal.setValue(postal);
        await this.inputCountry.setValue(country);
        await this.btnSubmit.click();
    }

    public open() {
        return super.open('addContact');
    }
}export default new AddContactPage();