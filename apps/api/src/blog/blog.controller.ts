import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiNoContentResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiErrors } from "../common/api-docs.js";
import type { AuthUser } from "../common/auth-types.js";
import { CurrentUser, OptionalAuth, Roles } from "../common/decorators/index.js";
import { uuidParam } from "../common/pipes.js";
import { BlogCacheInterceptor } from "./blog-cache.interceptor.js";
import { BlogService } from "./blog.service.js";
import { BLOG_BLOCK_MODELS } from "./dto/blog-block.dto.js";
import { BlogPostDto, BlogPostPageDto } from "./dto/blog-post.dto.js";
import { CreateBlogPostDto, GetBlogPostQueryDto, ListBlogPostsQueryDto, UpdateBlogPostDto } from "./dto/blog-requests.dto.js";

const OPTIONAL_AUTH_NOTE =
  "Oturum açmak gerekmez. `Authorization` başlığı gönderilirse geçerli olmalıdır (aksi 401). Başlık taşıyan yanıtlar `Cache-Control: private, no-store` ile döner.";

@ApiTags("blog")
@ApiExtraModels(...BLOG_BLOCK_MODELS)
@UseInterceptors(BlogCacheInterceptor)
@Controller("blog/posts")
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  @Get()
  @OptionalAuth()
  // Belirteç isteğe bağlı: `bearer` ya da hiçbiri (boş gereksinim = anonim).
  @ApiBearerAuth()
  @ApiSecurity({})
  @ApiOperation({
    summary: "Blog yazılarını listeler (gövdesiz kartlar)",
    description:
      `Varsayılan olarak yalnız yayındaki yazılar, yayın tarihine göre yeniden eskiye. Yanıtta gövde yoktur; ayrıntı için \`GET /blog/posts/{slug}\`. ` +
      "`status=draft|all` yalnız yöneticiye açıktır: oturumsuz istek 401, yönetici olmayan kullanıcı 403 alır (parametre sessizce yok sayılmaz). " +
      "İstenen dilde çeviri yoksa başlık ve özet Türkçeye düşer (`lang`, `complete`). " +
      OPTIONAL_AUTH_NOTE,
  })
  @ApiOkResponse({ type: BlogPostPageDto, description: "Sayfalı yazı kartları." })
  @ApiErrors(400, 401, 403, 429)
  listPosts(@Query() query: ListBlogPostsQueryDto, @CurrentUser() user?: AuthUser): Promise<BlogPostPageDto> {
    return this.blog.list(query, user);
  }

  @Get(":slug")
  @OptionalAuth()
  @ApiBearerAuth()
  @ApiSecurity({})
  @ApiOperation({
    summary: "Blog yazısı ayrıntısı (tam gövde)",
    description:
      "Taslak anonim ya da yönetici olmayan çağıran için hiç yokmuş gibi 404 döner (varlığı sızmaz). Yönetici taslakları da görür; " +
      "`status` verilirse yalnız o durumdaki yazı döner (`draft`/`all` yalnız yöneticiye: oturumsuz 401, kullanıcı 403). " +
      "İstenen dilde çeviri yoksa başlık, özet ve gövde Türkçeye düşer. " +
      OPTIONAL_AUTH_NOTE,
  })
  @ApiOkResponse({ type: BlogPostDto, description: "Yazı ve gövde blokları." })
  @ApiErrors(400, 401, 403, 404, 429)
  getPost(@Param("slug") slug: string, @Query() query: GetBlogPostQueryDto, @CurrentUser() user?: AuthUser): Promise<BlogPostDto> {
    return this.blog.get(slug, query, user);
  }

  @Post()
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Blog yazısı oluşturur (yönetici)",
    description:
      "`status` verilmezse `draft`. `published` ilk yayında `publishedAt` atar ve Türkçe gövde boş olamaz. Gövde blokları doğrulanır " +
      "(bilinmeyen tür, aşırı uzunluk, kontrol karakteri, https dışı görsel adresi 400). Gövde sınırı diğer uçlardan yüksektir (`BODY_LIMIT_LARGE`).",
  })
  @ApiCreatedResponse({ type: BlogPostDto, description: "Oluşturulan yazı (Türkçe)." })
  @ApiErrors(400, 401, 403, 409, 413, 429)
  createPost(@Body() dto: CreateBlogPostDto, @CurrentUser() user: AuthUser): Promise<BlogPostDto> {
    return this.blog.create(dto, user);
  }

  @Patch(":id")
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Blog yazısını günceller / yayınlar / taslağa alır (yönetici)",
    description:
      "Yalnız gönderilen alanlar değişir. `translations` içinde gönderilen her dil bütün olarak değişir, diğer diller korunur; `en`/`es` için `null` çeviriyi siler. " +
      "`status: published` ilk yayında `publishedAt` atar; taslağa geri almak ve yeniden yayınlamak özgün `publishedAt` değerini korur. " +
      "`coverImage`/`countryCode` için `null` alanı temizler.",
  })
  @ApiOkResponse({ type: BlogPostDto, description: "Güncellenmiş yazı (Türkçe)." })
  @ApiErrors(400, 401, 403, 404, 409, 413, 429)
  updatePost(@Param("id", uuidParam()) id: string, @Body() dto: UpdateBlogPostDto): Promise<BlogPostDto> {
    return this.blog.update(id, dto);
  }

  @Delete(":id")
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Blog yazısını siler (yönetici)" })
  @ApiNoContentResponse({ description: "Yazı silindi." })
  @ApiErrors(400, 401, 403, 404, 429)
  async deletePost(@Param("id", uuidParam()) id: string): Promise<void> {
    await this.blog.remove(id);
  }
}
