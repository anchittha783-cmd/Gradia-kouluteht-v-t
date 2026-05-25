describe('Etusivu test', () => {
  beforeEach(() => {
    // Set "Accept cookies" consent value so that Cypress-Chrome does not prompt for cookie consent every time.
    cy.setCookie('cookiefirst-consent', '%7B%22necessary%22%3Atrue%2C%22performance%22%3Atrue%2C%22functional%22%3Atrue%2C%22advertising%22%3Atrue%2C%22timestamp%22%3A1776280335%2C%22type%22%3A%22category%22%2C%22version%22%3A%2200f0d4ed-8f11-4708-b9f6-c8def2d96ca7%22%7D');
  });
   
  it('Contains the text', () => {
    cy.visit('https://gradia.fi');
    cy.get("body").should("be.visible"); // wait for HTML page is visible
    cy.wait(2000);
    cy.get('.search-box--wrapper > [name="search_api_fulltext"]').type("ohjelmointi");
    cy.get('.submit').click();
    cy.get(':nth-child(1) > .views-field > .field-content > .education-training > .l-education-training-search__content--teaser > .content-left > .training-search__title > .hyphenate').contains("Web")
    cy.press(Cypress.Keyboard.Keys.PAGEDOWN); //sent keypress to chome
  });

})