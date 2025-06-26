import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import SecurePage from '../pageobjects/secure.page.js'
import AddContactPage from '../pageobjects/addContact.page.js'

describe('My succesfull login application', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open()
        await LoginPage.login('a@example.com', '1234567')
        await expect(SecurePage.flashAlert).toBeExisting()
        await expect(SecurePage.flashAlert).toHaveText(
            expect.stringContaining('Contact List'))
    })
})
describe('My unsuccesfull login application', () => {
    it('should not login with invalid credentials', async () => {
        await LoginPage.open()
        await LoginPage.login('a@example.com', '12345678')
        await expect(SecurePage.flashError).toBeExisting()
        await expect(SecurePage.flashError).toHaveText(
            expect.stringContaining('Incorrect username or password'))
    })
})

describe('Add Valid Contact Test', () => {
    it('should add contact after successful login', async () => {
        // Primero hacer login exitoso
        await LoginPage.open()
        await LoginPage.login('a@example.com', '1234567')
        
        // Verificar que el login fue exitoso
        await expect(SecurePage.flashAlert).toBeExisting()
        await expect(SecurePage.flashAlert).toHaveText(
            expect.stringContaining('Contact List'))
        await AddContactPage.open()
        await AddContactPage.addContact(
            'John',                    // firstName
            'Doe',                     // lastName
            '2025-03-03',             // dateOfBirth
            'john.doe@example.com',   // email
            '55521234',               // phone
            '123 Main St',            // address
            'Apt 4B',                 // address2
            'New York',               // city
            'NY',                     // state
            '10001',                  // postal
            'USA'                     // country
        )
        
        // Verificar que el contacto fue agregado exitosamente buscando el email en la tabla
        await expect(SecurePage.getEmailInTable('john.doe@example.com')).toBeExisting()
        
        // Alternativamente, verificar con el método más estricto
        await expect(SecurePage.isEmailInTable('john.doe@example.com')).toBeExisting()
    })
    })
describe('Add Invalid Contact Test', () => {
    it('should not add contact', async () => {
        // Primero hacer login exitoso
        await LoginPage.open()
        await LoginPage.login('a@example.com', '1234567')
        
        // Verificar que el login fue exitoso
        await expect(SecurePage.flashAlert).toBeExisting()
        await expect(SecurePage.flashAlert).toHaveText(
            expect.stringContaining('Contact List'))
        await AddContactPage.open()
        await AddContactPage.addContact(
            '',                    // firstName
            '',                     // lastName
            '',             // dateOfBirth
            '',   // email
            '',               // phone
            '',            // address
            '',                 // address2
            '',               // city
            '',                     // state
            '',                  // postal
            ''                     // country
        )
        await expect(SecurePage.flashError).toBeExisting()
        await expect(SecurePage.flashError).toHaveText(
            expect.stringContaining('Contact validation failed'))
    })
    })
        
