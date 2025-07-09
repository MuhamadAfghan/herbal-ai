import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const query = formData.get("query");
    const type = formData.get("type");
    const image = formData.get("image");

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Query tidak boleh kosong" },
        { status: 400 }
      );
    }

    let promptText = "";
    let contents = [];

    if (type === "image" && image) {
      // Convert image to base64
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString("base64");

      promptText = `Saya adalah seorang ahli tanaman obat tradisional Indonesia. Berdasarkan gambar tanaman yang diberikan, identifikasi tanaman tersebut dan berikan informasi lengkap tentang khasiat obatnya.

Berikan respons dalam format JSON array dengan struktur berikut:
[
  {
    "name": "nama tanaman dalam bahasa Indonesia",
    "scientificName": "nama ilmiah tanaman",
    "description": "deskripsi lengkap tentang tanaman dan khasiatnya minimal 100 kata",
    "usage": "cara penggunaan yang detail dan praktis termasuk takaran dan frekuensi",
    "treats": ["array gejala atau penyakit yang bisa diobati"],
    "warnings": "peringatan atau kontraindikasi jika ada",
    "dosage": "dosis yang disarankan secara spesifik",
  }
]

Jika tidak dapat mengidentifikasi tanaman dari gambar, berikan respons: [{"error": "Tidak dapat mengidentifikasi tanaman dari gambar yang diberikan. Pastikan gambar jelas dan menunjukkan tanaman obat."}]

Respons harus dalam bahasa Indonesia dan format JSON yang valid tanpa markdown formatting.`;

      contents = [
        {
          parts: [
            {
              text: promptText,
            },
            {
              inline_data: {
                mime_type: image.type,
                data: base64Image,
              },
            },
          ],
        },
      ];
    } else {
      promptText = `Saya adalah seorang ahli tanaman obat tradisional Indonesia. Berdasarkan keluhan atau gejala berikut: "${query}", berikan rekomendasi tanaman obat yang dapat membantu mengatasinya.

Berikan respons dalam format JSON array dengan struktur berikut untuk setiap tanaman obat:
[
  {
    "name": "nama tanaman dalam bahasa Indonesia",
    "scientificName": "nama ilmiah tanaman",
    "description": "deskripsi lengkap tentang tanaman dan khasiatnya minimal 100 kata",
    "usage": "cara penggunaan yang detail dan praktis termasuk takaran dan frekuensi",
    "treats": ["array gejala atau penyakit yang bisa diobati"],
    "warnings": "peringatan atau kontraindikasi jika ada",
    "dosage": "dosis yang disarankan secara spesifik",
  }
]

Berikan 2-4 tanaman obat yang paling relevan dan efektif untuk keluhan tersebut. Pastikan informasi akurat dan berdasarkan pengetahuan pengobatan tradisional Indonesia yang terpercaya.

Jika query berupa nama tanaman, berikan informasi lengkap tentang tanaman tersebut.
Jika query berupa gejala/keluhan, rekomendasikan tanaman yang sesuai untuk mengobati gejala tersebut.

Jika tidak dapat menemukan tanaman yang sesuai, berikan respons: [{"error": "Maaf, tidak dapat menemukan informasi tanaman obat yang sesuai dengan keluhan Anda. Coba gunakan kata kunci yang lebih spesifik."}]

Respons harus dalam bahasa Indonesia dan format JSON yang valid tanpa markdown formatting.`;

      contents = [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ];
    }

    // Use Gemini 1.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error("Invalid response from Gemini API");
    }

    let textResponse = data.candidates[0].content.parts[0].text;
    console.log("Gemini API Response:", { textResponse });

    // Function to clean and fix JSON string
    function cleanJsonString(jsonStr) {
      // Remove code block markers
      jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");

      // Fix common typos and issues
      jsonStr = jsonStr
        // Fix treates -> treats typo
        .replace(/"treates":/g, '"treats":')
        // Fix other common typos
        .replace(/"treament":/g, '"treatment":')
        .replace(/"symtoms":/g, '"symptoms":')
        // Fix unescaped quotes in strings
        .replace(/: "([^"]*)"([^"]*)"([^"]*)",/g, ': "$1\\"$2\\"$3",')
        .replace(/: "([^"]*)"([^"]*)"([^"]*)"}/g, ': "$1\\"$2\\"$3"}')
        .replace(/: "([^"]*)"([^"]*)"([^"]*)"]/g, ': "$1\\"$2\\"$3"]')
        // Fix line breaks and special characters in strings
        .replace(/: "([^"]*)\n([^"]*)",/g, ': "$1 $2",')
        .replace(/: "([^"]*)\n([^"]*)"}/g, ': "$1 $2"}')
        .replace(/: "([^"]*)\n([^"]*)"]/g, ': "$1 $2"]')
        // Fix trailing commas
        .replace(/,(\s*[}\]])/g, "$1")
        // Fix missing commas between objects
        .replace(/}(\s*{)/g, "},$1")
        // Remove extra whitespace
        .replace(/\s+/g, " ")
        .trim();

      return jsonStr;
    }

    // Function to extract JSON from response
    function extractJson(text) {
      // Try to find JSON array first
      let jsonMatch = text.match(/\[[\s\S]*?\]/g);
      if (jsonMatch) {
        return jsonMatch[0];
      }

      // Try to find single JSON object
      jsonMatch = text.match(/\{[\s\S]*?\}/g);
      if (jsonMatch && jsonMatch.length > 0) {
        return `[${jsonMatch[0]}]`;
      }

      return null;
    }

    // Function to manually parse JSON with better error handling
    function parseJsonWithFallback(jsonString) {
      // First attempt: direct parsing
      try {
        return JSON.parse(jsonString);
      } catch (firstError) {
        console.log("First JSON parse failed, trying cleanup methods...");

        // Second attempt: aggressive cleanup
        try {
          let cleanedJson = jsonString
            // Remove control characters
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
            // Fix double escaping
            .replace(/\\\\/g, "\\")
            // Fix smart quotes
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'")
            // Fix common structural issues
            .replace(/,(\s*[}\]])/g, "$1")
            .replace(/}(\s*{)/g, "},$1")
            // Fix array formatting
            .replace(/\](\s*,\s*)\[/g, "]$1[");

          return JSON.parse(cleanedJson);
        } catch (secondError) {
          console.log("Second JSON parse failed, trying manual extraction...");

          // Third attempt: manual extraction using regex
          try {
            const plants = [];
            const plantMatches = jsonString.match(
              /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g
            );

            if (plantMatches) {
              for (const plantMatch of plantMatches) {
                try {
                  // Clean individual plant object
                  let cleanPlant = plantMatch
                    .replace(/"treates":/g, '"treats":')
                    .replace(/,(\s*})/g, "$1")
                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
                    .replace(/[""]/g, '"');

                  const plant = JSON.parse(cleanPlant);
                  if (plant.name && plant.description) {
                    plants.push(plant);
                  }
                } catch (plantError) {
                  console.log("Failed to parse individual plant:", plantError);
                  continue;
                }
              }
            }

            if (plants.length > 0) {
              return plants;
            }

            throw new Error("No valid plants found in manual extraction");
          } catch (manualError) {
            console.log("Manual extraction failed, trying field extraction...");

            // Fourth attempt: extract fields individually
            try {
              const extractField = (fieldName, defaultValue = "") => {
                const regex = new RegExp(`"${fieldName}":\\s*"([^"]*)"`, "i");
                const match = jsonString.match(regex);
                return match ? match[1] : defaultValue;
              };

              const extractArrayField = (fieldName) => {
                const regex = new RegExp(
                  `"${fieldName}":\\s*\\[([^\\]]*)\\]`,
                  "i"
                );
                const match = jsonString.match(regex);
                if (match) {
                  try {
                    return JSON.parse(`[${match[1]}]`);
                  } catch {
                    return match[1]
                      .split(",")
                      .map((item) => item.trim().replace(/"/g, ""));
                  }
                }
                return [];
              };

              const name = extractField("name");
              const scientificName = extractField(
                "scientificName",
                "Tidak tersedia"
              );
              const description = extractField("description");
              const usage = extractField(
                "usage",
                "Konsultasikan dengan ahli herbal"
              );
              const treats = extractArrayField("treats");
              const warnings = extractField(
                "warnings",
                "Konsultasikan dengan dokter sebelum menggunakan"
              );
              const dosage = extractField(
                "dosage",
                "Sesuai petunjuk ahli herbal"
              );

              if (name && description) {
                return [
                  {
                    name,
                    scientificName,
                    description,
                    usage,
                    treats,
                    warnings,
                    dosage,
                  },
                ];
              }

              throw new Error("Could not extract required fields");
            } catch (fieldError) {
              console.error("All JSON parsing methods failed:", {
                firstError,
                secondError,
                manualError,
                fieldError,
              });
              throw new Error("Failed to parse JSON response");
            }
          }
        }
      }
    }

    // Clean the response - remove markdown formatting
    textResponse = textResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Handle different response formats
    let results;

    // Extract JSON from response
    let jsonString = extractJson(textResponse);

    if (!jsonString) {
      // If no JSON found, treat as text response (likely an error or explanation)
      if (
        textResponse.toLowerCase().includes("tidak dapat") ||
        textResponse.toLowerCase().includes("maaf") ||
        textResponse.toLowerCase().includes("tidak ditemukan")
      ) {
        return NextResponse.json(
          {
            error:
              "Maaf, tidak dapat menemukan informasi tanaman obat yang sesuai dengan permintaan Anda. Silakan coba dengan kata kunci yang lebih spesifik atau gambar yang lebih jelas.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Respons tidak dalam format yang diharapkan. Silakan coba lagi dengan pertanyaan yang lebih spesifik.",
        },
        { status: 400 }
      );
    }

    // Clean the JSON string
    jsonString = cleanJsonString(jsonString);

    // Parse JSON with fallback methods
    try {
      results = parseJsonWithFallback(jsonString);
    } catch (parseError) {
      console.error("All JSON parsing methods failed:", parseError);
      return NextResponse.json(
        {
          error:
            "Terjadi kesalahan dalam memproses respons. Silakan coba lagi.",
        },
        { status: 500 }
      );
    }

    // Ensure results is an array
    if (!Array.isArray(results)) {
      results = [results];
    }

    // Check for error responses
    if (results.length === 1 && results[0].error) {
      return NextResponse.json({ error: results[0].error }, { status: 404 });
    }

    // Validate and clean results
    const validResults = results
      .filter(
        (plant) =>
          plant &&
          plant.name &&
          plant.scientificName &&
          plant.description &&
          plant.usage
      )
      .map((plant) => ({
        ...plant,
        treats: Array.isArray(plant.treats) ? plant.treats : [],
      }));

    if (validResults.length === 0) {
      return NextResponse.json(
        {
          error:
            "Maaf, tidak dapat menemukan informasi tanaman obat yang sesuai dengan keluhan Anda. Coba gunakan kata kunci yang lebih spesifik.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ results: validResults });
  } catch (error) {
    console.error("Search API Error:", error);

    let errorMessage = "Terjadi kesalahan saat mencari informasi tanaman obat.";

    if (error.message.includes("API key")) {
      errorMessage =
        "Konfigurasi API tidak valid. Silakan hubungi administrator.";
    } else if (
      error.message.includes("quota") ||
      error.message.includes("limit")
    ) {
      errorMessage =
        "Layanan sedang sibuk. Silakan coba lagi dalam beberapa saat.";
    } else if (
      error.message.includes("network") ||
      error.message.includes("fetch")
    ) {
      errorMessage = "Koneksi bermasalah. Periksa koneksi internet Anda.";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
