// Navalmind.cc — 全局配置文件
// ⚠️ 当前为测试模式：前端直连 Dify API
// 生产环境应使用 Supabase Edge Function 代理

export const SUPABASE_CONFIG = {
  URL: 'https://pqwlzouwmyusmqewwgyo.supabase.co',
  ANON_KEY: 'sb_publishable_qfZwL9jYiNyWtBV0e4sWVg_bRSawnjy',
  REST_URL: 'https://pqwlzouwmyusmqewwgyo.supabase.co/rest/v1',
} as const;

// 测试模式：直连 Dify（后续迁移到 Edge Function）
export const DIFY_CONFIG = {
  BASE_URL: 'http://121.41.214.47/v1',
  // API Key 暂时写在前端（测试用），生产环境必须移到云端
  API_KEY: 'app-o46EJZFIOOnP26dDXQFAgJQ7',
  USER_ID: 'navalmind-user',
} as const;
