# Trust Badges Setup Guide

## ✅ Backend Changes Complete

The following has been done automatically:

1. ✅ Created new `Trust Badge` component in Strapi
2. ✅ Added `trustBadges` field to Hero component schema
3. ✅ Updated TypeScript types
4. ✅ Updated Hero component to use dynamic data
5. ✅ Updated data fetching to include trust badges

---

## 📝 What You Need to Do in Strapi

### Step 1: Restart Strapi Backend

The schema changes require a restart:

```bash
cd backend
npm run develop
```

### Step 2: Navigate to Landing Page Content

1. Open Strapi Admin: `http://localhost:1337/admin`
2. Go to **Content Manager** → **Single Types** → **Landing Page**
3. Find the **Hero** block

### Step 3: Add Trust Badges

In the Hero block, you'll now see a new field called **Trust Badges**.

#### 🇱🇻 LATVIAN VERSION (LV)

Add 3 trust badges:

**Trust Badge 1:**
- **Label**: `10+ Gadi`
- **Sublabel**: `Pieredze`
- **Icon**: Select `award`

**Trust Badge 2:**
- **Label**: `500+ Pasākumi`
- **Sublabel**: `Veiksmīgi`
- **Icon**: Select `users`

**Trust Badge 3:**
- **Label**: `Vietējie Produkti`
- **Sublabel**: `Kvalitāte`
- **Icon**: Select `leaf`

---

#### 🇬🇧 ENGLISH VERSION (EN)

Switch to EN locale and add:

**Trust Badge 1:**
- **Label**: `10+ Years`
- **Sublabel**: `Experience`
- **Icon**: Select `award`

**Trust Badge 2:**
- **Label**: `500+ Events`
- **Sublabel**: `Successful`
- **Icon**: Select `users`

**Trust Badge 3:**
- **Label**: `Local Products`
- **Sublabel**: `Quality`
- **Icon**: Select `leaf`

---

## 🎨 Icon Options

The Trust Badge component supports 3 icon types:
- **award** - 🏆 Trophy/award icon (for experience, achievements)
- **users** - 👥 People icon (for events, clients, team)
- **leaf** - 🌿 Leaf icon (for quality, organic, local products)

---

## 📋 Field Descriptions

- **Label**: The main text (e.g., "10+ Years", "500+ Events")
- **Sublabel**: The descriptive text below (e.g., "Experience", "Successful")
- **Icon**: Visual icon displayed in a circle badge

---

## ✅ After Adding

1. Click **Save**
2. Click **Publish**
3. Refresh your frontend
4. The trust badges should now appear dynamically from Strapi!

---

## 🎯 Benefits

Now trust badges are:
- ✅ **Editable** in Strapi CMS
- ✅ **Translatable** (LV/EN support)
- ✅ **Flexible** (add/remove/reorder badges)
- ✅ **No code changes** needed to update content

---

**Questions?** The trust badges will automatically appear below the hero text with your primary brand color!
