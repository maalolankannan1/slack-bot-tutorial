const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const port = process.env.SLACK_PORT || 3020;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on('app_mention', (event) => {
    console.log(`Got message from user ${event.user} : ${event.text}`);
    (async () => {
        try{
            await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:`});
        } catch(err) {
            console.log(err.data);
        }
    })();
});

slackEvents.on('error', console.error);

(async () => {
    const server = await slackEvents.start(port);
    console.log(`Listening for events on ${server.address().port}`);
    console.log(slackSigningSecret+".\n"+slackToken);
  })();

