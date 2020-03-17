## Sample Ticket
_This is intended to represent the kinds of tickets we work on. This shouldn't take more than a couple of hours. Just fork the repo, make your changes, and create a pull request._

### User Story
As a rocket enthusiast, I should see an up-to-date list of rockets so I can keep up with the latest rocket developments.

### Overview
In a previous ticket, our exciting new front-end for the [LaunchLibrary](https://launchlibrary.net) API got off to a great start. It now displays a static list of rockets from a simulated API call. (Woohoo!)

We're now ready to reach out to the ["Rocket" endpoint](https://launchlibrary.net/docs/1.4.1/api.html#rocket) for real.

### Acceptance Criteria
- When I visit the app, I should see a list of rockets.
    - The list of rockets should match the first page of results from `GET https://launchlibrary.net/1.4/rocket?mode=list`

### Technical Notes
Replace the simulated API call with a real API call to https://launchlibrary.net/1.4/rocket?mode=list. This should be done in the `getRocketsList` function of `src/api/rockets/index.ts`.

### Tips
Just retrieve a single page of results– no need to support pagination, sorting, filtering, or anything fancy like that. You only need to display the four rocket attributes that are currently supported.

The previous developer couldn't figure out how to write working tests for the (fake) API calls, so our test coverage isn't at 100%. Perhaps when you implement the real API calls, you will have [more success](https://www.bha.ee/how-to-mock-axios-in-jest-with-typescript/).

Be sure to enable eslint linting in your editor!
