# Heisenbug 2021. Workshop

Let's build Component tests for DEMO application.

We'll have a plan of wrokshop here in README.

Each commit in this repository will solve single or rarely several step in our plan.


### Here is our initial plan

- **~~1. Take a look at DEMO application. Capture reauirements.~~**
  * ~~1.1 Write requirements in `feature.ts` files~~

- **~~2. Setup testing infrastructure.~~**
  * ~~2.1 install `jest, enzyme` and configure~~
    - ~~installed `jest@26`, `enzyme`, `enzyme-adpater-react-16`, etc.~~
    - ~~added `jest.config.js`, `tsconfig.test.json`.~~
    - ~~confiured `enzyme` adapter in `setup-jest.js`.~~ 
  * ~~2.2 start designing first test API~~
  * ~~2.3 mount DEMO application in testing env: `enzyme.mount()`.~~
  * ~~2.3.1 handle import from `*.css` files: add `style-file-mock.js`, setup it in `jest.config.js`.~~
  * ~~2.4 stub application API to run first test~~
  * ~~2.4.1 handle warnings about missing `act()` from `react-testing`.~~

- **~~3. Automate first test. Implement `DSL.expect`.~~**
  * ~~3.1 introduce DSL (aka Page Object)~~
  * ~~3.2 design `expect()` API for tests: `Expected<T>`.~~
  * ~~3.3 implement `expect` reading partial state using `enzyme` API~~
    - ~~getState - should read only expected subset of state~~
    - ~~expect - will only asserts mismatches = jest.expect().toMatchObject()~~
    - ~~introduced `expect-utils` with `readState`, `textReader`, `itemsReader` helpers~~
  * ~~3.4 automate first test on UI initial state~~

- **~~4. Simulate user actions.~~**
  * ~~4.1 extend application API stub to simulate cats~~
  * ~~4.1.1 resolve race condition: our tests run faster than application: wait for pending tasks in event loop. Then call `enzyme.update()` on root~~
  * ~~4.2 design user actions API for tests~~
  * ~~4.3 DSL: implement user actions using `enzyme` API~~
  * ~~4.4 automate more tests~~
    - ~~simulating more user actions using `simulation-utils` API,~~
    - ~~reading more state in `CatShopDsl`,~~
    - ~~assigning ids in React components to easy finding~~
    - ~~automate all unblocked tests~~
    - ~~fixed PROD bug: disable Next button if no cats remaining in the cart~~
    - ~~fixed issue in `getText`: replacing different space symbols~~
    - ~~`simulateInputChange`: should change the DOM element value before firing `change` event~~

- **~~5. Introduce `MockUtils` to control mocks from tests.~~**
  * ~~5.1 design Mocks API for tests~~
  * ~~5.2 implement MockUtils~~
  * ~~5.3 integrate MockUtils in tests instead of stubs~~
  * ~~5.4 automate blocked tests~~
    - ~~PROD bug found: Application does not handle placeOrder() reject~~

- **~~6. Collect code coverage. Examine our tests.~~**
  * ~~6.1 setup `jest` to collect code coverage~~
  * ~~6.2 review code coverage report. Figure out new test cases. Add `todo`-tests~~
  * ~~6.3 split features into several `feature.ts` files to boost `jest`.~~

- **7. Allure reporting.**
  * ~~7.1 setup jest-allure reporter~~
  * ~~7.2 export test steps~~
  * 7.3 upload allure-results to Allure Test Ops

### Summarize results
* How many tests cover our application
* Check tests speed
* Figure out code NOT requiring unit tests
* Figure out code still requiring unit tests
* What we'll leave for E2E tests in future
