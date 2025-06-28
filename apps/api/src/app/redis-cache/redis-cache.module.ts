import { ConfigurationModule } from '@ghostfolio/api/services/configuration/configuration.module';
import { ConfigurationService } from '@ghostfolio/api/services/configuration/configuration.service';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

import { RedisCacheService } from './redis-cache.service';

@Module({
  exports: [RedisCacheService],
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) => {
        const redisUser = configurationService.get('REDIS_USER');
        const redisPassword = encodeURIComponent(configurationService.get('REDIS_PASSWORD'));
        const redisHost = configurationService.get('REDIS_HOST');
        const redisPort = configurationService.get('REDIS_PORT');

        return {
          store: redisStore,
          ttl: configurationService.get('CACHE_TTL'),
          url: `rediss://${redisUser}:${redisPassword}@${redisHost}:${redisPort}`,
        } as RedisClientOptions;
      },
    }),
    ConfigurationModule,
  ],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
