// cart-response.dto.ts
export class CartItemResponseDto {
  id!: string;
  quantity!: number;

  product!: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null; // ✅ runtime field
  };
}