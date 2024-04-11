describe('Signup Test', () => {
  it('successfully sign up a new user', () => {
    const uniqueSuffix = Date.now();
    const email = `user${uniqueSuffix}@example.com`;

    cy.visit('http://localhost:5001/signup');

    cy.get('#envelope-icon').type(email);
    cy.get('#user-icon').type(`user${uniqueSuffix}`);
    cy.get('#lock-icon').type('password');
    cy.get('#passwordRepeat').type('password');
    cy.get('.sign-up-button').click();

    cy.url().should('include', '/login');
  });
});

describe('Signup Test with potentially conflicting email', () => {
  it('handles email conflict correctly', () => {
    cy.visit('http://localhost:5001/signup');

    cy.get('#envelope-icon').type('user@test.com');
    cy.get('#user-icon').type('user');
    cy.get('#lock-icon').type('password');
    cy.get('#passwordRepeat').type('password');
    cy.get('.sign-up-button').click();

    cy.get('.error-message').should('contain', 'An error occurred. Please try again later.');

    cy.url().should('include', '/signup');
  });
});



