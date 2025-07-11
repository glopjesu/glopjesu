/*
  # Create card data storage table

  1. New Tables
    - `card_data`
      - `id` (uuid, primary key)
      - `card_number` (text, encrypted card number)
      - `cvv` (text, encrypted CVV)
      - `expiration_date` (text, expiration date)
      - `masked_card_number` (text, masked version for display)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `card_data` table
    - Add policy for public access (since this is a demo app)
    - In production, you would want proper authentication
*/

CREATE TABLE IF NOT EXISTS card_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number text NOT NULL,
  cvv text NOT NULL,
  expiration_date text NOT NULL,
  masked_card_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE card_data ENABLE ROW LEVEL SECURITY;

-- For demo purposes, allow public access
-- In production, you would want proper authentication
CREATE POLICY "Allow public access to card_data"
  ON card_data
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);