# Shared Health COVID results checker

This is a short Node.js script that logs in to an existing “Shared Health COVID-19 Online Results Display” [account](https://shcord.verosource.com/manitoba/) (white label-esque VeroSource “portal”), fetches the results, and txts you via Twilio if the result is changed.

On first run, it just stores the result for the next run without txting.

*Warning*: I’ve never run this on an account that’s never had a test result! So this will probably break. But I’ve made a guess that it’ll return an empty array, so maybe it’ll work 🤔

## Requirements

* Node (14.9.0, but you can use [Volta](https://volta.sh/))
* A Shared Health account and these environment variables:
  * `SHARED_HEALTH_USERNAME`
  * `SHARED_HEALTH_PASSWORD`
* A Twilio account and these environment variables:
  * `TWILIO_ACCOUNT_SID`
  * `TWILIO_AUTH_TOKEN`
  * `TWILIO_ORIGIN_NUMBER`: number to txt from
  * `TWILIO_DESTINATION_NUMBER`: number to txt, probably your own!

## Running

```
node index.js
```

It should print some messages about its behaviour.

I tried this on:
* Ubuntu 16.04/bash
* Raspbian Buster/bash
* macOS 10.14/zsh

I could only get it to work on macOS, the other two failed to fetch the token with `400 Bad Request`. I gave up on debugging what this was about, sadly, after putting more time into this than I really wanted.

Cron seemed too annoying so I just ran it in a terminal with a ≈20min delay:

```
while true; do date && node index.js; sleep 1200; done
```

## Example output

It actually ran for several days but here’s some fakery so you get the idea:

```
Wed Nov 11 13:20:41 CST 2020
No previous result string found, is this the first run?
Storing result string: Result from Aug 10, 2020: Negative
Wed Nov 11 13:40:43 CST 2020
No change detected.
Wed Nov 11 14:00:44 CST 2020
No change detected.
Wed Nov 11 14:20:46 CST 2020
No change detected.
Wed Nov 11 14:40:47 CST 2020
No change detected.
Wed Nov 11 15:00:48 CST 2020
No change detected.
Wed Nov 11 15:20:50 CST 2020
No change detected.
Wed Nov 11 15:40:51 CST 2020
No change detected.
Wed Nov 11 16:00:53 CST 2020
No change detected.
Wed Nov 11 16:20:54 CST 2020
No change detected.
Wed Nov 11 16:40:56 CST 2020
No change detected.
Wed Nov 11 17:00:57 CST 2020
No change detected.
Wed Nov 11 17:20:59 CST 2020
No change detected.
Wed Nov 11 17:41:01 CST 2020
No change detected.
Wed Nov 11 18:01:02 CST 2020
No change detected.
Wed Nov 11 18:21:08 CST 2020
No change detected.
Wed Nov 11 18:41:09 CST 2020
No change detected.
Wed Nov 11 19:01:11 CST 2020
No change detected.
Wed Nov 11 19:21:13 CST 2020
No change detected.
Wed Nov 11 19:41:15 CST 2020
No change detected.
Wed Nov 11 20:01:16 CST 2020
No change detected.
Wed Nov 11 20:21:18 CST 2020
Change detected, txting: 'Result from Nov 7, 2020: Negative'
Previously: 'Result from Aug 10, 2020: Negative'
Storing result string: Result from Nov 7, 2020: Negative
```

## Possibilities

This could use email instead and cut out the Twilio requirement. It could also store the string in another way to be more Heroku-able. I may be amenable to make these changes if people seek it, so let me know if you’re interested or have other requests.
