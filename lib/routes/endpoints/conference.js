const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', async(req, res) => {
  const {logger, client} = req.app.locals;
  const payload = req.body;
  logger.info({payload}, 'POST /conference');
  /* create a conference for each unique caller */
  const confName = `conf-${payload.from}`;

  try {
    const app = new WebhookResponse();
    app
      .say({text: 'Please wait while we outdial the second party'})
      .conference({
        name: confName,
        beep: true,
        startConferenceOnEnter: false,
        endConferenceOnExit: true,
        statusEvents: [
          'start',
          'end',
          'join',
          'leave'
        ],
        statusHook:'/conference/status',
      });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }

  /* outdial a second party and join them to the conference */
  try {
    const sid = await client.calls.create({
      from: payload.from,
      to: {
        type: 'phone',
        number: '16137451576'
      },
      call_hook: 'http://jambonz-apps.drachtio.org/conference/outdial',
      call_status_hook: 'http://jambonz-apps.drachtio.org/call-status',
      timeout: 25,
      tag: {
        conference: confName
      }
    });
    logger.info(`launched second call with callSid ${sid}`);
  } catch (err) {
    logger.error({err}, 'Error');
  }
});


router.post('/outdial', async(req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  logger.info({payload}, 'POST /conference/outdial');
  try {
    /* create a conference for each unique caller */
    const confName = payload.customerdata.conference;
    logger.info(`adding second party to ${confName}`);
    const app = new WebhookResponse();
    app.conference({
      name: confName,
      startConferenceOnEnter: true,
      endConferenceOnExit: true
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

router.post('/status', async(req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  logger.info({payload}, 'POST /conference/status - got a conf status event');
  res.sendStatus(200);
});

module.exports = router;
