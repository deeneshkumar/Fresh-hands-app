# Fresh-hands-app
npm install - to install node modules.

eas build -p android --profile preview - to build the app
eas build -p android --profile production - to build the app
eas build -p android --profile development - to build the app

npx expo prebuild - to create android and ios folders
eas build:configure - to configure the build
then you have:
android/
iOS/
eas.json

npx expo start - to start the app
npx expo start --dev-client - to start the app with dev client
npx expo start --tunnel - to start the app with tunnel
npx expo start --web - to start the app with web
npx expo start --clear - to start the app with clear