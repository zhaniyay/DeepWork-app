# Task Status and Filtering Fix Plan

## 🐛 **Issues Identified**

### **1. Status Value Mismatch**
- **TaskStatus.IN_PROGRESS** = `'in-progress'` (with hyphen)
- **Filter logic** might be checking for `'in_progress'` (with underscore)
- **Inconsistent status values** between creation and filtering

### **2. Filter Logic Problems**
- Filter counts don't update when task status changes
- Status filtering doesn't properly match the defined status values
- No real-time updates when tasks are modified

### **3. Status Update Flow Issues**
- When "Start Task" is clicked, status should change from `'pending'` to `'in-progress'`
- Filter counts should update automatically
- UI should reflect the new status immediately

## 🔧 **Comprehensive Fix Plan**

### **Phase 1: Fix Status Values and Consistency**

1. **Standardize Status Values**
   - Ensure all status values use consistent format
   - Update any hardcoded status strings
   - Verify TaskStatus enum matches usage

2. **Fix Filter Logic**
   - Update filter conditions to use correct status values
   - Ensure real-time updates when tasks change
   - Add proper state management for filter counts

3. **Improve Status Update Flow**
   - Ensure status changes trigger UI updates
   - Add proper error handling for status updates
   - Implement optimistic updates for better UX

### **Phase 2: Enhanced Task Management**

4. **Add Status Transition Logic**
   - Validate status transitions (pending → in-progress → completed)
   - Add status change timestamps
   - Implement status change history

5. **Improve Filter Performance**
   - Memoize filter calculations
   - Add proper state updates
   - Implement efficient re-rendering

6. **Add Visual Feedback**
   - Show loading states during status changes
   - Add success/error notifications
   - Implement smooth transitions

### **Phase 3: Advanced Features**

7. **Add Task Statistics**
   - Real-time task counts by status
   - Progress tracking
   - Time spent on tasks

8. **Implement Smart Filtering**
   - Auto-filter based on current focus session
   - Smart task suggestions
   - Priority-based filtering

## 🎯 **Implementation Details**

### **Status Values to Use:**
```typescript
const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',  // Note: hyphen, not underscore
  COMPLETED: 'completed',
  DEFERRED: 'deferred',
} as const;
```

### **Filter Logic Fix:**
```typescript
const filteredTasks = tasks.filter(task => {
  if (filter === 'all') return true;
  return task.status === filter; // Use exact status values
});
```

### **Status Update Flow:**
1. User clicks "Start Task" in menu
2. `markTaskInProgress(taskId)` is called
3. Task status changes from `'pending'` to `'in-progress'`
4. UI updates automatically
5. Filter counts recalculate
6. Task appears in "In Progress" filter

### **Real-time Updates:**
- Use Zustand store updates to trigger re-renders
- Implement proper state management
- Add loading states for better UX

## 📋 **Files to Modify**

1. **`src/stores/taskStore.ts`** - Fix status update logic
2. **`app/(main)/tasks/index.tsx`** - Fix filter logic and counts
3. **`src/components/TaskList.tsx`** - Improve status update handling
4. **`src/types/task.ts`** - Verify status values consistency

## 🚀 **Expected Results**

After implementation:
- ✅ Tasks move correctly between status filters
- ✅ Real-time filter count updates
- ✅ Proper status transitions
- ✅ Better user experience
- ✅ Consistent status values throughout app

## 🧪 **Testing Plan**

1. **Create a task** → Should appear in "Pending"
2. **Start a task** → Should move to "In Progress"
3. **Complete a task** → Should move to "Completed"
4. **Filter counts** → Should update automatically
5. **Status persistence** → Should maintain status after app restart

---

**Status: Ready for Implementation**
**Priority: High**
**Estimated Time: 2-3 hours** 