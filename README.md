# Shared Health COVID results checker

This is a short Node.js script that logs in to an existing “Shared Health COVID-19 Online Results Display” account, fetches the results, and txts you via Twilio if the result is changed.

On first run, it just stores the result for the next run without txting.

*Warning*: I’ve never run this on an account that’s never had a test result! So this will probably break. But I’ve made a guess that it’ll return an empty array, so maybe it’ll work 🤔

Requirements:

* Node (14.9.0, but you can use [Volta](https://volta.sh/))
* A Shared Health account and these environment variables:
  * `SHARED_HEALTH_USERNAME`
  * `SHARED_HEALTH_PASSWORD`
* A Twilio account and these environment variables:
  * `TWILIO_ACCOUNT_SID`
  * `TWILIO_AUTH_TOKEN`
  * `TWILIO_ORIGIN_NUMBER`: number to txt from
  * `TWILIO_DESTINATION_NUMBER`: number to txt, probably your own!