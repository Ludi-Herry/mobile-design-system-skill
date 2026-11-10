import React, { useState } from "react";
import { Home, Compass, Bell, User } from "lucide-react";

/**
 * 移动端标准 TabBar 应用外壳模板 (Mobile TabBar App Shell)
 * 严格遵循 Ludi Mobile Design System 规范：
 * - 3 到 5 个标准槽位，保证每个 Tab 触控区域达到 44x44pt
 * - 底部安全区 Home Indicator 避让 (83pt iOS / 80dp Android)
 * - 消息徽标区分：时效性数字与弱通知小红点
 * - 顶部 Status Bar 物理避让
 */

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | "dot";
}

export const MobileTabBarAppShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("home");

  const TABS: TabItem[] = [
    { id: "home", label: "工作台", icon: <Home className="w-5 h-5" /> },
    { id: "explore", label: "数据洞察", icon: <Compass className="w-5 h-5" /> },
    { id: "message", label: "通知中心", icon: <Bell className="w-5 h-5" />, badge: 3 },
    { id: "profile", label: "个人主页", icon: <User className="w-5 h-5" />, badge: "dot" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* 模拟移动端真机尺寸外壳 (390pt) */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative overflow-hidden">
        {/* 1. 主内容区（底部预留 TabBar 高度与安全区） */}
        <main className="flex-1 overflow-y-auto pb-[calc(50px+env(safe-area-inset-bottom,34px))]">
          {children || (
            <div className="p-5 pt-[calc(24px+env(safe-area-inset-top,20px))] space-y-4">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">移动端协同控制台</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                当前视图演示了基于 iOS 与 Android 核心规范构建的 TabBar 壳层架构。
              </p>
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 space-y-1">
                <span className="text-xs font-semibold text-blue-900">活跃 Tab: {activeTab}</span>
                <p className="text-[11px] text-blue-700">
                  点击底部导航可平滑无闪烁切换视图，底部已自动避让全面屏 Home Indicator。
                </p>
              </div>
            </div>
          )}
        </main>

        {/* 2. 底部常驻标签栏 (TabBar / BottomNavigation) */}
        <nav
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-slate-200/70 z-50 flex items-center justify-around px-2 pt-1 pb-[env(safe-area-inset-bottom,34px)] h-[calc(50px+env(safe-area-inset-bottom,34px))]"
          role="tablist"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 h-11 flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                  isActive ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {/* 图标与微小徽标 */}
                <div className="relative">
                  {tab.icon}
                  {/* 数字徽标（向左单向膨胀，>99 收敛） */}
                  {typeof tab.badge === "number" && (
                    <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </span>
                  )}
                  {/* 小红点徽标 */}
                  {tab.badge === "dot" && (
                    <span className="absolute top-0 -right-1 w-2 h-2 rounded-full bg-rose-500 border border-white" />
                  )}
                </div>

                {/* 标签文字 */}
                <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
