/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';
var Alexa = require('alexa-sdk');
var moment = require('moment');

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
};

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Sleep Cycle Hacker',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, What time should I go to bed?... Now, what can I help you with? ",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Hack you Sleep Cycle!',
            HELP_MESSAGE: "You can ask questions such as, What time should I go to bed? or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what time should I wake up? or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye! Have a good sleep!',
            INVALID_TIME: 'Hmm, that time seems to be invalid.',
            INVALID_TIME_REPROMPT: 'Ask again! Try saying time like ten <say-as interpret-as=\"spell-out\">PM</say-as> when you ask your question'
        },
    }
}

const handlers = {
    'LaunchRequest': function () {
        
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));

        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'CalculateSleepTimeIntent': function () {
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), 'Sleepy Time...');
        var WakeUpTime = this.event.request.intent.slots.WakeUpTime.value;

         if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS"){
            this.context.succeed({
                "response": {
                    "directives": [
                        {
                            "type": "Dialog.Delegate"
                        }
                    ],
                    "shouldEndSession": false
                },
                "sessionAttributes": {
                    "speechOutput": "INVALID_TIME",
                    "repromptSpeech": "INVALID_TIME_REPROMPT"
                }
            });
        } else {

            var WakeUpTime = this.event.request.intent.slots.WakeUpTime.value;
            console.log(WakeUpTime);
            if(WakeUpTime === "now" || WakeUpTime === "current time" ){
                SleepTime = moment();
            }
            var SleepFormula = moment(WakeUpTime, "HH:mm");

            console.log(SleepFormula.isValid())

            if (SleepFormula.isValid())
            {
                SleepFormula.subtract(7, 'hours').subtract(45, 'minutes');
                SleepFormula = SleepFormula.format('h:mm a');
                this.attributes.speechOutput = 'Your bedtime is ' + SleepFormula;
                this.emit(':tellWithCard', this.attributes.speechOutput, this.attributes.repromptSpeech, cardTitle, SleepFormula);
            }
            else{
                this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
            }
        }

    },
    'CalculateWakeUpTimeIntent': function () {
         const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'));
        var SleepTime = this.event.request.intent.slots.SleepTime.value;
        if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS"){
            this.context.succeed({
                "response": {
                    "directives": [
                        {
                            "type": "Dialog.Delegate"
                        }
                    ],
                    "shouldEndSession": false
                },
                "sessionAttributes": {}
            });
        }
        else{
            var SleepTime = this.event.request.intent.slots.SleepTime.value;
            console.log(SleepTime);
            if(SleepTime === "now" || SleepTime === "current time" ){
                // need to ask for timezone :'(
                SleepTime = moment();
            }
            console.log
            var SleepFormula = moment(SleepTime, "HH:mm");

            if (SleepFormula.isValid()){
                SleepFormula.add(7, 'hours').add(45, 'minutes');
                SleepFormula = SleepFormula.format('h:mm a');
                this.attributes.speechOutput = 'Your Wake Up Time Is ' + SleepFormula;
                this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
                this.emit(':tellWithCard', this.attributes.speechOutput, this.attributes.repromptSpeech, cardTitle, SleepFormula);
            }
            else{
                this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
            }
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },

    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
    context.succeed();
    context.succeed();

};