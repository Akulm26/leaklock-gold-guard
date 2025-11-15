# LeakLock Gold Guard - Mobile App Styling Prompt

## 🎨 Complete Design System Specifications

### App Identity
- **App Name**: LeakLock Gold Guard
- **App ID**: `app.lovable.8248bf29c0a04110be2d4427550ead35`
- **Theme**: Premium Dark with Gold Accents
- **Target Platform**: iOS & Android Mobile App (Capacitor)

---

## 📱 Core Layout Structure

### MobileLayout Component
```css
- Container: min-h-screen with gradient background
- Max Width: 448px (max-w-md)
- Padding: 1rem (p-4)
- Shadow: shadow-2xl
- Overflow: hidden
- Display: flex items-center justify-center
```

### Safe Areas
- Bottom navigation respects safe area with `safe-area-bottom` class
- Fixed bottom nav height: 4rem (h-16)
- Bottom nav padding: 1.5rem horizontal (px-6)

---

## 🎨 Color System (ALL HSL VALUES)

### Background Colors
```css
--background-start: 225 27% 6%;        /* #0E0E14 navy-black - gradient start */
--background-end: 225 22% 11%;         /* #101728 navy - gradient end */
--background: 225 27% 6%;              /* Main background */
--foreground: 0 0% 96%;                /* #F5F5F5 off-white text */
```

### Primary Colors (Gold Premium)
```css
--primary: 43 64% 53%;                 /* #D4AF37 gold accent */
--primary-foreground: 225 27% 6%;      /* Dark text on gold */
```

### Secondary Colors
```css
--secondary: 225 15% 18%;              /* Subtle grey-navy */
--secondary-foreground: 0 0% 96%;      /* Off-white text */
```

### UI Element Colors
```css
--card: 225 20% 12%;                   /* Glassy dark card */
--card-foreground: 0 0% 96%;           /* Card text */
--popover: 225 20% 10%;                /* Popover background */
--popover-foreground: 0 0% 96%;        /* Popover text */
--muted: 225 15% 15%;                  /* Muted background */
--muted-foreground: 0 0% 60%;          /* #9A9A9A grey text */
--accent: 43 64% 53%;                  /* Gold accent (same as primary) */
--accent-foreground: 225 27% 6%;       /* Dark text on accent */
```

### Functional Colors
```css
--destructive: 0 84% 60%;              /* Error/delete red */
--destructive-foreground: 0 0% 98%;    /* White text on destructive */
--border: 225 20% 20%;                 /* Subtle border with gold tint */
--input: 225 20% 15%;                  /* Input field background */
--ring: 43 64% 53%;                    /* Gold focus ring */
```

---

## 🎭 Gradients & Effects

### Background Gradient
```css
--gradient-background: linear-gradient(180deg, hsl(225 27% 6%) 0%, hsl(225 22% 11%) 100%);
/* Applied to: body, MobileLayout, all page backgrounds */
```

### Primary Gradient (Gold)
```css
--gradient-primary: linear-gradient(135deg, hsl(43 64% 53%) 0%, hsl(43 70% 60%) 100%);
/* Applied to: buttons, accent elements */
```

### Shadow Effects
```css
--shadow-glow: 0 0 40px hsl(43 64% 53% / 0.15);        /* Gold glow effect */
--shadow-card: 0 10px 40px -10px hsl(225 27% 3% / 0.5); /* Card shadow */
```

### Glass Morphism Effect
```css
.glass-card {
  background: hsl(225 20% 12% / 0.4);   /* 40% opacity card background */
  backdrop-filter: blur(24px);           /* xl blur */
  border: 1px solid hsl(225 20% 20% / 0.5); /* 50% opacity border */
}
```

### Gold Glow Utility
```css
.gold-glow {
  box-shadow: 0 0 40px hsl(43 64% 53% / 0.15);
}
```

---

## 📝 Typography

### Font Family
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
/* Default system fonts for optimal mobile performance */
```

### Text Sizes & Weights

#### Headings
```css
h1: text-4xl (2.25rem / 36px), font-bold, leading-tight, tracking-tight
h2: text-3xl (1.875rem / 30px), font-bold
h3: text-2xl (1.5rem / 24px), font-semibold
```

#### Body Text
```css
Large body: text-lg (1.125rem / 18px), leading-relaxed
Base body: text-base (1rem / 16px)
Small text: text-sm (0.875rem / 14px)
Extra small: text-xs (0.75rem / 12px)
```

#### Special Text Colors
```css
Muted text: text-muted-foreground (hsl(0 0% 60%))
Primary text: text-primary (gold)
Foreground: text-foreground (off-white)
```

---

## 🔘 Border Radius System

```css
--radius: 1.25rem;              /* 20px - base radius */
lg: var(--radius);              /* 20px - large components */
md: calc(var(--radius) - 2px); /* 18px - medium */
sm: calc(var(--radius) - 4px); /* 16px - small */

/* Specific uses: */
rounded-2xl: 1rem (16px)        /* Cards, containers */
rounded-xl: 0.75rem (12px)      /* Buttons */
rounded-lg: 0.5rem (8px)        /* Inputs */
rounded-full: 9999px            /* Pills, badges */
```

---

## 🎬 Animations

### Transitions
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframe Animations
```css
/* Fade In */
@keyframes fade-in {
  0%: opacity: 0, transform: translateY(10px)
  100%: opacity: 1, transform: translateY(0)
}
animation: fade-in 0.3s ease-out

/* Scale In */
@keyframes scale-in {
  0%: transform: scale(0.95), opacity: 0
  100%: transform: scale(1), opacity: 1
}
animation: scale-in 0.2s ease-out

/* Gold Pulse */
@keyframes pulse-gold {
  0%, 100%: box-shadow: 0 0 0 0 hsl(43 64% 53% / 0.7)
  50%: box-shadow: 0 0 20px 10px hsl(43 64% 53% / 0)
}
animation: pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite

/* Shimmer */
@keyframes shimmer {
  0%: background-position: -200% 0
  100%: background-position: 200% 0
}
animation: shimmer 2s linear infinite

/* Shake (for errors) */
@keyframes shake {
  0%, 100%: transform: translateX(0)
  25%: transform: translateX(-10px)
  75%: transform: translateX(10px)
}
animation: shake 0.5s ease-in-out

/* Slow Spin */
@keyframes spin-slow {
  from: transform: rotate(0deg)
  to: transform: rotate(360deg)
}
animation: spin-slow 3s linear infinite
```

---

## 🔢 Component-Specific Styling

### Button Variants

#### Default Button (Gold)
```css
background: hsl(43 64% 53%)           /* Gold */
color: hsl(225 27% 6%)                /* Dark text */
padding: 0.5rem 1rem                  /* py-2 px-4 */
border-radius: 0.75rem                /* rounded-xl */
font-weight: 600                      /* font-semibold */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

hover: brightness(110%)
active: scale(0.98)
disabled: opacity(50%), cursor-not-allowed
```

#### Outline Button
```css
background: transparent
border: 1px solid hsl(43 64% 53%)     /* Gold border */
color: hsl(43 64% 53%)                /* Gold text */
padding: 0.5rem 1rem
border-radius: 0.75rem

hover: background: hsl(43 64% 53% / 0.1)
```

#### Ghost Button
```css
background: transparent
color: hsl(0 0% 96%)                  /* Off-white */
padding: 0.5rem 1rem

hover: background: hsl(225 20% 12%)   /* Card background */
```

#### Loading State
```css
opacity: 0.6
cursor: not-allowed
/* Add spinner icon with animate-spin */
```

### Input Fields

#### Standard Input
```css
height: 2.5rem                        /* h-10 */
width: 100%                           /* w-full */
border-radius: 0.375rem               /* rounded-md */
border: 1px solid hsl(225 20% 15%)   /* input border */
background: hsl(225 27% 6%)           /* background */
padding: 0.5rem 0.75rem               /* py-2 px-3 */
color: hsl(0 0% 96%)                  /* foreground */
font-size: 1rem                       /* text-base on mobile */

placeholder: color: hsl(0 0% 60%)     /* muted-foreground */

focus: {
  outline: none
  ring: 2px solid hsl(43 64% 53%)     /* gold ring */
  ring-offset: 2px
}

disabled: {
  cursor: not-allowed
  opacity: 0.5
}
```

#### OTP Input (Special Styling)
```css
/* Individual OTP digit */
height: 3.5rem                        /* h-14 */
width: 3rem                           /* w-12 */
border-radius: 0.75rem                /* rounded-xl */
border: 2px solid hsl(225 20% 20%)   /* border */
background: hsl(225 20% 12%)          /* card */
color: hsl(0 0% 96%)                  /* foreground */
text-align: center
font-size: 1.5rem                     /* text-2xl */
font-weight: 700                      /* font-bold */
transition: all 0.2s

focus: {
  outline: none
  border-color: hsl(43 64% 53%)       /* gold */
  box-shadow: 0 0 0 3px hsl(43 64% 53% / 0.2)
  transform: scale(1.05)
}

error: {
  border-color: hsl(0 84% 60%)        /* destructive */
  animation: shake 0.5s
}

filled: {
  background: hsl(43 64% 53% / 0.1)   /* Light gold tint */
}
```

### Cards

#### Glass Card
```css
background: hsl(225 20% 12% / 0.4)    /* 40% opacity */
backdrop-filter: blur(24px)            /* backdrop-blur-xl */
border: 1px solid hsl(225 20% 20% / 0.5)
border-radius: 1rem                    /* rounded-2xl */
padding: 1.5rem                        /* p-6 */
box-shadow: 0 10px 40px -10px hsl(225 27% 3% / 0.5)
```

#### Subscription Card (Active)
```css
background: hsl(225 20% 12%)          /* card */
border: 1px solid hsl(225 20% 20%)   /* border */
border-radius: 1rem                   /* rounded-2xl */
padding: 1rem                         /* p-4 */
transition: all 0.3s

hover: {
  border-color: hsl(43 64% 53%)       /* gold */
  box-shadow: 0 0 20px hsl(43 64% 53% / 0.15)
}
```

#### Subscription Card (Expired/Paused)
```css
background: hsl(225 20% 12%)
border: 1px solid hsl(225 20% 20%)
opacity: 0.7
filter: grayscale(0.3)
```

### Bottom Navigation

```css
position: fixed
bottom: 0
left: 0
right: 0
height: 4rem                          /* h-16 */
background: hsl(225 27% 6% / 0.95)    /* background/95 */
backdrop-filter: blur(16px)            /* backdrop-blur-lg */
border-top: 1px solid hsl(43 64% 53% / 0.2)
z-index: 50
max-width: 448px                      /* max-w-md */
margin: 0 auto

/* Nav Item */
.nav-item {
  display: flex
  flex-direction: column
  align-items: center
  gap: 0.25rem                        /* gap-1 */
  transition: color 0.3s
  
  /* Icon */
  icon-size: 24px
  
  /* Label */
  font-size: 0.75rem                  /* text-xs */
  font-weight: 500                    /* font-medium */
}

/* Active State */
.nav-item-active {
  color: hsl(43 64% 53%)              /* primary gold */
}
.nav-item-active icon {
  box-shadow: 0 0 40px hsl(43 64% 53% / 0.15) /* gold-glow */
}

/* Inactive State */
.nav-item-inactive {
  color: hsl(0 0% 60%)                /* muted-foreground */
}
```

### Badges & Pills

#### Status Badge (Active)
```css
background: hsl(142 76% 36% / 0.1)    /* Green tint */
color: hsl(142 76% 36%)               /* Green */
padding: 0.25rem 0.75rem              /* py-1 px-3 */
border-radius: 9999px                 /* rounded-full */
font-size: 0.75rem                    /* text-xs */
font-weight: 600                      /* font-semibold */
```

#### Status Badge (Expired)
```css
background: hsl(0 84% 60% / 0.1)      /* Red tint */
color: hsl(0 84% 60%)                 /* Red */
padding: 0.25rem 0.75rem
border-radius: 9999px
font-size: 0.75rem
font-weight: 600
```

#### Status Badge (Paused)
```css
background: hsl(43 64% 53% / 0.1)     /* Gold tint */
color: hsl(43 64% 53%)                /* Gold */
padding: 0.25rem 0.75rem
border-radius: 9999px
font-size: 0.75rem
font-weight: 600
```

### Tabs

```css
.tabs-list {
  background: hsl(225 20% 12%)        /* card */
  padding: 0.25rem                    /* p-1 */
  border-radius: 0.75rem              /* rounded-xl */
  display: inline-flex
  gap: 0.25rem
}

.tabs-trigger {
  padding: 0.5rem 1rem                /* py-2 px-4 */
  border-radius: 0.5rem               /* rounded-lg */
  font-size: 0.875rem                 /* text-sm */
  font-weight: 500                    /* font-medium */
  color: hsl(0 0% 60%)                /* muted-foreground */
  transition: all 0.2s
}

.tabs-trigger-active {
  background: hsl(43 64% 53%)         /* primary gold */
  color: hsl(225 27% 6%)              /* dark text */
  box-shadow: 0 0 20px hsl(43 64% 53% / 0.3)
}
```

---

## 📱 Page-Specific Styling

### Welcome Page

```css
/* Page Container */
padding: 3rem 1.5rem                  /* py-12 px-6 */
height: 100%                          /* h-full */
display: flex
flex-direction: column
animation: fade-in 0.3s ease-out

/* Logo Section */
margin-bottom: 3rem                   /* mb-12 */
padding-top: 2rem                     /* pt-8 */

/* Hero Text */
h1 {
  font-size: 2.25rem                  /* text-4xl */
  font-weight: 700                    /* font-bold */
  line-height: 1.25                   /* leading-tight */
  letter-spacing: -0.025em            /* tracking-tight */
  margin-bottom: 1.5rem
}

p.hero {
  font-size: 1.125rem                 /* text-lg */
  color: hsl(0 0% 60%)                /* muted-foreground */
  line-height: 1.625                  /* leading-relaxed */
}

/* Phone Input Container */
background: hsl(225 20% 12% / 0.4)    /* glass-card */
backdrop-filter: blur(24px)
border-radius: 1rem                   /* rounded-2xl */
padding: 1.5rem                       /* p-6 */
border: 1px solid hsl(225 20% 20% / 0.5)

/* Phone Input Prefix */
display: flex
align-items: center
gap: 0.5rem
color: hsl(0 0% 60%)                  /* muted-foreground */
border-right: 1px solid hsl(225 20% 20% / 0.5)
padding-right: 0.75rem                /* pr-3 */

/* Phone Icon */
size: 18px

/* Continue Button */
width: 100%
height: 3rem                          /* h-12 */
background: hsl(43 64% 53%)           /* primary gold */
color: hsl(225 27% 6%)                /* dark text */
border-radius: 0.75rem                /* rounded-xl */
font-weight: 600                      /* font-semibold */
font-size: 1rem                       /* text-base */

disabled: {
  opacity: 0.5
  cursor: not-allowed
}
```

### OTP Page

```css
/* Page Container */
padding: 3rem 1.5rem                  /* py-12 px-6 */
height: 100%
display: flex
flex-direction: column

/* Header Section */
margin-bottom: 3rem                   /* mb-12 */

/* Progress Indicator */
display: flex
gap: 0.5rem                           /* gap-2 */
margin-bottom: 3rem                   /* mb-12 */

.progress-dot {
  height: 0.5rem                      /* h-2 */
  width: 2rem                         /* w-8 */
  border-radius: 9999px               /* rounded-full */
  transition: all 0.3s
}

.progress-dot-active {
  background: hsl(43 64% 53%)         /* primary gold */
  width: 3rem                         /* w-12 */
}

.progress-dot-inactive {
  background: hsl(225 20% 20%)        /* border */
}

/* Title */
h1 {
  font-size: 2rem                     /* text-3xl */
  font-weight: 700                    /* font-bold */
  margin-bottom: 1rem                 /* mb-4 */
}

/* Subtitle with Phone Number */
color: hsl(0 0% 60%)                  /* muted-foreground */
font-size: 1rem                       /* text-base */

.phone-display {
  color: hsl(43 64% 53%)              /* primary gold */
  font-weight: 600                    /* font-semibold */
}

/* OTP Input Grid */
display: grid
grid-template-columns: repeat(6, 1fr)
gap: 0.75rem                          /* gap-3 */
margin: 2.5rem 0                      /* my-10 */

/* Single OTP Input Box (see OTP Input styling above) */

/* Error Message */
color: hsl(0 84% 60%)                 /* destructive */
font-size: 0.875rem                   /* text-sm */
margin-top: 0.5rem                    /* mt-2 */
animation: fade-in 0.3s

/* Action Buttons Row */
display: flex
justify-content: space-between
align-items: center
margin-top: 2rem                      /* mt-8 */

/* Resend Button */
color: hsl(43 64% 53%)                /* primary gold */
font-size: 0.875rem                   /* text-sm */
font-weight: 500                      /* font-medium */
text-decoration: underline
background: transparent

hover: opacity: 0.8

disabled: {
  opacity: 0.5
  cursor: not-allowed
}

/* Loading Spinner */
animation: spin 1s linear infinite
color: hsl(43 64% 53%)                /* primary gold */
```

### Dashboard Page

```css
/* Page Container */
padding: 1.5rem                       /* p-6 */
padding-bottom: 6rem                  /* pb-24 (space for bottom nav) */

/* Header Section */
display: flex
justify-content: space-between
align-items: center
margin-bottom: 2rem                   /* mb-8 */

/* Welcome Text */
h1 {
  font-size: 1.875rem                 /* text-3xl */
  font-weight: 700                    /* font-bold */
}

.user-name {
  color: hsl(43 64% 53%)              /* primary gold */
}

/* Header Icons */
display: flex
gap: 0.75rem                          /* gap-3 */

button.icon {
  background: hsl(225 20% 12% / 0.4)  /* glass */
  padding: 0.5rem                     /* p-2 */
  border-radius: 0.75rem              /* rounded-xl */
  border: 1px solid hsl(225 20% 20% / 0.5)
}

/* Stats Summary Card */
background: hsl(225 20% 12% / 0.4)    /* glass-card */
backdrop-filter: blur(24px)
border: 1px solid hsl(225 20% 20% / 0.5)
border-radius: 1rem                   /* rounded-2xl */
padding: 1.5rem                       /* p-6 */
margin-bottom: 2rem                   /* mb-8 */

.stat-label {
  color: hsl(0 0% 60%)                /* muted-foreground */
  font-size: 0.875rem                 /* text-sm */
}

.stat-value {
  font-size: 2rem                     /* text-3xl */
  font-weight: 700                    /* font-bold */
  color: hsl(43 64% 53%)              /* primary gold */
}

/* Tabs for Active/Expired */
margin-bottom: 1.5rem                 /* mb-6 */
/* (See Tabs styling above) */

/* Subscription List */
display: flex
flex-direction: column
gap: 1rem                             /* gap-4 */

/* Empty State */
.empty-state {
  text-align: center
  padding: 4rem 2rem                  /* py-16 px-8 */
  color: hsl(0 0% 60%)                /* muted-foreground */
}

/* Individual Subscription Card */
background: hsl(225 20% 12%)          /* card */
border: 1px solid hsl(225 20% 20%)   /* border */
border-radius: 1rem                   /* rounded-2xl */
padding: 1rem                         /* p-4 */
transition: all 0.3s

/* Card Header */
display: flex
justify-content: space-between
align-items: start
margin-bottom: 0.75rem                /* mb-3 */

/* Merchant Name */
font-size: 1.125rem                   /* text-lg */
font-weight: 600                      /* font-semibold */

/* Amount */
font-size: 1.5rem                     /* text-2xl */
font-weight: 700                      /* font-bold */
color: hsl(43 64% 53%)                /* primary gold */

/* Next Renewal */
color: hsl(0 0% 60%)                  /* muted-foreground */
font-size: 0.875rem                   /* text-sm */

/* Action Buttons */
display: flex
gap: 0.5rem                           /* gap-2 */
margin-top: 0.75rem                   /* mt-3 */

/* Bottom Add Button (Floating) */
position: fixed
bottom: 5rem                          /* bottom-20 (above nav) */
right: 1.5rem                         /* right-6 */
width: 3.5rem                         /* w-14 */
height: 3.5rem                        /* h-14 */
border-radius: 9999px                 /* rounded-full */
background: hsl(43 64% 53%)           /* primary gold */
color: hsl(225 27% 6%)                /* dark */
box-shadow: 0 0 40px hsl(43 64% 53% / 0.3)
z-index: 40

hover: {
  transform: scale(1.1)
  box-shadow: 0 0 60px hsl(43 64% 53% / 0.5)
}

active: {
  transform: scale(0.95)
}
```

---

## 🔐 Authentication & Hardcoded Values

### OTP System Configuration

#### Hardcoded OTP for Testing (DEVELOPMENT ONLY)
```javascript
// For development/testing purposes, use this hardcoded OTP
const HARDCODED_OTP = "123456";

// Bypass Supabase OTP verification in development
if (process.env.NODE_ENV === "development") {
  if (otpValue === HARDCODED_OTP) {
    // Skip actual OTP verification
    // Navigate directly to profile setup
    navigate("/profile-setup");
    return;
  }
}
```

#### Phone Number Format
```javascript
// Always format to E.164 international format
const COUNTRY_CODE = "+91";           // Hardcoded for India
const formattedPhone = `+91${phone}`; // Example: +919876543210

// Store in localStorage for OTP verification
localStorage.setItem("phone", formattedPhone);
```

#### OTP Flow Steps
```
1. User enters phone number (10 digits)
2. Format to +91XXXXXXXXXX
3. Call supabase.auth.signInWithOtp({ phone: formattedPhone })
4. Navigate to /otp page
5. User enters 6-digit OTP
6. Verify with supabase.auth.verifyOtp({ phone, token, type: "sms" })
7. On success: navigate to /profile-setup
8. On error: shake animation + clear inputs
```

#### OTP Input Behavior
```javascript
// Auto-focus behavior
- Focus on first input on mount
- Auto-advance to next input on digit entry
- Backspace moves to previous input if current is empty
- Auto-submit when all 6 digits filled

// Validation
- Only numeric digits allowed (regex: /^\d*$/)
- Max 1 character per input
- Disable submit until all 6 filled
```

---

## 📏 Spacing & Layout Standards

### Page Padding
```css
Top padding: 3rem (py-12)             /* Main pages */
Side padding: 1.5rem (px-6)           /* Main pages */
Bottom padding: 6rem (pb-24)          /* Pages with bottom nav */
```

### Component Spacing
```css
Section gap: 1.5rem - 2rem            /* mb-6 to mb-8 */
Card gap: 1rem                        /* gap-4 */
Button gap: 0.5rem                    /* gap-2 */
Icon-text gap: 0.5rem - 0.75rem      /* gap-2 to gap-3 */
```

### Touch Targets (Mobile Optimized)
```css
Minimum tap target: 44px × 44px       /* iOS guideline */
Button height: 2.5rem - 3rem          /* h-10 to h-12 */
Icon button: 2.5rem × 2.5rem          /* w-10 h-10 */
Nav item: Auto height, min 48px
```

---

## 🎯 Icon System (Lucide React)

### Icon Sizes
```css
Small: 16px                           /* size={16} */
Medium: 20px                          /* size={20} */
Large: 24px                           /* size={24} */
Extra Large: 32px                     /* size={32} */
```

### Icon Colors
```css
Default: currentColor                 /* Inherits text color */
Muted: hsl(0 0% 60%)                 /* muted-foreground */
Primary: hsl(43 64% 53%)             /* gold */
Destructive: hsl(0 84% 60%)          /* red */
```

### Common Icons Used
```javascript
// Navigation
<Home size={24} />
<Plus size={24} />
<Settings size={24} />

// Actions
<Edit size={16} />
<Trash2 size={16} />
<MessageCircle size={16} />

// UI
<Phone size={18} />
<Bell size={20} />
<ArrowLeft size={20} />
<AlertCircle size={16} />
<ChevronRight size={16} />
```

---

## 📱 Responsive Breakpoints (Capacitor Mobile)

### Target Devices
```css
/* Primary: iPhone & Android phones */
min-width: 320px                      /* iPhone SE */
max-width: 448px                      /* max-w-md container */
optimal: 375px - 414px                /* iPhone 12-14 Pro */

/* Orientation */
portrait: default                     /* Primary focus */
landscape: supported but not optimized
```

### Safe Areas
```css
/* iOS safe areas */
padding-top: env(safe-area-inset-top)
padding-bottom: env(safe-area-inset-bottom)

/* Android navigation bar */
padding-bottom: constant(safe-area-inset-bottom)
```

---

## 🔔 Toast Notifications

### Success Toast
```css
background: hsl(142 76% 36% / 0.1)    /* Green tint */
border: 1px solid hsl(142 76% 36%)
color: hsl(0 0% 96%)                  /* foreground */
icon-color: hsl(142 76% 36%)          /* Green */
```

### Error Toast
```css
background: hsl(0 84% 60% / 0.1)      /* Red tint */
border: 1px solid hsl(0 84% 60%)
color: hsl(0 0% 96%)
icon-color: hsl(0 84% 60%)            /* Red */
```

### Info Toast
```css
background: hsl(43 64% 53% / 0.1)     /* Gold tint */
border: 1px solid hsl(43 64% 53%)
color: hsl(0 0% 96%)
icon-color: hsl(43 64% 53%)           /* Gold */
```

### Toast Position
```css
position: fixed
bottom: 5rem                          /* Above bottom nav */
right: 1rem
left: 1rem
max-width: 400px
margin: 0 auto
z-index: 100
```

---

## 🎨 Logo Specifications

### Logo Component Sizes
```css
Small: 32px × 32px
Medium: 48px × 48px
Large: 64px × 64px

/* Logo container */
display: flex
align-items: center
justify-content: center
padding: 0.5rem

/* Logo colors */
primary-color: hsl(43 64% 53%)        /* Gold */
background: hsl(225 27% 6%)           /* Dark navy */
glow: 0 0 40px hsl(43 64% 53% / 0.15)
```

---

## 🔄 Loading States

### Spinner
```css
.spinner {
  width: 1.5rem                       /* w-6 */
  height: 1.5rem                      /* h-6 */
  border: 2px solid hsl(225 20% 20%) /* border */
  border-top-color: hsl(43 64% 53%)   /* gold */
  border-radius: 9999px               /* rounded-full */
  animation: spin 0.6s linear infinite
}
```

### Skeleton Loading
```css
.skeleton {
  background: linear-gradient(
    90deg,
    hsl(225 20% 12%) 0%,
    hsl(225 20% 15%) 50%,
    hsl(225 20% 12%) 100%
  )
  background-size: 200% 100%
  animation: shimmer 2s linear infinite
  border-radius: inherit
}
```

### Button Loading State
```css
.button-loading {
  opacity: 0.6
  cursor: not-allowed
  position: relative
}

.button-loading::after {
  content: ""
  position: absolute
  width: 1rem
  height: 1rem
  border: 2px solid currentColor
  border-top-color: transparent
  border-radius: 9999px
  animation: spin 0.6s linear infinite
  margin-left: 0.5rem
}
```

---

## ✨ Special Effects & Interactions

### Haptic Feedback (Mobile)
```javascript
// Trigger on button press, delete, important actions
if (navigator.vibrate) {
  navigator.vibrate(10); // 10ms light tap
}

// For errors or warnings
if (navigator.vibrate) {
  navigator.vibrate([50, 30, 50]); // Double tap pattern
}
```

### Scroll Behavior
```css
/* Smooth scrolling */
html {
  scroll-behavior: smooth
}

/* Hide scrollbar but keep functionality */
::-webkit-scrollbar {
  width: 0px
  background: transparent
}

/* Pull-to-refresh indicator */
overscroll-behavior-y: contain
```

### Card Hover Effects (Mobile: Use Active State)
```css
@media (hover: none) {
  .card:active {
    transform: scale(0.98)
    border-color: hsl(43 64% 53%)
    box-shadow: 0 0 20px hsl(43 64% 53% / 0.15)
  }
}
```

---

## 📝 Form Validation States

### Input Error State
```css
border-color: hsl(0 84% 60%)          /* destructive */
box-shadow: 0 0 0 3px hsl(0 84% 60% / 0.2)
animation: shake 0.5s

/* Error message below */
color: hsl(0 84% 60%)
font-size: 0.75rem                    /* text-xs */
margin-top: 0.5rem
```

### Input Success State
```css
border-color: hsl(142 76% 36%)        /* green */
box-shadow: 0 0 0 3px hsl(142 76% 36% / 0.2)

/* Success icon */
color: hsl(142 76% 36%)
```

### Input Focus State
```css
outline: none
ring: 2px solid hsl(43 64% 53%)       /* gold */
ring-offset: 2px
border-color: hsl(43 64% 53%)
```

---

## 🎯 Accessibility

### Focus Indicators
```css
/* Visible focus for keyboard navigation */
:focus-visible {
  outline: 2px solid hsl(43 64% 53%)  /* gold */
  outline-offset: 2px
}

/* Remove default browser outline */
:focus {
  outline: none
}
```

### Text Contrast Ratios
```css
/* WCAG AA compliance */
Body text on background: 11.4:1       /* #F5F5F5 on #0E0E14 */
Gold on dark: 4.8:1                   /* #D4AF37 on #0E0E14 */
Muted text: 3.2:1                     /* #9A9A9A on #0E0E14 */
```

### Touch Target Sizes
```css
/* Minimum 44px × 44px per iOS guidelines */
button, input, .interactive {
  min-height: 44px
  min-width: 44px
}
```

---

## 🚀 Performance Optimizations

### CSS Optimizations
```css
/* Use transform for animations (GPU accelerated) */
transform: translateZ(0)              /* Enable GPU */
will-change: transform                /* Prepare for animation */

/* Avoid expensive properties */
/* ❌ Don't use: filter (except backdrop-filter) */
/* ✅ Use: transform, opacity */
```

### Image Handling
```css
/* Lazy loading */
loading="lazy"

/* Aspect ratio preservation */
aspect-ratio: 16/9
object-fit: cover
```

---

## 📦 Complete Component Checklist

### Must-Have Mobile Components
- [x] MobileLayout wrapper
- [x] Bottom navigation (fixed)
- [x] Glass morphism cards
- [x] OTP input (6 digits)
- [x] Toast notifications
- [x] Loading spinners
- [x] Back button
- [x] Logo component
- [x] Status badges
- [x] Action sheets/modals
- [x] Floating action button
- [x] Tab navigation
- [x] Form inputs with validation
- [x] Icon buttons

---

## 🎬 Motion Design Principles

### Animation Timing
```css
Fast: 0.15s - 0.2s                    /* Small UI feedback */
Medium: 0.3s - 0.4s                   /* Transitions, fades */
Slow: 0.5s - 0.8s                     /* Page transitions */
Ambient: 2s - 3s                      /* Background effects */
```

### Easing Functions
```css
ease-out: cubic-bezier(0, 0, 0.2, 1)  /* Enter animations */
ease-in: cubic-bezier(0.4, 0, 1, 1)   /* Exit animations */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) /* Bi-directional */
```

---

## 🎨 Complete Color Palette Reference

```css
/* Dark Navy Backgrounds */
--background-darkest: 225 27% 3%      /* Shadow base */
--background-start: 225 27% 6%        /* Gradient start */
--background: 225 27% 6%              /* Main background */
--background-end: 225 22% 11%         /* Gradient end */

/* Card & UI Surfaces */
--card: 225 20% 12%                   /* Solid card */
--card-glass: 225 20% 12% / 0.4       /* Glass card 40% */
--popover: 225 20% 10%                /* Popover */
--input: 225 20% 15%                  /* Input background */
--muted: 225 15% 15%                  /* Muted background */
--secondary: 225 15% 18%              /* Secondary surface */

/* Borders & Dividers */
--border: 225 20% 20%                 /* Standard border */
--border-glass: 225 20% 20% / 0.5     /* Glass border 50% */

/* Gold Premium Accents */
--primary: 43 64% 53%                 /* Main gold #D4AF37 */
--primary-light: 43 70% 60%           /* Light gold */
--primary-dark: 43 60% 45%            /* Dark gold */

/* Text Colors */
--foreground: 0 0% 96%                /* Main text #F5F5F5 */
--primary-foreground: 225 27% 6%      /* Text on gold */
--secondary-foreground: 0 0% 96%      /* Text on secondary */
--muted-foreground: 0 0% 60%          /* Muted text #9A9A9A */
--card-foreground: 0 0% 96%           /* Text on cards */
--popover-foreground: 0 0% 96%        /* Text on popovers */

/* Functional Colors */
--destructive: 0 84% 60%              /* Error red */
--destructive-foreground: 0 0% 98%    /* Text on error */
--success: 142 76% 36%                /* Success green */
--success-foreground: 0 0% 98%        /* Text on success */
--warning: 43 96% 56%                 /* Warning amber */
--warning-foreground: 225 27% 6%      /* Text on warning */
--info: 217 91% 60%                   /* Info blue */
--info-foreground: 0 0% 98%           /* Text on info */

/* Interactive States */
--ring: 43 64% 53%                    /* Focus ring (gold) */
--accent: 43 64% 53%                  /* Accent (gold) */
--accent-foreground: 225 27% 6%       /* Text on accent */
```

---

## 📱 Platform-Specific Adjustments

### iOS Specific
```css
/* Status bar color */
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

/* Disable text size adjustment */
-webkit-text-size-adjust: 100%

/* Smooth font rendering */
-webkit-font-smoothing: antialiased
-moz-osx-font-smoothing: grayscale

/* Remove tap highlight */
-webkit-tap-highlight-color: transparent
```

### Android Specific
```css
/* Theme color for address bar */
<meta name="theme-color" content="#0E0E14">

/* Disable text inflation */
text-size-adjust: none
```

---

## 🎁 Bonus: Copy-Paste Tailwind Classes

### Common Layout Patterns
```css
/* Page Container */
className="flex flex-col h-full px-6 py-12 animate-fade-in"

/* Glass Card */
className="glass-card rounded-2xl p-6 space-y-4"

/* Gold Button */
className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 active:scale-98 transition-all"

/* OTP Input */
className="h-14 w-12 text-center text-2xl font-bold rounded-xl border-2 border-border bg-card text-foreground focus:border-primary focus:scale-105 transition-all"

/* Bottom Nav Item (Active) */
className="flex flex-col items-center gap-1 text-primary"

/* Bottom Nav Item (Inactive) */
className="flex flex-col items-center gap-1 text-muted-foreground"

/* Subscription Card */
className="glass-card rounded-2xl p-4 border border-border hover:border-primary hover:gold-glow transition-all"

/* Status Badge Active */
className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500"

/* Status Badge Expired */
className="px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive"

/* Floating Action Button */
className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center gold-glow hover:scale-110 active:scale-95 transition-all z-40"
```

---

## 🏁 Implementation Checklist

### Setup Phase
- [ ] Install Capacitor dependencies
- [ ] Configure capacitor.config.ts
- [ ] Set up dark theme variables in index.css
- [ ] Configure Tailwind with custom colors
- [ ] Add fonts to index.html
- [ ] Set up safe areas for iOS/Android

### Core Components
- [ ] Create MobileLayout wrapper
- [ ] Build Bottom Navigation
- [ ] Create Logo component
- [ ] Add Back Button component
- [ ] Build OTP input component
- [ ] Set up Toast notifications

### Pages
- [ ] Welcome page with phone input
- [ ] OTP verification page
- [ ] Profile setup page
- [ ] Dashboard with tabs
- [ ] Settings page

### Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Verify OTP flow (with hardcoded value)
- [ ] Check touch targets (min 44px)
- [ ] Validate color contrast
- [ ] Test animations and transitions

---

## 📚 Additional Resources

### Tailwind CSS
- Custom color palette: All HSL values
- Custom animations: fade-in, scale-in, pulse-gold, shimmer, shake
- Custom utilities: glass-card, gold-glow, bg-gradient-background

### Capacitor
- Config file: capacitor.config.ts
- Hot reload enabled
- iOS & Android platforms supported

### Design Philosophy
- **Premium Feel**: Gold accents on dark navy
- **Mobile First**: Optimized for 320px - 448px
- **Glass Morphism**: Subtle transparency with blur
- **Bold Typography**: Clear hierarchy with gold emphasis
- **Smooth Animations**: GPU-accelerated transitions

---

## ⚡ Quick Copy: Complete CSS Variables

```css
:root {
  /* Backgrounds */
  --background-start: 225 27% 6%;
  --background-end: 225 22% 11%;
  --background: 225 27% 6%;
  --foreground: 0 0% 96%;
  
  /* Surfaces */
  --card: 225 20% 12%;
  --card-foreground: 0 0% 96%;
  --popover: 225 20% 10%;
  --popover-foreground: 0 0% 96%;
  
  /* Gold Premium */
  --primary: 43 64% 53%;
  --primary-foreground: 225 27% 6%;
  --accent: 43 64% 53%;
  --accent-foreground: 225 27% 6%;
  
  /* Secondary */
  --secondary: 225 15% 18%;
  --secondary-foreground: 0 0% 96%;
  --muted: 225 15% 15%;
  --muted-foreground: 0 0% 60%;
  
  /* Functional */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  
  /* UI */
  --border: 225 20% 20%;
  --input: 225 20% 15%;
  --ring: 43 64% 53%;
  --radius: 1.25rem;
  
  /* Effects */
  --gradient-primary: linear-gradient(135deg, hsl(43 64% 53%) 0%, hsl(43 70% 60%) 100%);
  --gradient-background: linear-gradient(180deg, hsl(225 27% 6%) 0%, hsl(225 22% 11%) 100%);
  --shadow-glow: 0 0 40px hsl(43 64% 53% / 0.15);
  --shadow-card: 0 10px 40px -10px hsl(225 27% 3% / 0.5);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

**END OF STYLING PROMPT**

This prompt contains every detail needed to replicate the LeakLock Gold Guard mobile app styling, including hardcoded OTP values for testing. All colors are in HSL format, all measurements are specified, and complete component styling is documented.
