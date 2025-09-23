# 🚀 VHealth Hackathon - Dev Task Breakdown

## 📋 Sprint Backlog (Priority Order)

### 🔐 **TASK 1: Authentication Setup** (1-2 hours)
**Owner:** Backend Dev
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Create `lib/supabase.js` with client config
- [ ] Set up Google OAuth in Supabase dashboard
- [ ] Create auth context/hooks for login/logout
- [ ] Test Gmail login flow

### 🗄️ **TASK 2: Database Schema** (1 hour)
**Owner:** Backend Dev
- [ ] Create tables in Supabase SQL editor:
  - `patients` table
  - `doctors` table  
  - `reports` table
  - `emergency_logs` table
- [ ] Set up RLS (Row Level Security) policies
- [ ] Create storage bucket for reports

### 👤 **TASK 3: User Registration Logic** (2 hours)
**Owner:** Full-stack Dev
- [ ] Auto-create patient/doctor records after Gmail auth
- [ ] Generate VHealth IDs (`VH-2025-0001`, `DOC-2025-0001`)
- [ ] Create user profile pages
- [ ] Handle role detection (patient vs doctor)

### 📁 **TASK 4: File Upload System** (2-3 hours)
**Owner:** Frontend + Backend Dev
- [ ] Install file upload library (or use native drag-drop)
- [ ] Create upload component with drag-drop
- [ ] Upload to Supabase Storage
- [ ] Save file metadata to `reports` table
- [ ] Display uploaded files in patient timeline

### 🤖 **TASK 5: AI Integration** (2 hours)
**Owner:** AI/Backend Dev
- [ ] Install Google AI: `npm install @google/generative-ai`
- [ ] Create AI service for medical summary
- [ ] Replace mock emergency data with real AI calls
- [ ] Format AI response for emergency view
- [ ] Test with sample medical reports

### 🚨 **TASK 6: Emergency Unlock Feature** (1-2 hours)
**Owner:** Full-stack Dev
- [ ] Create emergency unlock button (doctors only)
- [ ] Trigger AI summary on unlock
- [ ] Log emergency access to database
- [ ] Show emergency summary modal
- [ ] Add patient notification system

### 🔗 **TASK 7: Integration & Testing** (1-2 hours)
**Owner:** Team Lead
- [ ] Connect all components
- [ ] Test complete user flow
- [ ] Fix any auth/permission issues
- [ ] Verify file uploads work
- [ ] Test AI emergency unlock

---

## 🛠️ Quick Setup Commands

```bash
# Install dependencies
npm install @supabase/supabase-js @google/generative-ai

# Run development server
npm run dev
```

---

## 🎯 Demo Flow Checklist

- [ ] Patient Gmail login → VHealth ID generated
- [ ] Doctor Gmail login → Doctor ID generated  
- [ ] Doctor uploads report → appears in patient timeline
- [ ] Doctor triggers emergency unlock → AI summary shown
- [ ] Patient sees emergency log notification

---

## 🚨 Critical Files to Create/Modify

1. `lib/supabase.js` - Supabase client
2. `lib/auth.js` - Authentication logic
3. `lib/ai.js` - Google AI integration
4. `components/FileUpload.jsx` - Drag-drop upload
5. `components/EmergencyUnlock.jsx` - AI summary modal

---

## ⚡ Time Estimates
- **Total:** 8-12 hours
- **Core MVP:** 6-8 hours
- **Polish/Testing:** 2-4 hours

**Recommended team split:**
- 1 person on auth + database
- 1 person on file uploads + UI integration  
- 1 person on AI + emergency features