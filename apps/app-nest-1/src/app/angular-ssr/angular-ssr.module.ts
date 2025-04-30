import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AngularSsrController } from './angular-ssr.controller';
import { AngularSsrService } from './angular-ssr.service';
import {
  ANGULAR_NODE_APP_ENGINE_TOKEN,
  WRITE_RESPONSE_TO_NODE_RESPONSE_TOKEN,
} from './angular-ssr.inject-tokens';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'dist/apps/app-angular-1/browser'),
      exclude: ['/api*'],
      serveStaticOptions: {
        maxAge: '1y',
        index: false,
        redirect: false,
      },
    }),
  ],
  controllers: [AngularSsrController],
  providers: [
    {
      provide: ANGULAR_NODE_APP_ENGINE_TOKEN,
      useFactory: async () => {
        // @ts-ignore
        const mod = await import('./angular-ssr.engine.mjs');
        return mod.createAngularNodeAppEngine();
      },
    },
    {
      provide: WRITE_RESPONSE_TO_NODE_RESPONSE_TOKEN,
      useFactory: async () => {
        // @ts-ignore
        const mod = await import('./angular-ssr.engine.mjs');
        return mod.writeResponseToNodeResponse;
      },
    },
    AngularSsrService,
  ],
})
export class AngularSsrModule {}
