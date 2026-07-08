// Phonics grapheme and word bank
// Covers Letters and Sounds Phases 2-5 (the framework most UK phonics schemes,
// including Little Wandle and RWI, are built on or closely mirror).
// Phase 2-3 = Reception. Phase 4 = Reception (consolidation, no new graphemes).
// Phase 5 = Year 1 (new graphemes + alternative spellings/pronunciations).
//
// Content sourced from 2026 National Phonics Screening Check materials.
// Crown copyright, licensed under the Open Government Licence v3.0
// (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

export type Phase = 2 | 3 | 4 | 5;

export interface GraphemeEntry {
  phase: Phase;
  grapheme: string;
  words: string[];
}

export const graphemeBank: GraphemeEntry[] = [
  // ---------- PHASE 2 (Reception, term 1) ----------
  { phase: 2, grapheme: 's', words: ['sat', 'sip', 'sun', 'sock', 'six', 'sad', 'sob', 'sit', 'sap', 'sun'] },
  { phase: 2, grapheme: 'a', words: ['at', 'am', 'an', 'ant', 'ask', 'cat', 'hat', 'map', 'sad', 'jam'] },
  { phase: 2, grapheme: 't', words: ['tap', 'tin', 'ten', 'top', 'tug', 'cat', 'hat', 'sit', 'bat', 'pot'] },
  { phase: 2, grapheme: 'p', words: ['pat', 'pin', 'pot', 'pup', 'pen', 'cup', 'tip', 'map', 'sip', 'hop'] },
  { phase: 2, grapheme: 'i', words: ['it', 'in', 'is', 'ink', 'itch', 'sit', 'pit', 'tin', 'dig', 'fin'] },
  { phase: 2, grapheme: 'n', words: ['nap', 'net', 'nut', 'nod', 'nip', 'pan', 'tin', 'run', 'fun', 'sun'] },
  { phase: 2, grapheme: 'm', words: ['mat', 'man', 'map', 'mud', 'mum', 'ham', 'jam', 'ram', 'hem', 'gum'] },
  { phase: 2, grapheme: 'd', words: ['dad', 'dog', 'dig', 'dot', 'dip', 'mud', 'bed', 'sad', 'red', 'mid'] },
  { phase: 2, grapheme: 'g', words: ['gap', 'got', 'gas', 'gum', 'dig', 'bag', 'leg', 'wig', 'big', 'jog'] },
  { phase: 2, grapheme: 'o', words: ['on', 'ox', 'off', 'odd', 'hot', 'dog', 'cot', 'top', 'pot', 'mob'] },
  { phase: 2, grapheme: 'c', words: ['cat', 'cap', 'cot', 'cup', 'cod', 'can', 'cob', 'cut', 'cog', 'cab'] },
  { phase: 2, grapheme: 'k', words: ['kid', 'kit', 'king', 'kiss', 'kelp', 'silk', 'ink', 'oak', 'husky', 'karate'] },
  { phase: 2, grapheme: 'ck', words: ['kick', 'sack', 'sock', 'duck', 'lock', 'neck', 'back', 'rock', 'deck', 'pack'] },
  { phase: 2, grapheme: 'e', words: ['egg', 'end', 'elf', 'echo', 'exit', 'pen', 'ten', 'red', 'wet', 'bed'] },
  { phase: 2, grapheme: 'u', words: ['up', 'us', 'ugly', 'under', 'uncle', 'mud', 'cup', 'sun', 'bug', 'hut'] },
  { phase: 2, grapheme: 'r', words: ['rat', 'run', 'red', 'rip', 'rug', 'car', 'far', 'star', 'bar', 'ran'] },
  { phase: 2, grapheme: 'h', words: ['hat', 'hen', 'hop', 'hut', 'hit', 'ham', 'hip', 'hum', 'hug', 'hot'] },
  { phase: 2, grapheme: 'b', words: ['bat', 'big', 'bed', 'bun', 'bag', 'cab', 'rib', 'tub', 'cub', 'rob'] },
  { phase: 2, grapheme: 'f', words: ['fan', 'fit', 'fog', 'fun', 'fig', 'fox', 'fed', 'fun', 'fat', 'fit'] },
  { phase: 2, grapheme: 'ff', words: ['off', 'cliff', 'puff', 'huff', 'stiff', 'cuff', 'sniff', 'toffee', 'sheriff', 'staff'] },
  { phase: 2, grapheme: 'l', words: ['leg', 'log', 'lip', 'lid', 'lap', 'lot', 'lit', 'lug', 'let', 'log'] },
  { phase: 2, grapheme: 'll', words: ['bell', 'doll', 'fill', 'hill', 'well', 'bull', 'shell', 'spell', 'still', 'smell'] },
  { phase: 2, grapheme: 'ss', words: ['hiss', 'kiss', 'mess', 'boss', 'mass', 'loss', 'fuss', 'moss', 'less', 'pass'] },

  // ---------- PHASE 3 (Reception, term 2) ----------
  { phase: 3, grapheme: 'j', words: ['jet', 'jam', 'jog', 'jug', 'jar', 'jelly', 'jump', 'jog', 'jig', 'jest'] },
  { phase: 3, grapheme: 'v', words: ['van', 'vet', 'vest', 'visit', 'seven', 'velvet', 'oval', 'cave', 'move', 'give'] },
  { phase: 3, grapheme: 'w', words: ['wig', 'web', 'win', 'wet', 'wag', 'wax', 'wet', 'win', 'wind', 'wish'] },
  { phase: 3, grapheme: 'x', words: ['box', 'fox', 'six', 'mix', 'fix', 'wax', 'tax', 'exit', 'oxen', 'text'] },
  { phase: 3, grapheme: 'y', words: ['yes', 'yet', 'yell', 'yak', 'yum', 'yolk', 'yawn', 'yard', 'yarn', 'yank'] },
  { phase: 3, grapheme: 'z', words: ['zip', 'zap', 'zoo', 'zebra', 'zigzag', 'zero', 'zoom', 'zone', 'zeal', 'zesty'] },
  { phase: 3, grapheme: 'zz', words: ['buzz', 'fizz', 'jazz', 'fuzz', 'whizz', 'quiz', 'dizzy', 'puzzle', 'nozzle', 'muzzle'] },
  { phase: 3, grapheme: 'qu', words: ['quit', 'quiz', 'quick', 'queen', 'quack', 'quilt', 'quiet', 'squid', 'squad', 'quest'] },
  { phase: 3, grapheme: 'ch', words: ['chip', 'chat', 'chin', 'chop', 'much', 'rich', 'lunch', 'bench', 'chest', 'chick'] },
  { phase: 3, grapheme: 'sh', words: ['shop', 'shed', 'ship', 'shut', 'fish', 'wish', 'dash', 'rush', 'shell', 'shark'] },
  { phase: 3, grapheme: 'th', words: ['thin', 'that', 'this', 'moth', 'bath', 'with', 'then', 'them', 'think', 'thumb'] },
  { phase: 3, grapheme: 'ng', words: ['ring', 'song', 'king', 'long', 'sing', 'wing', 'bang', 'gong', 'hang', 'strong'] },
  { phase: 3, grapheme: 'ai', words: ['rain', 'tail', 'pain', 'snail', 'paint', 'wait', 'chain', 'brain', 'train', 'aim'] },
  { phase: 3, grapheme: 'ee', words: ['bee', 'feet', 'tree', 'sleep', 'green', 'deep', 'seed', 'week', 'sweet', 'queen'] },
  { phase: 3, grapheme: 'igh', words: ['high', 'sigh', 'night', 'light', 'might', 'fight', 'right', 'sight', 'tight', 'bright'] },
  { phase: 3, grapheme: 'oa', words: ['boat', 'coat', 'goat', 'road', 'soap', 'toad', 'foam', 'coal', 'loaf', 'float'] },
  { phase: 3, grapheme: 'oo_long', words: ['boot', 'food', 'moon', 'zoo', 'root', 'spoon', 'roof', 'pool', 'broom', 'balloon'] },
  { phase: 3, grapheme: 'oo_short', words: ['book', 'look', 'foot', 'wood', 'good', 'hook', 'cook', 'shook', 'wool', 'hood'] },
  { phase: 3, grapheme: 'ar', words: ['car', 'star', 'park', 'arm', 'art', 'farm', 'shark', 'card', 'yarn', 'scarf'] },
  { phase: 3, grapheme: 'or', words: ['for', 'fork', 'corn', 'sport', 'torn', 'born', 'storm', 'short', 'sort', 'north'] },
  { phase: 3, grapheme: 'ur', words: ['fur', 'hurt', 'turn', 'burn', 'surf', 'curl', 'nurse', 'burst', 'church', 'purse'] },
  { phase: 3, grapheme: 'ow', words: ['cow', 'owl', 'town', 'brown', 'down', 'now', 'crown', 'howl', 'clown', 'frown'] },
  { phase: 3, grapheme: 'oi', words: ['coin', 'boil', 'oil', 'join', 'soil', 'point', 'coil', 'foil', 'spoil', 'moist'] },
  { phase: 3, grapheme: 'ear', words: ['dear', 'hear', 'year', 'fear', 'near', 'tear', 'clear', 'beard', 'spear', 'gear'] },
  { phase: 3, grapheme: 'air', words: ['fair', 'pair', 'hair', 'chair', 'stair', 'air', 'fairy', 'hairy', 'lair', 'dairy'] },
  { phase: 3, grapheme: 'ure', words: ['sure', 'pure', 'cure', 'endure', 'manure', 'obscure', 'mature', 'secure', 'lure', 'cured'] },
  { phase: 3, grapheme: 'er', words: ['letter', 'dinner', 'summer', 'better', 'ladder', 'sister', 'winter', 'under', 'runner', 'hammer'] },

  // ---------- PHASE 4 (Reception, consolidation, no new graphemes) ----------
  // Phase 4 introduces no new GPCs. Focus is on words with adjacent consonants
  // (blends) at the start and end of words. Kept as one group rather than
  // per-grapheme since the point is blending existing sounds, not new sounds.
  {
    phase: 4,
    grapheme: 'adjacent_consonants',
    words: [
      'best', 'tent', 'hand', 'milk', 'crisp', 'stamp', 'trap', 'drum', 'plan', 'spend',
      'black', 'frog', 'sleep', 'swim', 'clamp', 'brush', 'strong', 'scrap', 'crept', 'gift',
      'stop', 'flag', 'grin', 'skip', 'slip', 'snap', 'twin', 'stand', 'blend', 'crust',
    ],
  },

  // ---------- PHASE 5 (Year 1) ----------
  { phase: 5, grapheme: 'ay', words: ['day', 'play', 'may', 'say', 'stay', 'tray', 'clay', 'spray', 'crayon', 'delay'] },
  { phase: 5, grapheme: 'ou', words: ['out', 'about', 'cloud', 'sound', 'shout', 'found', 'proud', 'scout', 'mountain', 'loudest'] },
  { phase: 5, grapheme: 'ie', words: ['tie', 'pie', 'lie', 'die', 'cried', 'tried', 'spied', 'fried', 'replied', 'denied'] },
  { phase: 5, grapheme: 'ea', words: ['eat', 'sea', 'tea', 'read', 'meat', 'treat', 'seat', 'bead', 'heap', 'repeat'] },
  { phase: 5, grapheme: 'oy', words: ['boy', 'toy', 'joy', 'enjoy', 'annoy', 'royal', 'oyster', 'employ', 'destroy', 'convoy'] },
  { phase: 5, grapheme: 'ir', words: ['girl', 'bird', 'first', 'shirt', 'third', 'birthday', 'circle', 'dirty', 'stir', 'twirl'] },
  { phase: 5, grapheme: 'ue', words: ['blue', 'glue', 'true', 'rescue', 'clue', 'value', 'argue', 'statue', 'venue', 'avenue'] },
  { phase: 5, grapheme: 'aw', words: ['saw', 'paw', 'claw', 'straw', 'yawn', 'crawl', 'draw', 'dawn', 'shawl', 'prawn'] },
  { phase: 5, grapheme: 'wh', words: ['when', 'what', 'why', 'whale', 'wheel', 'which', 'where', 'whisper', 'white', 'wheat'] },
  { phase: 5, grapheme: 'ph', words: ['photo', 'phone', 'dolphin', 'elephant', 'alphabet', 'sphinx', 'prophet', 'nephew', 'graph', 'trophy'] },
  { phase: 5, grapheme: 'ew', words: ['new', 'chew', 'grew', 'drew', 'few', 'blew', 'crew', 'flew', 'threw', 'stew'] },
  { phase: 5, grapheme: 'oe', words: ['toe', 'hoe', 'foe', 'goes', 'tomatoes', 'potatoes', 'heroes', 'doe', 'woe', 'mistletoe'] },
  { phase: 5, grapheme: 'au', words: ['Paul', 'sauce', 'author', 'August', 'haul', 'launch', 'astronaut', 'dinosaur', 'fault', 'cause'] },
  { phase: 5, grapheme: 'ey', words: ['money', 'monkey', 'donkey', 'key', 'honey', 'chimney', 'valley', 'trolley', 'turkey', 'hockey'] },
  { phase: 5, grapheme: 'a-e', words: ['make', 'cake', 'gate', 'plane', 'snake', 'brave', 'shape', 'flame', 'grape', 'skate'] },
  { phase: 5, grapheme: 'e-e', words: ['these', 'theme', 'athlete', 'complete', 'delete', 'extreme', 'concrete', 'compete', 'stampede', 'eve'] },
  { phase: 5, grapheme: 'i-e', words: ['like', 'time', 'bike', 'kite', 'smile', 'slide', 'shine', 'twice', 'stripe', 'invite'] },
  { phase: 5, grapheme: 'o-e', words: ['home', 'bone', 'rope', 'stone', 'phone', 'smoke', 'globe', 'those', 'broke', 'joke'] },
  { phase: 5, grapheme: 'u-e', words: ['tune', 'cube', 'tube', 'cute', 'rude', 'flute', 'flume', 'dune', 'mule', 'plume'] },
];

// Tricky/exception words (high-frequency, not fully phonetically decodable
// at the point they're introduced). Useful for a separate "sight words" deck
// alongside the phonics-sound decks, but not for testing a specific GPC.
export interface TrickyWordSet {
  phase: Phase;
  words: string[];
}

export const trickyWordBank: TrickyWordSet[] = [
  { phase: 2, words: ['the', 'to', 'I', 'no', 'go', 'into'] },
  { phase: 3, words: ['he', 'she', 'we', 'me', 'be', 'was', 'you', 'they', 'all', 'are', 'my', 'her'] },
  { phase: 4, words: ['said', 'have', 'like', 'so', 'do', 'some', 'come', 'were', 'there', 'little', 'one', 'when', 'out', 'what'] },
  { phase: 5, words: ['oh', 'their', 'people', 'Mr', 'Mrs', 'looked', 'called', 'asked', 'water', 'again', 'half', 'money'] },
];
