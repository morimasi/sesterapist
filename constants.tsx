
import { Category, Activity } from './types';

export const ASSET_LIBRARY: Category[] = [
  {
    name: "Artikülasyon Oyunları",
    activities: [
      {
        id: "lib-1",
        title: "Balon Patlatma (R)",
        description: "/r/ sesi için temel artikülasyon çalışması.",
        duration: 15,
        type: "Oyun",
        category: "İnteraktif",
        image: "https://images.unsplash.com/photo-1550948390-6eb7fa773072?auto=format&fit=crop&q=80&w=400",
        settings: {
          targetSoundPosition: "Karışık",
          difficulty: "Orta",
          notes: "Danışana dilini yukarıda ve geride tutmasını hatırlatın. Zorlanırsa işitsel ayırt etme moduna geçin."
        }
      },
      {
        id: "lib-2",
        title: "Orman Hafızası",
        description: "Artikülasyon hedefleriyle görsel hafıza çalışması.",
        duration: 10,
        type: "Hafıza",
        category: "Görsel Hafıza",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400",
        settings: {
          targetSoundPosition: "Başlangıç",
          difficulty: "Kolay",
          notes: ""
        }
      }
    ]
  },
  {
    name: "Bilgi Kartları",
    activities: [
      {
        id: "lib-animal-cards",
        title: "Çiftlik Hayvanları Kelime Kartları",
        description: "Çiftlik hayvanlarını tanıma, seslerini taklit etme ve alıcı/ifade edici dil becerilerini geliştirme amaçlı interaktif set.",
        duration: 10,
        type: "Kartlar",
        category: "Kelime Dağarcığı",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400",
        settings: {
          targetSoundPosition: "Başlangıç",
          difficulty: "Kolay",
          notes: "Her hayvanın adını söylerken çıkardığı sesi taklit etmesini isteyin. Hayvanın özelliklerini (boyut, renk) sorarak betimleme becerisini destekleyin."
        }
      },
      {
        id: "lib-4",
        title: "Mutfak Gereçleri",
        description: "Günlük yaşam nesneleri ve mutfak temalı kelime kartları.",
        duration: 8,
        type: "Kartlar",
        category: "Kelime Dağarcığı",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400",
        settings: {
          targetSoundPosition: "Başlangıç",
          difficulty: "Orta",
          notes: ""
        }
      }
    ]
  },
  {
    name: "Nefes Egzersizleri",
    activities: [
      {
        id: "lib-3",
        title: "Bulut Nefesi",
        description: "Konuşma pratiği öncesi nefesi düzenlemek için ısınma egzersizi.",
        duration: 5,
        type: "Egzersiz",
        category: "Gevşeme",
        image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&q=80&w=400",
        settings: {
          targetSoundPosition: "Başlangıç",
          difficulty: "Kolay",
          notes: ""
        }
      }
    ]
  }
];

export const INITIAL_SESSION_FLOW: Activity[] = [
  {
    id: "session-1",
    title: "Bulut Nefesi",
    description: "Isınma ve nefes kontrolü.",
    duration: 5,
    type: "Egzersiz",
    category: "Gevşeme",
    image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&q=80&w=400",
    settings: {
      targetSoundPosition: "Başlangıç",
      difficulty: "Kolay",
      notes: ""
    }
  },
  {
    id: "session-animal",
    title: "Çiftlik Hayvanları",
    description: "Kelime dağarcığı ve ses taklidi.",
    duration: 10,
    type: "Kartlar",
    category: "Kelime Dağarcığı",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400",
    settings: {
      targetSoundPosition: "Başlangıç",
      difficulty: "Kolay",
      notes: ""
    }
  }
];
