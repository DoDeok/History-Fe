"use client";

import { motion } from "framer-motion";
import { useState, use, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";
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

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 150));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));
  const handleFitScreen = () => setZoom(100);

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
              <h1 className="text-4xl font-bold mb-2">🌊 역사 흐름도</h1>
              <p className="text-[#6B6762]">
                사건을 클릭하면 자세한 정보를 볼 수 있어요
              </p>
            </div>

            {/* Zoom Controls */}
            <div className="flex gap-2">
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
              <span className="px-3 py-2 bg-white border border-[#DAD0C7] rounded-lg text-sm text-[#6B6762]">
                {zoom}%
              </span>
            </div>
          </div>

          <div className="relative">
            {/* Flow Chart Area */}
            <HistoryCard className="overflow-x-auto">
              <div 
                className="min-w-max p-8"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
              >
                <div className="flex flex-col items-center gap-8">
                  {nodes.map((node, index) => (
                    <div key={node.id} className="flex flex-col items-center">
                      {/* Node */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedNode(node)}
                        className="w-64 p-6 bg-[#EFE9E3] border-2 border-[#C9B59C] rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-1">{node.title}</h3>
                          <p className="text-sm text-[#C9B59C] font-medium">{node.date}</p>
                          <p className="mt-3 text-sm text-[#6B6762]">
                            {node.description}
                          </p>
                        </div>
                      </motion.div>

                      {/* Arrow */}
                      {index < nodes.length - 1 && (
                        <div className="flex flex-col items-center my-4">
                          <div className="w-0.5 h-12 bg-[#C9B59C]" />
                          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#C9B59C]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </HistoryCard>

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
