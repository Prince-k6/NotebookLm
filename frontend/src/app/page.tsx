"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Upload, MessageSquare, FileText, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Send, Headphones, BookOpen, Trash2, Settings, Grid, Globe, MoreVertical, Edit2, Copy, ThumbsUp, ThumbsDown, ArrowRight, Notebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotebookStore, SourceItem, Message } from "@/store/notebookStore";

export default function Home() {
  const { notebooks, currentNotebook, setCurrentNotebook, setNotebooks, updateNotebook } = useNotebookStore();
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isNewNotebookOpen, setIsNewNotebookOpen] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [notebookToRename, setNotebookToRename] = useState<{id: string, title: string} | null>(null);
  const [editNotebookName, setEditNotebookName] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("account");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock sources for NotebookLM style
  const sources = currentNotebook?.sources || [];
  const messages = currentNotebook?.messages || [];

  const setSources = (newSources: SourceItem[]) => {
    if (currentNotebook) updateNotebook(currentNotebook.id, { sources: newSources });
  };
  const addMessage = (msg: Message) => {
    if (currentNotebook) updateNotebook(currentNotebook.id, { messages: [...messages, msg] });
  };

  const getSuggestedQuestions = () => {
    if (currentNotebook?.title === "Q3 Research") {
      return [
        "Summarize the Q3 financial report",
        "What were the key takeaways from the Oct meeting?",
        "How do we compare against competitors?",
      ];
    }
    if (currentNotebook?.title === "Project Alpha") {
      return [
        "What is the timeline for Project Alpha?",
        "Who are the key stakeholders?",
        "List the primary objectives.",
      ];
    }
    if (currentNotebook?.title.includes("The Atlantic")) {
      return [
        "What is the author's main argument?",
        "Summarize the perspective on building a life.",
      ];
    }
    return [
      "Give me a comprehensive summary",
      "What are the key takeaways?",
      "Explain the main concepts simply",
    ];
  };

  // suggestedQuestions removed to fix lint warning

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;
    
    const userMsg = { id: Date.now().toString(), role: "user" as const, content: text };
    addMessage(userMsg);
    if (text === inputText) setInputText("");
    setIsStreaming(true);

    const sourceName = sources.length > 0 ? sources[0].title : (currentNotebook?.title || "the provided documents");
    
    const mockResponses = [
      `Based on ${sourceName}, here is the synthesis of the information you requested. The analysis highlights several core themes and a strong overall trajectory. Let me know if you would like me to extract more specific details.`,
      `I've reviewed ${sourceName} to answer your question. The primary takeaway is that the key metrics align with the initial projections, though there are some nuances in the data.`,
      `Looking at ${sourceName}, the main concepts focus on foundational principles and their practical applications. If you need a more detailed breakdown of a specific section, just ask!`,
      `According to ${sourceName}, there are significant insights regarding the structure and methodology outlined. The document emphasizes a systematic approach to this topic.`,
      `I found the answer in ${sourceName}. The text suggests that the optimal strategy involves a careful balance of the factors mentioned, prioritizing long-term stability.`
    ];
    
    const assistantMsg = { id: (Date.now() + 1).toString(), role: "assistant" as const, content: "", sources: [{ id: 1, text: `Sourced from ${sourceName}.` }] };
    addMessage(assistantMsg);
    
    // Pick a random mock response if it's not a specific request, otherwise tailor it slightly
    let streamText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    if (text.toLowerCase().includes("summary")) {
      streamText = `Here is a comprehensive summary of ${sourceName}:\n\n1. The document outlines key foundational concepts.\n2. It provides a detailed methodology for implementation.\n3. The conclusion emphasizes practical applications and future research directions.`;
    } else if (text.toLowerCase().includes("audio")) {
      streamText = `Generating an Audio Overview for ${sourceName}. (Note: This is a prototype. In the production version, this will generate a podcast-style audio summary using TTS).`;
    }
    
    let currentText = "";
    
    for (let i = 0; i < streamText.length; i++) {
      currentText += streamText[i];
      if (currentNotebook) {
        updateNotebook(currentNotebook.id, {
          messages: currentNotebook.messages?.map(m => m.id === assistantMsg.id ? { ...m, content: currentText } : m)
        });
      }
      await new Promise(r => setTimeout(r, 15));
    }
    setIsStreaming(false);
  };

  if (!currentNotebook) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#f8f9fa] dark:bg-[#1b1b1d] text-[#1f1f1f] dark:text-[#e3e3e3] font-sans overflow-y-auto pb-20">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Notebook className="w-7 h-7 text-[#1f1f1f] dark:text-white" />
            <span className="text-[1.3rem] font-medium tracking-tight text-[#1f1f1f] dark:text-white">NotebookLM</span>
          </div>
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger render={<button type="button" className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors" />}>
                  <Settings className="w-5 h-5 text-[#444746] dark:text-[#a0a0a0] hover:text-[#1f1f1f] dark:text-white transition-colors" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#2a2b2f] border-[#c4c7c5] dark:border-[#444] text-[#1f1f1f] dark:text-[#e3e3e3]">
                <DropdownMenuItem onClick={() => { setSettingsTab("account"); setIsSettingsOpen(true); }} className="cursor-pointer hover:bg-[#e1e5ea] dark:bg-[#38393d] focus:bg-[#e1e5ea] dark:bg-[#38393d] focus:text-[#1f1f1f] dark:text-white">Account Preferences</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSettingsTab("appearance"); setIsSettingsOpen(true); }} className="cursor-pointer hover:bg-[#e1e5ea] dark:bg-[#38393d] focus:bg-[#e1e5ea] dark:bg-[#38393d] focus:text-[#1f1f1f] dark:text-white">Appearance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSettingsTab("help"); setIsSettingsOpen(true); }} className="cursor-pointer hover:bg-[#e1e5ea] dark:bg-[#38393d] focus:bg-[#e1e5ea] dark:bg-[#38393d] focus:text-[#1f1f1f] dark:text-white">Help & Feedback</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger render={<button type="button" className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-[#1f1f1f] dark:text-white font-medium text-sm shadow-sm ring-1 ring-pink-400 cursor-pointer hover:ring-2 hover:ring-pink-300 transition-all" />}>
                  B
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#2a2b2f] border-[#c4c7c5] dark:border-[#444] text-[#1f1f1f] dark:text-[#e3e3e3] mt-2">
                <div className="px-2 py-3 mb-1 border-b border-[#c4c7c5] dark:border-[#444]">
                  <p className="font-medium text-[#1f1f1f] dark:text-white">Bishal Baroi</p>
                  <p className="text-xs text-[#444746] dark:text-[#a0a0a0] mt-0.5">bishal@example.com</p>
                </div>
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer hover:bg-[#e1e5ea] dark:hover:bg-[#38393d] focus:bg-[#e1e5ea] dark:focus:bg-[#38393d] focus:text-[#1f1f1f] dark:focus:text-white">My Profile</DropdownMenuItem>

                <DropdownMenuItem onClick={() => alert("Sign out clicked (Demo)")} className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-300 mt-1">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="max-w-[1100px] w-full mx-auto px-6 py-8">
          
          {/* Featured Notebooks */}
          <div className="mb-12">
            <h2 className="text-[1.5rem] font-normal text-[#1f1f1f] dark:text-white mb-6">Featured notebooks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Featured 1 */}
              <div 
                className="rounded-2xl h-[220px] p-5 flex flex-col justify-end relative overflow-hidden cursor-pointer group hover:opacity-95 transition-opacity bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop')" }}
                onClick={() => {
                  setCurrentNotebook({ id: "f1", title: "How To Build A Life, from The Atlantic", createdAt: new Date().toISOString() });
                  setSources([
                    { id: 101, title: "The_Atlantic_Article_1.pdf", type: "pdf", selected: true },
                    { id: 102, title: "Author_Interview.txt", type: "txt", selected: true }
                  ]);
                }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center text-xs font-bold">A</div>
                    <span className="text-xs font-medium text-white/90">The Atlantic</span>
                  </div>
                  <h3 className="text-[1.3rem] font-medium text-white mb-2 leading-tight">How To Build A Life, from The Atlantic</h3>
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <span>Apr 23, 2025 • 2 sources</span>
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
              </div>
              {/* Featured 2 */}
              <div 
                className="rounded-2xl h-[220px] p-5 flex flex-col justify-end relative overflow-hidden cursor-pointer group hover:opacity-95 transition-opacity bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800&auto=format&fit=crop')" }}
                onClick={() => {
                  setCurrentNotebook({ id: "f2", title: "Secrets of the Super Agers", createdAt: new Date().toISOString() });
                  setSources([
                    { id: 201, title: "Super_Agers_Study_2025.pdf", type: "pdf", selected: true },
                    { id: 202, title: "Eric_Topol_Interview.md", type: "md", selected: true }
                  ]);
                }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-stone-300 overflow-hidden">
                    </div>
                    <span className="text-xs font-medium text-white/90">Eric Topol</span>
                  </div>
                  <h3 className="text-[1.3rem] font-medium text-white mb-2 leading-tight">Secrets of the Super Agers</h3>
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <span>May 6, 2025 • 2 sources</span>
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
              </div>
              {/* Featured 3 */}
              <div 
                className="rounded-2xl h-[220px] p-5 flex flex-col justify-end relative overflow-hidden cursor-pointer group hover:opacity-95 transition-opacity bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop')" }}
                onClick={() => {
                  setCurrentNotebook({ id: "f3", title: "OpenStax's Biology", createdAt: new Date().toISOString() });
                  setSources([
                    { id: 301, title: "Biology_Chapter_1_to_5.pdf", type: "pdf", selected: true },
                    { id: 302, title: "Cell_Division_Summary.txt", type: "txt", selected: true }
                  ]);
                }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                       <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
                    </div>
                    <span className="text-xs font-medium text-white/90">OpenStax</span>
                  </div>
                  <h3 className="text-[1.3rem] font-medium text-[#1f1f1f] dark:text-white mb-2 leading-tight">OpenStax&apos;s Biology</h3>
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <span>Jul 31, 2025 • 2 sources</span>
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
              </div>
              {showAllFeatured && (
                <>
                  {/* Featured 4 */}
                  <div 
                    className="rounded-2xl h-[220px] p-5 flex flex-col justify-end relative overflow-hidden cursor-pointer group hover:opacity-95 transition-opacity bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop')" }}
                    onClick={() => {
                      setCurrentNotebook({ id: "f4", title: "Technology Trends 2026", createdAt: new Date().toISOString() });
                      setSources([{ id: 401, title: "Tech_Report.pdf", type: "pdf", selected: true }]);
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-[#1f1f1f] dark:text-white">T</div>
                        <span className="text-xs font-medium text-white/90">Tech Insider</span>
                      </div>
                      <h3 className="text-[1.3rem] font-medium text-[#1f1f1f] dark:text-white mb-2 leading-tight">Technology Trends 2026</h3>
                      <div className="flex items-center justify-between text-white/80 text-xs">
                        <span>Oct 12, 2025 • 5 sources</span>
                        <Globe className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  {/* Featured 5 */}
                  <div 
                    className="rounded-2xl h-[220px] p-5 flex flex-col justify-end relative overflow-hidden cursor-pointer group hover:opacity-95 transition-opacity bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop')" }}
                    onClick={() => {
                      setCurrentNotebook({ id: "f5", title: "Advanced Web Development", createdAt: new Date().toISOString() });
                      setSources([{ id: 501, title: "React_Patterns.md", type: "md", selected: true }]);
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-black">JS</div>
                        <span className="text-xs font-medium text-white/90">Code Masters</span>
                      </div>
                      <h3 className="text-[1.3rem] font-medium text-[#1f1f1f] dark:text-white mb-2 leading-tight">Advanced Web Development</h3>
                      <div className="flex items-center justify-between text-white/80 text-xs">
                        <span>Nov 05, 2025 • 8 sources</span>
                        <Globe className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  {/* Featured 6 */}
                  <div 
                    className="rounded-2xl h-[220px] p-5 flex flex-col justify-end relative overflow-hidden cursor-pointer group hover:opacity-95 transition-opacity bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop')" }}
                    onClick={() => {
                      setCurrentNotebook({ id: "f6", title: "Financial Markets Overview", createdAt: new Date().toISOString() });
                      setSources([{ id: 601, title: "Market_Analysis.pdf", type: "pdf", selected: true }]);
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold text-[#1f1f1f] dark:text-white">$</div>
                        <span className="text-xs font-medium text-white/90">Wall Street</span>
                      </div>
                      <h3 className="text-[1.3rem] font-medium text-[#1f1f1f] dark:text-white mb-2 leading-tight">Financial Markets Overview</h3>
                      <div className="flex items-center justify-between text-white/80 text-xs">
                        <span>Dec 20, 2025 • 12 sources</span>
                        <Globe className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                className="rounded-full bg-transparent border-[#c4c7c5] dark:border-[#444] text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-[#2a2a2a] h-8 px-4 text-xs font-medium transition-all"
                onClick={() => setShowAllFeatured(!showAllFeatured)}
              >
                {showAllFeatured ? "Show less" : "See all"} 
                <ChevronRight className={`w-3 h-3 ml-1 transition-transform ${showAllFeatured ? '-rotate-90' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Recent Notebooks */}
          <div>
            <h2 className="text-[1.5rem] font-normal text-[#1f1f1f] dark:text-white mb-6">Recent notebooks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              
              {/* Create New Notebook Card */}
              <div 
                className="border border-[#c4c7c5] dark:border-[#38393c] bg-white dark:bg-[#242528] rounded-[16px] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#f0f4f9] dark:hover:bg-[#2b2c2f] transition-colors min-h-[220px]"
                onClick={() => setIsNewNotebookOpen(true)}
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#f0f4f9] dark:bg-[#35363a] flex items-center justify-center mb-5 border border-[#e3e3e3] dark:border-none">
                  <Plus className="w-6 h-6 text-[#1f1f1f] dark:text-[#e3e3e3]" />
                </div>
                <span className="text-[1.2rem] font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">Create new notebook</span>
              </div>

              {/* Mapped Notebooks */}
              {notebooks.map((nb, i) => {
                const colors = ["bg-[#f3e8fd] dark:bg-[#38353b]", "bg-[#eef5e5] dark:bg-[#33352c]", "bg-[#e6f3fa] dark:bg-[#2d363b]"];
                const icons = ["📒", "💻", "💪", "📊", "🧠"];
                const bgColor = colors[i % colors.length];
                const icon = icons[i % icons.length];
                
                return (
                  <div 
                    key={nb.id} 
                    className={`${bgColor} rounded-[16px] p-6 flex flex-col relative cursor-pointer hover:brightness-110 transition-all min-h-[220px]`}
                    onClick={() => {
                      setCurrentNotebook(nb);
                      setSources([]); // Clear sources when switching to a regular notebook
                    }}
                  >
                    <div className="flex justify-between items-start mb-auto">
                      <div className="text-[2.5rem] leading-none drop-shadow-md">{icon}</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger 
                          render={
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-[#444746] dark:text-[#a0a0a0] hover:bg-black/20 hover:text-[#1f1f1f] dark:text-white rounded-full -mt-1 -mr-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                          }
                        >
                          <MoreVertical className="w-5 h-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#2a2b2f] border-[#c4c7c5] dark:border-[#444] text-[#1f1f1f] dark:text-[#e3e3e3]">
                          <DropdownMenuItem 
                            className="cursor-pointer hover:bg-[#e1e5ea] dark:bg-[#38393d] focus:bg-[#e1e5ea] dark:bg-[#38393d] focus:text-[#1f1f1f] dark:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotebookToRename({id: nb.id, title: nb.title});
                              setEditNotebookName(nb.title);
                              setIsRenameOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Title
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-400 hover:bg-red-900/20 focus:bg-red-900/20 focus:text-red-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotebooks(notebooks.filter(n => n.id !== nb.id));
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Notebook
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="text-[1.4rem] font-medium text-[#1f1f1f] dark:text-white leading-[1.2] mb-3 pr-4">{nb.title}</h3>
                    <span className="text-sm text-[#444746] dark:text-[#a0a0a0]">Apr 24, 2026 • 0 sources</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Dialog open={isNewNotebookOpen} onOpenChange={setIsNewNotebookOpen}>
            <DialogContent className="sm:max-w-[425px] bg-[#f0f4f9] dark:bg-[#f8f9fa] dark:bg-[#1e1f20] border-[#e3e3e3] dark:border-[#333]">
              <DialogHeader>
                <DialogTitle className="text-[#1f1f1f] dark:text-[#1f1f1f] dark:text-[#e3e3e3]">Create New Notebook</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input 
                  placeholder="Enter notebook name..." 
                  value={newNotebookName}
                  onChange={(e) => setNewNotebookName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newNotebookName.trim()) {
                      const newNb = { id: Date.now().toString(), title: newNotebookName.trim(), createdAt: new Date().toISOString() };
                      setNotebooks([...notebooks, newNb]);
                      setCurrentNotebook(newNb);
                      setSources([]); // Clear any existing mock sources
                      setIsNewNotebookOpen(false);
                      setNewNotebookName("");
                    }
                  }}
                  autoFocus
                  className="bg-white dark:bg-white dark:bg-[#131314] border-[#e3e3e3] dark:border-[#333] text-[#1f1f1f] dark:text-[#1f1f1f] dark:text-[#e3e3e3] focus-visible:ring-1 focus-visible:ring-[#0b57d0]"
                />
              </div>
              <DialogFooter>
                <Button onClick={() => { setIsNewNotebookOpen(false); setNewNotebookName(""); }} variant="outline" className="bg-transparent border-[#e3e3e3] dark:border-[#333] text-[#1f1f1f] dark:text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-black/5 dark:hover:bg-white/5">Cancel</Button>
                <Button 
                  disabled={!newNotebookName.trim()}
                  onClick={() => {
                    const newNb = { id: Date.now().toString(), title: newNotebookName.trim(), createdAt: new Date().toISOString() };
                    setNotebooks([...notebooks, newNb]);
                    setCurrentNotebook(newNb);
                    setSources([]); // Clear any existing mock sources
                    setIsNewNotebookOpen(false);
                    setNewNotebookName("");
                  }} 
                  className="bg-[#0b57d0] hover:bg-[#0842a0] text-[#1f1f1f] dark:text-white"
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
            <DialogContent className="sm:max-w-[425px] bg-[#f0f4f9] dark:bg-[#f8f9fa] dark:bg-[#1e1f20] border-[#e3e3e3] dark:border-[#333]">
              <DialogHeader>
                <DialogTitle className="text-[#1f1f1f] dark:text-[#1f1f1f] dark:text-[#e3e3e3]">Rename Notebook</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input 
                  placeholder="Notebook name" 
                  value={editNotebookName}
                  onChange={(e) => setEditNotebookName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editNotebookName.trim() && notebookToRename) {
                      setNotebooks(notebooks.map(n => n.id === notebookToRename.id ? { ...n, title: editNotebookName.trim() } : n));
                      setIsRenameOpen(false);
                    }
                  }}
                  autoFocus
                  className="bg-white dark:bg-white dark:bg-[#131314] border-[#e3e3e3] dark:border-[#333] text-[#1f1f1f] dark:text-[#1f1f1f] dark:text-[#e3e3e3] focus-visible:ring-1 focus-visible:ring-[#0b57d0]"
                />
              </div>
              <DialogFooter>
                <Button onClick={() => setIsRenameOpen(false)} variant="outline" className="bg-transparent border-[#e3e3e3] dark:border-[#333] text-[#1f1f1f] dark:text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-black/5 dark:hover:bg-white/5">Cancel</Button>
                <Button 
                  disabled={!editNotebookName.trim()}
                  onClick={() => {
                    if (notebookToRename) {
                      setNotebooks(notebooks.map(n => n.id === notebookToRename.id ? { ...n, title: editNotebookName.trim() } : n));
                      setIsRenameOpen(false);
                    }
                  }} 
                  className="bg-[#0b57d0] hover:bg-[#0842a0] text-[#1f1f1f] dark:text-white"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogContent className="sm:max-w-[700px] bg-[#f8f9fa] dark:bg-[#1e1f20] border-[#e3e3e3] dark:border-[#333] text-[#1f1f1f] dark:text-[#e3e3e3] p-0 overflow-hidden">
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-[200px] bg-white dark:bg-[#131314] p-4 flex flex-col gap-1 border-r border-[#e3e3e3] dark:border-[#333]">
                  <h2 className="text-xl font-medium text-[#1f1f1f] dark:text-white mb-4 px-2">Settings</h2>
                  <Button variant="ghost" onClick={() => setSettingsTab("account")} className={`justify-start rounded-xl ${settingsTab === "account" ? "bg-white dark:bg-[#2a2b2f] text-[#1f1f1f] dark:text-white" : "text-[#444746] dark:text-[#a0a0a0] hover:text-[#1f1f1f] dark:text-white hover:bg-black/20"}`}>
                    Account Preferences
                  </Button>
                  <Button variant="ghost" onClick={() => setSettingsTab("appearance")} className={`justify-start rounded-xl ${settingsTab === "appearance" ? "bg-white dark:bg-[#2a2b2f] text-[#1f1f1f] dark:text-white" : "text-[#444746] dark:text-[#a0a0a0] hover:text-[#1f1f1f] dark:text-white hover:bg-black/20"}`}>
                    Appearance
                  </Button>
                  <Button variant="ghost" onClick={() => setSettingsTab("help")} className={`justify-start rounded-xl ${settingsTab === "help" ? "bg-white dark:bg-[#2a2b2f] text-[#1f1f1f] dark:text-white" : "text-[#444746] dark:text-[#a0a0a0] hover:text-[#1f1f1f] dark:text-white hover:bg-black/20"}`}>
                    Help & Feedback
                  </Button>
                </div>
                {/* Content */}
                <div className="flex-1 p-8 bg-[#f8f9fa] dark:bg-[#1e1f20]">
                  {settingsTab === "account" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-normal text-[#1f1f1f] dark:text-white mb-2">Account Preferences</h3>
                        <p className="text-[#444746] dark:text-[#a0a0a0]">Manage your profile and subscription details.</p>
                      </div>
                      <div className="border border-[#e3e3e3] dark:border-[#333] rounded-xl p-6 bg-white dark:bg-[#131314]">
                        <p className="font-medium text-[#1f1f1f] dark:text-white text-lg">Bishal Baroi</p>
                        <p className="text-[#444746] dark:text-[#a0a0a0] mb-6">bishal@example.com</p>
                        <Button variant="outline" className="border-[#c4c7c5] dark:border-[#444] bg-white dark:bg-[#2a2b2f] hover:bg-[#e1e5ea] dark:bg-[#38393d] text-[#1f1f1f] dark:text-white">Change Password</Button>
                      </div>
                    </div>
                  )}
                  {settingsTab === "appearance" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-normal text-[#1f1f1f] dark:text-white mb-2">Appearance</h3>
                        <p className="text-[#444746] dark:text-[#a0a0a0]">Customize how NotebookLM looks on your device.</p>
                      </div>
                      <div className="border border-[#e3e3e3] dark:border-[#333] rounded-xl p-6 bg-white dark:bg-[#131314] flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#1f1f1f] dark:text-white text-lg">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                          <p className="text-[#444746] dark:text-[#a0a0a0] text-sm">Toggle the application theme.</p>
                        </div>
                        <div 
                          onClick={() => {
                            setIsDarkMode(!isDarkMode);
                            document.documentElement.classList.toggle('dark');
                          }}
                          className={`w-12 h-7 rounded-full relative cursor-pointer shadow-inner transition-colors ${isDarkMode ? 'bg-[#0b57d0]' : 'bg-[#e3e3e3] border border-[#a0a0a0]'}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all duration-200 ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {settingsTab === "help" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-normal text-[#1f1f1f] dark:text-white mb-2">Help & Feedback</h3>
                        <p className="text-[#444746] dark:text-[#a0a0a0]">We would love to hear your thoughts.</p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="bg-white dark:bg-[#131314] border border-[#e3e3e3] dark:border-[#333] p-4 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#1f1f1f] dark:text-white">Contact Support</p>
                            <p className="text-[#444746] dark:text-[#a0a0a0] text-sm">Send us an email at <a href="mailto:support@notebooklm.com" className="text-[#0b57d0] hover:underline">support@notebooklm.com</a></p>
                          </div>
                          <Button variant="outline" className="border-[#c4c7c5] dark:border-[#444] bg-white dark:bg-[#2a2b2f] hover:bg-[#e1e5ea] dark:bg-[#38393d] text-[#1f1f1f] dark:text-white" onClick={() => window.location.href="mailto:support@notebooklm.com"}>Email Us</Button>
                        </div>
                        <Button variant="outline" className="border-[#c4c7c5] dark:border-[#444] bg-white dark:bg-[#131314] hover:bg-white dark:bg-[#2a2b2f] text-[#1f1f1f] dark:text-white w-full justify-start h-12 px-6 rounded-xl">Send Feedback</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DialogContent className="sm:max-w-[425px] bg-[#f8f9fa] dark:bg-[#1e1f20] border-[#e3e3e3] dark:border-[#333] text-[#1f1f1f] dark:text-[#e3e3e3]">
              <DialogHeader>
                <DialogTitle className="text-xl font-normal text-[#1f1f1f] dark:text-white">My Profile</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-6">
                <div className="w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-4xl text-white font-medium shadow-sm ring-4 ring-pink-400 mb-4">
                  B
                </div>
                <h3 className="text-2xl font-medium text-[#1f1f1f] dark:text-white mb-1">Bishal Baroi</h3>
                <p className="text-[#444746] dark:text-[#a0a0a0] mb-6">bishal@example.com</p>
                <div className="w-full border-t border-[#e3e3e3] dark:border-[#333] pt-6 flex justify-around">
                  <div className="text-center">
                    <p className="text-2xl font-medium text-[#1f1f1f] dark:text-white">{notebooks.length}</p>
                    <p className="text-sm text-[#444746] dark:text-[#a0a0a0]">Notebooks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-medium text-[#1f1f1f] dark:text-white">Pro</p>
                    <p className="text-sm text-[#444746] dark:text-[#a0a0a0]">Plan</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsProfileOpen(false)} variant="outline" className="w-full border-[#c4c7c5] dark:border-[#444] bg-white dark:bg-[#2a2b2f] hover:bg-[#e1e5ea] dark:bg-[#38393d] text-[#1f1f1f] dark:text-white rounded-xl h-12">Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9fa] dark:bg-[#1b1b1d] text-[#1f1f1f] dark:text-[#e3e3e3] overflow-hidden font-sans">
      {/* Workspace Navbar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-[#e3e3e3] dark:border-[#333] shrink-0 bg-[#f8f9fa] dark:bg-[#1b1b1d] z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full transition-colors">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Notebook className="w-5 h-5 text-black" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setCurrentNotebook(null)}
              className="flex items-center gap-1.5 text-[#444746] dark:text-[#a0a0a0] hover:text-[#1f1f1f] dark:text-white cursor-pointer px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Home</span>
            </div>
            <div className="w-[1px] h-4 bg-[#444] mx-1"></div>
            <h1 className="text-[1.1rem] font-medium tracking-tight truncate max-w-[300px] text-[#1f1f1f] dark:text-white">
              {currentNotebook.title}
            </h1>
            <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-[#2a2b2f] border border-[#c4c7c5] dark:border-[#444] flex items-center gap-1 text-[#444746] dark:text-[#a0a0a0]">
              <Globe className="w-3 h-3" /> Shared
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="rounded-full bg-[#1a73e8] text-white hover:bg-[#1557b0] dark:bg-white dark:text-black dark:hover:bg-gray-100 h-9 px-4 text-sm font-medium border-none"
            onClick={() => setIsNewNotebookOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create notebook
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<button type="button" className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors" />}>
                <Settings className="w-5 h-5 text-[#444746] dark:text-[#a0a0a0] hover:text-[#1f1f1f] dark:text-white transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#2a2b2f] border-[#c4c7c5] dark:border-[#444] text-[#1f1f1f] dark:text-[#e3e3e3] mt-2">
              <DropdownMenuItem onClick={() => { setSettingsTab("account"); setIsSettingsOpen(true); }} className="cursor-pointer hover:bg-[#e1e5ea] dark:bg-[#38393d] focus:bg-[#e1e5ea] dark:bg-[#38393d] focus:text-[#1f1f1f] dark:text-white">Account Preferences</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSettingsTab("appearance"); setIsSettingsOpen(true); }} className="cursor-pointer hover:bg-[#e1e5ea] dark:bg-[#38393d] focus:bg-[#e1e5ea] dark:bg-[#38393d] focus:text-[#1f1f1f] dark:text-white">Appearance</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSettingsTab("help"); setIsSettingsOpen(true); }} className="cursor-pointer hover:bg-[#e1e5ea] dark:bg-[#38393d] focus:bg-[#e1e5ea] dark:bg-[#38393d] focus:text-[#1f1f1f] dark:text-white">Help & Feedback</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger render={<button type="button" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[#1f1f1f] dark:text-white text-sm font-medium shadow-sm ring-1 ring-red-400 cursor-pointer hover:ring-2 hover:ring-red-300 transition-all" />}>
                B
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#2a2b2f] border-[#c4c7c5] dark:border-[#444] text-[#1f1f1f] dark:text-[#e3e3e3] mt-2">
              <div className="px-2 py-3 mb-1 border-b border-[#c4c7c5] dark:border-[#444]">
                <p className="font-medium text-[#1f1f1f] dark:text-white">Bishal Baroi</p>
                <p className="text-xs text-[#444746] dark:text-[#a0a0a0] mt-0.5">bishal@example.com</p>
              </div>
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer hover:bg-[#e1e5ea] dark:hover:bg-[#38393d] focus:bg-[#e1e5ea] dark:focus:bg-[#38393d] focus:text-[#1f1f1f] dark:focus:text-white">My Profile</DropdownMenuItem>

              <DropdownMenuItem onClick={() => alert("Sign out clicked (Demo)")} className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-300 mt-1">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL - Sources */}
        <div className="w-[300px] bg-[#f0f4f9] dark:bg-[#222327] flex flex-col border-r border-[#e3e3e3] dark:border-[#333] shrink-0">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">Sources</h2>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex flex-col justify-between py-1.5 px-1 cursor-pointer opacity-70 hover:opacity-100 border border-[#c4c7c5] dark:border-[#444] rounded">
                <div className="w-full h-[2px] bg-white rounded-full"></div>
                <div className="w-full h-[2px] bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm text-[#1f1f1f] dark:text-[#e3e3e3] mb-4">
                <span>Select all sources</span>
                <div className="w-4 h-4 rounded border border-[#666] flex items-center justify-center bg-[#444]">
                  <CheckCircle2 className="w-3 h-3 text-[#1f1f1f] dark:text-white" />
                </div>
              </div>
              
              {sources.map((src) => (
                <div key={src.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-4 h-4 text-[#4285f4] shrink-0" />
                    <span className="text-sm text-[#1f1f1f] dark:text-[#e3e3e3] truncate">{src.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoreVertical className="w-4 h-4 text-[#8e918f] dark:text-[#666] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-4 h-4 rounded border border-[#666] flex items-center justify-center bg-[#4285f4] border-none">
                      <CheckCircle2 className="w-3 h-3 text-[#1f1f1f] dark:text-white" />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-2 mt-4">
                <Button 
                  onClick={() => setIsUploadOpen(true)}
                  variant="outline" 
                  className="w-full border-dashed border-2 bg-transparent hover:bg-white/5 text-[#4285f4] border-[#c4c7c5] dark:border-[#444] rounded-lg h-10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Source
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* MIDDLE PANEL - Chat & Guide */}
        <div className="flex-1 flex flex-col bg-[#f8f9fa] dark:bg-[#1b1b1d] relative">
          <div className="flex items-center justify-between p-4 px-6 border-b border-[#e3e3e3] dark:border-[#333] shrink-0">
            <h2 className="text-sm font-medium text-[#1f1f1f] dark:text-white">Chat</h2>
            <MoreVertical className="w-4 h-4 text-[#444746] dark:text-[#a0a0a0] cursor-pointer hover:text-[#1f1f1f] dark:text-white" />
          </div>
          
          <div className="flex-1 overflow-y-auto px-8 lg:px-24" ref={scrollRef}>
            <div className="py-8 pb-32">
              {messages.length === 0 && (
                <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-white dark:bg-[#2a2b2f] rounded-2xl overflow-hidden shadow-2xl mb-8">
                    {/* Cover Image */}
                    <div 
                      className="h-[240px] w-full relative bg-cover bg-center flex items-end p-6"
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=1200&auto=format&fit=crop')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#2a2b2f] via-black/40 to-transparent"></div>
                      <div className="relative z-10 w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                            <Sparkles className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-medium text-white shadow-sm">Literature & Arts</span>
                        </div>
                        <h1 className="text-4xl font-normal text-white leading-tight drop-shadow-md tracking-tight mb-2">{currentNotebook.title}</h1>
                        <p className="text-white/70 text-xs font-medium">{sources.length} sources • {new Date(currentNotebook.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    
                    {/* Analysis Text */}
                    <div className="p-8 pt-6">
                      <p className="text-[#444746] dark:text-[#d1d1d1] text-[15px] leading-relaxed mb-8">
                        Featuring the complete works of one of history&apos;s most beloved authors, this notebook is a valuable resource for students and scholars exploring <span className="font-semibold text-[#1f1f1f] dark:text-white">{currentNotebook.title}</span>—and for writers looking for new inspiration. Researchers can <span className="font-semibold text-[#1f1f1f] dark:text-white">trace core themes</span> from early experimental works to famous novels, using the sources for additional context about the life. At the same time, <span className="font-semibold text-[#1f1f1f] dark:text-white">fan fiction</span> authors can find fresh ideas or surface key facts from the fictional worlds. For inspiration, in the Studio panel, we&apos;ve included character studies, <span className="font-semibold text-[#1f1f1f] dark:text-white">potential spinoff novel ideas</span>, and even a proposed treatment for a book.
                      </p>
                      
                      <div className="flex items-center justify-between text-[#444746] dark:text-[#a0a0a0]">
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <BookOpen className="w-4 h-4" /> Creator Notes
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-[#f8f9fa] dark:bg-[#1b1b1d] hover:bg-black/5 dark:hover:bg-white/10 border border-[#e3e3e3] dark:border-[#333] text-[#444746] dark:text-[#a0a0a0]"><Copy className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-[#444746] dark:text-[#a0a0a0]"><ThumbsUp className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-[#444746] dark:text-[#a0a0a0]"><ThumbsDown className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="max-w-3xl mx-auto space-y-8">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {msg.role === "user" ? (
                      <div className="self-end bg-white dark:bg-[#2a2b2f] text-[#1f1f1f] dark:text-white px-5 py-3.5 rounded-2xl rounded-br-sm max-w-[85%] text-[15px] leading-relaxed shadow-sm border border-[#38393d]">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="self-start flex gap-4 w-full">
                        <div className="w-8 h-8 rounded-full bg-[#f8f9fa] dark:bg-[#1b1b1d] border border-[#e3e3e3] dark:border-[#333] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                          <Sparkles className="w-4 h-4 text-[#1f1f1f] dark:text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[#1f1f1f] dark:text-[#e3e3e3] text-[15px] leading-relaxed mt-1">
                            {msg.content}
                          </div>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.sources.map((src, i) => (
                                <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f8f9fa] dark:bg-[#1b1b1d] hover:bg-white dark:bg-[#2a2b2f] rounded-full text-xs font-medium text-[#444746] dark:text-[#a0a0a0] cursor-pointer transition-colors border border-[#e3e3e3] dark:border-[#333]">
                                  <span className="w-4 h-4 rounded-full bg-white dark:bg-[#2a2b2f] flex items-center justify-center text-[9px] text-[#1f1f1f] dark:text-white">
                                    {src.id}
                                  </span>
                                  {src.text.length > 20 ? "Source" : src.text}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Chat Input */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-[#1b1b1d] via-[#1b1b1d] to-transparent shrink-0">
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
                {!inputText && <span className="text-[#8e918f] dark:text-[#666] text-[15px]">Start typing...</span>}
              </div>
              <Input 
                className="w-full bg-[#f8f9fa] dark:bg-[#1b1b1d] border-[#c4c7c5] dark:border-[#444] group-hover:border-[#666] text-[#1f1f1f] dark:text-white h-14 pl-6 md:pl-6 pr-32 rounded-3xl focus-visible:ring-1 focus-visible:ring-[#888] shadow-lg text-[15px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder=""
                disabled={isStreaming}
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-3">
                <span className="text-[#8e918f] dark:text-[#666] text-xs">{sources.length} sources</span>
                <Button 
                  size="icon" 
                  className={`w-10 h-10 rounded-full transition-all border-none ${
                    inputText.trim() 
                      ? "bg-[#4285f4] text-[#1f1f1f] dark:text-white hover:bg-[#3367d6]" 
                      : "bg-white dark:bg-[#2a2b2f] text-[#8e918f] dark:text-[#666] hover:bg-white dark:bg-[#2a2b2f]"
                  }`}
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isStreaming}
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Studio */}
        <div className={`${isStudioOpen ? 'w-[340px]' : 'w-[60px]'} bg-[#f0f4f9] dark:bg-[#222327] flex flex-col border-l border-[#e3e3e3] dark:border-[#333] shrink-0 transition-all duration-300`}>
          <div className={`p-4 flex items-center ${isStudioOpen ? 'justify-between' : 'justify-center'}`}>
            {isStudioOpen && <h2 className="text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3] whitespace-nowrap">Studio</h2>}
            <div 
              className="w-6 h-6 flex flex-col justify-between py-1.5 px-1 cursor-pointer opacity-70 hover:opacity-100 rotate-90 border border-[#c4c7c5] dark:border-[#444] rounded shrink-0"
              onClick={() => setIsStudioOpen(!isStudioOpen)}
            >
              <div className="w-full h-[2px] bg-white rounded-full"></div>
              <div className="w-full h-[2px] bg-white rounded-full"></div>
            </div>
          </div>
          
          {isStudioOpen && (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                
                {/* Studio Actions */}
                <div 
                  className="bg-[#f8f9fa] dark:bg-[#1b1b1d] border border-[#e3e3e3] dark:border-[#333] p-4 rounded-2xl cursor-pointer hover:bg-white dark:bg-[#2a2b2f] transition-colors flex items-start gap-4"
                  onClick={() => handleSendMessage("Generate an audio overview of these sources.")}
                >
                  <div className="mt-1 w-8 h-8 rounded-full bg-white dark:bg-[#2a2b2f] flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4 text-[#a8c7fa]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3] mb-1">Audio Overview</h3>
                    <p className="text-[13px] text-[#444746] dark:text-[#a0a0a0] leading-relaxed">Generate a deep dive conversation about these sources.</p>
                  </div>
                </div>

                <div 
                  className="bg-[#f8f9fa] dark:bg-[#1b1b1d] border border-[#e3e3e3] dark:border-[#333] p-4 rounded-2xl cursor-pointer hover:bg-white dark:bg-[#2a2b2f] transition-colors flex items-start gap-4"
                  onClick={() => handleSendMessage("Give me a synthesized summary of all selected sources.")}
                >
                  <div className="mt-1 w-8 h-8 rounded-full bg-white dark:bg-[#2a2b2f] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#a8c7fa]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3] mb-1">Summary</h3>
                    <p className="text-[13px] text-[#444746] dark:text-[#a0a0a0] leading-relaxed">Get a synthesized summary of all selected sources.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-white dark:bg-[#2a2b2f] rounded-xl p-3 border border-[#38393d]">
                    <p className="text-[12px] text-[#444746] dark:text-[#a0a0a0] flex items-start gap-2 leading-relaxed">
                      <Sparkles className="w-4 h-4 text-[#ffc107] shrink-0 mt-0.5" />
                      These studio outputs give an in-depth visual and audio overview of the notebook topic!
                    </p>
                  </div>
                </div>

              </div>
            </ScrollArea>
          )}
        </div>

      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#f8f9fa] dark:bg-[#1e1f20] border-[#e3e3e3] dark:border-[#333]">
          <DialogHeader>
            <DialogTitle className="text-[#1f1f1f] dark:text-[#e3e3e3]">Upload Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.txt,.md"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#c4c7c5] dark:border-[#444] rounded-xl bg-white dark:bg-[#131314] hover:bg-white dark:bg-[#2a2b2f] transition-colors cursor-pointer"
            >
              {selectedFile ? (
                <>
                  <FileText className="w-8 h-8 text-[#4285f4] mb-4" />
                  <p className="text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3] text-center px-4 truncate w-full">{selectedFile.name}</p>
                  <p className="text-xs text-[#4285f4] mt-2 font-medium">Click to select a different file</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[#4285f4] mb-4" />
                  <p className="text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">Click or drag file to this area to upload</p>
                  <p className="text-xs text-[#747775] dark:text-[#888] mt-2">Support for PDF, TXT, and Markdown files.</p>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setIsUploadOpen(false); setSelectedFile(null); }} variant="outline" className="bg-transparent border-[#e3e3e3] dark:border-[#333] text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-white/5">Cancel</Button>
            <Button 
              onClick={() => { 
                if (selectedFile) {
                  const fileType = selectedFile.name.split('.').pop() || 'file';
                  const newSource = {
                    id: Date.now(),
                    title: selectedFile.name,
                    type: fileType.toLowerCase(),
                    selected: true,
                  };
                  setSources([...sources, newSource]);
                  setIsUploadOpen(false);
                  setSelectedFile(null);
                }
              }} 
              className="bg-[#4285f4] hover:bg-[#3367d6] text-[#1f1f1f] dark:text-white"
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#f8f9fa] dark:bg-[#1e1f20] border-[#e3e3e3] dark:border-[#333] text-[#1f1f1f] dark:text-[#e3e3e3]">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal text-[#1f1f1f] dark:text-white">My Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-4xl text-white font-medium shadow-sm ring-4 ring-pink-400 mb-4">
              B
            </div>
            <h3 className="text-2xl font-medium text-[#1f1f1f] dark:text-white mb-1">Bishal Baroi</h3>
            <p className="text-[#444746] dark:text-[#a0a0a0] mb-6">bishal@example.com</p>
            <div className="w-full border-t border-[#e3e3e3] dark:border-[#333] pt-6 flex justify-around">
              <div className="text-center">
                <p className="text-2xl font-medium text-[#1f1f1f] dark:text-white">{notebooks.length}</p>
                <p className="text-sm text-[#444746] dark:text-[#a0a0a0]">Notebooks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-[#1f1f1f] dark:text-white">Pro</p>
                <p className="text-sm text-[#444746] dark:text-[#a0a0a0]">Plan</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsProfileOpen(false)} variant="outline" className="w-full border-[#c4c7c5] dark:border-[#444] bg-white dark:bg-[#2a2b2f] hover:bg-[#e1e5ea] dark:bg-[#38393d] text-[#1f1f1f] dark:text-white rounded-xl h-12">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
