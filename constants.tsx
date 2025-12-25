
import { Category, Activity } from './types';

export const ASSET_LIBRARY: Category[] = [
  {
    name: "Artikülasyon (Fonem Odaklı)",
    activities: [
      {
        id: "art-r-1",
        title: "/r/ Sesi Başlangıç Pozisyonu",
        description: "Dilin 'v' şekli alarak damak arkasına konumlandırılması ve titreşimli üretimi için kelime düzeyi çalışmaları.",
        duration: 15,
        type: "Egzersiz",
        category: "Artikülasyon",
        image: "https://images.unsplash.com/photo-1550948390-6eb7fa773072?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "Başlangıç", difficulty: "Orta", notes: "Ayna karşısında dil lateral kanatlarının dişlere temasını kontrol edin." }
      },
      {
        id: "art-s-1",
        title: "/s/ Sesi Sızıcı Üretim",
        description: "Hava akışının santral kanalize edilmesi, dişlerin kapalı konumu ve dudakların hafif retraksiyonu.",
        duration: 10,
        type: "Oyun",
        category: "Artikülasyon",
        image: "https://images.unsplash.com/photo-1603356033288-acfcb570430a?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "Karışık", difficulty: "Kolay", notes: "Islık sesi gibi tekdüze hava çıkışına odaklanın." }
      }
    ]
  },
  {
    name: "Oral Motor & Miyofonksiyonel",
    activities: [
      {
        id: "om-1",
        title: "Dil Direnç ve Mobilite",
        description: "Dil ucunun alveol sırtında tutulması ve lateral direnç egzersizleri (Dil basacağı desteğiyle).",
        duration: 8,
        type: "Egzersiz",
        category: "Motor Konuşma",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Zor", notes: "Yorulma belirtilerini takip edin, 10'arlı setler halinde uygulayın." }
      },
      {
        id: "om-2",
        title: "Dudak Yuvarlama ve Retraksiyon",
        description: "U-İ geçişleri ile dudak kaslarının dinamik kontrolü ve konuşma hızı stabilizasyonu.",
        duration: 5,
        type: "Egzersiz",
        category: "Motor Konuşma",
        image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Kolay", notes: "Abartılı hareketlerden kaçının, doğal prosodiyi koruyun." }
      }
    ]
  },
  {
    name: "Akıcılık ve Hız Kontrolü",
    activities: [
      {
        id: "flu-1",
        title: "Yumuşak Başlangıç (Easy Onset)",
        description: "Vokal kordların nazikçe birleştirilmesi ve nefesle senkronize ses üretimi çalışmaları.",
        duration: 12,
        type: "Egzersiz",
        category: "Akıcılık",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "Başlangıç", difficulty: "Orta", notes: "H-Sesi yardımıyla fısıltıdan tam sese yumuşak geçiş yapın." }
      }
    ]
  },
  {
    name: "Dil ve Bilişsel Gelişim",
    activities: [
      {
        id: "lang-1",
        title: "Neden-Sonuç İlişkisi Kartları",
        description: "Görsel senaryolar üzerinden olayların mantıksal sırasını kurma ve ifade edici dil becerisi.",
        duration: 15,
        type: "Kartlar",
        category: "Dil Gelişimi",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Orta", notes: "Vakanın 'çünkü' ve 'bu yüzden' bağlaçlarını kullanımını teşvik edin." }
      }
    ]
  }
];

export const INITIAL_SESSION_FLOW: Activity[] = [];
