import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.error("Failed to initialize Gemini AI Client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is missing or placeholder. Running in fallback/mock mode.");
}

// Global error handler utility
const handleApiError = (res: express.Response, error: any, fallbackData: any) => {
  console.error("API Error occurred:", error);
  // Serve the tailored fallback data with a success status so the UI always has mock data to work with
  res.json({ ...fallbackData, _isFallback: true });
};

// ==========================================
// 1. TRAVEL PLANNER ENDPOINT
// ==========================================
app.post("/api/planner", async (req, res) => {
  const { destination, durationDays, style, companionMode, budgetLevel } = req.body;
  const days = parseInt(durationDays) || 3;
  const destName = destination || "Paris, France";

  const fallbackTrip = {
    id: Math.random().toString(36).substring(7),
    destination: destName,
    durationDays: days,
    style: style || "adventure",
    companionMode: companionMode || "couple",
    budgetLevel: budgetLevel || "moderate",
    itinerary: Array.from({ length: days }, (_, i) => ({
      dayNumber: i + 1,
      theme: `Explore the Wonders of ${destName} - Day ${i + 1}`,
      activities: [
        {
          time: "09:00 AM",
          title: `Breakfast at Local Café in ${destName}`,
          description: `Kick off your day with signature local pastries, premium fresh coffee, and local delicacies.`,
          costEstimate: budgetLevel === "budget" ? "$10" : budgetLevel === "luxury" ? "$45" : "$22",
          locationName: `Café du Centre, ${destName}`,
          category: "food" as const,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Cafe+Paris`,
          coordinates: { lat: 48.8566 + (Math.random() - 0.5) * 0.1, lng: 2.3522 + (Math.random() - 0.5) * 0.1 }
        },
        {
          time: "11:30 AM",
          title: `Iconic Sightseeing and Landmark Visit`,
          description: `Stroll through the historical central square, marveling at the architecture and capturing beautiful photographs.`,
          costEstimate: "Free",
          locationName: `Historic Downtown Plaza, ${destName}`,
          category: "sightseeing" as const,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Downtown+Square+${encodeURIComponent(destName)}`,
          coordinates: { lat: 48.8566 + (Math.random() - 0.5) * 0.1, lng: 2.3522 + (Math.random() - 0.5) * 0.1 }
        },
        {
          time: "02:30 PM",
          title: `Curated Highlight Activity`,
          description: `Participate in a guided cultural experience, museum exhibit entry, or unique regional activities tailored for ${style} style.`,
          costEstimate: budgetLevel === "budget" ? "$15" : budgetLevel === "luxury" ? "$120" : "$45",
          locationName: `Main Culture Center, ${destName}`,
          category: "activity" as const,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Museum+${encodeURIComponent(destName)}`,
          coordinates: { lat: 48.8566 + (Math.random() - 0.5) * 0.1, lng: 2.3522 + (Math.random() - 0.5) * 0.1 }
        },
        {
          time: "07:00 PM",
          title: `Gourmet Dinner Experience`,
          description: `Savor exquisite local traditional dishes and pairings in a cozy, authentic atmosphere highly rated by travelers.`,
          costEstimate: budgetLevel === "budget" ? "$20" : budgetLevel === "luxury" ? "$180" : "$60",
          locationName: `The Local Bistro, ${destName}`,
          category: "food" as const,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Bistro+${encodeURIComponent(destName)}`,
          coordinates: { lat: 48.8566 + (Math.random() - 0.5) * 0.1, lng: 2.3522 + (Math.random() - 0.5) * 0.1 }
        }
      ]
    })),
    packingList: [
      "Passport and Travel Visa document copies",
      "Comfortable specialized footwear for walking",
      "All-weather adapter plug and fast charger",
      "Compact umbrella or water-resistant shell jacket",
      "Personalized toiletries kit and essential medications"
    ],
    hotels: [
      {
        name: `Grand Central Hotel, ${destName}`,
        rating: "4.7★",
        costPerNight: budgetLevel === "budget" ? "$55" : budgetLevel === "luxury" ? "$380" : "$140",
        reason: "Excellent walkability index and stellar connection to major public transport hubs."
      },
      {
        name: `Boutique Hideaway Inn, ${destName}`,
        rating: "4.5★",
        costPerNight: budgetLevel === "budget" ? "$40" : budgetLevel === "luxury" ? "$290" : "$110",
        reason: "Charming local decorations and top-tier personalized hospitality review scores."
      }
    ],
    restaurants: [
      {
        name: `La Table Tradition, ${destName}`,
        cuisine: "Traditional & Regional Specialty",
        rating: "4.8★",
        priceRange: budgetLevel === "budget" ? "Cheap" : budgetLevel === "luxury" ? "Fine Dining" : "Moderate",
        address: "12 Rue de l'Atmosphère"
      },
      {
        name: `Green Garden Cafe, ${destName}`,
        cuisine: "Fresh Bistro & Plant-Based Specials",
        rating: "4.6★",
        priceRange: "Moderate",
        address: "44 avenue de la Clarté"
      }
    ],
    transport: [
      {
        type: "Local Metro & Subway Transit Passes",
        averageCost: "$8/day",
        pros: "Fastest way to bypass peak hour street traffic congestion.",
        cons: "Can get crowded during morning and evening rush hours."
      },
      {
        type: "On-Demand Ride Hailing & Taxis",
        averageCost: "$25/ride",
        pros: "Door-to-door convenience with baggage safety.",
        cons: "Highly subject to traffic flow and premium surge rates."
      }
    ],
    nearbyAttractions: [
      {
        name: `Sovereign Viewpoint Hill`,
        description: `Panoramic overlook offering stunning 360-degree vistas across the skyline.`,
        highlights: ["Breathtaking sunset spot", "Excellent photography angle", "Charming footpaths"]
      },
      {
        name: `Ancient Botanical Conservatory`,
        description: `Historic glass greenhouse structures cultivating rare botanical species from around the globe.`,
        highlights: ["Relaxing tropical climates", "Over 5,000 unique species", "Art-nouveau architecture"]
      }
    ],
    totalEstimatedCost: budgetLevel === "budget" ? `$${days * 80}` : budgetLevel === "luxury" ? `$${days * 600}` : `$${days * 220}`
  };

  if (!ai) {
    return res.json(fallbackTrip);
  }

  try {
    const prompt = `Generate a comprehensive, highly realistic, professional-grade travel itinerary for:
Destination: ${destName}
Duration: ${days} days
Style: ${style}
Companion Mode: ${companionMode}
Budget Level: ${budgetLevel}

Return the results matching the requested JSON schema. Make sure everything is factual and realistic. Ensure the activity categories are strict: 'sightseeing', 'food', 'transport', 'activity'.
Provide detailed, realistic names of actual hotels, restaurants, and sights at the destination.
For activities, add googleMapsUrl with query strings like: "https://www.google.com/maps/search/?api=1&query=SpotName+DestinationName".
Ensure zero duplicates of activities across different days. The packing list should be highly tailored to the destination climate and selected style.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            durationDays: { type: Type.INTEGER },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING, description: "e.g. 09:00 AM" },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING, description: "Detailed description of what to do" },
                        costEstimate: { type: Type.STRING, description: "e.g. $15 or Free" },
                        locationName: { type: Type.STRING },
                                                googleMapsUrl: { type: Type.STRING, description: "Valid Google Maps search URL" },
                        coordinates: {
                          type: Type.OBJECT,
                          description: "Approximate latitude and longitude of this specific location",
                          properties: {
                            lat: { type: Type.NUMBER },
                            lng: { type: Type.NUMBER }
                          }
                        },
                        category: { type: Type.STRING, description: "Must be exactly one of: sightseeing, food, transport, activity" }
                      },
                      required: ["time", "title", "description", "costEstimate", "locationName", "category"]
                    }
                  }
                },
                required: ["dayNumber", "theme", "activities"]
              }
            },
            packingList: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            hotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  costPerNight: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["name", "rating", "costPerNight", "reason"]
              }
            },
            restaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                  address: { type: Type.STRING }
                },
                required: ["name", "cuisine", "rating", "priceRange", "address"]
              }
            },
            transport: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  averageCost: { type: Type.STRING },
                  pros: { type: Type.STRING },
                  cons: { type: Type.STRING }
                },
                required: ["type", "averageCost", "pros", "cons"]
              }
            },
            nearbyAttractions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["name", "description", "highlights"]
              }
            },
            totalEstimatedCost: { type: Type.STRING }
          },
          required: ["destination", "durationDays", "itinerary", "packingList", "hotels", "restaurants", "transport", "nearbyAttractions", "totalEstimatedCost"]
        }
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      parsed.id = Math.random().toString(36).substring(7);
      return res.json(parsed);
    }
    throw new Error("No response text from Gemini API");
  } catch (error) {
    handleApiError(res, error, fallbackTrip);
  }
});

// ==========================================
// 2. TRAVEL PULSE ENDPOINT
// ==========================================
app.post("/api/travel-pulse", async (req, res) => {
  const { destination } = req.body;
  const destName = destination || "Tokyo, Japan";

  const fallbackPulse = {
    destination: destName,
    overallScore: 89,
    scores: {
      weather: 85,
      safety: 94,
      crowd: 65,
      walking: 90,
      transport: 95,
      visa: 88,
      cost: 60
    },
    visaDifficulty: "Easy / Visa On Arrival or eVisa online",
    visaDetails: "Tourists from over 65 countries receive simple visa-free or instant electronic entries lasting up to 90 days. Check official consulate forms prior to flight booking.",
    currentWeather: {
      condition: "Partly Cloudy",
      temperatureCelsius: 22,
      humidity: 60,
      windKph: 15,
      forecast: [
        { day: "Today", temp: 22, condition: "Partly Cloudy" },
        { day: "Tomorrow", temp: 24, condition: "Sunny" },
        { day: "Day 3", temp: 20, condition: "Rain Showers" }
      ]
    },
    localEvents: [
      { name: "Seasonal Cultural Lantern Festival", date: "August 15", description: "Thousands of handmade paper lanterns light up the city canals in celebration of local heritage." },
      { name: "Street Gastronomy Fair", date: "September 2-4", description: "Food vendors gather from all prefectures to showcase legendary street delicacies and regional ingredients." }
    ],
    historicalTrends: [
      { month: "Jan", temp: 8, crowd: 40, cost: 70 },
      { month: "Mar", temp: 15, crowd: 90, cost: 95 },
      { month: "May", temp: 22, crowd: 75, cost: 85 },
      { month: "Jul", temp: 29, crowd: 85, cost: 80 },
      { month: "Sep", temp: 24, crowd: 70, cost: 75 },
      { month: "Nov", temp: 16, crowd: 80, cost: 90 }
    ],
    pulseAnalysis: `${destName} is currently reflecting peak safety ratings globally, matched with phenomenal walking transit accessibility scores. Weather elements remain highly pleasant. Plan for moderate crowds around cultural districts.`
  };

  if (!ai) {
    return res.json(fallbackPulse);
  }

  try {
    const prompt = `Assess the comprehensive Travel Pulse for: ${destName}.
Provide factual and up-to-date estimations regarding safety, crowd status, walking indexing, transport infrastructure, current seasonal weather, visa procedures, and cost trends.
Return the results matching the requested JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            overallScore: { type: Type.INTEGER, description: "Composite score from 0-100" },
            scores: {
              type: Type.OBJECT,
              properties: {
                weather: { type: Type.INTEGER },
                safety: { type: Type.INTEGER },
                crowd: { type: Type.INTEGER },
                walking: { type: Type.INTEGER },
                transport: { type: Type.INTEGER },
                visa: { type: Type.INTEGER },
                cost: { type: Type.INTEGER }
              },
              required: ["weather", "safety", "crowd", "walking", "transport", "visa", "cost"]
            },
            visaDifficulty: { type: Type.STRING },
            visaDetails: { type: Type.STRING },
            currentWeather: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING },
                temperatureCelsius: { type: Type.NUMBER },
                humidity: { type: Type.NUMBER },
                windKph: { type: Type.NUMBER },
                forecast: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      temp: { type: Type.NUMBER },
                      condition: { type: Type.STRING }
                    },
                    required: ["day", "temp", "condition"]
                  }
                }
              },
              required: ["condition", "temperatureCelsius", "humidity", "windKph", "forecast"]
            },
            localEvents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  date: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "date", "description"]
              }
            },
            historicalTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  temp: { type: Type.NUMBER, description: "Avg Temperature in Celsius" },
                  crowd: { type: Type.NUMBER, description: "Crowd density index 0-100" },
                  cost: { type: Type.NUMBER, description: "Cost level index 0-100" }
                },
                required: ["month", "temp", "crowd", "cost"]
              }
            },
            pulseAnalysis: { type: Type.STRING }
          },
          required: ["destination", "overallScore", "scores", "visaDifficulty", "visaDetails", "currentWeather", "localEvents", "historicalTrends", "pulseAnalysis"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return res.json(JSON.parse(text));
    }
    throw new Error("No response text from Gemini API for pulse");
  } catch (error) {
    handleApiError(res, error, fallbackPulse);
  }
});

// ==========================================
// 3. BUDGET OPTIMIZER ENDPOINT
// ==========================================
app.post("/api/budget-optimizer", async (req, res) => {
  const { destination, budgetStyle, baseAmount } = req.body;
  const destName = destination || "London, UK";
  const style = budgetStyle || "moderate";

  const fallbackBudget = {
    destination: destName,
    budgetStyle: style,
    totalEstimatedCost: style === "budget" ? "$580" : style === "luxury" ? "$3,200" : "$1,150",
    dailyAverageCost: style === "budget" ? "$79/day" : style === "luxury" ? "$610/day" : "$196/day",
    estimates: [
      { category: "Accommodations & Hotels", estimate: style === "budget" ? "$45/night" : style === "luxury" ? "$320/night" : "$110/night", percentage: 35, details: "Highly subject to city core proximity. Hostels and guesthouses offer great value." },
      { category: "Flights & Travel Fares", estimate: style === "budget" ? "$250 roundtrip" : style === "luxury" ? "$1,200 roundtrip" : "$480 roundtrip", percentage: 25, details: "Book at least 6 weeks in advance. Utilize low-cost carriers for internal travel." },
      { category: "Dining & Food", estimate: style === "budget" ? "$18/day" : style === "luxury" ? "$110/day" : "$42/day", percentage: 20, details: "Dine at market stalls, bakeries, or lunch-menu bistros to capture authentic tastes at minor costs." },
      { category: "Transport & Commute", estimate: style === "budget" ? "$6/day" : style === "luxury" ? "$60/day" : "$14/day", percentage: 10, details: "Purchase multi-day transit passes. Avoid airport-link private taxis." },
      { category: "Activities & Sightseeing", estimate: style === "budget" ? "$10/day" : style === "luxury" ? "$120/day" : "$30/day", percentage: 10, details: "Many museums offer free admission on specific weeknights. Look out for online promo codes." }
    ],
    emergencyReserve: style === "budget" ? "$150 total" : style === "luxury" ? "$800 total" : "$300 total",
    savingsSuggestions: [
      "Purchase a multi-day subway/transit card immediately upon arrival instead of single journey tokens.",
      "Browse grocery markets and local bakeries for casual breakfasts or lightweight picnics.",
      "Check out city tourism pass combinations to package historic site entry tickets together at up to 40% discount."
    ]
  };

  if (!ai) {
    return res.json(fallbackBudget);
  }

  try {
    const prompt = `Build an extremely realistic budget estimate breakdown for: ${destName} at a '${style}' style budget tier.
Provide typical daily averages, category percentages totaling exactly 100%, recommended emergency reserves, and smart savings suggestions tailored to the local culture.
Return matching the requested JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            budgetStyle: { type: Type.STRING },
            totalEstimatedCost: { type: Type.STRING, description: "e.g. $1,150" },
            dailyAverageCost: { type: Type.STRING, description: "e.g. $196/day" },
            estimates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  estimate: { type: Type.STRING, description: "e.g. $45/night or $15/day" },
                  percentage: { type: Type.INTEGER, description: "Percentage of overall budget (integer)" },
                  details: { type: Type.STRING }
                },
                required: ["category", "estimate", "percentage", "details"]
              }
            },
            emergencyReserve: { type: Type.STRING },
            savingsSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["destination", "budgetStyle", "totalEstimatedCost", "dailyAverageCost", "estimates", "emergencyReserve", "savingsSuggestions"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return res.json(JSON.parse(text));
    }
    throw new Error("No response text from Gemini API for budget");
  } catch (error) {
    handleApiError(res, error, fallbackBudget);
  }
});

// ==========================================
// 4. MUSLIM ASSISTANT ENDPOINT
// ==========================================
app.post("/api/muslim-assistant", async (req, res) => {
  const { destination, ramadanMode } = req.body;
  const destName = destination || "Kuala Lumpur, Malaysia";

  const fallbackMuslimData = {
    destination: destName,
    prayerTimes: {
      Fajr: "05:45 AM",
      Dhuhr: "01:22 PM",
      Asr: "04:45 PM",
      Maghrib: "07:28 PM",
      Isha: "08:42 PM"
    },
    nearbyMosques: [
      { name: "Al-Taqwa Islamic Center", distance: "0.8 km", address: "Central Boulevard West Street 12", facilities: ["Wudu area", "Women's section", "English sermons"] },
      { name: "Sovereign Peace Mosque", distance: "1.5 km", address: "East Heritage Square Avenue 44", facilities: ["Wudu area", "Spacious prayer hall", "Parking available"] }
    ],
    halalRestaurants: [
      { name: "Saffron Spices Dining", cuisine: "Middle Eastern & Indo-Malay fusion", rating: "4.7★", address: "78 Culinary Boulevard", halalCertification: "JAKIM Halal Certified - fully verified" },
      { name: "The Halal Grill House", cuisine: "Gourmet Burgers & Steaks", rating: "4.5★", address: "33 Highstreet Lane", halalCertification: "100% Muslim-owned establishment" }
    ],
    qiblaAngle: 292.5,
    travelTips: [
      "Wudu facilities are common in public rest areas, but carrying a small travel water spray bottle is highly recommended.",
      "Most local hotels provide a Qibla pointer arrow on the bedroom ceiling, or you can use our built-in compass tool.",
      "For Friday prayers, mosques fill up very quickly; arrive at least 30 minutes early to secure a spot inside."
    ],
    ramadanModeDetails: ramadanMode ? "Special Ramadan Notice: Suhoor and Iftar meal options are widely available at street fairs starting from 4:30 PM until late night. Major restaurants offer dedicated buffet menus." : "Ramadan Mode is currently disabled. Halal restaurants operate under ordinary daylight hours."
  };

  if (!ai) {
    return res.json(fallbackMuslimData);
  }

  try {
    const prompt = `Generate highly accurate Islamic traveler travel tips, local prayer schedules (approximate values are okay but must feel realistic for the latitude), nearby mosques, certified Halal restaurants, and the Qibla compass angle (bearing from North) for: ${destName}.
Ramadan Mode state: ${ramadanMode ? "ENABLED - please supply custom Suhoor, Iftar, and fasting-friendly guidance" : "DISABLED"}.
Return matching the requested JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            prayerTimes: {
              type: Type.OBJECT,
              properties: {
                Fajr: { type: Type.STRING },
                Dhuhr: { type: Type.STRING },
                Asr: { type: Type.STRING },
                Maghrib: { type: Type.STRING },
                Isha: { type: Type.STRING }
              },
              required: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]
            },
            nearbyMosques: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  distance: { type: Type.STRING },
                  address: { type: Type.STRING },
                  facilities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["name", "distance", "address"]
              }
            },
            halalRestaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  address: { type: Type.STRING },
                  halalCertification: { type: Type.STRING }
                },
                required: ["name", "cuisine", "rating", "address", "halalCertification"]
              }
            },
            qiblaAngle: { type: Type.NUMBER, description: "Angle in degrees from 0-360 relative to true North" },
            travelTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            ramadanModeDetails: { type: Type.STRING }
          },
          required: ["destination", "prayerTimes", "nearbyMosques", "halalRestaurants", "qiblaAngle", "travelTips"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return res.json(JSON.parse(text));
    }
    throw new Error("No response text from Gemini API for Muslim Assistant");
  } catch (error) {
    handleApiError(res, error, fallbackMuslimData);
  }
});

// ==========================================
// 5. SCAM SHIELD ENDPOINT
// ==========================================
app.post("/api/scam-shield", async (req, res) => {
  const { destination } = req.body;
  const destName = destination || "Rome, Italy";

  const fallbackScamData = {
    destination: destName,
    riskScore: 4,
    commonScams: [
      { title: "The Friendship Bracelet Scam", description: "Vigorously friendly street sellers wrap thread bracelets around your wrist, claim it is a free gift, then aggressively demand high currency payments.", commonLocations: "Major historical monument entrances and pedestrian squares", howToAvoid: "Politely but firmly raise your hands, keep walking, and refuse to engage in initial greetings." },
      { title: "Broken Taxi Meter / Fixed Rate Premium", description: "The driver claims the meter is broken or uses a fast-ticking falsified meter, charging up to triple the official city fare rate.", commonLocations: "Main airport arrivals, train terminals, and nightlife corridors", howToAvoid: "Insist on turning on the meter prior to getting inside, or download the official certified local ride-hail app." }
    ],
    safeZones: ["Historic Center Pedestrian Zones", "High Street Retail Districts", "Well-lit Central Boulevards"],
    unsafeZones: ["Dimly lit back alleys near the central rail terminal after 11 PM", "Unregulated street markets at midnight", "Isolated parkways away from security cameras"],
    taxiPrecautions: [
      "Only board official municipal-colored taxis lined up at designated city taxi stands.",
      "Check the tariff sheet usually displayed on the passenger window glass.",
      "Ensure GPS is active on your own smartphone to audit the route in real-time."
    ],
    emergencyNumbers: {
      police: "112 (Universal EU Emergency)",
      ambulance: "118",
      touristPolice: "06 4686"
    }
  };

  if (!ai) {
    return res.json(fallbackScamData);
  }

  try {
    const prompt = `Identify common tourist scams, travel traps, night-safety parameters, certified safe zones, unsafe districts, and crucial emergency numbers for: ${destName}.
Provide practical, descriptive instructions. Return matching the requested JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            riskScore: { type: Type.INTEGER, description: "Risk Score from 1 to 10 (1 is ultra-safe, 10 is high scam risk)" },
            commonScams: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  commonLocations: { type: Type.STRING },
                  howToAvoid: { type: Type.STRING }
                },
                required: ["title", "description", "commonLocations", "howToAvoid"]
              }
            },
            safeZones: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            unsafeZones: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            taxiPrecautions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            emergencyNumbers: {
              type: Type.OBJECT,
              properties: {
                police: { type: Type.STRING },
                ambulance: { type: Type.STRING },
                touristPolice: { type: Type.STRING }
              },
              required: ["police", "ambulance", "touristPolice"]
            }
          },
          required: ["destination", "riskScore", "commonScams", "safeZones", "unsafeZones", "taxiPrecautions", "emergencyNumbers"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return res.json(JSON.parse(text));
    }
    throw new Error("No response text from Gemini API for scam shield");
  } catch (error) {
    handleApiError(res, error, fallbackScamData);
  }
});

// ==========================================
// 6. SCAM VERIFY ENDPOINT (SCENARIO DETECTOR)
// ==========================================
app.post("/api/scam-shield/verify", async (req, res) => {
  const { scenario, location } = req.body;
  const loc = location || "General Tourist Spot";

  const fallbackVerify = {
    isScam: "likely" as const,
    confidence: 85,
    analysis: "This scenario strongly matches classic street decoy distraction behavior. Usually, a friendly stranger initiates sudden physical contact or presents an unsolicited 'gift' (like a flower or bracelet) to divert your visual attention while an accomplice accesses your back pockets or purses.",
    scamType: "Street Decoy Pickpocketing Trap",
    precautionTips: [
      "Politely disengage from any sudden unrequested proximity or physical touch.",
      "Securely relocate all credit cards and electronic devices into front zippers or inner lining pouches.",
      "Walk away toward public stores with overhead lighting and security presence."
    ],
    recommendedAction: "Politely raise your hands, say 'No, thank you' firmly, and accelerate your walk. Avoid standing still."
  };

  if (!ai) {
    return res.json(fallbackVerify);
  }

  try {
    const prompt = `Analyze a potential tourist scenario to check if it's a scam:
Scenario: ${scenario}
Location/Country Context: ${loc}

Provide a realistic safety analysis, confidence index, scam classification, precaution tips, and recommended actions.
Return matching the requested JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isScam: { type: Type.STRING, description: "Must be exactly one of: likely, possible, unlikely" },
            confidence: { type: Type.INTEGER, description: "Confidence score 0-100" },
            analysis: { type: Type.STRING },
            scamType: { type: Type.STRING },
            precautionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedAction: { type: Type.STRING }
          },
          required: ["isScam", "confidence", "analysis", "scamType", "precautionTips", "recommendedAction"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return res.json(JSON.parse(text));
    }
    throw new Error("No response text from Gemini API for verify scam");
  } catch (error) {
    handleApiError(res, error, fallbackVerify);
  }
});


// ==========================================
// VITE DEV MIDDLEWARE AND STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production assets from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TravixIQ Server running on http://localhost:${PORT}`);
  });
}

startServer();
