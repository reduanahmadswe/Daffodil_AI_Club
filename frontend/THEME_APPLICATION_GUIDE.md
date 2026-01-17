# Complete Theme Implementation Guide

## 🎨 Quick Theme Application for All Pages

এই guide follow করে যেকোনো page এ consistent dark theme apply করা যাবে।

## 📋 Step-by-Step Implementation:

### Step 1: Hero Section Pattern

**Before:**
```tsx
<section className="pt-32 pb-20 bg-white dark:bg-gray-900">
  <div className="container-custom">
    <h1>Page Title</h1>
  </div>
</section>
```

**After:**
```tsx
<section className="relative pt-32 pb-20 overflow-hidden bg-black">
  {/* Background Orbs */}
  <div className="absolute inset-0">
    <div className="orb orb-purple w-96 h-96 top-1/4 left-1/4" />
    <div className="orb orb-pink w-96 h-96 bottom-1/4 right-1/4" />
  </div>
  
  {/* Grid Overlay */}
  <div className="absolute inset-0 grid-overlay opacity-30" />
  
  <div className="container-custom relative z-10">
    <Badge color="purple" className="mb-6">Section Name</Badge>
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
      Page <span className="gradient-text">Title</span>
    </h1>
    <p className="text-xl text-[#B5B5C3]">Description text</p>
  </div>
</section>
```

### Step 2: Content Section Pattern

**Before:**
```tsx
<section className="py-20 bg-gray-50 dark:bg-gray-800">
  <div className="container-custom">
    <Card>
      <CardContent>Content</CardContent>
    </Card>
  </div>
</section>
```

**After:**
```tsx
<section className="py-20 bg-black relative overflow-hidden">
  {/* Background Orbs */}
  <div className="absolute inset-0">
    <div className="orb orb-cyan w-96 h-96 top-1/3 left-1/4" />
    <div className="orb orb-blue w-96 h-96 bottom-1/3 right-1/4" />
  </div>
  
  {/* Grid Overlay */}
  <div className="absolute inset-0 grid-overlay opacity-20" />
  
  <div className="container-custom relative z-10">
    <div className="glass rounded-2xl p-6 hover:shadow-glow-purple transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-2">Title</h3>
      <p className="text-[#B5B5C3]">Content</p>
    </div>
  </div>
</section>
```

### Step 3: Card Replacements

**Old Card:**
```tsx
<Card>
  <CardContent className="p-6">
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardContent>
</Card>
```

**New Glass Card:**
```tsx
<div className="glass rounded-2xl p-6 hover:shadow-glow-purple transition-all duration-300">
  <h3 className="text-xl font-bold text-white mb-2">Title</h3>
  <p className="text-[#B5B5C3]">Description</p>
</div>
```

### Step 4: Color Replacements

| Old Class | New Class |
|-----------|-----------|
| `text-gray-600 dark:text-gray-400` | `text-[#B5B5C3]` |
| `text-gray-900 dark:text-white` | `text-white` |
| `text-gray-500` | `text-[#8A8A9E]` |
| `text-primary-600` | `text-[#7B61FF]` |
| `bg-white dark:bg-gray-900` | `bg-black` |
| `bg-gray-50 dark:bg-gray-800` | `bg-black` |

### Step 5: Button Replacements

**Old Button:**
```tsx
<Button variant="primary">Click Me</Button>
```

**New Nexus Button:**
```tsx
<button className="btn-nexus-primary px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-2">
  Click Me
  <ArrowRight className="w-5 h-5" />
</button>
```

## 🎯 Page-Specific Patterns:

### Listing Pages (Events, Blog, Projects, Workshops):

```tsx
export default function ListingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-black">
        {/* Orbs + Grid */}
        <div className="container-custom relative z-10">
          <h1 className="gradient-text">Page Title</h1>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-black relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="glass rounded-2xl p-6">
            {/* Filters */}
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Orbs */}
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div className="glass rounded-2xl overflow-hidden hover:shadow-glow-pink transition-all">
                {/* Item content */}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

### Detail Pages (Event Detail, Blog Detail, etc.):

```tsx
export default function DetailPage() {
  return (
    <>
      {/* Hero with Image */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-black">
        {/* Orbs + Grid */}
        <div className="container-custom relative z-10">
          <div className="glass rounded-2xl overflow-hidden">
            <img src={image} className="w-full aspect-video object-cover" />
            <div className="p-8">
              <h1 className="text-white">Title</h1>
              <p className="text-[#B5B5C3]">Description</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Orbs */}
        <div className="container-custom relative z-10">
          <div className="glass rounded-2xl p-8">
            <div className="prose prose-invert max-w-none">
              {/* Content */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

### Auth Pages (Login, Register):

```tsx
export default function AuthPage() {
  return (
    <section className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-20">
      {/* Large Center Orb */}
      <div className="absolute inset-0">
        <div className="orb orb-purple w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-md mx-auto">
          <div className="glass rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Login</h1>
            {/* Form */}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Dashboard Pages:

```tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Orbs (subtle) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-purple w-96 h-96 top-0 right-0 opacity-30" />
        <div className="orb orb-cyan w-96 h-96 bottom-0 left-0 opacity-30" />
      </div>
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 grid-overlay opacity-10 pointer-events-none" />
      
      <div className="relative z-10 py-8">
        <div className="container-custom">
          {/* Dashboard content with glass cards */}
          <div className="grid gap-6">
            <div className="glass rounded-2xl p-6">
              {/* Widget */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🎨 Orb Color Combinations:

### Recommended Combinations:
1. **Purple + Pink** - Hero sections
2. **Cyan + Blue** - Content sections
3. **Pink + Purple** - Feature sections
4. **Cyan + Pink** - Call-to-action sections
5. **Purple (large center)** - Auth pages, Stats

### Orb Positioning:
- `top-1/4 left-1/4` - Top left
- `bottom-1/4 right-1/4` - Bottom right
- `top-1/3 right-1/4` - Top right
- `bottom-1/3 left-1/4` - Bottom left
- `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` - Center

## 📝 Quick Checklist for Each Page:

- [ ] Hero section has orbs + grid
- [ ] All sections have `bg-black`
- [ ] Cards replaced with `glass` class
- [ ] Text colors updated (`text-white`, `text-[#B5B5C3]`)
- [ ] Buttons use `btn-nexus-primary` or `btn-nexus-secondary`
- [ ] Gradient text on important words
- [ ] Hover effects with `shadow-glow-purple` or `shadow-glow-pink`
- [ ] All sections have `relative z-10` on content containers

## 🚀 Automated Find & Replace:

Use these regex patterns in your editor:

1. **Background Colors:**
   - Find: `className="([^"]*)(bg-white|bg-gray-50|bg-gray-100)([^"]*)"`
   - Replace: `className="$1bg-black$3"`

2. **Text Colors:**
   - Find: `text-gray-600 dark:text-gray-400`
   - Replace: `text-[#B5B5C3]`

3. **Section Pattern:**
   - Find: `<section className="py-20 bg-`
   - Replace: `<section className="py-20 bg-black relative overflow-hidden`

## 📦 Ready-to-Use Components:

All these are in `globals.css`:
- `glass` - Glassmorphism card
- `gradient-text` - Purple-pink gradient text
- `orb orb-purple` - Purple floating orb
- `orb orb-pink` - Pink floating orb
- `orb orb-cyan` - Cyan floating orb
- `orb orb-blue` - Blue floating orb
- `grid-overlay` - Grid pattern overlay
- `btn-nexus-primary` - Primary button
- `btn-nexus-secondary` - Secondary button
- `shadow-glow-purple` - Purple glow effect
- `shadow-glow-pink` - Pink glow effect

## 🎯 Priority Order:

1. ✅ Home Page
2. ✅ About Page
3. ✅ Contact Page (Hero done)
4. Events Pages
5. Blog Pages
6. Projects Pages
7. Workshops Pages
8. Gallery Page
9. Auth Pages
10. Dashboard Pages
11. Admin Pages

---

**Follow this guide to maintain 100% theme consistency across all pages!** 🎨✨
