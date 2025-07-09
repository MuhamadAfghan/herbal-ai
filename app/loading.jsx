import { Leaf } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
        <div className="flex items-center gap-2 text-green-600">
          <Leaf className="h-5 w-5" />
          <span className="text-lg font-medium">Memuat HerbalAI...</span>
        </div>
        <p className="text-sm text-gray-500">Menyiapkan teknologi AI Speech-to-Text</p>
      </div>
    </div>
  )
}
