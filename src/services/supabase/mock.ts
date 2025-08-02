// Mock Supabase client for development
export const createMockSupabase = () => ({
  auth: {
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: null,
    }),
    signUp: async () => ({
      data: { user: null, session: null },
      error: null,
    }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({
      data: { user: null },
      error: null,
    }),
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
});

export const mockSupabase = createMockSupabase(); 