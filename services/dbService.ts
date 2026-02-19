
/**
 * TheraSpeech Veri Servisi
 * Frontend (React) -> Vercel Serverless Functions -> Vercel Postgres
 */

import { User, Activity } from '../types';

export const dbService = {
  // Kullanıcıları Getir
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('API Hatası');
      const data = await res.json();
      
      // DB verisini Frontend tipine dönüştür
      return data.map((u: any) => ({
        id: u.id.toString(),
        name: u.full_name,
        email: u.email,
        role: u.role,
        status: u.status,
        avatar: u.avatar_url,
        joinedAt: u.created_at
      }));
    } catch (error) {
      console.warn("Veritabanına bağlanılamadı, mock veri kullanılıyor.", error);
      return []; // Fallback to empty or context mock data
    }
  },

  // Yeni Kullanıcı Ekle
  async createUser(user: Partial<User>) {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        })
      });
      return await res.json();
    } catch (error) {
      console.error("Kullanıcı oluşturulamadı:", error);
      return null;
    }
  },

  // Materyal Kaydet
  async saveMaterial(activity: Activity) {
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activity.title,
          description: activity.description,
          type: activity.type,
          content: activity.content,
          image: activity.image,
          settings: {
            targetSound: activity.settings?.notes?.includes('/r/') ? 'R' : 'General', // Basit parsing, geliştirilebilir
            ageGroup: 'General'
          }
        })
      });
      const data = await res.json();
      console.log("Materyal DB'ye kaydedildi:", data);
      return data;
    } catch (error) {
      console.error("Materyal kaydı başarısız:", error);
    }
  },

  // Materyalleri Getir (Kütüphane için)
  async getMaterials(): Promise<Activity[]> {
    try {
      const res = await fetch('/api/materials');
      if (!res.ok) return [];
      const data = await res.json();
      
      return data.map((m: any) => ({
        id: m.id.toString(),
        title: m.title,
        description: m.description,
        type: m.type,
        category: 'Kayıtlı Materyaller',
        image: m.image_url,
        content: m.content, // JSONB otomatik parse edilir
        duration: 15
      }));
    } catch (error) {
      return [];
    }
  }
};
