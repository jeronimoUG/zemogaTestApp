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
Thanks to the integration with Expo, running the app is mostly straightforward:
1. Make sure Node.js is insalled in yor system, this will install alongside npm packege manager. For help go to [Node.js documentation](https://nodejs.org/en/).
2. Make sure the Expo expo-cli application is insalled in yor system, if is not, install it with `npm install -g expo-cli`.
3. Navigate in console to the app folder.
4. Run `npm start` and wait for the debug interface to open in your browser.
5. From there you can run the app on your mobile device with the help of the Expo Go application.
6. Download Expo Go on your device and link with the debug server using the url or the QR code.
### Test
There are just test for a single hook in some conditions, those can be runt from the app's directory using `npm test`.
 ______________________________________________________________________________________________________________________________________________________________
|![Screeshot Posts Screen](https://github.com/jeronimoUG/zemogaTestApp/blob/main/screen-1.png?raw=true)|![Screeshot Posts Screen](https://github.com/jeronimoUG/zemogaTestApp/blob/main/screen-1.png?raw=true)
