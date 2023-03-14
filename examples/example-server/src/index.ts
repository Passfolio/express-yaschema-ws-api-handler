import bodyParser from 'body-parser';
import express from 'express';
import type { WithWebsocketMethod } from 'express-ws';
import expressWs from 'express-ws';
import { getHttpApiHandlerWrapper, setHttpApiHandlerWrapper } from 'express-yaschema-api-handler';
import { finalizeApiHandlerRegistrations } from 'express-yaschema-api-handler';

import * as handlers from './handlers';

const port = 8080;

const originalAsyncHandlerWrapper = getHttpApiHandlerWrapper();
setHttpApiHandlerWrapper((handler) =>
  originalAsyncHandlerWrapper(async (req, res, next) => {
    try {
      return await handler(req, res, next);
    } catch (e) {
      console.error(e);
      throw e;
    }
  })
);

export const launchServer = async () => {
  const app = express();

  app.use(bodyParser.json({ type: 'application/json' }));

  expressWs(app);
  const appWithWs = app as typeof app & WithWebsocketMethod;

  await handlers.register(appWithWs);

  finalizeApiHandlerRegistrations();

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
launchServer();
