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
    const result = this.cartService.addToCart(user.id, dto);
    return {
      success: true,
      message: 'Item added to cart',
      data: result,
    }
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
   const result = this.cartService.removeItem(user.id, itemId);
   return {
      success: true,
      message: 'Item removed from cart',
      data: result
   };
  }

  // 🔄 Update quantity
  @Patch(':itemId')
  updateQuantity(
    @CurrentUser() user,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(user.id, itemId, quantity);
  }
}