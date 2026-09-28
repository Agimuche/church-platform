import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL ?? "admin@church.local";
  const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "ChangeMe123!";

  // 1. Super Admin User
  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      name: "The Brook Church Admin",
      email: superAdminEmail,
      passwordHash: await bcrypt.hash(superAdminPassword, 12),
      role: "SUPER_ADMIN",
    },
  });

  // 2. Speakers (The Brook Church Pastoral Leadership)
  const pastorOse = await prisma.speaker.upsert({
    where: { id: "speaker-ose-imiemohon" },
    update: {
      name: "Pastor Ose Imiemohon",
      bio: "Founder and Senior Pastor of The Brook Church. Seasoned teacher of Pneumatology, Grace, and the Zoe Life.",
    },
    create: {
      id: "speaker-ose-imiemohon",
      name: "Pastor Ose Imiemohon",
      bio: "Founder and Senior Pastor of The Brook Church. Seasoned teacher of Pneumatology, Grace, and the Zoe Life.",
    },
  });

  const pastorNaomi = await prisma.speaker.upsert({
    where: { id: "speaker-naomi-imiemohon" },
    update: {
      name: "Pastor Naomi Imiemohon",
      bio: "Lead Pastor at The Brook Church and convener of the annual Nurturers Conference.",
    },
    create: {
      id: "speaker-naomi-imiemohon",
      name: "Pastor Naomi Imiemohon",
      bio: "Lead Pastor at The Brook Church and convener of the annual Nurturers Conference.",
    },
  });

  const pastorVictor = await prisma.speaker.upsert({
    where: { id: "speaker-victor-owoeye" },
    update: {
      name: "Pastor Victor Owoeye",
      bio: "Associate Pastor and teacher of the Word at The Brook Church.",
    },
    create: {
      id: "speaker-victor-owoeye",
      name: "Pastor Victor Owoeye",
      bio: "Associate Pastor and teacher of the Word at The Brook Church.",
    },
  });

  const pastorEcheng = await prisma.speaker.upsert({
    where: { id: "speaker-echeng-edu" },
    update: {
      name: "Pastor Echeng Edu",
      bio: "Associate Pastor and minister at The Brook Church.",
    },
    create: {
      id: "speaker-echeng-edu",
      name: "Pastor Echeng Edu",
      bio: "Associate Pastor and minister at The Brook Church.",
    },
  });

  // 3. Media Categories
  const catPneumatology = await prisma.category.upsert({
    where: { slug: "pneumatology" },
    update: { name: "Pneumatology & Spirit" },
    create: { name: "Pneumatology & Spirit", slug: "pneumatology", type: "media" },
  });

  const catGrace = await prisma.category.upsert({
    where: { slug: "grace-and-faith" },
    update: { name: "Grace & Faith" },
    create: { name: "Grace & Faith", slug: "grace-and-faith", type: "media" },
  });

  const catMindHealing = await prisma.category.upsert({
    where: { slug: "healing-of-the-mind" },
    update: { name: "Healing of the Mind" },
    create: { name: "Healing of the Mind", slug: "healing-of-the-mind", type: "media" },
  });

  // 4. Product Categories
  const catDevotionals = await prisma.category.upsert({
    where: { slug: "devotionals" },
    update: { name: "Daily Devotionals" },
    create: { name: "Daily Devotionals", slug: "devotionals", type: "product" },
  });

  const catBooks = await prisma.category.upsert({
    where: { slug: "books" },
    update: { name: "Books & Publications" },
    create: { name: "Books & Publications", slug: "books", type: "product" },
  });

  const catAudioSeries = await prisma.category.upsert({
    where: { slug: "audio-messages" },
    update: { name: "Audio Messages (MP3)" },
    create: { name: "Audio Messages (MP3)", slug: "audio-messages", type: "product" },
  });

  // 5. Media & Sermons
  await prisma.media.upsert({
    where: { slug: "updating-your-old-self" },
    update: {},
    create: {
      title: "Updating Your Old Self: Renewing the Mind",
      slug: "updating-your-old-self",
      description:
        "A transformative message on casting off the old mindset and aligning with your elevated identity in Christ.",
      type: "SERMON_VIDEO",
      speakerId: pastorEcheng.id,
      categoryId: catMindHealing.id,
      visibility: "PUBLIC",
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      durationSeconds: 3420,
      allowDownload: true,
      createdById: superAdmin.id,
    },
  });

  await prisma.media.upsert({
    where: { slug: "holy-spirit-inspired-strategies" },
    update: {},
    create: {
      title: "Holy Spirit Inspired Strategies",
      slug: "holy-spirit-inspired-strategies",
      description:
        "Teaching on receiving divine guidance, precision, and pneumatic wisdom for life and business.",
      type: "SERMON_VIDEO",
      speakerId: pastorOse.id,
      categoryId: catPneumatology.id,
      visibility: "PUBLIC",
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      durationSeconds: 4180,
      allowDownload: true,
      createdById: superAdmin.id,
    },
  });

  await prisma.media.upsert({
    where: { slug: "faith-in-the-ultimate-currency" },
    update: {},
    create: {
      title: "Faith in the Ultimate Currency",
      slug: "faith-in-the-ultimate-currency",
      description:
        "Understanding how the kingdom currency of faith operates to produce tangible supernatural results.",
      type: "SERMON_AUDIO",
      speakerId: pastorOse.id,
      categoryId: catGrace.id,
      visibility: "PUBLIC",
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      durationSeconds: 2850,
      allowDownload: true,
      createdById: superAdmin.id,
    },
  });

  await prisma.media.upsert({
    where: { slug: "called-to-flourish" },
    update: {},
    create: {
      title: "Called to Flourish in Every Season",
      slug: "called-to-flourish",
      description:
        "Keynote session from the Nurturers gathering on blooming through grace, resilience, and vision.",
      type: "SERMON_VIDEO",
      speakerId: pastorNaomi.id,
      categoryId: catGrace.id,
      visibility: "PUBLIC",
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
      durationSeconds: 3100,
      allowDownload: true,
      createdById: superAdmin.id,
    },
  });

  // 6. Products (TBC Store)
  await prisma.product.upsert({
    where: { slug: "eldad-daily-devotional" },
    update: {},
    create: {
      name: "The Exceptional Life Daily Devotional (ELDAD)",
      slug: "eldad-daily-devotional",
      description:
        "Your daily spiritual compass containing inspiring revelations, scripture reflections, and declarations for exceptional living.",
      type: "DIGITAL_BOOK",
      price: 2500,
      images: [],
      categoryId: catDevotionals.id,
      isPublished: true,
      createdById: superAdmin.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "called-to-flourish-book" },
    update: {},
    create: {
      name: "Called to Flourish — Pastor Naomi Imiemohon",
      slug: "called-to-flourish-book",
      description:
        "An empowering guide for every believer seeking to live fruitful, purposeful, and resilient lives.",
      type: "DIGITAL_BOOK",
      price: 500,
      images: [],
      categoryId: catBooks.id,
      isPublished: true,
      createdById: superAdmin.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "updating-your-old-self-series" },
    update: {},
    create: {
      name: "Updating Your Old Self (Audio Series 1-5)",
      slug: "updating-your-old-self-series",
      description:
        "Complete 5-part MP3 series by Pastor Echeng Edu & Pastor Victor Owoeye on mental transformation and pneumatic growth.",
      type: "DIGITAL_AUDIO",
      price: 500,
      images: [],
      categoryId: catAudioSeries.id,
      isPublished: true,
      createdById: superAdmin.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "destroy-the-beast-called-excuse" },
    update: {},
    create: {
      name: "Destroy The Beast Called Excuse — Pastor Ose Imiemohon",
      slug: "destroy-the-beast-called-excuse",
      description:
        "Unmasking procrastination, fear, and self-limiting beliefs to unlock supernatural acceleration.",
      type: "DIGITAL_AUDIO",
      price: 500,
      images: [],
      categoryId: catAudioSeries.id,
      isPublished: true,
      createdById: superAdmin.id,
    },
  });

  // 7. Announcements
  await prisma.announcement.upsert({
    where: { id: "tbc-announcement-1" },
    update: {},
    create: {
      id: "tbc-announcement-1",
      title: "Welcome to The Brook Church Digital Platform",
      body: "Watch our services live, access ELDAD devotional, browse sermon recordings, give online, and request pastoral support — all in one place.",
      isPinned: true,
      publishAt: new Date(),
      createdById: superAdmin.id,
    },
  });

  await prisma.announcement.upsert({
    where: { id: "tbc-announcement-2" },
    update: {},
    create: {
      id: "tbc-announcement-2",
      title: "The Brook Church Expansion Project",
      body: "We invite all members and global partners to support our church building and media expansion project in Calabar. Secure online giving is now active.",
      isPinned: true,
      publishAt: new Date(),
      createdById: superAdmin.id,
    },
  });

  // 8. Scheduled Live Stream (Next Sunday)
  const nextSunday = new Date();
  nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7));
  nextSunday.setHours(8, 0, 0, 0);

  await prisma.liveStream.upsert({
    where: { id: "tbc-stream-phronesis" },
    update: {
      scheduledStart: nextSunday,
    },
    create: {
      id: "tbc-stream-phronesis",
      title: "Sunday Phronesis Service — The Way of the Spirit",
      description:
        "Join Pastor Ose Imiemohon and the pastoral team for divine wisdom, worship, and pneumatic revelation.",
      scheduledStart: nextSunday,
      status: "SCHEDULED",
      createdById: superAdmin.id,
    },
  });

  console.log(`The Brook Church data seeded successfully. Admin: ${superAdminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
