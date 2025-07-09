"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Camera,
  Leaf,
  AlertCircle,
  Info,
  Home,
  Upload,
  FileText,
  Headphones,
  Mic,
  MicOff,
  X,
  CheckCircle,
  StopCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ResultsContent() {
  // State untuk hasil pencarian yang sudah ada
  const [searchResults, setSearchResults] = useState([]);
  const [displayedQuery, setDisplayedQuery] = useState(""); // Query yang ditampilkan di hasil
  const [displayedType, setDisplayedType] = useState("text");
  const [displayedImagePreview, setDisplayedImagePreview] = useState(null);

  // State untuk pencarian baru
  const [newQuery, setNewQuery] = useState(""); // Query input baru
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Setup Speech Recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "id-ID";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Load initial search
  useEffect(() => {
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "text";

    if (query) {
      setDisplayedQuery(query);
      setDisplayedType(type);
      setNewQuery(query); // Set initial value for new search

      // Handle image search
      if (type === "image") {
        const storedImage = sessionStorage.getItem("uploadedImage");
        const storedImageFile = sessionStorage.getItem("uploadedImageFile");

        if (storedImage) {
          setDisplayedImagePreview(storedImage);

          if (storedImageFile) {
            const fileInfo = JSON.parse(storedImageFile);
            fetch(storedImage)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], fileInfo.name, {
                  type: fileInfo.type,
                });
                handleSearch(query, file, type);
              });
          }
        }
      } else {
        handleSearch(query, null, type);
      }
    }
  }, [searchParams]);

  const handleSearch = async (
    query = newQuery,
    imageFile = selectedImage,
    type = displayedType
  ) => {
    if (!query.trim() && !imageFile) return;

    setIsLoading(true);
    setError("");

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("query", query || "identifikasi tanaman");
      formData.append("type", imageFile ? "image" : "text");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/search", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setSearchResults([]);
      } else {
        setSearchResults(data.results || []);
        // Update displayed query only after successful search
        setDisplayedQuery(query);
        if (imageFile) {
          setDisplayedImagePreview(imagePreview);
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Pencarian dibatalkan");
      } else {
        setError("Terjadi kesalahan saat mencari. Silakan coba lagi.");
      }
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch(newQuery, null, "text");
    }
  };

  const getSearchTypeInfo = (type) => {
    switch (type) {
      case "voice":
        return {
          icon: Headphones,
          label: "Voice Search",
          color: "blue",
          description: "Pencarian menggunakan AI Speech-to-Text",
        };
      case "image":
        return {
          icon: Camera,
          label: "Image Search",
          color: "green",
          description: "Identifikasi tanaman dari gambar menggunakan AI Vision",
        };
      default:
        return {
          icon: FileText,
          label: "Text Search",
          color: "orange",
          description: "Pencarian teks manual",
        };
    }
  };

  const displayedTypeInfo = getSearchTypeInfo(displayedType);
  const DisplayedIcon = displayedTypeInfo.icon;

  // Render different search interfaces based on displayed type
  const renderSearchInterface = () => {
    switch (displayedType) {
      case "voice":
        return (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-center space-y-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Pencarian Ulang dengan Voice Search
              </h3>

              {/* Voice Button */}
              <div className="relative">
                <Button
                  onClick={
                    isListening
                      ? () => recognitionRef.current?.stop()
                      : handleVoiceSearch
                  }
                  disabled={isLoading}
                  className={`w-24 h-24 rounded-full text-white shadow-lg transition-all duration-300 ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse scale-110"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                {isListening && (
                  <div className="absolute -inset-2 rounded-full border-2 border-red-300 animate-ping"></div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-blue-700">
                  {isListening
                    ? "Mendengarkan keluhan Anda..."
                    : "Klik mikrofon untuk menyampaikan keluhan"}
                </p>

                {newQuery && (
                  <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Yang Anda katakan:</span>
                    </div>
                    <p className="text-blue-800 italic">"{newQuery}"</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                {isLoading ? (
                  <Button
                    onClick={handleStopSearch}
                    variant="destructive"
                    className="px-6"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop Pencarian
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSearch(newQuery, null, "voice")}
                    disabled={!newQuery.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6"
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Cari dengan Voice
                  </Button>
                )}
                <Button
                  onClick={() => setNewQuery("")}
                  variant="outline"
                  className="border-blue-300 text-blue-700"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
            <div className="text-center space-y-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Upload Gambar Tanaman Lain
              </h3>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-3 border-dashed border-green-300 rounded-xl p-8 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all"
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-green-700 font-medium">
                        Klik untuk upload gambar baru
                      </p>
                      <p className="text-sm text-green-600">
                        Format: JPG, PNG, JPEG (Max: 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-xs max-h-48 object-cover rounded-lg shadow-md mx-auto"
                    />
                    <Button
                      onClick={clearImage}
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 rounded-full w-6 h-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="text-green-700 text-sm">
                      Gambar siap untuk dianalisis: {selectedImage?.name}
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex gap-3 justify-center">
                {isLoading ? (
                  <Button
                    onClick={handleStopSearch}
                    variant="destructive"
                    className="px-6"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop Analisis
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      handleSearch(
                        "identifikasi tanaman dari gambar",
                        selectedImage,
                        "image"
                      )
                    }
                    disabled={!selectedImage}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Analisis Gambar
                  </Button>
                )}
                <Button
                  onClick={clearImage}
                  variant="outline"
                  className="border-green-300 text-green-700 bg-transparent"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        );

      default: // text
        return (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-orange-800 text-center mb-4">
                Pencarian Teks Manual
              </h3>

              <div className="flex items-center bg-white rounded-lg border-2 border-orange-200 p-3">
                <Search className="h-5 w-5 text-orange-400 ml-2" />
                <Input
                  value={newQuery}
                  onChange={(e) => setNewQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik keluhan atau nama tanaman..."
                  className="border-0 focus-visible:ring-0 text-base"
                  disabled={isLoading}
                />
                {isLoading ? (
                  <Button
                    onClick={handleStopSearch}
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                  >
                    <StopCircle className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSearch(newQuery, null, "text")}
                    disabled={!newQuery.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white ml-2"
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Cari
                  </Button>
                )}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setNewQuery("")}
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-orange-700"
                >
                  Reset Input
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
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
              <Badge
                variant="secondary"
                className={`bg-${displayedTypeInfo.color}-100 text-${displayedTypeInfo.color}-700 hidden sm:flex`}
              >
                <DisplayedIcon className="h-3 w-3 mr-1" />
                {displayedTypeInfo.label}
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div
              className={`inline-flex items-center gap-2 bg-gradient-to-r from-${displayedTypeInfo.color}-100 to-${displayedTypeInfo.color}-100 text-${displayedTypeInfo.color}-700 px-6 py-3 rounded-full text-sm font-medium shadow-sm`}
            >
              <DisplayedIcon className="h-4 w-4" />
              Hasil {displayedTypeInfo.label}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Hasil Pencarian
              <br />
              <span className="text-2xl md:text-4xl">Tanaman Obat</span>
            </h1>
          </div>

          {/* Search Summary - Shows DISPLAYED query, not input query */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center gap-4">
              <DisplayedIcon
                className={`h-8 w-8 text-${displayedTypeInfo.color}-600`}
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {displayedTypeInfo.description}:
                </h3>
                {displayedType === "image" && displayedImagePreview ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={displayedImagePreview || "/placeholder.svg"}
                      alt="Search"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <span className="text-gray-600">
                      Identifikasi tanaman dari gambar
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-600 italic">"{displayedQuery}"</p>
                )}
              </div>

              <Badge
                variant="secondary"
                className={`bg-${displayedTypeInfo.color}-100 text-${displayedTypeInfo.color}-700`}
              >
                {displayedTypeInfo.label}
              </Badge>
            </div>
          </div>

          {/* Search Interface - Different for each type */}
          {renderSearchInterface()}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 text-green-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <span className="text-lg">
                  AI sedang menganalisis{" "}
                  {displayedType === "image" ? "gambar" : "keluhan"} Anda...
                </span>
                <span className="text-sm text-gray-500">
                  {displayedType === "image"
                    ? "Mengidentifikasi tanaman dari gambar"
                    : displayedType === "voice"
                    ? "Memproses input suara dan mencari tanaman obat"
                    : "Mencari tanaman obat yang tepat"}
                </span>
                <Button
                  onClick={handleStopSearch}
                  variant="destructive"
                  size="sm"
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Batalkan Pencarian
                </Button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {!isLoading && searchResults.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
                <Info className="h-4 w-4" />
                Ditemukan {searchResults.length} tanaman obat{" "}
                {displayedType === "image"
                  ? "dari gambar yang Anda upload"
                  : displayedType === "voice"
                  ? "berdasarkan keluhan yang Anda sampaikan"
                  : `untuk pencarian: "${displayedQuery}"`}
              </div>

              {searchResults.map((plant, index) => (
                <Card
                  key={index}
                  className="border-green-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-4 md:p-8">
                    <div className=" space-y-4 md:space-y-6">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
                          {plant.name}
                        </h3>
                        <p className="text-green-600 italic text-base md:text-lg">
                          {plant.scientificName}
                        </p>
                      </div>

                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {plant.description}
                      </p>

                      <div className="bg-green-50 p-4 md:p-6 rounded-xl border border-green-100">
                        <h4 className="font-semibold text-green-800 mb-3 text-base md:text-lg flex items-center gap-2">
                          <Leaf className="h-5 w-5" />
                          Cara Penggunaan:
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                          {plant.usage}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-800 mb-3 text-base md:text-lg">
                          Dapat Mengobati:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {plant.treats?.map((treat, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-green-100 text-green-700 px-3 py-1 text-xs md:text-sm"
                            >
                              {treat}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {plant.warnings && (
                        <Alert className="border-orange-200 bg-orange-50">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-orange-700 text-sm md:text-base">
                            <strong>Peringatan:</strong> {plant.warnings}
                          </AlertDescription>
                        </Alert>
                      )}

                      {plant.dosage && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">
                            Dosis yang Disarankan:
                          </h4>
                          <p className="text-blue-700 text-sm md:text-base">
                            {plant.dosage}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Other Search Methods */}
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Coba metode pencarian lain
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {displayedType !== "voice" && (
                    <Button
                      onClick={() => router.push("/voice")}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Headphones className="h-4 w-4 mr-2" />
                      Voice Search
                    </Button>
                  )}
                  {displayedType !== "image" && (
                    <Button
                      onClick={() => router.push("/upload")}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Gambar
                    </Button>
                  )}
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Kembali ke Beranda
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!isLoading &&
            searchResults.length === 0 &&
            (displayedQuery || selectedImage) &&
            !error && (
              <div className="text-center py-16">
                <Leaf className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  Tidak ada hasil ditemukan
                </h3>
                <p className="text-gray-500 mb-6">
                  {displayedType === "image"
                    ? "Tidak dapat mengidentifikasi tanaman dari gambar. Pastikan gambar jelas dan menunjukkan tanaman obat."
                    : displayedType === "voice"
                    ? "Tidak dapat menemukan tanaman obat berdasarkan keluhan yang disampaikan. Coba jelaskan dengan lebih detail."
                    : "Coba jelaskan keluhan Anda dengan lebih detail atau gunakan kata kunci yang berbeda"}
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Hasil pencarian untuk: "{displayedQuery}"
                </p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
