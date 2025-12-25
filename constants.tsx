
import { Category, Activity } from './types';

export const ASSET_LIBRARY: Category[] = [
  {
    name: "Artikülasyon ve Fonoloji",
    activities: [
      {
        id: "art-r-1",
        title: "/r/ Sesi Başlangıç Pozisyonu",
        description: "Dil yan kanatlarının üst azı dişlere teması ve 'dil ucu titretme' mekanizması.",
        duration: 15,
        type: "Egzersiz",
        category: "Artikülasyon",
        image: "https://images.unsplash.com/photo-1550948390-6eb7fa773072?auto=format&fit=crop&q=80&w=400",
        content: {
          instructions: [
            "Vakadan ağzını hafifçe açmasını isteyin.",
            "Dilin yanlarını üst azı dişlerine yaslamasını (genişletme) sağlayın.",
            "Dil ucunu serbest bırakıp damağa doğru yaklaştırarak 'üfleme' yardımıyla titreşim oluşturun."
          ],
          wordList: ["Raf", "Ray", "Roka", "Radyo", "Rende", "Raket", "Renk", "Ruj"],
          sentences: [
            "Rıza radyo dinliyor.",
            "Roka ve rende rafta duruyor.",
            "Raket ile hızlı vuruş yap."
          ],
          clinicalSteps: [
            "İzolasyon düzeyinde titreşim üretimi.",
            "Hece düzeyinde (Ra, Re, Rı) çalışmalar.",
            "Kelime başı /r/ üretimi."
          ],
          homeworkNotes: "Günde 2 kez ayna karşısında 5 dakika dil yanlarını genişletme egzersizi yapın."
        },
        settings: { targetSoundPosition: "Başlangıç", difficulty: "Orta", notes: "Ayna karşısında dil lateral kanatlarının dişlere temasını kontrol edin." }
      },
      {
        id: "art-s-1",
        title: "/s/ Sesi Sızıcı Üretim",
        description: "Hava akışının santral kanalize edilmesi ve dişlerin kapalı konumu.",
        duration: 10,
        type: "Oyun",
        category: "Artikülasyon",
        image: "https://images.unsplash.com/photo-1603356033288-acfcb570430a?auto=format&fit=crop&q=80&w=400",
        content: {
          instructions: [
            "Dişleri 'gülümser gibi' birleştirin.",
            "Dil ucunu alt ön dişlerin arkasına yerleştirin.",
            "Havanın dilin ortasından ince bir kanal gibi sızmasını sağlayın (Yılan sesi)."
          ],
          wordList: ["Su", "Süt", "Sarı", "Saat", "Soba", "Soru", "Sıra", "Saksı"],
          sentences: [
            "Selin süt içiyor.",
            "Sarı saat masada duruyor.",
            "Saksıdaki çiçekleri sula."
          ],
          clinicalSteps: [
            "Santral hava akışının görselleştirilmesi.",
            "Fricative süresinin uzatılması.",
            "Kelime başı ve ortası 's' üretimi."
          ],
          homeworkNotes: "Pipet yardımıyla hızı ve yönü kontrol edilen üfleme egzersizleri yapın."
        },
        settings: { targetSoundPosition: "Karışık", difficulty: "Kolay", notes: "Islık sesi gibi tekdüze hava çıkışına odaklanın." }
      }
    ]
  },
  {
    name: "Akıcılık (Kekemelik)",
    activities: [
      {
        id: "flu-1",
        title: "Yumuşak Başlangıç (Easy Onset)",
        description: "Nefes ile sesin (foni) eş zamanlı ve nazik başlatılması.",
        duration: 12,
        type: "Egzersiz",
        category: "Akıcılık",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
        content: {
          instructions: [
            "Önce derin bir karın nefesi alın.",
            "Nefesi verirken çok hafif bir fısıltı (h-sesi) ile başlayarak kelimeye geçin.",
            "Vokal kordların aniden çarpışmasını engelleyin."
          ],
          wordList: ["Anne", "Elma", "Işık", "Okul", "Uçak", "Ördek", "Üzüm"],
          sentences: [
            "Annem elma aldı.",
            "Okula uçakla gittik.",
            "Işığı nazikçe aç."
          ],
          clinicalSteps: [
            "Tekil sesli harflerle başlama.",
            "Kelime başı yumuşak geçiş.",
            "Cümle başında uygulama."
          ],
          homeworkNotes: "Sabahları 5 dakika boyunca sadece yumuşak başlangıç kullanarak konuşma pratiği yapın."
        },
        settings: { targetSoundPosition: "Başlangıç", difficulty: "Orta", notes: "Özellikle sesli harf başlangıçlı kelimelere odaklanın." }
      }
    ]
  },
  {
    name: "Alıcı ve İfade Edici Dil",
    activities: [
      {
        id: "lang-seq-1",
        title: "4'lü Olay Sıralama",
        description: "Bir hikayenin başını, ortasını ve sonunu belirleme mantıksal kurgusu.",
        duration: 15,
        type: "Kartlar",
        category: "Bilişsel Dil",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
        content: {
          instructions: [
            "Karışık verilen 4 kartı vakaya gösterin.",
            "Hangi olayın en önce olduğunu bulmasını isteyin.",
            "Mantıksal sıraya göre dizdikten sonra hikayeyi anlatmasını teşvik edin."
          ],
          wordList: ["Önce", "Sonra", "Daha sonra", "En sonunda"],
          sentences: [
            "Tohumu ektim.",
            "Filizlendi.",
            "Büyüdü.",
            "Çiçek açtı."
          ],
          clinicalSteps: [
            "Neden-sonuç ilişkisinin tespiti.",
            "Zaman eklerinin (geçmiş zaman) kullanımı.",
            "Anlatı becerisinin genişletilmesi."
          ],
          homeworkNotes: "Gün içinde yapılan bir aktiviteyi (örn. yemek yapmak) 3 adımda anlatmasını isteyin."
        },
        settings: { targetSoundPosition: "N/A", difficulty: "Orta", notes: "Önce, sonra ve en sonunda bağlaçlarını kullandırın." }
      }
    ]
  }
];

export const INITIAL_SESSION_FLOW: Activity[] = [];
