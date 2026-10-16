import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { ApiErrors } from "../common/api-docs.js";
import { Public } from "../common/decorators/index.js";
import { AppException, ErrorCode } from "../common/errors.js";
import { DATABASE, type Database, pingDatabase } from "../db/client.js";

export class HealthDto {
  @ApiProperty({ type: String, example: "ok" })
  status!: string;
}

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Sağlık denetimi (veritabanı bağlantısını da sınar)" })
  @ApiOkResponse({ type: HealthDto, description: "Servis ve veritabanı çalışıyor." })
  @ApiErrors(429)
  async check(): Promise<HealthDto> {
    if (!(await pingDatabase(this.db))) {
      throw new AppException(503, ErrorCode.SERVICE_UNAVAILABLE, "Veritabanına ulaşılamıyor.");
    }
    return { status: "ok" };
  }
}
