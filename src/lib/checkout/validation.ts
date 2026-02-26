import type {
  CheckoutFormErrors,
  CheckoutFormState,
  CheckoutPaymentMethod,
  CheckoutPromo,
} from "@/lib/checkout/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d[\d\s-]{7,14}$/;
const CARD_NUMBER_PATTERN = /^\d{13,19}$/;
const CARD_EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CARD_CVC_PATTERN = /^\d{3,4}$/;
const NAME_PATTERN = /^[A-Za-z\u4E00-\u9FFF][A-Za-z\u4E00-\u9FFF\s'’-]{0,29}$/;
const CARD_HOLDER_PATTERN = /^[A-Za-z\s'’-]{2,40}$/;
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

    if (!CARD_NUMBER_PATTERN.test(form.cardNumber.replace(/\s+/g, ""))) {
      errors.cardNumber = "請輸入有效卡號";
    }

    if (!CARD_EXPIRY_PATTERN.test(form.cardExpiry.trim())) {
      errors.cardExpiry = "格式為 MM/YY";
    } else if (isExpiredCardDate(form.cardExpiry.trim())) {
      errors.cardExpiry = "卡片已過期";
    }

    if (!CARD_CVC_PATTERN.test(form.cardCvc.trim())) {
      errors.cardCvc = "請輸入有效安全碼";
    }
  }

  return errors;
}

function isExpiredCardDate(expiry: string) {
  const [monthValue, yearValue] = expiry.split("/");
  const month = Number(monthValue);
  const year = Number(yearValue);
  if (!month || Number.isNaN(year)) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) {
    return true;
  }
  if (year === currentYear && month < currentMonth) {
    return true;
  }
  return false;
}
