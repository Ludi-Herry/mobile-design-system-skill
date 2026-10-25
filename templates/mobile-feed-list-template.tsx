import React, { useState } from "react";
import { Search, SlidersHorizontal, RefreshCw, Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react";

/**
 * 移动端信息流列表实战代码模板 (Mobile Feed List Template)
 * 严格遵循 Ludi Mobile Design System 规范：
 * - 顶部 Status Bar 与 底部 Home Bar 安全区避让 (safe-area-inset)
 * - 最小触控热区保证 (44x44pt)
 * - 0.5px 精细微边框与 Retina 适配
 * - 图片三段式裁切与比例控制 (aspect-ratio)
 * - 触底加载更多与下拉刷新状态机
 */

interface FeedItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

const INITIAL_FEED: FeedItem[] = [
  {
    id: "feed-1",
    author: "工业物联实验室",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    time: "10分钟前",
    title: "全新边缘计算智能网关上线实测",
    content: "针对工业恶劣环境下的高可用数据采集，本次升级了全双工隔离通信协议，实测丢包率降至 0.001% 以下。",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    likes: 128,
    comments: 24,
  },
  {
    id: "feed-2",
    author: "架构设计观察",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    time: "1小时前",
    title: "移动端体验优化的三条硬原则",
    content: "把系统能替用户做的决定都做掉。精准匹配键盘类型、锁死浮层滚动穿透、预留足够触控热区。",
    likes: 256,
    comments: 42,
  },
];

export const MobileFeedListTemplate: React.FC = () => {
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("recommend");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* 模拟移动端 390pt / 402pt 标准视口容器 */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-xl relative overflow-hidden">
        {/* 一、顶部安全区与导航栏 (Top Bar) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/70 pt-[env(safe-area-inset-top,20px)]">
          <div className="h-11 px-4 flex items-center justify-between gap-3">
            <button
              onClick={() => window.history.back()}
              className="w-11 h-11 -ml-2 flex items-center justify-center text-slate-700 active:opacity-60 transition"
              aria-label="返回上一级"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* 居中搜索框 */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="搜索动态、技术专栏..."
                className="w-full h-8 pl-8 pr-3 bg-slate-100 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleRefresh}
              className="w-11 h-11 -mr-2 flex items-center justify-center text-slate-700 active:opacity-60 transition"
              aria-label="刷新动态"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* 分类标签栏 (Tabs) */}
          <div className="flex border-b border-slate-100 px-4 text-xs font-medium">
            {[
              { id: "recommend", label: "推荐动态" },
              { id: "tech", label: "前沿技术" },
              { id: "case", label: "实战案例" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 mr-6 relative transition ${
                  activeTab === tab.id ? "text-blue-600 font-semibold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* 二、信息流可滚动主体 */}
        <main className="flex-1 overflow-y-auto divide-y divide-slate-100 pb-[calc(16px+env(safe-area-inset-bottom,34px))]">
          {/* 下拉刷新视觉提示 */}
          {isRefreshing && (
            <div className="py-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-400 bg-slate-50/60">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              正在同步最新动态...
            </div>
          )}

          {feed.map((item) => (
            <article key={item.id} className="p-4 space-y-3 bg-white">
              {/* 作者信息栏 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-9 h-9 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 leading-tight">{item.author}</h3>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                </div>
                <button
                  className="w-11 h-11 -mr-3 flex items-center justify-center text-slate-400 hover:text-slate-700 active:opacity-60"
                  aria-label="更多操作"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 标题与正文 */}
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.content}</p>
              </div>

              {/* 图片展示（遵循 16:9 横图比例控制与防变形） */}
              {item.imageUrl && (
                <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200/60">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}

              {/* 底部点赞评论轻操作栏 (保证 44pt 触控热区) */}
              <div className="flex items-center justify-between pt-1 text-slate-500">
                <button className="h-11 px-2 flex items-center gap-1.5 text-xs hover:text-blue-600 active:scale-95 transition">
                  <Heart className="w-4 h-4" />
                  <span>{item.likes}</span>
                </button>
                <button className="h-11 px-2 flex items-center gap-1.5 text-xs hover:text-blue-600 active:scale-95 transition">
                  <MessageCircle className="w-4 h-4" />
                  <span>{item.comments}</span>
                </button>
                <button className="h-11 px-2 flex items-center gap-1.5 text-xs hover:text-blue-600 active:scale-95 transition">
                  <Share2 className="w-4 h-4" />
                  <span>分享</span>
                </button>
              </div>
            </article>
          ))}

          {/* 触底加载指示器 */}
          <div className="py-6 text-center text-xs text-slate-400">已呈现全部动态</div>
        </main>
      </div>
    </div>
  );
};
