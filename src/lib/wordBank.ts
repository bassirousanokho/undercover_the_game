import type { WordPair } from './types'

export const WORD_BANK: WordPair[] = [
  // Animals
  { id: 'cat-lion', theme: 'animals', civilian: { fr: 'Chat', en: 'Cat' }, undercover: { fr: 'Lion', en: 'Lion' } },
  { id: 'dog-wolf', theme: 'animals', civilian: { fr: 'Chien', en: 'Dog' }, undercover: { fr: 'Loup', en: 'Wolf' } },
  { id: 'horse-donkey', theme: 'animals', civilian: { fr: 'Cheval', en: 'Horse' }, undercover: { fr: 'Âne', en: 'Donkey' } },
  { id: 'eagle-hawk', theme: 'animals', civilian: { fr: 'Aigle', en: 'Eagle' }, undercover: { fr: 'Faucon', en: 'Hawk' } },
  { id: 'frog-toad', theme: 'animals', civilian: { fr: 'Grenouille', en: 'Frog' }, undercover: { fr: 'Crapaud', en: 'Toad' } },
  { id: 'butterfly-moth', theme: 'animals', civilian: { fr: 'Papillon', en: 'Butterfly' }, undercover: { fr: 'Mite', en: 'Moth' } },
  { id: 'shark-dolphin', theme: 'animals', civilian: { fr: 'Requin', en: 'Shark' }, undercover: { fr: 'Dauphin', en: 'Dolphin' } },
  { id: 'crow-raven', theme: 'animals', civilian: { fr: 'Corbeau', en: 'Crow' }, undercover: { fr: 'Corneille', en: 'Raven' } },
  { id: 'tiger-panther', theme: 'animals', civilian: { fr: 'Tigre', en: 'Tiger' }, undercover: { fr: 'Panthère', en: 'Panther' } },
  { id: 'rabbit-hare', theme: 'animals', civilian: { fr: 'Lapin', en: 'Rabbit' }, undercover: { fr: 'Lièvre', en: 'Hare' } },

  // Food
  { id: 'coffee-tea', theme: 'food', civilian: { fr: 'Café', en: 'Coffee' }, undercover: { fr: 'Thé', en: 'Tea' } },
  { id: 'bread-croissant', theme: 'food', civilian: { fr: 'Pain', en: 'Bread' }, undercover: { fr: 'Croissant', en: 'Croissant' } },
  { id: 'cake-tart', theme: 'food', civilian: { fr: 'Gâteau', en: 'Cake' }, undercover: { fr: 'Tarte', en: 'Tart' } },
  { id: 'soup-broth', theme: 'food', civilian: { fr: 'Soupe', en: 'Soup' }, undercover: { fr: 'Bouillon', en: 'Broth' } },
  { id: 'cheese-yogurt', theme: 'food', civilian: { fr: 'Fromage', en: 'Cheese' }, undercover: { fr: 'Yaourt', en: 'Yogurt' } },
  { id: 'apple-pear', theme: 'food', civilian: { fr: 'Pomme', en: 'Apple' }, undercover: { fr: 'Poire', en: 'Pear' } },
  { id: 'pasta-rice', theme: 'food', civilian: { fr: 'Pâtes', en: 'Pasta' }, undercover: { fr: 'Riz', en: 'Rice' } },
  { id: 'chocolate-caramel', theme: 'food', civilian: { fr: 'Chocolat', en: 'Chocolate' }, undercover: { fr: 'Caramel', en: 'Caramel' } },
  { id: 'wine-champagne', theme: 'food', civilian: { fr: 'Vin', en: 'Wine' }, undercover: { fr: 'Champagne', en: 'Champagne' } },
  { id: 'pizza-quiche', theme: 'food', civilian: { fr: 'Pizza', en: 'Pizza' }, undercover: { fr: 'Quiche', en: 'Quiche' } },

  // Jobs
  { id: 'doctor-nurse', theme: 'jobs', civilian: { fr: 'Médecin', en: 'Doctor' }, undercover: { fr: 'Infirmier', en: 'Nurse' } },
  { id: 'teacher-professor', theme: 'jobs', civilian: { fr: 'Enseignant', en: 'Teacher' }, undercover: { fr: 'Professeur', en: 'Professor' } },
  { id: 'painter-sculptor', theme: 'jobs', civilian: { fr: 'Peintre', en: 'Painter' }, undercover: { fr: 'Sculpteur', en: 'Sculptor' } },
  { id: 'chef-baker', theme: 'jobs', civilian: { fr: 'Cuisinier', en: 'Chef' }, undercover: { fr: 'Boulanger', en: 'Baker' } },
  { id: 'lawyer-judge', theme: 'jobs', civilian: { fr: 'Avocat', en: 'Lawyer' }, undercover: { fr: 'Juge', en: 'Judge' } },
  { id: 'pilot-astronaut', theme: 'jobs', civilian: { fr: 'Pilote', en: 'Pilot' }, undercover: { fr: 'Astronaute', en: 'Astronaut' } },
  { id: 'firefighter-police', theme: 'jobs', civilian: { fr: 'Pompier', en: 'Firefighter' }, undercover: { fr: 'Policier', en: 'Police officer' } },
  { id: 'architect-engineer', theme: 'jobs', civilian: { fr: 'Architecte', en: 'Architect' }, undercover: { fr: 'Ingénieur', en: 'Engineer' } },

  // Objects
  { id: 'phone-tablet', theme: 'objects', civilian: { fr: 'Téléphone', en: 'Phone' }, undercover: { fr: 'Tablette', en: 'Tablet' } },
  { id: 'chair-stool', theme: 'objects', civilian: { fr: 'Chaise', en: 'Chair' }, undercover: { fr: 'Tabouret', en: 'Stool' } },
  { id: 'umbrella-raincoat', theme: 'objects', civilian: { fr: 'Parapluie', en: 'Umbrella' }, undercover: { fr: 'Imperméable', en: 'Raincoat' } },
  { id: 'clock-watch', theme: 'objects', civilian: { fr: 'Horloge', en: 'Clock' }, undercover: { fr: 'Montre', en: 'Watch' } },
  { id: 'backpack-suitcase', theme: 'objects', civilian: { fr: 'Sac à dos', en: 'Backpack' }, undercover: { fr: 'Valise', en: 'Suitcase' } },
  { id: 'candle-lamp', theme: 'objects', civilian: { fr: 'Bougie', en: 'Candle' }, undercover: { fr: 'Lampe', en: 'Lamp' } },
  { id: 'guitar-violin', theme: 'objects', civilian: { fr: 'Guitare', en: 'Guitar' }, undercover: { fr: 'Violon', en: 'Violin' } },
  { id: 'bicycle-scooter', theme: 'objects', civilian: { fr: 'Vélo', en: 'Bicycle' }, undercover: { fr: 'Trottinette', en: 'Scooter' } },

  // Places
  { id: 'beach-lake', theme: 'places', civilian: { fr: 'Plage', en: 'Beach' }, undercover: { fr: 'Lac', en: 'Lake' } },
  { id: 'mountain-hill', theme: 'places', civilian: { fr: 'Montagne', en: 'Mountain' }, undercover: { fr: 'Colline', en: 'Hill' } },
  { id: 'castle-palace', theme: 'places', civilian: { fr: 'Château', en: 'Castle' }, undercover: { fr: 'Palais', en: 'Palace' } },
  { id: 'library-bookstore', theme: 'places', civilian: { fr: 'Bibliothèque', en: 'Library' }, undercover: { fr: 'Librairie', en: 'Bookstore' } },
  { id: 'forest-jungle', theme: 'places', civilian: { fr: 'Forêt', en: 'Forest' }, undercover: { fr: 'Jungle', en: 'Jungle' } },
  { id: 'village-town', theme: 'places', civilian: { fr: 'Village', en: 'Village' }, undercover: { fr: 'Bourg', en: 'Town' } },
  { id: 'airport-station', theme: 'places', civilian: { fr: 'Aéroport', en: 'Airport' }, undercover: { fr: 'Gare', en: 'Train station' } },

  // Sports
  { id: 'football-rugby', theme: 'sports', civilian: { fr: 'Football', en: 'Football' }, undercover: { fr: 'Rugby', en: 'Rugby' } },
  { id: 'tennis-badminton', theme: 'sports', civilian: { fr: 'Tennis', en: 'Tennis' }, undercover: { fr: 'Badminton', en: 'Badminton' } },
  { id: 'swimming-diving', theme: 'sports', civilian: { fr: 'Natation', en: 'Swimming' }, undercover: { fr: 'Plongée', en: 'Diving' } },
  { id: 'skiing-snowboarding', theme: 'sports', civilian: { fr: 'Ski', en: 'Skiing' }, undercover: { fr: 'Snowboard', en: 'Snowboarding' } },
  { id: 'boxing-wrestling', theme: 'sports', civilian: { fr: 'Boxe', en: 'Boxing' }, undercover: { fr: 'Lutte', en: 'Wrestling' } },

  // Weather / nature
  { id: 'rain-storm', theme: 'nature', civilian: { fr: 'Pluie', en: 'Rain' }, undercover: { fr: 'Orage', en: 'Storm' } },
  { id: 'snow-frost', theme: 'nature', civilian: { fr: 'Neige', en: 'Snow' }, undercover: { fr: 'Gel', en: 'Frost' } },
  { id: 'sun-moon', theme: 'nature', civilian: { fr: 'Soleil', en: 'Sun' }, undercover: { fr: 'Lune', en: 'Moon' } },
  { id: 'river-stream', theme: 'nature', civilian: { fr: 'Rivière', en: 'River' }, undercover: { fr: 'Ruisseau', en: 'Stream' } },
  { id: 'volcano-geyser', theme: 'nature', civilian: { fr: 'Volcan', en: 'Volcano' }, undercover: { fr: 'Geyser', en: 'Geyser' } },
]

export const THEMES = Array.from(new Set(WORD_BANK.map((w) => w.theme)))

export function pickWordPair(theme?: string): WordPair {
  const pool = theme ? WORD_BANK.filter((w) => w.theme === theme) : WORD_BANK
  const source = pool.length > 0 ? pool : WORD_BANK
  return source[Math.floor(Math.random() * source.length)]
}
