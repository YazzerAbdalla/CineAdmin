import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { MovieService } from 'src/movie/movie.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PassportJwtGuard } from 'src/auth/guards/passport-jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { AdminQueryDto } from './dto/admin-movie-query.dto';
import { ExtendedRequest } from 'src/types/extendedRequest';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Roles('admin')
@UseGuards(PassportJwtGuard, RoleGuard)
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly movieService: MovieService,
    private readonly commentService: CommentService,
    private readonly adminService: AdminService,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users returned.' })
  findAllUsers() {
    return this.userService.listAllUsers();
  }

  @Put('users/:userId/role')
  @ApiOperation({ summary: 'Update a user role (e.g., user → admin)' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: "User's role updated successfully.",
  })
  updateUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateUserRoleDto,
  ) {
    return this.userService.updateUserRole(userId, body.newRole);
  }

  @Delete('users/:userId')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }

  @Get('movies')
  @ApiOperation({ summary: 'Get movies for admin filtering by approval' })
  @ApiQuery({
    name: 'approved',
    required: false,
    type: String,
    enum: ['true', 'false', 'null'],
  })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'releaseDate', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Movies filtered for admin returned.',
  })
  getUnapprovedMovies(@Query() QueryDto: AdminQueryDto) {
    return this.movieService.findAllForAdmin(QueryDto);
  }

  @Get('comments')
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'List of all comments returned.' })
  getAllComments() {
    return this.commentService.findAllComments();
  }

  @Put('movies/:id/status/:status')
  @ApiOperation({ summary: 'Update the movie approval status' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({
    name: 'status',
    type: String,
    enum: ['true', 'false'],
    description: 'Approval status',
  })
  @ApiResponse({
    status: 200,
    description: "Movie's status updated successfully.",
  })
  updateMovieStatus(@Param('status') status: string, @Param('id') id: number) {
    const isApproved = status === 'true';
    return this.movieService.updateMovieStatus(id, isApproved);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: ExtendedRequest,
  ) {
    return this.commentService.remove(id, request.user);
  }

  @Delete('movies/:id')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully.' })
  deleteMovie(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: ExtendedRequest,
  ) {
    return this.movieService.remove(id, request.user);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get admin statistics (user count, movie count, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin statistics returned successfully.',
  })
  getAdminStatistics() {
    return this.adminService.getSystemStatistics();
  }
}
