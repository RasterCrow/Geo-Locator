# Geo Locator

Geoguessr clone made with React and Firebase Real Time Database, Firebase Hosting and Google Maps API.

# Info
If you sometimes feel like playing Geoguessr with your friends, but don't want to pay the monthly fee, Geo Locator can help you.

To use it you need to setup your own .env with the firebase config like so : 
You should also implement better security rules for for accessing real time database and quotas for the api key.

```
REACT_APP_API_KEY= "YOUR-API-KEY"
REACT_APP_AUTHDOMAIN= "YOUR-DATA"
REACT_APP_BASEURL= "YOUR-DATA"
REACT_APP_PROJECT_ID= "YOUR-DATA"
REACT_APP_STORAGEBUCKET= "YOUR-DATA"
REACT_APP_MESSAGING_SENDER_ID= "YOUR-DATA"
REACT_APP_APP_ID= "YOUR-DATA"
REACT_APP_MEASUREMENT_ID= "YOUR-DATA"
```

You can then deploy it somewhere ( I use Firebase Hosting ) and limit it to the your friends, so other people don't have access to it.

# Licence
This code was written entirely by me and other than the conecept, is completely unrelated to Geoguessr.
You can do whatever you want with this code.
