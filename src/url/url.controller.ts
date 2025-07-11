import {
  Body,
  Controller,
  Get,
  BadRequestException,
  Post,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ConfigService } from '@nestjs/config';
import * as validUrl from 'valid-url';
import { Response } from 'express';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('URL')
@Controller('api')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly configService: ConfigService,
  ) {}

  @Post('shorten')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://example.com/some/long/url' },
        customCode: { type: 'string', example: 'mycustom123', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Shortened URL created' })
  async shortenUrl(@Body() body: { url: string; customCode?: string }) {
    const result = await this.urlService.shorten(body.url, body.customCode);
    const baseUrl = this.configService.get<string>('BASE_URL');
    return {
      originalUrl: result.originalUrl,
      shortUrl: `${baseUrl}/r/${result.shortCode}`,
    };
  }

  @Get('r/:shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await this.urlService.findAndIncrement(shortCode);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (!isValidHttpUrl(url.originalUrl)) {
      throw new BadRequestException('Invalid URL format');
    }

    return res.redirect(302, url.originalUrl);
  }

  @Get('stats/:shortCode') // ✅ corrected path
  @ApiResponse({ status: 200, description: 'URL stats fetched successfully' })
  async getStats(@Param('shortCode') shortCode: string) {
    const url = await this.urlService.getStats(shortCode);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    const baseUrl = this.configService.get<string>('BASE_URL');

    return {
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/r/${url.shortCode}`,
      clicks: url.clicks,
    };
  }
}

function isValidHttpUrl(url: string): boolean {
  return Boolean(validUrl.isWebUri(url));
}
