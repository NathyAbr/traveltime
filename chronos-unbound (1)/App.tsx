
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  X, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Info,
  History,
  Trees,
  Palette,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Globe,
  Aperture,
  Crosshair,
  Wifi,
  Activity,
  Maximize,
  Binary,
  ShoppingBag,
  Trash2,
  CreditCard,
  CheckCircle,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { DESTINATIONS } from './constants';
import { Destination, CartItem, ChatMessage } from './types';
import { getGeminiResponse } from './services/geminiService';

// --- Text Scramble Effect ---
const ScrambleText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [displayedText, setDisplayedText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayedText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayedText}</span>;
};

// --- Sub-components ---

const NavLink: React.FC<{ children: React.ReactNode; active: boolean; onClick: () => void }> = ({ children, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all overflow-hidden group hover:bg-white/5`}
    >
      <span className={`relative z-10 ${active ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-cyan-200'}`}>
        {children}
      </span>
      {active && (
        <>
          <motion.div layoutId="activeNav" className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-cyan-500" />
        </>
      )}
    </button>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Persistent Cart Storage Key
  const STORAGE_KEY = 'chronos_persistence_final_v1';

  // Initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("RESTORE_FAILED", e);
      return [];
    }
  });
  
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Persist cart on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [activePage]);

  const addToCart = useCallback((dest: Destination, date: string, crew: string) => {
    const newItem: CartItem = {
      ...dest,
      bookingId: `CHRONO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      date: date || new Date().toISOString().split('T')[0],
      crew: crew || 'Solo'
    };
    
    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((bookingId: string) => {
    setCart(prev => prev.filter(item => item.bookingId !== bookingId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setIsCartOpen(false);
    localStorage.removeItem(STORAGE_KEY);
    alert("TRANSMISSION: Séquence de saut validée. Bon voyage.");
  }, []);

  return (
    <div className="min-h-screen bg-[#020204] text-cyan-50 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden cursor-crosshair">
      
      {/* Background HUD Layers */}
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[size:100%_4px]" />
      <motion.div 
        className="fixed inset-0 pointer-events-none z-[60] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[10vh]"
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div style={{ y: backgroundY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </motion.div>
        
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-cyan-600/10 blur-[120px] rounded-full" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-violet-700/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-cyan-500/10 bg-[#020204]/80 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActivePage('home')}>
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full border-t-cyan-400 animate-spin-slow" />
              <Aperture className="text-white relative z-10" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-[0.15em] uppercase text-white font-mono flex items-center gap-2">
                CHRONOS <span className="text-cyan-500 text-[8px] md:text-[10px] bg-cyan-950/50 px-1 border border-cyan-500/30 rounded">V.3.5</span>
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[0.5rem] md:text-[0.6rem] text-zinc-500 uppercase font-mono tracking-widest">Systems_Optimal</span>
              </div>
            </div>
          </div>
          
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative w-10 h-10 bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-center">
              <ShoppingBag size={18} className="text-cyan-400" />
              {cart.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-600 text-white text-[9px] font-bold flex items-center justify-center border border-black shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                  {cart.length}
                </div>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-cyan-500">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <NavLink active={activePage === 'home'} onClick={() => setActivePage('home')}>Base_Command</NavLink>
            <NavLink active={activePage === 'destinations'} onClick={() => setActivePage('destinations')}>Destinations_Log</NavLink>
            <NavLink active={activePage === 'about'} onClick={() => setActivePage('about')}>Sys_Protocols</NavLink>
            
            <div className="w-px h-8 bg-white/10 mx-6" />
            
            <div className="flex items-center gap-4">
              <button onClick={() => setIsQuizOpen(true)} className="group relative px-6 py-2 bg-cyan-950/20 border border-cyan-500/30 transition-all hover:border-cyan-400 overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/5 -translate-x-full group-hover:translate-x-0 transition-transform" />
                <div className="relative flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <Zap size={14} />
                  <span>Sync</span>
                </div>
              </button>

              <button onClick={() => setIsCartOpen(true)} className="group relative w-12 h-10 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-center transition-all">
                <ShoppingBag size={18} className="text-cyan-400 group-hover:text-white" />
                {cart.length > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center border border-black shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                    {cart.length}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-black/95 border-b border-cyan-500/30 overflow-hidden">
              <div className="px-6 py-8 flex flex-col gap-6 font-mono text-sm uppercase">
                <button onClick={() => { setActivePage('home'); setIsMobileMenuOpen(false); }} className="text-left text-cyan-400">Base_Command</button>
                <button onClick={() => { setActivePage('destinations'); setIsMobileMenuOpen(false); }} className="text-left text-zinc-400">Destinations_Log</button>
                <button onClick={() => { setActivePage('about'); setIsMobileMenuOpen(false); }} className="text-left text-zinc-400">Sys_Protocols</button>
                <button onClick={() => { setIsQuizOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-amber-400"><Zap size={14} /> Sync_Profile</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {activePage === 'home' && <HomePage key="home" onExplore={() => setActivePage('destinations')} onOpenQuiz={() => setIsQuizOpen(true)} />}
          {activePage === 'destinations' && <DestinationsPage key="dest" onSelect={setSelectedDest} />}
          {activePage === 'about' && <AboutPage key="about" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-12 mt-auto relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
               <Binary className="text-cyan-900" size={16} />
               <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                 Archivage_Temporel // Stabilite_Systeme: 100%
               </p>
            </div>
            <p className="text-[9px] text-zinc-800 font-mono">CHRONOS_LABS_INC // GENEVA_04</p>
          </div>
          <div className="flex gap-8 items-center text-[10px] font-mono uppercase text-zinc-500">
             <button className="hover:text-cyan-500 transition-colors">Politique_Paradoxe</button>
             <button className="hover:text-cyan-500 transition-colors">Termes_Synchronisation</button>
          </div>
          <p className="text-[10px] text-zinc-700 font-mono">CHRONOS_UNBOUND © 2145</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900/30 to-transparent" />
      </footer>

      {/* Modals & Widgets */}
      <AnimatePresence>
        {selectedDest && (
          <DestinationModal 
            key="dest-modal"
            dest={selectedDest} 
            onClose={() => setSelectedDest(null)} 
            onAddToCart={addToCart} 
          />
        )}
        {isQuizOpen && (
          <RecommendationQuiz 
            key="quiz-modal"
            onClose={() => setIsQuizOpen(false)} 
            onRecommend={(dest) => { setIsQuizOpen(false); setSelectedDest(dest); }} 
          />
        )}
        {isCartOpen && (
          <CartDrawer 
            key="cart-drawer"
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cart={cart} 
            onRemove={removeFromCart} 
            onCheckout={clearCart} 
          />
        )}
      </AnimatePresence>

      <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}

// --- Home Page ---
function HomePage({ onExplore, onOpenQuiz }: { onExplore: () => void; onOpenQuiz: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="border border-cyan-500/20 bg-cyan-950/10 px-8 py-3 mb-10 flex items-center gap-4 backdrop-blur-md">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]" />
        <span className="text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-[0.4em]">Temporal_Bridge_Online</span>
      </motion.div>
      
      <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none text-white mb-12">
        <ScrambleText text="CHRONOS" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-500 animate-gradient bg-[length:200%_auto]">UNBOUND</span>
      </h1>
      
      <p className="text-zinc-400 max-w-xl mb-16 font-mono font-light border-l-2 border-cyan-500/30 pl-6 text-left leading-relaxed">
        <span className="text-cyan-500 font-bold">{">"}</span> Destinations_Disponibles : Gizeh, Paris, NY, Tokyo, Crétacé.<br/>
        <span className="text-white">Le temps n'est plus une barrière. C'est une archive ouverte.</span>
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <button onClick={onExplore} className="flex-1 h-14 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95">
          Exploration <ChevronRight size={16} />
        </button>
        <button onClick={onOpenQuiz} className="flex-1 h-14 border border-white/20 text-white font-mono text-xs uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3 active:scale-95">
          <Activity size={16} className="text-cyan-500" /> Analyse_Profil
        </button>
      </div>
    </motion.div>
  );
}

// --- Destinations Page ---
function DestinationsPage({ onSelect }: { onSelect: (d: Destination) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl md:text-6xl font-black mb-20 uppercase tracking-tighter text-white">Archives <span className="text-zinc-600">Temporelles</span></h2>
      <div className="space-y-32">
        {DESTINATIONS.map((dest, idx) => (
          <motion.div key={dest.id} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center group`}>
            <div className="w-full lg:w-3/5 aspect-[16/9] relative bg-black border border-white/10 overflow-hidden cursor-pointer" onClick={() => onSelect(dest)}>
              <img src={dest.image} className="w-full h-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={dest.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
              <div className="absolute bottom-6 left-6 flex gap-2">
                 {dest.tags.slice(0, 2).map(tag => (
                   <span key={tag} className="text-[8px] font-mono uppercase bg-black/60 border border-white/10 px-2 py-1 backdrop-blur-sm">#{tag}</span>
                 ))}
              </div>
              <div className="absolute inset-0 border-2 border-cyan-500/0 group-hover:border-cyan-500/20 transition-all m-4" />
            </div>
            <div className="w-full lg:w-2/5">
              <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-4">ID: {dest.id}</div>
              <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter leading-none">{dest.title.split('_')[0]} <span className="text-cyan-500">{dest.title.split('_')[1]}</span></h3>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-8 border-l border-cyan-500/20 pl-6">{dest.longDescription}</p>
              <button onClick={() => onSelect(dest)} className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-3 active:scale-95 shadow-xl">
                Initialiser Séquence <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// --- About Page ---
function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <h2 className="text-4xl md:text-6xl font-black mb-20 uppercase tracking-tighter">Architecture <span className="text-cyan-500">Système</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: "Pare-feu Paradoxal", desc: "Algorithmes quantiques bloquant toute altération causale ou interférence historique." },
          { icon: Cpu, title: "Immersion Neurale", desc: "Téléchargement linguistique et culturel instantané via nano-liaison synaptique." },
          { icon: Clock, title: "Précision Atomique", desc: "Retour synchronisé à la nanoseconde près pour éviter tout décalage biologique." }
        ].map((item, i) => (
          <div key={i} className="p-8 bg-zinc-900/30 border border-white/5 hover:border-cyan-500/30 transition-all group backdrop-blur-sm">
            <div className="w-16 h-16 bg-cyan-950/20 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <item.icon size={28} />
            </div>
            <h4 className="font-mono font-bold mb-4 uppercase text-sm tracking-widest text-white">{item.title}</h4>
            <p className="text-xs text-zinc-500 font-mono leading-relaxed px-4">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Destination Modal ---
function DestinationModal({ dest, onClose, onAddToCart }: { dest: Destination; onClose: () => void; onAddToCart: (d: Destination, dt: string, c: string) => void }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [crew, setCrew] = useState("Solo");

  const handleConfirm = () => {
    onAddToCart(dest, date, crew);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-2xl" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-[#050505] w-full max-w-5xl h-[85vh] border border-cyan-900/50 flex flex-col md:row-row overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row h-full">
          {/* Visual Side */}
          <div className="w-full md:w-5/12 bg-zinc-900 relative border-r border-white/5">
            <img src={dest.image} className="w-full h-full object-cover opacity-40 grayscale" alt={dest.title} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 p-10 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-2 py-1 bg-black/50 backdrop-blur">TARGET_FEED // LIVE</span>
                   <span className="text-[8px] font-mono text-zinc-500">SYNC_STATUS: OPTIMAL</span>
                 </div>
                 <Activity className="text-red-500 animate-pulse" size={20} />
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-px bg-cyan-500" />
                <h2 className="text-5xl font-black uppercase text-white tracking-tighter opacity-30 leading-none">{dest.title.split('_')[1] || dest.title}</h2>
              </div>
            </div>
          </div>
          
          {/* Controls Side */}
          <div className="w-full md:w-7/12 p-12 flex flex-col bg-black/40 relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors p-2"><X size={24} /></button>
            <div className="mb-10">
              <div className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.4em] mb-2">Manifest_Entry_Point</div>
              <h2 className="text-4xl font-black uppercase text-white mb-6 leading-none tracking-tighter">{dest.title.replace('_', ' ')}</h2>
              <div className="flex gap-2">
                 <button onClick={() => setStep(1)} className={`py-2 px-6 font-mono text-[10px] uppercase border transition-all ${step === 1 ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-zinc-800 text-zinc-600'}`}>01 Briefing</button>
                 <button onClick={() => setStep(2)} className={`py-2 px-6 font-mono text-[10px] uppercase border transition-all ${step === 2 ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-zinc-800 text-zinc-600'}`}>02 Config</button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-zinc-900/50 border border-white/5 p-4 relative group">
                      <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-500" />
                      <span className="block text-[9px] text-zinc-600 uppercase mb-1 font-mono tracking-widest">Temporal_Vector</span>
                      <span className="font-bold text-white tracking-tight">{dest.period}</span>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/5 p-4 relative group">
                      <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-500" />
                      <span className="block text-[9px] text-zinc-600 uppercase mb-1 font-mono tracking-widest">Jump_Energy</span>
                      <span className="font-bold text-cyan-400 tracking-tight">{dest.price} TC</span>
                    </div>
                  </div>
                  <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-sm mb-8 flex-1">
                    <p className="font-mono text-xs text-zinc-400 leading-relaxed italic">{dest.longDescription}</p>
                  </div>
                  <button onClick={() => setStep(2)} className="mt-auto px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-[0.3em] self-end transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95">Next_Phase {">>"} </button>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1 flex flex-col space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] text-cyan-500 font-mono block uppercase tracking-widest">Jump_Timestamp</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-black border border-zinc-800 p-4 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-800" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] text-cyan-500 font-mono block uppercase tracking-widest">Expedition_Payload</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Solo', 'Duo', 'Squad'].map((opt) => (
                        <button key={opt} onClick={() => setCrew(opt)} className={`py-4 border font-mono text-[10px] uppercase transition-all ${crew === opt ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleConfirm} className="mt-auto w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all active:scale-95 shadow-2xl">INIT_PARADOX_JUMP <Zap size={18} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Cart Drawer ---
function CartDrawer({ isOpen, onClose, cart, onRemove, onCheckout }: { isOpen: boolean; onClose: () => void; cart: CartItem[]; onRemove: (id: string) => void; onCheckout: () => void }) {
  const total = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      transition={{ type: 'spring', damping: 28, stiffness: 220 }} 
      className="fixed inset-y-0 right-0 z-[120] w-full max-w-md bg-[#020204] border-l border-cyan-500/20 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col"
    >
      <div className="h-28 px-8 border-b border-cyan-500/10 flex items-center justify-between bg-black/40 backdrop-blur-xl">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white">Flight_Manifest</h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Synchronized_Units: {cart.length}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-3 text-zinc-600 hover:text-white hover:bg-white/5 transition-all rounded-sm"><X size={26} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative">
        <AnimatePresence initial={false} mode="popLayout">
          {cart.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              className="flex flex-col items-center justify-center h-full text-zinc-800 gap-6"
            >
              <div className="relative">
                <History size={64} strokeWidth={0.5} className="text-zinc-900" />
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
                  className="absolute -inset-4 border border-dashed border-zinc-900 rounded-full" 
                />
              </div>
              <div className="text-center space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.4em]">Empty_Archive</p>
                <p className="text-[9px] font-mono text-zinc-700 uppercase">Awaiting_Temporal_Input</p>
              </div>
            </motion.div>
          ) : cart.map((item) => (
            <motion.div 
              key={item.bookingId} 
              layout
              initial={{ opacity: 0, scale: 0.9, x: 20 }} 
              animate={{ opacity: 1, scale: 1, x: 0 }} 
              exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
              className="bg-zinc-900/30 border border-zinc-800 p-5 flex gap-5 relative group overflow-hidden hover:border-cyan-500/40 transition-all shadow-lg"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-600 shadow-[0_0_15px_#06b6d4]" />
              
              {/* Thumbnail */}
              <div className="w-20 h-20 bg-zinc-800 overflow-hidden border border-white/5 flex-shrink-0">
                <img src={item.image} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt={item.title} />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-white uppercase text-xs tracking-tight">{item.title.replace('_', ' ')}</h4>
                    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">{item.bookingId}</span>
                  </div>
                  <button onClick={() => onRemove(item.bookingId)} className="text-zinc-700 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                </div>
                
                <div className="flex justify-between items-end mt-3">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase"><Calendar size={10} className="text-cyan-900" /> {item.date}</span>
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase"><Cpu size={10} className="text-cyan-900" /> {item.crew}</span>
                  </div>
                  <div className="text-cyan-400 font-bold font-mono text-base">{item.price} TC</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="p-10 border-t border-cyan-500/10 bg-[#030305]">
        <div className="flex justify-between items-center text-xs font-mono uppercase mb-8">
          <span className="text-zinc-600 tracking-widest">Total_Credits_Required</span>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] tracking-tighter">
              {total} <span className="text-cyan-400 text-base ml-1">TC</span>
            </span>
            <span className="text-[8px] text-zinc-700 tracking-[0.2em] font-mono uppercase mt-1">Excl_Dimensional_Tax</span>
          </div>
        </div>
        <button 
          onClick={onCheckout} 
          disabled={cart.length === 0} 
          className="w-full py-5 bg-white hover:bg-cyan-400 disabled:bg-zinc-900 disabled:text-zinc-700 text-black font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 group overflow-hidden relative shadow-2xl"
        >
          <div className="absolute inset-0 bg-cyan-500/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <span className="relative z-10 flex items-center gap-2">
            AUTHORIZE_LAUNCH <CheckCircle size={18} />
          </span>
        </button>
      </div>
    </motion.div>
  );
}

// --- Quiz Component ---
function RecommendationQuiz({ onClose, onRecommend }: { onClose: () => void; onRecommend: (d: Destination) => void }) {
  const [step, setStep] = useState(0);
  const questions = [
    { q: "Mission_Objective ?", options: [{ label: "Archive_Data", value: "culture" }, { label: "Survival_Test", value: "adventure" }, { label: "Aesthetic_Scan", value: "art" }] },
    { q: "Temporal_Vector ?", options: [{ label: "Industrial", value: "paris" }, { label: "Pre_Human", value: "cretaceous" }, { label: "Future", value: "tokyo" }] }
  ];
  const handleSelect = (v: string) => {
    if (step < questions.length - 1) setStep(step + 1);
    else onRecommend(DESTINATIONS.find(d => d.id.includes(v)) || DESTINATIONS[0]);
  };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-black w-full max-w-lg p-12 border border-cyan-500/30">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-600 hover:text-white p-2 transition-colors"><X size={24}/></button>
        <div className="text-[9px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-4 text-center">Profile_Scanner_v1.0</div>
        <h3 className="text-3xl font-black mb-12 text-center uppercase tracking-tighter leading-none text-white">{questions[step].q}</h3>
        <div className="space-y-4">
          {questions[step].options.map(opt => (
            <button key={opt.value} onClick={() => handleSelect(opt.value)} className="w-full py-5 px-8 border border-zinc-800 hover:border-cyan-500 font-mono text-xs uppercase text-left transition-all hover:bg-cyan-950/20 group relative overflow-hidden">
               <div className="absolute inset-y-0 left-0 w-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
               {opt.label}
            </button>
          ))}
        </div>
        <div className="mt-12 flex justify-center gap-3">
          {questions.map((_, i) => (
            <div key={i} className={`h-1 flex-1 max-w-[50px] transition-all duration-500 ${i <= step ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-zinc-900'}`} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// --- Chat Widget ---
function ChatWidget({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: "SYS_MSG: Neural Link Established. Awaiting Input." }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await getGeminiResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "ERR: Connexion interrompue. Protocoles d'urgence activés." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="mb-6 w-[350px] bg-black border border-cyan-500/40 h-[500px] flex flex-col shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden">
            <div className="h-14 bg-[#080808] border-b border-white/5 flex justify-between items-center px-6">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_5px_#06b6d4]" />
                AI_CORE_V3.5
              </span>
              <button onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-gradient-to-b from-[#050505] to-black">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 text-[11px] font-mono border relative leading-relaxed ${m.role === 'user' ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-50' : 'border-zinc-800 bg-zinc-900/50 text-zinc-400'}`}>
                    <div className={`absolute top-0 w-1.5 h-1.5 bg-cyan-600 shadow-[0_0_5px_#06b6d4] ${m.role === 'user' ? 'right-0' : 'left-0'}`} />
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[9px] font-mono text-cyan-600 animate-pulse pl-1 uppercase tracking-[0.2em]">Computing_Paradox_Resolution...</div>}
            </div>
            <div className="p-4 border-t border-white/5 bg-[#080808] flex gap-3">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="AWAITING COMMAND..." 
                className="flex-1 bg-black border border-zinc-800 px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-800" 
              />
              <button onClick={handleSend} className="bg-white hover:bg-cyan-500 p-3 transition-all active:scale-95 shadow-lg group">
                <Send size={18} className="text-black group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} className="w-20 h-20 bg-black border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)] active:scale-90 group">
        <MessageSquare size={30} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
