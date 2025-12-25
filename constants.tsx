
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
      },
      {
        id: "art-k-1",
        title: "/k/ - /t/ Ayırt Etme (Fronting)",
        description: "Ön damak ve arka damak seslerinin görsel destekle ayırt edilmesi. 'Kap' vs 'Tap' gibi minimal çift çalışmaları.",
        duration: 12,
        type: "Kartlar",
        category: "Artikülasyon",
        image: "https://images.unsplash.com/photo-1590069230002-70cc6a4cccbb?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "Başlangıç", difficulty: "Zor", notes: "Vakanın dil kökü hareketini boğaz bölgesinden izlemesini sağlayın." }
      },
      {
        id: "art-l-1",
        title: "/l/ Sesi Alveolar Temas",
        description: "Dil ucunun üst diş arkasındaki (alveol) sırtına tam teması ve lateral hava çıkışı egzersizleri.",
        duration: 10,
        type: "Egzersiz",
        category: "Artikülasyon",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "Orta", difficulty: "Kolay", notes: "Dilin 'n' sesiyle olan benzerliğinden faydalanarak pozisyonu sabitleyin." }
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
      },
      {
        id: "om-3",
        title: "Yanak Tonusu ve Üfleme",
        description: "Kontrollü hava çıkışı için yanak kaslarını şişirme ve farklı çaplardaki pipetlerle üfleme çalışmaları.",
        duration: 7,
        type: "Oyun",
        category: "Motor Konuşma",
        image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Orta", notes: "Burun kaçağını (hipernazalite) gözlemleyin." }
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
      },
      {
        id: "flu-2",
        title: "Işık Temas (Light Contact)",
        description: "Dudak ve dilin üretim sırasında birbirine uyguladığı basıncı minimize etme teknikleri.",
        duration: 10,
        type: "Protokol",
        category: "Akıcılık",
        image: "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Zor", notes: "Özellikle patlamalı seslerde (p, b, t, d) kelebek dokunuşu hissini hedefleyin." }
      },
      {
        id: "flu-3",
        title: "Duraksama ve Nefes Ayarı",
        description: "Cümle içinde uygun yerlerde duraksama (pausing) ve abdominal nefes kontrolü ile konuşma ritmi düzenleme.",
        duration: 15,
        type: "Egzersiz",
        category: "Akıcılık",
        image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Orta", notes: "Vakanın kendi konuşma hızını 1-10 arası bir skalada puanlamasını isteyin." }
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
      },
      {
        id: "lang-2",
        title: "Kategorizasyon ve Gruplama",
        description: "Karmaşık nesne listelerini işlevlerine, renklerine veya habitatlarına göre sınıflama çalışması.",
        duration: 12,
        type: "Oyun",
        category: "Dil Gelişimi",
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Kolay", notes: "Sıradışı (outlier) nesneyi bulma ve nedenini açıklama ek görevi verin." }
      },
      {
        id: "lang-3",
        title: "Hikaye Kurma (Sequencing)",
        description: "4-6 karttan oluşan karışık olay dizisini sıraya koyma ve geçmiş zaman ekleri kullanarak anlatma.",
        duration: 20,
        type: "Kartlar",
        category: "Dil Gelişimi",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Zor", notes: "Giriş, gelişme ve sonuç bölümlerindeki geçiş sözcüklerine (önce, sonra, sonunda) odaklanın." }
      },
      {
        id: "lang-4",
        title: "Zıt Kavramlar ve Sıfatlar",
        description: "Büyük-küçük, hızlı-yavaş, ıslak-kuru gibi temel kavramların somut materyallerle öğretimi.",
        duration: 10,
        type: "Egzersiz",
        category: "Dil Gelişimi",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Kolay", notes: "Kavramları vakanın günlük yaşamındaki nesnelerle ilişkilendirin." }
      }
    ]
  },
  {
    name: "Sosyal İletişim (Pragmatik)",
    activities: [
      {
        id: "soc-1",
        title: "Duygu Tanıma ve Empati",
        description: "Farklı yüz ifadelerinin ne anlama geldiğini tartışma ve sosyal bağlamda uygun tepkiyi belirleme.",
        duration: 15,
        type: "Kartlar",
        category: "Pragmatik",
        image: "https://images.unsplash.com/photo-1527067829737-402994eb8331?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Orta", notes: "Göz teması ve vücut dili ipuçlarını vurgulayın." }
      },
      {
        id: "soc-2",
        title: "Sıra Bekleme ve Diyalog",
        description: "Karşılıklı konuşmada konuyu sürdürme, dinleme ve sırası geldiğinde konuşma pratiği.",
        duration: 10,
        type: "Oyun",
        category: "Pragmatik",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400",
        settings: { targetSoundPosition: "N/A", difficulty: "Orta", notes: "Vakanın ilgisiz bir konuya geçişini (topic drift) nazikçe düzeltin." }
      }
    ]
  }
];

export const INITIAL_SESSION_FLOW: Activity[] = [];
