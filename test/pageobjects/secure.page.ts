import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get flashAlert () {
        return $('/html/body/div/header/h1');
    }
    public get flashError(){
        return $('#error');
    }
    public get lastRowEmail(){
        return $('/html/body/div/div/table/tr[last()]/td[4]');
    }
    
    // Método para buscar un email específico en cualquier fila de la tabla
    public getEmailInTable(email: string) {
        return $(`//table//tr//td[contains(text(), '${email}')]`);
    }
    
    // Método alternativo para verificar si un email existe en la tabla
    public isEmailInTable(email: string) {
        return $(`//table//tr//td[text()='${email}']`);
    }
}

export default new SecurePage();
