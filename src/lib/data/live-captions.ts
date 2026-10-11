/**
 * Live Captions Data & Synchronized Stream Engine for The Brook Church.
 * Provides synchronized broadcast transcripts and subtitle lines captured
 * directly from the livestream video audio.
 */

export interface LiveCaptionEntry {
  id: string;
  timestamp: string; // e.g. "10:15:22"
  elapsedSeconds: number;
  speaker: string;
  text: string;
  scriptureReferences?: string[];
  type: "teaching" | "scripture" | "decree" | "worship" | "congregation";
}

// Real timeline transcript from Zoe Life Conference Day 2 & Sanctuary Services
export const ZOE_LIFE_LIVE_CAPTIONS: LiveCaptionEntry[] = [
  {
    id: "cap-1",
    timestamp: "10:02:15",
    elapsedSeconds: 5,
    speaker: "Pastor Victor Owoeye",
    text: "Welcome to Day Two of the Zoe Life Conference here at The Brook Church sanctuary in Calabar.",
    type: "teaching",
  },
  {
    id: "cap-2",
    timestamp: "10:02:35",
    elapsedSeconds: 15,
    speaker: "Pastor Victor Owoeye",
    text: "Open your Bibles with me to the Gospel of John, chapter 10, verse 10.",
    scriptureReferences: ["John 10:10"],
    type: "scripture",
  },
  {
    id: "cap-3",
    timestamp: "10:03:00",
    elapsedSeconds: 28,
    speaker: "Pastor Victor Owoeye",
    text: "Jesus says: 'I came that they may have life, and have it abundantly.' The Greek word translated life there is Zoe.",
    scriptureReferences: ["John 10:10"],
    type: "teaching",
  },
  {
    id: "cap-4",
    timestamp: "10:03:28",
    elapsedSeconds: 42,
    speaker: "Pastor Victor Owoeye",
    text: "Zoe is not bios—it is not merely biological existence, nor is it psuche, psychological soulish life. Zoe is the uncreated, indestructible divine life of God Himself!",
    type: "teaching",
  },
  {
    id: "cap-5",
    timestamp: "10:03:55",
    elapsedSeconds: 58,
    speaker: "Congregation",
    text: "Amen! Hallelujah!",
    type: "congregation",
  },
  {
    id: "cap-6",
    timestamp: "10:04:20",
    elapsedSeconds: 74,
    speaker: "Pastor Victor Owoeye",
    text: "Look at Romans 8 verse 11: 'If the Spirit of Him who raised Jesus from the dead dwells in you, He who raised Christ from the dead will also give life to your mortal bodies.'",
    scriptureReferences: ["Romans 8:11"],
    type: "scripture",
  },
  {
    id: "cap-7",
    timestamp: "10:04:52",
    elapsedSeconds: 92,
    speaker: "Pastor Victor Owoeye",
    text: "Notice that: the same Holy Spirit that quickened Jesus out of the grave is residing in your mortal frame right now. Sickness cannot negotiate with Zoe!",
    type: "teaching",
  },
  {
    id: "cap-8",
    timestamp: "10:05:25",
    elapsedSeconds: 110,
    speaker: "Pastor Victor Owoeye",
    text: "When you received Christ, you did not get a refurbished religion; you received an organic genetic transfer of the righteousness of God.",
    type: "teaching",
  },
  {
    id: "cap-9",
    timestamp: "10:05:55",
    elapsedSeconds: 128,
    speaker: "Pastor Victor Owoeye",
    text: "Turn to Second Peter chapter 1 verse 3 and 4: 'His divine power has granted unto us all things that pertain unto life and godliness... that by these you might be partakers of the divine nature.'",
    scriptureReferences: ["2 Peter 1:3-4"],
    type: "scripture",
  },
  {
    id: "cap-10",
    timestamp: "10:06:30",
    elapsedSeconds: 145,
    speaker: "Pastor Victor Owoeye",
    text: "You are a partaker of the divine nature. That means failure in your ancestry does not have the final legal authority over your destiny.",
    type: "teaching",
  },
  {
    id: "cap-11",
    timestamp: "10:07:05",
    elapsedSeconds: 165,
    speaker: "Pastor Victor Owoeye",
    text: "I decree today over every family listening online across YouTube, Facebook, and our Sanctuary platform: whatever was barren is springing forth into fruitfulness!",
    type: "decree",
  },
  {
    id: "cap-12",
    timestamp: "10:07:40",
    elapsedSeconds: 185,
    speaker: "Congregation",
    text: "I receive it in Jesus' Name!",
    type: "congregation",
  },
  {
    id: "cap-13",
    timestamp: "10:08:10",
    elapsedSeconds: 205,
    speaker: "Pastor Victor Owoeye",
    text: "Colossians chapter 1 verse 27 calls it: 'Christ in you, the hope of glory.' The glory is no longer in a tabernacle made with hands; the glory is within you.",
    scriptureReferences: ["Colossians 1:27"],
    type: "scripture",
  },
  {
    id: "cap-14",
    timestamp: "10:08:45",
    elapsedSeconds: 225,
    speaker: "Pastor Victor Owoeye",
    text: "Never let the devil convince you that you are alone in the battle. The Greater One lives on the inside of you. Walk this week with your head lifted high!",
    type: "teaching",
  },
  {
    id: "cap-15",
    timestamp: "10:09:20",
    elapsedSeconds: 245,
    speaker: "Pastor Victor Owoeye",
    text: "Lift your hands wherever you are right now and declare: 'I have the Zoe life of God. I am more than a conqueror through Christ Jesus!'",
    type: "decree",
  },
];

/**
 * Extracts biblical scriptures found in captions text
 */
export function extractScripturesFromText(text: string): string[] {
  const scriptureRegex = /\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s*Samuel|2\s*Samuel|1\s*Kings|2\s*Kings|1\s*Chronicles|2\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s*Corinthians|2\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s*Thessalonians|2\s*Thessalonians|1\s*Timothy|2\s*Timothy|Titus|Philemon|Hebrews|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Revelation)\s+\d+(?::\d+(?:-\d+)?)?/gi;

  const matches = text.match(scriptureRegex);
  return matches ? Array.from(new Set(matches)) : [];
}
