import type { CheckoutPaymentMethod } from "@/lib/checkout/types";

export const checkoutContent = {
  shippingTitle: "寄送資訊",
  shippingOnlyLabel: "結帳寄送",
  emailHint: "結帳後會寄發確認電子郵件。",
  addressHint: "我們無法送貨至郵政信箱",
  phoneHint: "請輸入你的電話號碼，以利辦理清關手續",
  shippingInfoTitle: "運送資訊",
  shippingInfoFeeLabel: "免運費",
  shippingInfoDeliveryLabel: "第一批商品",
  shippingInfoDeliveryWindow: "在 3月4日 週三至 3月9日 週一之間送達",
  paymentTitle: "付款",
  promoTitle: "有促銷代碼嗎？",
  promoHint: "每筆訂單限用 1 個促銷代碼。",
  promoSuccessCode: "WELCOME10",
  promoDiscountAmount: 500,
  paymentMethods: [
    { value: "card", label: "信用卡或金融簽帳卡" },
    { value: "paypal", label: "PayPal" },
    { value: "gpay", label: "Google Pay" },
  ] as Array<{ value: CheckoutPaymentMethod; label: string }>,
  placeOrderDisclaimer:
    "點選「下訂單」即代表你同意服務條款與隱私政策。M5 會建立訂單並進入待付款狀態，實際 Stripe 扣款於 M7 串接。",
  placeOrderButtonLabel: "下訂單",
  orderSummaryTitle: "訂單摘要",
  freeShippingQualifiedLabel: "你已符合免運費資格！",
  totalLabel: "總計",
  savingsLabelPrefix: "節省",
  orderDeliveryWindowTitle: "在 3月4日 週三至 3月9日 週一之間送達",
};
