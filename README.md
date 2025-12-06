<img width="180" height="180" alt="menu-qr-cmit9jmfz000d2hm8s5589jjj" src="https://github.com/user-attachments/assets/0758dc37-356d-46f1-8437-31a60b766a33" /><img width="180" height="180" alt="menu-qr-cmit9jmfz000d2hm8s5589jjj" src="https://github.com/user-attachments/assets/a4b443c4-893f-4fd3-9339-d9310bd0d532" />

<img width="180" height="180" alt="menu-qr-cmisxy3l100022h3galxnwnlt" src="https://github.com/user-attachments/assets/da5b42ca-d38f-4291-aa71-3bd773108594" />

Scan QR for sample Menu





Digital Menu Management System

A full-stack T3 application for restaurant owners to create and manage digital menus, shareable via QR codes or links, and accessible to customers without authentication.

Deployed App: [https://digital-menu-wheat.vercel.app/dashboard)

 
=== Tech Stack --
Framework	T3 Stack (Next.js 15 App Router)
Database	PostgreSQL (Neon)
ORM	Prisma
UI	shadcn/ui + Tailwind CSS
Auth	Custom email OTP (no NextAuth)
File Storage	Cloudinary for dish images
Deployment	Vercel
Language	TypeScript

**** Features Implemented  ****
* Authentication

Email-based OTP login (no passwords, no NextAuth)

onboarding profile completion

logout

Secure session tokens stored in encrypted cookies

* Restaurant Management

Create, edit, delete restaurants

Each restaurant belongs only to its owner

Validations for restaurants, empty fields, and ownership

* Menu Management

Category creation , Deletion , View

Dishes with:

Name
Image(stored on cloudinary) ,
Description,
Spice level,
Veg/Non-veg flag,
Price ,
A dish can belong to multiple categories

** Public Customer View

No login required

Clean menu UI based on the given references

Sticky category header that updates on scroll

Floating menu button for quick category navigation on selecting

Proper grouping of dishes

Category-wise dish counts

QR code + share link generation [ scan QR and see menu ]

* UI / UX Enhancements

Skeleton loaders for slow networks

Responsive design (mobile-first)

smooth scroll interactions

Loaders 

Toasts for task status 


-----  My Approach -----

This project required building features that are used in a real product rather than coding isolated features, so I approached it the same way I would build production software:

1. Set up a clean and scalable folder structure

Separated:

/server (auth logic, Prisma client)

/app/api (route handlers)

/app/(private) and /app/(public)

Reusable components in /app/_components

2. Started with authentication

Before touching the UI, I made sure:

request-code + verify worked

sessions working

onboarding fields persisted 

redirects were correct (dashboard vs onboarding vs auth)

3. Database design first

I designed the Prisma schema around real-world usage:

Restaurants → Categories → Dishes

DishCategories table for many-to-many mapping

Added price, spice level, veg flag

4. Restaurant Management Module

Built full CRUD + protected routes.

5. Menu Management Module

This was the most complex part:

Dynamic category  

Mapping dishes to multiple categories

Loader states + skeletons

Cloudinary image uploading

Fixing strict TypeScript issues

Ensuring everything worked inside Server/Client Component boundaries

6. Public Menu UI

Followed the provided screenshots:

Sticky header updates on scroll

Floating menu button (with counts)

Dish cards matching reference design

Mobile-first Screens

7. Deployment + CI/CD

Environment variables added to Vercel

Build fixes for strict mode

ESLint adjustments

Verified production database  

++++  Edge Cases I Handled

These were not mentioned explicitly in the assignment but I implemented them because they matter in real production systems:

Authentication using gmail OTP and expiry

Invalid or expired OTP

OTP reuse prevention

Email not provided 

Restaurant Ownership [ one user can own multiple restaurants ]

User cannot access another user’s restaurant

Redirects instead of errors for cleaner UX

 
Categories and Dishes


Prevent moving categories outside valid index range

Missing fields

Price

Invalid image format

Image upload failure recovery

Spice level optional [ 1-5]

Category association empty array

++++++ Public Menu  [ most important ]

No categories available

No dishes inside a category

Hidden admin controls

Route safety: /menu/[id] must be public even though /restaurants/[id]/menu is private

----------Issues & Mistakes (AI + Mine) and How I Corrected Them


1. Next.js App Router params

AI originally used:

export default function Page({ params }: { params: { id: string }})


But App Router expects Promise params, causing prod build failures.

I rewrote them like:

export default async function Page(props: { params: Promise<{ id: string }> })

2. Overuse of Client Components

AI sometimes moved everything to client components.
I manually moved:

DB interactions into server files

Heavy UI logic into client components

3. TypeScript ESLint strict errors

AI-generated code had unsafe any, so I had to:

add file-level disable flags

tighten types manually

refactor fetch calls

4. Import path mistakes

App Router doesn’t allow absolute imports in dynamic components.
I fixed all paths to relative imports.

5. Prisma Decimal issues

AI suggested @db.Numeric which my Neon instance didn’t support.
I corrected it to:

price Decimal? @db.Decimal

 

 ========= +  AI Tools I Used
ChatGPT (major development guidance)

Prompts I used:

“Help me structure a T3 project for digital menu management”

“Fix this dynamic route error in Next.js 15 App Router”

“Generate a dish form with shadcn components”

“Explain why Prisma Decimal is failing on Neon”

“Refactor this to avoid unsafe TypeScript errors”

GitHub Copilot (type inference + autocompletion)

Used mainly for:

Prisma model suggestions

Component boilerplate

Fixing missing React hooks

Gemini

Used for:

Minor UI alignment bugs

Debugging Tailwind class conflicts

+++++ IDE Used

VSCode + Windsurf (cursor-like extension)

Plugins:

Prisma

Tailwind CSS IntelliSense

TypeScript ESLint

shadcn/ui extension

///////////// ---  Edge Cases I Couldn’t Implement Fully (due to time)

And how I would improve them with more time:

1. Category and all level duplicate checks

Currently uses simple mechanism , i would rather check duplicate with every create/edit

2. Better OTP rate limiting

Right now it’s minimal.
I would use:

Redis for caching

Per-IP and per-email throttling etc

5-minute verification window

3. Public menu caching

For large restaurants, caching menu JSON via:
Redis
React Server Components streaming
would improve load time.

4. Offline QR support

A PWA wrapper would allow customers to open the menu even offline.

-------  Run Locally ---------
pnpm install
pnpm prisma migrate dev
pnpm dev


Set required env variables in .env:

Db, clouniary and other secrets. 


THANKYOU 
SAGAR CHOUHAN..*


Sample Menu that i created are available once you scan below QR or visit 

https://digital-menu-wheat.vercel.app/menu/cmit9jmfz000d2hm8s5589jjj



