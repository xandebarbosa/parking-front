declare namespace Cypress {
  interface Chainable {
    /**
     * Comando customizado para realizar login e guardar a sessão.
     * @example cy.login('admin@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;
  }
}