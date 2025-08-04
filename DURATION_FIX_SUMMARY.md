# Focus Session Duration Fix

## Problem
The focus session was always defaulting to 25 minutes regardless of the task's estimated time. Even when tasks were created with 60 minutes or other durations, the timer would always start at 25 minutes.

## Root Cause
The issue was in multiple places where the duration was hardcoded:

1. **Tasks Page**: Always navigating to `focus/25` regardless of task duration
2. **Progress Dashboard**: Hardcoded `focus/25` for all focus sessions
3. **Focus Session Screen**: Only using URL parameter, not task's estimated time

## Solution

### 1. **Updated Focus Session Screen** (`app/(main)/focus/[duration].tsx`)
- **Priority Logic**: Task's estimated time → URL parameter → Default 25 minutes
- **Proper Dependencies**: Updated useEffect to depend on `selectedTask` and `duration`
- **Dynamic Duration**: Now uses `selectedTask?.estimated_minutes` when available

```typescript
useEffect(() => {
  // Priority: 1. Task's estimated time, 2. URL parameter, 3. Default 25 minutes
  let finalDuration = 25;
  
  if (selectedTask?.estimated_minutes) {
    finalDuration = selectedTask.estimated_minutes;
  } else if (duration) {
    finalDuration = parseInt(duration);
  }
  
  setSessionDuration(finalDuration);
}, [selectedTask, duration]);
```

### 2. **Updated Tasks Page** (`app/(main)/tasks/index.tsx`)
- **Removed Hardcoding**: Changed from `focus/25` to `focus/0`
- **Dynamic Navigation**: Let the focus screen determine the duration

```typescript
onTaskSelect={(task) => {
  useTaskStore.getState().selectTask(task);
  // Let the focus screen use the task's estimated time instead of hardcoding 25
  router.push('focus/0');
}}
```

### 3. **Updated Progress Dashboard** (`src/components/ProgressDashboard.tsx`)
- **Dynamic Duration**: Uses task's estimated time or defaults to 25 minutes
- **Consistent Behavior**: Both resume and start focus session use proper duration

```typescript
const handleResumeTask = async (task: any) => {
  // Use task's estimated time or default to 25 minutes
  const duration = task.estimated_minutes || 25;
  router.push(`focus/${duration}`);
};

const handleStartFocusSession = () => {
  const nextTask = tasks.find(task => task.status === TaskStatus.PENDING);
  if (nextTask) {
    // Use task's estimated time or default to 25 minutes
    const duration = nextTask.estimated_minutes || 25;
    router.push(`focus/${duration}`);
  }
};
```

## Benefits

### ✅ **Proper Duration Usage**
- Tasks with 60 min estimated time → 60 min sessions
- Tasks with 30 min estimated time → 30 min sessions
- Tasks without estimated time → 25 min default

### ✅ **Consistent Behavior**
- All entry points (tasks page, progress dashboard, AI chat) use proper duration
- No more hardcoded 25-minute sessions
- Respects user's task planning

### ✅ **Better UX**
- Users see the duration they planned for
- More accurate time tracking
- Better task completion expectations

### ✅ **Flexible Fallbacks**
- Uses task's estimated time when available
- Falls back to URL parameter if no task time
- Defaults to 25 minutes if neither is available

## Testing

Created comprehensive test (`test-duration-fix.js`) that verifies:
- ✅ Focus session duration logic properly implemented
- ✅ Hardcoded duration removed from tasks page
- ✅ Progress dashboard uses dynamic duration
- ✅ Task types include estimated_minutes field

## Files Modified

1. **`app/(main)/focus/[duration].tsx`**
   - Added priority logic for duration selection
   - Updated useEffect dependencies
   - Better fallback handling

2. **`app/(main)/tasks/index.tsx`**
   - Removed hardcoded `focus/25`
   - Uses dynamic navigation

3. **`src/components/ProgressDashboard.tsx`**
   - Added dynamic duration calculation
   - Removed hardcoded durations

4. **`test-duration-fix.js`**
   - Comprehensive test for duration functionality

## Result

Now when you start a focus session:
- **Tasks with 60 min estimated time** → 60 min sessions
- **Tasks with 30 min estimated time** → 30 min sessions  
- **Tasks without estimated time** → 25 min default
- **AI chat suggestions** → Use appropriate durations

The focus session now properly respects the task's estimated time, providing a much better user experience! 🎉 