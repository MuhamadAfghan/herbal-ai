"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Camera,
  Upload,
  Leaf,
  Sparkles,
  ArrowRight,
  CheckCircle,
  X,
  Home,
  Headphones,
  Info,
  StopCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function UploadImagePage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef(null)
  const abortControllerRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSearch = async () => {
    if (selectedImage) {
      setIsLoading(true)

      // Create abort controller
      abortControllerRef.current = new AbortController()

      // Store in sessionStorage for results page
      const reader = new FileReader()
      reader.onload = () => {
        if (!abortControllerRef.current?.signal.aborted) {
          sessionStorage.setItem("uploadedImage", reader.result)
          sessionStorage.setItem(
            "uploadedImageFile",
            JSON.stringify({
              name: selectedImage.name,
              size: selectedImage.size,
              type: selectedImage.type,
            }),
          )

          // Small delay to show loading state
          setTimeout(() => {
            if (!abortControllerRef.current?.signal.aborted) {
              router.push(`/results?q=identifikasi+tanaman+dari+gambar&type=image`)
            }
            setIsLoading(false)
          }, 500)
        }
      }
      reader.readAsDataURL(selectedImage)
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
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
                AI Vision
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
                variant="ghost"
                size="sm"
                onClick={() => router.push("/voice")}
                className="flex items-center gap-2 text-green-700 hover:bg-green-50"
              >
                <Headphones className="h-4 w-4" />
                <span className="hidden md:inline">Voice Search</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white"
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium shadow-sm">
              <Camera className="h-4 w-4" />
              AI Vision Technology
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Upload Gambar
              <br />
              <span className="text-3xl md:text-5xl">Identifikasi Tanaman</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload foto tanaman obat untuk identifikasi otomatis menggunakan teknologi AI Vision. Sistem akan
              menganalisis gambar dan memberikan informasi lengkap tentang tanaman tersebut.
            </p>
          </div>

          {/* Upload Interface */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100">
            <div className="text-center space-y-8">
              {!imagePreview ? (
                <div
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  className={`border-4 border-dashed border-green-300 rounded-2xl p-12 transition-all duration-300 ${
                    isLoading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:border-green-400 hover:bg-green-50"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-12 w-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        {isLoading ? "Memproses..." : "Upload Gambar Tanaman"}
                      </h3>
                      <p className="text-gray-600">
                        {isLoading
                          ? "Sedang memproses gambar Anda..."
                          : "Klik di sini atau drag & drop gambar tanaman obat yang ingin diidentifikasi"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">Format: JPG, PNG, JPEG (Max: 5MB)</p>
                    </div>
                    {!isLoading && (
                      <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
                        Pilih Gambar
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-md max-h-96 object-cover rounded-xl shadow-lg mx-auto"
                    />
                    {!isLoading && (
                      <Button
                        onClick={clearImage}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {isLoading ? "Sedang menganalisis..." : `Gambar berhasil dipilih: ${selectedImage?.name}`}
                      </span>
                    </div>
                    <p className="text-green-700 text-sm mb-4">
                      {isLoading
                        ? "AI Vision sedang menganalisis gambar tanaman Anda..."
                        : "Gambar siap untuk dianalisis menggunakan AI Vision"}
                    </p>

                    {/* Loading State */}
                    {isLoading && (
                      <div className="flex flex-col items-center gap-3 mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                        <span className="text-sm text-green-600">Memproses upload...</span>
                      </div>
                    )}

                    <div className="flex gap-4 justify-center">
                      {isLoading ? (
                        <Button onClick={handleStop} variant="destructive" className="px-6">
                          <StopCircle className="h-4 w-4 mr-2" />
                          Stop Upload
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                          >
                            Identifikasi Tanaman
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button
                            onClick={clearImage}
                            variant="outline"
                            className="border-green-300 text-green-700 bg-transparent"
                          >
                            Ganti Gambar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />

              {/* Upload Tips */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                  <h4 className="font-semibold text-green-800 mb-3">Tips Foto yang Baik:</h4>
                  <ul className="text-sm text-green-700 space-y-2 text-left">
                    <li>• Foto tanaman dengan pencahayaan yang cukup</li>
                    <li>• Fokus pada daun, bunga, atau bagian khas tanaman</li>
                    <li>• Hindari foto yang blur atau terlalu gelap</li>
                    <li>• Sertakan bagian tanaman yang mudah dikenali</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                  <h4 className="font-semibold text-teal-800 mb-3">Yang Bisa Diidentifikasi:</h4>
                  <ul className="text-sm text-teal-700 space-y-2 text-left">
                    <li>• Tanaman obat tradisional Indonesia</li>
                    <li>• Herbal dan rempah-rempah</li>
                    <li>• Tanaman dengan khasiat medis</li>
                    <li>• Daun, bunga, akar, dan buah obat</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AI Vision Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Teknologi AI Vision</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Image Processing</h4>
                <p className="text-sm text-gray-600">
                  Menganalisis gambar tanaman menggunakan teknologi computer vision yang canggih
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">AI Recognition</h4>
                <p className="text-sm text-gray-600">
                  Mengenali jenis tanaman berdasarkan karakteristik visual menggunakan AI Gemini Vision
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Detailed Info</h4>
                <p className="text-sm text-gray-600">
                  Memberikan informasi lengkap tentang khasiat, cara penggunaan, dan dosis tanaman
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
