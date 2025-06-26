import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputEmail () {
        return $('#email');
    }

    public get inputPassword () {
        return $('#password');
    }

    public get btnSubmit () {
        return $('/html/body/div[3]/form/p[3]/button');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (email: string, password: string) {
        await this.inputEmail.setValue(email);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('');
    }
}

export default new LoginPage();
