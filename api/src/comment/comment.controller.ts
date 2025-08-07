import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Put,
  Query,
  NotImplementedException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PassportJwtGuard } from 'src/auth/guards/passport-jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ExtendedRequest } from 'src/types/extendedRequest';
import { CommentQueryDto } from './dto/comments-query.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('movies/:id/comments')
  @ApiOperation({ summary: 'Create a new comment for a movie' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Comment created successfully.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @Roles('author', 'admin', 'user')
  @UseGuards(PassportJwtGuard, RoleGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param() params: { id: number },
    @Request() request: ExtendedRequest,
  ) {
    return this.commentService.create(
      createCommentDto,
      params.id,
      request.user.userId,
    );
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment by its ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Comment deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @Roles('admin', 'user')
  @UseGuards(PassportJwtGuard, RoleGuard)
  remove(@Param('id') id: number, @Request() request: ExtendedRequest) {
    return this.commentService.remove(+id, request.user);
  }

  @Put('comments/:id')
  @ApiOperation({ summary: 'Update a comment by its ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Comment updated successfully.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @Roles('user')
  @UseGuards(PassportJwtGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() request: ExtendedRequest,
  ) {
    return this.commentService.update(+id, updateCommentDto, request.user);
  }

  @Get('movies/:id/comments')
  @ApiOperation({ summary: 'Retrieve all comments for a specific movie' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Comments retrieved successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  findAll(@Query() query: CommentQueryDto, @Param() params: { id: number }) {
    return this.commentService.findAll(params.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Not implemented route placeholder' })
  @ApiBadRequestResponse({ description: 'This route not implemented yet.' })
  findOne() {
    throw new NotImplementedException('This route not implemented yet.');
  }
}
