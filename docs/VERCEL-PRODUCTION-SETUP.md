# راه‌اندازی Production در Vercel

## متغیرهای الزامی Production

در پروژه Vercel برای محیط **Production** این متغیرها را تنظیم کنید:

- `DATABASE_URL`: آدرس PostgreSQL **pooled** با `sslmode=require`
- `DATABASE_URL_UNPOOLED`: آدرس PostgreSQL **direct/unpooled** برای migration
- `HIRMAND_ADMIN_KEY`: یک کلید طولانی و تصادفی برای ورود به `/admin`

متغیرهای اختیاری:

- `BLOB_READ_WRITE_TOKEN`: برای Vercel Blob در صورت فعال بودن ذخیره‌سازی رسانه
- `BLOB_STORE_ID`: شناسه Blob Store در صورت استفاده
- `VITE_GOOGLE_SITE_VERIFICATION`: کد تأیید Google Search Console
- `VITE_SITE_URL`: آدرس نهایی سایت؛ مقدار پیشنهادی: `https://www.hirmandrealestate.ir`

## Neon / PostgreSQL

برای Neon معمولاً:

- URL دارای pooling را در `DATABASE_URL` قرار دهید.
- URL مستقیم/unpooled را در `DATABASE_URL_UNPOOLED` قرار دهید.

برنامه در زمان build، migrationها را با URL مستقیم اجرا می‌کند و در runtime ترجیح می‌دهد از URL pooled استفاده کند.

## نکته مهم

Production بدون database عمداً در build متوقف می‌شود تا سایت با دیتابیس غیرفعال منتشر نشود. برای Preview/CI رفتار حافظه‌ای تستی فعال است.

بعد از ذخیره Environment Variables، یک Deploy جدید از شاخه `main` ایجاد کنید.

## بررسی بعد از Deploy

این مسیرها باید بررسی شوند:

- `/`
- `/properties`
- یک مسیر `/file/<id>`
- `/admin`
- `/robots.txt`
- `/sitemap.xml`

در پنل مدیریت نیز ساخت، ویرایش، انتشار و آپلود رسانه باید با دیتابیس واقعی تست شود.
