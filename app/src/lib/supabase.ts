import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config';

// 前端使用的 Supabase 客户端（Anon Key，权限受限）
export const supabase = createClient(
  SUPABASE_CONFIG.URL,
  SUPABASE_CONFIG.ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// 用户 Profile 类型
export interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'member';
  is_active: boolean;
  created_at: string;
}

// 获取当前用户的 profile
export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
  let uid = userId;
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    uid = user.id;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .maybeSingle();

  if (error) {
    console.error('getUserProfile error:', error.message);
    return null;
  }
  return data as UserProfile | null;
}

// 监听 auth 状态变化
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// 调用 Edge Function 代理 Dify API（Key 藏在云端）
export async function callDifyChat(query: string) {
  return supabase.functions.invoke('dify-chat', {
    body: { query },
  });
}
