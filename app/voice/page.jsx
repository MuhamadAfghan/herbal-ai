"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mic,
  MicOff,
  Leaf,
  Sparkles,
  ArrowRight,
  Volume2,
  Home,
  Upload,
  Headphones,
  CheckCircle,
  StopCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function VoiceSearchContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Get query from URL params if exists
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      // recognitionRef.current.lang = "en-US"
      recognitionRef.current.lang = "id-ID";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [searchParams]);

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoading(true);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      // Small delay to show loading state, then navigate
      setTimeout(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          router.push(
            `/results?q=${encodeURIComponent(searchQuery)}&type=voice`
          );
        }
        setIsLoading(false);
      }, 500);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  HerbalAI
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hidden sm:flex"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                AI Speech-to-Text
              </Badge>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-green-700 hover:bg-green-50"
              >
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Beranda</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                <Headphones className="h-4 w-4" />
                <span className="hidden md:inline">Voice Search</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/upload")}
                className="flex items-center gap-2 text-green-700 hover:bg-green-50"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden md:inline">Upload Gambar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium shadow-sm">
              <Headphones className="h-4 w-4" />
              AI Speech-to-Text Technology
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Voice Search
              <br />
              <span className="text-3xl md:text-5xl">Tanaman Obat</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Teknologi AI Speech-to-Text memungkinkan Anda untuk mencari
              tanaman obat hanya dengan berbicara. Ceritakan keluhan kesehatan
              Anda dengan natural dan biarkan AI menemukan solusinya.
            </p>
          </div>

          {/* Voice Interface */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-100">
            <div className="text-center space-y-8">
              {/* Microphone Button */}
              <div className="relative">
                <Button
                  onClick={isListening ? stopListening : handleVoiceSearch}
                  disabled={isLoading}
                  className={`w-32 h-32 rounded-full text-white shadow-2xl transition-all duration-300 ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse scale-110"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-16 w-16" />
                  ) : (
                    <Mic className="h-16 w-16" />
                  )}
                </Button>

                {isListening && (
                  <div className="absolute -inset-4 rounded-full border-4 border-red-300 animate-ping"></div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {isListening
                    ? "Mendengarkan..."
                    : isLoading
                    ? "Memproses..."
                    : "Klik untuk Mulai Berbicara"}
                </h3>
                <p className="text-gray-600">
                  {isListening
                    ? "Ceritakan keluhan kesehatan Anda dengan jelas"
                    : isLoading
                    ? "Sedang memproses permintaan Anda..."
                    : "Contoh: 'Saya sering sakit kepala dan sulit tidur' atau 'Batuk saya tidak kunjung sembuh'"}
                </p>
              </div>

              {/* Voice Input Display */}
              {searchQuery && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <h4 className="font-semibold text-blue-800">
                      Yang Anda Katakan:
                    </h4>
                  </div>
                  <p className="text-blue-700 text-lg italic mb-4">
                    "{searchQuery}"
                  </p>
                  <div className="flex gap-4 justify-center">
                    {isLoading ? (
                      <Button
                        onClick={handleStop}
                        variant="destructive"
                        className="px-6"
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop Pencarian
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleSearch}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        >
                          Cari Tanaman Obat
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setSearchQuery("")}
                          variant="outline"
                          className="border-blue-300 text-blue-700 bg-transparent"
                        >
                          Hapus & Coba Lagi
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center gap-4 text-blue-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Memproses pencarian voice...</span>
                </div>
              )}

              {/* Voice Tips */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    Tips Penggunaan Voice Search:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-2 text-left">
                    <li>• Bicara dengan jelas dan tidak terlalu cepat</li>
                    <li>• Jelaskan gejala dengan detail</li>
                    <li>• Gunakan bahasa Indonesia yang natural</li>
                    <li>• Pastikan lingkungan tidak terlalu bising</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    Contoh Keluhan yang Bisa Dicari:
                  </h4>
                  <ul className="text-sm text-purple-700 space-y-2 text-left">
                    <li>• "Saya sering sakit kepala dan pusing"</li>
                    <li>• "Batuk saya sudah seminggu tidak sembuh"</li>
                    <li>• "Perut saya sering mual dan kembung"</li>
                    <li>• "Saya sulit tidur dan sering gelisah"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Teknologi AI Speech-to-Text
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Speech Recognition
                </h4>
                <p className="text-sm text-gray-600">
                  Mengkonversi suara menjadi teks dengan akurasi tinggi
                  menggunakan Web Speech API
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  AI Processing
                </h4>
                <p className="text-sm text-gray-600">
                  Menganalisis teks keluhan menggunakan AI Gemini untuk mencari
                  tanaman obat yang tepat
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Smart Matching
                </h4>
                <p className="text-sm text-gray-600">
                  Mencocokkan gejala dengan database tanaman obat tradisional
                  Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VoiceSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VoiceSearchContent />
    </Suspense>
  );
}
