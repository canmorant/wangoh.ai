import { Module } from "@nestjs/common";
import { ContentModule } from "../content/content.module.js";
import { BlogController } from "./blog.controller.js";
import { BlogService } from "./blog.service.js";

/** Blog yazıları: herkese açık okuma (yönetici taslakları da görür) ve yönetici yazma uçları. */
@Module({
  // Kapak görselinin atfı için (`ImageCreditsService`).
  imports: [ContentModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
