"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Mic,
  Camera,
  Leaf,
  Sparkles,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  Star,
  Volume2,
  Home,
  Upload,
  FileText,
  Headphones,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const router = useRouter()
  const recognitionRef = useRef(null)

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "id-ID"

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
        // Auto redirect to voice search page with query
        router.push(`/voice?q=${encodeURIComponent(transcript)}`)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [router])

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    } else {
      router.push("/voice")
    }
  }

  const handleTextSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/results?q=${encodeURIComponent(searchQuery)}&type=text`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTextSearch()
    }
  }

  const handleSymptomClick = (symptom) => {
    router.push(`/results?q=${encodeURIComponent(symptom)}&type=text`)
  }

  const commonSymptoms = [
    "Sakit kepala",
    "Batuk",
    "Pilek",
    "Demam",
    "Sakit perut",
    "Mual",
    "Diare",
    "Insomnia",
    "Stress",
    "Sakit gigi",
  ]

  const herbalFacts = [
    {
      icon: Users,
      number: "80%",
      text: "Populasi dunia menggunakan obat herbal",
      link: "https://www.who.int/news-room/fact-sheets/detail/traditional-complementary-and-integrative-medicine",
    },
    {
      icon: Leaf,
      number: "50,000+",
      text: "Spesies tanaman obat di dunia",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3560124/",
    },
    {
      icon: TrendingUp,
      number: "15%",
      text: "Pertumbuhan pasar herbal per tahun",
      link: "https://www.grandviewresearch.com/industry-analysis/herbal-medicine-market",
    },
    {
      icon: Shield,
      number: "5,000",
      text: "Tahun sejarah pengobatan herbal",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3178181/",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-green-100 sticky top-0 z-50 shadow-sm">
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
              <Badge variant="secondary" className="bg-green-100 text-green-700 hidden sm:flex">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Speech-to-Text
              </Badge>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
              >
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Beranda</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/voice")}
                className="flex items-center gap-2 text-green-700 hover:bg-green-50"
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

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="hidden sm:inline">AI Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-16">
          {/* Hero */}
          <div className="text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-medium shadow-sm">
              <Leaf className="h-4 w-4" />
              Penerapan AI Speech-to-Text pada Aplikasi Pencarian Tanaman Obat
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
              Revolusi Pencarian
              <br />
              <span className="text-2xl md:text-4xl lg:text-6xl">Tanaman Obat dengan AI</span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              Meningkatkan aksesibilitas dan akurasi identifikasi tanaman obat melalui teknologi AI Speech-to-Text.
              Cukup bicara, dan temukan solusi herbal untuk kesehatan Anda.
            </p>

            {/* Main Features */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300"
                onClick={() => router.push("/voice")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">AI Speech-to-Text</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Ceritakan keluhan Anda dengan suara, AI akan menganalisis dan mencari tanaman obat yang tepat
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                    Mulai Voice Search
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300"
                onClick={() => router.push("/upload")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Upload Gambar</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Upload foto tanaman untuk identifikasi otomatis menggunakan AI Vision
                  </p>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    Upload Gambar
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Pencarian Teks</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Ketik nama tanaman atau keluhan untuk mendapatkan informasi lengkap
                  </p>
                  <div className="flex items-center bg-white rounded-lg border p-2">
                    <Search className="h-4 w-4 text-gray-400 ml-2" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Cari tanaman obat..."
                      className="border-0 focus-visible:ring-0 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleTextSearch}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Cari
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Voice Search Highlight */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 md:p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <Volume2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">Fitur AI Speech-to-Text</h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base mb-4">
              Ceritakan keluhan Anda dengan suara! Teknologi AI kami akan mengubah ucapan Anda menjadi teks dan mencari
              tanaman obat yang tepat.
            </p>
            <Button
              onClick={handleVoiceSearch}
              disabled={isListening}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 py-2"
            >
              <Mic className={`h-4 w-4 mr-2 ${isListening ? "animate-pulse" : ""}`} />
              {isListening ? "Mendengarkan..." : "Coba Sekarang"}
            </Button>
          </div>

          {/* Quick Symptom Search */}
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">Keluhan Umum yang Sering Dicari</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {commonSymptoms.map((symptom, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSymptomClick(symptom)}
                  className="rounded-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 text-xs md:text-sm"
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          {/* Herbal Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
            {herbalFacts.map((fact, index) => (
              <a
                key={index}
                href={fact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-green-100 hover:shadow-lg transition-all cursor-pointer group"
              >
                <fact.icon className="h-6 md:h-8 w-6 md:w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-xl md:text-2xl font-bold text-green-800 mb-1">{fact.number}</div>
                <div className="text-xs md:text-sm text-gray-600">{fact.text}</div>
              </a>
            ))}
          </div>

          {/* How It Works */}
          <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Bagaimana AI Speech-to-Text Bekerja?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Mic className="text-white font-bold text-lg md:text-xl" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Bicara dengan Natural</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Ceritakan keluhan kesehatan Anda dengan bahasa sehari-hari menggunakan teknologi Speech-to-Text
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="text-white font-bold text-lg md:text-xl" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">AI Menganalisis</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  AI mengkonversi suara ke teks dan menganalisis keluhan untuk mencari tanaman obat yang sesuai
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Leaf className="text-white font-bold text-lg md:text-xl" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Dapatkan Solusi</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Terima rekomendasi tanaman obat lengkap dengan cara penggunaan dan dosis yang tepat
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 md:p-8 lg:p-12 text-center text-white shadow-2xl mx-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Mulai Konsultasi Herbal Anda Sekarang</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-green-100">
              Ribuan orang telah menemukan solusi kesehatan alami mereka
            </p>
            <Button
              onClick={() => router.push("/voice")}
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Mulai Voice Search
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-green-100 mt-20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">HerbalAI</span>
            </div>
            <p className="text-gray-600 mb-2">© 2024 HerbalAI - Solusi Kesehatan Alami dengan AI</p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Informasi yang diberikan hanya untuk referensi. Selalu konsultasikan dengan dokter atau ahli kesehatan
              sebelum menggunakan tanaman obat, terutama jika Anda memiliki kondisi medis tertentu atau sedang
              mengonsumsi obat lain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
