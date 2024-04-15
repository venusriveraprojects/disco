import PricingPage from '../pageObjects/PricingPage'

const URL = Cypress.env('url')
beforeEach(() => {
  cy.viewport('macbook-11')
  cy.visit(URL)
  PricingPage.acceptCookie()
});
describe('Validate DISCO pricing algorithm', () => {
  it('Default price for monthly and annual payment plan', () => {
    ['monthly', 'annual'].forEach((payMode) => {
      PricingPage.validatePrice(payMode)
    })
  })

  it.only('Validate plus sliders', () => {
    PricingPage.testSliders('Plus') 
    PricingPage.testDiscount('Plus')
  });
  it('Validate PRO sliders', () => {
    PricingPage.testSliders('Pro')
    PricingPage.testDiscount('Pro')
  });
})