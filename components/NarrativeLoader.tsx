import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface NarrativeLoaderProps {
  isLoading: boolean;
}

const NarrativeLoader: React.FC<NarrativeLoaderProps> = ({ isLoading }) => {
  const t = useTranslations();
  const [progress, setProgress] = useState(0);

  // --- 1. 芝诺悖论引擎 (Zeno's Paradox Engine) ---
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // 重置进度
      setProgress(0);

      const updateProgress = () => {
        setProgress((prev) => {
          // 目标上限是 95%，永远不自动达到 100%
          const target = 95;
          const remaining = target - prev;

          // 阶段 1: 快速启动 (0-25%) -> 步子迈大点
          // 阶段 2: 随机减速 -> 剩余距离的 5% - 15% 随机增量
          const jumpFactor = prev < 25 ? 0.3 : 0.05 + Math.random() * 0.1;
          
          const increment = remaining * jumpFactor;
          
          // 如果增量太小，给一个极小值保持动画，但不要超过 95
          const nextValue = prev + (increment < 0.1 ? 0.1 : increment);
          return nextValue > 95 ? 95 : nextValue;
        });

        // 随机时间间隔 (300ms - 800ms)，模拟不规则的“思考”过程
        const nextTick = 300 + Math.random() * 500;
        timeoutId = setTimeout(updateProgress, nextTick);
      };

      // 立即启动
      timeoutId = setTimeout(updateProgress, 100);

    } else {
      // --- 3. 完成阶段 (API Success) ---
      // 当 isLoading 变为 false，直接平滑填满到 100%
      setProgress(100);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // --- 2. 叙事文本逻辑 (Narrative Logic) ---
  const currentMessage = useMemo(() => {
    if (progress >= 100) return t.loader.ready;
    if (progress > 90) return t.loader.phase4; // Adding emotional damage
    if (progress > 60) return t.loader.phase3; // Polishing
    if (progress > 30) return t.loader.phase2; // Sarcasm DB
    return t.loader.phase1; // Analyzing
  }, [progress, t]);

  // 节点定义
  const nodes = [33, 66, 100];

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      {/* 进度条容器 */}
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
        
        {/* 填充条 (Blue Brand Color) */}
        <div 
          className="absolute top-0 left-0 h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(2,132,199,0.5)]"
          style={{ width: `${progress}%` }}
        />

        {/* 节点 (Nodes) */}
        {nodes.map((nodePos) => {
          const isActive = progress >= nodePos;
          const isNext = progress < nodePos && progress > nodePos - 33; // 简单的预测逻辑

          return (
            <div 
              key={nodePos}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
              style={{ left: `${nodePos}%` }}
            >
              <div className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white dark:bg-gray-800
                ${isActive 
                  ? 'border-primary-600 dark:border-primary-500 scale-110' 
                  : 'border-gray-300 dark:border-gray-600 scale-100'}
              `}>
                {/* 内部发光点 */}
                {isActive && (
                  <div className="w-2 h-2 bg-primary-600 dark:bg-primary-500 rounded-full animate-pulse" />
                )}
                {/* 即将到达的节点产生呼吸效果 */}
                {!isActive && isNext && isLoading && (
                   <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce-short" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 动态文字区域 */}
      <div className="text-center h-8">
        <p className="text-sm font-medium text-primary-700 dark:text-primary-300 animate-fade-in-up font-mono">
          {currentMessage}
        </p>
      </div>
    </div>
  );
};

export default NarrativeLoader;