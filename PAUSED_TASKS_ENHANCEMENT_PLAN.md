# Paused Tasks Enhancement Plan

## 🎯 **Requested Features to Implement**

### **1. Visible Resume Button on Paused Task Cards**
- Add "Resume" button next to badges on paused task cards
- Make "Paused" badge itself clickable
- Both actions change status to in-progress and update UI

### **2. Toast Notification on Pause**
- Show "Task paused." toast when task is paused
- Include inline "[Resume]" action in toast
- Clicking resume in toast immediately unpauses task

### **3. Paused Filter/Tab**
- Add "Paused" filter chip to tasks page
- Ensure paused tasks are clearly visible
- Don't hide paused tasks under "All" only

### **4. App Launch Banner**
- Show non-blocking banner on app launch if recently paused task
- Display: "You paused '<task name>'. Resume?"
- Include primary Resume button and dismiss option

### **5. Swipe Gesture**
- Enable swipe right on paused task cards to resume
- Show one-time hint about this gesture
- Make gesture accessible and intuitive

### **6. State Persistence**
- Ensure paused → in-progress transition is persisted
- Reflect changes immediately in UI/tabs
- Update all relevant components

### **7. Accessibility**
- Make all resume actions keyboard accessible
- Add proper screen reader support
- Ensure tab navigation works

### **8. Global Shortcut (Optional)**
- If only one task is paused and recent, show "Resume last paused" shortcut
- Make it unobtrusive but accessible

## 🔧 **Implementation Plan**

### **Phase 1: Core Resume Functionality**
1. Add visible resume button to paused task cards
2. Make paused badge clickable
3. Implement toast notifications
4. Add paused filter to tasks page

### **Phase 2: Enhanced UX**
1. Add app launch banner
2. Implement swipe gesture
3. Add accessibility features
4. Ensure state persistence

### **Phase 3: Polish & Optimization**
1. Add global shortcut
2. Implement gesture hints
3. Optimize performance
4. Add comprehensive testing

## 📋 **Files to Modify**

1. **`src/components/TaskList.tsx`** - Add resume button and badge click
2. **`app/(main)/tasks/index.tsx`** - Add paused filter
3. **`src/components/Toast.tsx`** - Create toast component
4. **`src/components/AppLaunchBanner.tsx`** - Create banner component
5. **`src/components/SwipeGesture.tsx`** - Create gesture component
6. **`src/stores/taskStore.ts`** - Add persistence and state management
7. **`src/utils/accessibility.ts`** - Add accessibility helpers

## 🎯 **Expected User Experience**

### **Paused Task Card:**
```
┌─────────────────────────────────────┐
│ 📝 Create an app                    │
│ Develop a new mobile application    │
│                                     │
│ [🔴 Priority: 80] [⏸️ Paused] [360m] │
│                                     │
│ [▶️ Resume]                         │ ← NEW BUTTON
└─────────────────────────────────────┘
```

### **Toast Notification:**
```
┌─────────────────────────────────────┐
│ Task paused. [Resume]              │
└─────────────────────────────────────┘
```

### **App Launch Banner:**
```
┌─────────────────────────────────────┐
│ You paused 'Create an app'. Resume? │
│ [Resume] [Dismiss]                  │
└─────────────────────────────────────┘
```

---

**Status: Ready for Implementation**
**Priority: High**
**Estimated Time: 6-8 hours** 