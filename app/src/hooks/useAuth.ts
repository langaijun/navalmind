import { useState, useEffect, useCallback } from 'react';
import { supabase, type UserProfile } from '@/lib/supabase';

interface AuthState {
  user: unknown | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  const refreshState = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('getUser error:', userError.message);
        setState({ user: null, profile: null, isLoading: false, isAuthenticated: false, isAdmin: false });
        return;
      }
      if (!user) {
        setState({ user: null, profile: null, isLoading: false, isAuthenticated: false, isAdmin: false });
        return;
      }

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      console.log('profile query result:', { data, error });

      setState({
        user,
        profile: data as UserProfile | null,
        isLoading: false,
        isAuthenticated: !!data?.is_active,
        isAdmin: data?.role === 'admin',
      });
    } catch (err) {
      console.error('refreshState exception:', err);
      setState({ user: null, profile: null, isLoading: false, isAuthenticated: false, isAdmin: false });
    }
  }, []);

  useEffect(() => {
    refreshState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('auth state change:', _event, session?.user?.id);
      if (session?.user) {
        refreshState();
      } else {
        setState({ user: null, profile: null, isLoading: false, isAuthenticated: false, isAdmin: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshState]);

  const login = useCallback(async (email: string, password: string) => {
    console.log('开始登录:', email);

    // Step 1: signInWithPassword
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    console.log('signIn result:', { userId: signInData?.user?.id, error: signInError?.message });

    if (signInError) {
      throw new Error(`Supabase登录失败: ${signInError.message}`);
    }
    if (!signInData.user) {
      throw new Error('登录成功但未返回用户信息');
    }

    // Step 2: 用返回的 user.id 查 profile
    console.log('查询profile, userId:', signInData.user.id);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .maybeSingle();

    console.log('profile查询结果:', { profileData, error: profileError?.message });

    if (profileError) {
      throw new Error(`查询profile失败: ${profileError.message}`);
    }
    if (!profileData) {
      throw new Error('profile不存在：此用户没有profiles记录，请在Supabase SQL Editor执行INSERT');
    }
    if (!profileData.is_active) {
      await supabase.auth.signOut();
      throw new Error('此账号已被停用 (is_active=false)');
    }

    // 更新state
    setState({
      user: signInData.user,
      profile: profileData as UserProfile,
      isLoading: false,
      isAuthenticated: true,
      isAdmin: profileData.role === 'admin',
    });

    return { data: signInData, profile: profileData as UserProfile };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, profile: null, isLoading: false, isAuthenticated: false, isAdmin: false });
  }, []);

  return { ...state, login, logout, refreshState };
}
