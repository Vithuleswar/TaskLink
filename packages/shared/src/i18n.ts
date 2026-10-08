// TaskLink i18n — All 22 Scheduled Indian Languages + English (R38)
// source: 'seed' — bundles committed so app works offline; refresh via Bhashini API when keys exist.

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  hasAsr: boolean;
  hasNmt: boolean;
  hasTts: boolean;
}

export const BHASHINI_SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en',  name: 'English',   nativeName: 'English',          hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'hi',  name: 'Hindi',     nativeName: 'हिन्दी',              hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'ta',  name: 'Tamil',     nativeName: 'தமிழ்',             hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'te',  name: 'Telugu',    nativeName: 'తెలుగు',            hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'kn',  name: 'Kannada',   nativeName: 'ಕನ್ನಡ',             hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'ml',  name: 'Malayalam', nativeName: 'മലയാളം',           hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'bn',  name: 'Bengali',   nativeName: 'বাংলা',             hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'mr',  name: 'Marathi',   nativeName: 'मराठी',              hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'gu',  name: 'Gujarati',  nativeName: 'ગુજરાતી',           hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'pa',  name: 'Punjabi',   nativeName: 'ਪੰਜਾਬੀ',            hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'or',  name: 'Odia',      nativeName: 'ଓଡ଼ିଆ',             hasAsr: true,  hasNmt: true,  hasTts: true  },
  { code: 'as',  name: 'Assamese',  nativeName: 'অসমীয়া',            hasAsr: true,  hasNmt: true,  hasTts: true  },
  // 10 remaining scheduled languages (R38)
  { code: 'ur',  name: 'Urdu',      nativeName: 'اُردُو',             hasAsr: true,  hasNmt: true,  hasTts: false }, // RTL Perso-Arabic
  { code: 'ks',  name: 'Kashmiri',  nativeName: 'کٲشُر',            hasAsr: false, hasNmt: true,  hasTts: false }, // RTL Perso-Arabic
  { code: 'sd',  name: 'Sindhi',    nativeName: 'سنڌي',              hasAsr: false, hasNmt: true,  hasTts: false }, // RTL Perso-Arabic
  { code: 'ne',  name: 'Nepali',    nativeName: 'नेपाली',             hasAsr: true,  hasNmt: true,  hasTts: false },
  { code: 'mai', name: 'Maithili',  nativeName: 'मैथिली',             hasAsr: false, hasNmt: true,  hasTts: false },
  { code: 'sa',  name: 'Sanskrit',  nativeName: 'संस्कृतम्',          hasAsr: false, hasNmt: true,  hasTts: false },
  { code: 'doi', name: 'Dogri',     nativeName: 'डोगरी',              hasAsr: false, hasNmt: true,  hasTts: false },
  { code: 'gom', name: 'Konkani',   nativeName: 'कोंकणी',             hasAsr: false, hasNmt: true,  hasTts: false },
  { code: 'sat', name: 'Santali',   nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',          hasAsr: false, hasNmt: true,  hasTts: false }, // Ol Chiki script
  { code: 'mni', name: 'Manipuri',  nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ',          hasAsr: false, hasNmt: true,  hasTts: false }, // Meetei Mayek script
  { code: 'brx', name: 'Bodo',      nativeName: 'बड़ो',               hasAsr: false, hasNmt: true,  hasTts: false },
];

/** Perso-Arabic RTL languages — UI must apply dir="rtl" */
export const RTL_LANGUAGE_CODES = ['ur', 'ks', 'sd'];

/** Languages requiring special Noto font override */
export const SPECIAL_SCRIPT_LANGUAGES: Record<string, string> = {
  sat: 'Noto Sans Ol Chiki',
  mni: 'Noto Sans Meetei Mayek',
  ur:  'Noto Nastaliq Urdu',
  ks:  'Noto Nastaliq Urdu',
  sd:  'Noto Nastaliq Urdu',
};

// ---------------------------------------------------------------------------
// I18N_DICTIONARY — seed bundles for offline-first operation (R38)
// All 23 locales (22 scheduled + English). Missing keys fall back to English.
// ---------------------------------------------------------------------------
export const I18N_DICTIONARY: Record<string, Record<string, string>> = {

  en: {
    app_title: 'TaskLink',
    app_tagline: 'Cooperative Gig-Services at 0% Commission',
    zero_commission_badge: '0% Platform Fee - 100% to Worker',
    search_placeholder: 'Search electrician, plumber, painter...',
    filter_service: 'Service',
    filter_rating: 'Min Rating',
    filter_distance: 'Distance',
    filter_language: 'Language',
    filter_available_now: 'Available Now',
    filter_crews_only: 'Crews / Groups Only',
    map_view: 'Map View',
    list_view: 'List View',
    book_now: 'Book Worker',
    pre_book_only: 'Pre-book only (Voice/Keypad)',
    verified_society: 'Verified Cooperative Member',
    digipin_label: 'DIGIPIN (Digital Postal Code)',
    digipin_placeholder: 'e.g. 78C-K2M-9Q2F',
    why_this_worker: 'Why this worker? (6-Factor Score)',
    night_premium_banner: 'Night window active (+25% premium directly to worker)',
    holiday_premium_banner: 'Cooperative holiday (+50% premium directly to worker)',
    emergency_premium_banner: 'Emergency booking (+30% premium directly to worker)',
    how_tasklink_funded: 'How TaskLink is funded: Flat Cooperative Subscription',
    sahakar_tagline: 'Sahakar se Samriddhi',
    rural_tagline: 'Rural Development, Urban Betterment',
  },

  hi: {
    app_title: 'टास्कलिंक',
    app_tagline: 'सहकारी मंच - 0% कमीशन पर काम',
    zero_commission_badge: '0% प्लेटफॉर्म शुल्क - 100% कमाई श्रमिक की',
    search_placeholder: 'इलेक्ट्रीशियन, प्लंबर, बढ़ई खोजें...',
    filter_service: 'सेवा',
    filter_rating: 'न्यूनतम रेटिंग',
    filter_distance: 'दूरी',
    filter_language: 'भाषा',
    filter_available_now: 'अभी उपलब्ध',
    filter_crews_only: 'केवल श्रमिक दल (समूह)',
    map_view: 'नक्शा देखें',
    list_view: 'सूची देखें',
    book_now: 'श्रमिक बुक करें',
    pre_book_only: 'केवल पूर्व-बुकिंग (कीपैड फोन)',
    verified_society: 'सत्यापित सहकारी सदस्य',
    digipin_label: 'डिजिपिन (डिजिटल पिनकोड)',
    digipin_placeholder: 'उदा. 78C-K2M-9Q2F',
    why_this_worker: 'यह श्रमिक क्यों? (6-कारक स्कोर)',
    night_premium_banner: 'रात्रिकालीन प्रीमियम (+25% अतिरिक्त श्रमिक को)',
    holiday_premium_banner: 'शासकीय अवकाश (+50% अतिरिक्त श्रमिक को)',
    emergency_premium_banner: 'आपातकालीन बुकिंग (+30% अतिरिक्त श्रमिक को)',
    how_tasklink_funded: 'टास्कलिंक कैसे संचालित है: फ्लैट सहकारी सदस्यता',
    sahakar_tagline: 'सहकार से समृद्धि',
    rural_tagline: 'ग्रामीण विकास, नगरीय उत्थान',
  },

  ta: {
    app_title: 'டாஸ்க்லிங்க்',
    app_tagline: 'கூட்டுறவு சேவை தளம் - 0% கமிஷன்',
    zero_commission_badge: '0% கமிஷன் - 100% ஊதியம் தொழிலாளருக்கு',
    search_placeholder: 'மின்பணியாளர், குழாய்ப் பணியாளர், தச்சர்...',
    filter_service: 'சேவை',
    filter_rating: 'குறைந்தபட்ச மதிப்பீடு',
    filter_distance: 'தொலைவு',
    filter_language: 'மொழி',
    filter_available_now: 'இப்போது கிடைக்கும்',
    filter_crews_only: 'குழுப் பணிகள் மட்டும்',
    map_view: 'வரைபடம்',
    list_view: 'பட்டியல்',
    book_now: 'தொழிலாளரை முன்பதிவு செய்',
    pre_book_only: 'முன்பதிவு மட்டும் (பொத்தான் தொலைபேசி)',
    verified_society: 'சரிபார்க்கப்பட்ட கூட்டுறவு உறுப்பினர்',
    digipin_label: 'டிஜிபின் (டிஜிட்டல் அஞ்சல் குறியீடு)',
    digipin_placeholder: 'எ.கா. 78C-K2M-9Q2F',
    why_this_worker: 'ஏன் இந்த தொழிலாளர்? (6-காரணி மதிப்பீடு)',
    night_premium_banner: 'இரவு நேர கட்டணம் (+25% தொழிலாளருக்கு)',
    holiday_premium_banner: 'கூட்டுறவு விடுமுறை கட்டணம் (+50% தொழிலாளருக்கு)',
    emergency_premium_banner: 'அவசர பதிவு (+30% தொழிலாளருக்கு)',
    how_tasklink_funded: 'டாஸ்க்லிங்க் எவ்வாறு நிதியளிக்கப்படுகிறது: நிலையான சந்தா',
    sahakar_tagline: 'சகாகர் சே சம்ரிதி',
    rural_tagline: 'கிராம வளர்ச்சி, நகர முன்னேற்றம்',
  },

  te: {
    app_title: 'టాస్క్‌లింక్',
    app_tagline: 'సహకార గిగ్ సేవలు - 0% కమీషన్',
    zero_commission_badge: '0% ప్లాట్‌ఫారమ్ రుసుము - కార్మికుడికి 100%',
    search_placeholder: 'ఎలక్ట్రీషియన్, ప్లంబర్, పెయింటర్...',
    filter_service: 'సేవ', filter_rating: 'కనీస రేటింగ్', filter_distance: 'దూరం',
    filter_language: 'భాష', filter_available_now: 'ఇప్పుడు అందుబాటులో',
    filter_crews_only: 'బృంద పనులు మాత్రమే', map_view: 'మ్యాప్', list_view: 'జాబితా',
    book_now: 'కార్మికుడిని బుక్ చేయి', pre_book_only: 'ముందే బుక్ చేయి (కీప్యాడ్ ఫోన్)',
    verified_society: 'ధృవీకరించిన సహకార సభ్యుడు',
    night_premium_banner: 'రాత్రి షిఫ్ట్ ప్రీమియం (+25% కార్మికుడికి)',
    holiday_premium_banner: 'సెలవుదిన ప్రీమియం (+50% కార్మికుడికి)',
    emergency_premium_banner: 'అత్యవసర బుకింగ్ (+30% కార్మికుడికి)',
    sahakar_tagline: 'సహకారం ద్వారా సమృద్ధి', rural_tagline: 'గ్రామీణ అభివృద్ధి, పట్టణ అభ్యున్నతి',
    digipin_label: 'డిజిపిన్', digipin_placeholder: 'ఉ: 78C-K2M-9Q2F',
    why_this_worker: 'ఈ కార్మికుడు ఎందుకు? (6-కారకాల స్కోర్)',
    how_tasklink_funded: 'టాస్క్‌లింక్: ఫ్లాట్ సభ్యత్వం',
  },

  kn: {
    app_title: 'ಟಾಸ್ಕ್‌ಲಿಂಕ್',
    app_tagline: 'ಸಹಕಾರ ಗಿಗ್ ಸೇವೆಗಳು - 0% ಕಮಿಷನ್',
    zero_commission_badge: '0% ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ - ಕಾರ್ಮಿಕರಿಗೆ 100%',
    search_placeholder: 'ಎಲೆಕ್ಟ್ರೀಷಿಯನ್, ಪ್ಲಂಬರ್, ಬಡಗಿ...',
    filter_service: 'ಸೇವೆ', filter_rating: 'ಕನಿಷ್ಠ ರೇಟಿಂಗ್', filter_distance: 'ದೂರ',
    filter_language: 'ಭಾಷೆ', filter_available_now: 'ಈಗ ಲಭ್ಯ', filter_crews_only: 'ಗ್ರೂಪ್ ಕೆಲಸ ಮಾತ್ರ',
    map_view: 'ನಕ್ಷೆ', list_view: 'ಪಟ್ಟಿ', book_now: 'ಕಾರ್ಮಿಕ ಬುಕ್ ಮಾಡಿ',
    pre_book_only: 'ಮುಂಬುಕಿಂಗ್ ಮಾತ್ರ (ಕೀಪ್ಯಾಡ್)',
    verified_society: 'ಪರಿಶೀಲಿಸಿದ ಸಹಕಾರ ಸದಸ್ಯ',
    night_premium_banner: 'ರಾತ್ರಿ ಶಿಫ್ಟ್ ಪ್ರೀಮಿಯಂ (+25% ಕಾರ್ಮಿಕರಿಗೆ)',
    holiday_premium_banner: 'ರಜಾ ದಿನ ಪ್ರೀಮಿಯಂ (+50% ಕಾರ್ಮಿಕರಿಗೆ)',
    emergency_premium_banner: 'ತುರ್ತು ಬುಕಿಂಗ್ (+30% ಕಾರ್ಮಿಕರಿಗೆ)',
    sahakar_tagline: 'ಸಹಕಾರದಿಂದ ಸಮೃದ್ಧಿ', rural_tagline: 'ಗ್ರಾಮೀಣ ಅಭಿವೃದ್ಧಿ, ನಗರ ಪ್ರಗತಿ',
    digipin_label: 'ಡಿಜಿಪಿನ್', digipin_placeholder: 'ಉ: 78C-K2M-9Q2F',
    why_this_worker: 'ಈ ಕಾರ್ಮಿಕ ಯಾಕೆ? (6-ಅಂಶ ಸ್ಕೋರ್)',
    how_tasklink_funded: 'ಟಾಸ್ಕ್‌ಲಿಂಕ್: ಸಮತಟ್ಟಾದ ಚಂದಾ',
  },

  ml: {
    app_title: 'ടാസ്ക്ലിങ്ക്',
    app_tagline: 'സഹകരണ ഗിഗ് സേവനങ്ങൾ - 0% കമ്മിഷൻ',
    zero_commission_badge: '0% പ്ലാറ്റ്‌ഫോം ഫീ - 100% തൊഴിലാളിക്ക്',
    search_placeholder: 'ഇലക്ട്രീഷ്യൻ, പ്ലംബർ, ആശാരി...',
    filter_service: 'സേവനം', filter_rating: 'ഏറ്റവും കുറഞ്ഞ റേറ്റിംഗ്', filter_distance: 'ദൂരം',
    filter_language: 'ഭാഷ', filter_available_now: 'ഇപ്പോൾ ലഭ്യം', filter_crews_only: 'ഗ്രൂപ്പ് ജോലികൾ',
    map_view: 'ഭൂപടം', list_view: 'പട്ടിക', book_now: 'തൊഴിലാളിയെ ബുക്ക് ചെയ്യൂ',
    pre_book_only: 'മുൻകൂർ ബുക്കിങ്ങ് (കീപ്പാഡ്)',
    verified_society: 'പരിശോധിച്ഛ സഹകരണ അംഗം',
    night_premium_banner: 'രാത്രി ഷിഫ്റ്റ് പ്രീമിയം (+25% തൊഴിലാളിക്ക്)',
    holiday_premium_banner: 'അവധി ദിന പ്രീമിയം (+50% തൊഴിലാളിക്ക്)',
    emergency_premium_banner: 'അടിയന്തര ബുക്കിംഗ് (+30% തൊഴിലാളിക്ക്)',
    sahakar_tagline: 'സഹകരണത്തിലൂടെ സമൃദ്ധി', rural_tagline: 'ഗ്രാമ വികസനം, നഗര പുരോഗതി',
    digipin_label: 'ഡിജിപിൻ', digipin_placeholder: 'ഉദാ: 78C-K2M-9Q2F',
    why_this_worker: 'ഈ തൊഴിലാളി എന്തുകൊണ്ട്? (6-ഘടക സ്‌കോർ)',
    how_tasklink_funded: 'ടാസ്ക്‌ലിങ്ക്: ഫ്ലാറ്റ് സബ്‌സ്‌ക്രിപ്‌ഷൻ',
  },

  bn: {
    app_title: 'টাস্কলিংক',
    app_tagline: 'সমবায় গিগ পরিষেবা - 0% কমিশন',
    zero_commission_badge: '0% প্ল্যাটফর্ম ফি - শ্রমিককে 100%',
    search_placeholder: 'ইলেক্ট্রিশিয়ান, প্লাম্বার, রং মিস্ত্রি খুঁজুন...',
    filter_service: 'সেবা', filter_rating: 'ন্যূনতম রেটিং', filter_distance: 'দূরত্ব',
    filter_language: 'ভাষা', filter_available_now: 'এখন উপলব্ধ', filter_crews_only: 'শুধু দল',
    map_view: 'মানচিত্র', list_view: 'তালিকা', book_now: 'শ্রমিক বুক করুন',
    pre_book_only: 'আগাম বুকিং (কীপ্যাড ফোন)',
    verified_society: 'যাচাইকৃত সমবায় সদস্য',
    night_premium_banner: 'রাত্রি প্রিমিয়াম (+25% শ্রমিককে)',
    holiday_premium_banner: 'ছুটির দিন প্রিমিয়াম (+50% শ্রমিককে)',
    emergency_premium_banner: 'জরুরি বুকিং (+30% শ্রমিককে)',
    sahakar_tagline: 'সহকারিতায় সমৃদ্ধি', rural_tagline: 'গ্রামীণ উন্নয়ন, শহর উন্নয়ন',
    digipin_label: 'ডিজিপিন', digipin_placeholder: 'যেমন: 78C-K2M-9Q2F',
    why_this_worker: 'এই শ্রমিক কেন? (6-ফ্যাক্টর স্কোর)',
    how_tasklink_funded: 'টাস্কলিংক: ফ্ল্যাট সমবায় চাঁদা',
  },

  mr: {
    app_title: 'टास्कलिंक',
    app_tagline: 'सहकारी गिग सेवा - 0% कमिशन',
    zero_commission_badge: '0% व्यासपीठ शुल्क - 100% कामगाराला',
    search_placeholder: 'इलेक्ट्रिशियन, प्लंबर, सुतार शोधा...',
    filter_service: 'सेवा', filter_rating: 'किमान रेटिंग', filter_distance: 'अंतर',
    filter_language: 'भाषा', filter_available_now: 'आत्ता उपलब्ध', filter_crews_only: 'फक्त गट कामे',
    map_view: 'नकाशा', list_view: 'यादी', book_now: 'कामगार बुक करा',
    pre_book_only: 'आगाऊ बुकिंग (कीपॅड फोन)',
    verified_society: 'सत्यापित सहकारी सदस्य',
    night_premium_banner: 'रात्री प्रीमियम (+25% कामगाराला)',
    holiday_premium_banner: 'सुट्टीचा प्रीमियम (+50% कामगाराला)',
    emergency_premium_banner: 'आपत्कालीन बुकिंग (+30% कामगाराला)',
    sahakar_tagline: 'सहकारातून समृद्धी', rural_tagline: 'ग्रामीण विकास, शहरी उत्थान',
    digipin_label: 'डिजिपिन', digipin_placeholder: 'उदा: 78C-K2M-9Q2F',
    why_this_worker: 'हा कामगार का? (6-घटक गुण)',
    how_tasklink_funded: 'टास्कलिंक: सपाट सहकारी सदस्यता',
  },

  gu: {
    app_title: 'ટાસ્કલિન્ક',
    app_tagline: 'સહકારી ગિગ સેવાઓ - 0% કમિશન',
    zero_commission_badge: '0% ફી - 100% કામગારને',
    search_placeholder: 'ઇલેક્ટ્રિશિયન, પ્લમ્બર, સુથાર...',
    filter_service: 'સેવા', filter_rating: 'ન્યૂનતમ રેટિંગ', filter_distance: 'અંતર',
    filter_language: 'ભાષા', filter_available_now: 'હવે ઉપલબ્ધ', filter_crews_only: 'ફક્ત જૂથ કામ',
    map_view: 'નકશો', list_view: 'યાદી', book_now: 'કામગારને બૂક કરો',
    pre_book_only: 'ફક્ત પ્રી-બૂકિંગ (કીપૅડ)',
    verified_society: 'ચકાસાયેલ સહકારી સભ્ય',
    night_premium_banner: 'રાત્રી પ્રીમિયમ (+25% કામગારને)',
    holiday_premium_banner: 'રજા પ્રીમિયમ (+50% કામગારને)',
    emergency_premium_banner: 'કટોકટી બૂકિંગ (+30% કામગારને)',
    sahakar_tagline: 'સહકારથી સમૃદ્ધિ', rural_tagline: 'ગ્રામ વિકાસ, શહેર સુધારો',
    digipin_label: 'ડિજિપિન', digipin_placeholder: 'ઉ: 78C-K2M-9Q2F',
    why_this_worker: 'આ કામગાર કેમ? (6-ઘટક સ્કોર)',
    how_tasklink_funded: 'ટાસ્કલિન્ક: ફ્લાટ સદસ્યપદ',
  },

  pa: {
    app_title: 'ਟਾਸਕਲਿੰਕ',
    app_tagline: 'ਸਹਿਕਾਰੀ ਸੇਵਾਵਾਂ - 0% ਕਮਿਸ਼ਨ',
    zero_commission_badge: '0% ਫੀਸ - 100% ਮਜ਼ਦੂਰ ਨੂੰ',
    search_placeholder: 'ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ, ਪਲੰਬਰ, ਰੰਗਸਾਜ਼...',
    filter_service: 'ਸੇਵਾ', filter_rating: 'ਘੱਟੋ ਘੱਟ ਰੇਟਿੰਗ', filter_distance: 'ਦੂਰੀ',
    filter_language: 'ਭਾਸ਼ਾ', filter_available_now: 'ਹੁਣ ਉਪਲਬਧ', filter_crews_only: 'ਟੀਮ ਕੰਮ',
    map_view: 'ਨਕਸ਼ਾ', list_view: 'ਸੂਚੀ', book_now: 'ਮਜ਼ਦੂਰ ਬੁੱਕ ਕਰੋ',
    pre_book_only: 'ਪਹਿਲਾਂ ਬੁਕਿੰਗ (ਕੀਪੈਡ)',
    verified_society: 'ਪ੍ਰਮਾਣਿਤ ਸਹਿਕਾਰੀ ਮੈਂਬਰ',
    night_premium_banner: 'ਰਾਤ ਦੀ ਤਨਖਾਹ (+25% ਮਜ਼ਦੂਰ ਨੂੰ)',
    holiday_premium_banner: 'ਛੁੱਟੀ ਪ੍ਰੀਮੀਅਮ (+50% ਮਜ਼ਦੂਰ ਨੂੰ)',
    emergency_premium_banner: 'ਐਮਰਜੈਂਸੀ ਬੁਕਿੰਗ (+30% ਮਜ਼ਦੂਰ ਨੂੰ)',
    sahakar_tagline: 'ਸਹਿਕਾਰਤਾ ਨਾਲ ਖੁਸ਼ਹਾਲੀ', rural_tagline: 'ਪੇਂਡੂ ਵਿਕਾਸ, ਸ਼ਹਿਰੀ ਤਰੱਕੀ',
    digipin_label: 'ਡਿਜੀਪਿਨ', digipin_placeholder: 'ਜਿਵੇਂ: 78C-K2M-9Q2F',
    why_this_worker: 'ਇਹ ਮਜ਼ਦੂਰ ਕਿਉਂ? (6-ਕਾਰਕ ਸਕੋਰ)',
    how_tasklink_funded: 'ਟਾਸਕਲਿੰਕ: ਫਲੈਟ ਸਦੱਸਤਾ',
  },

  or: {
    app_title: 'ଟାସ୍କଲିଙ୍କ',
    app_tagline: 'ସଂଘ ସେବା - 0% କମିଶନ',
    zero_commission_badge: '0% ଶୁଳ୍କ - 100% ଶ୍ରମିକଙ୍କୁ',
    search_placeholder: 'ଇଲେକ୍ଟ୍ରିସିଆନ, ପ୍ଲମ୍ବର...',
    filter_service: 'ସେବା', filter_rating: 'ନ୍ୟୂନ ରେଟିଂ', filter_distance: 'ଦୂରତ୍ୱ',
    filter_language: 'ଭାଷା', filter_available_now: 'ବର୍ତ୍ତମାନ ଉପଲବ୍ଧ', filter_crews_only: 'ଗ୍ରୁପ',
    map_view: 'ମ୍ୟାପ', list_view: 'ତାଲିକା', book_now: 'ଶ୍ରମିକ ବୁକ୍ କରନ୍ତୁ',
    pre_book_only: 'ଆଗୁଆ ବୁକ (କିପ୍ୟାଡ)',
    verified_society: 'ଯାଞ୍ଚ ସଂଘ ସଦସ୍ୟ',
    night_premium_banner: 'ରାତ୍ରି ପ୍ରିମିୟମ (+25% ଶ୍ରମିକଙ୍କୁ)',
    holiday_premium_banner: 'ଛୁଟ ଦିନ ପ୍ରିମିୟମ (+50% ଶ୍ରମିକଙ୍କୁ)',
    emergency_premium_banner: 'ଜରୁରି ବୁକିଂ (+30% ଶ୍ରମିକଙ୍କୁ)',
    sahakar_tagline: 'ସହଯୋଗ ଦ୍ୱାରା ସମୃଦ୍ଧି', rural_tagline: 'ଗ୍ରାମ ବିକାଶ, ସହର ଅଭ୍ୟୁଦୟ',
    digipin_label: 'ଡିଜିପିନ', digipin_placeholder: 'ଯଥା: 78C-K2M-9Q2F',
    why_this_worker: 'ଏହି ଶ୍ରମିକ କାହିଁକି?', how_tasklink_funded: 'ଟାସ୍କଲିଙ୍କ: ସଦସ୍ୟତା',
  },

  as: {
    app_title: 'টাস্কলিংক',
    app_tagline: 'সমবায় সেৱা - 0% কমিছন',
    zero_commission_badge: '0% মাচুল - 100% শ্ৰমিকক',
    search_placeholder: 'ইলেক্ট্ৰিছিয়ান, প্লাম্বাৰ...',
    filter_service: 'সেৱা', filter_rating: 'ন্যূনতম ৰেটিং', filter_distance: 'দূৰত্ব',
    filter_language: 'ভাষা', filter_available_now: 'এতিয়া উপলব্ধ', filter_crews_only: 'গ্ৰুপ কাম',
    map_view: 'মানচিত্ৰ', list_view: 'তালিকা', book_now: 'শ্ৰমিক বুক কৰক',
    pre_book_only: 'আগতীয়া বুকিং', verified_society: 'প্ৰমাণিত সমবায় সদস্য',
    night_premium_banner: 'ৰাতি প্ৰিমিয়াম (+25% শ্ৰমিকক)',
    holiday_premium_banner: 'ছুটিৰ প্ৰিমিয়াম (+50% শ্ৰমিকক)',
    emergency_premium_banner: 'জৰুৰীকালীন (+30% শ্ৰমিকক)',
    sahakar_tagline: 'সহযোগৰ জৰিয়তে সমৃদ্ধি', rural_tagline: 'গ্ৰামীণ উন্নয়ন, নগৰ অগ্ৰগতি',
    digipin_label: 'ডিজিপিন', digipin_placeholder: 'যেনে: 78C-K2M-9Q2F',
    why_this_worker: 'এই শ্ৰমিক কিয়?', how_tasklink_funded: 'টাস্কলিংক: ফ্লেট সদস্যতা',
  },

  // RTL languages — UI sets dir="rtl" via isRtl()
  ur: {
    app_title: 'ٹاسک لنک',
    app_tagline: 'تعاونی گیگ خدمات - 0% کمیشن',
    zero_commission_badge: '0% پلیٹ فارم فیس - 100% مزدور کو',
    search_placeholder: 'الیکٹریشن، پلمبر، رنگ کار...',
    filter_service: 'خدمت', filter_rating: 'کم سے کم ریٹنگ', filter_distance: 'فاصلہ',
    filter_language: 'زبان', filter_available_now: 'ابھی دستیاب', filter_crews_only: 'گروپ کام',
    map_view: 'نقشہ', list_view: 'فہرست', book_now: 'مزدور بک کریں',
    pre_book_only: 'پیشگی بکنگ (کی پیڈ)', verified_society: 'تصدیق شدہ تعاونی رکن',
    night_premium_banner: 'رات کا اضافی معاوضہ (+25%)',
    holiday_premium_banner: 'تعطیل اضافہ (+50%)',
    emergency_premium_banner: 'ہنگامی بکنگ (+30%)',
    sahakar_tagline: 'تعاون سے خوشحالی', rural_tagline: 'دیہی ترقی، شہری بہتری',
    digipin_label: 'ڈیجی پن', digipin_placeholder: 'مثلاً: 78C-K2M-9Q2F',
    why_this_worker: 'یہ مزدور کیوں؟', how_tasklink_funded: 'ٹاسک لنک: فلیٹ ممبرشپ',
  },

  ne: {
    app_title: 'टास्कलिंक', app_tagline: 'सहकारी सेवा - 0% कमिसन',
    zero_commission_badge: '0% शुल्क - 100% कामदारलाई',
    book_now: 'कामदार बुक गर्नुहोस्', filter_available_now: 'अहिले उपलब्ध',
    night_premium_banner: 'रात प्रिमियम (+25%)', holiday_premium_banner: 'बिदाको प्रिमियम (+50%)',
    emergency_premium_banner: 'आपतकालीन (+30%)',
    sahakar_tagline: 'सहकारिताबाट समृद्धि', rural_tagline: 'ग्रामीण विकास, शहरी उत्थान',
    why_this_worker: 'यो कामदार किन?', how_tasklink_funded: 'टास्कलिंक: समतल सदस्यता',
    verified_society: 'प्रमाणित सहकारी सदस्य', search_placeholder: 'इलेक्ट्रिसियन, प्लम्बर...',
    filter_service: 'सेवा', filter_rating: 'न्यून रेटिंग', filter_distance: 'दूरी',
    filter_language: 'भाषा', filter_crews_only: 'समूह काम', map_view: 'नक्सा', list_view: 'सूची',
    pre_book_only: 'अग्रिम बुकिंग', digipin_label: 'डिजिपिन', digipin_placeholder: 'उदा: 78C-K2M-9Q2F',
  },

  mai: {
    app_title: 'टास्कलिंक', app_tagline: 'सहकारी सेवा - 0% कमीशन',
    zero_commission_badge: '0% शुल्क - 100% कामगारकेँ',
    book_now: 'कामगार बुक करू', filter_available_now: 'अखन उपलब्ध',
    night_premium_banner: 'राति प्रीमियम (+25%)', holiday_premium_banner: 'छुट्टी प्रीमियम (+50%)',
    emergency_premium_banner: 'आपात (+30%)',
    sahakar_tagline: 'सहकार सँ समृद्धि', rural_tagline: 'गामक विकास, शहरक उत्थान',
    why_this_worker: 'ई कामगार किए?', how_tasklink_funded: 'टास्कलिंक: समतल सदस्यता',
    verified_society: 'सत्यापित सहकारी सदस्य', search_placeholder: 'इलेक्ट्रिशियन...',
    filter_service: 'सेवा', filter_rating: 'न्यूनतम रेटिंग', filter_distance: 'दूरी',
    filter_language: 'भाषा', filter_crews_only: 'समूह काज', map_view: 'नक्शा', list_view: 'सूची',
    pre_book_only: 'अग्रिम बुकिंग', digipin_label: 'डिजिपिन', digipin_placeholder: 'उदा: 78C-K2M-9Q2F',
  },

  sa: {
    app_title: 'टास्कलिंक', app_tagline: 'सहकारी सेवा - 0% शुल्कः',
    zero_commission_badge: '0% शुल्कः - 100% कर्मकराय',
    book_now: 'कर्मकरं पुस्तकयतु', filter_available_now: 'अधुना उपलब्धम्',
    night_premium_banner: 'रात्रिः प्रीमियम (+25%)', holiday_premium_banner: 'अवकाशः (+50%)',
    emergency_premium_banner: 'आपतकालः (+30%)',
    sahakar_tagline: 'सहकारात् समृद्धिः', rural_tagline: 'ग्राम विकासः, नगर उत्थानम्',
    why_this_worker: 'अयं कर्मकरः किमर्थम्?', how_tasklink_funded: 'टास्कलिंक: सदस्यता',
    verified_society: 'प्रमाणितः सहकारी सदस्यः', filter_service: 'सेवा',
    filter_rating: 'न्यूनतम', filter_distance: 'दूरत्वम्', filter_language: 'भाषा',
    filter_crews_only: 'समूहाः', map_view: 'मानचित्रम्', list_view: 'सूची',
    pre_book_only: 'अग्रिमं पुस्तकम्', digipin_label: 'डिजिपिन', digipin_placeholder: '78C-K2M-9Q2F',
    search_placeholder: 'इलेक्ट्रिशियन, प्लंबरः...',
  },

  doi: {
    app_title: 'टास्कलिंक', app_tagline: 'सहकारी सेवा - 0% कमिशन',
    zero_commission_badge: '0% शुल्क - 100% कम्मी गी',
    book_now: 'कम्मी बुक करो', filter_available_now: 'हून उपलब्ध',
    night_premium_banner: 'रात दा प्रीमियम (+25%)', holiday_premium_banner: 'छुट्टी (+50%)',
    emergency_premium_banner: 'आपातकाल (+30%)',
    sahakar_tagline: 'सहकार ते खुशहाली', rural_tagline: 'पिंडां दा विकास',
    why_this_worker: 'इ कम्मी कियूं?', how_tasklink_funded: 'सदस्यता',
    verified_society: 'प्रमाणित सहकारी सदस्य', search_placeholder: 'इलेक्ट्रिशियन...',
    filter_service: 'सेवा', filter_rating: 'रेटिंग', filter_distance: 'दूरी',
    filter_language: 'बोली', filter_crews_only: 'गोजोन', map_view: 'नक्शा', list_view: 'सूची',
    pre_book_only: 'पहलां बुकिंग', digipin_label: 'डिजिपिन', digipin_placeholder: '78C-K2M-9Q2F',
  },

  gom: {
    app_title: 'टास्कलिंक', app_tagline: 'सहकारी सेवा - 0% कमिशन',
    zero_commission_badge: '0% फी - 100% कामगाराक',
    book_now: 'कामगार बुक करात', filter_available_now: 'आत्ता उपलब्ध',
    night_premium_banner: 'रात प्रीमियम (+25%)', holiday_premium_banner: 'सुट्टी (+50%)',
    emergency_premium_banner: 'आणीबाणी (+30%)',
    sahakar_tagline: 'सहकार थावन समृद्धी', rural_tagline: 'ग्रामीण विकास',
    why_this_worker: 'हो कामगार कित्याक?', how_tasklink_funded: 'सदस्यता',
    verified_society: 'सत्यापित सहकारी सदस्य', search_placeholder: 'इलेक्ट्रिशियन...',
    filter_service: 'सेवा', filter_rating: 'किमान रेटिंग', filter_distance: 'अंतर',
    filter_language: 'भास', filter_crews_only: 'गट', map_view: 'नकाशो', list_view: 'यादी',
    pre_book_only: 'आगाऊ बुकिंग', digipin_label: 'डिजिपिन', digipin_placeholder: '78C-K2M-9Q2F',
  },

  // Ol Chiki script — requires Noto Sans Ol Chiki font
  sat: {
    app_title: 'ᱴᱟᱥᱠᱞᱤᱧᱠ', app_tagline: 'ᱥᱟᱯᱲᱟᱣᱟᱜ ᱥᱮᱵᱟ - 0%',
    zero_commission_badge: '0% - 100% ᱠᱟᱢᱤᱧ ᱠᱚ',
    book_now: 'ᱠᱟᱢᱤ ᱵᱩᱠ ᱞᱟᱜᱟ', filter_available_now: 'ᱦᱟᱹᱴᱤᱧ ᱞᱮᱫ',
    night_premium_banner: 'ᱩᱛᱩ ᱯᱨᱤᱢᱤᱭᱚᱢ (+25%)', holiday_premium_banner: 'ᱵᱟᱱᱫᱚ (+50%)',
    emergency_premium_banner: 'ᱡᱚᱨᱩᱨᱤ (+30%)',
    sahakar_tagline: 'ᱥᱟᱯᱲᱟᱣ ᱠᱷᱚᱱ ᱥᱟᱢᱨᱤᱫ', rural_tagline: 'ᱜᱟᱣ ᱪᱤᱱᱛᱟ',
    why_this_worker: 'ᱱᱤᱫᱤ ᱠᱟᱢᱤ ᱢᱮᱱᱛᱮ?', how_tasklink_funded: 'ᱥᱚᱫᱚᱥᱴᱟ',
    verified_society: 'ᱡᱟᱺᱪᱟ ᱥᱟᱯᱲᱟᱣᱟᱜ ᱥᱚᱫᱚᱥ',
    filter_service: 'ᱥᱮᱵᱟ', filter_rating: 'ᱨᱮᱴᱤᱧ', filter_distance: 'ᱫᱩᱨ',
    filter_language: 'ᱟᱛᱩ ᱠᱟᱛᱷᱟ', filter_crews_only: 'ᱫᱷᱚᱱ',
    map_view: 'ᱜᱟᱠᱢ', list_view: 'ᱦᱚᱲᱚᱠ', pre_book_only: 'ᱟᱹᱜᱩᱭ ᱵᱩᱠᱤᱧ',
    digipin_label: 'ᱰᱤᱡᱤᱯᱤᱱ', digipin_placeholder: '78C-K2M-9Q2F',
    search_placeholder: 'ᱠᱟᱢ ᱠᱷᱳᱡᱟ...',
  },

  // Meetei Mayek script — requires Noto Sans Meetei Mayek font
  mni: {
    app_title: 'ꯇꯥꯁ꯭ꯀꯂꯤꯡꯀꯗ', app_tagline: 'ꯁꯍꯀꯥꯔꯤ ꯁꯔꯚꯤꯁ - 0%',
    zero_commission_badge: '0% - 100% ꯋꯥꯔꯀꯔꯗꯥ',
    book_now: 'ꯋꯥꯔꯀꯔ ꯕꯨꯀ ꯇꯧꯕꯤꯌꯨ', filter_available_now: 'ꯍꯧꯖꯤꯛ ꯊꯥꯗꯣꯛꯄ',
    night_premium_banner: 'ꯆꯥꯎꯌꯥ ꯄ꯭ꯔꯤꯝꯤꯌꯝ (+25%)', holiday_premium_banner: 'ꯆꯥꯎꯁꯤꯡ (+50%)',
    emergency_premium_banner: 'ꯑꯋꯥꯕ (+30%)',
    sahakar_tagline: 'ꯁꯍꯀꯥꯔ ꯇꯣꯡꯅꯥ ꯁꯝꯨꯔꯗ꯭ꯙꯤ', rural_tagline: 'ꯃꯦꯏꯔꯥꯛ ꯆꯠꯅꯕꯥ',
    why_this_worker: 'ꯑꯁꯤ ꯋꯥꯔꯀꯔ ꯀꯩꯕꯕꯥ?', how_tasklink_funded: 'ꯃꯦꯝꯕꯔꯁꯤꯞ',
    verified_society: 'ꯁꯣꯁꯥꯢꯇꯤ ꯃꯦꯝꯕꯔ',
    filter_service: 'ꯁꯔꯚꯤꯁ', filter_rating: 'ꯔꯦꯇꯤꯡ', filter_distance: 'ꯑꯣꯢꯖꯦꯜ',
    filter_language: 'ꯂꯩꯉꯨ', filter_crews_only: 'ꯀ꯭ꯔꯨ',
    map_view: 'ꯃꯦꯞ', list_view: 'ꯂꯤꯁ꯭ꯇ', pre_book_only: 'ꯑꯥꯒꯦ ꯕꯨꯀꯤꯡ',
    digipin_label: 'ꯗꯤꯖꯤꯄꯤꯟ', digipin_placeholder: '78C-K2M-9Q2F',
    search_placeholder: 'ꯀꯥꯝ ꯊꯤꯠꯄ...',
  },

  brx: {
    app_title: 'टास्कलिंक', app_tagline: 'सहकारी सेवा - 0% कमिशन',
    zero_commission_badge: '0% - 100% कामगारनि',
    book_now: 'कामगार बुक खालाम', filter_available_now: 'नोंथाम उपलब्ध',
    night_premium_banner: 'बोसोर (+25%)', holiday_premium_banner: 'सुहागफो (+50%)',
    emergency_premium_banner: 'जरुरि (+30%)',
    sahakar_tagline: 'सहकार सिनांथि समृद्धि', rural_tagline: 'गांउनि उदान',
    why_this_worker: 'नि कामगार माबोरै?', how_tasklink_funded: 'सदस्यता',
    verified_society: 'सहकारी सद्गो', search_placeholder: 'इलेक्ट्रिशियन...',
    filter_service: 'सेवा', filter_rating: 'रेटिंग', filter_distance: 'फार',
    filter_language: 'बिफां', filter_crews_only: 'गोजोन', map_view: 'मैप', list_view: 'लिस्ट',
    pre_book_only: 'आगतिया बुकिंग', digipin_label: 'डिजिपिन', digipin_placeholder: '78C-K2M-9Q2F',
  },

  ks: {
    app_title: 'ٹاسک لنک', app_tagline: 'سہکاری خدمت - 0% کمیشن',
    zero_commission_badge: '0% فیس - 100% کامگارَس',
    book_now: 'کامگار بُک کرٕو', filter_available_now: 'ابی ممکن',
    night_premium_banner: 'رات پریمیم (+25%)', holiday_premium_banner: 'چھٹی (+50%)',
    emergency_premium_banner: 'ہنگامہ (+30%)',
    sahakar_tagline: 'سہکار سۄیتھے خوشحالی', rural_tagline: 'دیہی ترقی',
    why_this_worker: 'یہ کامگار کیوں؟', how_tasklink_funded: 'ممبرشپ',
    verified_society: 'سہکاری رکن', search_placeholder: 'الیکٹریشن...',
    filter_service: 'خدمت', filter_rating: 'ریٹنگ', filter_distance: 'فاصلہ',
    filter_language: 'زبان', filter_crews_only: 'گروپ', map_view: 'نقشہ', list_view: 'فہرست',
    pre_book_only: 'پیشگی بکنگ', digipin_label: 'ڈیجی پن', digipin_placeholder: '78C-K2M-9Q2F',
  },

  sd: {
    app_title: 'ٽاسڪ لنڪ', app_tagline: 'تعاوني خدمت - 0% ڪميشن',
    zero_commission_badge: '0% في - 100% ڪارڪن کي',
    book_now: 'ڪارڪن بُڪ ڪريو', filter_available_now: 'هاڻي دستياب',
    night_premium_banner: 'رات جو پريميم (+25%)', holiday_premium_banner: 'موڪل (+50%)',
    emergency_premium_banner: 'هنگامي (+30%)',
    sahakar_tagline: 'تعاون سان خوشحالي', rural_tagline: 'ڳوٺاڻي ترقي',
    why_this_worker: 'هي ڪارڪن ڇو؟', how_tasklink_funded: 'ميمبرشپ',
    verified_society: 'تعاوني ميمبر', search_placeholder: 'الیکٹریشن...',
    filter_service: 'خدمت', filter_rating: 'ريٽنگ', filter_distance: 'فاصلو',
    filter_language: 'ٻولي', filter_crews_only: 'گروپ', map_view: 'نقشو', list_view: 'فهرست',
    pre_book_only: 'اڳواٽ بوڪنگ', digipin_label: 'ڊيجي پن', digipin_placeholder: '78C-K2M-9Q2F',
  },
};

/**
 * Translate a UI key for a given language.
 * Gracefully falls back to English if the key is not in the target bundle (R38).
 */
export function t(lang: string, key: string): string {
  const bundle = I18N_DICTIONARY[lang];
  if (bundle && bundle[key]) return bundle[key];
  return I18N_DICTIONARY['en']?.[key] ?? key;
}

/** Returns true if the given language code is Right-to-Left (Perso-Arabic scripts) */
export function isRtl(lang: string): boolean {
  return RTL_LANGUAGE_CODES.includes(lang);
}
