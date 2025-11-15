# LeakLock Gold Guard - Complete Recreation Prompt

Use this prompt to recreate the LeakLock Gold Guard mobile app from scratch in Lovable.

---

## Initial Prompt

Create a premium mobile subscription tracking app called "LeakLock Gold Guard" for iOS and Android using React, TypeScript, Capacitor, Tailwind CSS, and Lovable Cloud (Supabase backend).

### App Overview
- **Purpose**: Track recurring subscriptions, detect new subscriptions from SMS, get AI assistance for managing subscriptions, and integrate with n8n automation workflows
- **Target Platform**: Mobile app (iOS & Android) via Capacitor
- **Theme**: Premium dark theme with gold accents (#D4AF37)

### Core Features Required

1. **Authentication System**
   - Phone number OTP-based authentication (hardcoded OTP: "123456" for testing)
   - Country code: +91 (hardcoded)
   - Auto-confirm email signups enabled

   - Profile setup with name and email after OTP verification

2. **Subscription Management**
   - Dashboard showing all subscriptions with status badges (Active/Paused/Cancelled)
   - Manual subscription addition
   - Subscription editing and deletion
   - Status changes (Active/Pause/Cancel/Renew)
   - Expiry notifications

3. **SMS Sync Feature**
   - Permission request page for SMS access
   - Detect subscriptions from SMS messages
   - Confirmation page to review detected subscriptions before adding
   - Auto-sync functionality

4. **AI Assistant**
   - Chat interface for subscription management help
   - Understands intents: cancel, pause, renew subscriptions
   - Provides step-by-step instructions
   - Links to provider management pages
   - Support for Netflix, Spotify, Amazon Prime, YouTube Premium

5. **n8n Webhook Integration**
   - Settings page to configure n8n webhook URL
   - Manual trigger to send subscription data to n8n
   - Webhook management (enable/disable)

### Database Schema

Create these tables with RLS policies:

**subscriptions table:**
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- name (text, not null)
- amount (numeric, not null)
- currency (text, default 'INR')
- billing_cycle (text, not null) - values: 'monthly', 'quarterly', 'yearly'
- next_billing_date (date, not null)
- status (text, default 'active') - values: 'active', 'paused', 'cancelled'
- category (text)
- provider (text)
- notes (text)
- payment_method (text)
- auto_renew (boolean, default true)
- reminder_days (integer, default 3)
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

RLS Policies:
- Users can view their own subscriptions
- Users can insert their own subscriptions
- Users can update their own subscriptions
- Users can delete their own subscriptions
```

**n8n_webhooks table:**
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- webhook_url (text, not null)
- is_active (boolean, default true)
- last_triggered_at (timestamptz)
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

RLS Policies:
- Users can view their own webhooks
- Users can insert their own webhooks
- Users can update their own webhooks
- Users can delete their own webhooks
```

**profiles table:**
```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users, unique)
- phone_number (text)
- full_name (text)
- email (text)
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

RLS Policies:
- Users can view their own profile
- Users can insert their own profile
- Users can update their own profile
```

### Pages & Routes

1. **Welcome Page** (`/`) - Landing page with app branding and "Get Started" button
2. **OTP Page** (`/otp`) - Phone number input and OTP verification (hardcoded OTP: "123456")
3. **Profile Setup** (`/profile-setup`) - Name and email collection after OTP
4. **Dashboard** (`/dashboard`) - Main page showing all subscriptions
5. **Add Manual** (`/add-manual`) - Form to manually add subscription
6. **Edit Subscription** (`/edit-subscription/:id`) - Edit existing subscription
7. **SMS Permission** (`/sms-permission`) - Request SMS access permission
8. **Auto Sync** (`/auto-sync`) - Configure SMS sync settings
9. **Confirm Detected** (`/confirm-detected`) - Review subscriptions detected from SMS
10. **LLM Assistant** (`/llm-assistant`) - AI chat interface for subscription help
11. **Settings** (`/settings`) - App settings and n8n webhook configuration
12. **N8n Webhooks** (`/n8n-webhooks`) - Configure n8n webhook URL

### UI/CSS Styling Specifications

**Color Palette (ALL HSL values):**
```css
/* Dark Premium Theme */
--background-start: 225 27% 6%;        /* #0E0E14 navy-black */
--background-end: 225 22% 11%;         /* #101728 navy */
--background: 225 27% 6%;
--foreground: 0 0% 96%;                /* #F5F5F5 off-white */

--card: 225 20% 12%;                   /* Glassy dark card */
--card-foreground: 0 0% 96%;

/* Gold Premium Accent */
--primary: 43 64% 53%;                 /* #D4AF37 gold */
--primary-foreground: 225 27% 6%;      /* Dark text on gold */

--secondary: 225 15% 18%;              /* Subtle grey-navy */
--secondary-foreground: 0 0% 96%;

--muted: 225 15% 15%;
--muted-foreground: 0 0% 60%;          /* #9A9A9A grey */

--accent: 43 64% 53%;                  /* Gold accent */
--accent-foreground: 225 27% 6%;

--destructive: 0 84% 60%;
--destructive-foreground: 0 0% 98%;

--border: 225 20% 20%;                 /* Subtle gold tint */
--input: 225 20% 15%;
--ring: 43 64% 53%;                    /* Gold focus ring */

--radius: 1.25rem;                     /* 20px rounded corners */

/* Gradients */
--gradient-primary: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(43 70% 60%) 100%);
--gradient-background: linear-gradient(180deg, hsl(var(--background-start)) 0%, hsl(var(--background-end)) 100%);

/* Shadows - gold glow */
--shadow-glow: 0 0 40px hsl(var(--primary) / 0.15);
--shadow-card: 0 10px 40px -10px hsl(225 27% 3% / 0.5);

/* Animations */
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**Typography:**
- Font family: system-ui, -apple-system, sans-serif
- Headings: font-bold, text sizes: text-2xl, text-xl, text-lg
- Body: font-normal, text-base (16px)
- Muted text: text-muted-foreground
- Primary text: text-primary
- Foreground text: text-foreground

**Border Radius:**
- Base: 1.25rem (20px)
- Cards: rounded-[--radius]
- Buttons: rounded-[--radius]
- Inputs: rounded-lg

**Component Styles:**

*Buttons:*
- Default: bg-gradient-primary, text-primary-foreground, gold-glow on hover
- Outline: border-primary/30, text-foreground, hover:bg-primary/10
- Ghost: text-foreground, hover:bg-secondary/50

*Input Fields:*
- Standard: bg-input, border-border/30, text-foreground, focus:ring-primary
- OTP Input: 6 boxes, h-12 w-10, border-primary/30, rounded-lg, text-center, text-lg font-bold

*Cards:*
- Glass effect: glass-card class (bg-card/40 backdrop-blur-xl border border-border/50)
- Subscription cards: glass-card p-4 rounded-[--radius] gold-glow-on-active

*Bottom Navigation:*
- Fixed bottom, bg-background/95 backdrop-blur-lg
- Border-t border-primary/20
- Active icon: text-primary with gold-glow
- Inactive icon: text-muted-foreground
- Icons: Home, Plus, Settings (24px size)
- Height: h-16

*Badges:*
- Active: bg-primary/20 text-primary border-primary/30
- Paused: bg-yellow-500/20 text-yellow-400 border-yellow-500/30
- Cancelled: bg-destructive/20 text-destructive border-destructive/30

**Animations:**
```css
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 20px hsl(var(--primary) / 0.3); }
  50% { box-shadow: 0 0 30px hsl(var(--primary) / 0.5); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

**Layout:**
- MobileLayout component wrapper: min-h-screen bg-gradient-background
- Max width: max-w-md
- Page padding: p-6
- Component spacing: gap-4, space-y-4
- Safe area bottom: pb-20 (for bottom nav)

### Component Requirements

**MobileLayout Component:**
- Wrapper with min-h-screen, max-w-md, bg-gradient-background
- Shadow-2xl, relative, overflow-hidden

**BottomNav Component:**
- Fixed bottom navigation
- Icons: Home (/dashboard), Plus (/add-manual), Settings (/settings)
- Active state with gold glow
- Glass morphism effect

**Logo Component:**
- Shield with lock icon (Shield + Lock from lucide-react)
- Gold color with glow effect
- Text: "LeakLock Gold Guard"

**BackButton Component:**
- ArrowLeft icon (lucide-react)
- Position: top-left of pages
- Glass effect background

**EditSubscriptionSheet:**
- Bottom sheet for editing subscriptions
- Form with all subscription fields
- Status change buttons

**ConfirmActionSheet:**
- Confirmation dialog for delete/status changes
- Glass card styling

**StatusChangeSheet:**
- Bottom sheet for changing subscription status
- Options: Active, Paused, Cancelled, Renew

**ExpiryNotificationModal:**
- Modal showing subscriptions expiring soon
- Reminder days configuration

### Edge Functions

**subscription-assistant:**
- AI-powered assistant using Lovable AI (gemini-2.5-flash model)
- Understands: cancel, pause, renew intents
- Provider info for: Netflix, Spotify, Amazon Prime, YouTube Premium
- Returns: instructions, provider URLs, detected action/service

```typescript
// Provider info structure
{
  netflix: {
    name: "Netflix",
    canPause: false,
    cancelSteps: [...],
    renewSteps: [...],
    url: "https://www.netflix.com/youraccount"
  },
  // ... other providers
}
```

**trigger-n8n-webhook:**
- Sends subscription data to configured n8n webhook
- Payload includes: webhook_url, subscriptions array, user_id, triggered_at

### Hardcoded Values for Testing

```typescript
// OTP Verification
const HARDCODED_OTP = "123456";
const COUNTRY_CODE = "+91";

// Test Subscriptions (for demo)
const TEST_SUBSCRIPTIONS = [
  {
    name: "Netflix Premium",
    amount: 649,
    currency: "INR",
    billing_cycle: "monthly",
    next_billing_date: "2025-02-15",
    status: "active",
    provider: "Netflix"
  },
  {
    name: "Spotify Premium",
    amount: 119,
    currency: "INR",
    billing_cycle: "monthly",
    next_billing_date: "2025-02-10",
    status: "active",
    provider: "Spotify"
  }
];
```

### Authentication Flow

1. User enters phone number on OTP page
2. Format to E.164: `+91${phoneNumber}`
3. Click "Send OTP" (use hardcoded OTP for now)
4. Display 6-digit OTP input boxes
5. Auto-submit when 6 digits entered
6. Verify with hardcoded "123456"
7. Redirect to profile setup
8. Collect name and email
9. Create profile in database
10. Redirect to dashboard

### Mobile-Specific Features

**Capacitor Configuration:**
```typescript
{
  appId: 'app.lovable.leaklock',
  appName: 'LeakLock Gold Guard',
  webDir: 'dist',
  server: {
    cleartext: true
  }
}
```

**Safe Areas:**
- iOS safe area insets
- Bottom padding for navigation (pb-20)

**Touch Targets:**
- Minimum 44px × 44px for all interactive elements

**Haptic Feedback:**
- On button clicks (if supported by Capacitor)

**Performance:**
- Lazy loading for images
- Skeleton loading states
- Optimistic UI updates

### Icons (Lucide React)

Use these icons throughout the app:
- Shield, Lock (Logo)
- Home, Plus, Settings (Bottom Nav)
- ArrowLeft (Back button)
- Calendar, DollarSign (Subscription cards)
- MessageSquare (AI Assistant)
- Webhook (n8n integration)
- Pause, Play, X, RotateCcw (Status buttons)
- Bell (Notifications)

### Accessibility

- WCAG AA compliant contrast ratios
- Focus indicators (ring-primary)
- Touch targets minimum 44px
- Semantic HTML
- ARIA labels where needed

### Additional Features

**Toast Notifications:**
- Success: bg-primary/20 text-primary
- Error: bg-destructive/20 text-destructive
- Info: bg-secondary/20 text-foreground
- Position: bottom-center

**Loading States:**
- Spinner with gold color
- Skeleton loading (shimmer animation)
- Button loading states

**Form Validation:**
- Required field validation
- Amount must be positive number
- Date must be in future
- URL validation for webhook

### Development Notes

1. Enable Lovable Cloud for backend
2. Enable auto-confirm email signups in auth settings
3. Use Lovable AI for subscription-assistant edge function
4. All colors must be HSL format
5. Use semantic tokens from design system
6. Mobile-first responsive design
7. Glass morphism effects throughout
8. Gold glow on interactive elements

---

## Implementation Order

1. Set up Lovable Cloud and database schema
2. Create MobileLayout and BottomNav components
3. Build Welcome and OTP pages with hardcoded values
4. Implement Profile Setup page
5. Create Dashboard with subscription list
6. Build Add Manual subscription form
7. Implement Edit and Status change functionality
8. Add SMS Permission and Auto Sync pages
9. Create LLM Assistant with edge function
10. Build Settings and n8n webhook configuration
11. Add toast notifications and loading states
12. Implement Capacitor configuration
13. Test all flows end-to-end

---

## Final Polish

- Ensure all animations are smooth (--transition-smooth)
- Add gold glow effects on hover/active states
- Test dark theme consistency
- Verify mobile touch targets
- Check safe area handling on iOS/Android
- Test OTP flow with hardcoded value
- Verify all database RLS policies
- Test n8n webhook integration

---

Copy this entire prompt and paste it into a new Lovable project to recreate LeakLock Gold Guard!
