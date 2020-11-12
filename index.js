import fetch from 'node-fetch';
import fs from 'fs';
import luxon from 'luxon';
import twilio from 'twilio';

const SHARED_HEALTH_USERNAME = process.env.SHARED_HEALTH_USERNAME;
const SHARED_HEALTH_PASSWORD = process.env.SHARED_HEALTH_PASSWORD;

const LAST_RESULT_FILE_PATH = 'last-result-string.txt';

const tokenResponse = await fetch("https://shcord.verosource.com/manitoba-gateway/v1/authentication/login/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-vsf-api-token": "OWFhOWIwNWYtYzc3Ni00NDljLTk1ZWEtZWZkYWFkNWIzZDY0",
    "x-vsf-client-version": "Manitoba SH-CORD-0.1.0-Desktop",
    "x-vsf-meta-device-id": "null"
  },
  "referrer": "https://shcord.verosource.com/manitoba/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": `{\"userName\":\"${SHARED_HEALTH_USERNAME}\",\"password\":\"${SHARED_HEALTH_PASSWORD}\"}`,
  "method": "POST",
  "mode": "cors"
});

if (!tokenResponse.ok) {
    throw new Error('Failed to fetch token');
}

const authorizationHeaderValue = tokenResponse.headers.get('authorization');
const [, token] = authorizationHeaderValue.split(' ');

const resultsResponse = await fetch("https://shcord.verosource.com/manitoba-gateway/v1/results/", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en",
      "authorization": `Bearer ${token}`,
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-vsf-api-token": "OWFhOWIwNWYtYzc3Ni00NDljLTk1ZWEtZWZkYWFkNWIzZDY0",
      "x-vsf-client-version": "Manitoba SH-CORD-0.1.0-Desktop",
      "x-vsf-meta-device-id": "null"
    },
    "referrer": "https://shcord.verosource.com/manitoba/app",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  });

if (!resultsResponse.ok) {
    throw new Error('Failed to get results', resultsResponse);
}

const resultsJson = await resultsResponse.json();
const firstResult = resultsJson.data.patientResults.results[0];

let resultString = '';

if (firstResult) {
    const resultDate = luxon.DateTime.fromISO(firstResult.resultDate).toFormat('LLL d, yyyy');
    resultString = `Result from ${resultDate}: ${firstResult.result}`;
} else {
    console.log('Results array was empty. Assuming no previous test results.');
}

try {
    const lastResultString = fs.readFileSync(LAST_RESULT_FILE_PATH);

    if (resultString != lastResultString) {
        console.log(`Change detected, txting: '${resultString}'`);
        console.log(`Previously: '${lastResultString}'`);

        const twilioClient = twilio();
        const from = process.env.TWILIO_ORIGIN_NUMBER;
        const to = process.env.TWILIO_DESTINATION_NUMBER;
    
        twilioClient.messages.create({
            body: resultString,
            from,
            to,
        });

        storeResultString(resultString);
    } else {
        console.log('No change detected.');
    }
} catch (error) {
    if (error.code === 'ENOENT') {
        console.log(`No previous result string found, is this the first run?`);
        storeResultString(resultString);
    } else {
        console.log('Unrecognised error', error);
    }
}

function storeResultString(string) {
    console.log(`Storing result string: ${string}`);
    fs.writeFileSync(LAST_RESULT_FILE_PATH, string);
}