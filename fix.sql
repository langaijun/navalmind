-- 1. 先查看 auth.users 里你创建的账号
select id, email, created_at from auth.users;

-- 2. 查看 profiles 表（可能为空或关联了错误的邮箱）
select * from profiles;

-- 3. 如果 profiles 里没有记录，执行这条插入（邮箱用实际的 .cn）
-- insert into profiles (id, name, role, is_active)
-- select id, 'Admin', 'admin', true
-- from auth.users
-- where email = 'admin@xile2026.cn';
