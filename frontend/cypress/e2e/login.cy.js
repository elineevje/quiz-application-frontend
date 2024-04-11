describe('Login Test', () => {
    it('successfully logs in an existing user', () => {
        cy.visit('http://localhost:5001/login');
        cy.get('#username').type('user');
        cy.get('#password').type('password');
        cy.get('.log-in-button').click();

        cy.url().should('include', '/home');
    });
});

describe('Login Test with wrong password', () => {
    it('fails to log in user with wrong password', () => {
        cy.visit('http://localhost:5001/login');
        cy.get('#username').type('user');
        cy.get('#password').type('wrongpassword');
        cy.get('.log-in-button').click();

        cy.get('.error-message').should('contain', 'Incorrect username or password');
    });
});
