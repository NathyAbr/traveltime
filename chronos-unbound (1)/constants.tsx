
import { Destination } from './types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'paris-1889',
    title: 'PARIS_1889',
    period: 'EPOQUE_BELLE',
    coords: "48.8584° N, 2.2945° E",
    description: "L'aube de l'industrie moderne. Assistez à l'activation de la Tour Eiffel.",
    longDescription: "Séquence temporelle chargée. Plongez dans le Paris de la fin du XIXe siècle. Promenez-vous sur le Champ-de-Mars, admirez les pavillons de l'Exposition Universelle et soyez parmi les premiers à monter dans la Tour Eiffel.",
    image: "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&q=80&w=1200", 
    color: "cyan",
    price: 4500,
    tags: ["romantique", "industrie", "ville", "culture"],
    features: ["Accès VIP Exposition", "Protocole Jules Verne", "Rencontre G. Eiffel"]
  },
  {
    id: 'cretaceous',
    title: 'SECTEUR_CRETACE',
    period: 'T_MINUS_65M',
    coords: "PANGEA_SECTOR_7",
    description: "Environnement hostile classe 4. Observation sécurisée de la mégafaune.",
    longDescription: "Pour les amateurs d'adrénaline et de nature brute. Notre dôme de protection invisible vous permet d'observer les T-Rex et les troupeaux de Tricératops en toute sécurité.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200", 
    color: "emerald",
    price: 8200,
    tags: ["nature", "aventure", "danger", "animaux", "dino"],
    features: ["Gyrosphère Furtive", "Scan Bioluminescent", "Données Paléontologiques"]
  },
  {
    id: 'florence-1504',
    title: 'FLORENCE_CORE',
    period: 'RENAISSANCE_V1',
    coords: "43.7696° N, 11.2558° E",
    description: "Le berceau du code culturel humain. Interfacez-vous avec Da Vinci.",
    longDescription: "Marchez dans les rues pavées de Florence aux côtés des plus grands génies de l'humanité. Assistez à la création du David de Michel-Ange ou à l'achèvement de la Joconde.",
    image: "https://images.unsplash.com/photo-1541542684-d2703f2323e4?auto=format&fit=crop&q=80&w=1200", 
    color: "violet",
    price: 6000,
    tags: ["art", "histoire", "calme", "culture"],
    features: ["Accès Atelier Da Vinci", "Cryptage Médicis", "Upload Philosophique"]
  },
  {
    id: 'giza-2560bc',
    title: 'GIZEH_GENESIS',
    period: 'DYNASTIE_IV',
    coords: "29.9792° N, 31.1342° E",
    description: "Observez la pose de la dernière pierre de la Grande Pyramide.",
    longDescription: "Remontez aux origines de la civilisation. Assistez à l'incroyable chantier de la pyramide de Khéops sous le soleil d'Égypte.",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=1200", 
    color: "amber",
    price: 7500,
    tags: ["chaleur", "histoire", "monument", "mystère"],
    features: ["Croisière Solaire", "Audience Pharaonique", "Décodage Hiéroglyphe"]
  },
  {
    id: 'ny-1920',
    title: 'NY_ROARING',
    period: 'JAZZ_ERA_V1',
    coords: "40.7128° N, 74.0060° W",
    description: "Jazz, gratte-ciels et prohibition. L'énergie brute du Nouveau Monde.",
    longDescription: "Vivez la frénésie des années folles. Des clubs de jazz secrets de Harlem aux sommets des premiers gratte-ciels.",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1200", 
    color: "rose",
    price: 5200,
    tags: ["fête", "musique", "ville", "nocturne"],
    features: ["Pass Speakeasy", "Vol en Biplan", "Concert Privé Armstrong"]
  },
  {
    id: 'tokyo-2150',
    title: 'NEO_TOKYO',
    period: 'CYBER_ERA',
    coords: "35.6762° N, 139.6503° E",
    description: "Un saut vers le futur probable. Néons, pluie et implants cybernétiques.",
    longDescription: "Explorez une mégalopole verticale où la technologie a fusionné avec l'humain. Goûtez à la cuisine synthétique de rue.",
    image: "https://images.unsplash.com/photo-1540959733332-e94e270b4d82?auto=format&fit=crop&q=80&w=1200", 
    color: "blue",
    price: 9900,
    tags: ["futur", "tech", "néon", "nuit"],
    features: ["Implant Traducteur", "Course Moto-Jet", "Dîner Orbital"]
  }
];
