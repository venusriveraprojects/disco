const liteBase = Cypress.env('liteBasePrice')
const plusBase = Cypress.env('plusBasePrice')
const proBase = Cypress.env('proBasePrice')
const annualDisc = Cypress.env('annualDiscount')
const plusFilesAddtl = Cypress.env('plusAddtnlTrackPrice')
const proFilesAddtl = Cypress.env('proAddtnlTrackPrice')
const moveSlider = '{rightarrow}';

export default class PricingPage {

    static cookieBtn() { return '.CookieConsent_Btn > .button' }
    static payMode() { return '.Toggle' }
    static payModeAnnual() { return '.Toggle.Toggle--Checked' }
    static planTitle() { return '.PricingPlan_Title' }
    static priceNumber() { return '.Price_Num' }
    static userSlider() { return '.rc-slider-handle' }

    static acceptCookie() {
        cy.get(this.cookieBtn())
            .click()
    }

    static validatePrice(payMode) {
        
        if (payMode == 'monthly') {
            cy.get(this.planTitle()).each(($plan) => {
                cy.log($plan.text())
                if ($plan.text() == 'Lite') {
                    cy.get(this.planTitle())
                        .contains('Lite')
                        .next()
                        .find(this.priceNumber())
                        .should('contain', '$' + liteBase)
                        
                } else if ($plan.text() == 'Plus') {
                    cy.get(this.planTitle())
                        .contains('Plus')
                        .next()
                        .find(this.priceNumber())
                        .should('contain', '$' + plusBase)
                } else if ($plan.text() == 'Pro') {
                    cy.get(this.planTitle())
                        .contains('Pro')
                        .next()
                        .find(this.priceNumber())
                        .should('contain', '$' + proBase)
                }
            })
        } else {
            cy.get(this.payMode()).click()
            cy.get(this.payModeAnnual())
                .should('be.visible')

            cy.get(this.planTitle()).each(($plan) => {
                cy.log($plan.text())
                if ($plan.text() == 'Lite') {
                    cy.get(this.planTitle())
                        .contains('Lite')
                        .next()
                        .find(this.priceNumber())
                        .should('contain', '$' + parseFloat(liteBase - (liteBase * annualDisc)))
                } else if ($plan.text() == 'Plus') {
                    cy.get(this.planTitle())
                        .contains('Plus')
                        .next()
                        .find(this.priceNumber())
                        .should('contain', '$' + parseFloat(plusBase - (plusBase * annualDisc)))
                } else if ($plan.text() == 'Pro') {
                    cy.get(this.planTitle())
                        .contains('Pro')
                        .next()
                        .find(this.priceNumber())
                        .should('contain', '$' + parseFloat(proBase - (proBase * annualDisc)))
                }
            })
        }
    }


    static testSliders(planType) {
        var newPrice = 0

        for (let index = 0; index <= 3; index++) {
            if (index > 0) {
                cy.get(this.planTitle())
                    .contains(planType)
                    .siblings()
                    .find(this.userSlider())
                    .last()
                    .type(moveSlider)
            }

            //number of files
            cy.get(this.planTitle())
                .contains(planType)
                .siblings()
                .find(this.userSlider())
                .last()
                .invoke('attr', 'aria-valuenow')
                .then(($file1) => {
                    cy.get(this.planTitle())
                        .contains(planType)
                        .siblings()
                        .find('.PricingPlan_SubDescription')
                        .last()
                        .should('contain', ($file1/1000)+'K')

                    // nUsers = $user1
                    cy.log('$file1  ' + $file1)

                    //Loop User slider
                    for (let userIndex = 0; userIndex < 10; userIndex++) {
                        if (userIndex > 0) {
                            cy.log(userIndex + ' ' + moveSlider)
                            cy.get(this.planTitle())
                                .contains(planType)
                                .siblings()
                                .find(this.userSlider())
                                .first()
                                .type(moveSlider)
                        }

                        //number of users
                        cy.get(this.planTitle())
                            .contains(planType)
                            .siblings()
                            .find(this.userSlider())
                            .first()
                            .invoke('attr', 'aria-valuenow')
                            .then(($user1) => {
                                cy.log('$user1: ' + $user1)

                                if (planType == 'Plus') {
                                    newPrice = this.computePrice('Plus', $user1, $file1)
                                } else if ((planType == 'Pro')) {
                                    newPrice = this.computePrice('Pro', $user1, $file1)
                                }

                                cy.get(this.planTitle())
                                    .contains(planType)
                                    .next()
                                    .find(this.priceNumber())
                                    .should('contain', '$' + parseFloat(newPrice))
                            })
                    }

                    //reset user slider
                    cy.get(this.planTitle())
                        .contains(planType)
                        .siblings()
                        .find(this.userSlider())
                        .first()
                        .type('{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}')
                })
        }
    }

    static computePrice(plan, numUsers, numFiles) {
        
        if (plan == 'Plus') {
            var planCost = 0
            planCost = (numUsers * plusBase) + (((numFiles/1000)-1) * plusFilesAddtl)
            cy.log('Cost: ' + planCost)
        } else {
            var planCost = 0
            planCost = (numUsers * proBase) + (((numFiles/1000)-1) * proFilesAddtl)
            cy.log('Cost: ' + planCost)
        }

        return planCost
    }
    
    static testDiscount(plan) {
        var discountedPrice
        discountedPrice = this.computePrice(plan, 1, 4000) * (1 - annualDisc)
        cy.get(this.payMode()).click()

        cy.get(this.planTitle())
            .contains(plan)
            .next()
            .find(this.priceNumber())
            .should('contain', '$' + parseFloat(discountedPrice).toFixed(2))

        cy.get(this.payMode()).click() 
    }
}
