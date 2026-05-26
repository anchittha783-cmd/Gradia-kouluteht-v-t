describe('template spec', () => {
  it('passes', () => {
    cy.visit('Game%20sivu/index.html');
    cy.wait(2000);
    cy.get("body").should("be.visible"); // wait for HTML page is visible
    cy.get('[href="../game-1/index.html"] > .card').click();
     cy.wait(2000);
    cy.get('a').click();
  })
})