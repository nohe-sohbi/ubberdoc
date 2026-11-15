import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { Injectable, Logger } from '@nestjs/common';
import { EnvironmentService } from '../environment/environment.service';
import { Redis } from 'ioredis';

@Injectable()
export class RedisHealthIndicator {
  private readonly logger = new Logger(RedisHealthIndicator.name);

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const check = this.healthIndicatorService.check(key);
    try {
      const redis = new Redis(this.environmentService.getRedisUrl(), {
        maxRetriesPerRequest: 15,
      });

      await redis.ping();
      redis.disconnect();
      return check.up();
    } catch (e) {
      this.logger.error(e);
      return check.down(`${key} is not available`);
    }
  }
}
