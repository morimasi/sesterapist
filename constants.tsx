
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
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-8XAQo7YfCGDrlhJl6upAC0SypUyKFPEMWo3h6RDnxGFSvi4pVgq97GLXDXxNrUKEHrdXvBigOpNxaU230Y2YLpXdiltijVjCkE90WDl2uL_Q3s2ADxKAU0H37p-qSPhR_mw2Eb9EnbITgyBcJyhdPF5fnx_-Y9OzxFzTb0EfHDE-PLAS5rHYxBOkOggzIzGvJ6LVD9QKP-PIHibXy0xarVxi-F1wUY8Zzd_pCREXQaw6IlldIaTxZXl4sy1KcQ517ZR1gYwrzTdI",
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
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAe1-tPPVfDcm4A6nuUE_zGjXZHUfSnIkW9RZBwm65lNCTUgex4ep8FZCLQxsEHDuNztfQ0i83Q37dWKjA1IaCK1SjL1Y0Je3XtivpBt8jFXnwbB6-Iqr3p2hZAp4DmWqkVdOs92njJiIkPTTaQub8Ia3YPGS7lqZMWy1V5QX_03MnsznsHDHZYqf1EndIEuVDuF4Q76-n49xCQrB9FZAi0cfvJ3ntdSB_V-pUZ_5T8xYERsqg5WA3SqWUFSSyDOVwzSkT-A1c6iII0",
        settings: {
          targetSoundPosition: "Başlangıç",
          difficulty: "Kolay",
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
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD55Z3DhIphhhhth9gw89ci9tRPbs2A2-e5nZcOtNJm0aOxYKpOVs8T7mfMfg9LjBsb2uzz_euo2k8bC8nQf86YjinNzN5sfgv04_OXAvKVbuDu_al-kVwnNASwdxdYkVXww17s-2lKpk6KIZhzeQVEiuyhLS1IAsc3kZ2oDggc0khMM7EhwpqWOZwHVkgujkijvfeswDGNZf4ZYM8znD9xPxLJje-fwOg1qvRm9yb0PhX1gJFZjaOmALgAx-oTFp89esIv-BN2vpRn",
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
        id: "lib-4",
        title: "Çiftlik Hayvanları",
        description: "Çiftlik temalı seanslar için kelime kartları.",
        duration: 0,
        type: "Kartlar",
        category: "Kelime Dağarcığı",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDttOiMveyEJ2UAdzgwfuRSbcDYZn5ysnVpCV-OW4-8y8d0t_-5sLtF6q1DDnG-orTIiuBG6Yu4pEho04Rh5cqW65TjTAm903BbFv9bfgyf-BSBfVhhGSw1YlwFk9pr-ALUdXicERiNkD4bE8X5zVuxPyjO2r0hsZWgHwG6GPWh7GSfAGHRFtd_w5roZdmbt-zl1jwLho2-JLOXGf24RmBrddiZt7WZIpSTGz3CInFlsadlB3ZokzCRIEc8Jf_YzmPfXwiOAPfNYv-n",
        settings: {
          targetSoundPosition: "Başlangıç",
          difficulty: "Orta",
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
    description: "Konuşma pratiği öncesi nefesi düzenlemek için ısınma egzersizi.",
    duration: 5,
    type: "Egzersiz",
    category: "Gevşeme",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtNUGiZ5JljV5KAis1yGZgxrLGccGnNJr5kGuiIEsVbhsjhe04IiImo-sL9joFv4v0YsptfQ-N3CP8Skzy91VW70Q-I8_hYKmjmxRr5tkUlkukpEyLFkvnlPd15zM_ys-laH5pcmkgnEYapdQxKRWBnbiUxKDehRdPZqpnnQoqXHaoPzkjDwHNSp8uveFcPc5lvpqO9mJEgu8Ug25568DfZKFQvOB2giQQFabaR2m9DVOol4ilbuJ1TXa08QIV3bBeGYCaT4bhQC_E",
    settings: {
      targetSoundPosition: "Başlangıç",
      difficulty: "Kolay",
      notes: ""
    }
  },
  {
    id: "session-2",
    title: "Balon Patlatma (R)",
    description: "/r/ sesi için temel artikülasyon çalışması.",
    duration: 15,
    type: "Oyun",
    category: "İnteraktif",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6urhMVEpYVQwHf6D1hGe7j3XZC2CFduUjkKjxRYabOcfBKw2GF1z4B2w4Ev6nOAvTBRrxyN-nLXyNlTLN089IPOUnc50lUdIupX18i420yjKIEPxhYIj7866MNR-6rS2wgMzIYJbrp4sv79-C9Ij_gH5rwjMcBXU6OO4Kt-stFR5SxZJspZJ5AVTxjgqw6nHqkxhTDIN9K4-nnO2T54X1BR--Njb7Mchi4j_tz-IAWZUEiUdgm6X0f8MqfLUYIgotVzzoXI5jMMx6",
    settings: {
      targetSoundPosition: "Karışık",
      difficulty: "Orta",
      notes: "Danışana dilini yukarıda ve geride tutmasını hatırlatın. Zorlanırsa işitsel ayırt etme moduna geçin."
    }
  },
  {
    id: "session-3",
    title: "Orman Hafızası Ödülü",
    description: "Seans sonu ödül oyunu.",
    duration: 5,
    type: "Ödül",
    category: "Oyun",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuxT__BxYYDt8TwpHAAr3D1JyfJG5-8jv32yReKXUCYhie18t_RwGZsWl1n6gEXwhz_RwsDckvvmK316hX2xoBInw7EqOHkJWGuYuJIWq7SaxNQw1nhykvSY_nnFyavpKGcnUPYGZLL_0_mYdYfRfqrhW_gx5PlEsXoolmATqMzOWXAjQ3JuMNb4gj9aMrWNLS_Fc_kJq5TNSYGtgic6V2ZamF4eRuJeEIysiVYgWGwbtrdC30tLz_1oEoOb7Uc0Ikx6hj_PkTXH4x",
    settings: {
      targetSoundPosition: "Karışık",
      difficulty: "Kolay",
      notes: ""
    }
  }
];
