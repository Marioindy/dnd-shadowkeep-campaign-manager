/**
 * Default Campaign Templates Seed Data
 *
 * This file contains 6 pre-built campaign templates covering different genres and difficulty levels.
 * These templates can be used to quickly bootstrap new campaigns with rich content.
 *
 * To seed the database, import and use these templates with the createTemplate mutation.
 */

export const defaultTemplates = [
  // ============================================================================
  // TEMPLATE 1: Lost Mines of Phandelver - Classic Fantasy Adventure
  // ============================================================================
  {
    name: 'Lost Mines of Phandelver',
    description:
      'A classic fantasy adventure for new adventurers. Explore ancient ruins, battle goblins, and uncover the secrets of Wave Echo Cave.',
    genre: 'fantasy' as const,
    difficulty: 'beginner' as const,
    recommendedPlayers: { min: 3, max: 5 },
    imageUrl: undefined,
    lore: `The frontier town of Phandalin has stood empty for centuries, but a recent influx of settlers has breathed new life into the area. The town is threatened by bandits, goblins, and other dangers from the wilderness.

Long ago, the Phandelver's Pact united dwarves and gnomes to mine the rich mineral deposits of Wave Echo Cave. However, orcs sacked the mines and the location was lost to time. Now, the mines have been rediscovered, and various factions race to claim its treasures.

The adventurers are hired to escort a wagon of supplies to Phandalin, but they soon discover that the job is more dangerous than it first appeared. The dwarf Gundren Rockseeker and his brothers believe they have found the entrance to Wave Echo Cave, and someone is willing to kill to get their hands on the map.`,

    characterTemplates: [
      {
        name: 'Thalia Brightblade',
        race: 'Human',
        class: 'Fighter',
        level: 1,
        stats: {
          strength: 16,
          dexterity: 14,
          constitution: 15,
          intelligence: 10,
          wisdom: 12,
          charisma: 8,
          hp: 12,
          maxHp: 12,
          ac: 18,
          speed: 30,
        },
        backstory:
          'A former soldier seeking redemption for a past failure. Thalia left her regiment to find her own path and prove her worth.',
        portraitUrl: undefined,
      },
      {
        name: 'Eldric Whisperwind',
        race: 'Elf',
        class: 'Wizard',
        level: 1,
        stats: {
          strength: 8,
          dexterity: 14,
          constitution: 12,
          intelligence: 16,
          wisdom: 13,
          charisma: 10,
          hp: 7,
          maxHp: 7,
          ac: 12,
          speed: 30,
        },
        backstory:
          'A scholarly elf from the Feywild, Eldric seeks ancient magical knowledge and has traveled to the material plane to study forgotten spells.',
        portraitUrl: undefined,
      },
      {
        name: 'Bramble Goodbarrel',
        race: 'Halfling',
        class: 'Rogue',
        level: 1,
        stats: {
          strength: 10,
          dexterity: 16,
          constitution: 12,
          intelligence: 13,
          wisdom: 11,
          charisma: 14,
          hp: 9,
          maxHp: 9,
          ac: 15,
          speed: 25,
        },
        backstory:
          'A cunning halfling with a mysterious past. Bramble left home to escape debt collectors and has since learned to survive by wit and stealth.',
        portraitUrl: undefined,
      },
      {
        name: 'Sister Mira',
        race: 'Dwarf',
        class: 'Cleric',
        level: 1,
        stats: {
          strength: 14,
          dexterity: 10,
          constitution: 15,
          intelligence: 11,
          wisdom: 16,
          charisma: 12,
          hp: 10,
          maxHp: 10,
          ac: 16,
          speed: 25,
        },
        backstory:
          'A devout cleric of Moradin, Mira has been sent by her temple to recover lost dwarven artifacts and bring light to dark places.',
        portraitUrl: undefined,
      },
    ],

    npcTemplates: [
      {
        name: 'Sildar Hallwinter',
        role: 'Quest Giver / Ally',
        description:
          'A kindhearted human warrior of the Lords Alliance. He is loyal, brave, and honorable. Captured by goblins while escorting Gundren Rockseeker.',
        stats: {
          hp: 27,
          maxHp: 27,
          ac: 16,
          initiativeBonus: 0,
        },
      },
      {
        name: 'Gundren Rockseeker',
        role: 'Quest Giver',
        description:
          'An enthusiastic dwarf prospector who has discovered the location of Wave Echo Cave. He hires the party to escort supplies to Phandalin.',
        stats: undefined,
      },
      {
        name: 'Toblen Stonehill',
        role: 'Innkeeper',
        description:
          'The friendly proprietor of the Stonehill Inn in Phandalin. A source of local rumors and a safe place to rest.',
        stats: undefined,
      },
      {
        name: 'Sister Garaele',
        role: 'Quest Giver',
        description:
          'A zealous young elf cleric of Tymora who serves as a member of the Harpers. She seeks information about a spellbook.',
        stats: undefined,
      },
    ],

    mapTemplates: [
      {
        name: 'Phandalin Town',
        description:
          'A small frontier settlement with various shops, an inn, and a town master. Recently troubled by the Redbrands gang.',
        imageUrl: undefined,
        markers: [
          {
            type: 'poi' as const,
            x: 50,
            y: 30,
            label: 'Stonehill Inn',
            color: '#3b82f6',
          },
          {
            type: 'poi' as const,
            x: 70,
            y: 40,
            label: 'Townmaster Hall',
            color: '#10b981',
          },
          {
            type: 'poi' as const,
            x: 30,
            y: 60,
            label: 'Shrine of Luck',
            color: '#f59e0b',
          },
          {
            type: 'enemy' as const,
            x: 80,
            y: 70,
            label: 'Redbrand Hideout',
            color: '#ef4444',
          },
        ],
      },
      {
        name: 'Cragmaw Hideout',
        description:
          'A cave complex inhabited by the Cragmaw goblins. The entrance is hidden behind a waterfall.',
        imageUrl: undefined,
        markers: [
          {
            type: 'player' as const,
            x: 10,
            y: 90,
            label: 'Entrance',
            color: '#3b82f6',
          },
          {
            type: 'enemy' as const,
            x: 40,
            y: 60,
            label: 'Goblin Guards',
            color: '#ef4444',
          },
          {
            type: 'npc' as const,
            x: 70,
            y: 30,
            label: 'Sildar (Prisoner)',
            color: '#10b981',
          },
        ],
      },
    ],

    encounterTemplates: [
      {
        name: 'Goblin Ambush',
        description:
          'Four goblins ambush the party on the Triboar Trail, attempting to steal supplies.',
        enemies: [
          {
            name: 'Goblin Archer 1',
            hp: 7,
            maxHp: 7,
            ac: 15,
            initiativeBonus: 2,
          },
          {
            name: 'Goblin Archer 2',
            hp: 7,
            maxHp: 7,
            ac: 15,
            initiativeBonus: 2,
          },
          {
            name: 'Goblin Scout 1',
            hp: 7,
            maxHp: 7,
            ac: 15,
            initiativeBonus: 2,
          },
          {
            name: 'Goblin Scout 2',
            hp: 7,
            maxHp: 7,
            ac: 15,
            initiativeBonus: 2,
          },
        ],
      },
      {
        name: 'Redbrand Ruffians',
        description:
          'A group of thugs wearing scarlet cloaks harass the party in Phandalin.',
        enemies: [
          {
            name: 'Redbrand Ruffian 1',
            hp: 11,
            maxHp: 11,
            ac: 12,
            initiativeBonus: 1,
          },
          {
            name: 'Redbrand Ruffian 2',
            hp: 11,
            maxHp: 11,
            ac: 12,
            initiativeBonus: 1,
          },
          {
            name: 'Redbrand Ruffian 3',
            hp: 11,
            maxHp: 11,
            ac: 12,
            initiativeBonus: 1,
          },
        ],
      },
    ],

    starterItems: [
      {
        name: 'Longsword',
        type: 'weapon' as const,
        quantity: 1,
        weight: 3,
        description: 'A versatile martial weapon dealing 1d8 slashing damage.',
        properties: { damage: '1d8', damageType: 'slashing', versatile: '1d10' },
      },
      {
        name: 'Healing Potion',
        type: 'potion' as const,
        quantity: 2,
        weight: 0.5,
        description: 'Restores 2d4+2 hit points when consumed.',
        properties: { healing: '2d4+2' },
      },
      {
        name: 'Chain Mail',
        type: 'armor' as const,
        quantity: 1,
        weight: 55,
        description: 'Heavy armor providing AC 16. Requires Strength 13.',
        properties: { ac: 16, armorType: 'heavy', strengthReq: 13 },
      },
      {
        name: "Burglar's Pack",
        type: 'tool' as const,
        quantity: 1,
        weight: 42.5,
        description:
          "Includes backpack, ball bearings, string, bell, candles, crowbar, hammer, pitons, hooded lantern, oil, rations, tinderbox, waterskin, and rope.",
        properties: {},
      },
    ],

    isOfficial: true,
    isPublic: true,
    tags: ['fantasy', 'beginner-friendly', 'classic', 'dungeon-crawl', 'mystery'],
  },

  // ============================================================================
  // TEMPLATE 2: Curse of Strahd - Gothic Horror
  // ============================================================================
  {
    name: 'Curse of Strahd',
    description:
      'A gothic horror campaign set in the mist-shrouded land of Barovia, ruled by the vampire Count Strahd von Zarovich.',
    genre: 'horror' as const,
    difficulty: 'intermediate' as const,
    recommendedPlayers: { min: 4, max: 6 },
    imageUrl: undefined,
    lore: `Under raging storm clouds, the vampire Count Strahd von Zarovich stands silhouetted against the ancient walls of Castle Ravenloft. Rumbling thunder pounds the castle spires. The wind's howling increases as he turns his gaze down toward the village of Barovia.

The land of Barovia is a twisted reflection of a once-beautiful realm. Mists surround the valley, trapping both its residents and any unfortunate souls who wander in. Strahd rules this domain as both its master and its prisoner, cursed to forever desire what he cannot have.

The Dark Powers have granted Strahd immortality and dominion over Barovia, but they also ensure his eternal torment. Every generation, someone resembling his lost love Tatyana appears, and every time, she dies before Strahd can claim her. The current incarnation is Ireena Kolyana, and the adventurers may be her only hope for escape.`,

    characterTemplates: [
      {
        name: 'Van Richten',
        race: 'Human',
        class: 'Fighter',
        level: 3,
        stats: {
          strength: 15,
          dexterity: 14,
          constitution: 14,
          intelligence: 13,
          wisdom: 16,
          charisma: 10,
          hp: 28,
          maxHp: 28,
          ac: 17,
          speed: 30,
        },
        backstory:
          'A legendary monster hunter who has dedicated his life to destroying vampires. His son was killed by undead, fueling his vendetta.',
        portraitUrl: undefined,
      },
      {
        name: 'Ezmerelda d\'Avenir',
        race: 'Human',
        class: 'Rogue',
        level: 3,
        stats: {
          strength: 12,
          dexterity: 17,
          constitution: 13,
          intelligence: 14,
          wisdom: 13,
          charisma: 16,
          hp: 22,
          maxHp: 22,
          ac: 15,
          speed: 30,
        },
        backstory:
          'A Vistani woman who lost her leg to a werewolf. She wears a prosthetic and hunts monsters with Van Richten.',
        portraitUrl: undefined,
      },
    ],

    npcTemplates: [
      {
        name: 'Strahd von Zarovich',
        role: 'Antagonist',
        description:
          'The ancient vampire lord who rules Barovia with an iron fist. Charismatic, intelligent, and utterly ruthless.',
        stats: {
          hp: 144,
          maxHp: 144,
          ac: 16,
          initiativeBonus: 4,
        },
      },
      {
        name: 'Ireena Kolyana',
        role: 'Quest Giver / Ally',
        description:
          'The adopted daughter of the village burgomaster. Bears an uncanny resemblance to Tatyana, Strahd\'s lost love.',
        stats: undefined,
      },
      {
        name: 'Madam Eva',
        role: 'Oracle',
        description:
          'The ancient leader of a Vistani camp. She reads fortunes with the Tarokka deck and knows secrets about Strahd.',
        stats: undefined,
      },
      {
        name: 'Ismark the Lesser',
        role: 'Ally',
        description:
          'Ireena\'s brother and son of the late burgomaster. A brave warrior trying to protect his sister.',
        stats: {
          hp: 30,
          maxHp: 30,
          ac: 15,
          initiativeBonus: 1,
        },
      },
    ],

    mapTemplates: [
      {
        name: 'Village of Barovia',
        description:
          'A dreary village of squat, wooden buildings surrounded by fog. The people are downtrodden and fearful.',
        imageUrl: undefined,
        markers: [
          {
            type: 'poi' as const,
            x: 40,
            y: 50,
            label: 'Blood of the Vine Tavern',
            color: '#991b1b',
          },
          {
            type: 'poi' as const,
            x: 60,
            y: 40,
            label: 'Burgomaster\'s Mansion',
            color: '#3b82f6',
          },
          {
            type: 'poi' as const,
            x: 50,
            y: 70,
            label: 'Church',
            color: '#f59e0b',
          },
        ],
      },
      {
        name: 'Castle Ravenloft',
        description:
          'The towering fortress of Count Strahd, perched atop a mountain and shrouded in mist.',
        imageUrl: undefined,
        markers: [
          {
            type: 'player' as const,
            x: 50,
            y: 90,
            label: 'Main Gate',
            color: '#3b82f6',
          },
          {
            type: 'enemy' as const,
            x: 50,
            y: 30,
            label: 'Strahd\'s Throne Room',
            color: '#7c2d12',
          },
          {
            type: 'poi' as const,
            x: 30,
            y: 50,
            label: 'Crypts',
            color: '#4b5563',
          },
        ],
      },
    ],

    encounterTemplates: [
      {
        name: 'Zombie Horde',
        description:
          'Undead shamble from the graveyard, their moans echoing through the mist.',
        enemies: [
          {
            name: 'Zombie 1',
            hp: 22,
            maxHp: 22,
            ac: 8,
            initiativeBonus: -2,
          },
          {
            name: 'Zombie 2',
            hp: 22,
            maxHp: 22,
            ac: 8,
            initiativeBonus: -2,
          },
          {
            name: 'Zombie 3',
            hp: 22,
            maxHp: 22,
            ac: 8,
            initiativeBonus: -2,
          },
          {
            name: 'Zombie 4',
            hp: 22,
            maxHp: 22,
            ac: 8,
            initiativeBonus: -2,
          },
        ],
      },
      {
        name: 'Vampire Spawn',
        description:
          'Strahd\'s undead servants emerge from the shadows to attack.',
        enemies: [
          {
            name: 'Vampire Spawn 1',
            hp: 82,
            maxHp: 82,
            ac: 15,
            initiativeBonus: 3,
          },
          {
            name: 'Vampire Spawn 2',
            hp: 82,
            maxHp: 82,
            ac: 15,
            initiativeBonus: 3,
          },
        ],
      },
    ],

    starterItems: [
      {
        name: 'Silvered Longsword',
        type: 'weapon' as const,
        quantity: 1,
        weight: 3,
        description:
          'A longsword coated in silver, effective against lycanthropes and undead.',
        properties: { damage: '1d8', damageType: 'slashing', silvered: true },
      },
      {
        name: 'Holy Symbol',
        type: 'tool' as const,
        quantity: 1,
        weight: 1,
        description:
          'A blessed symbol that can be used to turn undead or as a divine focus.',
        properties: { sacred: true },
      },
      {
        name: 'Wooden Stakes',
        type: 'weapon' as const,
        quantity: 5,
        weight: 0.5,
        description: 'Essential for destroying vampires in their coffins.',
        properties: { vampireSlaying: true },
      },
    ],

    isOfficial: true,
    isPublic: true,
    tags: ['horror', 'gothic', 'vampires', 'dark', 'roleplay-heavy'],
  },

  // ============================================================================
  // TEMPLATE 3: Cyberpunk 2077 - Night City
  // ============================================================================
  {
    name: 'Cyberpunk: Night City Chronicles',
    description:
      'Navigate the neon-lit streets of Night City, where mega-corporations rule and cybernetic enhancement is a way of life.',
    genre: 'cyberpunk' as const,
    difficulty: 'advanced' as const,
    recommendedPlayers: { min: 3, max: 5 },
    imageUrl: undefined,
    lore: `The year is 2077. Night City, a sprawling metropolis on the California coast, has become a beacon of excess and technological advancement. Mega-corporations like Arasaka and Militech wield more power than governments, and the gap between rich and poor has never been wider.

In this city, cybernetic enhancement is commonplace. People replace their organic parts with chrome, seeking to transcend human limitations. But every upgrade comes with a cost—not just in eddies, but in humanity itself.

You are edgerunners, mercenaries operating in the shadows between corporate interests and street gangs. One day you're stealing data from a corporate vault; the next, you're protecting a client from assassins. It's a dangerous life, but the rewards—and the adrenaline—keep you coming back.

Recently, whispers have spread about a mysterious AI hidden in Night City's old network. Some say it's a ghost in the machine, others claim it's the key to bringing down the corporations. Your crew has been hired to find out the truth.`,

    characterTemplates: [
      {
        name: 'V "Cipher" Martinez',
        race: 'Human (Augmented)',
        class: 'Netrunner',
        level: 5,
        stats: {
          strength: 10,
          dexterity: 14,
          constitution: 12,
          intelligence: 18,
          wisdom: 13,
          charisma: 11,
          hp: 32,
          maxHp: 32,
          ac: 14,
          speed: 30,
        },
        backstory:
          'A talented hacker who grew up in the slums of Watson. V discovered their gift for netrunning early and now sells their skills to the highest bidder.',
        portraitUrl: undefined,
      },
      {
        name: 'Jackie Welles',
        race: 'Human (Augmented)',
        class: 'Solo',
        level: 5,
        stats: {
          strength: 16,
          dexterity: 14,
          constitution: 16,
          intelligence: 10,
          wisdom: 12,
          charisma: 14,
          hp: 45,
          maxHp: 45,
          ac: 17,
          speed: 30,
        },
        backstory:
          'A street-smart merc from Heywood with dreams of making it to the big leagues. Loyal to a fault and packing heavy chrome.',
        portraitUrl: undefined,
      },
    ],

    npcTemplates: [
      {
        name: 'Dex DeShawn',
        role: 'Fixer',
        description:
          'A well-connected fixer who brokers deals between edgerunners and clients. Always impeccably dressed.',
        stats: undefined,
      },
      {
        name: 'Rogue',
        role: 'Quest Giver',
        description:
          'The legendary owner of the Afterlife, the most exclusive club for edgerunners in Night City.',
        stats: undefined,
      },
      {
        name: 'Adam Smasher',
        role: 'Antagonist',
        description:
          'A full-body cyborg and Arasaka\'s most feared enforcer. More machine than man, utterly merciless.',
        stats: {
          hp: 150,
          maxHp: 150,
          ac: 20,
          initiativeBonus: 5,
        },
      },
    ],

    mapTemplates: [
      {
        name: 'Afterlife Club',
        description:
          'An exclusive nightclub for edgerunners. Neon lights, expensive drinks, and dangerous deals.',
        imageUrl: undefined,
        markers: [
          {
            type: 'poi' as const,
            x: 50,
            y: 50,
            label: 'Bar',
            color: '#ec4899',
          },
          {
            type: 'npc' as const,
            x: 70,
            y: 30,
            label: 'Rogue\'s Booth',
            color: '#8b5cf6',
          },
        ],
      },
      {
        name: 'Arasaka Tower',
        description:
          'The gleaming headquarters of the Arasaka Corporation, a symbol of corporate power.',
        imageUrl: undefined,
        markers: [
          {
            type: 'enemy' as const,
            x: 50,
            y: 20,
            label: 'Executive Floor',
            color: '#ef4444',
          },
          {
            type: 'poi' as const,
            x: 50,
            y: 80,
            label: 'Lobby',
            color: '#3b82f6',
          },
        ],
      },
    ],

    encounterTemplates: [
      {
        name: 'Corpo Security',
        description: 'Corporate security guards protecting valuable assets.',
        enemies: [
          {
            name: 'Security Guard 1',
            hp: 35,
            maxHp: 35,
            ac: 16,
            initiativeBonus: 2,
          },
          {
            name: 'Security Guard 2',
            hp: 35,
            maxHp: 35,
            ac: 16,
            initiativeBonus: 2,
          },
          {
            name: 'Elite Guard',
            hp: 50,
            maxHp: 50,
            ac: 18,
            initiativeBonus: 3,
          },
        ],
      },
    ],

    starterItems: [
      {
        name: 'Mantis Blades',
        type: 'weapon' as const,
        quantity: 1,
        weight: 0,
        description: 'Cybernetic arm blades that deploy instantly. Deadly in melee.',
        properties: { damage: '2d6', damageType: 'slashing', cyberware: true },
      },
      {
        name: 'Cyberdeck',
        type: 'tool' as const,
        quantity: 1,
        weight: 2,
        description: 'Essential equipment for netrunning. Allows hacking and data theft.',
        properties: { hackBonus: 5 },
      },
    ],

    isOfficial: true,
    isPublic: true,
    tags: ['cyberpunk', 'sci-fi', 'urban', 'technology', 'morally-gray'],
  },

  // ============================================================================
  // TEMPLATE 4: Steampunk Skies
  // ============================================================================
  {
    name: 'Steampunk Skies: The Brass Horizon',
    description:
      'Sail the skies in steam-powered airships, exploring floating cities and uncovering ancient technology.',
    genre: 'steampunk' as const,
    difficulty: 'intermediate' as const,
    recommendedPlayers: { min: 3, max: 5 },
    imageUrl: undefined,
    lore: `In the Age of Steam, humanity has conquered the skies. Great airships powered by coal and clockwork soar between floating islands and cloud cities. The world below has been rendered uninhabitable by the Great Smog—a disaster caused by unchecked industrial pollution.

The sky-nations are locked in a delicate balance of power. The Brass Empire seeks to unite all under their rule through superior technology. The Free Merchants value trade and independence above all. The Cloudborn Clergy believes the skies are sacred and technology has gone too far.

You are the crew of the Brass Horizon, an independent merchant airship. You take odd jobs—smuggling, treasure hunting, passenger transport—whatever pays the bills. But when you discover a map to a legendary pre-Smog vault, you find yourselves caught in a race against pirates, empires, and fate itself.`,

    characterTemplates: [
      {
        name: 'Captain Amelia Cogsworth',
        race: 'Human',
        class: 'Artificer',
        level: 4,
        stats: {
          strength: 12,
          dexterity: 14,
          constitution: 13,
          intelligence: 16,
          wisdom: 14,
          charisma: 15,
          hp: 28,
          maxHp: 28,
          ac: 15,
          speed: 30,
        },
        backstory:
          'A brilliant inventor who captains her own airship. Amelia fled the Brass Empire to pursue freedom and adventure.',
        portraitUrl: undefined,
      },
      {
        name: 'Rusty "Ironhands" McGraw',
        race: 'Dwarf',
        class: 'Fighter',
        level: 4,
        stats: {
          strength: 16,
          dexterity: 12,
          constitution: 16,
          intelligence: 10,
          wisdom: 11,
          charisma: 13,
          hp: 38,
          maxHp: 38,
          ac: 17,
          speed: 25,
        },
        backstory:
          'The ship\'s engineer and muscle. Rusty lost both hands in a boiler explosion and replaced them with mechanical prosthetics.',
        portraitUrl: undefined,
      },
    ],

    npcTemplates: [
      {
        name: 'Lord Reginald Brass',
        role: 'Antagonist',
        description:
          'The ruthless leader of the Brass Empire\'s sky fleet. Wants to monopolize all ancient technology.',
        stats: {
          hp: 75,
          maxHp: 75,
          ac: 18,
          initiativeBonus: 2,
        },
      },
      {
        name: 'Madame Celeste',
        role: 'Informant',
        description:
          'A mysterious fortune teller in the floating bazaar. Knows more than she lets on.',
        stats: undefined,
      },
    ],

    mapTemplates: [
      {
        name: 'The Floating Bazaar',
        description:
          'A massive marketplace suspended by countless balloons and propellers. Merchants from all sky-nations gather here.',
        imageUrl: undefined,
        markers: [
          {
            type: 'poi' as const,
            x: 40,
            y: 40,
            label: 'Airship Docks',
            color: '#3b82f6',
          },
          {
            type: 'poi' as const,
            x: 60,
            y: 60,
            label: 'Gear Market',
            color: '#f59e0b',
          },
        ],
      },
    ],

    encounterTemplates: [
      {
        name: 'Sky Pirates',
        description: 'Ruthless bandits who prey on merchant vessels.',
        enemies: [
          {
            name: 'Pirate Gunner 1',
            hp: 22,
            maxHp: 22,
            ac: 14,
            initiativeBonus: 2,
          },
          {
            name: 'Pirate Gunner 2',
            hp: 22,
            maxHp: 22,
            ac: 14,
            initiativeBonus: 2,
          },
          {
            name: 'Pirate Captain',
            hp: 45,
            maxHp: 45,
            ac: 16,
            initiativeBonus: 3,
          },
        ],
      },
    ],

    starterItems: [
      {
        name: 'Steam-Powered Grappling Hook',
        type: 'tool' as const,
        quantity: 1,
        weight: 5,
        description: 'Fires a grappling hook up to 50 feet. Essential for airship boarding.',
        properties: { range: 50 },
      },
      {
        name: 'Brass Goggles',
        type: 'misc' as const,
        quantity: 1,
        weight: 0.5,
        description: 'Protects eyes from wind and smog. Provides magnification.',
        properties: { vision: 'enhanced' },
      },
    ],

    isOfficial: true,
    isPublic: true,
    tags: ['steampunk', 'airships', 'exploration', 'adventure', 'sky-pirates'],
  },

  // ============================================================================
  // TEMPLATE 5: Zombie Apocalypse - The Last Stand
  // ============================================================================
  {
    name: 'The Last Stand: Zombie Apocalypse',
    description:
      'Survive in a world overrun by the undead. Scavenge resources, build defenses, and search for a cure.',
    genre: 'post-apocalyptic' as const,
    difficulty: 'intermediate' as const,
    recommendedPlayers: { min: 4, max: 6 },
    imageUrl: undefined,
    lore: `It started three months ago. The infection spread faster than anyone could have imagined. Within weeks, major cities fell. Within a month, civilization collapsed. Now, the dead walk the earth, and the living struggle to survive.

You are a group of survivors who have banded together in a fortified community. Every day is a fight for resources—food, water, medical supplies, ammunition. Every night, you reinforce the walls and pray the undead don't breach them.

But survival isn't enough. Rumors persist of a government facility that was working on a cure before the fall. The location is deep in zombie-controlled territory, but it might be humanity's only hope. Your group must decide: stay safe behind the walls, or risk everything for a chance at salvation.`,

    characterTemplates: [
      {
        name: 'Marcus "Doc" Rivera',
        race: 'Human',
        class: 'Cleric',
        level: 3,
        stats: {
          strength: 12,
          dexterity: 10,
          constitution: 14,
          intelligence: 15,
          wisdom: 16,
          charisma: 13,
          hp: 24,
          maxHp: 24,
          ac: 14,
          speed: 30,
        },
        backstory:
          'A former ER doctor who now serves as the community\'s medic. Haunted by those he couldn\'t save.',
        portraitUrl: undefined,
      },
      {
        name: 'Sarah "Hawk" Chen',
        race: 'Human',
        class: 'Ranger',
        level: 3,
        stats: {
          strength: 14,
          dexterity: 16,
          constitution: 13,
          intelligence: 11,
          wisdom: 15,
          charisma: 10,
          hp: 26,
          maxHp: 26,
          ac: 15,
          speed: 30,
        },
        backstory:
          'An Army veteran and expert survivalist. She leads scavenging missions and teaches combat skills.',
        portraitUrl: undefined,
      },
    ],

    npcTemplates: [
      {
        name: 'Mayor Thompson',
        role: 'Leader',
        description:
          'The elected leader of your survivor community. Tries to maintain order and hope.',
        stats: undefined,
      },
      {
        name: 'The Marauders',
        role: 'Antagonist',
        description:
          'A violent gang that preys on other survivors. Led by a ruthless warlord.',
        stats: undefined,
      },
    ],

    mapTemplates: [
      {
        name: 'Safe Zone - Community',
        description:
          'Your fortified settlement. Surrounded by walls made from cars, debris, and scrap metal.',
        imageUrl: undefined,
        markers: [
          {
            type: 'poi' as const,
            x: 50,
            y: 50,
            label: 'Town Hall',
            color: '#3b82f6',
          },
          {
            type: 'poi' as const,
            x: 30,
            y: 40,
            label: 'Armory',
            color: '#ef4444',
          },
          {
            type: 'poi' as const,
            x: 70,
            y: 60,
            label: 'Medical Tent',
            color: '#10b981',
          },
        ],
      },
      {
        name: 'Abandoned Mall',
        description:
          'A massive shopping complex now infested with zombies. Rich with supplies.',
        imageUrl: undefined,
        markers: [
          {
            type: 'enemy' as const,
            x: 40,
            y: 40,
            label: 'Zombie Horde',
            color: '#7c2d12',
          },
          {
            type: 'poi' as const,
            x: 60,
            y: 60,
            label: 'Pharmacy',
            color: '#10b981',
          },
        ],
      },
    ],

    encounterTemplates: [
      {
        name: 'Walker Horde',
        description: 'A large group of slow-moving zombies blocking your path.',
        enemies: [
          {
            name: 'Walker 1',
            hp: 15,
            maxHp: 15,
            ac: 8,
            initiativeBonus: -2,
          },
          {
            name: 'Walker 2',
            hp: 15,
            maxHp: 15,
            ac: 8,
            initiativeBonus: -2,
          },
          {
            name: 'Walker 3',
            hp: 15,
            maxHp: 15,
            ac: 8,
            initiativeBonus: -2,
          },
          {
            name: 'Walker 4',
            hp: 15,
            maxHp: 15,
            ac: 8,
            initiativeBonus: -2,
          },
          {
            name: 'Walker 5',
            hp: 15,
            maxHp: 15,
            ac: 8,
            initiativeBonus: -2,
          },
        ],
      },
      {
        name: 'Marauder Ambush',
        description: 'Hostile survivors trying to steal your supplies.',
        enemies: [
          {
            name: 'Marauder 1',
            hp: 30,
            maxHp: 30,
            ac: 14,
            initiativeBonus: 1,
          },
          {
            name: 'Marauder 2',
            hp: 30,
            maxHp: 30,
            ac: 14,
            initiativeBonus: 1,
          },
        ],
      },
    ],

    starterItems: [
      {
        name: 'Crowbar',
        type: 'weapon' as const,
        quantity: 1,
        weight: 5,
        description: 'Useful for combat and breaking into locked areas.',
        properties: { damage: '1d6', damageType: 'bludgeoning', versatile: true },
      },
      {
        name: 'First Aid Kit',
        type: 'misc' as const,
        quantity: 2,
        weight: 3,
        description: 'Bandages, antiseptic, and basic medical supplies.',
        properties: { healing: '1d6' },
      },
      {
        name: 'Canned Food',
        type: 'misc' as const,
        quantity: 10,
        weight: 1,
        description: 'Non-perishable rations. Essential for survival.',
        properties: {},
      },
    ],

    isOfficial: true,
    isPublic: true,
    tags: ['post-apocalyptic', 'zombies', 'survival', 'horror', 'resource-management'],
  },

  // ============================================================================
  // TEMPLATE 6: Sci-Fi Space Opera - Starbound Odyssey
  // ============================================================================
  {
    name: 'Starbound Odyssey',
    description:
      'Explore the galaxy aboard your starship, encountering alien civilizations, ancient mysteries, and cosmic threats.',
    genre: 'sci-fi' as const,
    difficulty: 'advanced' as const,
    recommendedPlayers: { min: 3, max: 5 },
    imageUrl: undefined,
    lore: `The year is 2847. Humanity has joined the Galactic Concordance, a coalition of alien species dedicated to maintaining peace and exploring the unknown regions of space. Faster-than-light travel has made the stars accessible, but the galaxy is vast and full of dangers.

You are the crew of the Odyssey, a sleek explorer-class starship. Your mission: to chart unexplored systems, make first contact with new civilizations, and investigate anomalies that threaten the Concordance.

Recently, strange signals have been detected from the Void Nebula, a region of space notorious for ship disappearances. The Concordance believes these signals may be from the Precursors, an ancient civilization that vanished millions of years ago. If the technology could be recovered, it would revolutionize galactic society—or destroy it.`,

    characterTemplates: [
      {
        name: 'Commander Aria Nakamura',
        race: 'Human',
        class: 'Fighter',
        level: 6,
        stats: {
          strength: 14,
          dexterity: 16,
          constitution: 15,
          intelligence: 14,
          wisdom: 13,
          charisma: 16,
          hp: 52,
          maxHp: 52,
          ac: 17,
          speed: 30,
        },
        backstory:
          'A decorated Concordance officer and the captain of the Odyssey. Diplomatic but firm, she leads with conviction.',
        portraitUrl: undefined,
      },
      {
        name: 'Zyx\'thara',
        race: 'Alien (Voidborn)',
        class: 'Wizard',
        level: 6,
        stats: {
          strength: 8,
          dexterity: 12,
          constitution: 12,
          intelligence: 18,
          wisdom: 15,
          charisma: 11,
          hp: 38,
          maxHp: 38,
          ac: 12,
          speed: 30,
        },
        backstory:
          'A member of a psychic alien species. Zyx serves as the ship\'s science officer and communications specialist.',
        portraitUrl: undefined,
      },
    ],

    npcTemplates: [
      {
        name: 'Admiral Corvus',
        role: 'Quest Giver',
        description:
          'The stern but fair leader of the Concordance Fleet. Assigns the Odyssey to critical missions.',
        stats: undefined,
      },
      {
        name: 'The Collective',
        role: 'Antagonist',
        description:
          'A hive-mind AI that seeks to assimilate all organic life. Thought to be a Precursor weapon gone rogue.',
        stats: {
          hp: 200,
          maxHp: 200,
          ac: 22,
          initiativeBonus: 6,
        },
      },
    ],

    mapTemplates: [
      {
        name: 'Concordance Station Omega',
        description:
          'A massive space station serving as the hub of galactic diplomacy and trade.',
        imageUrl: undefined,
        markers: [
          {
            type: 'poi' as const,
            x: 50,
            y: 50,
            label: 'Docking Bay',
            color: '#3b82f6',
          },
          {
            type: 'poi' as const,
            x: 30,
            y: 30,
            label: 'Command Center',
            color: '#10b981',
          },
        ],
      },
      {
        name: 'Precursor Ruins',
        description:
          'An ancient installation floating in the Void Nebula. Technology beyond comprehension.',
        imageUrl: undefined,
        markers: [
          {
            type: 'enemy' as const,
            x: 50,
            y: 40,
            label: 'Defense Drones',
            color: '#ef4444',
          },
          {
            type: 'poi' as const,
            x: 50,
            y: 60,
            label: 'Central Archive',
            color: '#8b5cf6',
          },
        ],
      },
    ],

    encounterTemplates: [
      {
        name: 'Pirate Raiders',
        description: 'Space pirates attacking the Odyssey for valuable cargo.',
        enemies: [
          {
            name: 'Pirate Fighter 1',
            hp: 40,
            maxHp: 40,
            ac: 15,
            initiativeBonus: 3,
          },
          {
            name: 'Pirate Fighter 2',
            hp: 40,
            maxHp: 40,
            ac: 15,
            initiativeBonus: 3,
          },
          {
            name: 'Pirate Corvette',
            hp: 80,
            maxHp: 80,
            ac: 17,
            initiativeBonus: 2,
          },
        ],
      },
      {
        name: 'Collective Drones',
        description: 'Automated war machines controlled by the hive-mind AI.',
        enemies: [
          {
            name: 'Combat Drone 1',
            hp: 50,
            maxHp: 50,
            ac: 18,
            initiativeBonus: 4,
          },
          {
            name: 'Combat Drone 2',
            hp: 50,
            maxHp: 50,
            ac: 18,
            initiativeBonus: 4,
          },
        ],
      },
    ],

    starterItems: [
      {
        name: 'Plasma Rifle',
        type: 'weapon' as const,
        quantity: 1,
        weight: 8,
        description: 'A standard-issue energy weapon. Effective against most targets.',
        properties: { damage: '2d8', damageType: 'energy', range: 100 },
      },
      {
        name: 'Personal Shield Generator',
        type: 'armor' as const,
        quantity: 1,
        weight: 2,
        description: 'Projects an energy shield that absorbs damage.',
        properties: { ac: 2, charges: 3 },
      },
      {
        name: 'Universal Translator',
        type: 'tool' as const,
        quantity: 1,
        weight: 0.5,
        description: 'Allows communication with most known species.',
        properties: {},
      },
    ],

    isOfficial: true,
    isPublic: true,
    tags: ['sci-fi', 'space', 'exploration', 'aliens', 'epic'],
  },
];
