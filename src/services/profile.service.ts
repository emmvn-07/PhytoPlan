import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import type { Profile } from '@/types/models';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

function toProfile(row: Pick<ProfileRow, 'id' | 'full_name' | 'avatar_url'>): Profile {
  return { id: row.id, fullName: row.full_name, avatarUrl: row.avatar_url };
}

/** User profiles (`public.profiles`). In demo mode reads return null and writes are no-ops. */
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data ? toProfile(data) : null;
  },

  async updateProfile(userId: string, updates: { fullName: string }): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: updates.fullName, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },
};
