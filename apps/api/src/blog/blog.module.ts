import { Module } from "@nestjs/common";
import { BlogController } from "./blog.controller.js";
import { BlogService } from "./blog.service.js";

/** Blog yazıları: herkese açık okuma (yönetici taslakları da görür) ve yönetici yazma uçları. */
@Module({
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
