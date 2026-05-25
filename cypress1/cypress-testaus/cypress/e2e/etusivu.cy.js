describe('Etusivu test', () => {
  it('Contains the text', () => {
    cy.visit('https://gradia.fi');
    cy.get("body").should("be.visible"); // wait for HTML page is visible
    cy.get('.education-search-widget__title').contains("koulutuksia");
  });

})