/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

function d(value) {
  return new Prisma.Decimal(value);
}

const productSeeds = [
  {
    slug: "air-max-95-og",
    name: "SwooshLab Air Max 95 OG",
    subtitle: "男鞋",
    brand: "Sportswear",
    category: "shoes",
    audience: "ADULT",
    gender: "MEN",
    status: "UPCOMING",
    badgeLabel: "即將推出",
    basePrice: d("5400"),
    compareAtPrice: d("6200"),
    imageRatio: "portrait",
    sports: ["跑步", "運動生活"],
    fitTags: ["日常通勤", "窄楦"],
    featureTags: ["反光細節", "排汗快乾"],
    techTags: ["Air"],
    colorTags: ["紅色", "黑色", "白色"],
    isFeatured: true,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "AM95OG-BLKRED-25", colorLabel: "多種顏色/Bright Crimson", sizeLabel: "25", unitPrice: d("9720"), compareAtPrice: d("10800"), stockQty: 3 },
    ],
  },
  {
    slug: "air-max-95-big-bubble",
    name: "SwooshLab Air Max 95 Big Bubble",
    subtitle: "女鞋",
    brand: "Sportswear",
    category: "shoes",
    audience: "ADULT",
    gender: "WOMEN",
    status: "UPCOMING",
    badgeLabel: "即將推出",
    basePrice: d("5400"),
    imageRatio: "square",
    sports: ["運動生活"],
    fitTags: ["日常通勤"],
    featureTags: ["反光細節"],
    techTags: ["Air"],
    colorTags: ["黑色", "白色", "灰色"],
    isFeatured: true,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "AM95BB-BLKWHT-28", colorLabel: "Metallic Red Bronze/Metallic Rose Gold", sizeLabel: "28", unitPrice: d("8100"), compareAtPrice: null, stockQty: 2 },
    ],
  },
  {
    slug: "SwooshLab-air-max-95-kids",
    name: "SwooshLab Air Max '95",
    subtitle: "兒童款",
    brand: "Sportswear",
    category: "shoes",
    audience: "KIDS",
    gender: "UNISEX",
    status: "UPCOMING",
    badgeLabel: "即將推出",
    basePrice: d("3500"),
    imageRatio: "portrait",
    sports: ["運動生活"],
    fitTags: ["日常通勤", "寬楦"],
    featureTags: ["排汗快乾"],
    techTags: ["Air"],
    colorTags: ["白色", "橘色"],
    isFeatured: false,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "AM95KID-WHTORG-23", colorLabel: "白色/橘色", sizeLabel: "23", unitPrice: d("3500"), compareAtPrice: null, stockQty: 10 },
    ],
  },
  {
    slug: "pegasus-premium",
    name: "Pegasus Premium",
    subtitle: "男鞋",
    brand: "Sportswear",
    category: "shoes",
    audience: "ADULT",
    gender: "MEN",
    status: "ACTIVE",
    badgeLabel: "熱門",
    basePrice: d("4800"),
    imageRatio: "square",
    sports: ["跑步"],
    fitTags: ["寬楦"],
    featureTags: ["排汗快乾", "反光細節"],
    techTags: ["Zoom Air", "React"],
    colorTags: ["白色", "灰色"],
    isFeatured: true,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "PGSPRM-WHTGRY-28", colorLabel: "白色/灰色", sizeLabel: "28", unitPrice: d("4800"), compareAtPrice: null, stockQty: 15 },
    ],
  },
  {
    slug: "zoom-fly-6",
    name: "Zoom Fly 6",
    subtitle: "女鞋",
    brand: "NOCTA",
    category: "shoes",
    audience: "ADULT",
    gender: "WOMEN",
    status: "ACTIVE",
    badgeLabel: "新品",
    basePrice: d("4300"),
    imageRatio: "portrait",
    sports: ["跑步"],
    fitTags: ["窄楦"],
    featureTags: ["反光細節"],
    techTags: ["Zoom Air", "React"],
    colorTags: ["粉紅色", "藍色"],
    isFeatured: true,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "ZFLY6-PNKBLU-25", colorLabel: "粉紅色/藍色", sizeLabel: "25", unitPrice: d("4300"), compareAtPrice: null, stockQty: 11 },
    ],
  },
  {
    slug: "dunk-low-retro",
    name: "Dunk Low Retro",
    subtitle: "中性",
    brand: "Jordan",
    category: "shoes",
    audience: "ADULT",
    gender: "UNISEX",
    status: "ACTIVE",
    badgeLabel: "即將推出",
    basePrice: d("3400"),
    compareAtPrice: d("3900"),
    imageRatio: "square",
    sports: ["籃球", "運動生活"],
    fitTags: ["日常通勤"],
    featureTags: ["抽繩設計"],
    techTags: ["Air"],
    colorTags: ["紅色", "黑色"],
    isFeatured: false,
    isSale: true,
    imageSrc: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "DUNKLR-REDBLK-275", colorLabel: "紅色/黑色", sizeLabel: "27.5", unitPrice: d("3400"), compareAtPrice: d("3900"), stockQty: 7 },
    ],
  },
  {
    slug: "vomero-plus",
    name: "Vomero Plus",
    subtitle: "跑步",
    brand: "Sportswear",
    category: "shoes",
    audience: "ADULT",
    gender: "UNISEX",
    status: "ACTIVE",
    badgeLabel: "新品",
    basePrice: d("4600"),
    imageRatio: "portrait",
    sports: ["跑步", "健走"],
    fitTags: ["寬楦"],
    featureTags: ["排汗快乾"],
    techTags: ["Zoom Air", "React"],
    colorTags: ["藍色", "黃色"],
    isFeatured: false,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "VOMERO-BLUYLW-28", colorLabel: "藍色/黃色", sizeLabel: "28", unitPrice: d("4600"), compareAtPrice: null, stockQty: 9 },
    ],
  },
  {
    slug: "metcon-10",
    name: "Metcon 10",
    subtitle: "訓練",
    brand: "ACG",
    category: "shoes",
    audience: "ADULT",
    gender: "UNISEX",
    status: "ACTIVE",
    badgeLabel: "熱門",
    basePrice: d("3800"),
    imageRatio: "square",
    sports: ["訓練與健身"],
    fitTags: ["寬楦"],
    featureTags: ["4 向伸縮力"],
    techTags: ["React"],
    colorTags: ["黑色", "灰色"],
    isFeatured: false,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "METCON10-BLKGRY-28", colorLabel: "黑色/灰色", sizeLabel: "28", unitPrice: d("3800"), compareAtPrice: null, stockQty: 8 },
    ],
  },
  {
    slug: "sabrina-2",
    name: "Sabrina 2",
    subtitle: "籃球",
    brand: "Sportswear",
    category: "shoes",
    audience: "ADULT",
    gender: "WOMEN",
    status: "ACTIVE",
    badgeLabel: "新品",
    basePrice: d("3900"),
    imageRatio: "portrait",
    sports: ["籃球"],
    fitTags: ["日常通勤"],
    featureTags: ["4 向伸縮力"],
    techTags: ["Zoom Air"],
    colorTags: ["粉紅色", "黑色"],
    isFeatured: false,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "SABRINA2-PNKBLK-26", colorLabel: "粉紅色/黑色", sizeLabel: "26", unitPrice: d("3900"), compareAtPrice: null, stockQty: 6 },
    ],
  },
  {
    slug: "air-force-1-07",
    name: "Air Force 1 '07",
    subtitle: "男鞋",
    brand: "Sportswear",
    category: "shoes",
    audience: "ADULT",
    gender: "MEN",
    status: "ACTIVE",
    badgeLabel: "經典",
    basePrice: d("3600"),
    imageRatio: "square",
    sports: ["運動生活"],
    fitTags: ["日常通勤"],
    featureTags: ["排汗快乾"],
    techTags: ["Air"],
    colorTags: ["白色", "黑色"],
    isFeatured: true,
    isSale: false,
    imageSrc: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    variants: [
      { sku: "AF107-WHTBLK-27", colorLabel: "白色/黑色", sizeLabel: "27", unitPrice: d("3600"), compareAtPrice: null, stockQty: 14 },
    ],
  },
];

async function resetDatabase() {
  await prisma.paymentAttempt.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.authSession.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
}

async function seed() {
  await resetDatabase();

  const admin = await prisma.user.create({
    data: {
      email: "admin@swooshlab.dev",
      name: "Admin",
      role: "ADMIN",
    },
  });

  const member = await prisma.user.create({
    data: {
      email: "seed.member@swooshlab.dev",
      name: "王小美",
      firstName: "小美",
      lastName: "王",
      role: "CUSTOMER",
      passwordHash: "seed-password-hash",
    },
  });

  await prisma.authSession.create({
    data: {
      userId: member.id,
      tokenHash: "seed-session-token-hash",
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
    },
  });

  await prisma.userProfile.create({
    data: {
      userId: member.id,
      birthday: new Date("1992-01-26T00:00:00.000Z"),
      country: "台灣",
      city: "桃園市",
      district: "桃園區",
      postalCode: "330",
      displayName: "個人檔案顯示資訊",
      avatarText: "長西828228298",
      reviewVisibility: "COMMUNITY",
      locationSharing: "NONE",
      adsByUsageData: true,
      adsByProfileData: true,
      useFitnessData: true,
      primaryPreference: "WOMEN",
      measurementUnit: "METRIC",
    },
  });

  const homeAddress = await prisma.userAddress.create({
    data: {
      userId: member.id,
      recipientLastName: "王",
      recipientFirstName: "小美",
      phone: "0912000111",
      country: "台灣",
      city: "桃園市",
      district: "桃園區",
      addressLine1: "中寧街50巷10號",
      postalCode: "330",
      isDefault: true,
    },
  });

  await prisma.promoCode.create({
    data: {
      code: "WELCOME10",
      discountType: "FIXED",
      discountValue: d("500"),
      isActive: true,
      startsAt: new Date("2026-01-01T00:00:00.000Z"),
      endsAt: new Date("2026-12-31T23:59:59.000Z"),
      usageLimit: 100000,
      usedCount: 0,
    },
  });

  const productMap = new Map();

  for (const seedProduct of productSeeds) {
    const created = await prisma.product.create({
      data: {
        slug: seedProduct.slug,
        name: seedProduct.name,
        subtitle: seedProduct.subtitle,
        description: `${seedProduct.name} 種子資料`,
        brand: seedProduct.brand,
        category: seedProduct.category,
        audience: seedProduct.audience,
        gender: seedProduct.gender,
        status: seedProduct.status,
        badgeLabel: seedProduct.badgeLabel,
        basePrice: seedProduct.basePrice,
        compareAtPrice: seedProduct.compareAtPrice ?? null,
        imageRatio: seedProduct.imageRatio,
        sports: seedProduct.sports,
        fitTags: seedProduct.fitTags,
        featureTags: seedProduct.featureTags,
        techTags: seedProduct.techTags,
        colorTags: seedProduct.colorTags,
        isFeatured: seedProduct.isFeatured,
        isSale: seedProduct.isSale,
        releaseAt: seedProduct.status === "UPCOMING" ? new Date("2026-03-01T00:00:00.000Z") : null,
        images: {
          create: [
            {
              src: seedProduct.imageSrc,
              alt: seedProduct.name,
              sortOrder: 0,
            },
          ],
        },
        variants: {
          create: seedProduct.variants,
        },
      },
      include: {
        variants: true,
      },
    });

    productMap.set(created.slug, created);
  }

  const favorites = ["air-force-1-07", "air-max-95-big-bubble", "pegasus-premium"];

  for (const slug of favorites) {
    const product = productMap.get(slug);
    if (!product) {
      continue;
    }

    await prisma.favorite.create({
      data: {
        userId: member.id,
        productId: product.id,
      },
    });
  }

  const activeCart = await prisma.cart.create({
    data: {
      userId: member.id,
      status: "ACTIVE",
      currency: "TWD",
      shippingFee: d("0"),
      serviceFee: d("0"),
      promoCode: "WELCOME10",
      promoDiscount: d("500"),
    },
  });

  const cartTargets = ["air-max-95-big-bubble", "air-max-95-og"];

  for (const slug of cartTargets) {
    const product = productMap.get(slug);
    const variant = product?.variants[0];
    if (!product || !variant) {
      continue;
    }

    await prisma.cartItem.create({
      data: {
        cartId: activeCart.id,
        productId: product.id,
        variantId: variant.id,
        qty: slug === "air-max-95-og" ? 2 : 1,
        unitPrice: variant.unitPrice,
        compareAtPrice: variant.compareAtPrice,
      },
    });
  }

  const checkoutProduct = productMap.get("air-max-95-big-bubble");
  const checkoutVariant = checkoutProduct?.variants[0];
  const orderSubtotal = d("8100");
  const orderOriginal = d("8600");
  const orderPromo = d("500");
  const orderTotal = d("7600");

  if (checkoutProduct && checkoutVariant) {
    const order = await prisma.order.create({
      data: {
        userId: member.id,
        status: "PAID",
        paymentMethod: "CARD",
        paymentStatus: "CAPTURED",
        email: member.email,
        firstName: "小美",
        lastName: "王",
        phone: "0912000111",
        shippingAddressId: homeAddress.id,
        billingAddressId: homeAddress.id,
        shippingAddressText: "台灣 桃園市 桃園區 中寧街50巷10號 330",
        billingAddressText: "台灣 桃園市 桃園區 中寧街50巷10號 330",
        subtotal: orderSubtotal,
        originalSubtotal: orderOriginal,
        promoDiscount: orderPromo,
        shippingFee: d("0"),
        total: orderTotal,
        savings: d("1000"),
        currency: "TWD",
        deliveryWindowLabel: "在 3月4日 週三至 3月9日 週一之間送達",
        placedAt: new Date("2026-02-27T10:20:00.000Z"),
        items: {
          create: [
            {
              productId: checkoutProduct.id,
              variantId: checkoutVariant.id,
              nameSnapshot: checkoutProduct.name,
              subtitleSnapshot: checkoutProduct.subtitle,
              imageSrcSnapshot: checkoutProduct.images?.[0]?.src ?? null,
              colorLabelSnapshot: checkoutVariant.colorLabel,
              sizeLabelSnapshot: checkoutVariant.sizeLabel,
              qty: 1,
              unitPrice: checkoutVariant.unitPrice,
              compareAtPrice: checkoutVariant.compareAtPrice,
              lineTotal: checkoutVariant.unitPrice,
            },
          ],
        },
        paymentAttempts: {
          create: [
            {
              provider: "CARD",
              status: "CAPTURED",
              amount: orderTotal,
              currency: "TWD",
              providerRef: "seed-payment-ref-001",
            },
          ],
        },
      },
    });

    await prisma.verificationToken.create({
      data: {
        userId: member.id,
        email: member.email,
        purpose: "LOGIN",
        codeHash: "seed-code-hash",
        expiresAt: new Date("2026-03-01T00:00:00.000Z"),
        consumedAt: order.placedAt,
      },
    });
  }

  console.log("Seed completed:");
  console.log(`- users: 2 (admin=${admin.email}, member=${member.email})`);
  console.log(`- products: ${productSeeds.length}`);
  console.log("- favorites/cart/order demo data ready");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
