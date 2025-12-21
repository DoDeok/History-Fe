"use client";

import { motion } from "framer-motion";
import { useState, use, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize2, X, Move, RotateCcw } from "lucide-react";
import Image from "next/image";
import { HistoryCard } from "@/components/HistoryCard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FlowNode {
  id: string;
  title: string;
  date: string;
  description: string;
  cause?: string;
  result?: string;
  people?: string[];
  significance?: string;
}

export default function FlowChartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [zoom, setZoom] = useState(100);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFlowData = async () => {
      try {
        const { data, error } = await supabase
          .from("flow")
          .select("*")
          .eq("card_id", id)
          .order("node_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setNodes(data.map((item: any) => ({
            id: item.id,
            title: item.title,
            date: item.date || "",
            description: item.content || "",
            cause: item.cause || "",
            result: item.result || "",
            people: item.people || [],
            significance: item.significance || "",
          })));
        }
      } catch (err: any) {
        console.error("흐름도 데이터 로딩 오류:", err);
        toast.error("흐름도 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlowData();
  }, [id]);

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 30));
  const handleFitScreen = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };
  const handleResetPosition = () => setPosition({ x: 0, y: 0 });

  // 줌 레벨에 따른 그리드 컬럼 수 계산
  const getGridCols = () => {
    if (zoom <= 50) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6";
    if (zoom <= 70) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5";
    if (zoom <= 100) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    if (zoom <= 130) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2";
  };

  // 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.flow-node')) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 휠 줌
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom(prev => Math.min(Math.max(prev + delta, 30), 200));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <HistoryCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">흐름도를 불러오는 중...</h2>
          <p className="text-[#6B6762]">잠시만 기다려주세요.</p>
        </HistoryCard>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <HistoryCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">흐름도가 없습니다</h2>
          <p className="text-[#6B6762]">아직 생성된 흐름도가 없습니다.</p>
        </HistoryCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                역사 흐름도
              </h1>
              <p className="text-[#6B6762]">
                사건을 클릭하면 자세한 정보를 볼 수 있어요
              </p>
            </div>

            {/* Zoom Controls */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white border border-[#DAD0C7] rounded-lg hover:bg-[#EFE9E3] transition-colors"
                title="축소"
              >
                <ZoomOut className="h-5 w-5 text-[#6B6762]" />
              </button>
              <button
                onClick={handleFitScreen}
                className="p-2 bg-white border border-[#DAD0C7] rounded-lg hover:bg-[#EFE9E3] transition-colors"
                title="전체보기"
              >
                <Maximize2 className="h-5 w-5 text-[#6B6762]" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white border border-[#DAD0C7] rounded-lg hover:bg-[#EFE9E3] transition-colors"
                title="확대"
              >
                <ZoomIn className="h-5 w-5 text-[#6B6762]" />
              </button>
              <button
                onClick={handleResetPosition}
                className="p-2 bg-white border border-[#DAD0C7] rounded-lg hover:bg-[#EFE9E3] transition-colors"
                title="위치 초기화"
              >
                <RotateCcw className="h-5 w-5 text-[#6B6762]" />
              </button>
              <span className="px-3 py-2 bg-white border border-[#DAD0C7] rounded-lg text-sm text-[#6B6762]">
                {zoom}%
              </span>
              <span className="px-3 py-2 bg-[#EFE9E3] border border-[#DAD0C7] rounded-lg text-xs text-[#6B6762] flex items-center gap-1">
                <Move className="h-4 w-4" />
                드래그로 이동
              </span>
            </div>
          </div>

          <div className="relative">
            {/* Flow Chart Area */}
            <div 
              className="bg-white border border-[#DAD0C7] rounded-2xl p-6 shadow-sm overflow-hidden h-[70vh] relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <div 
                ref={containerRef}
                className="p-8 transition-transform duration-75"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`, 
                  transformOrigin: 'top left',
                  width: `${100 * (100 / zoom)}%`,
                }}
              >
                <div className={`grid ${getGridCols()} gap-6`}>
                  {nodes.map((node, index) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      onClick={() => setSelectedNode(node)}
                      className="flow-node relative p-6 bg-[#EFE9E3] border-2 border-[#C9B59C] rounded-xl cursor-pointer hover:shadow-lg transition-all"
                    >
                      {/* 순서 번호 배지 */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#C9B59C] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      
                      {/* 연결선 (다음 노드로) */}
                      {index < nodes.length - 1 && (
                        <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2">
                          <div className="flex items-center">
                            <div className="w-4 h-0.5 bg-[#C9B59C]" />
                            <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-[#C9B59C]" />
                          </div>
                        </div>
                      )}

                      <div className="text-center pt-2">
                        <h3 className="text-lg font-semibold mb-1 line-clamp-2">{node.title}</h3>
                        <p className="text-sm text-[#C9B59C] font-medium mb-3">{node.date}</p>
                        <p className="text-sm text-[#6B6762] line-clamp-3">
                          {node.description}
                        </p>
                      </div>
                      
                      {/* 클릭 힌트 */}
                      <div className="mt-4 text-center">
                        <span className="text-xs text-[#A89F94]">클릭하여 자세히 보기</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Panel for Selected Node */}
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="fixed right-4 top-24 w-96 max-h-[80vh] overflow-y-auto z-50"
              >
                <HistoryCard className="relative">
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="absolute top-4 right-4 p-1 hover:bg-[#EFE9E3] rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-[#6B6762]" />
                  </button>

                  <h2 className="text-2xl font-bold mb-1 pr-8">{selectedNode.title}</h2>
                  <p className="text-[#C9B59C] font-medium mb-4">{selectedNode.date}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-[#6B6762] mb-1">📝 설명</h4>
                      <p className="text-sm">{selectedNode.description}</p>
                    </div>

                    {selectedNode.cause && (
                      <div>
                        <h4 className="text-sm font-medium text-[#6B6762] mb-1">🔍 원인</h4>
                        <p className="text-sm">{selectedNode.cause}</p>
                      </div>
                    )}

                    {selectedNode.result && (
                      <div>
                        <h4 className="text-sm font-medium text-[#6B6762] mb-1">🎯 결과</h4>
                        <p className="text-sm">{selectedNode.result}</p>
                      </div>
                    )}

                    {selectedNode.people && selectedNode.people.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-[#6B6762] mb-1">👥 관련 인물</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedNode.people.map((person, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-[#EFE9E3] text-sm rounded-full"
                            >
                              {person}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedNode.significance && (
                      <div>
                        <h4 className="text-sm font-medium text-[#6B6762] mb-1">💡 의의</h4>
                        <p className="text-sm">{selectedNode.significance}</p>
                      </div>
                    )}
                  </div>
                </HistoryCard>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
