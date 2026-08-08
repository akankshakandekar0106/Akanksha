import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  MapPin,
  Bot,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Compass,
  Layers,
  Sun,
  Moon,
} from 'lucide-react';

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi' | 'mr';
  onNavigateTab: (tab: string) => void;
  onOpenAi: () => void;
}

interface TourStep {
  id: string;
  targetId: string;
  tabToOpen?: string;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  descEn: string;
  descHi: string;
  descMr: string;
  badge: string;
  icon: React.ElementType;
  iconBg: string;
  actionTipEn?: string;
  actionTipHi?: string;
  actionTipMr?: string;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateTab,
  onOpenAi,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: TourStep[] = [
    {
      id: 'welcome',
      targetId: 'tour-welcome',
      tabToOpen: 'home',
      titleEn: 'Welcome to Kumbh Sarthi 2026',
      titleHi: 'कुंभ सारथी 2026 में आपका स्वागत है',
      titleMr: 'कुंभ सारथी २०२६ मध्ये आपले स्वागत आहे',
      descEn:
        'Your AI-powered pilgrim assistant & smart crowd management platform for Nashik Kumbh Mela. Designed for real-time safety, IoT telemetry, and seamless pilgrimage guidance.',
      descHi:
        'नासिक कुंभ मेले के लिए आपका AI-संचालित तीर्थयात्री सहायक और स्मार्ट भीड़ प्रबंधन मंच। वास्तविक समय की सुरक्षा, IoT सेंसर और सहज मार्गदर्शन के लिए बनाया गया।',
      descMr:
        'नाशिक कुंभमेळ्यासाठी तुमचे AI-संचालित यात्रेकरू सहाय्यक आणि स्मार्ट गर्दी व्यवस्थापन प्लॅटफॉर्म.',
      badge: 'Step 1 of 5 • Introduction',
      icon: Compass,
      iconBg: 'bg-orange-500 text-slate-950',
      actionTipEn: '💡 Tip: You can switch between English, Hindi, and Marathi at any time!',
      actionTipHi: '💡 सुझाव: आप किसी भी समय अंग्रेजी, हिंदी और मराठी के बीच स्विच कर सकते हैं!',
      actionTipMr: '💡 टीप: तुम्ही कोणत्याही वेळी इंग्रजी, हिंदी आणि मराठीमध्ये भाषा बदलू शकता!',
    },
    {
      id: 'sos',
      targetId: 'tour-sos-button',
      tabToOpen: 'sos',
      titleEn: 'Emergency SOS & Dispatch',
      titleHi: 'आपातकालीन एसओएस और त्वरित सहायता',
      titleMr: 'आणीबाणी SOS आणि जलद मदत',
      descEn:
        'One-tap Emergency SOS dispatch! Instantly share your live GPS coordinates with 24x7 control rooms, trigger police/medical assistance, and track nearby ambulance teams.',
      descHi:
        'एक क्लिक में आपातकालीन SOS संदेश भेजें! 24x7 नियंत्रण कक्षों के साथ अपना स्थान साझा करें और एम्बुलेंस व पुलिस सहायता प्राप्त करें।',
      descMr:
        'एक क्लिकवर आणीबाणी SOS पाठवा! २४x७ नियंत्रण कक्षांशी संपर्क साधा आणि रुग्णवाहिका व पोलिस मदत मिळवा.',
      badge: 'Step 2 of 5 • Safety First',
      icon: ShieldAlert,
      iconBg: 'bg-red-600 text-white',
      actionTipEn: '🚨 Emergency Hotline: Call 112 or 108 anytime for direct dispatch.',
      actionTipHi: '🚨 आपातकालीन हेल्पलाइन: प्रत्यक्ष सहायता के लिए 112 या 108 पर कॉल करें।',
      actionTipMr: '🚨 आणीबाणी हेल्पलाइन: थेट मदतीसाठी ११२ किंवा १०८ वर कॉल करा.',
    },
    {
      id: 'map',
      targetId: 'tour-live-map',
      tabToOpen: 'map',
      titleEn: 'Real-Time Live Crowd Map',
      titleHi: 'लाइव भीड़ प्रबंधन और नक्शा',
      titleMr: 'थेट गर्दी नकाशा आणि स्थिती',
      descEn:
        'Monitor live crowd density across Ramkund, Panchavati, Tapovan & Ghats. Color-coded risk indicators (Green/Yellow/Orange/Red) derived from ESP32 IoT camera-sensors.',
      descHi:
        'रामकुंड, पंचवटी और घाटों पर लाइव भीड़ का स्तर देखें। ESP32 IoT सेंसर द्वारा हरे, पीले, नारंगी और लाल रंग से भीड़ घनत्व दर्शाया गया है।',
      descMr:
        'रामकुंड, पंचवटी आणि घाटांवरील थेट गर्दीचे प्रमाण पहा. ESP32 IoT सेन्सर्सद्वारे थेट अपडेट्स.',
      badge: 'Step 3 of 5 • Crowd Intelligence',
      icon: MapPin,
      iconBg: 'bg-amber-500 text-slate-950',
      actionTipEn: '📍 Tap any Ghat location to view facilities or generate low-crowd safe routes!',
      actionTipHi: '📍 सुविधाएं देखने या सुरक्षित मार्ग खोजने के लिए किसी भी घाट पर क्लिक करें!',
      actionTipMr: '📍 सुविधा पाहण्यासाठी किंवा सुरक्षित मार्ग शोधण्यासाठी कोणत्याही घाटावर क्लिक करा!',
    },
    {
      id: 'ai',
      targetId: 'tour-ai-assistant',
      tabToOpen: 'home',
      titleEn: 'AI Sarthi Pilgrim Assistant',
      titleHi: 'AI सारथी तीर्थयात्री सहायक',
      titleMr: 'AI सारथी यात्रेकरू सहाय्यक',
      descEn:
        'Ask anything in natural voice or text! Get instant advice on Shahi Snan dates, auspicious Mahurat times, nearest free Food/Water hubs, and clean toilet locations.',
      descHi:
        'शाही स्नान की तारीखें, शुभ मुहूर्त, मुफ्त भोजन/पानी के केंद्र और निकटतम शौचालय के बारे में प्रश्न पूछें। AI तुरंत उत्तर देता है।',
      descMr:
        'शाही स्नानच्या वेळा, मोफत अन्न/पाणी केंद्रे आणि स्वच्छतागृहांची माहिती सहज मिळवा.',
      badge: 'Step 4 of 5 • Smart AI Help',
      icon: Bot,
      iconBg: 'bg-emerald-500 text-slate-950',
      actionTipEn: '🤖 Supports English, Hindi & Marathi natural language queries!',
      actionTipHi: '🤖 अंग्रेजी, हिंदी और मराठी भाषाओं में सहज प्रश्न पूछें!',
      actionTipMr: '🤖 इंग्रजी, हिंदी आणि मराठी भाषेमध्ये प्रश्न विचारा!',
    },
    {
      id: 'roles_theme',
      targetId: 'tour-roles-theme',
      tabToOpen: 'home',
      titleEn: 'Multi-Role Access & Light/Dark Theme',
      titleHi: 'भूमिकाएं और लाइट/डार्क थीम',
      titleMr: 'भूमिका आणि लाइट/डार्क थीम',
      descEn:
        'Switch roles between Pilgrim, Police Officer, Medical Responder, Volunteer, and Admin to unlock control panels. Toggle between Dark & Light themes for daytime visibility.',
      descHi:
        'तीर्थयात्री, पुलिस, डॉक्टर, स्वयंसेवक और व्यवस्थापक भूमिकाओं के बीच स्विच करें। दिन में स्पष्टता के लिए लाइट थीम का प्रयोग करें।',
      descMr:
        'यात्रेकरू, पोलिस, वैद्यकीय, स्वयंसेवक आणि प्रशासक भूमिका बदला. सोयीनुसार लाइट किंवा डार्क थीम वापरा.',
      badge: 'Step 5 of 5 • Control & Theme',
      icon: UserCheck,
      iconBg: 'bg-purple-600 text-white',
      actionTipEn: '☀️ Click the Sun/Moon icon in the header to switch to Light or Dark mode anytime!',
      actionTipHi: '☀️ किसी भी समय लाइट या डार्क मोड के लिए हेडर में सूर्य/चंद्रमा आइकन पर क्लिक करें!',
      actionTipMr: '☀️ कोणत्याही वेळी लाइट किंवा डार्क मोडसाठी हेडरवरील सूर्य/चंद्रमा आयकॉनवर क्लिक करा!',
    },
  ];

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (isOpen && currentStep.tabToOpen) {
      onNavigateTab(currentStep.tabToOpen);
    }
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('kumbh_tour_completed', 'true');
    onClose();
  };

  const StepIcon = currentStep.icon;

  const getTitle = () => {
    if (language === 'hi') return currentStep.titleHi;
    if (language === 'mr') return currentStep.titleMr;
    return currentStep.titleEn;
  };

  const getDesc = () => {
    if (language === 'hi') return currentStep.descHi;
    if (language === 'mr') return currentStep.descMr;
    return currentStep.descEn;
  };

  const getTip = () => {
    if (language === 'hi') return currentStep.actionTipHi;
    if (language === 'mr') return currentStep.actionTipMr;
    return currentStep.actionTipEn;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Tour Card Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-orange-500/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col transform transition-all scale-100">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl shadow-md ${currentStep.iconBg}`}>
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-950/40 px-2 py-0.5 rounded text-amber-200 border border-amber-300/30">
                {currentStep.badge}
              </span>
              <h2 className="text-lg font-extrabold font-serif leading-tight mt-0.5">
                {getTitle()}
              </h2>
            </div>
          </div>
          <button
            onClick={handleComplete}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-black/20 transition"
            title="Close / Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {getDesc()}
          </p>

          {/* Action Tip Banner */}
          {getTip() && (
            <div className="bg-slate-800/90 border-l-4 border-amber-400 p-3 rounded-r-xl text-xs text-amber-200 font-medium leading-relaxed">
              {getTip()}
            </div>
          )}

          {/* Quick Actions trigger inside step 4 */}
          {currentStep.id === 'ai' && (
            <div className="pt-1">
              <button
                onClick={() => {
                  onOpenAi();
                  handleNext();
                }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg text-xs transition"
              >
                <Bot className="w-4 h-4" />
                <span>Test AI Assistant Now</span>
              </button>
            </div>
          )}

          {/* Step Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Progress</span>
              <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Dots */}
          <div className="flex items-center justify-center space-x-2 pt-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-8 bg-orange-500'
                    : idx < currentStepIndex
                    ? 'w-2.5 bg-amber-400/80'
                    : 'w-2.5 bg-slate-700'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-950/90 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleComplete}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium transition"
          >
            Skip Tour
          </button>

          <div className="flex items-center space-x-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold px-5 py-2 rounded-xl text-xs shadow-lg transition"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              {currentStepIndex === steps.length - 1 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
