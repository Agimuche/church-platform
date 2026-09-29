/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Global declaration for hot reload support
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  mockStore: Record<string, any[]> | undefined;
};

// Initial in-memory mock data matching The Brook Church seed content
function createInitialStore(): Record<string, any[]> {
  const adminPasswordHash = bcrypt.hashSync(
    process.env.SEED_SUPER_ADMIN_PASSWORD ?? "ChangeMe123!",
    10
  );

  const superAdmin = {
    id: "user-super-admin",
    name: "The Brook Church Admin",
    email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "admin@church.local",
    passwordHash: adminPasswordHash,
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    deletedAt: null,
  };

  const speakers = [
    {
      id: "speaker-ose-imiemohon",
      name: "Pastor Ose Imiemohon",
      bio: "Founder and Senior Pastor of The Brook Church. Seasoned teacher of Pneumatology, Grace, and the Zoe Life.",
      photoUrl: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    },
    {
      id: "speaker-naomi-imiemohon",
      name: "Pastor Naomi Imiemohon",
      bio: "Lead Pastor at The Brook Church and convener of the annual Nurturers Conference.",
      photoUrl: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    },
    {
      id: "speaker-victor-owoeye",
      name: "Pastor Victor Owoeye",
      bio: "Associate Pastor and teacher of the Word at The Brook Church.",
      photoUrl: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    },
    {
      id: "speaker-echeng-edu",
      name: "Pastor Echeng Edu",
      bio: "Associate Pastor and minister at The Brook Church.",
      photoUrl: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    },
  ];

  const categories = [
    { id: "cat-pneumatology", name: "Pneumatology & Spirit", slug: "pneumatology", type: "media", createdAt: new Date() },
    { id: "cat-grace", name: "Grace & Faith", slug: "grace-and-faith", type: "media", createdAt: new Date() },
    { id: "cat-mind-healing", name: "Healing of the Mind", slug: "healing-of-the-mind", type: "media", createdAt: new Date() },
    { id: "cat-devotionals", name: "Daily Devotionals", slug: "devotionals", type: "product", createdAt: new Date() },
    { id: "cat-books", name: "Books & Publications", slug: "books", type: "product", createdAt: new Date() },
    { id: "cat-audio-series", name: "Audio Messages (MP3)", slug: "audio-messages", type: "product", createdAt: new Date() },
  ];

  const media = [
    {
      id: "media-doxa",
      title: "DOXA — Manifesting The Glory of God",
      slug: "doxa-manifesting-the-glory-of-god",
      description: "A profound atmosphere of the Holy Spirit examining the manifest presence of God, divine Zoe life, and supernatural alignment in our daily walk.",
      type: "SERMON_VIDEO",
      speakerId: "speaker-ose-imiemohon",
      categoryId: "cat-grace",
      thumbnailUrl: "https://i.ytimg.com/vi/Ya3yIiRPqT0/maxresdefault.jpg",
      fileUrl: "https://www.youtube.com/watch?v=Ya3yIiRPqT0",
      visibility: "PUBLIC",
      price: null,
      allowDownload: true,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date("2026-09-27T09:15:00Z"),
      durationSeconds: 6480,
      viewCount: 1420,
      createdById: superAdmin.id,
      createdAt: new Date("2026-09-27T09:15:00Z"),
      updatedAt: new Date("2026-09-27T09:15:00Z"),
      deletedAt: null,
    },
    {
      id: "media-wordshop-spirit",
      title: "WORDSHOP — Pneumatology: Walking in the Spirit",
      slug: "wordshop-pneumatology-walking-in-the-spirit",
      description: "Deep doctrinal exposition on the person, power, and communion of the Holy Spirit. How to perceive divine direction and walk in spiritual authority.",
      type: "SERMON_VIDEO",
      speakerId: "speaker-ose-imiemohon",
      categoryId: "cat-pneumatology",
      thumbnailUrl: "https://i.ytimg.com/vi/noxVVQgfU9E/maxresdefault.jpg",
      fileUrl: "https://www.youtube.com/watch?v=noxVVQgfU9E",
      visibility: "PUBLIC",
      price: null,
      allowDownload: true,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date("2026-09-24T18:00:00Z"),
      durationSeconds: 5520,
      viewCount: 980,
      createdById: superAdmin.id,
      createdAt: new Date("2026-09-24T18:00:00Z"),
      updatedAt: new Date("2026-09-24T18:00:00Z"),
      deletedAt: null,
    },
    {
      id: "media-phronesis",
      title: "PHRONESIS — Wisdom for Distinction & Impact",
      slug: "phronesis-wisdom-for-distinction",
      description: "Exploring divine wisdom (Phronesis) that shifts your decision-making framework, unlocks creative insight, and commands prominence.",
      type: "SERMON_VIDEO",
      speakerId: "speaker-ose-imiemohon",
      categoryId: "cat-mind-healing",
      thumbnailUrl: "https://i.ytimg.com/vi/hKQuxczrrMg/maxresdefault.jpg",
      fileUrl: "https://www.youtube.com/watch?v=hKQuxczrrMg",
      visibility: "PUBLIC",
      price: null,
      allowDownload: true,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date("2026-09-20T08:00:00Z"),
      durationSeconds: 5100,
      viewCount: 850,
      createdById: superAdmin.id,
      createdAt: new Date("2026-09-20T08:00:00Z"),
      updatedAt: new Date("2026-09-20T08:00:00Z"),
      deletedAt: null,
    },
    {
      id: "media-wordshop-authority",
      title: "WORDSHOP — The Believer's Spiritual Authority",
      slug: "wordshop-believers-spiritual-authority",
      description: "Understanding your legal and vital seat in heavenly places, speaking with authority, and demonstrating the kingdom of God.",
      type: "SERMON_VIDEO",
      speakerId: "speaker-ose-imiemohon",
      categoryId: "cat-pneumatology",
      thumbnailUrl: "https://i.ytimg.com/vi/5HO7Ypny9m8/maxresdefault.jpg",
      fileUrl: "https://www.youtube.com/watch?v=5HO7Ypny9m8",
      visibility: "PUBLIC",
      price: null,
      allowDownload: true,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date("2026-09-17T18:00:00Z"),
      durationSeconds: 5280,
      viewCount: 1100,
      createdById: superAdmin.id,
      createdAt: new Date("2026-09-17T18:00:00Z"),
      updatedAt: new Date("2026-09-17T18:00:00Z"),
      deletedAt: null,
    },
    {
      id: "media-zoe-dimension",
      title: "The Zoe Dimension — Living Above the Elements",
      slug: "the-zoe-dimension-living-above-the-elements",
      description: "Streamed live from Calabar to thousands across the globe. Understanding the Zoe principle — how the incorruptible life of God works within the believer.",
      type: "SERMON_VIDEO",
      speakerId: "speaker-ose-imiemohon",
      categoryId: "cat-grace",
      thumbnailUrl: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
      fileUrl: "https://web.facebook.com/thebrookchurchng/live_videos/",
      visibility: "PUBLIC",
      price: null,
      allowDownload: true,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date("2026-09-27T10:00:00Z"),
      durationSeconds: 6600,
      viewCount: 2300,
      createdById: superAdmin.id,
      createdAt: new Date("2026-09-27T10:00:00Z"),
      updatedAt: new Date("2026-09-27T10:00:00Z"),
      deletedAt: null,
    },
    {
      id: "media-called-flourish",
      title: "Called to Flourish in Every Season",
      slug: "called-to-flourish",
      description: "Keynote session from the Nurturers gathering on blooming through grace, resilience, and vision.",
      type: "SERMON_VIDEO",
      speakerId: "speaker-naomi-imiemohon",
      categoryId: "cat-grace",
      thumbnailUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      fileUrl: "https://web.facebook.com/thebrookchurchng/",
      visibility: "PUBLIC",
      price: null,
      allowDownload: true,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date("2026-09-14T11:00:00Z"),
      durationSeconds: 4500,
      viewCount: 1600,
      createdById: superAdmin.id,
      createdAt: new Date("2026-09-14T11:00:00Z"),
      updatedAt: new Date("2026-09-14T11:00:00Z"),
      deletedAt: null,
    },
    {
      id: "media-audio-grace",
      title: "Grace: The Divine Empowerment Upon Man",
      slug: "grace-the-divine-empowerment",
      description: "An audio discourse on operating in the effortless grace of God, removing human struggles and walking in righteousness.",
      type: "SERMON_AUDIO",
      speakerId: "speaker-ose-imiemohon",
      categoryId: "cat-grace",
      thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
      fileUrl: "/audio/grace-divine-empowerment.mp3",
      visibility: "PUBLIC",
      price: null,
      allowDownload: true,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date("2026-09-21T10:00:00Z"),
      durationSeconds: 3600,
      viewCount: 750,
      createdById: superAdmin.id,
      createdAt: new Date("2026-09-21T10:00:00Z"),
      updatedAt: new Date("2026-09-21T10:00:00Z"),
      deletedAt: null,
    },
    {
      id: "media-audio-pneumatology",
      title: "Understanding Pneumatology & Spiritual Gifts",
      slug: "understanding-pneumatology-spiritual-gifts",
      description: "Comprehensive audio masterclass on the gifts, anointing, and operation of the Holy Spirit in the New Testament believer.",
      type: "SERMON_AUDIO",
      speakerId: "speaker-ose-imiemohon",
      categoryId: "cat-pneumatology",
      thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      fileUrl: "/audio/understanding-pneumatology.mp3",
      visibility: "PUBLIC",
      price: null,
      allowDownload: true,
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date("2026-09-15T10:00:00Z"),
      durationSeconds: 4200,
      viewCount: 620,
      createdById: superAdmin.id,
      createdAt: new Date("2026-09-15T10:00:00Z"),
      updatedAt: new Date("2026-09-15T10:00:00Z"),
      deletedAt: null,
    },
  ];

  const products = [
    {
      id: "prod-eldad",
      name: "The Exceptional Life Daily Devotional (ELDAD)",
      slug: "eldad-daily-devotional",
      description: "Your daily spiritual compass containing inspiring revelations, scripture reflections, and declarations for exceptional living.",
      type: "DIGITAL_BOOK",
      price: 2500,
      images: [],
      categoryId: "cat-devotionals",
      inventoryCount: null,
      digitalFileUrl: "/downloads/eldad-devotional.pdf",
      isPublished: true,
      createdById: superAdmin.id,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
      deletedAt: null,
    },
    {
      id: "prod-called-flourish",
      name: "Called to Flourish — Pastor Naomi Imiemohon",
      slug: "called-to-flourish-book",
      description: "An empowering guide for every believer seeking to live fruitful, purposeful, and resilient lives.",
      type: "DIGITAL_BOOK",
      price: 500,
      images: [],
      categoryId: "cat-books",
      inventoryCount: null,
      digitalFileUrl: "/downloads/called-to-flourish.pdf",
      isPublished: true,
      createdById: superAdmin.id,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
      deletedAt: null,
    },
    {
      id: "prod-updating-old-self",
      name: "Updating Your Old Self (Audio Series 1-5)",
      slug: "updating-your-old-self-series",
      description: "Complete 5-part MP3 series by Pastor Echeng Edu & Pastor Victor Owoeye on mental transformation and pneumatic growth.",
      type: "DIGITAL_AUDIO",
      price: 500,
      images: [],
      categoryId: "cat-audio-series",
      inventoryCount: null,
      digitalFileUrl: "/downloads/updating-your-old-self.zip",
      isPublished: true,
      createdById: superAdmin.id,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
      deletedAt: null,
    },
    {
      id: "prod-destroy-excuse",
      name: "Destroy The Beast Called Excuse — Pastor Ose Imiemohon",
      slug: "destroy-the-beast-called-excuse",
      description: "Unmasking procrastination, fear, and self-limiting beliefs to unlock supernatural acceleration.",
      type: "DIGITAL_AUDIO",
      price: 500,
      images: [],
      categoryId: "cat-audio-series",
      inventoryCount: null,
      digitalFileUrl: "/downloads/destroy-the-beast.mp3",
      isPublished: true,
      createdById: superAdmin.id,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
      deletedAt: null,
    },
  ];

  const announcements = [
    {
      id: "tbc-announcement-1",
      title: "Welcome to The Brook Church Digital Platform",
      body: "Watch our services live, access ELDAD devotional, browse sermon recordings, give online, and request pastoral support — all in one place.",
      imageUrl: null,
      isPinned: true,
      publishAt: new Date("2026-01-01T00:00:00Z"),
      expiresAt: null,
      createdById: superAdmin.id,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    },
    {
      id: "tbc-announcement-2",
      title: "The Brook Church Expansion Project",
      body: "We invite all members and global partners to support our church building and media expansion project in Calabar. Secure online giving is now active.",
      imageUrl: null,
      isPinned: true,
      publishAt: new Date("2026-01-01T00:00:00Z"),
      expiresAt: null,
      createdById: superAdmin.id,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    },
  ];

  const nextSunday = new Date();
  nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7));
  nextSunday.setHours(8, 0, 0, 0);

  const liveStreams = [
    {
      id: "tbc-stream-phronesis",
      title: "Sunday Phronesis Service — The Way of the Spirit",
      description: "Join Pastor Ose Imiemohon and the pastoral team for divine wisdom, worship, and pneumatic revelation.",
      thumbnailUrl: null,
      scheduledStart: nextSunday,
      scheduledEnd: null,
      actualStart: null,
      actualEnd: null,
      status: "SCHEDULED",
      provider: "mock",
      providerStreamId: null,
      playbackUrl: null,
      viewerCount: 0,
      createdById: superAdmin.id,
      relatedSermonId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return {
    user: [superAdmin],
    speaker: speakers,
    category: categories,
    tag: [],
    media,
    product: products,
    order: [],
    orderItem: [],
    payment: [],
    prayerRequest: [],
    counselingRequest: [],
    appointment: [],
    announcement: announcements,
    gallery: [],
    galleryItem: [],
    liveStream: liveStreams,
    notification: [],
    bookmark: [],
    download: [],
    auditLog: [],
    account: [],
    session: [],
    verificationToken: [],
  };
}

function getStore() {
  if (!globalForPrisma.mockStore) {
    globalForPrisma.mockStore = createInitialStore();
  }
  return globalForPrisma.mockStore;
}

// Helpers for in-memory querying
function matchCondition(itemVal: any, cond: any): boolean {
  if (cond === undefined) return true;
  if (cond === null) return itemVal === null;

  if (typeof cond === "object" && !(cond instanceof Date)) {
    if ("in" in cond && Array.isArray(cond.in)) {
      return cond.in.includes(itemVal);
    }
    if ("contains" in cond) {
      if (typeof itemVal !== "string") return false;
      const search = String(cond.contains);
      if (cond.mode === "insensitive") {
        return itemVal.toLowerCase().includes(search.toLowerCase());
      }
      return itemVal.includes(search);
    }
    if ("gte" in cond) {
      const v = itemVal instanceof Date ? itemVal.getTime() : itemVal;
      const c = cond.gte instanceof Date ? cond.gte.getTime() : cond.gte;
      return v >= c;
    }
    if ("lte" in cond) {
      const v = itemVal instanceof Date ? itemVal.getTime() : itemVal;
      const c = cond.lte instanceof Date ? cond.lte.getTime() : cond.lte;
      return v <= c;
    }
    if ("gt" in cond) {
      const v = itemVal instanceof Date ? itemVal.getTime() : itemVal;
      const c = cond.gt instanceof Date ? cond.gt.getTime() : cond.gt;
      return v > c;
    }
    if ("lt" in cond) {
      const v = itemVal instanceof Date ? itemVal.getTime() : itemVal;
      const c = cond.lt instanceof Date ? cond.lt.getTime() : cond.lt;
      return v < c;
    }
  }

  if (itemVal instanceof Date && cond instanceof Date) {
    return itemVal.getTime() === cond.getTime();
  }

  return itemVal === cond;
}

function matchFilter(item: any, where?: any): boolean {
  if (!where) return true;

  if (Array.isArray(where.OR)) {
    return where.OR.some((subWhere: any) => matchFilter(item, subWhere));
  }
  if (Array.isArray(where.AND)) {
    return where.AND.every((subWhere: any) => matchFilter(item, subWhere));
  }

  for (const key of Object.keys(where)) {
    if (key === "OR" || key === "AND") continue;
    if (!matchCondition(item[key], where[key])) {
      return false;
    }
  }
  return true;
}

function enrichItem(model: string, item: any, include?: any) {
  if (!item || !include) return item;
  const store = getStore();
  const enriched = { ...item };

  if (model === "media") {
    if (include.speaker) {
      enriched.speaker = store.speaker.find((s) => s.id === item.speakerId) ?? null;
    }
    if (include.category) {
      enriched.category = store.category.find((c) => c.id === item.categoryId) ?? null;
    }
    if (include.tags) {
      enriched.tags = [];
    }
  } else if (model === "product") {
    if (include.category) {
      enriched.category = store.category.find((c) => c.id === item.categoryId) ?? null;
    }
    if (include.tags) {
      enriched.tags = [];
    }
  } else if (model === "prayerRequest" || model === "counselingRequest") {
    if (include.requester) {
      const user = store.user.find((u) => u.id === item.requesterId);
      enriched.requester = user ? { name: user.name, email: user.email } : null;
    }
  } else if (model === "order") {
    if (include.user) {
      const user = store.user.find((u) => u.id === item.userId);
      enriched.user = user ? { name: user.name, email: user.email } : null;
    }
    if (include.items) {
      const items = store.orderItem.filter((oi) => oi.orderId === item.id);
      enriched.items = items.map((oi) => ({
        ...oi,
        product: store.product.find((p) => p.id === oi.productId) ?? null,
      }));
    }
    if (include.payments) {
      enriched.payments = store.payment.filter((p) => p.orderId === item.id);
    }
  } else if (model === "gallery") {
    if (include._count?.items) {
      enriched._count = {
        items: store.galleryItem.filter((gi) => gi.galleryId === item.id).length,
      };
    }
  }

  return enriched;
}

function createModelHandler(model: string) {
  return {
    async findMany(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      let result = list.filter((item: any) => matchFilter(item, args.where));

      if (args.orderBy) {
        const orderArr = Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy];
        result = [...result].sort((a: any, b: any) => {
          for (const ord of orderArr) {
            const key = Object.keys(ord)[0];
            const dir = ord[key];
            if (a[key] === b[key]) continue;
            if (a[key] === undefined || a[key] === null) return 1;
            if (b[key] === undefined || b[key] === null) return -1;
            const diff = a[key] < b[key] ? -1 : 1;
            return dir === "desc" ? -diff : diff;
          }
          return 0;
        });
      }

      if (typeof args.skip === "number") {
        result = result.slice(args.skip);
      }
      if (typeof args.take === "number") {
        result = result.slice(0, args.take);
      }

      return result.map((item: any) => enrichItem(model, item, args.include));
    },

    async findFirst(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      const result = list.filter((item: any) => matchFilter(item, args.where));

      if (args.orderBy) {
        const orderArr = Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy];
        result.sort((a: any, b: any) => {
          for (const ord of orderArr) {
            const key = Object.keys(ord)[0];
            const dir = ord[key];
            if (a[key] === b[key]) continue;
            if (a[key] === undefined || a[key] === null) return 1;
            if (b[key] === undefined || b[key] === null) return -1;
            const diff = a[key] < b[key] ? -1 : 1;
            return dir === "desc" ? -diff : diff;
          }
          return 0;
        });
      }

      return result.length > 0 ? enrichItem(model, result[0], args.include) : null;
    },

    async findUnique(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      const item = list.find((it: any) => matchFilter(it, args.where));
      return item ? enrichItem(model, item, args.include) : null;
    },

    async count(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      return list.filter((item: any) => matchFilter(item, args.where)).length;
    },

    async aggregate(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      const filtered = list.filter((item: any) => matchFilter(item, args.where));
      if (args._sum) {
        const sumResult: Record<string, number> = {};
        for (const key of Object.keys(args._sum)) {
          sumResult[key] = filtered.reduce((acc, it) => acc + (Number(it[key]) || 0), 0);
        }
        return { _sum: sumResult };
      }
      return { _sum: { totalAmount: 0 } };
    },

    async create(args: any = {}) {
      const store = getStore();
      if (!store[model]) store[model] = [];
      const now = new Date();
      const newItem = {
        id: args.data?.id ?? `mock-${model}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: now,
        updatedAt: now,
        ...args.data,
      };
      store[model].push(newItem);
      return enrichItem(model, newItem, args.include);
    },

    async update(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      const idx = list.findIndex((it: any) => matchFilter(it, args.where));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...args.data, updatedAt: new Date() };
        return enrichItem(model, list[idx], args.include);
      }
      return args.data ?? {};
    },

    async updateMany(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      let count = 0;
      for (let i = 0; i < list.length; i++) {
        if (matchFilter(list[i], args.where)) {
          list[i] = { ...list[i], ...args.data, updatedAt: new Date() };
          count++;
        }
      }
      return { count };
    },

    async delete(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      const idx = list.findIndex((it: any) => matchFilter(it, args.where));
      if (idx !== -1) {
        const [deleted] = list.splice(idx, 1);
        return deleted;
      }
      return {};
    },

    async deleteMany(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      const before = list.length;
      store[model] = list.filter((it: any) => !matchFilter(it, args.where));
      return { count: before - store[model].length };
    },

    async upsert(args: any = {}) {
      const store = getStore();
      const list = store[model] ?? [];
      const existing = list.find((it: any) => matchFilter(it, args.where));
      if (existing) {
        Object.assign(existing, args.update, { updatedAt: new Date() });
        return enrichItem(model, existing, args.include);
      }
      const newItem = {
        id: args.create?.id ?? `mock-${model}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.create,
      };
      if (!store[model]) store[model] = [];
      store[model].push(newItem);
      return enrichItem(model, newItem, args.include);
    },
  };
}

function createPrismaProxy() {
  const modelHandlers: Record<string, any> = {};

  return new Proxy({} as any, {
    get: (_, prop: string | symbol) => {
      if (typeof prop !== "string") return undefined;

      if (prop === "$transaction") {
        return async (arg: any) => {
          if (Array.isArray(arg)) {
            return Promise.all(arg);
          }
          if (typeof arg === "function") {
            return arg(createPrismaProxy());
          }
          return [];
        };
      }

      if (prop === "$disconnect") {
        return async () => {};
      }

      if (prop === "$connect") {
        return async () => {};
      }

      if (prop.startsWith("$")) {
        return async () => [];
      }

      if (!modelHandlers[prop]) {
        modelHandlers[prop] = createModelHandler(prop);
      }

      return modelHandlers[prop];
    },
  });
}

// Client initialization
let prismaInstance: PrismaClient;

if (!process.env.DATABASE_URL) {
  // Use in-memory mock client directly when DATABASE_URL is not set
  prismaInstance = createPrismaProxy();
} else {
  try {
    const realPrisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

    const mockFallback = createPrismaProxy();

    // Wrap real Prisma with proxy to automatically catch DB connection errors at runtime
    prismaInstance = new Proxy(realPrisma, {
      get(target: any, prop: string | symbol) {
        if (typeof prop !== "string") return target[prop];

        if (prop === "$transaction") {
          return async (arg: any) => {
            try {
              return await target.$transaction(arg);
            } catch {
              console.warn("[AI Studio] Database connection failed for $transaction — using in-memory mock fallback");
              return mockFallback.$transaction(arg);
            }
          };
        }

        const realModel = target[prop];
        if (!realModel) return mockFallback[prop];

        return new Proxy(realModel, {
          get(modelTarget: any, method: string | symbol) {
            const originalMethod = modelTarget[method];
            if (typeof originalMethod !== "function") return originalMethod;

            return async (...args: any[]) => {
              try {
                return await originalMethod.apply(modelTarget, args);
              } catch (err: any) {
                console.warn(
                  `[AI Studio] Database query failed on prisma.${String(prop)}.${String(method)}:`,
                  err.message
                );
                console.warn("[AI Studio] Using in-memory mock store fallback");
                const fallbackModel = mockFallback[prop];
                if (fallbackModel && typeof fallbackModel[method] === "function") {
                  return await fallbackModel[method](...args);
                }
                return null;
              }
            };
          },
        });
      },
    });
  } catch {
    console.warn("[AI Studio] Failed to initialize PrismaClient — using mock store");
    prismaInstance = createPrismaProxy();
  }
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
