describe('Fluxo de Cadastro de Cartão de Estacionamento', () => {
  beforeEach(() => {
    // Loga antes de cada teste
    cy.login('andersinho@email.com', 'minhasenha123'); // <-- Use um login de admin/user válido
    cy.visit('/cadastros');
  });

  it('Deve cadastrar um novo cartão para um novo efetivo com sucesso', () => {
    
    // 1. Interceptamos a requisição POST para a sua API e damos um "apelido" a ela.
    cy.intercept('POST', '**/full-cadastro').as('createCadastro');
    // Gera um RE único para evitar duplicatas
    const uniqueRe = Math.floor(100000 + Math.random() * 900000).toString();

    // Preenche os dados do Efetivo
    cy.get('input[name="re"]').type(uniqueRe);
    cy.get('input[name="name"]').type('Efetivo Teste Cypress');
    cy.get('input[name="postoGrad"]').type('SGT PM');
    cy.get('input[name="rg"]').type('99.999.999-9');
    cy.get('input[name="cpf"]').type('123.456.789-00');
    cy.get('input[name="opm"]').type('CPI-4');
    cy.get('input[name="funcao"]').type('Desenvolvedor');
    cy.get('input[name="secao"]').type('P4');
    cy.get('input[name="ramal"]').type('1234');
    cy.get('input[name="pgu"]').type('PGU123456');
    cy.get('input[name="valCnh"]').type('2030-10-20');

    // Preenche os dados do Veículo
    cy.get('input[name="placa"]').type('CYP1A23');
    cy.get('input[name="modelo"]').type('Carro de Teste');
    cy.get('input[name="color"]').type('Preto');
    cy.get('input[name="ano"]').type('2025');
    cy.get('input[name="municipio"]').type('Bauru');
    cy.get('input[name="uf"]').type('SP');
    cy.get('input[name="chassi"]').type('CHASSI123456789');
    cy.get('input[name="renavan"]').type('RENAVAN123456789');
    cy.get('input[name="reFiscalizador"]').type('123456-7');

    // Preenche Período e Validade
    cy.get('input[name="periodo1Entrada"]').type('08:00');
    cy.get('input[name="periodo1Saida"]').type('18:00');
    cy.get('input[name="periodo2Entrada"]').type('00:00'); // Mesmo que não use, precisa ser preenchido para validação
    cy.get('input[name="periodo2Saida"]').type('00:00');  // Mesmo que não use, precisa ser preenchido para validação
    cy.get('input[name="local"]').type('Pátio Principal');
    cy.get('input[name="dias"]').type('5');
    cy.get('input[name="validadeCartao"]').type('2026-12-31');

    // Clica para salvar
    cy.get('button[type="submit"]').click();

    // 2. Esperamos a requisição (@createCadastro) terminar e verificamos o status dela.
    cy.wait('@createCadastro').its('response.statusCode').should('eq', 201);

    // 3. Agora que sabemos que a API respondeu com sucesso, procuramos pelo toast.
    cy.contains('Cadastro realizado com sucesso!', { timeout: 10000 }).should('be.visible');

    // Verifica se os botões de impressão apareceram
    cy.contains('button', 'Visualizar Requisição').should('be.visible');
    cy.contains('button', 'Visualizar Cartão').should('be.visible');
  });
});