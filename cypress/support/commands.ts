export {}; // Make this file an external module

// Adiciona a definição do comando customizado ao Chainable
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  // O cy.session() guarda a sessão do usuário (cookies, local storage)
  // para que ele não precise logar novamente em cada teste.
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[placeholder="seu@email.com"]').type(email);
    cy.get('input[type="password"]').type(password, { log: false }); // log: false para não exibir a senha nos logs do Cypress
    cy.get('button[type="submit"]').click();
    // Garante que o redirecionamento para o dashboard aconteceu
    cy.url().should('not.include', '/login');
  });
});