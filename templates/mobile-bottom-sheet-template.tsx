import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

/**
 * 移动端半屏抽屉实战代码模板 (Mobile Bottom Sheet Template)
 * 严格遵循 Ludi Mobile Design System 规范：
 * - 顶部拖拽指示条 (Drag Handle: 36x4pt)
 * - 三分屏高度阶梯 (30% / 60% / 80%)
 * - 底层 Body 滚动穿透彻底锁死
 * - 底部 Home Bar 安全区避让
 * - 禁用点击背景遮罩静默关闭（保证录入与高危确认安全）
 */

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  heightLevel?: "low" | "medium" | "high"; // 30% | 60% | 80%
  children?: React.ReactNode;
}

export const MobileBottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  heightLevel = "medium",
  children,
}) => {
  // 锁死底层滚动穿透 (Body Scroll Lock)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 三分屏高度对应
  const heightClass = {
    low: "h-[35vh]",
    medium: "h-[60vh]",
    high: "h-[82vh]",
  }[heightLevel];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* 半透明暗黑遮罩 */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200" />

      {/* 底部升起抽屉容器 */}
      <div
        className={`relative w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col ${heightClass} animate-in slide-in-from-bottom duration-250`}
      >
        {/* 1. 顶部拖拽手柄指示条 (Drag Handle) */}
        <div className="w-full pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
          <div className="w-9 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* 2. 抽屉标题栏 (带关闭按钮与 44pt 触控热区) */}
        <div className="h-12 px-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 -mr-3 flex items-center justify-center text-slate-400 hover:text-slate-700 active:opacity-60"
            aria-label="关闭面板"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3. 抽屉内部独立可滚动区 */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-600 space-y-4">
          {children || (
            <div className="space-y-4">
              <p className="font-medium text-slate-800">请选择适用的系统授权模式：</p>
              {[
                { id: "read", name: "只读预览权限", desc: "允许查看所有监控图表与设备运行日志" },
                { id: "operator", name: "现场操作员权限", desc: "允许下发设备启动/暂停调试控制指令" },
                { id: "admin", name: "系统管理员权限", desc: "全量配置下发、固件 OTA 升级与成员管理" },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center">
                    <Check className="w-3 h-3 text-transparent group-hover:text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. 底部主行动栏 (避让 Home Indicator 34pt) */}
        <div className="p-4 border-t border-slate-100 bg-white pb-[calc(16px+env(safe-area-inset-bottom,34px))] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition"
          >
            取消
          </button>
          <button
            onClick={() => {
              alert("已保存授权配置");
              onClose();
            }}
            className="flex-1 h-11 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition shadow-sm"
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  );
};
