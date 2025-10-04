describe('Fluxo de Login', () => {
  it('Deve realizar o login com sucesso e redirecionar para o dashboard', () => {
    // Visita a página de login
    cy.visit('/login');

    // Insere o email do usuário. Use um usuário de teste válido do seu banco de dados.
    cy.get('input[placeholder="seu@email.com"]').type('andersinho@email.com');

    // Insere a senha
    cy.get('input[type="password"]').type('minhasenha123');

    // Clica no botão de submissão do formulário
    cy.get('button[type="submit"]').click();

    // Aguarda e verifica se a URL mudou para a raiz (dashboard)
    cy.url().should('include', '/');

    // Verifica se um elemento do dashboard, como o título, é visível
    cy.contains('h1', 'Gerenciamento de Cartões').should('be.visible');
  });

  it('Deve exibir uma mensagem de erro para credenciais inválidas', () => {
    // Visita a página de login
    cy.visit('/login');

    // Insere credenciais inválidas
    cy.get('input[placeholder="seu@email.com"]').type('usuario@errado.com');
    cy.get('input[type="password"]').type('senhaerrada');

    // Clica no botão de submissão
    cy.get('button[type="submit"]').click();

    // Verifica se a notificação de erro (toast) aparece na tela
    // O seletor [data-sonner-toast] é específico da biblioteca `sonner` que você está usando
    cy.get('[data-sonner-toast]').should('be.visible');
    cy.contains('Email ou senha inválidos.').should('be.visible');
  });
});