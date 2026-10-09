// content-data.js: every word on a Spotted a Cutie card. Hand-written lists, no AI at runtime.
// Placeholders: {name} the animal's name, {kind} upper-case kind word (CAT, DOG, ... CREATURE),
// {place} where it was spotted (or a random habitat), {to} the recipient (recipient lines only).
// Rules (PLAN.md §5.2): affectionate, no he/she/his/her, no brands, no real people, short.
(function (g) {
  const SC = (g.SC = g.SC || {});
  SC.CONTENT_DATA = {
    version: 1,

    names: {
      human: [
        "Larry", "Brenda", "Gerald", "Steve", "Linda", "Dave", "Pam", "Barbara", "Doug", "Sharon",
        "Carol", "Janet", "Wendy", "Gordon", "Denise", "Maureen", "Sandra", "Terry", "Deborah", "Malcolm",
        "Lorraine", "Howard", "Judith", "Roger", "Marjorie", "Dennis", "Gail", "Ronald", "Shirley", "Frank",
        "Doris", "Stanley", "Gloria", "Walter", "Agnes", "Ethel", "Harold", "Mildred", "Edna", "Leonard",
        "Arthur", "Joan", "Cyril", "Rita", "Valerie", "Martin", "Diane", "Neil", "Tina", "Phil",
        "Julie", "Ian", "Paula", "Raymond", "Helen", "Russell", "Joyce", "Alan", "Vera", "Brian",
        "Irene", "Glen", "Lynn", "Mike", "Kathy", "Tony", "Debbie", "Ken", "Patty", "Bob",
        "Sue", "Jeff", "Cheryl", "Craig", "Tammy", "Rick", "Peggy", "Lorna", "Eugene", "Fred",
        "Gwen", "Vince", "Rhonda", "Lyle", "Carl", "Ingrid", "Hugo", "Olga", "Sven", "Helga",
        "Klaus", "Gunther", "Pierre", "Yvonne", "Marco", "Giuseppe", "Paolo", "Rosa", "Pedro", "Carmen",
        "Diego", "Jorge", "Hiroshi", "Keiko", "Takeshi", "Yuki", "Kenji", "Mei", "Wei", "Jin",
        "Min-jun", "Ji-woo", "Raj", "Ramesh", "Suresh", "Sunita", "Anil", "Mohan", "Geeta", "Prakash",
        "Usha", "Dinesh", "Shobha", "Ayesha", "Tariq", "Fatima", "Yusuf", "Omar", "Leila", "Kwame",
        "Ama", "Chidi", "Ngozi", "Tunde", "Femi", "Thabo", "Zanele", "Igor", "Dmitri", "Svetlana",
        "Ivan", "Bogdan", "Tomasz", "Lars", "Bjorn", "Astrid", "Fergus", "Hamish", "Morag", "Seamus",
        "Siobhan", "Declan", "Bridget", "Murray", "Brendan", "Elsie", "Herbert", "Wilfred", "Cuthbert", "Ernest",
        "Myrtle", "Lois", "Earl", "Duane", "Todd", "Chad", "Brad", "Darren", "Wayne", "Shane",
        "Lance", "Glenda", "Bonnie", "Connie", "Patricia", "Ruth", "Martha", "Nancy", "Betty", "Dorothy",
        "Edith", "Pauline", "Jackie", "Sally", "Kim", "Sam", "Alex", "Jamie", "Pat", "Chris",
        "Jordan", "Casey", "Morgan", "Jess", "Toby", "Rupert", "Giles", "Quentin", "Humphrey", "Clement",
        "Oscar", "Otto", "Ricardo", "Fernando", "Rodrigo", "Ines", "Paloma", "Ahmed", "Hassan", "Zainab",
        "Bilal", "Rashid", "Nadia", "Samir", "Aziz", "Soraya", "Murat", "Emre", "Ayse", "Mehmet",
        "Nikos", "Eleni", "Stavros", "Costas", "Benny", "Lenny", "Kenny", "Manny", "Norbert", "Gilbert",
        "Ivy", "Ida", "Bernice", "Eunice", "Noreen", "Maxine", "Arlene", "Darlene", "Marlene", "Charlene",
        "Florence", "Mabel", "Kevin"
      ],
      soft: [
        "Biscuit", "Mochi", "Pickle", "Noodle", "Dumpling", "Muffin", "Nugget", "Waffle", "Pudding", "Bean",
        "Toast", "Crumpet", "Pancake", "Sprout", "Peanut", "Pretzel", "Meatball", "Bagel", "Tofu", "Momo",
        "Cupcake", "Cookie", "Crouton", "Gnocchi", "Ravioli", "Nacho", "Churro", "Brownie", "Scone", "Turnip",
        "Potato", "Biscotti", "Pistachio", "Cashew", "Chickpea", "Lentil", "Fudge", "Toffee", "Truffle", "Sesame",
        "Custard", "Popcorn", "Bao", "Udon", "Parsnip", "Radish", "Crumble", "Jellybean", "Sausage", "Mango"
      ],
      prefixes: [
        "Sir", "Auntie", "Uncle", "Little", "Big", "Captain", "Dr.", "Baby", "Lord", "Lady",
        "Professor", "Officer", "Grandma", "Grandpa", "Mr.", "Ms.", "Mrs.", "Madam", "Chef", "Judge",
        "Detective", "Coach", "Agent", "Old", "Dame"
      ],
      suffixes: [
        "Jr.", "Sr.", "the Third", "Esq.", "the Great", "II", "PhD", "the Elder", "the Brave", "MBA"
      ]
    },

    desiNames: [
      "Pappu", "Bablu", "Chintu", "Guddu", "Munna", "Pinky", "Sharmaji", "Chotu", "Bunty", "Tinku",
      "Pintu", "Golu", "Monu", "Sonu", "Bittu", "Dabbu", "Raju", "Bholu", "Gappu", "Pammi",
      "Dolly", "Rinku", "Bobby", "Happy", "Sweety", "Lucky", "Chikki", "Mintu", "Gudiya", "Bubbly",
      "Cheenu", "Kittu", "Tuntun", "Babli", "Rocky", "Tommy", "Moti", "Sheru", "Tiger", "Munni",
      "Raja", "Rani", "Laddoo", "Chikoo", "Bhola", "Chamku", "Nikku", "Gogi", "Dimpy", "Twinkle"
    ],

    shared: {
      mood: [
        "in a meeting", "emotionally unavailable", "on lunch break since 2019", "thinking about snacks",
        "running late, not sorry", "unbothered", "quietly plotting", "one nap away from greatness",
        "deeply offended, can't say why", "living their best life", "not taking questions",
        "busy doing nothing", "mildly suspicious of you", "out of office", "having a main character moment",
        "ready for gossip", "pretending not to see you", "recovering from a big nap", "about to cause a scene",
        "calm, but only on the outside", "waiting for an apology", "feeling cute, might leave later",
        "3% battery", "emotionally attached to this spot", "considering a career change", "in their villain era",
        "in their soft era", "manifesting snacks", "here for the drama", "fully booked", "too cool to wave",
        "wants a treat, won't say so", "hasn't decided about you yet", "thriving, honestly", "above all this",
        "Sunday afternoon, every day", "low-key famous", "having a quiet little day", "needs five more minutes",
        "loading...", "negotiating", "on a strict no-hurry policy", "nostalgic for yesterday's snack",
        "waiting for the weekend", "feeling seen, honestly", "one compliment away from a nap"
      ],
      habitat: [
        "the exact middle of the pavement", "the bottom step of every staircase", "wherever you were about to sit",
        "the one sunny patch in the city", "outside the bakery at closing time", "someone's doormat, by choice",
        "the shade under a parked car", "the bus stop, but never the bus", "next to the chai stall, eternally",
        "the ledge with the best view", "a wall with good gossip", "the corner shop's front step",
        "the watchman's chair at the society gate", "the auto stand, front of the queue"
      ],
      diet: [
        "biscuits, your sympathy", "whatever you're eating", "vibes and leftovers", "snacks, mainly",
        "one (1) biscuit a day, minimum", "compliments", "free samples", "attention, served warm",
        "the good bread", "breakfast, twice"
      ],
      knownFor: [
        "being here first", "looking busy, doing nothing", "the world's longest stare", "showing up uninvited",
        "appearing in every photo", "a dramatic exit", "being the street's main topic", "living in everyone's camera roll",
        "making everyone late", "turning up exactly at snack time", "a face that says \"and you are?\"", "having more friends than you",
        "making strangers stop and say \"aww\"", "being the best part of the commute"
      ],
      weakness: [
        "free snacks", "being called cute", "gentle head scratches", "the sound of a packet opening",
        "compliments, any kind", "sunny afternoons", "a baby voice", "someone sitting down nearby"
      ],
      threat: [
        "will steal your heart (and your samosa)", "mild, unless you have snacks", "emotionally devastating",
        "low, but stares hard", "unknown. assume high.", "harmless, legally", "will ruin your productivity",
        "will make you late for everything"
      ],
      aka: [
        "The Mayor of Lane 4", "The Neighbourhood Watch", "Local Legend", "That One from the Corner",
        "Your Biggest Fan", "The Regular", "Small Celebrity", "The Usual Suspect"
      ],
      catchphrase: [
        "\"What are you looking at?\"", "\"I live here now.\"", "\"No photos, please. Okay, one.\"",
        "\"I was here first.\"", "\"Do you have a snack or not?\"", "\"This is my good side.\"",
        "\"Per my last stare...\"", "\"Let's circle back after my nap.\"", "\"I've seen things.\"",
        "\"I am the manager.\""
      ],
      crime: [
        "for stealing hearts", "for loitering with intent to nap", "for excessive cuteness in public",
        "for staring without a licence", "for refusing to move", "for being too cute to arrest",
        "for crimes against productivity", "for unpaid snacks"
      ],
      reward: [
        "1 biscuit, no questions asked", "2 head scratches", "one (1) samosa", "a warm spot in the sun",
        "a slice of toast, lightly buttered", "eternal respect", "half a sandwich", "a sincere compliment",
        "a very good cushion", "a perfectly good cardboard box", "the last biscuit in the packet",
        "3 crumbs and a nod", "a cup of chai, extra sugar", "unlimited belly rubs", "one (1) firm handshake",
        "a bowl of water and a chat", "a thank-you and a wave", "exposure (they'll tell their friends)"
      ],
      headline: [
        "LOCAL {kind} REFUSES TO MOVE, CITES \"VIBES\"", "{kind} SPOTTED DOING ABSOLUTELY NOTHING",
        "SOURCES CONFIRM: {kind} IS VERY CUTE", "{kind} STEALS SHOW, ALSO A SNACK",
        "NEIGHBOURS STUNNED AS {kind} SITS DOWN", "BREAKING: {kind} STILL THERE",
        "EXPERTS BAFFLED BY {kind}'S CONFIDENCE", "{kind} DECLINES INTERVIEW, ACCEPTS SNACK",
        "{kind} WINS STARING CONTEST. NO ONE ELSE ENTERED", "{kind} RECEIVES 9 COMPLIMENTS BEFORE NOON",
        "{kind} PHOTOGRAPHED 400 TIMES, ASKS FOR A FEE", "COMMUTERS LATE AFTER STOPPING FOR {kind}"
      ],
      greenFlag: [
        "shows up daily", "always on time for snacks", "great listener", "never checks their phone",
        "excellent at naps", "will wait for you", "has a stable address (a wall)", "always says hi first",
        "makes your walk 10% better"
      ],
      redFlag: [
        "leaves you on read", "has 14 other people feeding them", "never pays for snacks",
        "still not over the last biscuit", "won't share the sunny spot", "has never once been on time",
        "way too popular", "nibbles (lovingly)"
      ],
      lookingFor: [
        "snacks", "someone to sit near", "a sunny spot and a listener", "a long-term snack provider",
        "someone who won't ask questions", "a warm lap, no strings", "head scratches, no commitment",
        "someone who always stops to say hi"
      ],
      loveLanguage: [
        "acts of snacks", "quality sitting time", "letting you take one photo", "staring from a distance",
        "receiving gifts", "being nearby, saying nothing", "following you two steps behind", "sharing (rarely)"
      ],
      distance: [
        "1 wall away", "3 scooters away", "across the street", "right behind you", "2 balconies up",
        "on the next roof", "1 chai stall away", "closer than you think", "4 car bonnets away",
        "under your scooter", "10 steps and a nap away", "1 lamp post away", "just around the corner",
        "on your windowsill"
      ],
      flavour: [
        "Seen everywhere. Caught nowhere.", "Older than the street. Allegedly.",
        "Rated 5 stars by everyone who stopped.", "Do not make eye contact. Too late.",
        "Has opinions. Will not share them.", "Locally famous. Nobody knows why.",
        "Belongs to the street. The street agrees.", "Photographed 4,000 times. Approved none."
      ]
    },

    kinds: {
      // Cats: aloof landlords. Own the street, pay no rent.
      cat: {
        names: [
          "Duchess", "Montgomery", "Ophelia", "Ambrose", "Esmeralda", "Lucinda", "Winston", "Penelope",
          "Theodora", "Mortimer", "Tabitha", "Meredith", "Felicity", "Barnaby", "Clementine", "Priscilla",
          "Sebastian", "Smudge", "Mittens", "Marmalade", "Clawdia", "Purrcy", "Catrina", "Purrlene"
        ],
        title: [
          "Feline, menace class", "Landlord of this street", "Senior Bonnet Inspector", "Feline, executive tier",
          "Retired Professional Napper", "Chief Judgement Officer", "Head of Vibes, Back Wall",
          "Feline, premium edition", "Part-time cat, full-time boss", "Freelance Window Supervisor",
          "Duke of the Back Wall", "Regional Manager of Naps", "Feline, do-not-disturb class",
          "Cardboard Box Consultant", "Owner of everything here"
        ],
        mood: [
          "judging you", "above it all", "considering knocking something over", "will allow one (1) pat",
          "pretending you're invisible", "loaf mode: on", "slightly disappointed in you",
          "accepting compliments only", "emotionally on a windowsill", "plotting at 3 am, napping at 3 pm",
          "in charge, as usual", "tolerating the weather", "ignoring you on purpose",
          "slow blinking (that's a compliment)", "waiting for you to sit, so they can leave",
          "the boss of you, actually", "awake for 4 minutes, exhausted"
        ],
        habitat: [
          "the warmest car bonnet on the street", "every scooter seat in a 3-lane radius",
          "the top of the wall, for the view", "inside any box, any size", "a sunny windowsill, rent-free",
          "the exact spot you just got up from", "the fish stall, by coincidence", "the roof of an auto-rickshaw",
          "under the bakery bench", "the doorstep of a house they don't live in", "the café's best chair",
          "a flowerpot, now a bed", "halfway up the stairs, blocking them", "the one chair in the courtyard",
          "the watchman's chair, while they're away", "the newest car on the street, only"
        ],
        diet: [
          "fish, on principle", "the milk you didn't offer", "whatever the fish stall drops",
          "treats, then more treats", "three dinners from three houses", "a little bit of your sandwich",
          "premium leftovers only", "crunchies at 6 sharp", "grass, for the drama"
        ],
        knownFor: [
          "screaming at 3 am for no reason", "sitting on any paper you need", "the slow blink",
          "knocking things off ledges", "leaving the moment you kneel", "having four names on this street",
          "sleeping 18 hours, flawlessly", "sitting in boxes that are too small", "answering only to \"pspsps\"",
          "walking across car roofs at dawn", "eating at three houses, owning none", "the perfect loaf position",
          "staring at nothing, intensely", "being the reason the café has regulars", "arriving at dinner time, exactly",
          "being \"my cat\" on six people's phones", "sitting in the one spot you need"
        ],
        weakness: [
          "pspsps", "a cardboard box", "the crinkle of a treat packet", "chin scratches, specifically",
          "a sunny patch, any size", "a dangling string", "the fish stall at 7 am", "laundry left out to dry"
        ],
        threat: [
          "will sit on your scooter forever", "low, until you move your hand", "high, to anything on a table",
          "will knock your tea over, eye contact held", "emotionally lethal slow blink",
          "will claim your lap without asking", "moderate, plus attitude", "will steal your seat, then your heart"
        ],
        aka: [
          "The Landlord", "The Bonnet Baron", "Your Highness", "The 3 am Opera", "Boss of the Back Wall",
          "The Loaf", "The One Who Sits", "Do Not Touch", "The Café Cat", "Chairperson of the Box", "The Silent Judge"
        ],
        catchphrase: [
          "\"I own this car now.\"", "\"Pet me. No, not like that.\"", "\"This is my scooter.\"",
          "\"I have three homes and no regrets.\"", "\"Is that fish?\"", "\"Your lap is mine now.\"",
          "\"I'm not ignoring you. I'm busy.\"", "\"Pspsps yourself.\"", "\"You may admire me from there.\"",
          "\"Bring the snacks to the wall.\"", "\"I knocked it over. And?\"", "\"Rent is due. In treats.\"",
          "\"The belly is a trap. Obviously.\""
        ],
        crime: [
          "for loitering on scooters", "for sitting on every warm car", "for screaming at 3 am, again",
          "for illegally occupying a box", "for collecting three dinners a night", "for knocking things off ledges",
          "for ignoring a direct \"pspsps\"", "for unlicensed napping on a bonnet", "for theft of one (1) fish",
          "for loafing in a public space", "for being emotionally unavailable"
        ],
        headline: [
          "LOCAL {kind} REFUSES TO LEAVE SCOOTER", "{kind} CLAIMS CAR BONNET, OWNER \"FINE WITH IT\"",
          "{kind} KNOCKS CUP OFF LEDGE, FEELS NOTHING", "{kind} IGNORES 14 PEOPLE IN ONE AFTERNOON",
          "{kind} FOUND IN BOX THAT IS CLEARLY TOO SMALL", "{kind} SCREAMS AT 3 AM. NOBODY KNOWS WHY",
          "{kind} NOW HAS FOURTH FAMILY ON SAME STREET", "{kind} SLOW-BLINKS AT COMMUTER. COMMUTER WEEPS",
          "FISH STALL ROBBED. {kind} SAYS \"NO COMMENT\"", "{kind} DECLARES SUNNY PATCH PRIVATE PROPERTY",
          "{kind} SITS ON NEWSPAPER YOU WERE READING"
        ],
        greenFlag: [
          "slow blinks at you", "has three homes, so very stable", "will sit near you (not with you)",
          "knows exactly what they want", "brings you a leaf as a gift", "purrs like a tiny scooter",
          "impeccable personal grooming", "low maintenance, high standards"
        ],
        redFlag: [
          "has three other families", "leaves the moment you sit down", "only loves you at dinner time",
          "knocks your stuff off tables", "the belly is a trap", "screams at 3 am",
          "will judge your outfit", "sits on your work, every time"
        ],
        lookingFor: [
          "someone with a warm lap", "a box, then maybe you", "a fourth family", "a sunny windowsill and silence",
          "treats on a schedule", "staff", "someone who can open tins"
        ],
        loveLanguage: [
          "ignoring you", "slow blinks", "sitting on your stuff", "headbutts", "being in the same room, separately",
          "bringing you a leaf", "kneading your jacket"
        ],
        flavour: [
          "Has never once been on time.", "Answers to five names. Responds to none.", "Owns the street. Pays no rent.",
          "Sat on this car before you were born.", "Not ignoring you. Just busy. Forever.",
          "Fed at three houses. Still asks.", "Will be your friend. On their schedule.",
          "Every warm car is a throne."
        ],
        moves: [
          { name: "Stare", damage: 30, text: "Looks at you until you leave." },
          { name: "Slow Blink", damage: 20, text: "Heals your heart by 40." },
          { name: "3 am Scream", damage: 90, text: "Wakes the whole street. No reason." },
          { name: "Loaf", damage: 10, text: "Becomes bread. Cannot be moved." },
          { name: "Ledge Push", damage: 60, text: "Knocks your cup off. Watches it fall." },
          { name: "Belly Trap", damage: 80, text: "Shows the belly. You know what happens." },
          { name: "Box Claim", damage: 40, text: "Sits in a box. The box is now theirs." },
          { name: "Ignore", damage: 50, text: "You are not here. You never were." },
          { name: "Bonnet Nap", damage: 30, text: "Occupies your car until further notice." },
          { name: "Midnight Sprint", damage: 70, text: "Races across the roof for no reason." },
          { name: "Headbutt", damage: 20, text: "Affection, delivered with force." },
          { name: "Purr Engine", damage: 40, text: "Rumbles like a tiny scooter. Calms you." }
        ],
        statBias: { chaos: 5, fluff: 10, sass: 25 }
      },

      // Dogs: loyal night-shift security with big hearts.
      dog: {
        names: [
          "Duke", "Rex", "Buddy", "Champ", "Barkley", "Woofgang", "Murphy", "Rufus", "Teddy", "Scout",
          "Ranger", "Diesel", "Bones", "Tank", "Winnie", "Goldie", "Rosie", "Patch", "Frankie", "Brutus",
          "Chester", "Dexter", "Hank", "Sergio"
        ],
        title: [
          "Night Shift Security, Gate 2", "Canine, very good class", "Head of Neighbourhood Watch",
          "Canine, loyal-to-a-fault class", "Volunteer Bodyguard (Unpaid)", "Chief Barking Officer",
          "Professional Tail Wagger", "Senior Gate Supervisor", "Retired Ball Retriever",
          "Official Greeter, Chai Stall", "Canine, golden-heart edition", "Scooter Escort Service",
          "Patrol Lead, Night Shift", "Snack Inspector, Grade A"
        ],
        mood: [
          "on duty", "so happy you're here", "off duty, still watching", "ready for a walk, any walk",
          "emotionally available", "tail at full speed", "protecting you from a leaf",
          "waiting for the night shift", "asleep on the job, proudly", "suspicious of the delivery scooter",
          "believes in you", "just happy to be included", "100% vibes, 0% plans", "heard a noise, investigating",
          "having the best day ever, again", "guarding a stick very seriously", "pretending not to want the biscuit"
        ],
        habitat: [
          "outside the chai stall, on duty", "the gate, every gate", "the exact middle of a cool floor",
          "the shade under the vegetable cart", "the building's front step, guarding it", "a sand pile, freshly claimed",
          "the security cabin, unofficially", "the end of the lane, watching", "wherever the snacks are falling",
          "the cool tiles outside the shop", "next to the night guard, as backup", "under a parked truck, in the shade",
          "the shop's doorstep, as greeter", "the bench at the bus stop", "the society gate, checking everyone in"
        ],
        diet: [
          "leftover rotis, with joy", "biscuits from the night guard", "anything dropped, within 2 seconds",
          "the cheap biscuits (the best ones)", "your sandwich, eventually", "one bone, saved for later",
          "affection and crusts", "the crust you were going to throw away"
        ],
        knownFor: [
          "barking at nothing at 2 am", "walking you home without being asked", "greeting everyone like an old friend",
          "chasing scooters, catching none", "remembering everyone who ever fed them", "the full-body tail wag",
          "guarding the lane from cats, mostly", "lying in the exact spot you need", "sitting very politely for snacks",
          "sneezing when excited", "howling along with the ambulance", "the dramatic sigh when lying down",
          "loving everyone, except bicycles", "sleeping through anything quiet",
          "walking the kids to the school bus", "a tail that wags the whole dog"
        ],
        weakness: [
          "belly rubs", "the word \"walk\"", "someone opening a packet", "a squeaky sound", "the ice cream cart",
          "being called a good dog", "behind-the-ear scratches", "a tennis ball, any condition"
        ],
        threat: [
          "will lick you aggressively", "loud, not dangerous", "will follow you home", "extreme loyalty",
          "will bark at your bicycle", "dangerously friendly", "will sit on your foot", "harmless, unless you're a scooter"
        ],
        aka: [
          "Head of Security", "Night Watch", "The Gatekeeper", "Officer Woof", "The Welcome Committee",
          "The Big Floof", "Everyone's Best Friend", "The Snack Detector", "Sergeant Sniff", "The Guard Who Naps",
          "The Lane's Bodyguard"
        ],
        catchphrase: [
          "\"Who's there? Oh, hi! Hi! Hi!\"", "\"I'll walk you home.\"", "\"Is that for me?\"",
          "\"I heard a noise. I'm on it.\"", "\"Everyone is my best friend.\"", "\"I'm not begging. I'm sitting nicely.\"",
          "\"Ball? Ball. BALL.\"", "\"Night shift, reporting for duty.\"", "\"You came back! You came back!\"",
          "\"Who's a good dog? Me. It's me.\"", "\"I protect this lane.\"", "\"Scooter! Must chase.\"",
          "\"Five more minutes, then patrol.\""
        ],
        crime: [
          "for chasing scooters without a licence", "for barking at the moon, repeatedly", "for excessive tail wagging",
          "for following strangers home", "for stealing a whole roti", "for napping on the busiest step",
          "for unauthorised licking", "for digging up the flowerbed", "for guarding things that aren't theirs",
          "for sitting on someone's foot", "for howling with every siren"
        ],
        headline: [
          "LOCAL {kind} WALKS STRANGER HOME, REFUSES TIP", "{kind} BARKS AT LEAF FOR 20 MINUTES",
          "{kind} PROMOTED TO HEAD OF NIGHT SHIFT", "{kind} CHASES SCOOTER, CATCHES NOTHING, THRIVES",
          "{kind} GREETS ENTIRE STREET BY NAME", "{kind}'S TAIL WAG SHOWS UP ON WEATHER RADAR",
          "{kind} GUARDS LANE ALL NIGHT. LANE: SAFE", "{kind} HOWLS WITH AMBULANCE, HITS HIGH NOTE",
          "{kind} GIVEN ONE BISCUIT, LOSES IT COMPLETELY", "{kind} REFUSES TO LEAVE CHAI STALL",
          "{kind} SITS NICELY. CROWD GOES WILD"
        ],
        greenFlag: [
          "walks you home", "loyal for life", "always happy to see you", "remembers your face",
          "protects you from leaves", "works the night shift, every night", "leans on you like a hug", "shares the shade"
        ],
        redFlag: [
          "barks at your bicycle", "will lick your face", "12 best friends on this lane", "sheds on your black jeans",
          "chases scooters", "terrible at keeping secrets", "sits on your feet", "loves everyone equally"
        ],
        lookingFor: [
          "a walk, any length", "someone to guard", "a belly-rub partner", "a forever friend on this lane",
          "someone with snacks in their pocket", "a ball to chase", "a co-worker for the night shift"
        ],
        loveLanguage: [
          "walking you home", "full-body wagging", "leaning on your legs", "sitting on your feet",
          "bringing you a stick", "following you everywhere", "physical touch, mostly licks"
        ],
        flavour: [
          "Has never missed a night shift.", "Loves you. Also loves everyone else.", "Guarded this lane for 6 years. Unpaid.",
          "{name} will walk you home. No charge.", "Every scooter is a personal enemy.", "Fierce at night. Soft by morning.",
          "Knows every face on the street.", "Small bark, enormous heart.", "{name} has never met a stranger."
        ],
        moves: [
          { name: "Tail Wag", damage: 20, text: "So fast it creates weather." },
          { name: "Night Patrol", damage: 60, text: "Guards the lane until sunrise." },
          { name: "Bark at Nothing", damage: 50, text: "Alerts everyone to absolutely nothing." },
          { name: "Puppy Eyes", damage: 90, text: "Snacks appear. Nobody knows how." },
          { name: "Walk You Home", damage: 40, text: "Escorts you to your door. Free of charge." },
          { name: "Belly Flop", damage: 30, text: "Rolls over. Requires immediate rubs." },
          { name: "Scooter Chase", damage: 70, text: "Chases a scooter. Gives up. Proud anyway." },
          { name: "The Lean", damage: 20, text: "Puts all their weight on your legs." },
          { name: "Howl Along", damage: 80, text: "Joins every siren in a duet." },
          { name: "Big Sigh", damage: 10, text: "Lies down with great drama." },
          { name: "Lick Attack", damage: 60, text: "Cleans your whole face. Did not ask." },
          { name: "Sniff Test", damage: 30, text: "Checks your shoes for news." }
        ],
        statBias: { chaos: 0, fluff: 20, sass: -15 }
      },

      // Pigeons: unbothered commuters with no fear.
      pigeon: {
        names: [
          "Gary", "Trevor", "Nigel", "Clive", "Keith", "Derek", "Barry", "Gregory", "Phyllis", "Doreen",
          "Cooper", "Terrence", "Sheila", "Graham", "Roy", "Les", "Mo", "Bev", "Dolores", "Wendell", "Colin",
          "Kev", "Coolin"
        ],
        title: [
          "Commuter, frequent flyer class", "Urban Pedestrian, Level 9", "Statue Inspector", "Senior Crumb Analyst",
          "Pavement Manager", "Pigeon, zero-fear class", "Balcony Tenant (Unpaid)", "Station Regular since 2014",
          "Head of Window Ledges", "Bench Committee Chairperson", "Professional Walker (Could Fly)",
          "Pigeon, business class", "Regional Head of Crumbs"
        ],
        mood: [
          "walking, refusing to fly", "unbothered, as always", "in a hurry to go nowhere", "cooing about it",
          "puffed up and proud", "commuting", "has seen worse", "not moving for your scooter", "head bob: on",
          "suspicious of your sandwich", "thinking about bread", "above you (on a wire)", "fully calm in total chaos",
          "on the 9:15 to the next balcony", "late for nothing, as usual"
        ],
        habitat: [
          "a balcony that isn't theirs", "every railway station ever", "the head of a statue",
          "the AC unit outside your window", "your balcony, specifically", "the café's outdoor tables",
          "the one wire above the bus stop", "the square with the fountain", "the ledge of a very busy office",
          "under the railway bridge", "the bench by the station", "the crumb zone of the food court",
          "a rooftop water tank", "the clock tower, ignoring the time"
        ],
        diet: [
          "crumbs, premium", "bread, the whole roll if possible", "the chips you dropped",
          "grain scattered by the park regulars", "other pigeons' crumbs", "the bottom half of your sandwich",
          "popcorn at the station", "birdseed, and the bag"
        ],
        knownFor: [
          "walking when they could fly", "having zero fear of humans", "the head bob",
          "standing in the exact middle of the path", "arriving with 40 friends", "puffing up to impress nobody",
          "cooing at 6 am outside your window", "refusing to move for a bicycle",
          "riding the train for exactly one stop", "moving into your balcony",
          "appearing the second food appears", "looking late for a meeting",
          "walking in circles, very confidently"
        ],
        weakness: [
          "one crumb", "the person with the bread bag", "a dropped sandwich", "the fountain at noon",
          "their own reflection", "a sunny ledge", "the 5 pm crumb rush", "a loud clap (briefly)"
        ],
        threat: [
          "will walk right at you", "will take the chip from your hand", "low, but there are forty of them",
          "will move into your balcony", "will not move for your bicycle", "will coo outside your window at 6 am",
          "unbothered, which is scary", "will follow you for one crumb"
        ],
        aka: [
          "The Commuter", "Lord of the Ledge", "The Balcony Tenant", "Platform 2 Regular", "Mayor of the Square",
          "Head Bob Champion", "The Crumb Collector", "The Unbothered One", "Fountain Security", "The 9:15 Express"
        ],
        catchphrase: [
          "\"Coo.\"", "\"I'm walking here.\"", "\"I could fly. I choose not to.\"", "\"Got any bread?\"",
          "\"This balcony is mine now.\"", "\"I've been on that train. Overrated.\"", "\"Move. I'm commuting.\"",
          "\"Forty of my friends are coming.\"", "\"Crumb? Crumb. CRUMB.\"", "\"Scared? Of you? No.\"",
          "\"Coo means hello. Also mine.\"", "\"Is that a sandwich?\"", "\"Same time tomorrow.\""
        ],
        crime: [
          "for jaywalking, daily", "for moving into a balcony uninvited", "for ticketless train travel",
          "for loitering at the station", "for cooing at 6 am", "for taking a chip from a hand",
          "for walking when flight was available", "for crowding the fountain", "for sitting on a statue's head",
          "for impersonating a commuter"
        ],
        headline: [
          "{kind} BOARDS TRAIN, GETS OFF ONE STOP LATER", "LOCAL {kind} REFUSES TO MOVE FOR BICYCLE",
          "{kind} SPOTTED WALKING. COULD HAVE FLOWN", "{kind} MOVES INTO BALCONY, PAYS NO RENT",
          "40 {kind}S ARRIVE AFTER ONE CRUMB FALLS", "{kind} ATTENDS MEETING ON OFFICE LEDGE",
          "{kind} UNBOTHERED BY ENTIRE CITY", "{kind} TAKES CHIP FROM TOURIST, NO REGRETS",
          "{kind} BOBS HEAD TO NO MUSIC FOR 3 HOURS", "STATUE HAS NEW HAT. IT'S A {kind}",
          "{kind} COMMUTES DAILY, HAS NO JOB"
        ],
        greenFlag: [
          "never afraid of anything", "shows up every morning", "great at walking dates", "knows every station",
          "loyal to one balcony", "very low-maintenance diet", "shiny neck, always dressed up", "stays calm in any crowd"
        ],
        redFlag: [
          "brings 40 friends", "coos at 6 am", "could fly, won't", "moved in without asking",
          "only here for the bread", "takes the chip right out of your hand", "walks directly into you",
          "commutes, never arrives"
        ],
        lookingFor: [
          "someone with bread", "a balcony with a view", "a walking partner, no flying", "a ledge for two",
          "a quiet bench to share", "someone who won't flinch"
        ],
        loveLanguage: [
          "walking toward you, slowly", "cooing at dawn", "puffing up their chest", "moving in uninvited",
          "sharing a ledge", "a slow head bob, just for you"
        ],
        flavour: [
          "Has commuted for years. Has no office.", "Could fly. Prefers to walk.", "Afraid of nothing. Not even you.",
          "{name} took the train once. Never again.", "Seen at every station in the city.",
          "Shinier neck than your best necklace.", "Arrives 2 seconds after food lands.", "Unbothered since the dawn of time."
        ],
        moves: [
          { name: "Head Bob", damage: 20, text: "Bobs to a beat only they can hear." },
          { name: "Crumb Swarm", damage: 90, text: "Summons 40 friends. Everyone eats." },
          { name: "Walk It", damage: 30, text: "Walks straight at you. You step aside." },
          { name: "Coo", damage: 10, text: "A soft sound. Somehow unsettling." },
          { name: "Puff Up", damage: 40, text: "Doubles in size. Impresses nobody." },
          { name: "Balcony Claim", damage: 60, text: "Moves in. Will not be moving out." },
          { name: "Train Hop", damage: 50, text: "Rides one stop. Gets off. Smug." },
          { name: "Chip Grab", damage: 80, text: "Takes it from your hand. Mid-bite." },
          { name: "Statue Sit", damage: 30, text: "Sits on a statue's head. Respectfully." },
          { name: "Last-Second Flap", damage: 70, text: "Flies only when the bike is very close." },
          { name: "6 am Alarm", damage: 50, text: "Coos outside your window. Daily." }
        ],
        statBias: { chaos: 10, fluff: 0, sass: 10 }
      },

      // Crows: clever, petty, remember your face.
      crow: {
        names: [
          "Edgar", "Victor", "Agatha", "Vivienne", "Ezra", "Silas", "Octavia", "Lucius", "Isadora", "Thaddeus",
          "Cornelius", "Marlowe", "Hester", "Ignatius", "Prudence", "Cawlin", "Gideon", "Mordecai", "Perpetua",
          "Augustine", "Dorian", "Ravi"
        ],
        title: [
          "Corvid, grudge class", "Head of Intelligence, Rooftops", "Senior Grudge Holder", "Private Eye (Both Eyes)",
          "Strategist, Wire Division", "Corvid, genius tier", "Professional Grudge Keeper",
          "Chief Shiny Object Officer", "Neighbourhood Informant", "Puzzle Solver, Unpaid", "Rooftop Detective",
          "Corvid, never-forgets class", "Recovery Specialist (Shiny)"
        ],
        mood: [
          "memorising your face", "holding a grudge, lightly", "plotting something clever",
          "watching. always watching.", "taking notes", "three steps ahead", "unimpressed by your choices",
          "planning a heist", "annoyed, for a good reason", "smug, because they're right",
          "gossiping on a wire", "suspicious of your hat", "calculating", "collecting evidence",
          "still thinking about that one time"
        ],
        habitat: [
          "the highest wire on the street", "the rooftop water tank, as HQ", "the top of the lamp post",
          "the tree directly above your car", "the balcony railing, watching you eat", "the wall behind the food stall",
          "the bare tree where the meetings happen", "the rooftop with the best surveillance",
          "the antenna, as a lookout", "your windowsill, taking notes", "the bus shelter roof",
          "the park's tallest branch", "the wedding tent, before the food arrives"
        ],
        diet: [
          "your sandwich, by strategy", "shiny things (not edible, still)", "whatever they outsmarted you for",
          "peanuts, shelled with precision", "the samosa from your hand", "the best bit of the picnic",
          "snacks, earned through crime", "crunchy things, dipped in water first"
        ],
        knownFor: [
          "remembering every face, forever", "holding grudges for years", "solving puzzles faster than you",
          "stealing shiny things", "bringing gifts to people they like", "cawing at exactly 5:45 am",
          "using traffic to crack nuts", "holding meetings on the wire", "telling every other crow about you",
          "outsmarting the bird feeder", "staring in the window like a detective",
          "one loud caw at the worst moment", "collecting bottle caps",
          "taking one chip, then telling everyone"
        ],
        weakness: [
          "a shiny bottle cap", "peanuts, any amount", "a good puzzle", "someone who leaves gifts",
          "a dropped chip", "foil, any size", "being underestimated (they love it)", "a polite nod each morning"
        ],
        threat: [
          "remembers your face forever", "will tell other crows about you", "high, if you were rude once",
          "will steal your keys and your pride", "will wait for you after work", "petty, but in a smart way",
          "will take your snack mid-sentence", "strategic"
        ],
        aka: [
          "The Detective", "The One Who Remembers", "Rooftop Intelligence", "The Grudge Keeper", "Agent Caw",
          "The Wire Committee", "Shiny Thing Collector", "Head of Surveillance", "The Informant",
          "The Feathered Accountant", "The Mastermind"
        ],
        catchphrase: [
          "\"I remember you.\"", "\"Caw.\"", "\"I know what you did on Tuesday.\"", "\"Nice keys. Mine now.\"",
          "\"I've told the others.\"", "\"That was a warning caw.\"", "\"I left you a gift. You're welcome.\"",
          "\"Shiny. Mine. Goodbye.\"", "\"Don't make me call the group.\"", "\"I solved it. Obviously.\"",
          "\"You were rude in 2022.\"", "\"Let's talk about your sandwich.\"", "\"Per my last caw...\""
        ],
        crime: [
          "for grand theft of a shiny thing", "for holding a grudge since 2019", "for stealing keys, glasses and pride",
          "for illegal surveillance from a wire", "for snatching a sandwich mid-bite", "for a 5 am crow meeting",
          "for being too clever by half", "for telling everyone about you", "for running a shiny-object ring",
          "for interrupting a picnic"
        ],
        headline: [
          "{kind} REMEMBERS FACE FROM 2019, STILL MAD", "LOCAL {kind} SOLVES PUZZLE, REFUSES FAME",
          "{kind} STEALS KEYS, RETURNS THEM FOR PEANUTS", "{kind} HOLDS 5 AM MEETING ON POWER LINE",
          "{kind} LEAVES GIFT FOR KIND NEIGHBOUR", "{kind} TELLS ENTIRE FLOCK ABOUT YOU",
          "{kind} OUTSMARTS BIRD FEEDER IN 4 SECONDS", "DETECTIVES STUMPED. {kind} KNOWS MORE",
          "{kind} ACCEPTS APOLOGY, KEEPS GRUDGE", "{kind} SEEN TAKING NOTES ON NEIGHBOURS",
          "{kind} USES TRAFFIC TO CRACK NUTS. GENIUS"
        ],
        greenFlag: [
          "brings you gifts", "never forgets your face", "smarter than everyone here", "loyal to people who are kind",
          "very good at puzzles", "always keeps an eye on you", "gives honest feedback (caw)", "organised, with a plan"
        ],
        redFlag: [
          "holds grudges for years", "steals shiny things", "tells all their friends about you", "caws at 5:45 am",
          "remembers what you said in 2021", "watches you eat", "smarter than you, and knows it", "petty about peanuts"
        ],
        lookingFor: [
          "someone who leaves peanuts", "a partner for small crimes", "someone who never forgets either",
          "a shiny gift, then we'll talk", "a fellow genius", "a rooftop for two"
        ],
        loveLanguage: [
          "leaving you gifts", "remembering your face", "one caw every morning", "watching over you from a wire",
          "sharing the stolen snack", "bringing you a bottle cap"
        ],
        flavour: [
          "Remembers your face. And your choices.", "Forgives. Never forgets.", "{name} knows where you live.",
          "Smarter than the bird feeder. And you.", "Every shiny thing is evidence.",
          "Has a file on everyone in this lane.", "Kind to the kind. Petty to the rest.",
          "Was here before the wires. Will be after."
        ],
        moves: [
          { name: "Grudge", damage: 90, text: "Remembers your face for 7 years." },
          { name: "Caw", damage: 30, text: "One loud caw at the worst time." },
          { name: "Shiny Grab", damage: 60, text: "Takes your keys. Leaves a leaf." },
          { name: "Group Chat", damage: 80, text: "Tells 30 crows about you." },
          { name: "Gift Drop", damage: 20, text: "Leaves a bottle cap. Means a lot." },
          { name: "Nut Crack", damage: 50, text: "Lets a car crack the nut. Genius." },
          { name: "Side Eye", damage: 40, text: "A long look from the lamp post." },
          { name: "Puzzle Solve", damage: 70, text: "Opens anything. Faster than you." },
          { name: "Fly-By", damage: 100, text: "Swoops past your head. Just a warning." },
          { name: "Mid-Bite Snatch", damage: 110, text: "Takes the snack mid-sentence." },
          { name: "Stakeout", damage: 30, text: "Watches your window. Takes notes." }
        ],
        statBias: { chaos: 10, fluff: -15, sass: 25 }
      },

      // Cows: calm, slow, in charge of traffic.
      cow: {
        names: [
          "Gertrude", "Daisy", "Bessie", "Margaret", "Hilda", "Beatrice", "Harriet", "Winifred", "Moolinda",
          "Moorice", "Bertha", "Gladys", "Delphine", "Henrietta", "Theodore", "Norman", "Douglas", "Rosemary",
          "Clover", "Philippa", "Reginald", "Barnabas"
        ],
        title: [
          "Bovine, traffic-control class", "Head of Traffic, Main Road", "Senior Road Supervisor",
          "Roundabout Manager", "Bovine, no-hurry class", "Speed Bump, Certified", "Chief Calm Officer",
          "Lane Divider, Living Edition", "Bovine, right-of-way class", "Director of Slowing Down",
          "Professional Grass Critic", "Village Elder (Honorary)", "Bovine, zen-master class"
        ],
        mood: [
          "calm, extremely", "in no hurry, ever", "chewing on it", "at peace with the traffic",
          "thinking slow thoughts", "unbothered by horns", "serene", "in charge, quietly", "taking a long pause",
          "deeply relaxed", "watching the world go by", "considering moving (no)", "on cow time",
          "zen, with a side of grass", "unmoved, literally"
        ],
        habitat: [
          "the exact middle of the main road", "the centre of the roundabout", "the divider, like a VIP lounge",
          "the vegetable market, at the good stall", "the shade of the big tree at the junction",
          "in front of the one shop you need", "the bus stand, waiting for no bus", "the middle lane, permanently",
          "the fresh grass by the school gate", "a field with a great view", "the corner where every auto turns",
          "the cool shade under the flyover", "the one-way street, going the other way"
        ],
        diet: [
          "grass, slowly", "vegetable peels from the market", "banana leaves, with ceremony",
          "the greens you were about to buy", "hay, the good kind", "a chapati from every shop",
          "fresh grass and patience", "carrots, given respectfully"
        ],
        knownFor: [
          "stopping traffic with one step", "never, ever hurrying", "standing in the exact middle of the road",
          "chewing thoughtfully for hours", "making buses wait", "looking at you like a wise grandparent",
          "the longest blink in the city", "creating a traffic jam, peacefully", "being completely unbothered by horns",
          "crossing the road at their own pace", "the most relaxed face on the street",
          "one loud moo at the perfect moment", "turning any road into a roundabout"
        ],
        weakness: [
          "fresh grass", "a gentle forehead scratch", "the vegetable cart", "banana peels", "a soft \"hello\"",
          "the shade at noon", "someone sharing their lunch", "a quiet afternoon"
        ],
        threat: [
          "will stop all traffic", "calm, but very large", "will block your scooter, kindly",
          "will make you late, peacefully", "zero, but you're still waiting", "will take the greens from your bag",
          "unstoppable at 2 km/h", "low, unless you're a bus"
        ],
        aka: [
          "Head of Traffic", "The Roundabout", "The Living Speed Bump", "The Elder", "Ruler of the Road",
          "The Calm One", "Traffic Control", "The Big Calm", "The Wise One", "Main Road Management"
        ],
        catchphrase: [
          "\"Moo.\"", "\"What's the hurry?\"", "\"I'll move when I'm ready.\"", "\"Honk all you want.\"",
          "\"The road is for everyone. Mostly me.\"", "\"Slow down. Look at the sky.\"",
          "\"I've been chewing on that idea.\"", "\"Traffic? I am the traffic.\"", "\"Patience is free.\"",
          "\"Let me finish this grass.\"", "\"One step at a time. Maybe zero.\"", "\"I see you, scooter. I don't mind.\""
        ],
        crime: [
          "for blocking traffic, peacefully", "for standing in the middle of the road", "for causing a 40-minute jam",
          "for eating the greens off a cart", "for ignoring every horn in the city", "for walking at 2 km/h on a highway",
          "for being too calm in a hurry zone", "for parking on the divider", "for holding up a wedding band",
          "for stealing a whole cabbage"
        ],
        headline: [
          "{kind} STOPS TRAFFIC, FEELS NOTHING", "LOCAL {kind} MAKES BUS WAIT 20 MINUTES",
          "{kind} CROSSES ROAD AT OWN PACE, AGAIN", "{kind} UNBOTHERED BY 47 HORNS",
          "{kind} NAMED HEAD OF TRAFFIC, NO ONE OBJECTS", "MARKET LOSES CABBAGE TO CALM {kind}",
          "{kind} STANDS IN ROAD. CITY ADAPTS", "{kind} CHEWS FOR 6 HOURS, STILL THINKING",
          "{kind} BLOCKS LANE, GIVES WISE LOOK", "{kind} STILL HAS NOT MOVED, SAYS WITNESS",
          "WEDDING BAND WAITS FOR {kind} TO PASS"
        ],
        greenFlag: [
          "never in a hurry", "very calm presence", "great listener, mostly chewing", "will wait with you",
          "shares the shade", "gentle eyes", "emotionally steady", "always in the same place"
        ],
        redFlag: [
          "blocks the road", "will make you late, every time", "takes 40 minutes to decide", "eats your vegetables",
          "doesn't respond to horns", "never answers quickly", "very large personal space", "moves at 2 km/h"
        ],
        lookingFor: [
          "someone with patience", "a slow walk", "a fresh patch of grass", "someone who won't honk",
          "a long, quiet afternoon", "a partner to block traffic with"
        ],
        loveLanguage: [
          "standing next to you", "quality time, very slow", "a long blink", "resting their head on your gate",
          "sharing the shade", "a gentle nudge"
        ],
        flavour: [
          "Has never been in a hurry. Never will.", "{name} was here before the road.",
          "Stopped more traffic than any signal.", "Calm is a superpower. {name} has it.",
          "Moves at the speed of a thought.", "Every horn makes {name} calmer.", "Lunch takes 6 hours. Worth it.",
          "Wise eyes, slow feet, big heart."
        ],
        moves: [
          { name: "Stand Still", damage: 60, text: "Stops all traffic. Feels nothing." },
          { name: "Long Chew", damage: 20, text: "Thinks about it for an hour." },
          { name: "Moo", damage: 40, text: "One deep sound. Everyone listens." },
          { name: "Slow Cross", damage: 80, text: "Crosses the road at 2 km/h." },
          { name: "Calm Aura", damage: 30, text: "Everyone nearby relaxes. Even buses." },
          { name: "Greens Grab", damage: 70, text: "Takes the spinach from the cart." },
          { name: "Wise Blink", damage: 10, text: "Blinks slowly. You rethink your life." },
          { name: "Tail Swish", damage: 30, text: "Removes one fly and one worry." },
          { name: "Road Block", damage: 110, text: "Sits in the middle lane. City adapts." },
          { name: "Nudge", damage: 50, text: "A gentle head push. Moves you a metre." },
          { name: "Lie Down", damage: 20, text: "Lies down. Becomes a landmark." }
        ],
        statBias: { chaos: -25, fluff: 10, sass: -5 }
      },

      // Squirrels: anxious, fast, snack-obsessed.
      squirrel: {
        names: [
          "Kyle", "Tyler", "Dustin", "Kelsey", "Kayleigh", "Brody", "Kayden", "Hazel", "Hickory", "Nutmeg",
          "Jojo", "Ricky", "Skip", "Mindy", "Trixie", "Bree", "Cody", "Dash", "Pip", "Dart", "Zippy"
        ],
        title: [
          "Rodent, high-alert class", "Head of Snack Storage", "Nut Investor, Long-Term", "Professional Panicker",
          "Tree Logistics Manager", "Squirrel, six-coffee class", "Emergency Response (Snacks)",
          "Senior Acorn Accountant", "Parkour Instructor", "Rodent, full-speed class", "Chief Hoarding Officer",
          "Freelance Tree Runner", "Fence Sprint Champion"
        ],
        mood: [
          "anxious, but fast", "thinking about nuts", "forgot where it was buried", "panicking politely",
          "on high alert", "six coffees deep", "frozen mid-run", "sprinting to nowhere", "stressed, snack-related",
          "suspicious of the wind", "very busy, no plan", "tail flick: maximum", "hoarding, emotionally",
          "already gone (wait, back)"
        ],
        habitat: [
          "the top of the park fence", "halfway up a tree, frozen", "the bird feeder, uninvited",
          "the bench where snacks happen", "the power line, at full speed", "inside a flowerpot, digging",
          "the tallest branch, panicking", "under the café table", "the wall between two gardens",
          "a hole they dug and forgot", "your balcony railing, briefly", "the tree outside your window",
          "the coconut tree, top floor"
        ],
        diet: [
          "nuts, buried and forgotten", "one peanut, hidden in 4 places", "the bird feeder's entire stock",
          "whatever's in your hand, fast", "seeds, stuffed in both cheeks", "your balcony tomatoes",
          "a whole cracker, somehow", "a corn cob bigger than them"
        ],
        knownFor: [
          "burying nuts and forgetting where", "running across the road, then back", "freezing like a statue for no reason",
          "stuffing cheeks past capacity", "raiding bird feeders", "a tail that flicks when worried",
          "sprinting across wires", "staring at you, mid-chew", "digging up every flowerpot",
          "jumps that shouldn't work but do", "hiding snacks in your garden", "panicking at a leaf",
          "yelling at cats from a safe branch"
        ],
        weakness: [
          "a single peanut", "the bird feeder", "a loud noise, any noise", "someone holding out a cracker",
          "a perfect acorn", "the sound of a bag opening", "their own memory", "sudden movement (including theirs)"
        ],
        threat: [
          "will take the snack and run", "low, but very fast", "will dig up your plants",
          "will startle you, then themselves", "will raid the bird feeder", "unpredictable, adorable",
          "will bury something in your shoe", "maximum speed, minimum plan"
        ],
        aka: [
          "The Sprinter", "Nut Banker", "Agent Zoom", "The Hoarder", "Tree Express", "The Panic Button",
          "Professional Forgetter", "Bird Feeder Bandit", "Big Cheeks", "The Blur", "Fence Champion"
        ],
        catchphrase: [
          "\"Where did I put it?\"", "\"Nut. Nut. Nut. Nut.\"", "\"Gotta go fast. Where? Don't know.\"",
          "\"Is that for me? Bye!\"", "\"I buried something here. Or there.\"", "\"Don't look. I'm a statue.\"",
          "\"I've had six coffees.\"", "\"Every peanut is my peanut.\"", "\"Panic first, think later.\"",
          "\"Act natural. AAAH.\"", "\"I'll be back for that.\"", "\"Can't talk. Hoarding.\""
        ],
        crime: [
          "for raiding the bird feeder", "for burying stolen snacks", "for crossing the road, both ways",
          "for digging up a flowerpot", "for illegal acorn storage", "for snack theft at high speed",
          "for panicking in a public park", "for fitting 9 peanuts in one face", "for forgetting where the evidence is",
          "for gatecrashing a picnic"
        ],
        headline: [
          "{kind} BURIES NUT, FORGETS, BURIES ANOTHER", "LOCAL {kind} CROSSES ROAD TWICE, GAINS NOTHING",
          "{kind} RAIDS BIRD FEEDER IN BROAD DAYLIGHT", "{kind} FREEZES MID-RUN, WINS STATUE CONTEST",
          "{kind} FITS 9 PEANUTS IN ONE MOUTH", "{kind} PANICS AT LEAF, RECOVERS, PANICS AGAIN",
          "PARK BENCH ROBBED. {kind} HAS FULL CHEEKS", "{kind} JUMPS IMPOSSIBLE GAP. EXPERTS NERVOUS",
          "{kind} SEEN AT FULL SPEED. NO REASON GIVEN", "{kind} DIGS UP BALCONY TOMATO, NO REGRETS",
          "{kind} HIDES SNACK IN SOMEONE'S SHOE"
        ],
        greenFlag: [
          "always has snacks saved", "plans for the future (kind of)", "very athletic", "tiny hands",
          "great at hide and seek", "energetic company", "plants accidental trees", "incredibly fluffy tail"
        ],
        redFlag: [
          "forgets everything", "panics at leaves", "stole from the bird feeder", "will not sit still",
          "hides snacks in your shoes", "runs away mid-conversation", "has 3,000 secret stashes", "digs up your plants"
        ],
        lookingFor: [
          "someone with peanuts", "a calm partner (opposite energy)", "help finding last year's nuts",
          "a tree with good storage", "a running buddy", "someone who won't make sudden moves"
        ],
        loveLanguage: [
          "sharing one peanut", "burying a gift for you", "quick visits, very quick", "frozen eye contact",
          "chattering at you", "snacks, hidden in your garden"
        ],
        flavour: [
          "Buried 4,000 nuts. Found 12.", "Accidentally planted a forest.", "{name} has never walked anywhere.",
          "Fast enough to forget why.", "Fears leaves. Loves nuts. That's it.", "Half fluff, half panic.",
          "Has a plan. Forgot it.", "Runs on pure peanut energy."
        ],
        moves: [
          { name: "Nut Bury", damage: 30, text: "Hides a nut. Forgets it instantly." },
          { name: "Freeze", damage: 20, text: "Becomes a statue. Fools no one." },
          { name: "Cheek Stuff", damage: 50, text: "Fits nine peanuts in one face." },
          { name: "Panic Sprint", damage: 70, text: "Runs across the road. Then back." },
          { name: "Feeder Raid", damage: 90, text: "Empties the bird feeder in a minute." },
          { name: "Tail Flick", damage: 10, text: "A tiny, furious tail signal." },
          { name: "Wire Run", damage: 60, text: "Crosses the power line at full speed." },
          { name: "Chatter", damage: 40, text: "Yells at you from the tree." },
          { name: "Big Jump", damage: 100, text: "Leaps a gap that should be impossible." },
          { name: "Snack Snatch", damage: 80, text: "Takes your cracker. Gone in 1 second." },
          { name: "Dig", damage: 30, text: "Digs up a flowerpot, looking for last year." }
        ],
        statBias: { chaos: 20, fluff: 15, sass: 0 }
      },

      // Monkeys: chaos agents and thieves.
      monkey: {
        names: [
          "Marcus", "Gus", "Nico", "Bianca", "Lola", "Monty", "Bongo", "Ziggy", "Banjo", "Mischa",
          "Jimmy", "Mojo", "Bandit", "Riley", "Archie", "Tito", "Juno", "Rocket", "Coco"
        ],
        title: [
          "Primate, chaos class", "Professional Snack Thief", "Head of Rooftop Operations", "Primate, heist edition",
          "Balcony Raid Coordinator", "Director of Mayhem", "Glasses Acquisition Expert",
          "Freelance Chaos Consultant", "Rooftop Gymnast", "Primate, no-rules class", "Senior Fruit Negotiator",
          "Tour Guide (Takes Your Bag)", "Chief Executive of Chaos"
        ],
        mood: [
          "planning a heist", "chaotic, but organised", "eyeing your sunglasses", "looking for trouble",
          "on a sugar high", "up to something", "full chaos, zero regrets", "deciding what to steal",
          "innocent (lying)", "bored, which is dangerous", "negotiating a trade", "living rent-free on your roof",
          "already halfway up your building", "pretending to be asleep"
        ],
        habitat: [
          "your balcony, unannounced", "the rooftop water tank, lid off", "the fruit market rooftops",
          "the cables, as a gym", "the tree over the parked cars", "the tourist spot, near the bags",
          "the fruit cart, briefly", "the top of the bus shelter", "the open window, any open window",
          "the hill with the snack shops", "the railing above the chai stall", "the roof of the ticket counter",
          "the pani puri stall, from above"
        ],
        diet: [
          "bananas, obviously", "your snacks, specifically", "stolen fruit, peeled with care",
          "the bag of chips you were holding", "mangoes from the neighbour's tree", "ice cream, confiscated",
          "the whole fruit cart, if allowed", "peanuts, traded for your glasses"
        ],
        knownFor: [
          "stealing sunglasses, then negotiating", "opening bags with zero effort", "swinging across the cables",
          "appearing out of nowhere", "running off with a whole bunch of bananas", "causing chaos, then sitting calmly",
          "trading your phone back for a mango", "breaking into balconies", "pulling socks off the washing line",
          "photobombing tourists", "making the whole rooftop scream", "an extremely innocent face",
          "posing for a photo, then taking the phone"
        ],
        weakness: [
          "a ripe banana", "an unzipped bag", "shiny sunglasses", "a fruit cart left alone", "a mirror",
          "an open window", "a good negotiation", "a mango, any mango"
        ],
        threat: [
          "will take your sunglasses", "high, near snacks", "will open your bag in seconds",
          "extremely high on balconies", "will negotiate for your phone", "chaos level: maximum",
          "will steal the socks off the line", "will steal your heart and your banana"
        ],
        aka: [
          "The Bandit", "The Negotiator", "The Rooftop Gang", "The Sunglasses Collector", "Balcony Burglar",
          "Agent Banana", "The Heist Specialist", "Boss of the Wires", "Chaos Incorporated",
          "The Fruit Cart Fugitive", "The Great Escape"
        ],
        catchphrase: [
          "\"Nice glasses. Mine now.\"", "\"Want your phone back? Mango.\"", "\"I didn't do it. I did do it.\"",
          "\"Your balcony, my rules.\"", "\"Let's make a deal.\"", "\"Chaos is a lifestyle.\"",
          "\"Banana first. Questions later.\"", "\"Who left this bag open?\"", "\"I'm just looking. (Not true.)\"",
          "\"I have your sock. Let's talk.\"", "\"You left the window open. I assumed.\"", "\"Swing by sometime.\""
        ],
        crime: [
          "for grand theft of sunglasses", "for holding a phone for ransom (mango)", "for raiding a fruit cart",
          "for breaking into a balcony", "for stealing socks off the line", "for opening the water tank, again",
          "for running off with a whole bag", "for causing chaos on the rooftop", "for photobombing tourists",
          "for gymnastics on the power lines", "for stealing an ice cream mid-lick"
        ],
        headline: [
          "{kind} STEALS SUNGLASSES, DEMANDS MANGO", "LOCAL {kind} RAIDS BALCONY, LEAVES PEEL",
          "{kind} RETURNS PHONE IN EXCHANGE FOR SNACK", "FRUIT CART ROBBED. {kind} LOOKS INNOCENT",
          "{kind} SEEN WEARING SOMEONE'S SOCK", "{kind} OPENS BAG FASTER THAN OWNER",
          "{kind} TAKES LAUNDRY OFF LINE, FOLDS NOTHING", "ROOFTOP IN CHAOS AFTER {kind} VISIT",
          "{kind} NEGOTIATES BETTER THAN YOUR BOSS", "{kind} STEALS ICE CREAM, NOT SORRY",
          "TOURISTS PHOTOBOMBED BY {kind}, AGAIN"
        ],
        greenFlag: [
          "great negotiator", "very athletic", "always has a plan", "shares the stolen banana (sometimes)",
          "never boring", "can climb anything", "knows every rooftop", "makes every day eventful"
        ],
        redFlag: [
          "steals your sunglasses", "opens your bag uninvited", "holds your phone for ransom",
          "causes chaos, then naps", "takes your laundry", "brings the whole gang", "unreliable around bananas",
          "has a record (fruit-related)"
        ],
        lookingFor: [
          "a partner in crime", "someone with a full bag", "a balcony with fruit", "a getaway driver",
          "someone who leaves windows open", "a mango, then commitment"
        ],
        loveLanguage: [
          "stealing things for you", "picking things out of your hair", "gifts (they're yours, from earlier)",
          "sharing half a banana", "chaos, together", "sitting on your shoulder uninvited"
        ],
        flavour: [
          "Has never returned anything for free.", "Your sunglasses look better on {name}.",
          "Chaos, but make it athletic.", "Was not there. Has your sock.", "Every open window is an invitation.",
          "Trades fairly: one phone, one mango.", "The rooftop's most wanted, and proud.", "Innocent face. Guilty hands."
        ],
        moves: [
          { name: "Glasses Grab", damage: 80, text: "Takes your sunglasses. Opens talks." },
          { name: "Bag Raid", damage: 90, text: "Opens your bag faster than you can." },
          { name: "Cable Swing", damage: 50, text: "Crosses the street on the cables." },
          { name: "Mango Ransom", damage: 110, text: "Returns your phone for one mango." },
          { name: "Innocent Face", damage: 30, text: "Looks completely innocent. Isn't." },
          { name: "Laundry Lift", damage: 60, text: "Steals one sock. Just one." },
          { name: "Rooftop Chaos", damage: 120, text: "The whole street screams. Somehow." },
          { name: "Peel Drop", damage: 40, text: "Leaves the peel. Walks off whistling." },
          { name: "Gang Call", damage: 70, text: "Summons cousins from three rooftops." },
          { name: "Photobomb", damage: 20, text: "Appears in every tourist photo." },
          { name: "Tank Dive", damage: 60, text: "Opens the water tank. Splashes about." }
        ],
        statBias: { chaos: 30, fluff: 0, sass: 15 }
      },

      // Other birds (parrots, mynas, sparrows, ducks): dramatic singers and gossips.
      bird: {
        names: [
          "Pearl", "Opal", "Delilah", "Pippa", "Bertie", "Robin", "Wren", "Jay", "Birdie", "Mavis",
          "Beverly", "Lorenzo", "Polly", "Kiki", "Rosalind", "Paulie", "Trilla", "Cheryl-Ann", "Valentina", "Percy"
        ],
        title: [
          "Avian, opera class", "Lead Vocalist, 5 am Choir", "Neighbourhood Gossip Columnist", "Soprano, Unpaid",
          "Bird, drama class", "Head of Morning Announcements", "Avian, main-character class",
          "Freelance Alarm Clock", "Balcony Influencer", "Chief Gossip Officer", "Professional Chirper",
          "Breaking Gossip Correspondent", "Avian, encore class"
        ],
        mood: [
          "dramatic, as usual", "ready to perform", "holding a high note", "spilling the tea",
          "obsessed with this gossip", "fluffed up and fabulous", "singing about it", "doing vocal warm-ups",
          "in a soap opera", "offended by a leaf", "loud about feelings", "waiting for an encore",
          "a little bit extra", "practising a new ringtone"
        ],
        habitat: [
          "the wire outside your bedroom", "the best branch for acoustics", "the balcony railing, for gossip",
          "the birdbath, like a spa", "the top of the TV antenna, performing", "the neighbour's mango tree",
          "the window with the best reflection", "the park pond", "the hedge with all the news",
          "your clothesline, uninvited", "the tallest tree, centre stage", "the café awning, front row",
          "the cable wire, centre mic"
        ],
        diet: [
          "seeds, sung about loudly", "fruit, picked dramatically", "tiny bugs and big opinions",
          "crumbs, with a performance", "half a mango", "gossip, mostly", "berries, one at a time",
          "bread from the pond visitors"
        ],
        knownFor: [
          "singing at 5 am, full volume", "knowing everyone's business", "fighting their own reflection",
          "dramatic exits", "one song, on repeat", "the loudest voice on the street", "copying the doorbell",
          "spa days in the birdbath", "gossiping on the wire", "shouting news from the tree",
          "whistling at nobody", "a dramatic flap for small reasons",
          "repeating whatever you just said"
        ],
        weakness: [
          "their own reflection", "an audience", "a birdbath", "fresh berries", "applause, or anything like it",
          "juicy gossip", "a perfect branch", "a scooter mirror"
        ],
        threat: [
          "will wake you at 5 am", "will tell everyone your news", "will sing until you clap",
          "will copy your ringtone", "loud, not dangerous", "dramatic, very dramatic", "will fight the scooter mirror",
          "will start a choir outside your window"
        ],
        aka: [
          "The 5 am Choir", "The Gossip", "Wire Opera", "Local Soprano", "The Alarm Clock", "Front Row Critic",
          "The Headliner", "The Rumour Mill", "Morning Broadcast", "The Encore", "The Feathered Headline"
        ],
        catchphrase: [
          "\"Did you hear about the cat?\"", "\"Me me me me me!\"", "\"This is my solo.\"", "\"Encore? Encore!\"",
          "\"Five a.m. is showtime.\"", "\"I'm not loud. I'm passionate.\"", "\"Don't tell anyone, but...\"",
          "\"Who is that gorgeous bird? Oh. Me.\"", "\"I heard it from a pigeon.\"", "\"Sing it with me!\"",
          "\"Drama? Me? Never.\"", "\"Hello? Hello? Hello?\""
        ],
        crime: [
          "for singing at 5 am without a permit", "for spreading gossip on the wire", "for fighting a scooter mirror",
          "for copying the doorbell", "for unlicensed opera", "for drama in a quiet lane",
          "for splashing everyone at the birdbath", "for stealing the show", "for telling the cats everything",
          "for eating all the berries"
        ],
        headline: [
          "LOCAL {kind} PERFORMS 5 AM CONCERT, NO TICKETS", "{kind} SPREADS RUMOUR, ENTIRE LANE INFORMED",
          "{kind} FIGHTS OWN REFLECTION, CALLS IT A DRAW", "{kind} COPIES DOORBELL, CONFUSES WHOLE BUILDING",
          "{kind} DEMANDS ENCORE OF OWN SONG", "{kind} SPOTTED HAVING SPA DAY IN BIRDBATH",
          "{kind} KNOWS EVERYTHING, TELLS EVERYONE", "{kind} HITS HIGH NOTE, WINDOWS NERVOUS",
          "{kind} STORMS OFF BRANCH IN DRAMATIC EXIT", "NEIGHBOURS WOKEN BY {kind}'S FULL ALBUM",
          "{kind} BEGINS WORLD TOUR (THIS TREE)"
        ],
        greenFlag: [
          "sings you good morning", "always has news", "emotionally expressive", "great outfit, every day",
          "will cheer for you, loudly", "knows all the best branches", "tiny and brave", "hums when happy"
        ],
        redFlag: [
          "sings at 5 am", "tells everyone everything", "fights their own reflection", "needs an audience, always",
          "copies your ringtone", "one song, every hour", "leaves dramatically", "spills the tea, and the birdbath"
        ],
        lookingFor: [
          "an audience of one", "a duet partner", "someone who loves gossip", "a branch with good acoustics",
          "a fan club, small is fine", "someone who's up at 5 am"
        ],
        loveLanguage: [
          "singing outside your window", "telling you the gossip first", "a dramatic entrance",
          "matching your whistle", "bringing you a twig", "shouting your name (sort of)"
        ],
        flavour: [
          "Has never sung quietly. Not once.", "Knows everything about everyone.",
          "{name} does not do quiet mornings.", "Small bird. Enormous voice.", "Every branch is a stage.",
          "The gossip arrives before the news.", "Would like to thank the birdbath.", "One song. Perfected. On repeat."
        ],
        moves: [
          { name: "5 am Solo", damage: 90, text: "Sings at dawn. Whole lane awake." },
          { name: "Gossip", damage: 50, text: "Tells 12 birds your business." },
          { name: "Mirror Fight", damage: 40, text: "Battles own reflection. It's a tie." },
          { name: "High Note", damage: 80, text: "Holds it until the glass is nervous." },
          { name: "Doorbell", damage: 60, text: "Rings a doorbell that isn't there." },
          { name: "Birdbath Splash", damage: 30, text: "Spa day. Everyone gets wet." },
          { name: "Dramatic Exit", damage: 20, text: "Leaves the branch with big feelings." },
          { name: "Encore", damage: 70, text: "Sings it all again. Nobody asked." },
          { name: "Fluff Up", damage: 10, text: "Becomes a perfect round ball." },
          { name: "Echo", damage: 40, text: "Repeats your last word back to you." },
          { name: "Choir Call", damage: 100, text: "Summons the whole choir. At once." }
        ],
        statBias: { chaos: 5, fluff: 15, sass: 20 }
      },

      // Mystery creatures (goat, lizard, snail, anything): unclassified, possibly government.
      mystery: {
        names: [
          "Specimen B", "Subject 9", "Unit 7", "Zebulon", "Cosmo", "Florian", "Quincy", "Ulysses", "Xavier",
          "Bartholomew", "Philomena", "Octavius", "Probably Steve", "Possibly Brenda", "Allegedly Doug", "Zorp",
          "Mystery Gary", "Maybe Linda"
        ],
        title: [
          "Creature, unclassified", "Mystery Creature, Level 4", "Unknown Species, Very Cute",
          "Classified (Ask Again Later)", "Creature, possibly government", "Cryptid, Part-Time",
          "Specimen of Interest", "Possibly a Spy", "Creature, top-secret class", "Unidentified, Unbothered",
          "In Witness Protection", "Visiting from Elsewhere", "Creature, rare-sighting class"
        ],
        mood: [
          "unclassifiable", "on a secret mission", "unknown, even to themselves", "blending in (badly)",
          "top secret", "slightly alien", "watching the humans", "mysterious, on purpose",
          "confused, but committed", "buffering", "here on business", "surprised you can see them",
          "disguised as a normal creature", "between dimensions, briefly"
        ],
        habitat: [
          "somewhere you've never looked", "the gap behind the water tank", "a rock that may be a door",
          "the garden, after midnight", "under the stairs, filing reports", "a wall nobody remembers building",
          "the corner of your eye", "a very suspicious bush", "the exact middle of nowhere",
          "the roof, uninvited", "a puddle, for now", "the edge of the map",
          "the ceiling, by the tube light"
        ],
        diet: [
          "unknown. very unknown.", "leaves, probably", "whatever's around, plus mystery", "your attention",
          "sunlight and secrets", "moss, allegedly", "things scientists can't name", "one snack, classified"
        ],
        knownFor: [
          "not being in any field guide", "appearing in photos, then not", "confusing everyone who sees them",
          "moving very slowly, or very fast", "looking exactly like a rock, then not",
          "staring like they know something", "being spotted once a year", "showing up after sunset",
          "climbing walls that can't be climbed", "baffling at least three experts", "existing without explanation",
          "being impossible to describe on the phone", "making everyone say \"what IS that?\""
        ],
        weakness: [
          "being correctly identified", "a warm rock", "a direct question", "bright torches",
          "one specific leaf", "someone who says \"aww\"", "flash photography", "paperwork"
        ],
        threat: [
          "classified", "unknown, but adorable", "may be a spy", "will vanish if you blink",
          "moderate, possibly alien", "will confuse your whole group chat", "top secret, level 9",
          "low, but extremely mysterious"
        ],
        aka: [
          "The Unexplained", "Agent X", "The Unknown", "File #4", "The Cryptid of Lane 4", "The Visitor",
          "Definitely Not a Rock", "That Thing from the Garden", "The Rumour", "Unidentified Floof", "Probably Fine"
        ],
        catchphrase: [
          "\"You didn't see me.\"", "\"I am a normal animal.\"", "\"This conversation is classified.\"",
          "\"Please don't look me up.\"", "\"I'm just a rock. Move along.\"", "\"Beep.\"",
          "\"Report to base? Not yet.\"", "\"Nobody knows what I am. Including me.\"",
          "\"I come in peace. And for snacks.\"", "\"Act normal. Act normal.\"", "\"I've been here the whole time.\"",
          "\"Take me to your snacks.\""
        ],
        crime: [
          "for being unclassified", "for existing without paperwork", "for vanishing in front of witnesses",
          "for impersonating a rock", "for confusing a scientist", "for unauthorised mystery",
          "for spying on the garden", "for being in three places at once", "for appearing only in blurry photos",
          "for refusing to be identified"
        ],
        headline: [
          "UNKNOWN {kind} SPOTTED, EXPERTS SHRUG", "{kind} OF UNKNOWN ORIGIN SAYS NOTHING",
          "MYSTERY {kind} SEEN AGAIN. STILL UNEXPLAINED", "SCIENTISTS BAFFLED BY GARDEN {kind}",
          "{kind} WAS A ROCK. NOW IT ISN'T", "OFFICIALS DENY ANY {kind} EXISTS",
          "{kind} SPOTTED IN THREE PLACES AT ONCE", "{kind} TOO CUTE TO CLASSIFY, SAYS REPORT",
          "\"IT LOOKED AT ME,\" SAYS {kind} WITNESS", "LOCAL {kind} REFUSES TO BE IDENTIFIED",
          "FIELD GUIDE UPDATED AFTER {kind} SIGHTING"
        ],
        greenFlag: [
          "one of a kind, literally", "great at keeping secrets", "never boring", "low maintenance (probably)",
          "comes in peace", "keeps you guessing", "fascinating to watch", "rare, like a golden card"
        ],
        redFlag: [
          "won't say what species they are", "disappears without warning", "might be working for someone", "no paperwork",
          "possibly a rock", "answers questions with silence", "in three places at once", "unknown origin"
        ],
        lookingFor: [
          "someone who doesn't need answers", "a quiet rock to share", "a scientist with a sense of humour",
          "a ride home (address unknown)", "a pen pal, unclassified", "someone who believes in them"
        ],
        loveLanguage: [
          "appearing at random", "staring meaningfully", "vanishing, then coming back",
          "leaving a mysterious leaf", "quality time, location unknown", "being in your photos, blurry"
        ],
        flavour: [
          "Not in any field guide. Yet.", "{name} has a file. It's blank.", "Spotted once. Believed by few.",
          "Scientists are still arguing.", "Could be anything. Is definitely cute.",
          "If found, do not explain to anyone.", "Possibly from the future.", "Definitely real. Probably."
        ],
        moves: [
          { name: "Vanish", damage: 60, text: "Gone the moment you look back." },
          { name: "Rock Mode", damage: 20, text: "Becomes a rock. Very convincing." },
          { name: "Mystery Stare", damage: 50, text: "Knows something. Won't say." },
          { name: "Confuse", damage: 70, text: "Everyone in the group chat argues." },
          { name: "Blur", damage: 40, text: "Appears only in blurry photos." },
          { name: "Wall Climb", damage: 30, text: "Goes up something it shouldn't." },
          { name: "Unknown Sound", damage: 80, text: "A noise no animal should make." },
          { name: "Classified", damage: 100, text: "This move cannot be described." },
          { name: "Slow Approach", damage: 10, text: "Moves 1 cm per hour toward you." },
          { name: "Signal Home", damage: 90, text: "Calls home. Nobody answers." },
          { name: "Three Places", damage: 120, text: "Is everywhere at once." }
        ],
        statBias: { chaos: 15, fluff: 5, sass: 5 }
      }
    },

    // Style x reason. Every line has {to}. Engine fills {name}, {to}, and {kind} (news only).
    recipient: {
      minimal: {
        twin: "for {to}: found your twin",
        soulmate: "for {to}: found your soulmate",
        boyfriend: "for {to}: meet your new boyfriend",
        girlfriend: "for {to}: meet your new girlfriend",
        hi: "for {to}: {name} says hi",
        missyou: "for {to}: this reminded me of you",
        replacement: "for {to}: your replacement starts Monday",
        meet: "for {to}: {name} wants to meet you"
      },
      trading: {
        twin: "Gifted to {to}. Separated at birth.",
        soulmate: "Gifted to {to}. Soulmate, confirmed.",
        boyfriend: "Gifted to {to}. Your new boyfriend.",
        girlfriend: "Gifted to {to}. Your new girlfriend.",
        hi: "Gifted to {to}. {name} says hi.",
        missyou: "Gifted to {to}. Saw this, thought of you.",
        replacement: "Gifted to {to}. Your replacement. No pressure.",
        meet: "Gifted to {to}. {name} would like a meeting."
      },
      polaroid: {
        twin: "{to}, found your twin ♥",
        soulmate: "{to}, found your soulmate ♥",
        boyfriend: "{to}, meet your new boyfriend ♥",
        girlfriend: "{to}, meet your new girlfriend ♥",
        hi: "{to}, {name} says hi ♥",
        missyou: "{to}, this one made me think of you ♥",
        replacement: "{to}, sorry, you've been replaced ♥",
        meet: "{to}, {name} wants to meet you ♥"
      },
      wanted: {
        twin: "Wanted for looking exactly like {to}",
        soulmate: "If found, return to {to}. Soulmate.",
        boyfriend: "Known boyfriend of {to}",
        girlfriend: "Known girlfriend of {to}",
        hi: "Wanted for saying hi to {to}",
        missyou: "Wanted for reminding me of {to}",
        replacement: "Wanted: {to}'s replacement. Found.",
        meet: "Wanted for a meeting with {to}"
      },
      dating: {
        twin: "Twin match! {name} ♥ {to}",
        soulmate: "It's a match! {name} ♥ {to}",
        boyfriend: "New boyfriend! {name} ♥ {to}",
        girlfriend: "New girlfriend! {name} ♥ {to}",
        hi: "{name} says hi, {to} ♥",
        missyou: "{name} ♥ {to}: thought of you",
        replacement: "New match! {name} is {to} 2.0",
        meet: "{name} wants to meet {to} ♥"
      },
      news: {
        twin: "{to} HAS A TWIN, CONFIRMS LOCAL {kind}",
        soulmate: "LOCAL {kind} FINDS SOULMATE: {to}",
        boyfriend: "{to} SEEN WITH NEW BOYFRIEND, A {kind}",
        girlfriend: "{to}'S NEW GIRLFRIEND IS A {kind}",
        hi: "LOCAL {kind} SAYS HI TO {to}",
        missyou: "{kind} REMINDS ENTIRE STREET OF {to}",
        replacement: "{to} REPLACED BY {kind}, SOURCES SAY",
        meet: "LOCAL {kind} ASKS ABOUT {to}"
      }
    },

    // Done-screen nudge: one warm line after every send/save about where the binder lives.
    // Only {name}. Rotate so the 10th one is still fun. Max 70 characters.
    nudges: {
      generic: [
        "{name} lives in this browser, on this phone. Cozy!",
        "Your cuties live on this phone. The ones you sent live in your chats.",
        "{name} is safe in your binder, right here on this phone.",
        "Binder tip: clearing your browser clears your cuties. Choose wisely.",
        "{name} is saved here. Sent cards live in your chats too.",
        "Your binder stays on this phone. No account, no cloud, just you.",
        "{name} has moved in. This phone only, so save a copy.",
        "Cuties live in this browser. Saved images live in your photos.",
        "Your binder never leaves this phone. Like a diary, but cuter.",
        "{name} is filed away on this phone. Sent ones are in your chats."
      ],
      ios: [
        "{name} is in your binder. Add to Home Screen so they stay.",
        "iPhones tidy up quiet websites. Tap Share, then Add to Home Screen.",
        "Keep {name} cozy: tap Share, then Add to Home Screen.",
        "Add to Home Screen and your binder stays put. {name} approves.",
        "One tap to keep your cuties: Share, then Add to Home Screen.",
        "{name} wants an address: Share, then Add to Home Screen.",
        "Your binder lives on this iPhone. Add to Home Screen so it stays.",
        "Collector move: tap Share, then Add to Home Screen.",
        "{name} would like a spot on your Home Screen. Share, then Add."
      ],
      inapp: [
        "This app's browser keeps its own binder. Open in your main browser.",
        "{name} is saved in this app's browser. Try Safari or Chrome.",
        "Tap the menu, then Open in browser, to keep your cuties for good.",
        "In-app browsers forget things. Open this site in Safari or Chrome.",
        "{name} deserves a real home: tap the menu, then Open in browser.",
        "This binder belongs to the app. Safari or Chrome keeps it for good.",
        "Collecting lots? Open the site in your main browser from the menu.",
        "{name} prefers your main browser. Menu, then Open in browser.",
        "This app keeps a separate binder. Your main browser keeps it better."
      ],
      blocked: [
        "This browser can't keep cuties, but {name} works. Send or save!",
        "Save the image and {name} comes home with you.",
        "Your photos will keep this one safe and sound: tap Save image.",
        "{name} can't stay in this browser, but fits in your photos.",
        "Private mode, maybe? Send or save the card to keep your cuties.",
        "This browser can't hold on to cards. Your camera roll can.",
        "Tap Save image and {name} is yours to keep.",
        "This browser can't keep cards. Send {name} to someone nice."
      ],
      first: [
        "{name} kicks off your binder! It lives on this phone.",
        "Cutie #1: {name}. Kept in this browser, on this phone.",
        "Your binder has begun. It lives on this phone, so keep a copy too.",
        "Welcome to the binder. It's on this phone only, like a secret diary."
      ]
    }
  };
})(globalThis);
