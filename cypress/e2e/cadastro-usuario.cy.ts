describe('Fluxo de Cadastro de Usuário', () => {
  beforeEach(() => {
    // Para cadastrar um usuário, precisamos estar logado como admin
    cy.login('andersinho@email.com', 'minhasenha123'); // <-- Use um login de admin válido
    cy.visit('/cadastrar-usuario');
  });

  it('Deve cadastrar um novo usuário com sucesso', () => {
    // Gera um email único para cada execução do teste para evitar erros de duplicidade
    const uniqueEmail = `teste.${Date.now()}@example.com`;

    cy.get('input[name="name"]').type('Usuário de Teste Cypress');
    cy.get('input[name="email"]').type(uniqueEmail);

    // Clica no seletor de função para abrir as opções
    cy.get('[data-slot="select-trigger"]').click();
    // Clica na opção 'Usuário'
    cy.get('[data-slot="select-item"]').contains('Usuário').click();

    cy.get('input[name="password"]').type('senha@123');
    cy.get('input[name="confirmPassword"]').type('senha@123');

    cy.get('button[type="submit"]').click();

    // Verifica se o toast de sucesso aparece
    cy.contains('Usuário criado com sucesso!').should('be.visible');
  });

  it('Deve exibir erro quando as senhas não coincidem', () => {
    cy.get('input[name="name"]').type('Outro Usuário de Teste');
    cy.get('input[name="email"]').type(`outro.${Date.now()}@example.com`);
    
    cy.get('[data-slot="select-trigger"]').click();
    cy.get('[data-slot="select-item"]').contains('Administrador').click();

    cy.get('input[name="password"]').type('senha@123');
    cy.get('input[name="confirmPassword"]').type('senha-diferente');

    cy.get('button[type="submit"]').click();
    
    // Verifica se a mensagem de erro específica do campo é exibida
    cy.contains('As senhas não coincidem.').should('be.visible');
  });
});