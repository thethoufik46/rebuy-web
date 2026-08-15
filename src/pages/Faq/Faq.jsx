// ======================= src/pages/Faq/Faq.jsx =======================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Minus,
  Phone,
  ExternalLink,
} from "lucide-react";

/* ============================================================
   FAQ DATA
============================================================ */

const faqs = [
  {
    category: "Re2Buy Marketplace / வாகன விற்பனையகம்",
    q: "Why should I buy a car from Re2Buy?\nஏன் Re2Buy நிறுவனத்தில் கார் வாங்க வேண்டும்?",
    a:
      "If you are looking for quality cars in the market at an affordable price, Re2Buy will be your best choice. We sell cars only after clearly explaining both the positives and negatives of each vehicle.\n\n" +
      "மார்க்கெட்டில் கிடைக்கும் தரமான கார்கள் மலிவான (Affordable) விலையில் வாங்க விரும்பினால், Re2Buy உங்களுக்கான சிறந்த தேர்வாக இருக்கும். ஒவ்வொரு காரிலும் உள்ள நல்ல அம்சங்களும் குறைபாடுகளும் அனைத்தையும் தெளிவாக விளக்கிய பிறகே நாங்கள் கார்கள் விற்பனை செய்கிறோம்.",
  },

  {
    q: "Why should I sell my car through Re2Buy?\nஏன் Re2Buy மூலம் என் காரை விற்க வேண்டும்?",
    a:
      "Selling your car through Re2Buy comes with many benefits. You can sell your car at the right market price suggested by you, without even stepping out of your home. Re2Buy takes care of all advertisements, photo editing, finance arrangements, and follow-ups, making the entire selling process easy and hassle-free.\n\n" +
      "Re2Buy மூலம் உங்கள் காரை விற்பது உங்களுக்கு பல நன்மைகளை வழங்குகிறது. நீங்கள் கூறும் சரியான மார்க்கெட் விலையிலேயே, வீட்டிலிருந்தே உங்கள் காரை விற்க முடியும். உங்கள் காருக்கான அனைத்து விளம்பரங்கள், புகைப்பட எடிட்டிங், ஃபைனான்ஸ் ஏற்பாடு மற்றும் தொடர்ந்த பின்தொடர்வு (Follow-up) ஆகிய அனைத்தையும் Re2Buy குழுவே கவனிக்கும். இதனால், கார் விற்பனை செயல்முறை எளிதாகவும் சிரமமில்லாமலும் நடைபெறும்.",
  },

  {
    q: "How can I get finance? Can you explain the process?\nஃபைனான்ஸ் எவ்வாறு பெறலாம்? அதன் செயல்முறையை விளக்க முடியுமா?",
    a:
      "Yes, finance options are available. To clearly understand the finance process, please click below to learn more.\n\n" +
      "ஆம், ஃபைனான்ஸ் பெறலாம். ஃபைனான்ஸ் தொடர்பான முழு விவரங்களை தெளிவாக அறிந்து கொள்ள கீழே உள்ள «மேலும் அறிந்து கொள்ள» என்பதை கிளிக் செய்யவும்.",
    financeLink: true,
  },

  {
    q: "There are many platforms in Tamil Nadu to buy and sell cars. Why is Re2Buy better than others?\nதமிழ்நாட்டில் கார் வாங்கவும் விற்கவும் பல பிளாட்ஃபார்ம்கள் இருக்கும்போது, அவற்றை விட Re2Buy எப்படி சிறந்தது?",
    a:
      "Compared to other platforms, Re2Buy stands out as one of the best. We ensure a transparent process with no scams or risk of money loss. Customer satisfaction is our top priority. We clearly understand each customer’s needs and deliver exactly what they are looking for, making Re2Buy a trusted choice in Tamil Nadu.\n\n" +
      "மற்ற பிளாட்ஃபார்ம்களை ஒப்பிடுகையில், Re2Buy நிறுவனம் சிறந்ததாக திகழ்கிறது. இங்கு எந்தவிதமான மோசடியும் இல்லை, பண இழப்பிற்கான அபாயமும் கிடையாது. வாடிக்கையாளர் திருப்தியே எங்களின் முதன்மை குறிக்கோள். வாடிக்கையாளரின் தேவைகளை முழுமையாக புரிந்து கொண்டு, அவர்களுக்கு தேவையானதை சரியாக வழங்குவதில் தமிழ்நாட்டில் Re2Buy-ஐ விட சிறந்த நிறுவனம் இல்லை என்று நாங்கள் நம்புகிறோம்.",
  },

  {
    q: "What kind of feedback have customers shared?\nவாடிக்கையாளர்கள் எவ்வாறு கருத்து (Feedback) தெரிவித்துள்ளனர்?",
    a:
      "Most of our customers are first-time car buyers. Many of them have bought cars for personal use and are happily using them with their families for daily travel, temple visits, and outings. We are especially happy to see customers who were previously drivers become car owners through Re2Buy. Customers also appreciate the practical advice we provide, especially regarding proper maintenance of the car.\n\n" +
      "எங்களிடம் அதிகமான வாடிக்கையாளர்கள் முதல் முறையாக கார் வாங்கியவர்களே. பலர் சொந்த பயன்பாட்டிற்காக கார் வாங்கி, குடும்பத்துடன் கோவில், வெளிச்சுற்றுலா போன்ற பயணங்களுக்கு மகிழ்ச்சியாக பயன்படுத்தி வருகிறார்கள். முன்பு டிரைவர்களாக இருந்தவர்கள், Re2Buy மூலம் கார் ஓனர் ஆகி முன்னேறியதைப் பார்க்க எங்களுக்கு மிகுந்த மகிழ்ச்சி. மேலும், கார் பராமரிப்பு (Maintenance) தொடர்பாக நாங்கள் வழங்கும் சரியான ஆலோசனைகள் மிகவும் பயனுள்ளதாக இருப்பதாக வாடிக்கையாளர்கள் தெரிவித்துள்ளனர்.",
  },

  {
    q: "How can I contact you?\nஉங்களை எவ்வாறு தொடர்பு கொள்ளலாம்?",
    a:
      "You can contact the Re2Buy support team anytime. Our support team is available 24 hours a day to assist you. To know more contact details, please click the contact link below.\n\n" +
      "Re2Buy ஆதரவு குழுவை எப்போது வேண்டுமானாலும் நீங்கள் தொடர்பு கொள்ளலாம். எங்கள் ஆதரவு குழு 24 மணி நேரமும் உங்களுக்கு உதவ தயாராக இருக்கும். மேலும் தொடர்பு விவரங்களை அறிந்து கொள்ள கீழே உள்ள Contact link-ஐ கிளிக் செய்யவும். (82701 49856)",
    contactLink: true,
  },

  {
    q: "Disclaimer",
    a:
      "Re2Buy is a marketplace platform only. Car inspection and verification are the buyer’s responsibility.\n\n" +
      "Re2Buy ஒரு Marketplace Platform மட்டுமே. கார் சரிபார்ப்பு மற்றும் உறுதிப்படுத்தல் வாங்குபவரின் தனிப்பட்ட பொறுப்பு.",
  },

  {
    category: "Buy a Car / கார் வாங்க",
    q: "Do I need to pay any advance?\nமுன்பணம் செலுத்த வேண்டுமா?",
    a:
      "No advance payment is required to place a buy request. Re2Buy will first understand your requirement and then guide you accordingly.\n\n" +
      "இல்லை. கார் வாங்கும் கோரிக்கை பதிவு செய்ய முன்பணம் செலுத்த தேவையில்லை. முதலில் உங்கள் தேவையை Re2Buy புரிந்து கொண்டு பின்னர் சரியான வழிகாட்டுதல் வழங்கும்.",
  },

  {
    q: "Can I buy a car through finance?\nஃபைனான்ஸ் மூலம் கார் வாங்க முடியுமா?",
    a:
      "Yes. Both cash and finance options are available. Re2Buy will help you choose the best finance option based on your eligibility.\n\n" +
      "ஆம். பணம் மற்றும் ஃபைனான்ஸ் இரண்டும் கிடைக்கும். உங்கள் தகுதிக்கு ஏற்ற சிறந்த ஃபைனான்ஸ் தேர்வை Re2Buy பரிந்துரை செய்யும்.",
  },

  {
    q: "Are there any offers when buying a car from Re2Buy?\nRe2Buy-ல் கார் வாங்கும்போது ஏதேனும் offers இருக்கிறதா?",
    a:
      "Yes, offers are available based on the car you purchase. Selected cars come with a free fuel offer ranging from 10 to 50 liters.\n\n" +
      "ஆம், Re2Buy-ல் கார் வாங்கும்போது offers வழங்கப்படுகின்றன. நீங்கள் வாங்கும் கார் அடிப்படையில், சில தேர்ந்தெடுக்கப்பட்ட கார்கள் மீது 10 லிட்டர் முதல் 50 லிட்டர் வரை இலவச எரிபொருள் (Fuel) வழங்கப்படும்.",
  },

  {
    q: "How soon can I get a car?\nஎவ்வளவு சீக்கிரம் கார் கிடைக்கும்?",
    a:
      "The timeline depends on car availability and your requirement. In many cases, cars are arranged within a few days.\n\n" +
      "கார் கிடைக்கும் நேரம் உங்கள் தேவையும் கிடைப்பையும் பொறுத்தது. பல சந்தர்ப்பங்களில் சில நாட்களிலேயே கார் ஏற்பாடு செய்யப்படும்.",
  },

  {
    q: "Who all provide cars to you?\nயார்யாருடைய கார்கள் உங்களிடம் கிடைக்கும்?",
    a:
      "We offer cars from multiple trusted sources such as individual owners, verified references, finance-closed vehicles, and genuine dealers.\n\n" +
      "எங்களிடம் பல நம்பகமான மூலங்களிலிருந்து கார்கள் கிடைக்கும். அவை RC Owner (உரிமையாளர்) கார்கள், சரிபார்க்கப்பட்ட பரிந்துரைகளின் மூலம் வரும் கார்கள், ஃபைனான்ஸ் முடிக்கப்பட்ட (Finance Closing) கார்கள் மற்றும் நம்பகமான டீலர்களிடமிருந்து வரும் கார்கள் ஆகும்.",
  },

  {
    q: "Do you have finance pending cars?\nஃபைனான்ஸ் கட்ட முடியாமல் நிறுத்தப்பட்ட கார்கள் உங்களிடம் உள்ளதா?",
    a:
      "Yes, we also have finance pending cars where the previous owner was unable to continue finance payments. These vehicles are verified and processed legally before being listed.\n\n" +
      "ஆம், ஃபைனான்ஸ் கட்ட முடியாமல் நிறுத்தப்பட்ட (Finance Pending / Ceasing) கார்கள் எங்களிடம் கிடைக்கும். இந்த கார்கள் அனைத்தும் சட்டப்படி சரிபார்க்கப்பட்டு (Verified), முழுமையான நடைமுறைகளுக்குப் பிறகே விற்பனைக்கு வைக்கப்படுகின்றன.",
  },

  {
    q: "I don’t own a car and I am planning to buy my first car. Will I get proper guidance?\nஎன்னிடம் தற்போது கார் இல்லை. முதல் முறையாக கார் வாங்க நினைக்கிறேன். எனக்கு வழிகாட்டுதல் கிடைக்குமா?",
    a:
      "Yes, we provide complete guidance for first-time car buyers. Based on your requirement, we will guide you whether you need an Own Board car for personal use or a T Board car for taxi purposes. We will also suggest suitable car models based on your family size (5-seater or 7-seater), mileage needs, and usage.\n\n" +
      "ஆம், முதல் முறையாக கார் வாங்கும் வாடிக்கையாளர்களுக்கு முழுமையான வழிகாட்டுதல் வழங்கப்படுகிறது. உங்கள் தேவையைப் பொறுத்து, சொந்த பயன்பாட்டிற்கு Own Board கார் வேண்டுமா அல்லது டாக்சி ஓட்டுவதற்கு T Board கார் வேண்டுமா என்பதை நாங்கள் வழிகாட்டுவோம். மேலும், உங்கள் குடும்ப உறுப்பினர்களின் எண்ணிக்கைக்கு ஏற்ப (5 சீட்டர் / 7 சீட்டர்), மைலேஜ் தேவைகள் மற்றும் பயன்பாட்டை கருத்தில் கொண்டு, உங்களுக்கு பொருத்தமான கார் மாடல்களை Re2Buy பரிந்துரை செய்யும். நீங்கள் கவலைப்பட தேவையில்லை — உங்களுக்கு என்ன தேவை மற்றும் உங்கள் பட்ஜெட் எவ்வளவு என்று சொன்னால் போதுமானது.",
  },

  {
    q: "Does Re2Buy fully check the car I am buying? Do I still need to check it myself?\nநான் வாங்கும் காரை முழுமையாக சரிபார்த்துள்ளீர்களா? நான் தனியாகச் சரிபார்க்க வேண்டுமா?",
    a:
      "Yes, it is definitely necessary for you to check the car yourself. Re2Buy mostly handles RC Owner cars, and we verify RC details and available service records.\n\n" +
      "ஆம், நீங்கள் தனியாக காரைச் சரிபார்ப்பது கண்டிப்பாக அவசியம். Re2Buy பெரும்பாலும் RC Owner கார்கள் மட்டுமே கையாளுகிறது, அதனால் RC விவரங்கள் மற்றும் கிடைக்கும் Service Records-ஐ நாங்கள் சரிபார்க்கிறோம்.\n\n" +
      "To ensure your satisfaction, it is good to carefully review the service records that we check and share with you before finalizing the purchase.\n\n" +
      "உங்கள் திருப்திக்காக, நீங்கள் காரின் Service Record-ஐ கவனமாகச் சரிபார்த்து வாங்கவும்.",
  },

  {
    q: "Is there any warranty on cars purchased through Re2Buy?\nRe2Buy-யில் வாங்கும் கார்களுக்கு வாரண்டி இருக்குமா?",
    a:
      "No. Re2Buy does not provide any warranty on used cars. Warranty is not included by default. If a car has an existing showroom or manufacturer warranty, it will be applicable as per the original terms and validity only.\n\n" +
      "இல்லை. Re2Buy மூலம் வாங்கப்படும் பயன்படுத்திய கார்களுக்கு தனியாக எந்த வாரண்டியும் வழங்கப்படாது. பொதுவாக வாரண்டி கிடையாது. ஆனால், காருக்கு ஏற்கனவே Showroom அல்லது Manufacturer வாரண்டி இருந்தால், அந்த வாரண்டி அதன் செல்லுபடியாகும் காலம் மற்றும் விதிமுறைகளின் அடிப்படையில் மட்டுமே பொருந்தும்.",
  },

  {
    q: "Free Advice\nஆலோசனை",
    a:
      "After purchasing a car, it is always recommended to do a proper oil service based on the car’s kilometers. Regular oil service and basic maintenance help keep the engine healthy and improve the overall performance of the car.\n\n" +
      "நீங்கள் கார் வாங்கிய பிறகு, அந்த காரின் ஓட்டப்பட்ட கிலோமீட்டரை அடிப்படையாகக் கொண்டு Oil Service செய்வது மிகவும் நல்லது. புதியதாக வாங்கிய காருக்கு Oil Service செய்து, தேவையான அடிப்படை Maintenance சரியாக செய்தால், என்ஜின் நலமாக இருக்கும் மற்றும் காரின் செயல்திறன் மேம்படும்.",
  },

  {
    category: "Car Sell / கார் விற்க",
    q: "How long does it take to sell my car?\nஎன் காரை விற்க எவ்வளவு நாட்கள் ஆகும்?",
    a:
      "There is no fixed timeline to sell a car. The duration depends on buyer demand, car condition, pricing, and document verification.\n\n" +
      "இதற்கு உறுதியான காலக்கெடு சொல்ல முடியாது. வாங்குபவரின் தேவைகள், காரின் நிலை, விலை மற்றும் ஆவண சரிபார்ப்புகளைப் பொறுத்து நேரம் மாறுபடும்.\n\n" +
      "In general, it may take anywhere from a few days up to a week.\n\n" +
      "பொதுவாக சில நாட்களில் இருந்து ஒரு வாரம் வரை ஆகலாம்.",
  },

  {
    q: "Is listing my car free?\nஎன் காரை Re2Buy-யில் பதிவு செய்வது இலவசமா?",
    a:
      "Yes. Listing your car on Re2Buy is completely free. However, RC details and basic document verification are mandatory to ensure genuine listings.\n\n" +
      "ஆம். Re2Buy-யில் உங்கள் காரை பதிவு செய்வது முற்றிலும் இலவசம். ஆனால், உண்மையான (Genuine) பதிவு என்பதை உறுதி செய்வதற்காக, உங்கள் கார் RC விவரங்கள் மற்றும் அடிப்படை ஆவண சரிபார்ப்பு கட்டாயமாக செய்யப்படும்.",
  },

  {
    q: "Do I need to visit your office?\nநான் உங்கள் அலுவலகத்திற்கு வர வேண்டுமா?",
    a:
      "In most cases, there is no need to visit our office. The process can usually be completed from your home.\n\n" +
      "பெரும்பாலான சந்தர்ப்பங்களில், நீங்கள் எங்கள் அலுவலகத்திற்கு வர தேவையில்லை. செயல்முறை பொதுவாக உங்கள் வீட்டிலிருந்தே முடிக்கலாம்.",
  },

  {
    q: "What details are required to sell my car?\nஎன் காரை விற்க என்னென்ன விவரங்கள் தேவை?",
    a:
      "To sell your car, the seller must provide personal proof details along with complete car information, including clear photos and videos of the car.\n\n" +
      "உங்கள் காரை விற்க, விற்பனையாளரின் அடிப்படை சான்றுகள் மட்டுமல்லாமல், காரின் முழு விவரங்களுடன் தெளிவான புகைப்படங்கள் மற்றும் வீடியோக்களும் வழங்கப்பட வேண்டும்.\n\n" +
      "Seller Details Required:\n" +
      "• Aadhaar proof\n" +
      "• Phone number\n" +
      "• Current location\n\n" +
      "விற்பனையாளர் விவரங்கள்:\n" +
      "• ஆதார் அடையாள சான்று\n" +
      "• மொபைல் எண்\n" +
      "• தற்போதைய இருப்பிடம்\n\n" +
      "Car Details Required:\n" +
      "1. RC (Registration Certificate)\n" +
      "2. Insurance details\n" +
      "3. NOC (if applicable)\n" +
      "4. Kilometers driven (KM / CSR)\n" +
      "5. Number of owners\n" +
      "6. Transmission type (Manual / Automatic)\n" +
      "7. Fuel type\n" +
      "8. Current car location\n" +
      "9. Any existing complaints or issues\n" +
      "10. Final expected selling price\n" +
      "11. Clear car photos (inside & outside)\n" +
      "12. Short car walk-around video\n\n" +
      "கார் தொடர்பான விவரங்கள்:\n" +
      "1. RC (பதிவு சான்று)\n" +
      "2. இன்சூரன்ஸ் விவரங்கள்\n" +
      "3. NOC (தேவையானால்)\n" +
      "4. ஓட்டப்பட்ட கிலோமீட்டர்கள் (KM / CSR)\n" +
      "5. இதுவரை இருந்த உரிமையாளர்கள் எண்ணிக்கை\n" +
      "6. கியர் வகை (Manual / Automatic)\n" +
      "7. எரிபொருள் வகை (Fuel)\n" +
      "8. கார் தற்போது உள்ள இடம்\n" +
      "9. காரில் உள்ள எந்தவொரு பிரச்சனை / குறைகள்\n" +
      "10. நீங்கள் எதிர்பார்க்கும் இறுதி விலை\n" +
      "11. காரின் தெளிவான புகைப்படங்கள் (உள்ளே & வெளியே)\n" +
      "12. காரின் குறுகிய வீடியோ (Walk-around video)",
  },

  {
    q: "How long does it take to post my car on the Re2Buy app?\nஎன் காரை Re2Buy ஆப்பில் பதிவிட எவ்வளவு நேரம் ஆகும்?",
    a:
      "Usually, it takes around 5 to 10 minutes to post your car on the app. The time may vary based on image, video availability, and detail verification.\n\n" +
      "பொதுவாக, Re2Buy ஆப்பில் உங்கள் காரை பதிவிட 5 முதல் 10 நிமிடங்கள் வரை ஆகும். இது நீங்கள் வழங்கும் புகைப்படங்கள், வீடியோக்கள் மற்றும் விவரங்கள் கிடைப்பதைப் பொறுத்து மாறுபடலாம்.",
  },

  {
    q: "As a seller, do I need to share complete details about my car?\nகார் விற்கும் எனக்கு ஏதேனும் பொறுப்புகள் / விளக்கங்கள் இருக்கிறதா?",
    a:
      "Yes, it is definitely important. As a seller, you must clearly inform the current condition of the car, expected mileage, and any existing issues or complaints.\n\n" +
      "ஆம், இது கண்டிப்பாக அவசியம். கார் விற்கும் போது, காரின் தற்போதைய நிலை, எவ்வளவு மைலேஜ் கிடைக்கும், ஏதேனும் பிரச்சனை அல்லது குறைகள் உள்ளதா என்பதனை தெளிவாக தெரிவிக்க வேண்டும்.\n\n" +
      "Re2Buy does not encourage or support fraud or scam-related car sales. If false information is shared and it leads to a dispute, the customer has the right to take legal action directly against the seller.\n\n" +
      "Re2Buy எந்தவிதமான மோசடி அல்லது தவறான தகவல்களுடன் கூடிய கார் விற்பனையையும் ஆதரிக்காது. தவறான தகவல்கள் வழங்கப்பட்டால் மற்றும் அதனால் பிரச்சனை ஏற்பட்டால், வாடிக்கையாளர் நேரடியாக கார் விற்கும் நபர்மீது சட்ட நடவடிக்கை (Case) எடுக்க முடியும் என்பதை விற்பனையாளர்கள் புரிந்து கொண்டு செயல்பட வேண்டும்.",
  },

  {
    q: "How is the price of my car decided?\nஎன் காரின் விலையை நீங்கள் எவ்வாறு தீர்மானிக்கிறீர்கள்?",
    a:
      "The car price is primarily based on the price suggested by you and the current market value of similar cars.\n\n" +
      "காரின் விலை முதலில் நீங்கள் கூறும் விலையையும், அதே மாதிரியான கார்கள் மார்க்கெட்டில் நிலவும் விலையையும் அடிப்படையாகக் கொண்டு தீர்மானிக்கப்படுகிறது.\n\n" +
      "Generally, a service charge of around 2% may be added for used car buying and selling services. This charge can vary based on the car and the type of deal.\n\n" +
      "பொதுவாக, பயன்படுத்திய கார்கள் வாங்கும் மற்றும் விற்கும் சேவைக்காக சுமார் 2% அளவில் சர்வீஸ் சார்ஜ் சேர்க்கப்படலாம். இது காரின் நிலை மற்றும் டீல் வகையைப் பொறுத்து மாறுபடும்.",
  },

  {
    q: "Will my car details and personal information be safe?\nஎன் காரின் விவரங்களும் என் தனிப்பட்ட தகவல்களும் பாதுகாப்பாக இருக்குமா?",
    a:
      "Yes. Re2Buy gives top priority to data safety and customer satisfaction. We handle your car details and personal information responsibly and securely.\n\n" +
      "ஆம். தகவல் பாதுகாப்பும் வாடிக்கையாளர் திருப்தியும் Re2Buy-க்கு முதன்மை. உங்கள் காரின் விவரங்களையும், தனிப்பட்ட தகவல்களையும் நாங்கள் பாதுகாப்பாகவும் பொறுப்புடன்வும் கையாளுகிறோம்.\n\n" +
      "Re2Buy will never engage in any activity that could damage its brand name or customer trust.\n\n" +
      "எங்களின் பிராண்ட் பெயரும் வாடிக்கையாளர் நம்பிக்கையும் பாதிக்கப்படும் எந்த செயலிலும் Re2Buy எப்போதும் ஈடுபடாது.",
  },

  {
    category: "Finance / பைனான்ஸ்",
    q: "Do you provide car loan facilities for used cars?\nபயன்படுத்திய (Used) கார்கள் மீது கடன் வசதி வழங்குகிறீர்களா?",
    a:
      "Yes, we provide car loan assistance for used cars through our trusted finance partners with attractive interest rates.\n\n" +
      "ஆம், எங்களின் நம்பகமான ஃபைனான்ஸ் கூட்டாளர்களின் மூலம் பயன்படுத்திய (Used) கார்கள் மீது குறைந்த வட்டி விகிதத்தில் கடன் வசதியை வழங்குகிறோம்.",
  },

  {
    q: "What is the minimum down payment required?\nகுறைந்தபட்ச முன்பணம் எவ்வளவு செலுத்த வேண்டும்?",
    a:
      "Down payment depends on the car IDV value and the finance partner. Typically, it starts from 10% of the car price.\n\n" +
      "முன்பணம் என்பது கார் IDV மதிப்பையும் (Insurance Declared Value) மற்றும் ஃபைனான்ஸ் நிறுவனத்தையும் பொறுத்தது. பொதுவாக கார் விலையின் 10% முதல் முன்பணம் செலுத்த வேண்டும். உதாரணமாக, Swift கார் போன்றவற்றுக்கு ₹1.5 லட்சம் முதல் ₹2 லட்சம் வரை முன்பணம் இருக்கலாம்.",
  },

  {
    q: "What documents are required for car finance?\nகார் ஃபைனான்ஸ்க்கு தேவையான ஆவணங்கள் என்ன?",
    a:
      "Basic documents include ID proof, address proof, income proof, bank statements, and passport size photographs.\n\n" +
      "கார் ஃபைனான்ஸ்க்கு பொதுவாக கீழ்கண்ட ஆவணங்கள் தேவை:\n" +
      "1. பயனர் ஆதார் கார்டு (User Aadhar Card)\n" +
      "2. பயனர் PAN கார்டு (User PAN Card)\n" +
      "3. வீட்டின் EB ரசீது (House EB Receipt)\n" +
      "4. உத்தரவாததாரர் ஆதார் கார்டு (Guarantor Aadhar Card)\n" +
      "5. உத்தரவாததாரர் PAN கார்டு (Guarantor PAN Card)\n" +
      "மேற்கண்ட அனைத்து ஆவணங்களும் நகல்கள் (All copies) ஆக வழங்க வேண்டும்.",
  },

  {
    q: "How long does loan approval take?\nகடன் அனுமதி பெற எவ்வளவு நேரம் ஆகும்?",
    a:
      "Loan approval usually takes 24 to 48 hours after document verification. Approval time also depends on your CIBIL score.\n\n" +
      "ஆவணங்கள் சரிபார்ப்பு முடிந்த பின், பொதுவாக 24 முதல் 48 மணி நேரத்திற்குள் கடன் அனுமதி வழங்கப்படும். இதன் கால அளவு உங்கள் CIBIL ஸ்கோர் மற்றும் தகுதியையும் பொறுத்தது.",
  },

  {
    q: "From which year used cars are eligible for finance?\nஎந்த வருட மாடல் பயன்படுத்திய கார்கள் முதல் ஃபைனான்ஸ் கிடைக்கும்?",
    a:
      "Used car finance is generally available for vehicles from 2013 model year onwards.\n\n" +
      "பொதுவாக 2013 மற்றும் அதற்குப் பிறகு உள்ள (2013+ மாடல்) பயன்படுத்திய கார்கள் மீது ஃபைனான்ஸ் வழங்கப்படுகிறது.",
  },

  {
    q: "Can I buy a car without a down payment? Is full finance available?\nமுன்பணம் இல்லாமல் கார் வாங்க முடியுமா? முழு ஃபைனான்ஸ் கிடைக்குமா?",
    a:
      "Yes, but full finance is available only for Own Board cars and only for selected latest models.\n\n" +
      "ஆம், ஆனால் முழு ஃபைனான்ஸ் Own Board கார்கள் மீது மட்டுமே கிடைக்கும். அதுவும் சில தேர்ந்தெடுக்கப்பட்ட லேட்டஸ்ட் மாடல் கார்கள் மட்டுமே வழங்கப்படும்.",
  },

  {
    q: "How can I approach a nearby finance company for a car loan?\nஎங்களது அருகாமையில் இருக்கும் ஃபைனான்ஸ் நிறுவனத்தை எவ்வாறு அணுகலாம்?",
    a:
      "You can approach the finance company by submitting the car RC and car insurance details. Based on the car IDV value, they will assess and provide finance.\n\n" +
      "கார் ஃபைனான்ஸ் பெற, கார் RC மற்றும் கார் இன்சூரன்ஸ் விவரங்களை வழங்கி அருகிலுள்ள ஃபைனான்ஸ் நிறுவனத்திடம் கேட்டுக்கொள்ளலாம். அவர்கள் கார் IDV மதிப்பை அடிப்படையாகக் கொண்டு ஃபைனான்ஸ் தொகையை நிர்ணயித்து வழங்குவார்கள். (உதாரணமாக: Sriram, Cholamandalam போன்ற ஃபைனான்ஸ் நிறுவனங்கள்).",
  },

  {
    q: "What are the steps involved in your finance process?\nஉங்களிடம் ஃபைனான்ஸ் செயல்முறை (Process) எவ்வாறு நடைபெறும்?",
    a:
      "Once you pay the advance amount for the car, we will immediately start the finance process.\n\n" +
      "காருக்கான முன்பணம் (Advance) செலுத்தியவுடன், ஃபைனான்ஸ் செயல்முறையை உடனடியாக தொடங்குவோம்.\n\n" +
      "Step 1: Your documents will be verified and your CIBIL score will be checked.\n\n" +
      "படி 1: உங்கள் ஆவணங்கள் சரிபார்க்கப்பட்டு, உங்கள் CIBIL ஸ்கோர் சரிபார்க்கப்படும்.\n\n" +
      "Step 2: The financier will evaluate the car and decide the eligible finance amount. During this stage, a validation fee of around ₹700 may be charged. This amount is not fixed and may vary.\n\n" +
      "படி 2: ஃபைனான்சியர் கார் மதிப்பீடு செய்து எவ்வளவு ஃபைனான்ஸ் வழங்கலாம் என்பதை தீர்மானிப்பார். இந்த கட்டத்தில் சுமார் ₹700 வரை வேலிடேஷன் கட்டணம் கேட்கப்படலாம். இது நிரந்தர தொகை அல்ல.\n\n" +
      "Step 3: Home verification will be done by the finance company branch.\n\n" +
      "படி 3: ஃபைனான்ஸ் நிறுவனத்தின் கிளையிலிருந்து வீட்டுச் சரிபார்ப்பு (Home Verification) நடைபெறும்.\n\n" +
      "Step 4: If all verifications are completed successfully, the finance will be approved.\n\n" +
      "படி 4: அனைத்து சரிபார்ப்புகளும் சரியாக இருந்தால், ஃபைனான்ஸ் அனுமதி வழங்கப்படும்.\n\n" +
      "Step 5: After finance approval, the balance amount settlement will be completed and the car delivery can be taken along with original documents such as RC and NOC.\n\n" +
      "படி 5: ஃபைனான்ஸ் அனுமதி கிடைத்த பின், மீதமுள்ள தொகை (Balance Settlement) செலுத்தி, RC, NOC போன்ற அசல் ஆவணங்களுடன் காரை டெலிவரி பெற்றுக்கொள்ளலாம்.",
  },

  {
    q: "Is there an option to get finance through a bank loan without private finance? Is a backload option available?\nபிரைவேட் ஃபைனான்ஸ் இல்லாமல் பேங்க் லோன் மூலம் கடன் பெற முடியுமா?",
    a:
      "Yes, bank loan finance is available without private finance.\n\n" +
      "ஆம், பிரைவேட் ஃபைனான்ஸ் இல்லாமல் பேங்க் லோன் மூலம் ஃபைனான்ஸ் பெறலாம்.",
  },

  {
    q: "Does Re2Buy fully check the car I am buying? Do I still need to check it myself?\nநான் வாங்கும் காரை Re2Buy முழுமையாக சரிபார்ப்பதா? நான் தனியாகச் சரிபார்க்க வேண்டுமா?",
    a:
      "Yes, it is definitely necessary for you to check the car yourself. Re2Buy mostly handles RC Owner cars, and we verify RC details and available service records.\n\n" +
      "ஆம், நீங்கள் தனியாக காரைச் சரிபார்ப்பது கண்டிப்பாக அவசியம். Re2Buy பெரும்பாலும் RC Owner கார்கள் மட்டுமே கையாளுகிறது, அதனால் RC விவரங்கள் மற்றும் கிடைக்கும் Service Records-ஐ நாங்கள் சரிபார்க்கிறோம்.\n\n" +
      "To ensure your satisfaction, it is good to carefully review the service records that we check and share with you before finalizing the purchase.\n\n" +
      "உங்கள் திருப்திக்காக, நாங்கள் சரிபார்த்து வழங்கும் Service Records-ஐ கவனமாகப் பார்த்து உறுதி செய்து வாங்குவது நல்லது.",
  },
];

/* ============================================================
   VIDEO
============================================================ */

const VIDEO_URL =
  "https://pub-73dec08cb6464c74a1b1bb96b4279b12.r2.dev/uploadimg/Comment%20(1)%20(1).mp4";

/* ============================================================
   FAQ PAGE
============================================================ */

export default function Faq() {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const callSupport = () => {
    window.location.href = "tel:8270149856";
  };

  const goFinance = () => {
    navigate("/finance");
  };

  const goHelp = () => {
    navigate("/help");
  };

  return (
    <div className="min-h-screen bg-[#eeeaff] text-black">
      {/* ======================================================
          GLOBAL STYLE
      ====================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            "Noto Sans Tamil",
            "Nirmala UI",
            Arial,
            sans-serif;
          background: #eeeaff;
        }

        .faq-scroll::-webkit-scrollbar {
          width: 7px;
        }

        .faq-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .faq-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,.18);
          border-radius: 999px;
        }

        .faq-card {
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease;
        }

        .faq-card:hover {
          transform: translateY(-1px);
          box-shadow:
            0 16px 40px rgba(0,0,0,.07);
        }

        .faq-answer {
          animation: faqOpen .25s ease;
        }

        @keyframes faqOpen {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 640px) {
          .faq-main {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .faq-video-wrap {
            height: 190px !important;
            border-radius: 20px !important;
          }

          .faq-question {
            font-size: 14px !important;
          }

          .faq-answer-text {
            font-size: 13px !important;
          }

          .faq-title {
            font-size: 25px !important;
          }

          .faq-subtitle {
            font-size: 12px !important;
          }
        }
      `}</style>

      {/* ======================================================
          APP BAR
      ====================================================== */}

      <header
        className="
          sticky top-0 z-50
          h-[64px]
          flex items-center justify-between
          px-3 sm:px-5
          border-b border-black/[0.06]
          bg-[#e9e9ff]/95
          backdrop-blur-xl
        "
      >
        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="
            w-[42px] h-[42px]
            rounded-full
            bg-white
            flex items-center justify-center
            shadow-sm
            border border-black/[0.04]
            hover:scale-105
            active:scale-95
            transition
          "
        >
          <ArrowLeft size={19} strokeWidth={2.2} />
        </button>

        {/* TITLE */}

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="m-0 text-[18px] sm:text-[20px] font-bold tracking-[-0.02em]">
            FAQ’s
          </h1>

          <p className="m-0 mt-[1px] text-[9px] sm:text-[10px] text-black/40">
            அடிக்கடி கேட்கப்படும் கேள்விகள்
          </p>
        </div>

        {/* EMPTY RIGHT AREA */}

        <div className="w-[42px] h-[42px]" />
      </header>

      {/* ======================================================
          PAGE
      ====================================================== */}

      <main
        className="
          faq-scroll
          min-h-[calc(100vh-64px)]
          overflow-y-auto
          bg-gradient-to-b
          from-[#d6cef3]
          via-[#eeeaff]
          to-[#f3efff]
        "
      >
        <div
          className="
            faq-main
            w-full
            max-w-[1050px]
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            pt-5
            sm:pt-7
            pb-12
          "
        >
          {/* ==================================================
              VIDEO
          ================================================== */}

          <div
            className="
              faq-video-wrap
              relative
              w-full
              h-[220px]
              sm:h-[280px]
              overflow-hidden
              rounded-[24px]
              bg-black
              shadow-[0_18px_50px_rgba(0,0,0,.12)]
              border border-white/60
            "
          >
            <video
              className="faq-video"
              src={VIDEO_URL}
              controls
              playsInline
              preload="metadata"
            />
          </div>

          {/* ==================================================
              INTRO
          ================================================== */}

          <section className="text-center mt-7 mb-7">
            <h2
              className="
                faq-title
                m-0
                text-[28px]
                sm:text-[32px]
                font-extrabold
                tracking-[-0.035em]
              "
            >
              Do You Have Any Questions?
            </h2>

            <p
              className="
                faq-subtitle
                mt-2
                mb-0
                text-[13px]
                sm:text-[14px]
                text-black/50
              "
            >
              Re2Buy – Trusted platform for buying &amp; selling used cars
            </p>
          </section>

          {/* ==================================================
              FAQ LIST
          ================================================== */}

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = expandedIndex === index;

              return (
                <React.Fragment key={`${faq.q}-${index}`}>
                  {/* CATEGORY */}

                  {faq.category && (
                    <div className="flex items-center gap-2 px-1 mt-2 -mb-1">
                      <span className="text-[15px] text-black/60">
                        ☆
                      </span>

                      <span className="text-[13px] sm:text-[14px] font-semibold text-black/55">
                        {faq.category}
                      </span>
                    </div>
                  )}

                  {/* CARD */}

                  <article
                    className={`
                      faq-card
                      overflow-hidden
                      bg-white
                      rounded-[17px]
                      border
                      ${
                        isOpen
                          ? "border-black/[0.08]"
                          : "border-black/[0.025]"
                      }
                      shadow-[0_8px_25px_rgba(0,0,0,.045)]
                    `}
                  >
                    {/* QUESTION */}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIndex(
                          isOpen ? -1 : index
                        )
                      }
                      className="
                        w-full
                        text-left
                        bg-transparent
                        border-0
                        cursor-pointer
                        px-4
                        sm:px-5
                        py-4
                        flex
                        items-center
                        gap-4
                      "
                    >
                      <span
                        className="
                          faq-question
                          flex-1
                          whitespace-pre-line
                          text-[15px]
                          sm:text-[16px]
                          leading-[1.45]
                          font-semibold
                          text-black
                        "
                      >
                        {faq.q}
                      </span>

                      <span
                        className={`
                          shrink-0
                          w-8
                          h-8
                          rounded-full
                          flex
                          items-center
                          justify-center
                          bg-black
                          text-white
                          transition-transform
                          duration-200
                          ${
                            isOpen
                              ? "rotate-0"
                              : "rotate-0"
                          }
                        `}
                      >
                        {isOpen ? (
                          <Minus size={16} strokeWidth={2.4} />
                        ) : (
                          <Plus size={16} strokeWidth={2.4} />
                        )}
                      </span>
                    </button>

                    {/* ANSWER */}

                    {isOpen && (
                      <div className="faq-answer px-4 sm:px-5 pb-5">
                        <div className="h-px bg-black/[0.05] mb-4" />

                        <p
                          className="
                            faq-answer-text
                            whitespace-pre-line
                            m-0
                            text-[14px]
                            leading-[1.65]
                            text-black/55
                          "
                        >
                          {faq.a}
                        </p>

                        {/* ==================================================
                            FINANCE LINK
                        ================================================== */}

                        {faq.financeLink && (
                          <button
                            type="button"
                            onClick={goFinance}
                            className="
                              mt-3
                              inline-flex
                              items-center
                              gap-1.5
                              border-0
                              bg-transparent
                              p-0
                              cursor-pointer
                              text-blue-600
                              font-semibold
                              text-[14px]
                              underline
                              underline-offset-2
                              hover:text-blue-800
                            "
                          >
                            மேலும் அறிந்து கொள்ள
                            <ExternalLink size={14} />
                          </button>
                        )}

                        {/* ==================================================
                            CONTACT LINK
                        ================================================== */}

                        {faq.contactLink && (
                          <div className="flex flex-col gap-2 mt-3">
                            <button
                              type="button"
                              onClick={goHelp}
                              className="
                                inline-flex
                                w-fit
                                items-center
                                gap-1.5
                                border-0
                                bg-transparent
                                p-0
                                cursor-pointer
                                text-blue-600
                                font-semibold
                                text-[14px]
                                underline
                                underline-offset-2
                                hover:text-blue-800
                              "
                            >
                              Contact us / தொடர்பு கொள்ள
                              <ExternalLink size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={callSupport}
                              className="
                                inline-flex
                                w-fit
                                items-center
                                gap-2
                                border-0
                                bg-transparent
                                p-0
                                cursor-pointer
                                text-blue-600
                                font-semibold
                                text-[14px]
                                underline
                                underline-offset-2
                                hover:text-blue-800
                              "
                            >
                              <Phone size={14} />
                              82701 49856
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                </React.Fragment>
              );
            })}
          </div>

          {/* ==================================================
              CONTACT CTA
          ================================================== */}

          <section
            className="
              mt-8
              rounded-[22px]
              bg-white
              border border-black/[0.04]
              shadow-[0_12px_35px_rgba(0,0,0,.055)]
              p-5
              sm:p-7
              text-center
            "
          >
            <div
              className="
                mx-auto
                w-11
                h-11
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
                mb-3
              "
            >
              <Phone size={18} />
            </div>

            <h3 className="m-0 text-[18px] sm:text-[20px] font-bold">
              Need more help?
            </h3>

            <p className="mt-2 mb-4 text-[13px] sm:text-[14px] text-black/50">
              எங்கள் Re2Buy support team-ஐ தொடர்பு கொள்ளலாம்.
            </p>

            <button
              type="button"
              onClick={callSupport}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-full
                bg-black
                text-white
                text-[13px]
                font-bold
                border-0
                cursor-pointer
                hover:scale-[1.02]
                active:scale-[.98]
                transition
              "
            >
              <Phone size={15} />
              82701 49856
            </button>
          </section>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <footer className="pt-8 pb-2">
            <div className="h-px bg-black/[0.06] mb-5" />

            <div className="text-center">
              <div className="text-[16px] font-extrabold">
                Re2Buy
              </div>

              <div className="mt-1 text-[11px] text-black/40">
                Trusted platform for buying &amp; selling used cars
              </div>

              <div className="mt-3 text-[10px] text-black/35">
                © {new Date().getFullYear()} Re2Buy. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}