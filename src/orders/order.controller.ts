import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // 🛒 PLACE ORDER
  @Post()
  placeOrder(@CurrentUser() user) {
    return this.ordersService.placeOrder(user.id);
  }

  // 👤 GET MY ORDERS
  @Get('my')
  getMyOrders(@CurrentUser() user) {
    return this.ordersService.getUserOrders(user.id);
  }

  // 🔍 GET ORDER BY ID
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  // 📦 GET ALL ORDERS (ADMIN ONLY)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // 🔄 UPDATE STATUS (ADMIN ONLY)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto.status);
  }

  // ❌ DELETE ORDER (ADMIN ONLY)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}