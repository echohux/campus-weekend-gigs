import cloudbase from '@cloudbase/js-sdk';

// 云开发环境 ID。envId 不是密钥（Web SDK 本就会暴露在前端），
// 为了让 GitHub Pages 线上直接可用，这里直接写死；安全由「安全域名白名单 + 数据库规则」保证。
// 本地可用 .env.local 的 VITE_TCB_ENV_ID 覆盖。
export const ENV_ID = import.meta.env.VITE_TCB_ENV_ID || 'hxy-d6gkkkkyhe447e9dd';

// region 需与你的云开发环境所在地域一致，不传默认上海（ap-shanghai）。
// 若环境在广州等其它地域，请在 .env.local 设置 VITE_TCB_REGION。
const REGION = import.meta.env.VITE_TCB_REGION;

export const app = cloudbase.init(REGION ? { env: ENV_ID, region: REGION } : { env: ENV_ID });

export const auth = app.auth();

// 发送邮箱验证码，返回 verification 对象（含 verification_id 与 is_user）
export async function sendCode(email) {
  return auth.getVerification({ email: String(email).trim() });
}

// 校验验证码并登录/注册。已注册走登录，未注册走注册（注册成功后自动登录）。
// 返回 { uid, isNewUser }
export async function loginOrRegister({ email, code, verification }) {
  const account = String(email).trim();
  const verifyRes = await auth.verify({
    verification_id: verification.verification_id,
    verification_code: code,
  });

  if (verification.is_user) {
    await auth.signIn({
      username: account,
      verification_token: verifyRes.verification_token,
    });
  } else {
    await auth.signUp({
      email: account,
      verification_code: code,
      verification_token: verifyRes.verification_token,
    });
  }

  return { uid: auth.currentUser?.uid, isNewUser: !verification.is_user };
}

// 退出登录
export async function logout() {
  try {
    await auth.signOut();
  } catch {
    /* ignore */
  }
}

// 读取当前登录用户（未登录返回 null）
export function getCurrentUser() {
  return auth.currentUser || null;
}
