import React, { useState, useEffect } from 'react';
import { TRAINERS, FACILITIES, REVIEWS, CATEGORIES, DURATIONS, PRICE_MATRIX, GYM_PHOTOS, IMAGE_ASSETS, OPERATING_HOURS, TRAINER_TIMINGS, CONTACT_INFO } from './constants';
import ChatBot from './components/ChatBot';

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// Helper to convert Roman Numerals to Integers for the Coupon System
const romanToInt = (s: string): number => {
  const romanMap: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100
  };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = romanMap[s[i]];
    const next = romanMap[s[i + 1]];
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  return total;
};

const SectionHeader = ({ title, subtitle, accent }: { title: string; subtitle?: string; accent?: string }) => (
  <div className="text-center mb-20 reveal">
    {subtitle && (
      <span className="text-blue-500 font-black uppercase tracking-[0.5em] text-[10px] block mb-4">
        {subtitle}
      </span>
    )}
    <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter leading-none">
      {title} <br />
      {accent && <span className="text-zinc-800 italic">{accent}</span>}
    </h2>
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Philosophy', id: 'about' },
    { name: 'Facilities', id: 'facilities' },
    { name: 'Timings', id: 'timings' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Transformation', id: 'trainers' },
    { name: 'Packages', id: 'pricing' },
    { name: 'Reviews', id: 'reviews' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${
      scrolled || mobileMenuOpen ? 'bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-900 py-3 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-display font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-transform group-hover:scale-110">NF</div>
          <span className="font-display text-xl font-bold tracking-tighter uppercase">NINJA <span className="text-blue-500">FITZ</span></span>
        </div>
        
        <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          {navLinks.map(link => (
            <button 
              key={link.name} 
              onClick={() => scrollToSection(link.id)} 
              className="hover:text-blue-500 transition-colors uppercase font-bold"
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => scrollToSection('join')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
          >
            Join Clan
          </button>
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-900 p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
          {navLinks.map(link => (
            <button 
              key={link.name} 
              onClick={() => scrollToSection(link.id)} 
              className="text-[12px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 text-left"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  useScrollReveal();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [couponInput, setCouponInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0); 
  const [formData, setFormData] = useState({ 
    name: '', 
    contact: '', 
    startDate: new Date().toISOString().split('T')[0] 
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Discount eligibility logic
  const isEligibleForDiscount = [3, 6, 12].includes(selectedDuration.id) || (selectedCategory.id === 'pt' && selectedDuration.id === 1);

  const getPrices = () => {
    let base = PRICE_MATRIX[selectedCategory.id]?.[selectedDuration.id] || 0;
    if (base === 0) {
      const keys = Object.keys(PRICE_MATRIX[selectedCategory.id]).map(Number).sort((a,b)=>a-b);
      base = PRICE_MATRIX[selectedCategory.id][keys.find(k => k >= selectedDuration.id) || keys[keys.length-1]];
    }
    const multiplier = isEligibleForDiscount ? (100 - discountPercent) / 100 : 1;
    const discounted = Math.floor(base * multiplier);
    return { original: base, final: discounted, savings: base - discounted };
  };

  const { original, final, savings } = getPrices();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCalculatedEndDate = () => {
    const startObj = new Date(formData.startDate);
    const endObj = new Date(formData.startDate);
    endObj.setMonth(startObj.getMonth() + selectedDuration.id);
    return endObj;
  };

  const handleApplyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    // STRICT REGEX: Exactly 4 alphabetic chars + Roman Numerals (I, V, X, L, C)
    const match = code.match(/^([A-Z]{4})([IVXLC]+)$/);
    
    if (match) {
      const romanPart = match[2];
      const percent = romanToInt(romanPart);
      
      if (percent > 0 && percent <= 100) {
        if (!isEligibleForDiscount) {
          alert("Ancient Protocol Rejected: Discounts are ONLY available for Personal Training or 3+ Month plans.");
          return;
        }
        setDiscountPercent(percent);
        alert(`Protocol Decoded: ${percent}% discount applied! Your commitment to the path is recognized.`);
      } else {
        alert("Invalid energy signature in coupon.");
      }
    } else if (code === "") {
        setDiscountPercent(0);
        alert("Coupon cleared.");
    } else {
      alert("Invalid Format. Use exactly 4 letters then Roman numerals (e.g., FITX for 10%, FITV for 5%).");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const startObj = new Date(formData.startDate);
    const endObj = getCalculatedEndDate();
    const now = new Date();

    const leadData = {
      name: formData.name,
      contact: formData.contact,
      plan: selectedCategory.name,
      durationLabel: selectedDuration.name,
      durationMonths: selectedDuration.id,
      totalPrice: final,
      originalPrice: original,
      savings: savings,
      discountUsed: isEligibleForDiscount ? `${discountPercent}%` : '0%',
      submissionDate: formatDate(now),
      submissionTime: now.toLocaleTimeString(),
      membershipStart: formatDate(startObj),
      membershipEnd: formatDate(endObj)
    };

    const EXCEL_API_URL = 'https://sheetdb.io/api/v1/85sfmqkcnlp4g'; 
    try {
      await fetch(EXCEL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
    } catch (err) {
      console.error("Excel Sync Error:", err);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ 
      name: '', 
      contact: '', 
      startDate: new Date().toISOString().split('T')[0] 
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <Navbar />
      <ChatBot />

      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal-visible { opacity: 1; transform: translateY(0); }
        html { scroll-behavior: smooth; }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={IMAGE_ASSETS.heroBackground} className="w-full h-full object-cover grayscale opacity-20 scale-105" alt="Gym" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/40 to-zinc-950"></div>
        </div>
        <div className="relative z-10 text-center max-w-6xl">
          <div className="mb-6 reveal">
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] px-6 py-2 border border-blue-500/20 rounded-full inline-block backdrop-blur-sm shadow-2xl">
              NINJA FITZ GYM • THE ARENA
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-8xl lg:text-[10rem] font-black mb-10 leading-[0.9] tracking-tighter uppercase reveal">
            THE <span className="text-blue-500">NINJA</span><br />
            FITNESS CENTER
          </h1>
          <p className="text-zinc-400 text-base md:text-xl lg:text-2xl mb-12 max-w-4xl mx-auto font-light leading-relaxed reveal">
            A high-performance sanctuary for elite movement. 24/7 biometric access included in every protocol.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center reveal">
            <button onClick={() => scrollToSection('pricing')} className="w-full sm:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/20">Claim Access</button>
            <button onClick={() => scrollToSection('facilities')} className="w-full sm:w-auto bg-zinc-900/60 backdrop-blur-md text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-zinc-800 hover:bg-zinc-800 transition-all">Explore Arsenal</button>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section id="about" className="py-24 md:py-40 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <SectionHeader title="OUR" accent="PHILOSOPHY" subtitle="THE PATH OF DISCIPLINE" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative reveal">
            <div className="relative overflow-hidden rounded-[3rem] border border-zinc-900 shadow-2xl group">
              <img src={IMAGE_ASSETS.philosophySection} className="w-full aspect-[4/5] object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt="Vision" />
              <div className="absolute bottom-10 left-10 bg-zinc-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-zinc-800 shadow-2xl">
                <p className="text-blue-500 font-display text-6xl font-black tracking-tighter">24H</p>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">Operational Readiness</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center reveal">
            <h3 className="text-3xl md:text-5xl font-display font-black mb-8 leading-tight uppercase">FORGED IN <br /><span className="text-blue-500">THE VOID</span></h3>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light mb-10 italic border-l-4 border-blue-500/20 pl-8">
              "We provide the anvil. You provide the intent. Results are the only currency we recognize."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {h: "CONSISTENCY", p: "We show up when others don't. Discipline beats motivation every single day."},
                {h: "EQUIPMENT", p: "6000+ sq ft filled with the world's most effective strength stations."},
                {h: "COMMUNITY", p: "A supportive arena for athletes of all levels, focused on collective growth."},
                {h: "GROUP ZONES", p: "High-energy spaces for Zumba, CrossFit, and dynamic incinerations."}
              ].map((item, i) => (
                <div key={i} className="reveal">
                  <h4 className="text-blue-500 font-display font-black text-[11px] uppercase mb-2 tracking-widest">{item.h}</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">{item.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES SECTION */}
      <section id="facilities" className="py-24 bg-zinc-900/10 px-6 border-t border-zinc-900">
        <SectionHeader title="THE" accent="ARSENAL" subtitle="PREMIUM AMENITIES" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FACILITIES.map(f => (
            <div key={f.id} className="reveal bg-zinc-950 p-12 rounded-[3rem] border border-zinc-900 hover:border-blue-500 transition-all flex flex-col items-center text-center group">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
              <h3 className="text-xl font-display font-black mb-4 uppercase tracking-tight">{f.title}</h3>
              <p className="text-zinc-500 text-xs font-bold leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMINGS SECTION */}
      <section id="timings" className="py-24 px-6 bg-zinc-950 border-t border-zinc-900">
        <SectionHeader title="THE" accent="SCHEDULE" subtitle="TIME IS YOUR CURRENCY" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {OPERATING_HOURS.map((item, idx) => (
              <div key={idx} className="reveal bg-zinc-900/20 border border-zinc-900 p-10 rounded-[2.5rem] hover:border-blue-500 transition-all group">
                <h4 className="font-display text-2xl font-black text-white mb-4 uppercase group-hover:text-blue-500">{item.day}</h4>
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-black text-white tracking-tighter">{item.hours}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{item.status || "STAFFED"}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-black uppercase tracking-tighter text-white">TRAINER <span className="text-zinc-800 italic">TIMINGS</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRAINER_TIMINGS.map((item, idx) => (
              <div key={idx} className="reveal bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem] hover:border-blue-500 transition-all shadow-lg group">
                <h5 className="font-display text-xl font-black text-white uppercase tracking-tight group-hover:text-blue-500 mb-4">{item.shift}</h5>
                <p className="text-2xl font-black text-zinc-300 mb-2">{item.hours}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-24 px-6 bg-zinc-950 border-t border-zinc-900">
        <SectionHeader title="THE" accent="ARENA" subtitle="VISUAL TOUR" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GYM_PHOTOS.map((photo, index) => (
            <div key={index} className="reveal group relative overflow-hidden rounded-[2rem] border border-zinc-900 aspect-[4/3]">
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-6 left-6 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-blue-500 font-display font-black text-lg uppercase tracking-widest">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINERS SECTION */}
      <section id="trainers" className="py-24 px-6 bg-zinc-950 border-t border-zinc-900">
        <SectionHeader title="ELITE" accent="TRANSFORMATION" subtitle="REAL RESULTS" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {TRAINERS.map(trainer => (
            <div key={trainer.id} className="group reveal">
              <div className="relative overflow-hidden rounded-[3rem] mb-8 border border-zinc-900 aspect-[3/4]">
                <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-display font-black uppercase text-white mb-1 leading-none">{trainer.name}</h3>
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-2">{trainer.specialty}</p>
                </div>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed px-4">{trainer.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 md:py-40 px-6 bg-zinc-950 border-t border-zinc-900">
        <SectionHeader title="PRICING" accent="MATRIX" subtitle="SELECT YOUR PATH" />
        <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat); setDiscountPercent(0); }} className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${selectedCategory.id === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-900 hover:border-zinc-800'}`}>
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {DURATIONS.map(dur => PRICE_MATRIX[selectedCategory.id]?.[dur.id] ? (
                <button key={dur.id} onClick={() => { setSelectedDuration(dur); setDiscountPercent(0); }} className={`px-6 py-3 rounded-lg font-black text-[9px] uppercase tracking-widest border transition-all ${selectedDuration.id === dur.id ? 'bg-white text-zinc-950 border-white' : 'bg-zinc-950 text-zinc-700 border-zinc-900 hover:border-zinc-800'}`}>
                  {dur.name}
                </button>
              ) : null)}
            </div>
            
            {/* COUPON INPUT */}
            <div className="max-w-2xl mx-auto mb-16 reveal flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full relative">
                <input 
                  type="text" 
                  placeholder="Enter Coupon)" 
                  value={couponInput} 
                  onChange={(e) => setCouponInput(e.target.value)} 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-6 text-[12px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all placeholder:text-zinc-700" 
                />
                {discountPercent > 0 && isEligibleForDiscount && <span className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-500 font-black tracking-widest">{discountPercent}% ACTIVE</span>}
              </div>
              <button onClick={handleApplyCoupon} className="w-full md:w-auto bg-blue-600 text-white px-12 py-6 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">Decode</button>
            </div>

            <div className="w-full max-w-2xl mx-auto bg-zinc-950 border-2 border-blue-600 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-500/10">
              <h3 className="font-display text-3xl md:text-5xl font-black mb-8 uppercase leading-tight">{selectedCategory.name} <br/><span className="text-zinc-800 italic">{selectedDuration.name}</span></h3>
              
              <div className="flex flex-col items-center justify-center mb-12">
                {/* SHOW ACTUAL PRICE AND DISCOUNTS BEFORE FINAL PRICE */}
                <div className="min-h-[80px] flex flex-col items-center justify-center">
                  {discountPercent > 0 && isEligibleForDiscount ? (
                    <div className="flex flex-col items-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-800 text-2xl font-black line-through tracking-tighter">₹{original.toLocaleString()}</span>
                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10">SAVE ₹{savings.toLocaleString()}</span>
                      </div>
                      <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">{discountPercent}% Ancient Protocol Applied</span>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <span className="text-zinc-700 text-[10px] font-black uppercase tracking-widest block">Actual Standard Rate</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <span className={`text-3xl font-black italic mt-6 transition-colors ${discountPercent > 0 && isEligibleForDiscount ? 'text-blue-500' : 'text-zinc-600'}`}>₹</span>
                  <span className={`text-8xl md:text-[11rem] font-black tracking-tighter leading-none transition-all duration-500 ${discountPercent > 0 && isEligibleForDiscount ? 'text-blue-500 scale-105' : 'text-white'}`}>
                    {final.toLocaleString()}
                  </span>
                </div>
              </div>

              <button onClick={() => scrollToSection('join')} className="block w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20">Initiate Access</button>
            </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-24 px-6 bg-zinc-950 border-t border-zinc-900">
        <SectionHeader title="WARRIOR" accent="ECHOES" subtitle="COMMUNITY VOICE" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {REVIEWS.map(review => (
            <div key={review.id} className="reveal bg-zinc-900/20 p-12 rounded-[3rem] border border-zinc-900 flex flex-col items-center text-center hover:border-blue-500/30 transition-all group">
              <p className="text-zinc-300 italic mb-10 leading-relaxed font-light text-lg">"{review.comment}"</p>
              <div className="mt-auto">
                <div className="w-12 h-12 bg-zinc-800 rounded-full mb-4 mx-auto border border-zinc-700 flex items-center justify-center font-bold text-blue-500 shadow-lg group-hover:scale-110 transition-transform">
                  {review.author[0]}
                </div>
                <h4 className="font-display font-black text-white text-[10px] uppercase tracking-widest">{review.author}</h4>
                <div className="flex justify-center mt-2 gap-1">
                  {[...Array(review.rating)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN FORM SECTION */}
      <section id="join" className="py-24 px-6 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
        <SectionHeader title="JOIN THE" accent="CLAN" subtitle="FINAL PROTOCOL" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-zinc-900/40 backdrop-blur-xl border-2 border-zinc-800 rounded-[4rem] p-12 md:p-20 shadow-2xl reveal">
            {isSubmitted ? (
              <div className="text-center py-10 animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-4xl font-display font-black mb-6 uppercase tracking-tighter">DATA SECURED</h3>
                <p className="text-zinc-500 mb-12 text-lg italic tracking-widest">"Excel synchronized. Our senseis will reach out via encrypted signal shortly."</p>
                <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 bg-zinc-800 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-zinc-700 transition-all">New Entry</button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group">
                    <label className="block text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Warrior Name</label>
                    <input required type="text" placeholder="e.g. Arjun Mehta" className="w-full bg-zinc-950/50 border-2 border-zinc-800 rounded-2xl px-8 py-6 text-white focus:outline-none focus:border-blue-500 transition-all font-bold tracking-widest" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="group">
                    <label className="block text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Phone Number</label>
                    <input required type="text" placeholder="+91 00000 00000" className="w-full bg-zinc-950/50 border-2 border-zinc-800 rounded-2xl px-8 py-6 text-white focus:outline-none focus:border-blue-500 transition-all font-bold tracking-widest" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-center">Membership Start Date</label>
                  <input required type="date" className="w-full bg-zinc-950/50 border-2 border-zinc-800 rounded-2xl px-8 py-6 text-white focus:outline-none focus:border-blue-500 transition-all font-bold tracking-widest text-center uppercase" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="pt-10">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-12 p-10 bg-zinc-950 rounded-[3rem] border-2 border-dashed border-zinc-900 gap-10">
                    <div className="text-center md:text-left">
                      <p className="text-white text-3xl font-display font-black tracking-tight mb-2 uppercase">{selectedCategory.name}</p>
                      <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">{selectedDuration.name} Access Plan</p>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="mb-4">
                        <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1">Expiration Date</span>
                        <span className="text-blue-500 text-lg font-black tracking-tight">{formatDate(getCalculatedEndDate())}</span>
                      </div>
                      <span className="text-7xl font-display font-black text-blue-500 tracking-tighter leading-none">₹{final.toLocaleString()}</span>
                    </div>
                  </div>
                  <button disabled={isLoading} type="submit" className="w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-2xl uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50">{isLoading ? 'ESTABLISHING LINK...' : 'JOIN THE CLAN'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 border-t border-zinc-900 text-center bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
            <span className="font-display font-black text-2xl tracking-tighter uppercase">Ninja <span className="text-blue-500">Fitz</span></span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl text-center">
              <div className="flex flex-col items-center gap-3">
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">ADDRESS</span>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed max-w-[200px] uppercase tracking-wider">{CONTACT_INFO.address}</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">INSTAGRAM</span>
                <a href={CONTACT_INFO.instagramLink} target="_blank" rel="noopener noreferrer" className="text-white text-base font-display font-bold hover:text-blue-400 uppercase tracking-tight">{CONTACT_INFO.instagram}</a>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">CONTACT</span>
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-white text-2xl font-black tracking-tighter hover:text-blue-400">{CONTACT_INFO.phone}</a>
              </div>
            </div>
            <p className="text-[10px] font-black text-zinc-700 tracking-[0.5em] uppercase">&copy; 2026 NINJA FITZ GYM • GYM OWNED BY ROMIL AGRAWAL</p>
        </div>
      </footer>
    </div>
  );
};

export default App;