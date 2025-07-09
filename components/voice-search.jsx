"use client"

import { useRef, useEffect } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VoiceSearch({ onResult, isListening, setIsListening }) {
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
        onResult(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [onResult, setIsListening])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={isListening ? stopListening : startListening}
      className={`rounded-xl ${
        isListening ? "bg-red-100 text-red-600 hover:bg-red-200" : "hover:bg-green-50 text-green-600"
      }`}
    >
      {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}
