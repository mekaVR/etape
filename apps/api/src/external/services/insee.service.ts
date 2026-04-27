import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InseeService {
  private readonly logger = new Logger(InseeService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    const apiUrl = this.config.get<string>('INSEE_API_URL');
    const apiKey = this.config.get<string>('INSEE_API_KEY');

    if (!apiUrl || !apiKey) {
      throw new Error(
        'INSEE_API_URL and INSEE_API_KEY must be set in environment',
      );
    }

    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async getSiret(siret: string): Promise<unknown> {
    const url = `${this.apiUrl}/siret/${siret}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-INSEE-Api-Key-Integration': this.apiKey,
          Accept: 'application/json',
        },
      });
    } catch (error) {
      this.logger.error('INSEE request failed', error);
      throw new InternalServerErrorException('Unable to reach INSEE API');
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new HttpException(
        body ?? { message: response.statusText },
        response.status,
      );
    }

    return body;
  }
}
