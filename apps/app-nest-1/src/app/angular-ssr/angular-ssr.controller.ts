import { Controller, All, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AngularSsrService } from './angular-ssr.service';

@Controller('**')
export class AngularSsrController {
  constructor(private readonly angularSsrService: AngularSsrService) {}

  @All()
  async handleAngularRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      // Skip API routes which are handled by NestJS
      if (req.path.startsWith('/api')) {
        return next();
      }

      const response = await this.angularSsrService.handleAngularRequest(req);

      if (response) {
        await this.angularSsrService.writeResponseToExpressResponse(
          response,
          res,
        );
      }

      return next();
    } catch (error) {
      return next(error);
    }
  }
}
