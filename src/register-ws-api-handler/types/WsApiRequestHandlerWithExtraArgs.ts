import type { NextFunction, Request } from 'express';
import type WebSocket from 'ws';
import type { AnyCommands, AnyQuery } from 'yaschema-ws-api';

import type { WsApiResponders } from './WsApiResponders';

export type WsApiRequestHandlerWithExtraArgs<
  RequestCommandsT extends AnyCommands,
  ResponseCommandsT extends AnyCommands,
  CommandNameT extends keyof RequestCommandsT & string,
  QueryT extends AnyQuery,
  ExtraArgsT extends Record<string, any>
> = (
  args: ExtraArgsT & {
    express: {
      ws: WebSocket;
      req: Request;
      next: NextFunction;
    };
    connectionId: string;
    query: QueryT;
    input: RequestCommandsT[CommandNameT]['valueType'];
    output: WsApiResponders<ResponseCommandsT>;
  }
) => Promise<void>;
