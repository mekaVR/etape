import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GouvService {
  private readonly logger = new Logger(GouvService.name);
  private readonly apiUrl: string;

  constructor(private readonly config: ConfigService) {
    const apiUrl = this.config.get<string>('GOUV_API_URL');

    if (!apiUrl) {
      throw new Error('GOUV_API_URL must be set in environment');
    }

    this.apiUrl = apiUrl;
  }

  // TODO: URL et shape à confirmer. Placeholder — à ajuster quand
  // l'endpoint "effectif moyen" côté api.gouv.fr sera choisi.
  async getEffectif(siret: string): Promise<unknown> {
    const url = `${this.apiUrl}/${siret}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
    } catch (error) {
      this.logger.error('Gouv request failed', error);
      throw new InternalServerErrorException('Unable to reach Gouv API');
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
