
/*
 Language Ai V5 Firebase Course
 - 60 generated lesson days per course
 - Preserves earlier localStorage key/state from V1-V4
 - Firebase Auth + Firestore-ready cloud progress and public leaderboard
 - Guest/local fallback still works if Firebase is not enabled
 - Speaker buttons use Web Speech API; speech check uses browser SpeechRecognition when available
*/
const APP_VERSION = "V5 Firebase Course";
const STORAGE_KEY = "language_ai_v1_state";
const NAMES = ["Maya","Omar","Lina","Aisha","Karim","Nadia","Sofia","Daniel","Rina","Hana","Tariq","Amara","Diego","Ana"];
const BN_NAMES = ["মায়া","ওমর","লিনা","আয়েশা","করিম","নাদিয়া","সোফিয়া","দানিয়েল","রিনা","হানা","তারিক","আমারা","দিয়েগো","আনা"];
const DEMO_LEADERS = [
  {name:"Maya",xp:18420,streak:58,badge:"Sound Master"},
  {name:"Omar",xp:16110,streak:44,badge:"Boss Clear"},
  {name:"Lina",xp:13950,streak:39,badge:"Daily Fire"},
  {name:"Aisha",xp:11280,streak:31,badge:"Kind Speaker"},
  {name:"Karim",xp:9700,streak:26,badge:"Grammar Glow"}
];

const TOPICS = {
  bn_en: [
    topic("Words + tiny sentences","🌱","hello, name, water, food, home, yes/no, thank you",
      [["হ্যালো","Hello","হেলো","friendly greeting"],["আমার নাম {{bnName}}।","My name is {{name}}.","মাই নেইম ইজ {{name}}","say your name"],["আমি {{bnName}}।","I am {{name}}.","আই অ্যাম {{name}}","simple identity"],["পানি","Water","ওয়াটার","water"],["খাবার","Food","ফুড","food"],["বাসা","Home","হোম","home"],["হ্যাঁ","Yes","ইয়েস","yes"],["না","No","নো","no"],["ধন্যবাদ","Thank you","থ্যাংক ইউ","polite thanks"]],
      [["আমি পানি চাই।","I want water.","আই ওয়ান্ট ওয়াটার"],["এটা খাবার।","This is food.","দিস ইজ ফুড"],["আমি বাসায় আছি।","I am home.","আই অ্যাম হোম"]]),
    topic("Greetings + family","👋","greetings, family, mother, father, child",
      [["সুপ্রভাত","Good morning","গুড মর্নিং","morning greeting"],["আপনি কেমন আছেন?","How are you?","হাউ আর ইউ","ask politely"],["আমি ভালো আছি।","I am good.","আই অ্যাম গুড","say you are okay"],["আমার","My","মাই","shows something is yours"],["মা","Mother","মাদার","mother"],["বাবা","Father","ফাদার","father"],["পরিবার","Family","ফ্যামিলি","family"],["শিশু","Child","চাইল্ড","child"]],
      [["এটা আমার মা।","This is my mother.","দিস ইজ মাই মাদার"],["এটা আমার পরিবার।","This is my family.","দিস ইজ মাই ফ্যামিলি"],["আপনি কেমন আছেন?","How are you?","হাউ আর ইউ"]]),
    topic("Food + kitchen","🍽️","food, kitchen, tea, rice, spoon, plate",
      [["রান্নাঘর","Kitchen","কিচেন","kitchen"],["ভাত","Rice","রাইস","rice"],["চা","Tea","টি","tea"],["প্লেট","Plate","প্লেট","plate"],["চামচ","Spoon","স্পুন","spoon"],["আমি চাই","I want","আই ওয়ান্ট","ask for something"],["আমার দরকার","I need","আই নিড","need something"],["গরম","Hot","হট","hot"]],
      [["আমি চা চাই।","I want tea.","আই ওয়ান্ট টি"],["আমার চামচ দরকার।","I need a spoon.","আই নিড আ স্পুন"],["ভাত গরম।","The rice is hot.","দা রাইস ইজ হট"]]),
    topic("Home objects","🏠","door, window, chair, table, key, bathroom",
      [["দরজা","Door","ডোর","door"],["জানালা","Window","উইন্ডো","window"],["চেয়ার","Chair","চেয়ার","chair"],["টেবিল","Table","টেবল","table"],["বিছানা","Bed","বেড","bed"],["চাবি","Key","কি","key"],["লাইট","Light","লাইট","light"],["বাথরুম","Bathroom","ব্যাথরুম","bathroom"]],
      [["চাবি কোথায়?","Where is the key?","হোয়ার ইজ দা কি"],["এটা আমার চেয়ার।","This is my chair.","দিস ইজ মাই চেয়ার"],["লাইট বন্ধ করুন।","Please turn off the light.","প্লিজ টার্ন অফ দা লাইট"]]),
    topic("Numbers + money","💵","numbers, price, money, dollars",
      [["এক","One","ওয়ান","1"],["দুই","Two","টু","2"],["তিন","Three","থ্রি","3"],["পাঁচ","Five","ফাইভ","5"],["দশ","Ten","টেন","10"],["ডলার","Dollar","ডলার","money"],["কত","How much","হাউ মাচ","ask price"],["দাম","Price","প্রাইস","cost"]],
      [["দাম কত?","How much is it?","হাউ মাচ ইজ ইট"],["আমার পাঁচ ডলার আছে।","I have five dollars.","আই হ্যাভ ফাইভ ডলার্স"],["এটা সস্তা।","This is cheap.","দিস ইজ চিপ"]]),
    topic("Daily actions","🚶","eat, drink, go, come, sleep, work",
      [["খাই","Eat","ইট","eat"],["পানি খাই","Drink water","ড্রিংক ওয়াটার","drink"],["যাই","Go","গো","go"],["আসি","Come","কাম","come"],["ঘুমাই","Sleep","স্লিপ","sleep"],["কাজ করি","Work","ওয়ার্ক","work"],["দেখি","See","সি","see"],["শুনি","Listen","লিসেন","listen"]],
      [["আমি কাজে যাই।","I go to work.","আই গো টু ওয়ার্ক"],["আমি পানি খাই।","I drink water.","আই ড্রিংক ওয়াটার"],["আমি রাতে ঘুমাই।","I sleep at night.","আই স্লিপ অ্যাট নাইট"]]),
    topic("Review boss 1","🏆","survival phrases: slowly, again, understand, help",
      [["সহজ","Easy","ইজি","easy"],["আবার","Again","আগেইন","again"],["ধীরে","Slowly","স্লোলি","slowly"],["বুঝেছি","I understand","আই আন্ডারস্ট্যান্ড","understand"],["বুঝিনি","I do not understand","আই ডু নট আন্ডারস্ট্যান্ড","do not understand"],["সাহায্য","Help","হেল্প","help"],["অনুগ্রহ করে","Please","প্লিজ","please"],["ঠিক আছে","Okay","ওকে","okay"]],
      [["দয়া করে ধীরে বলুন।","Please speak slowly.","প্লিজ স্পিক স্লোলি"],["আমি বুঝিনি।","I do not understand.","আই ডু নট আন্ডারস্ট্যান্ড"],["আবার বলুন।","Say it again.","সে ইট এগেইন"]]),
    topic("Doctor + pharmacy","🩺","doctor, medicine, pain, fever, cough, appointment",
      [["ডাক্তার","Doctor","ডক্টর","doctor"],["ওষুধ","Medicine","মেডিসিন","medicine"],["ব্যথা","Pain","পেইন","pain"],["জ্বর","Fever","ফিভার","fever"],["কাশি","Cough","কফ","cough"],["মাথা","Head","হেড","head"],["পেট","Stomach","স্টমাক","stomach"],["অ্যাপয়েন্টমেন্ট","Appointment","অ্যাপয়েন্টমেন্ট","appointment"]],
      [["আমার ব্যথা আছে।","I have pain.","আই হ্যাভ পেইন"],["আমার জ্বর আছে।","I have a fever.","আই হ্যাভ আ ফিভার"],["আমার ডাক্তার দরকার।","I need a doctor.","আই নিড আ ডক্টর"]]),
    topic("Bus + directions","🚌","bus, street, right, left, stop, where",
      [["বাস","Bus","বাস","bus"],["রাস্তা","Street","স্ট্রিট","street"],["ডান","Right","রাইট","right"],["বাম","Left","লেফট","left"],["সামনে","Ahead","অ্যাহেড","ahead"],["পিছনে","Behind","বিহাইন্ড","behind"],["কোথায়","Where","হোয়ার","where"],["থামুন","Stop","স্টপ","stop"]],
      [["বাস কোথায়?","Where is the bus?","হোয়ার ইজ দা বাস"],["ডানে যান।","Go right.","গো রাইট"],["দয়া করে এখানে থামুন।","Please stop here.","প্লিজ স্টপ হিয়ার"]]),
    topic("Phone + help","📱","phone, call, message, charger, help",
      [["ফোন","Phone","ফোন","phone"],["কল","Call","কল","call"],["মেসেজ","Message","মেসেজ","message"],["চার্জার","Charger","চার্জার","charger"],["নম্বর","Number","নাম্বার","number"],["সমস্যা","Problem","প্রবলেম","problem"],["সাহায্য করুন","Help me","হেল্প মি","ask for help"],["পরে","Later","লেইটার","later"]],
      [["আমার ফোন দরকার।","I need my phone.","আই নিড মাই ফোন"],["আমাকে সাহায্য করুন।","Help me, please.","হেল্প মি প্লিজ"],["আমি পরে কল করবো।","I will call later.","আই উইল কল লেইটার"]]),
    topic("Work + store","💼","work, store, manager, customer, receipt",
      [["কাজ","Work","ওয়ার্ক","work"],["দোকান","Store","স্টোর","store"],["ম্যানেজার","Manager","ম্যানেজার","manager"],["গ্রাহক","Customer","কাস্টমার","customer"],["রসিদ","Receipt","রিসিট","receipt"],["ব্যাগ","Bag","ব্যাগ","bag"],["আজ","Today","টুডে","today"],["কাল","Tomorrow","টুমরো","tomorrow"]],
      [["আমি আজ কাজ করি।","I work today.","আই ওয়ার্ক টুডে"],["আপনার রসিদ লাগবে?","Do you need a receipt?","ডু ইউ নিড আ রিসিট"],["ম্যানেজার কোথায়?","Where is the manager?","হোয়ার ইজ দা ম্যানেজার"]]),
    topic("Neighbor + polite talk","🤝","neighbor, sorry, quiet, good evening",
      [["প্রতিবেশী","Neighbor","নেইবার","neighbor"],["শুভ সন্ধ্যা","Good evening","গুড ইভনিং","evening greeting"],["দুঃখিত","Sorry","সরি","apology"],["ধন্যবাদ","Thanks","থ্যাংক্স","thanks"],["সময়","Time","টাইম","time"],["শান্ত","Quiet","কোয়ায়েট","quiet"],["দরকার","Need","নিড","need"],["ভালো","Good","গুড","good"]],
      [["শুভ সন্ধ্যা, প্রতিবেশী।","Good evening, neighbor.","গুড ইভনিং নেইবার"],["দুঃখিত, আমি বুঝিনি।","Sorry, I did not understand.","সরি আই ডিড নট আন্ডারস্ট্যান্ড"],["দয়া করে শান্ত থাকুন।","Please be quiet.","প্লিজ বি কোয়ায়েট"]]),
    topic("Time + daily schedule","🕰️","time, morning, afternoon, night, late",
      [["সকাল","Morning","মর্নিং","morning"],["দুপুর","Afternoon","আফটারনুন","afternoon"],["রাত","Night","নাইট","night"],["এখন","Now","নাউ","now"],["সময়","Time","টাইম","time"],["দেরি","Late","লেইট","late"],["আগে","Before","বিফোর","before"],["পরে","After","আফটার","after"]],
      [["এখন কয়টা বাজে?","What time is it now?","হোয়াট টাইম ইজ ইট নাউ"],["আমি সকালে কাজ করি।","I work in the morning.","আই ওয়ার্ক ইন দা মর্নিং"],["আমি পরে আসবো।","I will come later.","আই উইল কাম লেইটার"]]),
    topic("Shopping + clothes","🛍️","clothes, size, color, shoes, price",
      [["কাপড়","Clothes","ক্লোদস","clothes"],["জুতা","Shoes","শুজ","shoes"],["সাইজ","Size","সাইজ","size"],["রং","Color","কালার","color"],["ছোট","Small","স্মল","small"],["বড়","Large","লার্জ","large"],["নীল","Blue","ব্লু","blue"],["কালো","Black","ব্ল্যাক","black"]],
      [["আমার বড় সাইজ দরকার।","I need a large size.","আই নিড আ লার্জ সাইজ"],["এই জুতা কত?","How much are these shoes?","হাউ মাচ আর দিজ শুজ"],["আমি কালো রং চাই।","I want the black color.","আই ওয়ান্ট দা ব্ল্যাক কালার"]]),
    topic("Restaurant ordering","🍲","menu, chicken, fish, spicy, bill",
      [["মেনু","Menu","মেনু","menu"],["মুরগি","Chicken","চিকেন","chicken"],["মাছ","Fish","ফিশ","fish"],["ঝাল","Spicy","স্পাইসি","spicy"],["কম","Less","লেস","less"],["বিল","Bill","বিল","bill"],["খাবো","Eat","ইট","eat"],["আরো পানি","More water","মোর ওয়াটার","more water"]],
      [["আমি মুরগি চাই।","I want chicken.","আই ওয়ান্ট চিকেন"],["ঝাল কম দিন।","Make it less spicy, please.","মেক ইট লেস স্পাইসি প্লিজ"],["বিল দিতে পারেন?","Can I have the bill?","ক্যান আই হ্যাভ দা বিল"]]),
    topic("Emergency safety","🚨","emergency, police, fire, ambulance, safe",
      [["জরুরি","Emergency","ইমার্জেন্সি","emergency"],["পুলিশ","Police","পুলিশ","police"],["আগুন","Fire","ফায়ার","fire"],["অ্যাম্বুলেন্স","Ambulance","অ্যাম্বুলেন্স","ambulance"],["বিপদ","Danger","ডেঞ্জার","danger"],["নিরাপদ","Safe","সেইফ","safe"],["দ্রুত","Fast","ফাস্ট","fast"],["এখানে","Here","হিয়ার","here"]],
      [["এটা জরুরি।","This is an emergency.","দিস ইজ অ্যান ইমার্জেন্সি"],["আমার অ্যাম্বুলেন্স দরকার।","I need an ambulance.","আই নিড অ্যান অ্যাম্বুলেন্স"],["আমি নিরাপদ আছি।","I am safe.","আই অ্যাম সেইফ"]]),
    topic("Feelings + needs","💛","happy, sad, tired, scared, hungry, thirsty",
      [["খুশি","Happy","হ্যাপি","happy"],["দুঃখিত","Sad","স্যাড","sad"],["ক্লান্ত","Tired","টাইয়ার্ড","tired"],["ভয়","Scared","স্কেয়ার্ড","scared"],["ক্ষুধা","Hungry","হাংরি","hungry"],["তৃষ্ণা","Thirsty","থার্স্টি","thirsty"],["বিশ্রাম","Rest","রেস্ট","rest"],["শান্তি","Peace","পিস","peace"]],
      [["আমি ক্লান্ত।","I am tired.","আই অ্যাম টাইয়ার্ড"],["আমি ক্ষুধার্ত।","I am hungry.","আই অ্যাম হাংরি"],["আমার বিশ্রাম দরকার।","I need rest.","আই নিড রেস্ট"]]),
    topic("Question words","❓","who, what, where, when, why, how",
      [["কে","Who","হু","who"],["কি","What","হোয়াট","what"],["কোথায়","Where","হোয়ার","where"],["কখন","When","হোয়েন","when"],["কেন","Why","হোয়াই","why"],["কিভাবে","How","হাউ","how"],["কোনটা","Which","হুইচ","which"],["কত","How many","হাউ মেনি","how many"]],
      [["আপনি কে?","Who are you?","হু আর ইউ"],["এটা কী?","What is this?","হোয়াট ইজ দিস"],["আপনি কোথায় যাচ্ছেন?","Where are you going?","হোয়ার আর ইউ গোয়িং"]]),
    topic("Past + future","🔄","yesterday, tomorrow, went, will go, will try",
      [["গতকাল","Yesterday","ইয়েস্টারডে","yesterday"],["আগামীকাল","Tomorrow","টুমরো","tomorrow"],["গিয়েছিলাম","Went","ওয়েন্ট","went"],["করবো","Will do","উইল ডু","will do"],["যাবো","Will go","উইল গো","will go"],["চেষ্টা করবো","Will try","উইল ট্রাই","will try"],["শিখবো","Will learn","উইল লার্ন","will learn"],["ছিলাম","Was","ওয়াজ","was"]],
      [["আমি গতকাল কাজে গিয়েছিলাম।","I went to work yesterday.","আই ওয়েন্ট টু ওয়ার্ক ইয়েস্টারডে"],["আমি আগামীকাল বাজারে যাবো।","I will go to the market tomorrow.","আই উইল গো টু দা মার্কেট টুমরো"],["আমি চেষ্টা করবো।","I will try.","আই উইল ট্রাই"]]),
    topic("Apartment + repair","🔧","leak, broken, hot water, repair, electricity",
      [["অ্যাপার্টমেন্ট","Apartment","অ্যাপার্টমেন্ট","apartment"],["লিক","Leak","লিক","leak"],["ভাঙা","Broken","ব্রোকেন","broken"],["মেরামত","Repair","রিপেয়ার","repair"],["গরম পানি","Hot water","হট ওয়াটার","hot water"],["ঠান্ডা পানি","Cold water","কোল্ড ওয়াটার","cold water"],["বিদ্যুৎ","Electricity","ইলেকট্রিসিটি","electricity"],["সমস্যা","Issue","ইস্যু","issue"]],
      [["আমার অ্যাপার্টমেন্টে লিক আছে।","There is a leak in my apartment.","দেয়ার ইজ আ লিক ইন মাই অ্যাপার্টমেন্ট"],["গরম পানি নেই।","There is no hot water.","দেয়ার ইজ নো হট ওয়াটার"],["আমার মেরামত দরকার।","I need a repair.","আই নিড আ রিপেয়ার"]]),
    topic("Banking + bills","🏦","bank, card, bill, rent, balance",
      [["ব্যাংক","Bank","ব্যাংক","bank"],["কার্ড","Card","কার্ড","card"],["বিল","Bill","বিল","bill"],["ভাড়া","Rent","রেন্ট","rent"],["টাকা","Money","মানি","money"],["জমা","Deposit","ডিপজিট","deposit"],["তোলা","Withdraw","উইথড্র","withdraw"],["ব্যালেন্স","Balance","ব্যালেন্স","balance"]],
      [["আমি ভাড়া দিতে চাই।","I want to pay rent.","আই ওয়ান্ট টু পে রেন্ট"],["আমার কার্ড কাজ করছে না।","My card is not working.","মাই কার্ড ইজ নট ওয়ার্কিং"],["আমার ব্যালেন্স কত?","What is my balance?","হোয়াট ইজ মাই ব্যালেন্স"]]),
    topic("School + child","🏫","school, teacher, homework, child sick",
      [["স্কুল","School","স্কুল","school"],["শিক্ষক","Teacher","টিচার","teacher"],["ক্লাস","Class","ক্লাস","class"],["হোমওয়ার্ক","Homework","হোমওয়ার্ক","homework"],["শিশু","Child","চাইল্ড","child"],["অসুস্থ","Sick","সিক","sick"],["অনুপস্থিত","Absent","অ্যাবসেন্ট","absent"],["দেরি","Late","লেইট","late"]],
      [["আমার শিশু অসুস্থ।","My child is sick.","মাই চাইল্ড ইজ সিক"],["আমি শিক্ষকের সাথে কথা বলতে চাই।","I want to speak with the teacher.","আই ওয়ান্ট টু স্পিক উইথ দা টিচার"],["আমরা দেরি করবো।","We will be late.","উই উইল বি লেইট"]]),
    topic("Clarify + explain","🔁","repeat, simple words, explain, write it down",
      [["মানে কী","What does it mean","হোয়াট ডাজ ইট মিন","ask meaning"],["ধীরে","Slowly","স্লোলি","slowly"],["আবার","Again","আগেইন","again"],["লিখে দিন","Write it down","রাইট ইট ডাউন","write it"],["দেখান","Show me","শো মি","show me"],["বোঝান","Explain","এক্সপ্লেইন","explain"],["একটু","A little","আ লিটল","a little"],["সহজ ভাষা","Simple words","সিম্পল ওয়ার্ডস","simple words"]],
      [["এর মানে কী?","What does this mean?","হোয়াট ডাজ দিস মিন"],["দয়া করে সহজ ভাষায় বলুন।","Please use simple words.","প্লিজ ইউজ সিম্পল ওয়ার্ডস"],["আপনি লিখে দিতে পারেন?","Can you write it down?","ক্যান ইউ রাইট ইট ডাউন"]]),
    topic("Conversation graduation","🎓","introduce yourself, explain needs, close a conversation",
      [["আত্মবিশ্বাস","Confidence","কনফিডেন্স","confidence"],["আলাপ","Conversation","কনভারসেশন","conversation"],["পরিচয়","Introduction","ইন্ট্রোডাকশন","introduction"],["প্রয়োজন","Need","নিড","need"],["মতামত","Opinion","ওপিনিয়ন","opinion"],["পরিকল্পনা","Plan","প্ল্যান","plan"],["সমস্যা","Problem","প্রবলেম","problem"],["সমাধান","Solution","সলিউশন","solution"]],
      [["আমি এখন সহজ ইংরেজি কথোপকথন করতে পারি।","I can now have a simple English conversation.","আই ক্যান নাউ হ্যাভ আ সিম্পল ইংলিশ কনভারসেশন"],["আমি আমার প্রয়োজন ব্যাখ্যা করতে পারি।","I can explain my needs.","আই ক্যান এক্সপ্লেইন মাই নিডস"],["আপনার সাথে কথা বলে ভালো লাগলো।","It was nice talking with you.","ইট ওয়াজ নাইস টকিং উইথ ইউ"]])
  ],
  en_es: [
    topic("Words + tiny sentences","🌎","hello, name, water, food, home, yes/no, thank you",
      [["Hello","Hola","OH-lah","friendly greeting"],["My name is {{name}}.","Me llamo {{name}}.","meh YAH-moh {{name}}","say your name"],["I am {{name}}.","Soy {{name}}.","soy {{name}}","identity"],["Water","Agua","AH-gwah","water"],["Food","Comida","koh-MEE-dah","food"],["Home","Casa","KAH-sah","home"],["Yes","Sí","see","yes"],["No","No","noh","no"],["Thank you","Gracias","GRAH-syahs","thanks"]],
      [["I want water.","Quiero agua.","KYEH-roh AH-gwah"],["This is food.","Esto es comida.","ES-toh es koh-MEE-dah"],["I am home.","Estoy en casa.","es-TOY en KAH-sah"]]),
    topic("Greetings + family","👨‍👩‍👧","greetings and family",
      [["Good morning","Buenos días","BWEH-nos DEE-ahs","morning greeting"],["How are you?","¿Cómo estás?","KOH-moh es-TAHS","ask how someone is"],["I am good.","Estoy bien","es-TOY byen","say you are okay"],["My","Mi","mee","my"],["Mother","Madre","MAH-dreh","mother"],["Father","Padre","PAH-dreh","father"],["Family","Familia","fah-MEE-lyah","family"],["Child","Niño / Niña","NEE-nyoh / NEE-nyah","child"]],
      [["This is my mother.","Esta es mi madre.","ES-tah es mee MAH-dreh"],["This is my family.","Esta es mi familia.","ES-tah es mee fah-MEE-lyah"],["How are you?","¿Cómo estás?","KOH-moh es-TAHS"]]),
    topic("Food + kitchen","🍽️","food and kitchen words",
      [["Kitchen","Cocina","koh-SEE-nah","kitchen"],["Rice","Arroz","ah-ROHS","rice"],["Tea","Té","teh","tea"],["Plate","Plato","PLAH-toh","plate"],["Spoon","Cuchara","koo-CHAH-rah","spoon"],["I want","Quiero","KYEH-roh","I want"],["I need","Necesito","neh-seh-SEE-toh","I need"],["Hot","Caliente","kah-LYEN-teh","hot"]],
      [["I want tea.","Quiero té.","KYEH-roh teh"],["I need a spoon.","Necesito una cuchara.","neh-seh-SEE-toh OO-nah koo-CHAH-rah"],["The rice is hot.","El arroz está caliente.","el ah-ROHS es-TAH kah-LYEN-teh"]]),
    topic("Home objects","🏠","objects inside the home",
      [["Door","Puerta","PWEHR-tah","door"],["Window","Ventana","ven-TAH-nah","window"],["Chair","Silla","SEE-yah","chair"],["Table","Mesa","MEH-sah","table"],["Bed","Cama","KAH-mah","bed"],["Key","Llave","YAH-veh","key"],["Light","Luz","loos","light"],["Bathroom","Baño","BAH-nyoh","bathroom"]],
      [["Where is the key?","¿Dónde está la llave?","DON-deh es-TAH lah YAH-veh"],["This is my chair.","Esta es mi silla.","ES-tah es mee SEE-yah"],["Please turn off the light.","Apaga la luz, por favor.","ah-PAH-gah lah loos por fah-VOR"]]),
    topic("Numbers + money","💵","numbers and money",
      [["One","Uno","OO-noh","1"],["Two","Dos","dohs","2"],["Three","Tres","trehs","3"],["Five","Cinco","SEEN-koh","5"],["Ten","Diez","dyehs","10"],["Dollar","Dólar","DOH-lahr","dollar"],["How much","Cuánto","KWAN-toh","how much"],["Price","Precio","PREH-syoh","price"]],
      [["How much is it?","¿Cuánto cuesta?","KWAN-toh KWES-tah"],["I have five dollars.","Tengo cinco dólares.","TEN-goh SEEN-koh DOH-lah-res"],["This is cheap.","Esto es barato.","ES-toh es bah-RAH-toh"]]),
    topic("Daily actions","🚶","eat, drink, go, come, sleep, work",
      [["Eat","Comer","koh-MEHR","eat"],["Drink water","Tomar agua","toh-MAHR AH-gwah","drink water"],["Go","Ir","eer","go"],["Come","Venir","veh-NEER","come"],["Sleep","Dormir","dor-MEER","sleep"],["Work","Trabajar","trah-bah-HAR","work"],["See","Ver","behr","see"],["Listen","Escuchar","es-koo-CHAR","listen"]],
      [["I go to work.","Voy al trabajo.","boy al trah-BAH-hoh"],["I drink water.","Tomo agua.","TOH-moh AH-gwah"],["I sleep at night.","Duermo por la noche.","DWEHR-moh por lah NOH-cheh"]]),
    topic("Review boss 1","🏆","survival phrases: slowly, again, understand, help",
      [["Easy","Fácil","FAH-seel","easy"],["Again","Otra vez","OH-trah ves","again"],["Slowly","Despacio","des-PAH-syoh","slowly"],["I understand","Entiendo","en-TYEN-doh","understand"],["I do not understand","No entiendo","noh en-TYEN-doh","do not understand"],["Help","Ayuda","ah-YOO-dah","help"],["Please","Por favor","por fah-VOR","please"],["Okay","Está bien","es-TAH byen","okay"]],
      [["Please speak slowly.","Habla despacio, por favor.","AH-blah des-PAH-syoh por fah-VOR"],["I do not understand.","No entiendo.","noh en-TYEN-doh"],["Say it again.","Dilo otra vez.","DEE-loh OH-trah ves"]]),
    topic("Doctor + pharmacy","🩺","doctor, medicine, pain, fever, appointment",
      [["Doctor","Doctor / Doctora","dok-TOR / dok-TOH-rah","doctor"],["Medicine","Medicina","meh-dee-SEE-nah","medicine"],["Pain","Dolor","doh-LOR","pain"],["Fever","Fiebre","FYEH-breh","fever"],["Cough","Tos","tohs","cough"],["Head","Cabeza","kah-BEH-sah","head"],["Stomach","Estómago","es-TOH-mah-goh","stomach"],["Appointment","Cita","SEE-tah","appointment"]],
      [["I have pain.","Tengo dolor.","TEN-goh doh-LOR"],["I have a fever.","Tengo fiebre.","TEN-goh FYEH-breh"],["I need a doctor.","Necesito un doctor.","neh-seh-SEE-toh oon dok-TOR"]]),
    topic("Bus + directions","🚌","transport and directions",
      [["Bus","Autobús","ow-toh-BOOS","bus"],["Street","Calle","KAH-yeh","street"],["Right","Derecha","deh-REH-chah","right"],["Left","Izquierda","ees-KYEHR-dah","left"],["Ahead","Adelante","ah-deh-LAN-teh","ahead"],["Behind","Detrás","deh-TRAS","behind"],["Where","Dónde","DON-deh","where"],["Stop","Pare","PAH-reh","stop"]],
      [["Where is the bus?","¿Dónde está el autobús?","DON-deh es-TAH el ow-toh-BOOS"],["Go right.","Ve a la derecha.","beh ah lah deh-REH-chah"],["Please stop here.","Pare aquí, por favor.","PAH-reh ah-KEE por fah-VOR"]]),
    topic("Phone + help","📱","phone and help phrases",
      [["Phone","Teléfono","teh-LEH-foh-noh","phone"],["Call","Llamar","yah-MAR","call"],["Message","Mensaje","men-SAH-heh","message"],["Charger","Cargador","kar-gah-DOR","charger"],["Number","Número","NOO-meh-roh","number"],["Problem","Problema","proh-BLEH-mah","problem"],["Help me","Ayúdame","ah-YOO-dah-meh","help me"],["Later","Más tarde","mahs TAR-deh","later"]],
      [["I need my phone.","Necesito mi teléfono.","neh-seh-SEE-toh mee teh-LEH-foh-noh"],["Help me, please.","Ayúdame, por favor.","ah-YOO-dah-meh por fah-VOR"],["I will call later.","Voy a llamar más tarde.","boy ah yah-MAR mahs TAR-deh"]]),
    topic("Work + store","💼","work and store phrases",
      [["Work","Trabajo","trah-BAH-hoh","work"],["Store","Tienda","TYEN-dah","store"],["Manager","Gerente","heh-REN-teh","manager"],["Customer","Cliente","klee-EN-teh","customer"],["Receipt","Recibo","reh-SEE-boh","receipt"],["Bag","Bolsa","BOL-sah","bag"],["Today","Hoy","oy","today"],["Tomorrow","Mañana","mah-NYAH-nah","tomorrow"]],
      [["I work today.","Trabajo hoy.","trah-BAH-hoh oy"],["Do you need a receipt?","¿Necesita un recibo?","neh-seh-SEE-tah oon reh-SEE-boh"],["Where is the manager?","¿Dónde está el gerente?","DON-deh es-TAH el heh-REN-teh"]]),
    topic("Question words","❓","who, what, where, when, why, how",
      [["Who","Quién","kyen","who"],["What","Qué","keh","what"],["Where","Dónde","DON-deh","where"],["When","Cuándo","KWAN-doh","when"],["Why","Por qué","por keh","why"],["How","Cómo","KOH-moh","how"],["Which","Cuál","kwal","which"],["How many","Cuántos","KWAN-tohs","how many"]],
      [["Who are you?","¿Quién eres?","kyen EH-res"],["What is this?","¿Qué es esto?","keh es ES-toh"],["Where are you going?","¿A dónde vas?","ah DON-deh bahs"]]),
    topic("Past + future","🔄","yesterday, tomorrow, went, will try",
      [["Yesterday","Ayer","ah-YEHR","yesterday"],["Tomorrow","Mañana","mah-NYAH-nah","tomorrow"],["Went","Fui","fwee","went"],["Will do","Voy a hacer","boy ah ah-SEHR","will do"],["Will go","Voy a ir","boy ah eer","will go"],["Will try","Voy a intentar","boy ah in-ten-TAR","will try"],["Will learn","Voy a aprender","boy ah ah-pren-DEHR","will learn"],["Was","Estaba","es-TAH-bah","was"]],
      [["I went to work yesterday.","Fui al trabajo ayer.","fwee al trah-BAH-hoh ah-YEHR"],["I will go to the market tomorrow.","Voy al mercado mañana.","boy al mer-KAH-doh mah-NYAH-nah"],["I will try.","Voy a intentar.","boy ah in-ten-TAR"]]),
    topic("Apartment + repair","🔧","leak, broken, water, repair",
      [["Apartment","Apartamento","ah-par-tah-MEN-toh","apartment"],["Leak","Fuga","FOO-gah","leak"],["Broken","Roto","ROH-toh","broken"],["Repair","Reparación","reh-pah-rah-SYON","repair"],["Hot water","Agua caliente","AH-gwah kah-LYEN-teh","hot water"],["Cold water","Agua fría","AH-gwah FREE-ah","cold water"],["Electricity","Electricidad","eh-lek-tree-see-DAHD","electricity"],["Issue","Problema","proh-BLEH-mah","issue"]],
      [["There is a leak in my apartment.","Hay una fuga en mi apartamento.","eye OO-nah FOO-gah en mee ah-par-tah-MEN-toh"],["There is no hot water.","No hay agua caliente.","noh eye AH-gwah kah-LYEN-teh"],["I need a repair.","Necesito una reparación.","neh-seh-SEE-toh OO-nah reh-pah-rah-SYON"]]),
    topic("School + child","🏫","school and child care",
      [["School","Escuela","es-KWEH-lah","school"],["Teacher","Maestro / Maestra","mah-ES-troh / mah-ES-trah","teacher"],["Class","Clase","KLAH-seh","class"],["Homework","Tarea","tah-REH-ah","homework"],["Child","Niño / Niña","NEE-nyoh / NEE-nyah","child"],["Sick","Enfermo","en-FEHR-moh","sick"],["Absent","Ausente","ow-SEN-teh","absent"],["Late","Tarde","TAR-deh","late"]],
      [["My child is sick.","Mi hijo está enfermo.","mee EE-hoh es-TAH en-FEHR-moh"],["I want to speak with the teacher.","Quiero hablar con la maestra.","KYEH-roh ah-BLAR kon lah mah-ES-trah"],["We will be late.","Vamos a llegar tarde.","BAH-mohs ah yeh-GAR TAR-deh"]]),
    topic("Clarify + explain","🔁","repeat, simple words, explain, write it down",
      [["What does it mean","Qué significa","keh seeg-nee-fee-KAH","meaning"],["Slowly","Despacio","des-PAH-syoh","slowly"],["Again","Otra vez","OH-trah ves","again"],["Write it down","Escríbalo","es-KREE-bah-loh","write it"],["Show me","Muéstrame","MWES-trah-meh","show me"],["Explain","Explicar","eks-plee-KAR","explain"],["A little","Un poco","oon POH-koh","a little"],["Simple words","Palabras simples","pah-LAH-brahs SEEM-ples","simple words"]],
      [["What does this mean?","¿Qué significa esto?","keh seeg-nee-fee-KAH ES-toh"],["Please use simple words.","Use palabras simples, por favor.","OO-seh pah-LAH-brahs SEEM-ples por fah-VOR"],["Can you write it down?","¿Puede escribirlo?","PWEH-deh es-kree-BEER-loh"]]),
    topic("Conversation graduation","🎓","speak with a native Spanish speaker",
      [["Confidence","Confianza","kon-FYAN-sah","confidence"],["Conversation","Conversación","kon-behr-sah-SYON","conversation"],["Introduction","Introducción","een-troh-dook-SYON","introduction"],["Need","Necesidad","neh-seh-see-DAHD","need"],["Opinion","Opinión","oh-pee-NYON","opinion"],["Plan","Plan","plahn","plan"],["Problem","Problema","proh-BLEH-mah","problem"],["Solution","Solución","soh-loo-SYON","solution"]],
      [["I can now have a simple Spanish conversation.","Ahora puedo tener una conversación sencilla en español.","ah-OH-rah PWEH-doh teh-NEHR OO-nah kon-behr-sah-SYON sen-SEE-yah en es-pah-NYOL"],["I can explain my needs.","Puedo explicar mis necesidades.","PWEH-doh eks-plee-KAR mees neh-seh-see-DAH-des"],["It was nice talking with you.","Fue un gusto hablar contigo.","fweh oon GOOS-toh ah-BLAR kon-TEE-goh"]])
  ]
};

const COURSE_MAP = {
  bn_en: buildCourse("bn_en","Learn English through Bangla","English through Bangla","For Bengali-speaking beginners who know Bangla and start English from zero.","ধীরে ধীরে, ছোট ছোট ধাপে, বাস্তব জীবনের English শিখুন।","bn-BD","en-US","Bangla","English"),
  en_es: buildCourse("en_es","Learn Spanish through English","Spanish through English","For English-speaking beginners building Spanish through tiny daily lessons.","Learn practical Spanish through sound, games, and short daily wins.","en-US","es-ES","English","Spanish")
};

let state = loadState();
let selectedMatch = null, matchDone = new Set(), builtWords = [], challenge = null;
let cloudSyncTimer = null, isHydratingCloud = false, remoteLeaders = [], leaderboardLoading = false, lastLeaderboardFetch = 0;
const $ = (id) => document.getElementById(id);
const screen = $("screen"), toast = $("toast"), drawer = $("drawer"), menuBtn = $("menuBtn"), closeDrawer = $("closeDrawer"), soundToggle = $("soundToggle"), subtitle = $("subtitle");
init();

function topic(title, icon, theme, words, sentences){ return {title,icon,theme,words,sentences}; }
function buildCourse(id,title,shortTitle,learner,homeLine,sourceLang,targetLang,sourceLabel,targetLabel){
  const seeds = TOPICS[id];
  const units = [];
  for(let day=1; day<=60; day++){
    const base = seeds[(day-1) % seeds.length];
    const cycle = Math.floor((day-1) / seeds.length);
    const boss = day % 7 === 0 || day === 60 || /boss|graduation/i.test(base.title);
    const words = base.words.map((w,i)=>({id:`d${day}w${i+1}`, source:w[0], target:w[1], roman:w[2], meaning:w[3]}));
    const sentences = base.sentences.map((s,i)=>({id:`d${day}s${i+1}`, source:s[0], target:s[1], roman:s[2]}));
    const suffix = cycle ? ` · Spiral ${cycle+1}` : "";
    const activities = [
      {type:"explain",title:id==="bn_en"?"আজকের লক্ষ্য":"Today’s mission"},
      {type:"learn",title:id==="bn_en"?"শুনুন ও বলুন":"Listen and copy",item:words[0].id},
      {type:"learn",title:id==="bn_en"?"দ্বিতীয় দরকারি শব্দ":"Second power word",item:words[1].id},
      {type:"tap",title:id==="bn_en"?"সঠিক meaning বাছুন":"Tap the meaning",word:words[2].id,direction:"sourceToTarget"},
      {type:"match",title:id==="bn_en"?"শব্দ মিলান":"Match words",count:4},
      {type:"build",title:id==="bn_en"?"বাক্য সাজান":"Build the sentence",sentence:sentences[0].id},
      {type:"fill",title:id==="bn_en"?"খালি জায়গা পূরণ করুন":"Fill the missing word",sentence:sentences[1].id},
      {type:"listen",title:id==="bn_en"?"শুনে বাছুন":"Listen and choose",word:words[3].id},
      {type:"speak",title:id==="bn_en"?"মুখে বলুন":"Say it out loud",sentence:sentences[2].id}
    ];
    if(boss){
      activities.splice(8,0,{type:"scenario",title:id==="bn_en"?"বস রোলপ্লে":"Boss roleplay",sentence:sentences[0].id});
      activities.splice(9,0,{type:"mixed",title:id==="bn_en"?"মিশ্র challenge":"Mixed challenge",count:5});
    }
    activities.push({type:"finish",title:`Day ${day} complete`});
    units.push({
      id:`day${day}`, day, title:`Day ${day}: ${base.title}${suffix}`, icon:base.icon, theme:base.theme,
      goal: boss ? `${base.theme}. Boss review mixes older and newer language.` : base.theme,
      objective: id==="bn_en" ? `আজকের লক্ষ্য: ${base.theme} নিয়ে আত্মবিশ্বাস তৈরি করা।` : `Build confidence with ${base.theme}.`,
      explanation: id==="bn_en" ? "আগে অর্থ বুঝুন, তারপর শুনুন ও মুখে বলুন। Grammar ধীরে ধীরে pattern দিয়ে আসবে।" : "First understand meaning, then listen and speak. Grammar comes through repeated patterns.",
      words, sentences, activities, boss
    });
  }
  return {id,title,shortTitle,learner,homeLine,sourceLang,targetLang,sourceLabel,targetLabel,xpPerCorrect:10,latestDay:60,units};
}

function init(){ repairDailyStreak(); applyA11y(); wireShell(); wireBackendEvents(); render(); if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{})); }
function wireShell(){
  menuBtn.addEventListener("click",()=>{drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");menuBtn.setAttribute("aria-expanded","true");});
  closeDrawer.addEventListener("click",closeDrawerFn); drawer.addEventListener("click",e=>{if(e.target===drawer)closeDrawerFn();});
  soundToggle.addEventListener("click",()=>{state.sound=!state.sound;saveState();updateSoundIcon();toastMsg(state.sound?"Sound on.":"Sound off.");});
  document.body.addEventListener("click",e=>{const nav=e.target.closest("[data-view]"); if(!nav) return; state.view=nav.dataset.view; saveState(); closeDrawerFn(); render();});
  updateSoundIcon();
}
function closeDrawerFn(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");menuBtn.setAttribute("aria-expanded","false");}
function render(){
  const course = currentCourse(); subtitle.textContent = `${course.shortTitle} · ${APP_VERSION}`;
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.view===state.view));
  selectedMatch=null; matchDone=new Set(); builtWords=[]; ensureActiveUnit();
  if(!state.profile?.mode) return renderAuth();
  screen.innerHTML = ""; screen.focus({preventScroll:true});
  const views = {home:renderHome,course:renderCourse,review:renderReview,games:renderGames,vocab:renderVocab,sentences:renderSentences,sound:renderSoundLab,leaderboard:renderLeaderboard,progress:renderProgress,help:renderHelp,about:renderAbout,settings:renderSettings};
  (views[state.view] || renderHome)();
}
function renderAuth(){
  const status = backendReady() ? "Firebase ready" : "Firebase loading/offline — local mode still works";
  screen.innerHTML = `<section class="auth-wrap"><div class="hero auth-card"><div class="eyebrow">Language Ai · Firebase Course</div><h1>Start cloud, guest, or phone-only.</h1><p>Create an account for synced progress and public leaderboard, or keep learning on this phone only.</p><div class="stack mt"><input id="profileName" class="input" placeholder="Display name" maxlength="24" /><select id="profileCourse" class="input"><option value="bn_en">Learn English through Bangla</option><option value="en_es">Learn Spanish through English</option></select><div class="mini-divider"><span>Cloud account</span></div><input id="emailInput" class="input" placeholder="Email" type="email" autocomplete="email" /><input id="passwordInput" class="input" placeholder="Password · 6+ characters" type="password" autocomplete="current-password" /><div class="button-row"><button id="signupBtn" class="primary-btn">Create Firebase Account</button><button id="signinBtn" class="secondary-btn">Sign In</button></div><button id="guestBtn" class="secondary-btn">Continue as Cloud Guest</button><div class="mini-divider"><span>Fallback</span></div><button id="createBtn" class="secondary-btn">Use This Phone Only</button><p class="tiny">${status}. Email/password and anonymous auth must be enabled in Firebase Console.</p></div></div></section>`;
  $("guestBtn").addEventListener("click",()=>createProfile(($("profileName").value||"Guest "+NAMES[Math.floor(Math.random()*NAMES.length)]).trim(), "guest"));
  $("createBtn").addEventListener("click",()=>createProfile(($("profileName").value||"Learner").trim(), "local"));
  $("signupBtn").addEventListener("click",()=>createFirebaseAccount("signup"));
  $("signinBtn").addEventListener("click",()=>createFirebaseAccount("signin"));
  $("profileCourse").addEventListener("change",e=>{state.courseId=e.target.value; saveState();});
}
async function createProfile(name, mode){
  state.courseId=$("profileCourse")?.value||state.courseId||"bn_en";
  name=cleanText(name||"Learner").slice(0,24);
  if(mode==="guest" && backendReady()){
    try{ toastMsg("Connecting guest cloud profile..."); const user=await window.LanguageAiBackend.signInGuest(name); await activateCloudProfile(user,"firebaseGuest",name); toastMsg("Cloud guest ready."); return; }
    catch(err){ toastMsg(firebaseFriendlyError(err)+" Using phone-only guest."); }
  }
  state.profile={name,mode,createdAt:Date.now()}; saveState(); toastMsg(mode==="guest"?"Guest mode ready on this phone.":"Phone-only profile created."); render();
}
async function createFirebaseAccount(action){
  if(!backendReady()){ toastMsg("Firebase is still loading. Try again, or use phone-only mode."); return; }
  const name=cleanText(($("profileName")?.value||"Learner").trim()).slice(0,24);
  const email=($("emailInput")?.value||"").trim();
  const password=$("passwordInput")?.value||"";
  state.courseId=$("profileCourse")?.value||state.courseId||"bn_en";
  if(!email || password.length<6){ toastMsg("Enter email and a 6+ character password."); return; }
  try{
    toastMsg(action==="signup"?"Creating cloud account...":"Signing in...");
    const user = action==="signup" ? await window.LanguageAiBackend.createAccount(email,password,name) : await window.LanguageAiBackend.signIn(email,password);
    await activateCloudProfile(user,"firebase",name||user.displayName||"Learner");
    toastMsg(action==="signup"?"Cloud account created.":"Signed in. Progress synced.");
  }catch(err){ toastMsg(firebaseFriendlyError(err)); }
}
async function activateCloudProfile(user,mode,name){
  state.profile={name:cleanText(user?.displayName||name||"Learner").slice(0,24),mode,uid:user?.uid||"",email:user?.email||"",createdAt:state.profile?.createdAt||Date.now()};
  const loaded = await loadCloudProgressIntoState(true);
  saveState(); updateLocalLeaderboard(); await syncCloudProgress(); render();
  return loaded;
}

function renderHome(){
  const course=currentCourse(), unit=currentUnit(), next=nextUnlockedUnit(course), pct=coursePercent(course), completed=course.units.filter(u=>isUnitComplete(course,u)).length;
  screen.innerHTML = `<section class="hero"><div class="eyebrow">${APP_VERSION} · 60 days per course</div><h1>Tiny wins. Real speaking.</h1><p>${resolve(course.homeLine,course,unit)}</p><div class="stats-row mt"><div class="stat-card"><strong>${state.xp}</strong><span>Total XP</span></div><div class="stat-card"><strong>${state.coins}</strong><span>Coins</span></div><div class="stat-card"><strong>${state.hearts}</strong><span>Hearts</span></div><div class="stat-card"><strong>${state.streak}</strong><span>Day streak</span></div></div><div class="progress-wrap mt"><div class="progress-bar" style="width:${pct}%"></div></div></section>
  <section class="course-grid">${Object.values(COURSE_MAP).map(c=>`<button class="course-card ${state.courseId===c.id?"active":""}" data-course="${c.id}"><span class="badge ${c.id==="bn_en"?"hot":"cool"}">Course ${c.id==="bn_en"?"A":"B"}</span><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.learner)}</p><div class="course-meta"><span class="badge good">${c.latestDay} days</span><span class="badge">Audio</span><span class="badge">Games</span><span class="badge gold">Boss levels</span></div></button>`).join("")}</section>
  <section class="card stack mt"><div class="eyebrow">Current path</div><div class="lesson-header"><div class="lesson-icon">${unit.icon}</div><div><h1>${escapeHtml(unit.title)}</h1><p>${escapeHtml(unit.goal)} · ${completed}/${course.units.length} days complete</p></div></div><div class="pill-row"><div class="pill"><strong>${pct}%</strong><br><span>course</span></div><div class="pill"><strong>${allOpenWords(course).length}</strong><br><span>words open</span></div><div class="pill"><strong>${mistakeCards(course).length}</strong><br><span>review cards</span></div></div><button class="primary-btn" id="startBtn">${unitProgress(unit)>0?"Continue lesson":"Start "+escapeHtml(next.title)}</button><button class="secondary-btn" data-view="review">Quick review</button></section>`;
  screen.querySelectorAll("[data-course]").forEach(btn=>btn.addEventListener("click",()=>{state.courseId=btn.dataset.course; ensureActiveUnit(); saveState(); render();}));
  $("startBtn").addEventListener("click",()=>{setActiveUnit(course.id,next.id);state.view="course";saveState();render();});
}
function renderCourse(){
  const course=currentCourse(), unit=currentUnit(), idx=unitProgress(unit), activity=unit.activities[idx]||unit.activities.at(-1);
  const pct = Math.round((Math.min(idx,unit.activities.length-1)/(unit.activities.length-1))*100);
  const chips = course.units.map(u=>{const locked=!isUnitUnlocked(course,u), complete=isUnitComplete(course,u), active=u.id===unit.id;return `<button class="day-chip ${active?"active":""} ${complete?"complete":""}" data-unit="${u.id}" ${locked?"disabled":""}><span>${locked?"🔒":complete?"✅":u.icon}</span><strong>${u.day}</strong></button>`}).join("");
  screen.innerHTML = `<section class="card stack"><div class="day-strip">${chips}</div><div class="lesson-header"><div class="lesson-icon">${unit.icon}</div><div><h1>${escapeHtml(unit.title)}</h1><p>${escapeHtml(unit.theme)}${unit.boss?" · Boss level":""}</p></div></div><div class="pill-row"><div class="pill"><strong>${idx+1}/${unit.activities.length}</strong><br><span>steps</span></div><div class="pill"><strong>${"❤️".repeat(Math.max(0,state.hearts))}</strong><br><span>hearts</span></div><div class="pill"><strong>${state.xp}</strong><br><span>XP</span></div></div><div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div></section><section id="activity" class="mt"></section>`;
  screen.querySelectorAll("[data-unit]").forEach(btn=>btn.addEventListener("click",()=>{setActiveUnit(course.id,btn.dataset.unit);saveState();render();}));
  const holder=$("activity"); ({explain:renderExplain,learn:renderLearn,tap:renderTap,match:renderMatch,build:renderBuild,fill:renderFill,listen:renderListen,speak:renderSpeak,scenario:renderScenario,mixed:renderMixed,finish:renderFinish}[activity.type]||renderExplain)(holder,activity,course,unit);
}
function renderExplain(holder,a,course,unit){
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><h1 class="section-title">${escapeHtml(unit.objective)}</h1><p class="lead">${escapeHtml(unit.explanation)}</p><div class="mini-list"><strong>Today’s words</strong><div class="course-meta">${unit.words.slice(0,8).map(w=>`<span class="badge">${resolve(w.target,course,unit)}</span>`).join("")}</div></div><div class="example-stack">${unit.sentences.map(s=>exampleRow(s,course,unit)).join("")}</div><button class="primary-btn" id="nextBtn">Start lesson</button></div>`;
  wireSpeak(holder); $("nextBtn").addEventListener("click",()=>awardAndNext(false));
}
function renderLearn(holder,a,course,unit){
  const w=findWord(unit,a.item);
  holder.innerHTML = `<div class="word-card"><div class="eyebrow">${escapeHtml(a.title)}</div><div class="script-word">${resolve(w.source,course,unit)}</div><div class="big-word">${resolve(w.target,course,unit)}</div><div class="pronounce">${resolve(w.roman,course,unit)}</div><div class="meaning">${escapeHtml(w.meaning)}</div><div class="audio-row mt"><button class="small-action" data-speak="${escapeAttr(resolve(w.source,course,unit))}" data-lang="${course.sourceLang}">🔊 ${course.sourceLabel}</button><button class="small-action" data-speak="${escapeAttr(resolve(w.target,course,unit))}" data-lang="${course.targetLang}">🔊 ${course.targetLabel}</button><button class="small-action" data-speak="${escapeAttr(resolve(w.target,course,unit))}" data-lang="${course.targetLang}" data-rate="0.62">🐢 Slow</button></div></div><div class="stack mt"><button class="primary-btn" id="nextBtn">I listened</button><button class="secondary-btn" id="repeatBtn">Repeat both</button></div>`;
  wireSpeak(holder); $("repeatBtn").addEventListener("click",()=>speakSequence([{text:resolve(w.source,course,unit),lang:course.sourceLang},{text:resolve(w.target,course,unit),lang:course.targetLang,rate:.70}])); $("nextBtn").addEventListener("click",()=>awardAndNext(false)); setTimeout(()=>speak(resolve(w.target,course,unit),course.targetLang,.75),220);
}
function renderTap(holder,a,course,unit){
  const w=findWord(unit,a.word), correct=resolve(w.target,course,unit), prompt=resolve(w.source,course,unit);
  const options=optionSet(correct,unit.words.map(x=>resolve(x.target,course,unit)));
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><h1 class="section-title">${escapeHtml(prompt)}</h1><div class="choice-grid">${options.map(o=>`<button class="choice" data-answer="${escapeAttr(o)}">${escapeHtml(o)}</button>`).join("")}</div><div id="feedback" class="feedback"></div></div>`;
  holder.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>checkChoice(holder,btn,btn.dataset.answer,correct,prompt)));
}
function renderMatch(holder,a,course,unit){
  const pairs=unit.words.slice(0,a.count||4).map(w=>[resolve(w.source,course,unit),resolve(w.target,course,unit)]);
  const cards=shuffle(pairs.flatMap((p,i)=>[{pair:i,text:p[0],side:"a"},{pair:i,text:p[1],side:"b"}]));
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><p class="lead">Tap two cards that belong together.</p><div class="memory-grid">${cards.map(c=>`<button class="memory-card" data-pair="${c.pair}" data-side="${c.side}">${escapeHtml(c.text)}</button>`).join("")}</div><div id="feedback" class="feedback"></div></div>`;
  holder.querySelectorAll(".memory-card").forEach(btn=>btn.addEventListener("click",()=>{
    if(btn.classList.contains("done")) return;
    if(!selectedMatch){ selectedMatch=btn; btn.classList.add("good"); return; }
    if(selectedMatch===btn) return;
    const ok=selectedMatch.dataset.pair===btn.dataset.pair && selectedMatch.dataset.side!==btn.dataset.side;
    if(ok){ selectedMatch.classList.add("done"); btn.classList.add("done"); matchDone.add(btn.dataset.pair); showFeedback(holder,true,"Matched. Nice memory."); state.xp+=5; if(matchDone.size>=pairs.length) setTimeout(()=>awardAndNext(true),520); }
    else { btn.classList.add("bad"); showFeedback(holder,false,"Close. Try a different pair."); loseHeart(); setTimeout(()=>btn.classList.remove("bad"),450); }
    selectedMatch.classList.remove("good"); selectedMatch=null; saveState();
  }));
}
function renderBuild(holder,a,course,unit){
  const s=findSentence(unit,a.sentence), target=resolve(s.target,course,unit), answer=target.split(/\s+/);
  const distract=unit.words.slice(0,5).map(w=>resolve(w.target,course,unit).replace(/[.?!¿¡]/g,""));
  const tiles=shuffle(unique([...answer,...distract])).slice(0,Math.max(6,answer.length+2)); builtWords=[];
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><p class="lead">${escapeHtml(resolve(s.source,course,unit))}</p><div id="built" class="tile-zone"></div><div class="tile-zone">${tiles.map(t=>`<button class="tile" data-tile="${escapeAttr(t)}">${escapeHtml(t)}</button>`).join("")}</div><div id="feedback" class="feedback"></div><div class="button-row"><button id="clearBtn" class="secondary-btn">Clear</button><button id="checkBtn" class="primary-btn">Check</button></div></div>`;
  renderBuilt(); holder.querySelectorAll("[data-tile]").forEach(btn=>btn.addEventListener("click",()=>{builtWords.push(btn.dataset.tile);btn.disabled=true;renderBuilt();}));
  $("clearBtn").addEventListener("click",()=>renderBuild(holder,a,course,unit));
  $("checkBtn").addEventListener("click",()=>{const ok=normalize(builtWords.join(" "))===normalize(target); if(ok){showFeedback(holder,true,"Perfect sentence.");addMastered(target);setTimeout(()=>awardAndNext(true),650);} else {showFeedback(holder,false,`Target: ${target}`);registerMistake(resolve(s.source,course,unit),target);loseHeart();saveState();}});
}
function renderBuilt(){const z=$("built"); if(!z)return; z.innerHTML=builtWords.map((w,i)=>`<button class="tile" data-remove="${i}">${escapeHtml(w)}</button>`).join("") || `<span class="tiny">Build here</span>`; z.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{builtWords.splice(Number(b.dataset.remove),1);renderBuilt();}));}
function renderFill(holder,a,course,unit){
  const s=findSentence(unit,a.sentence), target=resolve(s.target,course,unit), words=target.split(/\s+/), idx=Math.max(0,Math.floor(words.length/2)), missing=words[idx].replace(/[.?!]/g,"");
  words[idx]="_____"; const options=optionSet(missing,unit.words.slice(0,6).map(w=>resolve(w.target,course,unit).split(/\s+/)[0].replace(/[.?!]/g,"")));
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><p class="lead">${escapeHtml(resolve(s.source,course,unit))}</p><h1 class="section-title">${escapeHtml(words.join(" "))}</h1><div class="choice-grid">${options.map(o=>`<button class="choice" data-answer="${escapeAttr(o)}">${escapeHtml(o)}</button>`).join("")}</div><div id="feedback" class="feedback"></div></div>`;
  holder.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>checkChoice(holder,btn,btn.dataset.answer,missing,target)));
}
function renderListen(holder,a,course,unit){
  const w=findWord(unit,a.word), correct=resolve(w.source,course,unit), options=optionSet(correct,unit.words.map(x=>resolve(x.source,course,unit)));
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><h1 class="section-title">Tap play, then choose meaning.</h1><button class="primary-btn" id="playBtn">🔊 Play</button><div class="choice-grid">${options.map(o=>`<button class="choice" data-answer="${escapeAttr(o)}">${escapeHtml(o)}</button>`).join("")}</div><div id="feedback" class="feedback"></div></div>`;
  $("playBtn").addEventListener("click",()=>speak(resolve(w.target,course,unit),course.targetLang,.75));
  holder.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>checkChoice(holder,btn,btn.dataset.answer,correct,resolve(w.target,course,unit))));
  setTimeout(()=>speak(resolve(w.target,course,unit),course.targetLang,.75),300);
}
function renderSpeak(holder,a,course,unit){
  const s=findSentence(unit,a.sentence), target=resolve(s.target,course,unit);
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><h1 class="section-title">${escapeHtml(target)}</h1><p class="lead">${escapeHtml(resolve(s.source,course,unit))} · ${escapeHtml(resolve(s.roman,course,unit))}</p><div class="audio-row"><button class="small-action" data-speak="${escapeAttr(target)}" data-lang="${course.targetLang}">🔊 Normal</button><button class="small-action" data-speak="${escapeAttr(target)}" data-lang="${course.targetLang}" data-rate="0.62">🐢 Slow</button><button class="small-action" id="recordBtn">🎙️ Try speaking</button></div><div id="feedback" class="feedback"></div><button class="primary-btn" id="saidBtn">I said it out loud</button></div>`;
  wireSpeak(holder); $("saidBtn").addEventListener("click",()=>{addMastered(target);awardAndNext(true);}); $("recordBtn").addEventListener("click",()=>speechCheck(target,course.targetLang,holder));
}
function renderScenario(holder,a,course,unit){
  const s=findSentence(unit,a.sentence);
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><h1 class="section-title">Roleplay moment.</h1><p class="lead">Imagine a real person is waiting. First listen, then answer with this sentence.</p>${exampleRow(s,course,unit)}<button class="primary-btn" id="nextBtn">I can use this in real life</button><div id="feedback" class="feedback show good">Mistakes are safe here. Real confidence grows by repeating.</div></div>`;
  wireSpeak(holder); $("nextBtn").addEventListener("click",()=>awardAndNext(true));
}
function renderMixed(holder,a,course,unit){
  const q=unit.words.slice(0,a.count||5);
  holder.innerHTML = `<div class="card stack"><div class="eyebrow">${escapeHtml(a.title)}</div><h1 class="section-title">Rapid calm review.</h1><p class="lead">No timer by default. Tap each target word once after saying it.</p><div class="choice-grid">${q.map(w=>`<button class="choice" data-master="${escapeAttr(resolve(w.target,course,unit))}">${resolve(w.source,course,unit)} → <strong>${resolve(w.target,course,unit)}</strong></button>`).join("")}</div><button class="primary-btn" id="nextBtn">Complete mixed review</button></div>`;
  holder.querySelectorAll("[data-master]").forEach(b=>b.addEventListener("click",()=>{b.classList.add("good");addMastered(b.dataset.master);state.xp+=3;saveState();}));
  $("nextBtn").addEventListener("click",()=>awardAndNext(true));
}
function renderFinish(holder,a,course,unit){
  holder.innerHTML = `<div class="hero stack"><div class="eyebrow">Complete</div><h1>${unit.boss?"Boss cleared.":"Day cleared."}</h1><p>You earned progress, review cards, and a stronger speaking habit.</p><div class="stats-row"><div class="stat-card"><strong>+25</strong><span>finish XP</span></div><div class="stat-card"><strong>+5</strong><span>coins</span></div><div class="stat-card"><strong>${nextUnitAfter(course,unit)?"Unlock":"Done"}</strong><span>next</span></div></div><button class="primary-btn" id="finishBtn">Claim reward</button></div>`;
  $("finishBtn").addEventListener("click",()=>{state.completed[unitKey(course.id,unit.id)]=true;state.xp+=25;state.coins+=5;state.hearts=5;const next=nextUnitAfter(course,unit);if(next)setActiveUnit(course.id,next.id);saveState();confetti();updateLocalLeaderboard();state.view=next?"course":"progress";render();});
}
function checkChoice(holder,btn,given,correct,prompt){const ok=normalize(given)===normalize(correct);btn.classList.add(ok?"good":"bad");if(ok){showFeedback(holder,true,"Correct. Say it once out loud.");addMastered(correct);setTimeout(()=>awardAndNext(true),620);}else{showFeedback(holder,false,`Not yet. Correct: ${correct}`);registerMistake(prompt,correct);loseHeart();saveState();}}
function exampleRow(s,course,unit){return `<article class="example-row"><div><strong>${resolve(s.target,course,unit)}</strong><p>${resolve(s.source,course,unit)} · ${resolve(s.roman,course,unit)}</p></div><button class="small-action" data-speak="${escapeAttr(resolve(s.target,course,unit))}" data-lang="${course.targetLang}">🔊</button></article>`;}

function renderReview(){const course=currentCourse(), cards=spacedReview(course).slice(0,12);screen.innerHTML=`<section class="hero"><div class="eyebrow">Review mode</div><h1>Older words come back.</h1><p>Spaced repetition mixes mistakes, older lessons, and current words.</p></section><section class="stack mt">${cards.map(w=>`<article class="card stack"><div class="lesson-header"><div class="lesson-icon">🧠</div><div><h1>${resolve(w.target,course,currentUnit())}</h1><p>${resolve(w.source,course,currentUnit())} · ${resolve(w.roman,course,currentUnit())}</p></div></div><div class="audio-row"><button class="small-action" data-speak="${escapeAttr(resolve(w.target,course,currentUnit()))}" data-lang="${course.targetLang}">🔊 Hear</button><button class="small-action" data-master="${escapeAttr(resolve(w.target,course,currentUnit()))}">✅ I know this</button></div></article>`).join("")}</section>`;wireSpeakAndMaster();}
function renderGames(){const course=currentCourse();screen.innerHTML=`<section class="hero"><div class="eyebrow">Mini games</div><h1>Practice without pressure.</h1><p>No timer by default. Speed round is optional for confident learners.</p></section><section class="grid mt"><button class="course-card" data-game="memory"><h2>🃏 Memory cards</h2><p>Flip and match words.</p></button><button class="course-card" data-game="boss"><h2>🏆 Boss challenge</h2><p>Mix tap, listen, and sentence building.</p></button><button class="course-card" data-game="speed"><h2>⚡ Gentle speed round</h2><p>Optional quick review.</p></button></section><section id="gameBox" class="mt"></section>`;screen.querySelectorAll("[data-game]").forEach(b=>b.addEventListener("click",()=>renderGameBox(b.dataset.game,course)));}
function renderGameBox(type,course){const box=$("gameBox"), words=shuffle(spacedReview(course)).slice(0,6);if(type==="memory"){const cards=shuffle(words.flatMap((w,i)=>[{i,text:resolve(w.source,course,currentUnit()),side:"s"},{i,text:resolve(w.target,course,currentUnit()),side:"t"}]));box.innerHTML=`<div class="card stack"><div class="eyebrow">Memory</div><div class="memory-grid">${cards.map(c=>`<button class="memory-card" data-pair="${c.i}" data-side="${c.side}">${escapeHtml(c.text)}</button>`).join("")}</div><div id="feedback" class="feedback"></div></div>`;box.querySelectorAll(".memory-card").forEach(btn=>btn.addEventListener("click",()=>{if(btn.classList.contains("done"))return;if(!selectedMatch){selectedMatch=btn;btn.classList.add("good");return;}const ok=selectedMatch.dataset.pair===btn.dataset.pair&&selectedMatch.dataset.side!==btn.dataset.side;if(ok){selectedMatch.classList.add("done");btn.classList.add("done");state.xp+=6;showFeedback(box,true,"Match!");}else{btn.classList.add("bad");loseHeart();showFeedback(box,false,"Try another pair.");setTimeout(()=>btn.classList.remove("bad"),400);}selectedMatch.classList.remove("good");selectedMatch=null;saveState();}));}else{challenge={type,words,index:0,score:0};renderChallengeQuestion(course);}}
function renderChallengeQuestion(course){const box=$("gameBox"), w=challenge.words[challenge.index];if(!w){box.innerHTML=`<div class="hero"><div class="eyebrow">Game complete</div><h1>${challenge.score}/${challenge.words.length}</h1><p>Great practice. XP was saved.</p></div>`;updateLocalLeaderboard();return;}const correct=resolve(w.target,course,currentUnit()), options=optionSet(correct,challenge.words.map(x=>resolve(x.target,course,currentUnit())));box.innerHTML=`<div class="card stack"><div class="eyebrow">${challenge.type==="speed"?"Optional speed":"Boss"} · ${challenge.index+1}/${challenge.words.length}</div><h1 class="section-title">${resolve(w.source,course,currentUnit())}</h1><div class="choice-grid">${options.map(o=>`<button class="choice" data-answer="${escapeAttr(o)}">${escapeHtml(o)}</button>`).join("")}</div><div id="feedback" class="feedback"></div></div>`;box.querySelectorAll(".choice").forEach(btn=>btn.addEventListener("click",()=>{const ok=normalize(btn.dataset.answer)===normalize(correct);btn.classList.add(ok?"good":"bad");if(ok){challenge.score++;state.xp+=8;}else{loseHeart();registerMistake(resolve(w.source,course,currentUnit()),correct);}challenge.index++;saveState();setTimeout(()=>renderChallengeQuestion(course),520);}));}
function renderVocab(){const course=currentCourse(), words=allOpenWords(course);screen.innerHTML=`<section class="hero"><div class="eyebrow">Vocabulary bank</div><h1>${words.length} open words.</h1><p>Search, listen, and mark practiced.</p><input id="searchBox" class="input mt" placeholder="Search words" /></section><section id="vocabList" class="stack mt"></section>`;const draw=()=>{const q=normalize($("searchBox").value);$("vocabList").innerHTML=words.filter(w=>!q||normalize(resolve(w.source,course,currentUnit())+" "+resolve(w.target,course,currentUnit())).includes(q)).slice(0,180).map(w=>`<article class="vocab-row"><div><strong>${resolve(w.target,course,currentUnit())}</strong><p class="lead">${resolve(w.source,course,currentUnit())} · ${resolve(w.roman,course,currentUnit())}</p></div><button class="small-action" data-speak="${escapeAttr(resolve(w.target,course,currentUnit()))}" data-lang="${course.targetLang}">🔊</button></article>`).join("");wireSpeak($("vocabList"));};$("searchBox").addEventListener("input",draw);draw();}
function renderSentences(){const course=currentCourse(), sents=allOpenSentences(course);screen.innerHTML=`<section class="hero"><div class="eyebrow">Sentence bank</div><h1>${sents.length} useful sentences.</h1><p>These are practical phrases from unlocked lessons.</p></section><section class="stack mt">${sents.slice(0,180).map(s=>exampleRow(s,course,currentUnit())).join("")}</section>`;wireSpeak(screen);}
function renderSoundLab(){const course=currentCourse(), words=spacedReview(course).slice(0,18);screen.innerHTML=`<section class="hero"><div class="eyebrow">Pronunciation lab</div><h1>Hear. Slow down. Copy.</h1><p>Pronunciation checking uses browser speech recognition when available. If not available, self-check still works.</p></section><section class="stack mt">${words.map(w=>`<article class="card stack"><div class="lesson-header"><div class="lesson-icon">🎙️</div><div><h1>${resolve(w.target,course,currentUnit())}</h1><p>${resolve(w.source,course,currentUnit())} · ${resolve(w.roman,course,currentUnit())}</p></div></div><div class="audio-row"><button class="small-action" data-speak="${escapeAttr(resolve(w.target,course,currentUnit()))}" data-lang="${course.targetLang}">🔊 Normal</button><button class="small-action" data-speak="${escapeAttr(resolve(w.target,course,currentUnit()))}" data-lang="${course.targetLang}" data-rate="0.62">🐢 Slow</button><button class="small-action" data-master="${escapeAttr(resolve(w.target,course,currentUnit()))}">✅ Practiced</button></div></article>`).join("")}</section>`;wireSpeakAndMaster();}
function renderLeaderboard(){updateLocalLeaderboard();requestRemoteLeaderboard();const me={uid:state.profile?.uid||"local-me",name:state.profile?.name||"Learner",xp:state.xp,streak:state.streak,badge:coursePercent(currentCourse())>=100?"Graduate":"Rising",courseId:state.courseId};const cloudRows=remoteLeaders.length?remoteLeaders:[];const rows=dedupeLeaders([me,...cloudRows,...(cloudRows.length?[]:DEMO_LEADERS)]).sort((a,b)=>Number(b.xp||0)-Number(a.xp||0)).slice(0,25);const cloudLine=backendReady()?(state.profile?.uid?"Firebase leaderboard connected.":"Firebase ready. Sign in or use cloud guest to publish your score."):"Firebase not ready yet. Showing local/demo ranks.";screen.innerHTML=`<section class="hero"><div class="eyebrow">Leaderboard</div><h1>${remoteLeaders.length?"Public ranks are live.":"Ranks are ready."}</h1><p>${cloudLine}</p></section><section class="card stack mt">${leaderboardLoading?`<p class="lead">Loading public leaderboard...</p>`:""}${rows.map((r,i)=>`<div class="leader-row"><div><strong>${i+1}. ${escapeHtml(r.name||"Learner")}</strong><p class="lead">${escapeHtml(r.badge||"Learner")} · ${Number(r.streak||0)} day streak${r.courseId?" · "+escapeHtml(r.courseId==="bn_en"?"English/Bangla":"Spanish/English"):""}</p></div><span class="badge gold">${Number(r.xp||0)} XP</span></div>`).join("")}</section>`;}
function renderProgress(){const course=currentCourse(), pct=coursePercent(course);screen.innerHTML=`<section class="hero"><div class="eyebrow">Progress</div><h1>${pct}% complete.</h1><p>${escapeHtml(course.title)} · ${course.units.filter(u=>isUnitComplete(course,u)).length}/${course.units.length} days cleared</p><div class="progress-wrap mt"><div class="progress-bar" style="width:${pct}%"></div></div></section><section class="stats-row mt"><div class="stat-card"><strong>${state.xp}</strong><span>XP</span></div><div class="stat-card"><strong>${state.mastered.length}</strong><span>Mastered</span></div><div class="stat-card"><strong>${state.mistakes.length}</strong><span>Mistakes</span></div><div class="stat-card"><strong>${state.coins}</strong><span>Coins</span></div></section><section class="card stack mt"><div class="eyebrow">Course map</div>${course.units.map(u=>`<div class="settings-row"><div><strong>${isUnitComplete(course,u)?"✅":isUnitUnlocked(course,u)?"🟡":"🔒"} ${escapeHtml(u.title)}</strong><p>${escapeHtml(u.theme)}</p></div><button class="small-action" data-jumpunit="${u.id}" ${isUnitUnlocked(course,u)?"":"disabled"}>Open</button></div>`).join("")}</section>`;screen.querySelectorAll("[data-jumpunit]").forEach(b=>b.addEventListener("click",()=>{setActiveUnit(course.id,b.dataset.jumpunit);state.view="course";saveState();render();}));}
function renderHelp(){const bn=currentCourse().id==="bn_en";screen.innerHTML=`<section class="hero"><div class="eyebrow">Help</div><h1>${bn?"ধীরে শিখুন।":"Go slow."}</h1><p>${bn?"৫-১০ মিনিট যথেষ্ট। ভুল হলে ভয় নেই।":"Five to ten minutes is enough. Mistakes are review cards."}</p></section><section class="card stack mt"><h1 class="section-title">${bn?"ব্যবহার নিয়ম":"How to use it"}</h1><p class="lead">1. Tap speaker. 2. Say the word out loud. 3. Choose, match, build. 4. Repeat tomorrow. 5. Use large text and slow audio in settings.</p><button class="primary-btn" data-view="settings">Open settings</button></section>`;}
function renderAbout(){screen.innerHTML=`<section class="hero"><div class="eyebrow">About method</div><h1>Confidence first. Grammar second.</h1><p>Built with microlearning, spaced repetition, retrieval practice, dual coding, audio, safe mistakes, boss reviews, and tiny rewards.</p></section><section class="card stack mt"><div class="eyebrow">V5 Firebase Course</div><p class="lead">Includes 60 chronological days in each course. Later days spiral earlier topics with boss levels so learners repeatedly practice survival, home, work, doctor, transport, money, family, and real conversation language.</p><p class="lead">Firebase Auth and Firestore hooks are now included for cloud progress and a public leaderboard. The app still falls back to phone-only learning if Firebase is offline or not enabled.</p><p class="lead">Names in examples rotate by day, so lessons do not rely on one fixed name.</p></section>`;}
function renderSettings(){const cloud=state.profile?.uid?`Cloud synced · ${escapeHtml(state.profile.email||state.profile.uid.slice(0,8))}`:(backendReady()?"Firebase ready · not signed in":"Firebase loading/offline");screen.innerHTML=`<section class="card stack"><div class="eyebrow">Settings</div><h1 class="section-title">Make it gentle.</h1>${toggleRow("Sound","Speaker buttons and lesson audio.","soundSetting",state.sound)}${toggleRow("Slow audio","Slower speech for beginners.","slowSetting",state.slowAudio)}${toggleRow("Large text","Bigger type and tap zones.","largeSetting",state.largeText)}${toggleRow("High contrast","Darker text and stronger borders.","contrastSetting",state.highContrast)}<div class="settings-row"><div><strong>Profile</strong><p>${escapeHtml(state.profile?.name||"Learner")} · ${escapeHtml(state.profile?.mode||"local")}</p></div><button id="changeProfile" class="small-action">Change</button></div><div class="settings-row"><div><strong>Cloud sync</strong><p>${cloud}</p></div><button id="cloudBtn" class="small-action">${state.profile?.uid?"Sign out":"Connect"}</button></div><div class="settings-row"><div><strong>Restart current day</strong><p>Keep XP, restart this lesson.</p></div><button id="restartDay" class="small-action">Restart</button></div><div class="settings-row"><div><strong>Reset all progress</strong><p>Clear local progress on this phone.</p></div><button id="resetAll" class="small-action">Reset</button></div></section>`;$("soundSetting").onclick=()=>{state.sound=!state.sound;updateSoundIcon();saveState();renderSettings();};$("slowSetting").onclick=()=>{state.slowAudio=!state.slowAudio;saveState();renderSettings();};$("largeSetting").onclick=()=>{state.largeText=!state.largeText;applyA11y();saveState();renderSettings();};$("contrastSetting").onclick=()=>{state.highContrast=!state.highContrast;applyA11y();saveState();renderSettings();};$("changeProfile").onclick=()=>{state.profile={};saveState();render();};$("cloudBtn").onclick=()=>{if(state.profile?.uid)signOutCloud();else{state.profile={};saveState();render();}};$("restartDay").onclick=()=>{setUnitProgress(currentUnit(),0);state.hearts=5;saveState();state.view="course";render();};$("resetAll").onclick=()=>{localStorage.removeItem(STORAGE_KEY);state=loadState();applyA11y();render();};}
function toggleRow(title,desc,id,on){return `<div class="settings-row"><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(desc)}</p></div><button id="${id}" class="toggle ${on?"on":""}"><span></span></button></div>`;}

function wireBackendEvents(){
  window.addEventListener("languageai:backend-ready",()=>{ if(!state.profile?.mode || state.view==="leaderboard" || state.view==="settings") render(); if(state.profile?.uid) syncCloudProgress(); });
  window.addEventListener("languageai:auth-change",e=>{
    const user=e.detail?.user;
    if(user && state.profile?.uid===user.uid){ state.profile={...state.profile,uid:user.uid,email:user.email||state.profile.email||"",name:state.profile.name||user.displayName||"Learner"}; localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
    if(state.view==="leaderboard" || state.view==="settings" || !state.profile?.mode) render();
  });
}
function backendReady(){return !!window.LanguageAiBackend?.isReady?.();}
function firebaseFriendlyError(err){
  const code=String(err?.code||err?.message||"Firebase error");
  if(code.includes("auth/email-already-in-use"))return "Email already exists. Try Sign In.";
  if(code.includes("auth/invalid-credential")||code.includes("auth/wrong-password"))return "Wrong email or password.";
  if(code.includes("auth/operation-not-allowed"))return "Enable this sign-in method in Firebase Auth.";
  if(code.includes("permission-denied"))return "Firestore rules blocked this. Add the included rules.";
  if(code.includes("unavailable")||code.includes("network"))return "Network/Firebase unavailable.";
  return code.replace(/^FirebaseError:\s*/i,"").slice(0,120);
}
async function loadCloudProgressIntoState(preferCloud=false){
  if(!backendReady()||!state.profile?.uid)return false;
  try{
    isHydratingCloud=true;
    const cloud=await window.LanguageAiBackend.loadCloudProgress();
    const progress=cloud?.progress;
    if(!progress){return false;}
    const cloudTime=Number(progress.updatedAtMs||0), localTime=Number(state.cloudUpdatedAtMs||0);
    if(preferCloud || cloudTime>localTime || Number(progress.xp||0)>Number(state.xp||0)){
      const profile={...state.profile};
      state={...state,...pickCloudProgress(progress),profile,cloudUpdatedAtMs:Math.max(cloudTime,Date.now())};
      localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
      toastMsg("Cloud progress loaded.");
      return true;
    }
  }catch(err){toastMsg(firebaseFriendlyError(err));}
  finally{isHydratingCloud=false;}
  return false;
}
function pickCloudProgress(p){
  return {schemaVersion:5,courseId:p.courseId||"bn_en",activeUnitByCourse:p.activeUnitByCourse||{bn_en:"day1",en_es:"day1"},activityIndexByUnit:p.activityIndexByUnit||{},completed:p.completed||{},xp:Number(p.xp||0),coins:Number(p.coins||0),hearts:Number(p.hearts||5),streak:Number(p.streak||0),lastVisit:p.lastVisit||"",mistakes:Array.isArray(p.mistakes)?p.mistakes.slice(-180):[],mastered:Array.isArray(p.mastered)?p.mastered.slice(-500):[],nameSeed:Number(p.nameSeed||state.nameSeed||0),sound:state.sound,slowAudio:state.slowAudio,largeText:state.largeText,highContrast:state.highContrast,view:state.view};
}
function cloudPayload(){
  return {schemaVersion:5,courseId:state.courseId,activeUnitByCourse:state.activeUnitByCourse,activityIndexByUnit:state.activityIndexByUnit,completed:state.completed,xp:Number(state.xp||0),coins:Number(state.coins||0),hearts:Number(state.hearts||5),streak:Number(state.streak||0),lastVisit:state.lastVisit||"",mistakes:(state.mistakes||[]).slice(-180),mastered:(state.mastered||[]).slice(-500),nameSeed:Number(state.nameSeed||0),updatedAtMs:Date.now()};
}
function scheduleCloudSync(){
  if(isHydratingCloud||!backendReady()||!state.profile?.uid)return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer=setTimeout(syncCloudProgress,1400);
}
async function syncCloudProgress(){
  if(!backendReady()||!state.profile?.uid)return;
  try{
    const payload=cloudPayload();
    await window.LanguageAiBackend.syncProgress(payload);
    state.cloudUpdatedAtMs=payload.updatedAtMs;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }catch(err){console.warn("Cloud sync skipped",err);}
}
function requestRemoteLeaderboard(){
  if(!backendReady()||leaderboardLoading||Date.now()-lastLeaderboardFetch<12000)return;
  leaderboardLoading=true;
  window.LanguageAiBackend.getLeaderboard(25).then(rows=>{remoteLeaders=Array.isArray(rows)?rows:[];lastLeaderboardFetch=Date.now();}).catch(err=>toastMsg(firebaseFriendlyError(err))).finally(()=>{leaderboardLoading=false;if(state.view==="leaderboard")renderLeaderboard();});
}
function dedupeLeaders(rows){
  const seen=new Set(), out=[];
  rows.forEach(r=>{const key=r.uid||normalize(r.name||""); if(!key||seen.has(key))return; seen.add(key); out.push(r);});
  return out;
}
async function signOutCloud(){
  try{ if(backendReady()) await window.LanguageAiBackend.signOut(); }catch(err){toastMsg(firebaseFriendlyError(err));}
  state.profile={}; saveState(); toastMsg("Signed out. Local progress stays on this phone."); render();
}


function currentCourse(){return COURSE_MAP[state.courseId]||COURSE_MAP.bn_en;}
function currentUnit(){const c=currentCourse(), id=state.activeUnitByCourse?.[c.id]||"day1";return c.units.find(u=>u.id===id&&isUnitUnlocked(c,u))||nextUnlockedUnit(c)||c.units[0];}
function unitKey(cid,uid){return `${cid}:${uid}`;}
function unitProgress(u){return Number(state.activityIndexByUnit?.[unitKey(currentCourse().id,u.id)]||0);}
function setUnitProgress(u,i){state.activityIndexByUnit[unitKey(currentCourse().id,u.id)]=Math.max(0,Math.min(i,u.activities.length-1));}
function setActiveUnit(cid,uid){state.activeUnitByCourse[cid]=uid;}
function isUnitComplete(c,u){return !!state.completed[unitKey(c.id,u.id)];}
function isUnitUnlocked(c,u){const idx=c.units.findIndex(x=>x.id===u.id);return idx<=0||isUnitComplete(c,c.units[idx-1]);}
function nextUnitAfter(c,u){return c.units[c.units.findIndex(x=>x.id===u.id)+1]||null;}
function nextUnlockedUnit(c){return c.units.find(u=>isUnitUnlocked(c,u)&&!isUnitComplete(c,u))||c.units.find(u=>isUnitUnlocked(c,u))||c.units[0];}
function ensureActiveUnit(){const c=currentCourse();state.activeUnitByCourse=state.activeUnitByCourse||{bn_en:"day1",en_es:"day1"};const active=c.units.find(u=>u.id===state.activeUnitByCourse[c.id]);const next=nextUnlockedUnit(c);if(!active||!isUnitUnlocked(c,active)||(isUnitComplete(c,active)&&next&&!isUnitComplete(c,next)))state.activeUnitByCourse[c.id]=next.id;}
function coursePercent(c){const total=c.units.reduce((s,u)=>s+u.activities.length,0);const done=c.units.reduce((s,u)=>s+(isUnitComplete(c,u)?u.activities.length:unitProgressFor(c,u)),0);return Math.round(done/total*100);}
function unitProgressFor(c,u){return Number(state.activityIndexByUnit?.[unitKey(c.id,u.id)]||0);}
function findWord(u,id){return u.words.find(w=>w.id===id)||u.words[0];}
function findSentence(u,id){return u.sentences.find(s=>s.id===id)||u.sentences[0];}
function allOpenWords(c){return uniqueWords(c.units.filter(u=>isUnitUnlocked(c,u)).flatMap(u=>u.words));}
function allOpenSentences(c){return c.units.filter(u=>isUnitUnlocked(c,u)).flatMap(u=>u.sentences);}
function spacedReview(c){const mistakeTargets=state.mistakes.filter(m=>m.courseId===c.id).map(m=>({source:m.prompt,target:m.answer,roman:"review",meaning:"Mistake review"}));return uniqueWords([...mistakeTargets,...allOpenWords(c).slice(-42),...c.units[0].words]).slice(-60).reverse();}
function uniqueWords(words){const seen=new Set();return words.filter(w=>{const k=(w.source||"")+"|"+(w.target||"");if(seen.has(k))return false;seen.add(k);return true;});}
function mistakeCards(c){return state.mistakes.filter(m=>m.courseId===c.id).slice(-12).reverse();}
function awardAndNext(correct){if(correct){state.xp+=currentCourse().xpPerCorrect;state.coins+=1;toastMsg(`+${currentCourse().xpPerCorrect} XP`);}const u=currentUnit();setUnitProgress(u,unitProgress(u)+1);saveState();render();}
function loseHeart(){state.hearts=Math.max(0,state.hearts-1);if(state.hearts===0){state.hearts=5;toastMsg("Hearts refilled. Keep going gently.");}}
function registerMistake(prompt,answer){state.mistakes.push({prompt,answer,courseId:state.courseId,at:Date.now()});state.mistakes=state.mistakes.slice(-180);}
function addMastered(w){if(!state.mastered.includes(w))state.mastered.push(w);}
function speak(text,lang="en-US",rate){if(!state.sound||!("speechSynthesis" in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=rate||(state.slowAudio?.72:.95);u.pitch=1.02;u.onerror=()=>toastMsg("Voice not available on this phone. Keep learning.");speechSynthesis.speak(u);}catch{toastMsg("Audio is limited in this browser.");}}
function speakSequence(items){if(!state.sound||!("speechSynthesis" in window))return;try{speechSynthesis.cancel();items.forEach(i=>{const u=new SpeechSynthesisUtterance(i.text);u.lang=i.lang;u.rate=i.rate||(state.slowAudio?.72:.95);speechSynthesis.speak(u);});}catch{toastMsg("Audio is limited.");}}
function speechCheck(target,lang,holder){const Rec=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Rec){showFeedback(holder,null,"Speech recognition is not available here. Use the speaker and self-check.");return;}try{const rec=new Rec();rec.lang=lang;rec.interimResults=false;rec.maxAlternatives=1;showFeedback(holder,null,"Listening...");rec.onresult=e=>{const heard=e.results[0][0].transcript,score=similarity(normalize(heard),normalize(target));showFeedback(holder,score>.45,`Heard: ${heard} · ${score>.45?"Good practice.":"Try once more slowly."}`);if(score>.45){state.xp+=8;addMastered(target);saveState();}};rec.onerror=()=>showFeedback(holder,null,"Could not hear clearly. Try normal speaker + self-check.");rec.start();}catch{showFeedback(holder,null,"Speech check is limited in this browser.");}}
function wireSpeak(root){root.querySelectorAll("[data-speak]").forEach(b=>b.addEventListener("click",()=>speak(b.dataset.speak,b.dataset.lang,Number(b.dataset.rate)||undefined)));}
function wireSpeakAndMaster(){wireSpeak(screen);screen.querySelectorAll("[data-master]").forEach(b=>b.addEventListener("click",()=>{addMastered(b.dataset.master);state.xp+=3;saveState();toastMsg("+3 XP practiced.");}));}
function resolve(text,course=currentCourse(),unit=currentUnit()){const i=((unit?.day||1)+state.nameSeed)%NAMES.length;return cleanText(String(text)).replaceAll("{{name}}",NAMES[i]).replaceAll("{{bnName}}",BN_NAMES[i]);}
function loadState(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");const base=freshState(),m={...base,...saved};m.profile=saved.profile||saved.user||{};m.activeUnitByCourse={bn_en:"day1",en_es:"day1",...(saved.activeUnitByCourse||{})};m.activityIndexByUnit=saved.activityIndexByUnit||{};if(typeof saved.activityIndex==="number")m.activityIndexByUnit[unitKey(saved.courseId||"bn_en","day1")]=saved.activityIndex;m.completed=saved.completed||{};m.mistakes=Array.isArray(saved.mistakes)?saved.mistakes:[];m.mastered=Array.isArray(saved.mastered)?saved.mastered:[];m.schemaVersion=5;m.cloudUpdatedAtMs=Number(saved.cloudUpdatedAtMs||0);return m;}catch{return freshState();}}
function freshState(){return {schemaVersion:5,view:"home",courseId:"bn_en",activeUnitByCourse:{bn_en:"day1",en_es:"day1"},activityIndexByUnit:{},completed:{},xp:0,coins:0,hearts:5,streak:0,lastVisit:"",sound:true,slowAudio:false,largeText:false,highContrast:false,mistakes:[],mastered:[],profile:{},nameSeed:Math.floor(Math.random()*1000),leaderboard:[],cloudUpdatedAtMs:0};}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));scheduleCloudSync();}
function todayKey(){return new Date().toISOString().slice(0,10);}
function repairDailyStreak(){const today=todayKey();if(state.lastVisit!==today){const d=new Date();d.setDate(d.getDate()-1);const y=d.toISOString().slice(0,10);state.streak=state.lastVisit===y?state.streak+1:Math.max(1,state.streak||1);state.lastVisit=today;state.hearts=5;saveState();}}
function updateSoundIcon(){soundToggle.textContent=state.sound?"🔊":"🔇";}
function applyA11y(){document.body.classList.toggle("large-text",!!state.largeText);document.body.classList.toggle("high-contrast",!!state.highContrast);}
function updateLocalLeaderboard(){state.leaderboard=state.leaderboard||[];const name=state.profile?.name||"Learner",existing=state.leaderboard.find(x=>x.name===name);if(existing){existing.xp=state.xp;existing.streak=state.streak;}else state.leaderboard.push({name,xp:state.xp,streak:state.streak});localStorage.setItem(STORAGE_KEY,JSON.stringify(state));if(backendReady()&&state.profile?.uid)window.LanguageAiBackend.syncLeaderboard({uid:state.profile.uid,name,xp:state.xp,streak:state.streak,courseId:state.courseId,badge:coursePercent(currentCourse())>=100?"Graduate":"Rising"}).catch(()=>{});}
function showFeedback(holder,good,msg){const fb=holder.querySelector("#feedback");if(!fb)return;fb.className="feedback show "+(good===true?"good":good===false?"bad":"");fb.textContent=msg;}
function toastMsg(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>toast.classList.remove("show"),1700);}
function confetti(){const wrap=document.createElement("div");wrap.className="confetti";for(let i=0;i<42;i++){const p=document.createElement("i");p.style.left=Math.random()*100+"%";p.style.animationDelay=Math.random()*220+"ms";wrap.appendChild(p);}document.body.appendChild(wrap);setTimeout(()=>wrap.remove(),1300);}
function optionSet(correct,pool){const options=shuffle(unique([correct,...pool])).slice(0,4);if(!options.includes(correct))options[0]=correct;return shuffle(options);}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function unique(a){return [...new Set(a.filter(Boolean))];}
function normalize(s){return String(s).toLowerCase().replace(/[.,!?¡¿]/g,"").replace(/\s+/g," ").trim();}
function similarity(a,b){const as=new Set(a.split(/\s+/)),bs=new Set(b.split(/\s+/));let hit=0;as.forEach(x=>{if(bs.has(x))hit++;});return hit/Math.max(as.size,bs.size,1);}
function cleanText(s){return String(s);}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));}
function escapeAttr(s){return escapeHtml(s).replace(/`/g,"&#96;");}
