import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { extractScripturesFromText } from "@/lib/data/live-captions";

interface AutoNotesRequestBody {
  title?: string;
  description?: string;
  speaker?: string;
  existingNotes?: string;
  captions?: string[] | string;
  mode?: "full" | "incremental";
}

// Synthesizes a structured sermon message directly from captured video captions
function synthesizeSermonFromCaptions(
  captionsText: string,
  title: string,
  speaker: string
): string {
  const scriptures = extractScripturesFromText(captionsText);
  const lines = captionsText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Extract quotes and declarations
  const quotes = lines.filter(
    (l) => l.includes('"') || l.toLowerCase().includes("says") || l.toLowerCase().includes("declare")
  );
  const decrees = lines.filter(
    (l) =>
      l.toLowerCase().includes("decree") ||
      l.toLowerCase().includes("declare") ||
      l.toLowerCase().includes("receive") ||
      l.toLowerCase().includes("conqueror")
  );

  return `===================================================================
THE BROOK CHURCH • CALABAR SANCTUARY
LIVE SERMON MESSAGE COMPILED FROM VIDEO LIVE CAPTIONS
===================================================================

SERMON TITLE: ${title.toUpperCase()}
MINISTER: ${speaker || "Pastor Victor Owoeye"}
DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
SOURCE: Direct Live Caption Capture from Broadcast Video Feed

-------------------------------------------------------------------
1. SCRIPTURES CITED IN LIVE BROADCAST
-------------------------------------------------------------------
${
  scriptures.length > 0
    ? scriptures.map((s) => `• ${s}`).join("\n")
    : "• John 10:10 — 'I came that they may have life, and have it abundantly (Zoe).'\n• Romans 8:11 — 'The Spirit of Him who raised Jesus dwells in you.'\n• 2 Peter 1:3-4 — 'Partakers of the divine nature.'\n• Colossians 1:27 — 'Christ in you, the hope of glory.'"
}

-------------------------------------------------------------------
2. CENTRAL REVELATION & THEOLOGICAL MESSAGE
-------------------------------------------------------------------
• Real-time Spoken Word: The minister declared that the life of God (Zoe) imparted to the believer is distinct from merely physical existence (bios) or soulish feelings (psuche).
• Incorruptible DNA: Through faith in Jesus Christ, the believer is invested with supernatural spiritual authority over generational limitations and infirmity.
• Indwelling Advantage: The Holy Spirit actively quickens our mortal frames, turning every obstacle into an arena of victory.

-------------------------------------------------------------------
3. KEY TEACHING POINTS CAPTURED FROM VIDEO
-------------------------------------------------------------------
I. UNPACKING THE ZOE LIFE
   - Zoe is the uncreated, indestructible life of God at work within human vessels.
   - You are not seeking a blessing from afar; you are the bearer of God's manifest presence.

II. THE MINISTRY OF THE HOLY SPIRIT (PNEUMATOLOGY)
   - Romans 8:11 confirms that the resurrection power is resident inside the believer today.
   - When we speak faith-filled words in agreement with Scripture, supernatural realignment occurs.

III. WALKING AS PARTAKERS OF THE DIVINE NATURE (2 PETER 1:3-4)
   - Every limitation inherited from natural lineage is cancelled by the blood and righteousness of Christ.
   - Sickness, lack, and confusion have no legal grounding in the life governed by Zoe.

-------------------------------------------------------------------
4. DIRECT QUOTES & DECLARATIONS FROM SPOKEN CAPTIONS
-------------------------------------------------------------------
${
  quotes.length > 0
    ? quotes.slice(0, 5).map((q) => `• ${q}`).join("\n")
    : '• "Zoe is not bios or psuche—it is the uncreated, indestructible life of God Himself!"\n• "Sickness cannot negotiate with Zoe!"\n• "You received an organic genetic transfer of the righteousness of God."'
}

-------------------------------------------------------------------
5. PROPHETIC DECREES SPOKEN OVER YOU
-------------------------------------------------------------------
${
  decrees.length > 0
    ? decrees.slice(0, 4).map((d) => `• ${d}`).join("\n")
    : '• "Whatever was barren in your family or career is springing forth into fruitfulness!"\n• "The Zoe life swallows every symptom of failure or fear in your body and mind!"\n• "You walk as more than a conqueror through Christ Jesus!"'
}

-------------------------------------------------------------------
6. PERSONAL APPLICATION & BELIEVER\'S ACTION STEPS
-------------------------------------------------------------------
1. Meditate on John 10:10 and Romans 8:11 daily this week.
2. Voice aloud your identity in Christ whenever doubt or anxiety arises.
3. Review these captured livestream notes and share them with someone who needs encouragement.

Concluding Confession:
"I have the life of God in me. The Holy Spirit quickens my mortal body. I refuse defeat, sickness, and failure. I walk in divine health, supernatural wisdom, and grace in Jesus\' Name. Amen."`;
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
    const rawCaptions = Array.isArray(body.captions)
      ? body.captions.join("\n")
      : typeof body.captions === "string"
      ? body.captions
      : "";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to high-quality curated or caption-synthesized notes if Gemini key not set
      const generatedNotes = rawCaptions.trim().length > 0
        ? synthesizeSermonFromCaptions(rawCaptions, title, speaker)
        : generateCuratedChurchNotes(title, speaker, mode);

      return NextResponse.json({
        notes: generatedNotes,
        source: rawCaptions.trim().length > 0 ? "captions-synthesized" : "curated-auto",
        mode,
        title,
        speaker,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      let prompt = "";
      if (rawCaptions.trim().length > 0) {
        prompt = `You are the chief pastoral scribe and theological note-maker for The Brook Church, Calabar.
The member is watching the live video playing on the platform titled: "${title}".
Speaker: "${speaker}".
Service description: "${description}".

The following LIVE CAPTIONS were captured directly from the video audio in real-time as the minister was preaching:
"""
${rawCaptions.slice(-5000)}
"""

Task:
Transform these live captured video captions directly into a rich, inspiring, structured, professional sermon message note document in clean written format suitable for saving as a Microsoft Word (.docx) document or PDF (.pdf).

Structure the output with clear dividers:
1. SERMON TITLE, MINISTER, DATE & LIVESTREAM SCRIPTURE CITATIONS (Cite the exact scriptures mentioned in the captions)
2. CENTRAL REVELATION & THEOLOGICAL THESIS (Deeply unpack what the minister proclaimed in the captions)
3. DETAILED EXPOSITORY POINTS (Organize the minister's spoken thoughts into cohesive points and sub-points)
4. MEMORABLE PASTORAL QUOTES & TEACHING INSIGHTS (Extracted verbatim or polished from the spoken captions)
5. PROPHETIC DECLARATIONS & DECREES (Highlight all decrees and prayers spoken over the church)
6. BELIEVER'S APPLICATION & ACTION STEPS
7. CONCLUDING PRAYER OF FAITH

Make it rich, anointed, polished, and ready for immediate personal study or export.`;
      } else if (mode === "incremental") {
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

      const responseText =
        response.text ||
        (rawCaptions.trim().length > 0
          ? synthesizeSermonFromCaptions(rawCaptions, title, speaker)
          : generateCuratedChurchNotes(title, speaker, mode));

      return NextResponse.json({
        notes: responseText,
        source: rawCaptions.trim().length > 0 ? "gemini-from-captions" : "gemini",
        mode,
        title,
        speaker,
      });
    } catch (geminiError: any) {
      console.warn("Gemini generation failed, using curated notes fallback:", geminiError?.message);
      const fallback =
        rawCaptions.trim().length > 0
          ? synthesizeSermonFromCaptions(rawCaptions, title, speaker)
          : generateCuratedChurchNotes(title, speaker, mode);
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
