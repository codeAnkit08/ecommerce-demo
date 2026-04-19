import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';


@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  // 🛒 Add to cart
  @Post()
  addToCart(@CurrentUser() user, @Body() dto: any) {
    console.log('Add to cart request:', { user, dto });
    return this.cartService.addToCart(user.id, dto);
  }

  // 📦 Get cart
  @Get()
  getCart(@CurrentUser() user) {
    console.log('Get cart request for user:', user);
    return this.cartService.getCart(user.id);
  }

  // ❌ Remove item
  @Delete(':itemId')
  removeItem(@CurrentUser() user, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(user.sub, itemId);
  }

  // 🔄 Update quantity
  @Patch(':itemId')
  updateQuantity(
    @CurrentUser() user,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(user.sub, itemId, quantity);
  }
}