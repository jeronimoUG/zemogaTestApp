# Jeronimo UG | Zemoga Test App
Posts demo app for Zemoga's React Native Tryouts, build on Expo for the sake of simplicity.
## Development Review
Simple app developed with Hooks as central piece, bussines logic and data are encapsulated in a single interface which feeds the entire app with the use of Async Storage.
- TypeScript ensuring data cohersion.
- Async Storage as simple cache without exparicy (mostly for demostration purposes).
- Centralized states in the form of a Hook, keeps app updated accross screens and data cached, serving a basic global state management (mostly for demostration purposes, usual solution Redux).
- Dependencies and third-party libraries keep at minimum (mostly as an exercise).
- Jest for testing (just a couple of super basic small tests have been implemented).
## Running The App
Thanks to the integration of Expo, running the app is mostly straightforward: