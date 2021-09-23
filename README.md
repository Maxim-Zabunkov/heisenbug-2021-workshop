# Heisenbug 2021. Workshop

Let's build Component tests for DEMO application.

We'll have a plan of wrokshop here in README.

Each commit in this repository will solve single or rarely several step in our plan.


### Here is our initial plan

- **~~1. Take a look at DEMO application. Capture reauirements.~~**
  * ~~1.1 Write requirements in `feature.ts` files~~

- **2. Setup testing infrastructure.**
  * ~~2.1 install `jest, enzyme` and configure~~
    - ~~installed `jest@26`, `enzyme`, `enzyme-adpater-react-16`, etc.~~
    - ~~added `jest.config.js`, `tsconfig.test.json`.~~
    - ~~confiured `enzyme` adapter in `setup-jest.js`.~~ 
  * 2.2 start designing first test API
  * 2.3 mount DEMO application in testing env: `enzyme.mount()`
  * 2.4 stub application API to run first test

- **3. Automate first test. Implement `DSL.expect`.**
  * 3.1 design `expect()` API for tests
  * 3.2 introduce DSL (aka Page Object)
  * 3.3 implement `expect` reading partial state using `enzyme` API
  * 3.4 automate first test on UI initial state

- **4. Simulate user actions.**
  * 4.1 extend application API stub to simulate cats
  * 4.2 design user actions API for tests
  * 4.3 DSL: implement user actions using `enzyme` API
  * 4.4 automate more tests

- **5. Introduce `MockUtils` to control mocks from tests.**
  * 5.1 design Mocks API for tests
  * 5.2 implement MockUtils
  * 5.3 integrate MockUtils in tests instead of stubs
  * 5.4 automate blocked tests

- **6. Collect code coverage. Examine our tests.**
  * 6.1 setup `jest` to collect code coverage
  * 6.2 review code coverage report. Figure out new test cases. Add `todo`-tests
  * 6.3 split features into several `feature.ts` files to boost `jest`

- **7. Allure reporting.**
  * 7.1 setup jest-allure reporter
  * 7.2 export test steps
  * 7.3 upload allure-results to Allure Test Ops

### Summarize results
* How many tests cover our application
* Check tests speed
* Figure out code NOT requiring unit tests
* Figure out code still requiring unit tests
* What we'll leave for E2E tests in future
