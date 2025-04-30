// import type {
//   AngularNodeAppEngine,
//   writeResponseToNodeResponse,
// } from '@angular/ssr/node';
import { Inject, Injectable } from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import {
  ANGULAR_NODE_APP_ENGINE_TOKEN,
  WRITE_RESPONSE_TO_NODE_RESPONSE_TOKEN,
} from './angular-ssr.inject-tokens';

@Injectable()
export class AngularSsrService {
  constructor(
    @Inject(ANGULAR_NODE_APP_ENGINE_TOKEN)
    private angularApp: any,
    @Inject(WRITE_RESPONSE_TO_NODE_RESPONSE_TOKEN)
    private writeResponseToNodeResponseFn: any,
  ) {}

  async handleAngularRequest(req: ExpressRequest) {
    return this.angularApp.handle(req);
  }

  async writeResponseToExpressResponse(
    response: Response,
    res: ExpressResponse,
  ): Promise<void> {
    await this.writeResponseToNodeResponseFn(response, res);
  }
}
