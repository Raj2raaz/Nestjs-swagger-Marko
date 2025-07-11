import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './url.schema';
import { nanoid } from 'nanoid';
// import validUrl from 'valid-url';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    private configService: ConfigService,
  ) {}

  private isValidUrl(url: string): boolean {
    try {
      const urlObject = new URL(url);
      // Only allow http and https protocols
      return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async shorten(originalUrl: string, customCode?: string): Promise<Url> {
    // Validate original URL
    if (!this.isValidUrl(originalUrl)) {
      throw new BadRequestException('Invalid URL format');
    }

    let shortCode = customCode;

    if (shortCode) {
      // Check if custom code is already used
      const exists = await this.urlModel.findOne({ shortCode });
      if (exists) {
        throw new ConflictException('Custom code already in use');
      }
    } else {
      // Generate new unique code
      do {
        shortCode = nanoid(6);
      } while (await this.urlModel.findOne({ shortCode }));
    }

    // Save to DB
    const newUrl = new this.urlModel({ originalUrl, shortCode });
    return newUrl.save();
  }

  async findAndIncrement(shortCode: string): Promise<Url | null> {
    // Check if the URL exists first
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) {
      throw new BadRequestException('Short URL not found');
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    return url;
  }

  async getStats(shortCode: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortCode });
  }
}
