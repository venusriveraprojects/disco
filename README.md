## Disco QA Engineering Assessment
Disco Automation for Pricing page
# config/qa_sandbox.json 
All the environment variables are set.  Multiple json files can be created in config folder for different testing environments (Production, UAT or Staging) 
# e2e
The pricing.cy.js is the spec file and a place holder for the test suite
# pageObjects
Functions and page object definitions per page

## Documentation and Approach
# Approach
The automation will test the sliders functionality for Plus and Pro tiers.  The displayed number of users and files will be updated based on the slider movements.  It also validates if the correct computations will be displayed based on the combination of payment mode (monthly/annually), number of users and files.  
Test 1: Check the default cost on initial loading of the page.  It validates the billing cost for monthly pay mode, functionality of pay mode switch, and computation of discount if paying annually.

Test 2: Validates the computation for 1 to 10 users for the first 4 tracks size options (1k to 4k) for PLUS tier.  This also validates annual discount computation for 1 user and 4k tracks.

Test 3: Validates the computation for 1 to 10 users for the first 4 tracks size options (1k to 4k) for PRO tier.  This also validates annual discount computation for 1 user and 4k tracks.

# Obstacles
a) My initial design was to create my first loop for user slider where each movement, the files sliders will slide until it reach the max number of files, then compute the expected cost.  However, resetting the files slider back to 1K tracks cannot be controlled via automation '{leftarrow}'.  As a solution, I start with Files slider and go through each Users slider.

b)  Cypress is consuming a lot of memory during the complete execution of every slider combination. My solution was to reduce to first 4 file size options to reduce the execution activity.

# Improvements
a) The 'validatePrice' script can be optimised more to reduce the repetitive code for reaching and validating the page object (thru 'cy.get' command).  An if condition can be added to determine what base amount variable is applicable for each tier.

Pseudocode:
if tier = Lite
    tierType = 'Lite'
    baseCost = liteBase
else if tier = Plus
    tierType = 'Plus'
    baseCost = plusBase
else if tier = Pro
    tierType = 'Pro'
    baseCost = proBase

cy.get(this.planTitle())
    .contains(tierType)
    .next()
    .find(this.priceNumber())
    .should('contain', '$' + baseCost)

b) Instead of looping through all the number of users and files (but for demo I reduced it to first four tracks size), provide a function that will accept number of users, number of tracks, tier type, payment mode.  Based on the given parameters, it should be able to compute the cost accurately.
