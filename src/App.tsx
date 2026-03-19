/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Database, 
  CheckCircle2, 
  Check,
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp,
  MapPin, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  FileText,
  Sparkles,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Filter,
  Grid,
  List,
  Mail,
  FileDown,
  Send,
  LayoutDashboard,
  Store,
  Link2,
  CloudSun,
  Search,
  Maximize2,
  MessageSquare,
  Bell,
  AlertCircle,
  Calendar,
  CircleHelp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const frenchCities = [
  "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", 
  "Strasbourg", "Bordeaux", "Lille", "Rennes", "Reims", "Saint-Étienne", 
  "Le Havre", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne"
];

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center overflow-hidden">
      <div className="w-full h-full relative">
        <div className="absolute inset-0 bg-blue-600 transform -skew-x-12 -translate-x-2"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl italic">
          2
        </div>
      </div>
    </div>
    <span className="font-bold text-xl tracking-tight">SMART RETAIL</span>
  </div>
);

// Timeline removed as per user request

// AppTooltip Component
const AppTooltip = ({ text, children, key }: { text: string; children: React.ReactNode; key?: React.Key }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block w-full" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap z-[100] shadow-xl"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Step 2 & 3 states
  const [shopName, setShopName] = useState("");
  const [selectedSector, setSelectedSector] = useState("Sélectionnez");
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [salesGoal, setSalesGoal] = useState("");
  const [stockOptimal, setStockOptimal] = useState("");
  const [growthTarget, setGrowthTarget] = useState("");
  const [stockAlert, setStockAlert] = useState("");
  const [importType, setImportType] = useState<'csv' | 'erp' | null>(null);
  const [isErpConnecting, setIsErpConnecting] = useState(false);
  const [isErpConnected, setIsErpConnected] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    id: string;
    name: string;
    size: string;
    date: string;
    count: number;
  }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store cities state
  const [storeCities, setStoreCities] = useState<{ name: string; count: string }[]>([]);
  const [openCityDropdown, setOpenCityDropdown] = useState<number | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setOpenCityDropdown(null);
    if (openCityDropdown !== null) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openCityDropdown]);
  
  // Dashboard states
  const [dateRange, setDateRange] = useState<'7' | '30'>('7');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("1, JAN 2026 - 7, JAN 2026");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [isDataImported, setIsDataImported] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setter(numericValue);
  };

  const handleLogin = () => {
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      setStep(2);
    }
  };

  const isFormValid = 
    shopName.trim() !== "" &&
    selectedSector !== "Sélectionnez" &&
    selectedObjectives.length > 0 &&
    salesGoal !== "" &&
    growthTarget !== "" &&
    stockOptimal !== "" &&
    stockAlert !== "" &&
    (isErpConnected || uploadedFiles.length > 0);

  const isReadyToStart = isFormValid;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        date: new Date().toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        count: Math.floor(Math.random() * 500) + 100
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setImportType('csv');
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const nextStep = () => {
    if (step < 9) setStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (step > 2) {
      if (step === 7) setStep(4); // From dashboard back to importation
      else if (step === 4) setStep(2); // From loading back to config
      else setStep((prev) => (prev - 1) as Step);
    }
  };

  const goToStep = (targetStep: number) => {
    if (targetStep < step && targetStep >= 2) {
      setStep(targetStep as Step);
    }
  };

  // Auto-advance for loading steps
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(true);
        setStep(3);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const chartData = [
    { name: '07-01-2026', n: 100, n1: 200, forecast: 150 },
    { name: '08-01-2026', n: 300, n1: 500, forecast: 250 },
    { name: '09-01-2026', n: 350, n1: 550, forecast: 450 },
    { name: '10-01-2026', n: 200, n1: 450, forecast: 500 },
    { name: '11-01-2026', n: 150, n1: 400, forecast: 550 },
    { name: '12-01-2026', n: 100, n1: 450, forecast: 650 },
    { name: '13-01-2026', n: 120, n1: 480, forecast: 700 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {/* ÉTAPE 1 : LOGIN */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-screen bg-white"
          >
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-5/12 bg-[#EBF6FF] relative p-12 flex-col justify-end">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-blue-600 transform -skew-x-12 -translate-x-4"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl italic">
                      2
                    </div>
                  </div>
                </div>
                <span className="font-bold text-4xl tracking-tight text-slate-900">SMART RETAIL</span>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8">
              <div className="w-full max-w-[540px] space-y-12">
                <div className="space-y-4">
                  <h1 className="text-[40px] font-bold text-[#002C8C] leading-tight">Bienvenue</h1>
                  <p className="text-lg text-slate-500">Connectez-vous pour commencer l’onboarding.</p>
                </div>

                <div className="space-y-8">
                  {/* Email Field */}
                  <div className="space-y-3">
                    <label className="block text-xl font-medium text-slate-900">E-mail</label>
                    <input 
                      type="email"
                      placeholder="Votre@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full h-[72px] px-8 bg-[#F8FCFF] border-l-[4px] border-[#1677FF] rounded-r-lg text-xl outline-none focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-3">
                    <label className="block text-xl font-medium text-slate-900">Mot de passe</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="........."
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full h-[72px] px-8 bg-[#F8FCFF] border-l-[4px] border-[#1677FF] rounded-r-lg text-xl outline-none focus:bg-white transition-colors"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <X className="w-6 h-6" /> : <div className="w-6 h-6 border-2 border-slate-300 rounded-full" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-6 h-6 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-lg text-slate-500">Se souvenir de moi</span>
                    </label>
                    <button className="text-lg font-medium text-[#1677FF] hover:underline">
                      Mot de passe oublié?
                    </button>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <button 
                    onClick={handleLogin}
                    disabled={!loginEmail || !loginPassword}
                    className={`w-full h-[64px] rounded-xl text-xl font-bold transition-all ${
                      (loginEmail && loginPassword) 
                        ? 'bg-[#1677FF] text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Se connecter
                  </button>

                  <div className="text-center text-lg">
                    <span className="text-slate-500">Vous n'avez pas de compte? </span>
                    <button className="font-medium text-[#1677FF] hover:underline">
                      Inscrivez-vous
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ÉTAPE 2 : CONFIGURATION INITIALE */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col bg-[#F8F9FB]"
          >
            <header className="bg-white border-b border-slate-100 px-12 py-6 flex justify-between items-center shrink-0">
              <Logo />
              <span className="text-xs text-slate-400 font-medium">Configuration initiale</span>
            </header>

            <main className="flex-1 overflow-y-auto p-12 pb-32">
              <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-12">
                
                {/* Left Column: Welcome & Data Import */}
                <div className="col-span-12 lg:col-span-5 space-y-12">
                  <div className="space-y-4">
                    <h1 className="text-[44px] font-bold text-[#002C8C] leading-tight">Bienvenue sur Smart Retail</h1>
                    <p className="text-xl text-slate-500">Configurez votre système intelligent de prévision des ventes</p>
                  </div>

                  <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Ajoutez vos données</h3>
                      <p className="text-lg text-slate-400">Importez ou saisissez vos produits</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".csv" 
                        className="hidden" 
                      />
                      <button 
                        onClick={triggerFileInput}
                        className={`flex flex-col items-center justify-center p-10 border-2 rounded-[24px] transition-all group relative h-[320px] ${importType === 'csv' ? 'border-[#1677FF] bg-blue-50/30' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform ${importType === 'csv' ? 'bg-[#EBF6FF] text-[#1677FF]' : 'bg-blue-50 text-[#1677FF] group-hover:scale-110'}`}>
                          <Upload className="w-10 h-10" />
                        </div>
                        <p className="text-xl font-bold text-slate-800">Importer un CSV</p>
                        <p className="text-sm text-slate-400 mt-2 text-center leading-relaxed">
                          Téléchargez votre fichier produits
                        </p>
                      </button>

                      <button 
                        onClick={() => {
                          if (isErpConnected) return;
                          setIsErpConnecting(true);
                          setImportType('erp');
                          setTimeout(() => {
                            setIsErpConnecting(false);
                            setIsErpConnected(true);
                            setToast({ message: "ERP connecté avec succès !", type: 'success' });
                            setTimeout(() => setToast(null), 3000);
                          }, 1500);
                        }}
                        className={`flex flex-col items-center justify-center p-10 border-2 rounded-[24px] transition-all group relative h-[320px] ${importType === 'erp' ? 'border-purple-500 bg-purple-50/30' : 'border-slate-100 bg-white hover:border-purple-200'}`}
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform ${importType === 'erp' ? 'bg-purple-50 text-purple-600' : 'bg-purple-50 text-purple-600 group-hover:scale-110'}`}>
                          {isErpConnecting ? (
                            <Loader2 className="w-10 h-10 animate-spin" />
                          ) : isErpConnected ? (
                            <Check className="w-10 h-10 text-emerald-500" />
                          ) : (
                            <Database className="w-10 h-10" />
                          )}
                        </div>
                        <p className="text-xl font-bold text-slate-800">
                          {isErpConnected ? "ERP Connecté" : "Connecter ERP"}
                        </p>
                        <p className="text-sm text-slate-400 mt-2 text-center leading-relaxed">
                          {isErpConnected ? "Synchronisation active" : "Synchronisez votre système"}
                        </p>
                        {isErpConnected && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* File List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-4 pt-4">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="bg-white p-6 rounded-[24px] border border-blue-100 flex items-center justify-between group shadow-sm">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <FileText className="w-7 h-7" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-800">{file.name}</p>
                                <p className="text-sm text-slate-400">{file.size} • Importé le {file.date}</p>
                                <div className="inline-flex items-center px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500 mt-1">
                                  {file.count} produits importés
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button className="p-3 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                                <Plus className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => removeFile(file.id)}
                                className="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Profile & Objectives */}
                <div className="col-span-12 lg:col-span-7 space-y-8">
                  {/* Profil de l'enseigne */}
                  <section className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Profil de l’enseigne</h3>
                      <p className="text-base text-slate-400 leading-relaxed">Remplissez les informations ci-dessous pour personnaliser votre expérience et optimiser la gestion de votre commerce.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">NOM DU MAGASIN</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Mode & Co" 
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all text-lg" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SECTEUR D’ACTIVITÉ</label>
                        <div className="relative">
                          <select 
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none appearance-none cursor-pointer pr-12 text-lg"
                          >
                            <option value="Sélectionnez">Sélectionnez</option>
                            <option value="prêt à porter">prêt à porter</option>
                            <option value="article enfants et bébé">article enfants et bébé</option>
                            <option value="vêtement de sport">vêtement de sport</option>
                            <option value="chaussures">chaussures</option>
                            <option value="sacs et maroquinerie">sacs et maroquinerie</option>
                            <option value="accessoires de mode">accessoires de mode</option>
                            <option value="mode et multimarque">mode et multimarque</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Définissez vos objectifs */}
                  <section className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-10">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Définissez vos objectifs</h3>
                      <p className="text-base text-slate-400">Ces informations personnaliseront vos prévisions</p>
                    </div>
                    
                    <div className="flex gap-4 flex-wrap">
                      {['Réduire les ruptures', 'Optimiser le sur-stockage', 'Impact Météo', 'Prévisions des ventes'].map((obj) => (
                        <button 
                          key={obj} 
                          onClick={() => {
                            setSelectedObjectives(prev => 
                              prev.includes(obj) ? prev.filter(o => o !== obj) : [...prev, obj]
                            );
                          }}
                          className={`px-8 py-4 rounded-xl text-base font-medium transition-all border ${selectedObjectives.includes(obj) ? 'bg-[#F0F7FF] border-[#BADAFF] text-[#1677FF]' : 'bg-[#F8F9FB] border-transparent text-slate-500 hover:border-slate-200'}`}
                        >
                          {obj}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                      {/* Objectif de ventes */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#1677FF]">
                          <TrendingUp className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Objectif de ventes (7 jours)</label>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-5 text-slate-400 font-medium text-lg">EX: €</span>
                          <input 
                            type="text" 
                            value={salesGoal}
                            onChange={(e) => handleNumericInput(e.target.value, setSalesGoal)}
                            placeholder="42850" 
                            className="w-full p-5 pl-20 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-300 transition-all text-lg font-medium" 
                          />
                        </div>
                        <p className="text-xs text-slate-400">CA souhaité pour la semaine prochaine</p>
                      </div>

                      {/* Taux de croissance */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-600">
                          <TrendingUp className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Taux de croissance cible</label>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={growthTarget}
                            onChange={(e) => handleNumericInput(e.target.value, setGrowthTarget)}
                            placeholder="14" 
                            className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-300 transition-all text-lg font-medium pr-12" 
                          />
                          <span className="absolute right-6 text-slate-400 font-bold text-lg">%</span>
                        </div>
                        <p className="text-xs text-slate-400">Croissance vs période précédente</p>
                      </div>

                      {/* Niveau de stock optimal */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-purple-600">
                          <Package className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Niveau de stock optimal</label>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={stockOptimal}
                            onChange={(e) => handleNumericInput(e.target.value, setStockOptimal)}
                            placeholder="57" 
                            className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-purple-300 transition-all text-lg font-medium" 
                          />
                        </div>
                        <p className="text-xs text-slate-400">Nombre de SKUs à maintenir en stock</p>
                      </div>

                      {/* Seuil d'alerte */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-500">
                          <AlertTriangle className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Seuil d’alerte stock faible</label>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={stockAlert}
                            onChange={(e) => handleNumericInput(e.target.value, setStockAlert)}
                            placeholder="12" 
                            className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-red-300 transition-all text-lg font-medium" 
                          />
                        </div>
                        <p className="text-xs text-slate-400">SKUs en dessous duquel être alerté</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>

            {/* Footer Bar */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 flex justify-end items-center z-50">
              <button 
                onClick={() => {
                  if (isReadyToStart) {
                    setStep(3); // Go to import review step
                  }
                }}
                disabled={!isReadyToStart}
                className={`px-12 py-5 rounded-xl font-bold text-lg transition-all ${isReadyToStart ? 'bg-[#1677FF] text-white hover:bg-blue-700 cursor-pointer shadow-lg shadow-blue-200' : 'bg-[#D1D5DB] text-slate-400 cursor-not-allowed opacity-60'}`}
              >
                Commencer l'import
              </button>
            </footer>
          </motion.div>
        )}

        {/* ÉTAPE 3 : RÉCAPITULATIF & IMPORTATION */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen flex flex-col bg-[#F8F9FB] transition-all duration-500 ${showSuccessPopup ? 'blur-md pointer-events-none' : ''}`}
          >
            <header className="bg-white border-b border-slate-100 px-12 py-6 flex justify-between items-center shrink-0">
              <Logo />
              <span className="text-xs text-slate-400 font-medium">Configuration initiale</span>
            </header>

            <main className="flex-1 overflow-y-auto p-12 pb-32">
              <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-12">
                
                {/* Left Column: Welcome & Data Import & File List */}
                <div className="col-span-12 lg:col-span-5 space-y-12">
                  <div className="space-y-4">
                    <h1 className="text-[44px] font-bold text-[#002C8C] leading-tight">Bienvenue sur Smart Retail</h1>
                    <p className="text-xl text-slate-500">Configurez votre système intelligent de prévision des ventes</p>
                  </div>

                  <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Ajoutez vos données</h3>
                      <p className="text-lg text-slate-400">Importez ou saisissez vos produits</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".csv" 
                        multiple
                        className="hidden" 
                      />
                      <button 
                        onClick={triggerFileInput}
                        className={`flex flex-col items-center justify-center p-10 border-2 rounded-[24px] transition-all group relative h-[320px] ${importType === 'csv' ? 'border-[#1677FF] bg-blue-50/30' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform ${importType === 'csv' ? 'bg-[#EBF6FF] text-[#1677FF]' : 'bg-blue-50 text-[#1677FF] group-hover:scale-110'}`}>
                          <Upload className="w-10 h-10" />
                        </div>
                        <p className="text-xl font-bold text-slate-800">Importer un CSV</p>
                        <p className="text-sm text-slate-400 mt-2 text-center leading-relaxed">
                          Téléchargez votre fichier produits
                        </p>
                      </button>

                      <button 
                        onClick={() => {
                          if (isErpConnected) return;
                          setIsErpConnecting(true);
                          setImportType('erp');
                          setTimeout(() => {
                            setIsErpConnecting(false);
                            setIsErpConnected(true);
                            setToast({ message: "ERP connecté avec succès !", type: 'success' });
                            setTimeout(() => setToast(null), 3000);
                          }, 1500);
                        }}
                        className={`flex flex-col items-center justify-center p-10 border-2 rounded-[24px] transition-all group relative h-[320px] ${importType === 'erp' ? 'border-purple-500 bg-purple-50/30' : 'border-slate-100 bg-white hover:border-purple-200'}`}
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform ${importType === 'erp' ? 'bg-purple-50 text-purple-600' : 'bg-purple-50 text-purple-600 group-hover:scale-110'}`}>
                          {isErpConnecting ? (
                            <Loader2 className="w-10 h-10 animate-spin" />
                          ) : isErpConnected ? (
                            <Check className="w-10 h-10 text-emerald-500" />
                          ) : (
                            <Database className="w-10 h-10" />
                          )}
                        </div>
                        <p className="text-xl font-bold text-slate-800">
                          {isErpConnected ? "ERP Connecté" : "Connecter ERP"}
                        </p>
                        <p className="text-sm text-slate-400 mt-2 text-center leading-relaxed">
                          {isErpConnected ? "Synchronisation active" : "Synchronisez votre système"}
                        </p>
                        {isErpConnected && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* File List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-4 pt-4">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="bg-[#F8FAFF] p-6 rounded-[24px] border border-blue-100 flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <FileText className="w-7 h-7" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-800">{file.name}</p>
                                <p className="text-sm text-slate-400">{file.size} • Importé le {file.date}</p>
                                <div className="inline-flex items-center px-3 py-1 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500 mt-1">
                                  {file.count} produits importés
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button className="p-3 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                                <Plus className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => removeFile(file.id)}
                                className="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Profile & Objectives */}
                <div className="col-span-12 lg:col-span-7 space-y-8">
                  {/* Profil de l'enseigne */}
                  <section className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Profil de l’enseigne</h3>
                      <p className="text-base text-slate-400 leading-relaxed">Remplissez les informations ci-dessous pour personnaliser votre expérience et optimiser la gestion de votre commerce.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">NOM DU MAGASIN</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Mode & Co" 
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all text-lg" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SECTEUR D’ACTIVITÉ</label>
                        <div className="relative">
                          <select 
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none appearance-none cursor-pointer pr-12 text-lg"
                          >
                            <option value="Sélectionnez">Sélectionnez</option>
                            <option value="prêt à porter">prêt à porter</option>
                            <option value="article enfants et bébé">article enfants et bébé</option>
                            <option value="vêtement de sport">vêtement de sport</option>
                            <option value="chaussures">chaussures</option>
                            <option value="sacs et maroquinerie">sacs et maroquinerie</option>
                            <option value="accessoires de mode">accessoires de mode</option>
                            <option value="mode et multimarque">mode et multimarque</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Définissez vos objectifs */}
                  <section className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-10">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Définissez vos objectifs</h3>
                      <p className="text-base text-slate-400">Ces informations personnaliseront vos prévisions</p>
                    </div>
                    
                    <div className="flex gap-4 flex-wrap">
                      {['Réduire les ruptures', 'Optimiser le sur-stockage', 'Impact Météo', 'Prévisions des ventes'].map((obj) => (
                        <button 
                          key={obj} 
                          onClick={() => {
                            setSelectedObjectives(prev => 
                              prev.includes(obj) ? prev.filter(o => o !== obj) : [...prev, obj]
                            );
                          }}
                          className={`px-8 py-4 rounded-xl text-base font-medium transition-all border ${selectedObjectives.includes(obj) ? 'bg-[#F0F7FF] border-[#BADAFF] text-[#1677FF]' : 'bg-[#F8F9FB] border-transparent text-slate-500 hover:border-slate-200'}`}
                        >
                          {obj}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                      {/* Objectif de ventes */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#1677FF]">
                          <TrendingUp className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Objectif de ventes (7 jours)</label>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-5 text-slate-400 font-medium text-lg">EX: €</span>
                          <input 
                            type="text" 
                            value={salesGoal}
                            onChange={(e) => handleNumericInput(e.target.value, setSalesGoal)}
                            placeholder="42850" 
                            className="w-full p-5 pl-20 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-300 transition-all text-lg font-medium" 
                          />
                        </div>
                        <p className="text-xs text-slate-400">CA souhaité pour la semaine prochaine</p>
                      </div>

                      {/* Taux de croissance */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-600">
                          <TrendingUp className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Taux de croissance cible</label>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={growthTarget}
                            onChange={(e) => handleNumericInput(e.target.value, setGrowthTarget)}
                            placeholder="14" 
                            className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-300 transition-all text-lg font-medium pr-12" 
                          />
                          <span className="absolute right-6 text-slate-400 font-bold text-lg">%</span>
                        </div>
                        <p className="text-xs text-slate-400">Croissance vs période précédente</p>
                      </div>

                      {/* Niveau de stock optimal */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-purple-600">
                          <Package className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Niveau de stock optimal</label>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={stockOptimal}
                            onChange={(e) => handleNumericInput(e.target.value, setStockOptimal)}
                            placeholder="57" 
                            className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-purple-300 transition-all text-lg font-medium" 
                          />
                        </div>
                        <p className="text-xs text-slate-400">Nombre de SKUs à maintenir en stock</p>
                      </div>

                      {/* Seuil d'alerte */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-500">
                          <AlertTriangle className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Seuil d’alerte stock faible</label>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={stockAlert}
                            onChange={(e) => handleNumericInput(e.target.value, setStockAlert)}
                            placeholder="12" 
                            className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-red-300 transition-all text-lg font-medium" 
                          />
                        </div>
                        <p className="text-xs text-slate-400">SKUs en dessous duquel être alerté</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>

            {/* Footer Bar */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 flex justify-end items-center z-50">
              <button 
                onClick={() => {
                  if (isFormValid) {
                    setStep(4); // Go to loading step
                  }
                }}
                disabled={!isFormValid}
                className={`px-12 py-5 rounded-xl font-bold text-lg transition-all ${isFormValid ? 'bg-[#1677FF] text-white hover:bg-blue-700 cursor-pointer shadow-lg shadow-blue-200' : 'bg-[#D1D5DB] text-slate-400 cursor-not-allowed opacity-60'}`}
              >
                Commencer l'import
              </button>
            </footer>
          </motion.div>
        )}

        {/* SUCCESS POPUP */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] p-16 max-w-2xl w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] relative z-10 flex flex-col items-center text-center space-y-10"
            >
              <div className="w-28 h-28 bg-[#00C853] rounded-full flex items-center justify-center text-white shadow-xl shadow-green-100">
                <Check className="w-14 h-14 stroke-[4]" />
              </div>
              <div className="space-y-4">
                <h2 className="text-[48px] font-bold text-slate-800 tracking-tight">Tout est prêt !</h2>
                <p className="text-2xl text-slate-500 leading-relaxed font-medium">
                  Votre plateforme Smart Retail est configurée
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowSuccessPopup(false);
                  setStep(7); // Go directly to dashboard
                }}
                className="w-full py-7 bg-[#1677FF] text-white rounded-[24px] font-bold text-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
              >
                Accéder à mon tableau de bord
              </button>
            </motion.div>
          </div>
        )}

        {/* ÉTAPE 4 : TÉLÉCHARGEMENT EN COURS (PAGE DE LA MAQUETTE) */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col bg-[#F8F9FB]"
          >
            <header className="bg-white border-b border-slate-100 px-12 py-6 flex justify-between items-center shrink-0">
              <Logo />
              <span className="text-xs text-slate-400 font-medium">Configuration initiale</span>
            </header>

            <main className="flex-1 overflow-y-auto p-12 pb-32">
              <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-12">
                
                {/* Left Column: Welcome & Data Import */}
                <div className="col-span-12 lg:col-span-5 space-y-12">
                  <div className="space-y-4">
                    <h1 className="text-[44px] font-bold text-[#002C8C] leading-tight">Bienvenue sur Smart Retail</h1>
                    <p className="text-xl text-slate-500">Configurez votre système intelligent de prévision des ventes</p>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800">Ajoutez vos données</h3>
                        <p className="text-lg text-slate-400">Importez ou saisissez vos produits</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col items-center justify-center p-10 border-2 rounded-[24px] transition-all border-[#1677FF] bg-blue-50/30 relative h-[320px]">
                          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[#EBF6FF] text-[#1677FF]">
                            <Upload className="w-10 h-10" />
                          </div>
                          <p className="text-xl font-bold text-slate-800">Importer un CSV</p>
                          <p className="text-sm text-slate-400 mt-2 text-center leading-relaxed">Téléchargez votre fichier produits</p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-10 border-2 rounded-[24px] transition-all border-slate-200 bg-white h-[320px]">
                          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-purple-50 text-purple-600">
                            <Database className="w-10 h-10" />
                          </div>
                          <p className="text-xl font-bold text-slate-800">Connecter ERP</p>
                          <p className="text-sm text-slate-400 mt-2 text-center leading-relaxed">Synchronisez votre système</p>
                        </div>
                      </div>
                    </div>

                    {/* File List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-4">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="bg-white p-6 rounded-[24px] border border-blue-100 flex items-center justify-between group shadow-sm">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <FileText className="w-7 h-7" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-lg font-bold text-slate-800">{file.name}</p>
                                <p className="text-sm text-slate-400">{file.size} • Importé le {file.date}</p>
                                <div className="inline-flex items-center px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500 mt-1">
                                  {file.count} produits importés
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button className="p-3 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                                <Plus className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => removeFile(file.id)}
                                className="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Profile & Objectives */}
                <div className="col-span-12 lg:col-span-7 space-y-8">
                  {/* Profil de l'enseigne */}
                  <section className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Profil de l’enseigne</h3>
                      <p className="text-base text-slate-400 leading-relaxed">Remplissez les informations ci-dessous pour personnaliser votre expérience et optimiser la gestion de votre commerce.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">NOM DU MAGASIN</label>
                        <div className="w-full p-5 bg-white border border-slate-200 rounded-xl text-lg text-slate-400">
                          {shopName}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SECTEUR D’ACTIVITÉ</label>
                        <div className="w-full p-5 bg-white border border-slate-200 rounded-xl text-lg text-slate-400 flex justify-between items-center">
                          {selectedSector}
                          <ChevronDown className="text-slate-400 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Définissez vos objectifs */}
                  <section className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-10">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">Définissez vos objectifs</h3>
                      <p className="text-base text-slate-400">Ces informations personnaliseront vos prévisions</p>
                    </div>
                    
                    <div className="flex gap-4 flex-wrap">
                      {['Réduire les ruptures', 'Optimiser le sur-stockage', 'Impact Météo', 'Prévisions des ventes'].map((obj) => (
                        <div 
                          key={obj} 
                          className={`px-8 py-4 rounded-xl text-base font-medium transition-all border ${selectedObjectives.includes(obj) ? 'bg-[#F0F7FF] border-[#BADAFF] text-[#1677FF]' : 'bg-[#F8F9FB] border-transparent text-slate-500'}`}
                        >
                          {obj}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                      {/* Objectif de ventes */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#1677FF]">
                          <TrendingUp className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Objectif de ventes (7 jours)</label>
                        </div>
                        <div className="w-full p-5 bg-white border border-slate-200 rounded-xl text-lg font-medium text-slate-400">
                          EX: € {salesGoal}
                        </div>
                        <p className="text-xs text-slate-400">CA souhaité pour la semaine prochaine</p>
                      </div>

                      {/* Taux de croissance */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-600">
                          <TrendingUp className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Taux de croissance cible</label>
                        </div>
                        <div className="w-full p-5 bg-white border border-slate-200 rounded-xl text-lg font-medium text-slate-400 flex justify-between items-center">
                          {growthTarget}
                          <span className="text-slate-400">%</span>
                        </div>
                        <p className="text-xs text-slate-400">Croissance vs période précédente</p>
                      </div>

                      {/* Niveau de stock optimal */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-purple-600">
                          <Package className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Niveau de stock optimal</label>
                        </div>
                        <div className="w-full p-5 bg-white border border-slate-200 rounded-xl text-lg font-medium text-slate-400">
                          {stockOptimal}
                        </div>
                        <p className="text-xs text-slate-400">Nombre de SKUs à maintenir en stock</p>
                      </div>

                      {/* Seuil d'alerte */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-500">
                          <AlertTriangle className="w-5 h-5" />
                          <label className="text-sm font-bold uppercase tracking-widest">Seuil d’alerte stock faible</label>
                        </div>
                        <div className="w-full p-5 bg-white border border-slate-200 rounded-xl text-lg font-medium text-slate-400">
                          {stockAlert}
                        </div>
                        <p className="text-xs text-slate-400">SKUs en dessous duquel être alerté</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>

            {/* Blue Progress Bar */}
            <div className="fixed bottom-8 left-12 right-12 z-[100]">
              <div className="h-20 bg-[#E3EFFF] rounded-[20px] relative overflow-hidden shadow-xl shadow-blue-100/50">
                {/* Progress Fill */}
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute inset-y-0 left-0 bg-[#1677FF] flex items-center px-10"
                >
                  <span className="text-white text-2xl font-bold tracking-wide whitespace-nowrap">Telecharger en cours...</span>
                </motion.div>
                {/* Static Text for when progress is low */}
                <div className="absolute inset-y-0 left-0 flex items-center px-10 pointer-events-none">
                  <span className="text-[#1677FF] text-2xl font-bold tracking-wide opacity-20">Telecharger en cours...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ÉTAPE 5 : ANALYSE EN COURS */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col bg-slate-50"
          >
            <header className="bg-white border-b border-slate-100 px-12 py-6 flex justify-between items-center">
              <Logo />
              <span className="text-xs text-slate-400 font-medium">Configuration initiale</span>
            </header>

            <main className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-4xl bg-white rounded-[40px] p-16 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center space-y-12">
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-400/30">
                      <Sparkles className="w-10 h-10" />
                    </div>
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-blue-200 rounded-full"
                  />
                </div>

                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-slate-900">Analyse en cours...</h2>
                  <p className="text-slate-500 text-lg">Notre intelligence artificielle traite vos données</p>
                </div>

                <div className="w-full max-w-md bg-[#F8FAFF] rounded-3xl p-6 space-y-4 border border-slate-100">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Données importées avec succès</p>
                      <p className="text-[11px] text-slate-400">Tous vos fichiers ont été transférés en toute sécurité</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border-blue-500 border-2 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Calibrage des modèles prédictifs</p>
                      <p className="text-[11px] text-slate-400">Analyse des patterns et création des prévisions</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm opacity-50">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Finalisation du tableau de bord</p>
                      <p className="text-[11px] text-slate-400">Préparation de votre interface personnalisée</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-sm text-blue-600 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traitement presque terminé...
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {/* ÉTAPE 6 : TOUT EST PRÊT */}
        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex flex-col bg-slate-50"
          >
            <header className="bg-white border-b border-slate-100 px-12 py-6 flex justify-between items-center">
              <Logo />
              <span className="text-xs text-slate-400 font-medium">Configuration initiale</span>
            </header>

            <main className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-4xl bg-white rounded-[40px] p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center space-y-12">
                <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-400/30"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                </div>

                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-slate-900">Tout est prêt !</h2>
                  <p className="text-slate-500 text-lg">Votre plateforme Smart Retail est configurée</p>
                </div>

                <div className="w-full max-w-md bg-[#F0FDF4] rounded-3xl p-6 border-2 border-[#4ADE80] flex justify-around items-center">
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Données</p>
                    <p className="text-xs font-bold text-slate-800">Importées</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Objectifs</p>
                    <p className="text-xs font-bold text-slate-800">Configurés</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">IA</p>
                    <p className="text-xs font-bold text-slate-800">Calibrée</p>
                  </div>
                </div>

                <div className="w-full max-w-md bg-[#F1F5F9] rounded-3xl p-8 space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Découvrez votre tableau de bord
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      KPIs en temps réel
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Prévisions 7 jours
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Alertes de stock
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Recommandations IA
                    </div>
                  </div>
                </div>

                <button 
                  onClick={nextStep}
                  className="w-full max-w-md py-5 bg-[#00358E] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-900 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
                >
                  Accéder à mon tableau de bord
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Votre système est opérationnel
                </div>
              </div>
            </main>
          </motion.div>
        )}
        {/* ÉTAPE 7 : DASHBOARD */}
        {step === 8 && (
          <motion.div 
            key="step8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-slate-50 flex flex-col"
          >
            {/* Header */}
            <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-12 shrink-0">
              <div className="flex items-center gap-6">
                  <img 
                    src="https://picsum.photos/seed/jacket/100/100" 
                    alt="Product" 
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Jimmy Veste en laine et toile de soie</h1>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs font-medium text-slate-400">SKU: 859163YCUA21000</span>
                      <span className="text-xs font-medium text-slate-400">Category: Summer 25 Veste</span>
                    </div>
                  </div>
                </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock Actuel</p>
                  <p className="text-xl font-bold text-slate-900">45 <span className="text-sm font-medium text-slate-400">unités</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ventes Moy. Hebdo</p>
                  <p className="text-xl font-bold text-slate-900">32 <span className="text-sm font-medium text-slate-400">unités/sem</span></p>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-12 flex flex-col">
              <div className="max-w-[1600px] w-full mx-auto grid grid-cols-2 gap-12 items-stretch flex-1">
                {/* Left Column */}
                <div className="space-y-8 flex flex-col">
                    {/* PRÉVISION IA */}
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden flex-1">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -mr-24 -mt-24 opacity-50" />
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3 text-blue-600">
                          <Sparkles className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-widest">PRÉVISION IA</span>
                        </div>
                        <div className="px-4 py-1.5 bg-emerald-50 text-emerald-500 rounded-xl text-[10px] font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Haute
                        </div>
                      </div>
                      <div className="space-y-2 relative z-10">
                        <h2 className="text-6xl font-bold text-slate-900">120</h2>
                        <p className="text-sm font-medium text-slate-400">Unités recommandées</p>
                      </div>
                      <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-50 relative z-10">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ventes prévues</p>
                          <p className="text-2xl font-bold text-slate-900">165</p>
                          <p className="text-[10px] font-bold text-emerald-500 mt-1">+28% vs moy</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Couverture</p>
                          <p className="text-2xl font-bold text-slate-900">7J</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">avec commande</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Risque</p>
                          <p className="text-2xl font-bold text-red-500">92%</p>
                          <p className="text-[10px] font-bold text-red-500 mt-1">Sans commande</p>
                        </div>
                      </div>
                    </div>

                    {/* Why We Recommend 120 Units */}
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                      <h3 className="text-xl font-bold text-slate-900">Why We Recommend 120 Units</h3>
                      <div className="space-y-6">
                        {[
                          { label: 'Base demand', value: '32 units', color: 'text-slate-600' },
                          { label: '+ Heatwave impact', value: '45 units', color: 'text-red-500' },
                          { label: '+ Fashion Week impact', value: '15 units', color: 'text-indigo-500' },
                          { label: '+ Safety buffer (20%)', value: '18 units', color: 'text-slate-600' },
                          { label: '- Current stock', value: '-10 units', color: 'text-red-500' },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0">
                            <span className="text-sm font-medium text-slate-500">{item.label}</span>
                            <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                          </div>
                        ))}
                        <div className="pt-4 flex justify-between items-center">
                          <span className="text-base font-bold text-slate-900">Total Order Needed</span>
                          <span className="text-2xl font-bold text-blue-600">120 units</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8 flex flex-col">
                    {/* PRÉVISION INITIALE */}
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10 flex-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-slate-400">
                          <LayoutDashboard className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-widest">PRÉVISION INITIALE</span>
                        </div>
                        <div className="px-4 py-1.5 bg-orange-50 text-orange-500 rounded-xl text-[10px] font-bold flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Moyenne
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-6xl font-bold text-slate-900">95</h2>
                        <p className="text-sm font-medium text-slate-400">Unités</p>
                      </div>
                      <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ventes prévues</p>
                          <p className="text-2xl font-bold text-slate-900">140</p>
                          <p className="text-[10px] font-bold text-emerald-500 mt-1">+14% vs moy</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Couverture</p>
                          <p className="text-2xl font-bold text-slate-900">5J</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">avec commande</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Risque</p>
                          <p className="text-2xl font-bold text-red-500">65%</p>
                          <p className="text-[10px] font-bold text-red-500 mt-1">Sans commande</p>
                        </div>
                      </div>
                    </div>

                    {/* Votre Décision Finale */}
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10 flex flex-col justify-between">
                      <div className="space-y-8">
                        <h3 className="text-xl font-bold text-slate-900">Votre Décision Finale</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-5xl font-bold text-blue-600">120</span>
                          <span className="text-sm font-medium text-slate-400">unités</span>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modifier les quantités</label>
                          <input 
                            type="text" 
                            defaultValue=""
                            placeholder=""
                            className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[24px] text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <p className="text-[10px] text-slate-400 font-medium italic">Modify the AI recommendation if needed</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setStep(9)}
                        className="w-full py-6 bg-blue-600 text-white rounded-[24px] font-bold text-base hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3"
                      >
                        Valider et repartir
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </motion.div>
          )}

        {step === 9 && (
          <motion.div 
            key="step9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-screen bg-slate-50"
          >
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 flex flex-col">
              <div className="p-8">
                <Logo />
              </div>
              <nav className="flex-1 px-4 space-y-2">
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', active: true },
                  { icon: TrendingUp, label: 'Forecasting Unit' },
                  { icon: Store, label: 'Store Allocation' },
                  { icon: Link2, label: 'Supplier Connect' },
                  { icon: CloudSun, label: 'Weather Hub' },
                  { icon: Database, label: 'External Data' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${
                      item.active 
                        ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-12">
                <div className="flex items-center gap-6">
                    <img 
                      src="https://picsum.photos/seed/jacket/100/100" 
                      alt="Product" 
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Boutique Distribution</h1>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs font-medium text-slate-400">SKU: 859163YCUA21000</span>
                        <span className="text-xs font-medium text-slate-400">Jimmy Veste en laine et toile de soie</span>
                      </div>
                    </div>
                  </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocation Total</p>
                  <p className="text-xl font-bold text-blue-600">120 <span className="text-sm font-medium text-slate-400">unités</span></p>
                </div>
              </header>

              <div className="flex-1 flex overflow-hidden">
                {/* Table Section */}
                <div className="flex-1 overflow-y-auto p-12 space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Recherche la boutique"
                          className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <button className="text-blue-600 border-b-2 border-blue-600 pb-1">Tout les boutiques</button>
                        <button className="hover:text-slate-600 transition-colors">Paris</button>
                        <button className="hover:text-slate-600 transition-colors">Lille</button>
                        <button className="hover:text-slate-600 transition-colors">Nice</button>
                        <button className="hover:text-slate-600 transition-colors">Lyon</button>
                        <button className="flex items-center gap-1 text-slate-300"><Plus className="w-3 h-3" /> Ajouter plus Tag</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                        <Filter className="w-4 h-4" />
                        Filter
                      </button>
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button className="p-2 bg-white rounded-lg shadow-sm"><Grid className="w-4 h-4 text-slate-900" /></button>
                        <button className="p-2"><List className="w-4 h-4 text-slate-400" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          <th className="text-left p-6">NOM DE LA BOUTIQUE</th>
                          <th className="text-left p-6">TYPE</th>
                          <th className="text-center p-6">VENTES MOY. HEBDO</th>
                          <th className="text-center p-6">TRAFIC QUOTIDIEN</th>
                          <th className="text-center p-6">PERFORMANCE</th>
                          <th className="text-center p-6">ALLOCATION %</th>
                          <th className="text-right p-6">UNITÉS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[
                          { name: 'Champs-Élysées Flagship', loc: 'Paris, FR', type: 'Flagship', sales: '€42,850', traffic: '1,240 pers.', perf: '+14%', alloc: '24%', units: '1,450', img: 'https://picsum.photos/seed/s1/50/50' },
                          { name: 'Lyon Part-Dieu', loc: 'Lyon, FR', type: 'Boutique', sales: '€42,850', traffic: '1,240 pers.', perf: '+14%', alloc: '24%', units: '1,450', img: 'https://picsum.photos/seed/s2/50/50' },
                          { name: 'Bordeaux Mérignac', loc: 'Bordeaux, FR', type: 'Outlet', sales: '12,850', traffic: '140 pers.', perf: '-2.4%', alloc: '24%', units: '480', img: 'https://picsum.photos/seed/s3/50/50' },
                          { name: 'Bordeaux Mérignac', loc: 'Bordeaux, FR', type: 'Flagship', sales: '12,850', traffic: '140 pers.', perf: '-2.4%', alloc: '24%', units: '1,210', img: 'https://picsum.photos/seed/s4/50/50' },
                          { name: 'Bordeaux Mérignac', loc: 'Bordeaux, FR', type: 'Flagship', sales: '12,850', traffic: '140 pers.', perf: '-2.4%', alloc: '24%', units: '1,210', img: 'https://picsum.photos/seed/s5/50/50' },
                          { name: 'Lyon Part-Dieu', loc: 'Lyon, FR', type: 'Boutique', sales: '€42,850', traffic: '1,240 pers.', perf: '+14%', alloc: '24%', units: '1,450', img: 'https://picsum.photos/seed/s6/50/50' },
                        ].map((store, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <img src={store.img} alt="store" className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{store.name}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{store.loc}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">{store.type}</span>
                            </td>
                            <td className="p-6 text-center text-sm font-medium text-slate-600">{store.sales}</td>
                            <td className="p-6 text-center text-sm font-medium text-slate-600">{store.traffic}</td>
                            <td className="p-6 text-center text-sm font-bold text-emerald-500">{store.perf}</td>
                            <td className="p-6 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600" style={{ width: store.alloc }} />
                                </div>
                                <input 
                                  type="text" 
                                  defaultValue=""
                                  placeholder={store.alloc}
                                  className="w-12 px-1 py-0.5 bg-slate-50 border border-slate-100 rounded text-center text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                />
                              </div>
                            </td>
                            <td className="p-6 text-right">
                              <input 
                                type="text" 
                                defaultValue=""
                                placeholder={store.units}
                                className="w-16 px-1 py-0.5 bg-slate-50 border border-slate-100 rounded text-right text-[10px] font-bold text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-medium text-slate-400">Page Total :</span>
                      <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:outline-none">
                        <option>6</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600"><ChevronDown className="w-4 h-4 rotate-90" /></button>
                      <button className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">1</button>
                      <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors">2</button>
                      <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors">3</button>
                      <span className="text-slate-300">...</span>
                      <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors">10</button>
                      <button className="p-2 text-slate-400 hover:text-slate-600"><ChevronDown className="w-4 h-4 -rotate-90" /></button>
                      <div className="flex items-center gap-2 ml-4">
                        <input type="text" defaultValue="" placeholder="10" className="w-10 h-8 text-center bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none" />
                        <span className="text-xs font-medium text-slate-400">/20 Page</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <aside className="w-96 bg-white border-l border-slate-100 p-10 space-y-12 overflow-y-auto">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">Finalisation et Export</h3>
                    <div className="space-y-4">
                      <button 
                        onClick={() => {
                          setStep(10);
                        }}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3"
                      >
                        <Send className="w-4 h-4" />
                        Envoyer vers l'ERP
                      </button>
                      <button 
                        onClick={() => setStep(11)}
                        className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                      >
                        <FileDown className="w-4 h-4" />
                        Exporter en CSV
                      </button>
                      <button 
                        onClick={() => setStep(12)}
                        className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                      >
                        <Mail className="w-4 h-4" />
                        Envoyer à l'email
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8 pt-8 border-t border-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Bilan prévisionnel</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-400">CA Prévu</p>
                        <p className="text-lg font-bold text-slate-900">€19,800</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-400">Marge Bénéficiaire</p>
                        <p className="text-lg font-bold text-emerald-500">+38%</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-400">Fiabilité Stock</p>
                        <p className="text-lg font-bold text-emerald-500">92%</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-400">Période de couverture</p>
                        <p className="text-lg font-bold text-slate-900">7 Jours</p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>
        )}
        {step === 7 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex bg-[#F8FAFC]"
          >
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
              <div className="p-6">
                <Logo />
              </div>
              <nav className="flex-1 px-4 space-y-1">
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', active: true },
                  { icon: TrendingUp, label: 'Forecasting Unit' },
                  { icon: Store, label: 'Store Allocation' },
                  { icon: Link2, label: 'Supplier Connect' },
                  { icon: CloudSun, label: 'Weather Hub' },
                  { icon: Database, label: 'External Data' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      item.active 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Top Bar */}
              <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-[#002C8C] hidden md:block">Système de Prévision des Ventes</h1>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="relative w-64 lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Recherche SKU"
                      className="w-full pl-11 pr-10 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                    <Maximize2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  
                  <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
                  
                  <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
                      <CircleHelp className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setShowNotifications(true)}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">2</span>
                    </button>
                    
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                      <img 
                        src="https://picsum.photos/seed/emily/100/100" 
                        alt="Emily" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex items-center gap-1 hidden lg:flex">
                        <p className="text-sm font-bold text-slate-900">Emily</p>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Dashboard Content */}
              <main className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: 'FORECAST SALES', value: '€42,850', sub: '+14% vs last period', badge: 'NEXT 7 DAYS', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50', tooltip: 'Ventes prévues pour les 7 prochains jours' },
                    { label: 'ALERTE STOCK FAIBLE', value: '12', sub: 'Urgent SKUs', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', tooltip: 'Articles nécessitant un réapprovisionnement immédiat' },
                    { label: 'SUR STOCKAGE', value: '57', sub: 'SKUs', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', tooltip: 'Articles avec un stock excédentaire' },
                    { label: 'IMPACT METEO', value: '+22%', sub: '+5% vs periode precedente', extra: 'CAT: VESTE', icon: CloudSun, color: 'text-yellow-500', bg: 'bg-yellow-50', tooltip: 'Influence des conditions météorologiques sur les ventes' },
                  ].map((card) => (
                    <AppTooltip key={card.label} text={card.tooltip}>
                      <button 
                        onClick={() => setToast({ message: `Détails pour ${card.label} consultés`, type: 'success' })}
                        className="w-full text-left bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden hover:border-blue-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                          <div className={`p-2 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                            <card.icon className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                            {card.badge && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded uppercase tracking-tighter">
                                {card.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            {card.extra && <p className="text-[9px] font-bold text-slate-900 uppercase tracking-tight">{card.extra}</p>}
                            <p className={`text-[10px] font-bold ${card.color}`}>{card.sub}</p>
                          </div>
                        </div>
                      </button>
                    </AppTooltip>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-8">
                  {/* Recommandation de reassort */}
                  <div className="col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                      <h3 className="text-lg font-bold text-slate-900">Recommandation de reassort</h3>
                    </div>
                    <div className="p-8">
                      <table className="w-full">
                        <thead>
                          <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="text-left pb-4">
                              <AppTooltip text="Image du produit">PRODUIT</AppTooltip>
                            </th>
                            <th className="text-left pb-4">
                              <AppTooltip text="Code unique du produit">SKU</AppTooltip>
                            </th>
                            <th className="text-center pb-4">
                              <AppTooltip text="Prévision de vente générée par l'IA">AI PREVISION</AppTooltip>
                            </th>
                            <th className="text-right pb-4">
                              <AppTooltip text="Actions disponibles">ACTION</AppTooltip>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {[
                            { img: 'https://picsum.photos/seed/p1/100/100', sku: '859163YCUA21000', prev: '+45%' },
                            { img: 'https://picsum.photos/seed/p2/100/100', sku: '859163YCUA21000', prev: '+45%' },
                            { img: 'https://picsum.photos/seed/p3/100/100', sku: '859163YCUA21000', prev: '+45%' },
                          ].map((row, i) => (
                            <tr 
                              key={i} 
                              className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                              onClick={() => setStep(8)}
                            >
                              <td className="py-4">
                                <img src={row.img} alt="product" className="w-12 h-12 rounded-xl object-cover border border-slate-100" referrerPolicy="no-referrer" />
                              </td>
                              <td className="py-4 text-sm font-medium text-slate-500">{row.sku}</td>
                              <td className="py-4 text-center text-sm font-bold text-emerald-500">{row.prev}</td>
                              <td className="py-4 text-right">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setStep(8);
                                  }}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                                >
                                  Analyser
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                        Voir plus de produits
                      </button>
                    </div>
                  </div>

                  {/* Chiffre d'affaire Global */}
                  <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-900">Chiffre d'affaire Global</h3>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-8">
                        <div className="relative">
                          <button 
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                            {selectedDate}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {showCalendar && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 mt-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 w-64"
                              >
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                    <span className="text-xs font-bold text-slate-900">Janvier 2026</span>
                                    <div className="flex gap-1">
                                      <button className="p-1 hover:bg-slate-50 rounded transition-colors"><ChevronDown className="w-3 h-3 rotate-90" /></button>
                                      <button className="p-1 hover:bg-slate-50 rounded transition-colors"><ChevronDown className="w-3 h-3 -rotate-90" /></button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-7 gap-1 text-center">
                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                                      <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>
                                    ))}
                                    {Array.from({ length: 31 }).map((_, i) => (
                                      <button 
                                        key={i}
                                        onClick={() => {
                                          const day = i + 1;
                                          setSelectedDate(`${day}, JAN 2026 - ${day + 6}, JAN 2026`);
                                          setShowCalendar(false);
                                          setToast({ message: `Période mise à jour : ${day} JAN - ${day + 6} JAN`, type: 'success' });
                                        }}
                                        className={`text-[10px] font-medium p-1.5 rounded-lg transition-colors ${i + 1 >= 1 && i + 1 <= 7 ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'}`}
                                      >
                                        {i + 1}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="pt-2 border-t border-slate-50">
                                    <button 
                                      onClick={() => {
                                        setSelectedDate("1, JAN 2026 - 7, JAN 2026");
                                        setShowCalendar(false);
                                      }}
                                      className="w-full py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                      Aujourd'hui
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                          <button 
                            onClick={() => setDateRange('7')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${dateRange === '7' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            7 Jour
                          </button>
                          <button 
                            onClick={() => setDateRange('30')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${dateRange === '30' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            30 Jour
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#94A3B8' }}
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#94A3B8' }}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="n" stroke="#3B82F6" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="n1" stroke="#818CF8" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-1 bg-blue-600 rounded-full" />
                          <span className="text-[10px] font-bold text-slate-400">N</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-1 bg-indigo-400 rounded-full" />
                          <span className="text-[10px] font-bold text-slate-400">N-1</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-1 bg-emerald-500 rounded-full border-t-2 border-dashed border-white" />
                          <span className="text-[10px] font-bold text-slate-400">FORECAST</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  {/* Données Historiques de Référence */}
                  <div className="col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                      <h3 className="text-lg font-bold text-slate-900">Données Historiques de Référence</h3>
                    </div>
                    <div className="p-8">
                      <table className="w-full">
                        <thead>
                          <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="text-left pb-4">
                              <AppTooltip text="Période de référence">DATE</AppTooltip>
                            </th>
                            <th className="text-center pb-4">
                              <AppTooltip text="Prévisions faites initialement">PREVISIONS INITIALES</AppTooltip>
                            </th>
                            <th className="text-center pb-4">
                              <AppTooltip text="Ventes réellement effectuées">VENTES REALISÉES</AppTooltip>
                            </th>
                            <th className="text-center pb-4">
                              <AppTooltip text="Différence entre prévision et réalité">ÉCART DE PRÉCISION</AppTooltip>
                            </th>
                            <th className="text-right pb-4">
                              <AppTooltip text="Performance de l'IA">ECART IA</AppTooltip>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {[
                            { date: 'Juil 2025', prev: '165 unités', real: '159 unités', diff: '162 unités', ia: 'IA (-3)' },
                            { date: 'Juil 2025', prev: '165 unités', real: '140 unités', diff: '162 unités', ia: 'IA (-3)' },
                            { date: 'Juil 2025', prev: '165 unités', real: '140 unités', diff: '162 unités', ia: 'IA (-3)' },
                          ].map((row, i) => (
                            <tr 
                              key={i}
                              className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                              onClick={() => setToast({ message: `Détails pour ${row.date} consultés`, type: 'success' })}
                            >
                              <td className="py-6 text-sm font-bold text-slate-900">{row.date}</td>
                              <td className="py-6 text-center text-sm font-medium text-slate-500">{row.prev}</td>
                              <td className="py-6 text-center text-sm font-medium text-slate-500">{row.real}</td>
                              <td className="py-6 text-center text-sm font-medium text-slate-500">{row.diff}</td>
                              <td className="py-6 text-right text-sm font-bold text-blue-600">{row.ia}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                        Voir plus detail
                      </button>
                    </div>
                  </div>

                  {/* SKU en rupture */}
                  <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-900">SKU en rupture</h3>
                      <span className="text-xs font-bold text-red-500">12 Indisponible</span>
                    </div>
                    <div className="p-8 space-y-6">
                      {[
                        { img: 'https://picsum.photos/seed/s1/100/100', name: 'Linen Summer...', stock: 'Reste 3 unités', status: 'bg-yellow-400', sales: '12/wk' },
                        { img: 'https://picsum.photos/seed/s2/100/100', name: 'Veste en cuir', stock: 'Reste 3 unités', status: 'bg-red-500', sales: '5/wk' },
                        { img: 'https://picsum.photos/seed/s3/100/100', name: 'Leather Boots', stock: 'Reste 3 unités', status: 'bg-yellow-400', sales: '4/wk' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <img src={item.img} alt="sku" className="w-14 h-14 rounded-2xl object-cover border border-slate-100" referrerPolicy="no-referrer" />
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{item.stock}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className={`w-3 h-3 rounded-full ${item.status} shadow-sm`} />
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-900">{item.sales}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">AVG SALES</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button className="w-full mt-4 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                        Voir plus de produits
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>

            {/* Notifications Sidebar Overlay */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                  />
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-2xl z-50 flex flex-col"
                  >
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                          <div className="w-1 h-8 bg-blue-600 rounded-full" />
                          Notifications
                        </h2>
                        <p className="text-sm text-slate-400 font-medium mt-1">2 unread messages</p>
                      </div>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <X className="w-6 h-6 text-slate-400" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {[
                        { 
                          title: 'Alerte de stock critique', 
                          desc: 'Jimmy Veste en laine et toile de soie (859163YCUA21000) est en rupture de stock dans le....', 
                          time: '5 min ago', 
                          icon: AlertCircle, 
                          color: 'text-red-500', 
                          bg: 'bg-red-50',
                          unread: true,
                          action: () => {
                            setStep(8);
                            setShowNotifications(false);
                          }
                        },
                        { 
                          title: 'Impact météo détecté', 
                          desc: 'Températures élevées prévues. La catégorie Lin d\'été devrait bondir de +22 %.', 
                          time: '15 min ago', 
                          icon: AlertCircle, 
                          color: 'text-red-500', 
                          bg: 'bg-red-50',
                          unread: true
                        },
                        { 
                          title: 'Transmission ERP Confirmée', 
                          desc: 'La commande n°MF-2025-091 a été transmise avec succès à l\'ERP', 
                          time: '1 hour ago', 
                          icon: CheckCircle2, 
                          color: 'text-emerald-500', 
                          bg: 'bg-emerald-50'
                        },
                        { 
                          title: 'Début de la Fashion Week de Paris', 
                          desc: 'Événement détecté : Préparez-vous à une hausse de la demande pour les collections de créateurs.', 
                          time: '1 hour ago', 
                          icon: Package, 
                          color: 'text-blue-500', 
                          bg: 'bg-blue-50'
                        },
                      ].map((notif, i) => (
                        <div 
                          key={i} 
                          onClick={() => notif.action?.()}
                          className="p-6 rounded-3xl hover:bg-slate-50 transition-colors relative group cursor-pointer"
                        >
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${notif.bg} ${notif.color} flex items-center justify-center flex-shrink-0`}>
                              <notif.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                                {notif.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />}
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{notif.desc}</p>
                              <p className="text-[10px] text-slate-400 font-medium pt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-8 border-t border-slate-100">
                      <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        Tout marquer comme lu
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 10 && (
          <motion.div
            key="step10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex items-center justify-center bg-slate-50 p-6"
          >
            <div className="max-w-2xl w-full bg-white rounded-[48px] shadow-2xl shadow-blue-100/50 p-12 text-center space-y-10 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center relative">
                  <FileText className="w-14 h-14 text-blue-600" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-900">Synchronisation Réussie</h2>
                <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                  Vos prévisions ont été injectées dans <span className="text-blue-600 font-bold">ERP Central</span>. Les stocks seront mis à jour dans <span className="font-bold text-slate-900">5 minutes</span>.
                </p>
              </div>

              <div className="bg-slate-50 rounded-[32px] p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Référence Flux</p>
                  <p className="text-sm font-bold text-slate-900">ERP-SYNC-2026-0042</p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Actif
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Articles Impactés</p>
                  <p className="text-lg font-bold text-slate-900">1,240 SKUs</p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entrepôt Cible</p>
                  <p className="text-lg font-bold text-slate-900">Logistique Nord</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setStep(7)}
                  className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Retour au Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                  Ouvrir ERP
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 11 && (
          <motion.div
            key="step11"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex items-center justify-center bg-slate-50 p-6"
          >
            <div className="max-w-2xl w-full bg-white rounded-[48px] shadow-2xl shadow-blue-100/50 p-12 text-center space-y-10 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center relative">
                  <FileText className="w-14 h-14 text-blue-600" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-900">Export CSV Réussi</h2>
                <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                  Votre fichier <span className="text-blue-600 font-bold">boutique_distribution.csv</span> est prêt et a été téléchargé.
                </p>
              </div>

              <div className="bg-slate-50 rounded-[32px] p-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FORMAT</p>
                  <p className="text-sm font-bold text-slate-900">CSV (UTF-8)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TAILLE</p>
                  <p className="text-sm font-bold text-slate-900">1.2 MB</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LIGNES</p>
                  <p className="text-sm font-bold text-slate-900">1,240</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setStep(9)}
                  className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Retour à la liste
                </button>
                <button 
                  onClick={() => setStep(7)}
                  className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Tableau de bord
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 12 && (
          <motion.div
            key="step12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex items-center justify-center bg-slate-50 p-6"
          >
            <div className="max-w-2xl w-full bg-white rounded-[48px] shadow-2xl shadow-blue-100/50 p-12 text-center space-y-10 relative overflow-hidden">
              {/* Background Decoration - Ghosted Envelope */}
              <div className="absolute top-12 right-12 opacity-[0.03] rotate-12 pointer-events-none">
                <Mail className="w-64 h-64 text-slate-900" />
              </div>
              
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center relative">
                  <Send className="w-14 h-14 text-blue-600 -rotate-12 translate-x-1" />
                  <div className="absolute -top-1 -right-1 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
              </div>

              <div className="space-y-4 relative z-10">
                <h2 className="text-4xl font-bold text-slate-900">E-mail envoyé !</h2>
                <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                  Le rapport détaillé des prévisions a été envoyé à l'adresse :<br />
                  <span className="text-slate-900 font-bold">yeddazhang.fr@gmail.com</span>
                </p>
              </div>

              <div className="bg-slate-50 rounded-[32px] p-6 flex items-center gap-5 border border-slate-100 max-w-md mx-auto relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 flex-shrink-0">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">Rapport_Previsions_2026.pdf</p>
                  <p className="text-xs text-slate-400">Pièce jointe • 2.4 MB</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4 relative z-10">
                <button 
                  onClick={() => setStep(7)}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Retour au Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setStep(9)}
                  className="w-full py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Envoyer à une autre adresse
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl z-[200] flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-bold">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-4 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
