import type {
  CheckoutFormErrors,
  CheckoutFormState,
  CheckoutPaymentMethod,
  CheckoutPromo,
} from "@/lib/checkout/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d[\d\s-]{7,14}$/;
const NAME_PATTERN = /^[A-Za-z\u4E00-\u9FFF][A-Za-z\u4E00-\u9FFF\s'’-]{0,29}$/;
const CARD_HOLDER_PATTERN = /^[A-Za-z\u4E00-\u9FFF\s'’-]{2,40}$/;
const PO_BOX_PATTERN = /(郵政信箱|p\.?\s*o\.?\s*box|post office box)/i;

export function normalizePromoCode(rawCode: string) {
  return rawCode.trim().toUpperCase();
}

export function tryApplyPromoCode(rawCode: string, successCode: string, discountAmount: number): CheckoutPromo | null {
  const normalized = normalizePromoCode(rawCode);
  if (!normalized || normalized !== successCode) {
    return null;
  }

  return {
    code: normalized,
    discountAmount,
  };
}

export function validateCheckoutForm(
  form: CheckoutFormState,
  paymentMethod: CheckoutPaymentMethod,
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "請輸入有效電子郵件";
  }

  if (!form.firstName.trim()) {
    errors.firstName = "請輸入名字";
  } else if (!NAME_PATTERN.test(form.firstName.trim())) {
    errors.firstName = "你輸入的字元無效。";
  }

  if (!form.lastName.trim()) {
    errors.lastName = "請輸入姓氏";
  } else if (!NAME_PATTERN.test(form.lastName.trim())) {
    errors.lastName = "你輸入的字元無效。";
  }

  if (!form.addressQuery.trim()) {
    errors.addressQuery = "請輸入地址";
  } else if (PO_BOX_PATTERN.test(form.addressQuery.trim())) {
    errors.addressQuery = "我們無法送貨至郵政信箱";
  }

  if (!PHONE_PATTERN.test(form.phone.trim())) {
    errors.phone = "請輸入有效電話號碼";
  }

  if (!form.billingSameAsShipping) {
    if (!form.billingFirstName.trim()) {
      errors.billingFirstName = "請輸入帳單名字";
    } else if (!NAME_PATTERN.test(form.billingFirstName.trim())) {
      errors.billingFirstName = "你輸入的字元無效。";
    }
    if (!form.billingLastName.trim()) {
      errors.billingLastName = "請輸入帳單姓氏";
    } else if (!NAME_PATTERN.test(form.billingLastName.trim())) {
      errors.billingLastName = "你輸入的字元無效。";
    }
    if (!form.billingAddress.trim()) {
      errors.billingAddress = "請輸入帳單地址";
    } else if (PO_BOX_PATTERN.test(form.billingAddress.trim())) {
      errors.billingAddress = "我們無法送貨至郵政信箱";
    }
    if (!PHONE_PATTERN.test(form.billingPhone.trim())) {
      errors.billingPhone = "請輸入有效帳單電話號碼";
    }
  }

  if (paymentMethod === "card") {
    if (!form.cardName.trim()) {
      errors.cardName = "請輸入持卡人姓名";
    } else if (!CARD_HOLDER_PATTERN.test(form.cardName.trim())) {
      errors.cardName = "你輸入的字元無效。";
    }
  }

  return errors;
}
