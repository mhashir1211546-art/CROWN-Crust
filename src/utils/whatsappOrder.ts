import {
  CrustOption,
  PizzaItem,
  PizzaSize,
  RESTAURANT_CONFIG,
  formatCurrency,
} from '../config/restaurantConfig';

export interface OrderCartItem {
  key: string;
  pizza: PizzaItem;
  size: PizzaSize;
  crust: CrustOption;
  extras: string[];
  unitPrice: number;
  quantity: number;
}

export interface WhatsAppOrderPayload {
  customerName: string;
  customerPhone: string;
  fulfillment: 'delivery' | 'pickup';
  deliveryZoneName: string;
  deliveryAddress: string;
  items: OrderCartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

export function formatWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const lines: string[] = [
    `*${RESTAURANT_CONFIG.brandName.toUpperCase()} — NEW ORDER*`,
    '--------------------------------',
    `*Customer Name:* ${payload.customerName}`,
    `*Phone Number:* ${payload.customerPhone}`,
    `*Order Type:* ${
      payload.fulfillment === 'delivery' ? 'Delivery (Cash on Delivery)' : 'Takeaway / Pickup'
    }`,
  ];

  if (payload.fulfillment === 'delivery') {
    lines.push(`*Delivery Zone:* ${payload.deliveryZoneName}`);
    lines.push(`*Delivery Address:* ${payload.deliveryAddress}`);
  }

  lines.push('', '*Order Items:*');

  payload.items.forEach((item, index) => {
    const extrasText =
      item.extras.length > 0 ? item.extras.join(', ') : 'None';
    const lineTotal = item.unitPrice * item.quantity;
    lines.push(
      `${index + 1}. *${item.pizza.name}*`,
      `   - Size: ${item.size}`,
      `   - Crust: ${item.crust}`,
      `   - Extra Toppings: ${extrasText}`,
      `   - Quantity: ${item.quantity}`,
      `   - Line Total: ${formatCurrency(lineTotal)}`
    );
  });

  lines.push(
    '',
    '--------------------------------',
    `*Subtotal:* ${formatCurrency(payload.subtotal)}`,
    `*Delivery Fee:* ${
      payload.deliveryFee === 0 ? 'Free' : formatCurrency(payload.deliveryFee)
    }`,
    `*Grand Total:* ${formatCurrency(payload.grandTotal)}`
  );

  return lines.join('\n');
}

export function buildWhatsAppOrderUrl(message: string): string {
  const cleanDigits = RESTAURANT_CONFIG.contact.whatsappNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanDigits}?text=${encodedText}`;
}
