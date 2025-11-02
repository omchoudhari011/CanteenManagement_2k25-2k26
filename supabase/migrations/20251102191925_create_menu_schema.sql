/*
  # Restaurant Menu Database Schema

  ## Overview
  Creates the database structure for a restaurant menu web application with user authentication
  and menu item management capabilities.

  ## New Tables

  ### `menu_items`
  Stores all restaurant menu items with their details.
  - `id` (bigint, primary key) - Auto-increment ID for each menu item
  - `name` (text) - Name of the dish
  - `description` (text) - Short description of the dish
  - `price` (numeric(6,2)) - Item price with 2 decimal precision
  - `type` (text) - Either "veg" or "nonveg" to indicate food type
  - `image_url` (text, nullable) - Optional image URL for the dish
  - `created_at` (timestamptz) - Auto-generated timestamp
  - `updated_at` (timestamptz) - Auto-updated timestamp

  ## Security

  ### Row Level Security (RLS)
  - RLS is enabled on `menu_items` table
  - Public users can view all menu items (SELECT)
  - Only authenticated users can insert, update, or delete menu items (admin functionality)

  ### Policies
  1. **Public Read Access**: Anyone can view menu items
  2. **Authenticated Insert**: Only logged-in users can add menu items
  3. **Authenticated Update**: Only logged-in users can update menu items
  4. **Authenticated Delete**: Only logged-in users can delete menu items

  ## Notes
  - Uses Supabase's built-in `auth.users` table for user management
  - Leverages `auth.uid()` for authentication checks in RLS policies
  - Menu items are publicly viewable to allow non-logged-in users to browse
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(6,2) NOT NULL CHECK (price >= 0),
  type text NOT NULL CHECK (type IN ('veg', 'nonveg')),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_type ON menu_items(type);
CREATE INDEX IF NOT EXISTS idx_menu_items_created_at ON menu_items(created_at DESC);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view menu items (public access)
CREATE POLICY "Public users can view menu items"
  ON menu_items
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert menu items
CREATE POLICY "Authenticated users can add menu items"
  ON menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update menu items
CREATE POLICY "Authenticated users can update menu items"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete menu items
CREATE POLICY "Authenticated users can delete menu items"
  ON menu_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample menu items for testing
INSERT INTO menu_items (name, description, price, type, image_url) VALUES
  ('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomatoes, and basil', 12.99, 'veg', 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg'),
  ('Grilled Chicken Sandwich', 'Juicy grilled chicken with lettuce, tomato, and special sauce', 10.99, 'nonveg', 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg'),
  ('Caesar Salad', 'Fresh romaine lettuce with parmesan, croutons, and Caesar dressing', 8.99, 'veg', 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg'),
  ('Beef Burger', 'Prime beef patty with cheese, pickles, and signature sauce', 13.99, 'nonveg', 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'),
  ('Veggie Pasta', 'Penne pasta with seasonal vegetables in marinara sauce', 11.99, 'veg', 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'),
  ('Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce', 18.99, 'nonveg', 'https://images.pexels.com/photos/3662118/pexels-photo-3662118.jpeg'),
  ('Paneer Tikka', 'Cottage cheese marinated in spices and grilled', 9.99, 'veg', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'),
  ('Chicken Wings', 'Crispy wings tossed in buffalo sauce', 11.99, 'nonveg', 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg')
ON CONFLICT DO NOTHING;