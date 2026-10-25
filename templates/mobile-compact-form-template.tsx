import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";

/**
 * 移动端紧凑表单向导模板 (Mobile Compact Form Template)
 * 严格遵循 Ludi Mobile Design System 规范：
 * - 软键盘防遮挡：输入框聚焦自动居中滚动 (scrollIntoView)
 * - 精准 inputmode 映射：手机号 tel、验证码 numeric、密码 password
 * - 底部垫高安全缓冲区 (320px) 防 fixed 键盘挤压
 * - 底部全宽行动点 (Full-width Primary CTA) 拇指舒适区布局
 */

export const MobileCompactFormTemplate: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 输入框聚焦防遮挡居中处理
  const handleFocusCenter = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("请先勾选同意服务协议与隐私条款");
      return;
    }
    alert("验证成功并进入系统！");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-xl relative overflow-hidden">
        {/* 一、顶部安全区与返回栏 */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 pt-[env(safe-area-inset-top,20px)]">
          <div className="h-11 px-4 flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="w-11 h-11 -ml-2 flex items-center justify-center text-slate-700 active:opacity-60"
              aria-label="返回上一级"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xs font-semibold text-slate-800">安全准入认证</h1>
            <div className="w-11" />
          </div>
        </header>

        {/* 二、表单内容主体 (底部增加键盘垫高缓冲内边距) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 pb-80 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">绑定企业管理员手机</h2>
            <p className="text-xs text-slate-500">完成双重认证后即可启用远程设备指令下发权限。</p>
          </div>

          <div className="space-y-4 pt-2">
            {/* 1. 手机号码 (精确匹配 tel 键盘) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                手机号码 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="请输入11位大陆手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={handleFocusCenter}
                  maxLength={11}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* 2. 短信验证码 (精确匹配 numeric 键盘 + 系统一次性短信验证码自动填充) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                短信验证码 <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6位数字"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onFocus={handleFocusCenter}
                  maxLength={6}
                  className="flex-1 h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 tracking-widest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => alert("验证码已模拟发送至手机")}
                  className="px-4 h-11 rounded-xl text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 active:scale-98 transition whitespace-nowrap"
                >
                  获取验证码
                </button>
              </div>
            </div>

            {/* 3. 独立安全密码 */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">设置独立操作密码</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="8-20位字符，包含字母与数字"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleFocusCenter}
                  className="w-full h-11 pl-3.5 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="w-11 h-11 absolute right-0 top-0 flex items-center justify-center text-slate-400 hover:text-slate-600"
                  aria-label="切换密码可见性"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 条款勾选 */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-500 leading-relaxed">
                  我已认真阅读并完全同意《企业云端指令安全下发规范》及《第三方隐私保密条款》。
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* 三、底部自然舒适区主行动栏 (避让 Home Indicator) */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/70 pb-[calc(14px+env(safe-area-inset-bottom,34px))] z-40">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full h-12 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            确认并完成绑定
          </button>
        </div>
      </div>
    </div>
  );
};
