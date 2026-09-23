#!/usr/bin/env node
/**
 * Seed the local dev database (PGlite at .grok/pglite.data) with realistic
 * Persian sample property listings so the /properties listing, search, filters
 * and the property detail pages can be demonstrated in the preview.
 *
 * Idempotent: deletes only rows tagged `source = 'seed-sample'` before
 * inserting, so re-running refreshes the sample set without touching real
 * listings. Never run against production: it requires the dev flag
 * HIRMAND_SEED_SAMPLE_DATA=1 and refuses when DATABASE_URL points at a
 * hosted Postgres.
 *
 * Usage: node scripts/seed-sample-properties.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(projectRoot, ".grok", "pglite.data");

process.env.PGLITE_DATA_DIR = dataDir;

if (process.env.HIRMAND_SEED_SAMPLE_DATA !== "1") {
  console.error(
    "[seed] Refusing to run without HIRMAND_SEED_SAMPLE_DATA=1 (sample data is a dev-only convenience).",
  );
  process.exit(1);
}

for (const key of ["DATABASE_URL", "POSTGRES_URL", "NEON_DATABASE_URL"]) {
  if (process.env[key]?.trim()) {
    console.error(
      `[seed] ${key} is set — this looks like a hosted database. Refusing to seed; sample data belongs only in the local PGlite store.`,
    );
    process.exit(1);
  }
}

const { PGlite } = await import("@electric-sql/pglite");
const pg = new PGlite({ dataDir: dataDir });
await pg.waitReady;

// Apply the same migration chain the dev server would, so this works on a
// fresh checkout where .grok/pglite.data does not exist yet.
const migrationsDir = join(projectRoot, "migrations");
pg.exec(
  "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
);
const applied = new Set(
  (await pg.query("select name from _migrations")).rows.map((r) => String(r.name)),
);
for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort()) {
  if (applied.has(file)) continue;
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  await pg.exec(sql);
  await pg.exec("insert into _migrations (name) values ($1)", [file]);
  console.log(`[seed] migration applied: ${file}`);
}

// ---------------------------------------------------------------------------
// Sample listings — realistic Isfahan neighborhoods, Persian copy, mixed
// transaction types / property types / feature combos so every filter and the
// sort options have real data to act on.
// ---------------------------------------------------------------------------
const MANAGER = { name: "مدیریت هیرمند", phone: "09131056029" };
const CONSULTANT = { name: "مشاور فروش هیرمند", phone: "09183576883" };

const rows = [
  {
    id: "seed-sample-apartment-01",
    slug: "apartment-sale-sepahan-shahr-sample",
    title: "آپارتمان نوساز ۱۱۰ متری سپاهان‌شهر",
    transaction_type: "buy",
    property_type: "apartment",
    neighborhood: "سپاهان‌شهر",
    address: "سپاهان‌شهر، فاز سه، خیابان عقیل",
    area_m2: 110, bedrooms: 2, bathrooms: 2, floor: 3, total_floors: 6, built_year: 1402,
    parking: true, elevator: true, storage: true,
    price: "9800000000",
    description:
      "آپارتمان نوساز با نمای سنگ تراورتن، آشپزخانه اپن و کابینت هایگلوس. موقعیت ممتاز، دسترسی عالی به مدرسه و فضای سبز. سند تک‌برگ، آماده انتقال.",
    features: ["نمای سنگ", "آشپزخانه اپن", "سند تک‌برگ", "بالکن"],
    images: ["/images/type-apartment.jpg"],
    latitude: 32.6099, longitude: 51.7104,
    contact: MANAGER,
    featured: true,
  },
  {
    id: "seed-sample-apartment-02",
    slug: "apartment-sale-mardavij-sample",
    title: "آپارتمان ۸۵ متری مرداویج با پارکینگ",
    transaction_type: "buy",
    property_type: "apartment",
    neighborhood: "مرداویج",
    address: "مرداویج، خیابان شفق",
    area_m2: 85, bedrooms: 2, bathrooms: 1, floor: 2, total_floors: 4, built_year: 1398,
    parking: true, elevator: false, storage: false,
    price: "7200000000",
    description:
      "آپارتمان بازسازی‌شده در خیابان آرام مرداویج. نورگیر عالی، کف سرامیک، پکیج و رادیاتور. نزدیک به مترو و مراکز خرید.",
    features: ["بازسازی‌شده", "نورگیر عالی", "نزدیک مترو"],
    images: ["/images/type-apartment.jpg"],
    latitude: 32.6334, longitude: 51.6665,
    contact: CONSULTANT,
    featured: false,
  },
  {
    id: "seed-sample-apartment-03",
    slug: "apartment-sale-jolfa-sample",
    title: "آپارتمان لوکس ۱۴۵ متری جلفا",
    transaction_type: "buy",
    property_type: "apartment",
    neighborhood: "جلفا",
    address: "جلفا، کوچه گلبن",
    area_m2: 145, bedrooms: 3, bathrooms: 2, floor: 1, total_floors: 5, built_year: 1401,
    parking: true, elevator: true, storage: true,
    price: "18500000000",
    description:
      "واحد لوکس در قلب جلفا با لابی مجلل، دوربین مداربسته و سرایداری ۲۴ ساعته. چشم‌انداز دائمی رودخانه زاینده‌رود.",
    features: ["لابی مجلل", "دوربین مداربسته", "سرایداری", "چشم‌انداز زاینده‌رود"],
    images: ["/images/type-apartment.jpg"],
    latitude: 32.6381, longitude: 51.6547,
    contact: MANAGER,
    featured: true,
  },
  {
    id: "seed-sample-villa-01",
    slug: "villa-sale-shahin-shahr-sample",
    title: "ویلای دوبلکس ۳۵۰ متری شاهین‌شهر",
    transaction_type: "buy",
    property_type: "villa",
    neighborhood: "شاهین‌شهر",
    address: "شاهین‌شهر، شهرک مهرگان",
    area_m2: 350, bedrooms: 4, bathrooms: 3, floor: null, total_floors: null, built_year: 1395,
    parking: true, elevator: false, storage: true,
    price: "24000000000",
    description:
      "ویلای دوبلکس با حیاط اختصاصی، استخر کوچک و آلاچیق. مناسب سکونت و سرمایه‌گذاری. دسترسی سریع به آزادراه.",
    features: ["حیاط اختصاصی", "استخر", "آلاچیق", "دسترسی آزادراه"],
    images: ["/images/type-villa.jpg"],
    latitude: 32.8596, longitude: 51.5532,
    contact: CONSULTANT,
    featured: false,
  },
  {
    id: "seed-sample-heritage-01",
    slug: "heritage-house-sale-jolfa-sample",
    title: "خانه اصیل تاریخی ۲۰۰ متری جلفا",
    transaction_type: "buy",
    property_type: "heritage",
    neighborhood: "جلفا",
    address: "جلفا، محله ارامنه",
    area_m2: 200, bedrooms: 3, bathrooms: 2, floor: null, total_floors: null, built_year: 1340,
    parking: false, elevator: false, storage: true,
    price: "15000000000",
    description:
      "خانه اصیل ایرانی با حیاط مرکزی، حوض سنگی و اتاق آینه‌کاری. ثبت ملی، مناسب اقامتگاه بوم‌گردی یا دفتر معماری.",
    features: ["ثبت ملی", "حیاط مرکزی", "آینه‌کاری", "مناسب بوم‌گردی"],
    images: ["/images/type-heritage.jpg"],
    latitude: 32.6404, longitude: 51.6601,
    contact: MANAGER,
    featured: false,
  },
  {
    id: "seed-sample-office-01",
    slug: "office-sale-ahmadabad-sample",
    title: "دفتر اداری ۹۰ متری احمدآباد",
    transaction_type: "buy",
    property_type: "office",
    neighborhood: "احمدآباد",
    address: "احمدآباد، خیابان چهارباغ بالا",
    area_m2: 90, bedrooms: 0, bathrooms: 1, floor: 4, total_floors: 8, built_year: 1400,
    parking: true, elevator: true, storage: false,
    price: "11200000000",
    description:
      "دفتر اداری مدرن با پارتیشن‌بندی شده، اینترنت فیبر و نگهبانی شبانه‌روزی برج. مناسب شرکت‌ها و دفاتر حقوقی.",
    features: ["پارتیشن‌بندی‌شده", "اینترنت فیبر", "نگهبانی"],
    images: ["/images/type-office.jpg"],
    latitude: 32.6495, longitude: 51.6728,
    contact: CONSULTANT,
    featured: false,
  },
  {
    id: "seed-sample-rent-01",
    slug: "apartment-rent-sepahan-shahr-sample",
    title: "اجاره آپارتمان مبله ۷۵ متری سپاهان‌شهر",
    transaction_type: "rent",
    property_type: "apartment",
    neighborhood: "سپاهان‌شهر",
    address: "سپاهان‌شهر، فاز یک، خیابان نیایش",
    area_m2: 75, bedrooms: 1, bathrooms: 1, floor: 2, total_floors: 5, built_year: 1399,
    parking: true, elevator: true, storage: false,
    deposit: "500000000", rent: "18000000",
    description:
      "آپارتمان مبله و تمیز با لوازم خانگی کامل، مناسب زوج‌های جوان. اجاره‌بها قابل مذاکره برای قرارداد یک‌ساله.",
    features: ["مبله", "لوازم کامل", "قابل مذاکره"],
    images: ["/images/type-apartment.jpg"],
    latitude: 32.6137, longitude: 51.7081,
    contact: MANAGER,
    featured: false,
  },
  {
    id: "seed-sample-rent-02",
    slug: "apartment-rent-mardavij-sample",
    title: "رهن و اجاره آپارتمان ۱۰۰ متری مرداویج",
    transaction_type: "rent",
    property_type: "apartment",
    neighborhood: "مرداویج",
    address: "مرداویج، خیابان پاورچین",
    area_m2: 100, bedrooms: 2, bathrooms: 2, floor: 1, total_floors: 3, built_year: 1396,
    parking: true, elevator: false, storage: true,
    deposit: "1200000000", rent: "8000000",
    description:
      "واحد سه‌پله با پارکینگ سندی و انباری. همسایه‌های آرام، مدیریت ساختمان فعال. تحویل فوری.",
    features: ["پارکینگ سندی", "انباری", "تحویل فوری"],
    images: ["/images/type-apartment.jpg"],
    latitude: 32.6352, longitude: 51.6641,
    contact: CONSULTANT,
    featured: false,
  },
  {
    id: "seed-sample-mortgage-01",
    slug: "apartment-mortgage-jolfa-sample",
    title: "رهن کامل آپارتمان ۶۵ متری جلفا",
    transaction_type: "mortgage",
    property_type: "apartment",
    neighborhood: "جلفا",
    address: "جلفا، خیابان تلفن خانه",
    area_m2: 65, bedrooms: 1, bathrooms: 1, floor: 0, total_floors: 2, built_year: 1392,
    parking: false, elevator: false, storage: false,
    deposit: "1500000000", rent: "0",
    description:
      "رهن کامل واحد اول بدون نیاز به پرداخت اجاره ماهانه. مناسب دانشجویان و کارمندان نزدیک مرکز شهر.",
    features: ["رهن کامل", "بدون اجاره", "مرکز شهر"],
    images: ["/images/type-apartment.jpg"],
    latitude: 32.6412, longitude: 51.6588,
    contact: MANAGER,
    featured: false,
  },
  {
    id: "seed-sample-land-01",
    slug: "land-sale-shahin-shahr-sample",
    title: "زمین ۴۰۰ متری شاهین‌شهر آماده ساخت",
    transaction_type: "buy",
    property_type: "land",
    neighborhood: "شاهین‌شهر",
    address: "شاهین‌شهر، فاز دو، خیابان گلستان",
    area_m2: 400, bedrooms: null, bathrooms: null, floor: null, total_floors: null, built_year: null,
    parking: false, elevator: false, storage: false,
    price: "6500000000",
    description:
      "زمین مسکونی با سند تک‌برگ و جواز ساخت، شیب مناسب و دسترسی آسفالت. عالی برای ساخت و ساز.",
    features: ["سند تک‌برگ", "جواز ساخت", "آسفالت"],
    images: ["/images/type-villa.jpg"],
    latitude: 32.8661, longitude: 51.5415,
    contact: CONSULTANT,
    featured: false,
  },
  {
    id: "seed-sample-commercial-01",
    slug: "commercial-sale-ahmadabad-sample",
    title: "مغازه تجاری ۴۰ متری احمدآباد",
    transaction_type: "buy",
    property_type: "commercial",
    neighborhood: "احمدآباد",
    address: "احمدآباد، خیابان اصلی، ضلع شرقی",
    area_m2: 40, bedrooms: null, bathrooms: 1, floor: 0, total_floors: 1, built_year: 1394,
    parking: false, elevator: false, storage: true,
    price: "8800000000",
    description:
      "مغازه در خیابان پرتردد با ویترین رو به خیابان. مناسب پوشاک، کافه یا خدمات. بازدهی اجاره سالانه بالا.",
    features: ["پرتردد", "ویترین رو به خیابان", "بازدهی بالا"],
    images: ["/images/type-office.jpg"],
    latitude: 32.6508, longitude: 51.6752,
    contact: MANAGER,
    featured: false,
  },
  {
    id: "seed-sample-sell-01",
    slug: "apartment-sell-sepahan-shahr-sample",
    title: "آپارتمان در حال فروش ۹۵ متری سپاهان‌شهر",
    transaction_type: "sell",
    property_type: "apartment",
    neighborhood: "سپاهان‌شهر",
    address: "سپاهان‌شهر، فاز چهار، بلوار گلستان",
    area_m2: 95, bedrooms: 2, bathrooms: 1, floor: 5, total_floors: 8, built_year: 1403,
    parking: true, elevator: true, storage: true,
    price: "10500000000",
    description:
      "فروش توسط مالک با مشاوره هیرمند. واحد طبقه پنجم با نمای باز، آسانسور Kone و نصب کولر گازی. تخفیف پرداخت نقدی.",
    features: ["نمای باز", "آسانسور Kone", "تخفیف نقدی"],
    images: ["/images/type-apartment.jpg"],
    latitude: 32.6122, longitude: 51.7145,
    contact: CONSULTANT,
    featured: false,
  },
];

// A couple of price drops so the "price reduction" badge logic has data.
const PRICE_DROPS = new Map([
  ["seed-sample-apartment-02", 6.5],
  ["seed-sample-villa-01", 4.0],
]);

const insertSql = `
  insert into properties (
    id, slug, status, featured, title, transaction_type, property_type, city,
    neighborhood, address, area_m2, bedrooms, bathrooms, floor, total_floors,
    built_year, parking, elevator, storage, price, deposit, rent, description,
    features, images, contact_name, contact_phone, published_at, created_at, updated_at,
    latitude, longitude, price_drop_percent
  ) values (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
    $21,$22,$23,$24::jsonb,$25::jsonb,$26,$27,$28,$29,$30,$31,$32,$33
  )
`;

await pg.exec("begin");
try {
  // Remove only rows this script owns.
  const del = await pg.query("delete from properties where id like 'seed-sample-%'");
  console.log(`[seed] cleared ${del.rowCount ?? 0} previous sample row(s)`);

  let i = 0;
  for (const row of rows) {
    const now = Date.now() - i * 36 * 60 * 60 * 1000; // stagger publish dates
    i += 1;
    const drop = PRICE_DROPS.get(row.id) ?? null;
    await pg.query(insertSql, [
      row.id,
      row.slug,
      "published",
      row.featured,
      row.title,
      row.transaction_type,
      row.property_type,
      "اصفهان",
      row.neighborhood,
      row.address,
      row.area_m2,
      row.bedrooms,
      row.bathrooms,
      row.floor,
      row.total_floors,
      row.built_year,
      row.parking,
      row.elevator,
      row.storage,
      row.price ?? null,
      row.deposit ?? null,
      row.rent ?? null,
      row.description,
      JSON.stringify(row.features),
      JSON.stringify(row.images),
      row.contact.name,
      row.contact.phone,
      new Date(now).toISOString(),
      new Date(now).toISOString(),
      new Date(now).toISOString(),
      row.latitude,
      row.longitude,
      drop,
    ]);
  }
  await pg.exec("commit");
  console.log(`[seed] inserted ${rows.length} sample listings into ${dataDir}`);
} catch (err) {
  await pg.exec("rollback");
  console.error("[seed] failed, rolled back:", err);
  process.exitCode = 1;
} finally {
  await pg.close();
}
