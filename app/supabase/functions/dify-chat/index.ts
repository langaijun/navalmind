// Supabase Edge Function: Dify API 代理
// Key 藏在云端环境变量，前端零暴露

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// CORS 响应头（允许你的前端域名调用）
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // 生产环境建议改为你的实际域名
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// 处理预检请求
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

Deno.serve(async (req) => {
  // CORS 预检
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    // 1. 从请求头获取用户的 JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '缺少 Authorization 头' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. 创建 Supabase 服务端客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 3. 验证用户身份
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. 检查用户 profile 是否 active
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_active, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: '用户资料不存在' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!profile.is_active) {
      return new Response(JSON.stringify({ error: '账号已停用' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. 读取前端传来的 query
    const body = await req.json();
    const { query, conversation_id = '' } = body;

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: '缺少 query 参数' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 6. 从环境变量读取 Dify API Key（绝不暴露给前端）
    const difyApiKey = Deno.env.get('DIFY_API_KEY');
    const difyBaseUrl = Deno.env.get('DIFY_BASE_URL') || 'http://121.41.214.47/v1';

    if (!difyApiKey) {
      return new Response(JSON.stringify({ error: '服务端配置错误：缺少 DIFY_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 7. 转发请求到 Dify API
    const difyResponse = await fetch(`${difyBaseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${difyApiKey}`,
      },
      body: JSON.stringify({
        inputs: {},
        query,
        response_mode: 'streaming',
        conversation_id,
        user: user.id,
        files: [],
      }),
    });

    // 8. 流式透传 Dify 的响应（SSE）
    return new Response(difyResponse.body, {
      status: difyResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '未知错误';
    console.error('Edge Function Error:', message);
    return new Response(JSON.stringify({ error: '服务端错误' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
