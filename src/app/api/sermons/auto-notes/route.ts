import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface AutoNotesRequestBody {
  title?: string;
  description?: string;
  speaker?: string;
  existingNotes?: string;
  mode?: "full" | "incremental";
}

// Fallback curated notes generator tailored for The Brook Church
function generateCuratedChurchNotes(title: string, speaker: string, mode: "full" | "incremental"): string {
  const isZoe = title.toLowerCase().includes("zoe");
  const isPneumatology = title.toLowerCase().includes("pneumatology") || title.toLowerCase().includes("wordshop");
  const isDoxa = title.toLowerCase().includes("doxa");
  const nowTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (mode === "incremental") {
    const liveInsights = [
      `[${nowTime}] PASTOR'S REVELATION: "The Zoe life is not an improved human life; it is the unconquerable, indestructible life of God functioning through human vessels." (1 John 5:11-12)`,
      `[${nowTime}] KEY SCRIPTURE REFLECTION: Colossians 1:27 — "Christ in you, the hope of glory." The indwelling presence of the Holy Spirit shifts every limitation in your lineage.`,
      `[${nowTime}] DOCTRINAL EMPHASIS: Walking in Grace means ceasing from self-effort and yielding to the supernatural enablement of Pneumatology (the ministry of the Holy Spirit).`,
      `[${nowTime}] PROPHETIC DECREE: "Everything God has placed inside you will blossom without hindrance. You walk as an overcomer this week!"`,
      `[${nowTime}] CONGREGATIONAL AMEN: Standing in agreement with the altar word — taking possession of spiritual authority.`,
    ];
    const randomIndex = Math.floor(Math.random() * liveInsights.length);
    return liveInsights[randomIndex];
  }

  return `===================================================================
THE BROOK CHURCH • CALABAR SANCTUARY
LIVE SERVICE SERMON STUDY NOTES & TRANSCRIPT
===================================================================

SERMON TITLE: ${title.toUpperCase()}
MINISTER: ${speaker || "The Brook Church Teaching Ministry"}
DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
BROADCAST: Live Sanctuary Transmission (Facebook Live & YouTube Live)

-------------------------------------------------------------------
1. CENTRAL DOCTRINAL THEME & THESIS
-------------------------------------------------------------------
${
  isZoe
    ? "• The Zoe Dimension: Stepping out of natural limitations into the supernatural, eternal quality of divine life imparted through Christ Jesus."
    : isPneumatology
    ? "• Pneumatology in Practice: The active, guiding, and illuminating ministry of the Holy Spirit in the believer's daily walk and divine assignment."
    : isDoxa
    ? "• The Doxa Dimension: The manifest weight of God's presence transforming ordinary circumstances into testimonies of grace."
    : "• An Unfolding Story of God's Grace: How the righteousness of God in Christ authorizes the believer for triumphant living."
}

-------------------------------------------------------------------
2. KEY ANCHOR SCRIPTURES
-------------------------------------------------------------------
• John 10:10 — "I came that they may have life, and have it abundantly (Zoe in its fullness)."
• Romans 8:1-2, 11 — "There is therefore now no condemnation... For the law of the Spirit of life in Christ Jesus has set you free."
• 2 Peter 1:3-4 — "His divine power has granted to us all things that pertain to life and godliness... partakers of the divine nature."
• Colossians 1:27 — "Christ in you, the hope of glory."

-------------------------------------------------------------------
3. CORE EXPOSITORY TEACHING POINTS
-------------------------------------------------------------------
I. THE NATURE OF THE NEW COVENANT
   - Salvation is not merely a legal pardon; it is an organic spiritual regeneration.
   - God did not just fix your past; He infused you with His eternal DNA (Zoe).
   - Righteousness is a nature received as a gift, not a trophy earned by religious exertion.

II. PNEUMATOLOGY: THE ADVANTAGE OF THE HOLY SPIRIT
   - The Holy Spirit is not an occasional visitor; He is our resident helper, teacher, and advocate.
   - When we pray in the Spirit, we download mysteries and bypass human intellectual limitations (1 Corinthians 14:2).
   - Fellowship with the Spirit sharpens discernment in business, family, and spiritual warfare.

III. CONQUERING BY THE SPOKEN WORD OF FAITH
   - Faith is an active response to revealed Grace.
   - What you do not declare with your mouth, you cannot establish in your reality.
   - Align your daily vocabulary with what the finished work of the Cross has provided.

-------------------------------------------------------------------
4. MEMORABLE QUOTES & TEACHING INSIGHTS
-------------------------------------------------------------------
• "Grace does not make you lazy; Grace empowers you to achieve what human sweat could never produce."
• "You are not waiting for God to move; God is waiting for you to believe what He has already done!"
• "The Zoe life is immune to spiritual corruption — let it radiate through your thoughts, health, and decisions."

-------------------------------------------------------------------
5. PROPHETIC DECLARATIONS & DECREES
-------------------------------------------------------------------
• I decree that every door previously locked against you swings wide open by divine favour!
• Confusion is terminated in your path; clarity and divine direction navigate your steps.
• The Zoe life swallows every symptom of failure, fear, or weakness in your body and mind!
• You will testify of the tangible goodness of the Lord in the land of the living!

-------------------------------------------------------------------
6. ACTION STEPS & MEDITATION ASSIGNMENT
-------------------------------------------------------------------
1. Spend 15 minutes each morning praying in the Holy Ghost and acknowledging your identity in Christ.
2. Memorize Romans 8:11 and speak it over your health and emotional strength.
3. Share today's live sermon link with a family member or friend who needs encouragement.
4. Support the ministry and sanctuary outreach by giving your tithes, seed, and offerings in faith.

Concluding Prayer:
"Father, thank You for the incorruptible seed of Your Word planted in my heart today. I refuse to be a forgetful hearer. I arise as a doer, walking boldly in grace, dominion, and supernatural love, in Jesus' mighty Name. Amen."`;
}

export async function POST(req: NextRequest) {
  try {
    const body: AutoNotesRequestBody = await req.json();
    const title = body.title || "Sunday Sanctuary Service Broadcast";
    const speaker = body.speaker || "Pastor & Ministers of The Brook Church";
    const description = body.description || "";
    const existingNotes = body.existingNotes || "";
    const mode = body.mode || "full";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to high-quality curated theological notes if Gemini key not set
      const generatedNotes = generateCuratedChurchNotes(title, speaker, mode);
      return NextResponse.json({
        notes: generatedNotes,
        source: "curated-auto",
        mode,
        title,
        speaker,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      let prompt = "";
      if (mode === "incremental") {
        prompt = `You are the real-time live sermon transcriber and notes assistant at The Brook Church, Calabar.
The current live stream sermon is: "${title}".
Description / Context: "${description}".
Current notes drafted so far:
"""
${existingNotes.slice(-1000)}
"""

Task:
Generate 1 to 2 powerful, punchy real-time live sermon notes bullet points captured right now from the ongoing service.
Format as timestamped entries:
[TIME] CATEGORY: "Quote / Revelation / Scripture reflection"
Keep it deeply spiritual, grounded in Christian theology (Zoe life, Grace, Pneumatology / Holy Spirit, faith, triumph).
Only return the new bullet points.`;
      } else {
        prompt = `You are the chief pastoral scribe and theological note-maker for The Brook Church, Calabar.
A member is currently watching the live church broadcast titled: "${title}".
Additional context: "${description}".
Speaker: "${speaker}".

Please generate comprehensive, professional, inspiring sermon notes for this message in clean written format suitable for saving as a Microsoft Word (.docx) document or PDF (.pdf).

Include the following sections with clear dividers:
1. SERMON TITLE, MINISTER, DATE & SCRIPTURE READINGS
2. CENTRAL THEOLOGICAL THEME & CORE THESIS (Grace, Zoe life, Holy Spirit/Pneumatology, dominion)
3. DETAILED EXPOSITORY POINTS & SUB-POINTS (with scriptures, theological breakdown, and practical insights)
4. MEMORABLE EPIGRAMS & PASTORAL QUOTES
5. PROPHETIC DECLARATIONS & DECREES SPOKEN OVER THE CONGREGATION
6. PRACTICAL LIFE APPLICATION & BELIEVER'S ACTION STEPS
7. CONCLUDING PRAYER OF FAITH

Make it rich, substantial, theologically sound, and edifying for personal study and small group discussion.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const responseText = response.text || generateCuratedChurchNotes(title, speaker, mode);

      return NextResponse.json({
        notes: responseText,
        source: "gemini",
        mode,
        title,
        speaker,
      });
    } catch (geminiError: any) {
      console.warn("Gemini generation failed, using curated notes fallback:", geminiError?.message);
      const fallback = generateCuratedChurchNotes(title, speaker, mode);
      return NextResponse.json({
        notes: fallback,
        source: "fallback",
        mode,
        title,
        speaker,
      });
    }
  } catch (error: any) {
    console.error("Auto notes API error:", error);
    return NextResponse.json(
      { error: "Failed to generate sermon notes", details: error?.message },
      { status: 500 }
    );
  }
}
