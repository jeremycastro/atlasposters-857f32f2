-- Populate tag categories and tags for artwork/brand system

-- Insert Categories
INSERT INTO category_definitions (category_key, display_name, description, scope, icon, color, sort_order, is_hierarchical, allows_custom_tags) VALUES
('theme', 'Theme', 'Visual themes and subjects depicted in the artwork', ARRAY['artwork', 'brand'], 'Palette', '#3B82F6', 1, false, true),
('style', 'Style', 'Artistic style and movement classification', ARRAY['artwork', 'brand'], 'Paintbrush', '#8B5CF6', 2, false, true),
('medium', 'Medium', 'Art medium and materials used', ARRAY['artwork'], 'Droplet', '#EC4899', 3, false, true),
('color_palette', 'Color Palette', 'Dominant color schemes in the artwork', ARRAY['artwork', 'brand'], 'Palette', '#F59E0B', 4, false, false),
('mood', 'Mood', 'Emotional tone and atmosphere', ARRAY['artwork', 'brand'], 'Heart', '#EF4444', 5, false, true),
('subject', 'Subject', 'Main subjects and content depicted', ARRAY['artwork'], 'Image', '#10B981', 6, true, true),
('use_case', 'Use Case', 'Intended applications and products', ARRAY['artwork', 'product'], 'Package', '#6366F1', 7, false, true),
('season', 'Season', 'Seasonal associations and timing', ARRAY['artwork', 'product'], 'Calendar', '#14B8A6', 8, false, false);

-- Insert Theme Tags
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, tag_type, sort_order)
SELECT id, 'abstract', 'Abstract', 'Non-representational, focusing on color, shape, and form', 'system', 1 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'nature', 'Nature', 'Natural landscapes, flora, and fauna', 'system', 2 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'urban', 'Urban', 'Cityscapes, architecture, and urban life', 'system', 3 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'geometric', 'Geometric', 'Geometric patterns and shapes', 'system', 4 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'floral', 'Floral', 'Flowers and botanical elements', 'system', 5 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'coastal', 'Coastal', 'Ocean, beach, and coastal scenes', 'system', 6 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'vintage', 'Vintage', 'Retro and nostalgic themes', 'system', 7 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'minimalist', 'Minimalist', 'Simple, clean, and uncluttered designs', 'system', 8 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'tropical', 'Tropical', 'Tropical plants and paradise themes', 'system', 9 FROM category_definitions WHERE category_key = 'theme'
UNION ALL
SELECT id, 'boho', 'Bohemian', 'Free-spirited, eclectic bohemian style', 'system', 10 FROM category_definitions WHERE category_key = 'theme';

-- Insert Style Tags
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, tag_type, sort_order)
SELECT id, 'contemporary', 'Contemporary', 'Modern, current artistic expression', 'system', 1 FROM category_definitions WHERE category_key = 'style'
UNION ALL
SELECT id, 'impressionist', 'Impressionist', 'Loose brushwork, light and color emphasis', 'system', 2 FROM category_definitions WHERE category_key = 'style'
UNION ALL
SELECT id, 'expressionist', 'Expressionist', 'Emotional, distorted for effect', 'system', 3 FROM category_definitions WHERE category_key = 'style'
UNION ALL
SELECT id, 'pop_art', 'Pop Art', 'Bold colors, commercial imagery', 'system', 4 FROM category_definitions WHERE category_key = 'style'
UNION ALL
SELECT id, 'watercolor_style', 'Watercolor Style', 'Fluid, transparent aesthetic', 'system', 5 FROM category_definitions WHERE category_key = 'style'
UNION ALL
SELECT id, 'line_art', 'Line Art', 'Simple line drawings', 'system', 6 FROM category_definitions WHERE category_key = 'style'
UNION ALL
SELECT id, 'photorealistic', 'Photorealistic', 'Highly detailed, photo-like', 'system', 7 FROM category_definitions WHERE category_key = 'style'
UNION ALL
SELECT id, 'illustration', 'Illustration', 'Stylized illustrative approach', 'system', 8 FROM category_definitions WHERE category_key = 'style';

-- Insert Medium Tags
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, tag_type, sort_order)
SELECT id, 'oil_paint', 'Oil Paint', 'Traditional oil painting', 'system', 1 FROM category_definitions WHERE category_key = 'medium'
UNION ALL
SELECT id, 'acrylic', 'Acrylic', 'Acrylic paint medium', 'system', 2 FROM category_definitions WHERE category_key = 'medium'
UNION ALL
SELECT id, 'watercolor', 'Watercolor', 'Water-based paint', 'system', 3 FROM category_definitions WHERE category_key = 'medium'
UNION ALL
SELECT id, 'digital', 'Digital', 'Digital artwork creation', 'system', 4 FROM category_definitions WHERE category_key = 'medium'
UNION ALL
SELECT id, 'mixed_media', 'Mixed Media', 'Combination of multiple mediums', 'system', 5 FROM category_definitions WHERE category_key = 'medium'
UNION ALL
SELECT id, 'photography', 'Photography', 'Photographic work', 'system', 6 FROM category_definitions WHERE category_key = 'medium'
UNION ALL
SELECT id, 'ink', 'Ink', 'Ink-based artwork', 'system', 7 FROM category_definitions WHERE category_key = 'medium';

-- Insert Color Palette Tags
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, tag_type, sort_order)
SELECT id, 'warm', 'Warm', 'Reds, oranges, yellows', 'system', 1 FROM category_definitions WHERE category_key = 'color_palette'
UNION ALL
SELECT id, 'cool', 'Cool', 'Blues, greens, purples', 'system', 2 FROM category_definitions WHERE category_key = 'color_palette'
UNION ALL
SELECT id, 'neutral', 'Neutral', 'Beiges, grays, whites', 'system', 3 FROM category_definitions WHERE category_key = 'color_palette'
UNION ALL
SELECT id, 'vibrant', 'Vibrant', 'Bold, saturated colors', 'system', 4 FROM category_definitions WHERE category_key = 'color_palette'
UNION ALL
SELECT id, 'pastel', 'Pastel', 'Soft, light colors', 'system', 5 FROM category_definitions WHERE category_key = 'color_palette'
UNION ALL
SELECT id, 'monochrome', 'Monochrome', 'Single color or grayscale', 'system', 6 FROM category_definitions WHERE category_key = 'color_palette'
UNION ALL
SELECT id, 'earth_tones', 'Earth Tones', 'Natural browns, greens, tans', 'system', 7 FROM category_definitions WHERE category_key = 'color_palette';

-- Insert Mood Tags
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, tag_type, sort_order)
SELECT id, 'calm', 'Calm', 'Peaceful and tranquil', 'system', 1 FROM category_definitions WHERE category_key = 'mood'
UNION ALL
SELECT id, 'energetic', 'Energetic', 'Dynamic and lively', 'system', 2 FROM category_definitions WHERE category_key = 'mood'
UNION ALL
SELECT id, 'romantic', 'Romantic', 'Soft and sentimental', 'system', 3 FROM category_definitions WHERE category_key = 'mood'
UNION ALL
SELECT id, 'dramatic', 'Dramatic', 'Bold and striking', 'system', 4 FROM category_definitions WHERE category_key = 'mood'
UNION ALL
SELECT id, 'playful', 'Playful', 'Fun and whimsical', 'system', 5 FROM category_definitions WHERE category_key = 'mood'
UNION ALL
SELECT id, 'elegant', 'Elegant', 'Refined and sophisticated', 'system', 6 FROM category_definitions WHERE category_key = 'mood'
UNION ALL
SELECT id, 'mysterious', 'Mysterious', 'Enigmatic and intriguing', 'system', 7 FROM category_definitions WHERE category_key = 'mood';

-- Insert Subject Tags
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, tag_type, sort_order)
SELECT id, 'landscape', 'Landscape', 'Outdoor scenes and vistas', 'system', 1 FROM category_definitions WHERE category_key = 'subject'
UNION ALL
SELECT id, 'portrait', 'Portrait', 'Human figures and faces', 'system', 2 FROM category_definitions WHERE category_key = 'subject'
UNION ALL
SELECT id, 'animals', 'Animals', 'Wildlife and domestic animals', 'system', 3 FROM category_definitions WHERE category_key = 'subject'
UNION ALL
SELECT id, 'still_life', 'Still Life', 'Inanimate objects arranged', 'system', 4 FROM category_definitions WHERE category_key = 'subject'
UNION ALL
SELECT id, 'architecture', 'Architecture', 'Buildings and structures', 'system', 5 FROM category_definitions WHERE category_key = 'subject'
UNION ALL
SELECT id, 'botanical', 'Botanical', 'Plants and flowers in detail', 'system', 6 FROM category_definitions WHERE category_key = 'subject';

-- Insert Use Case Tags
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, tag_type, sort_order)
SELECT id, 'wall_art', 'Wall Art', 'Framed prints, canvas, posters', 'system', 1 FROM category_definitions WHERE category_key = 'use_case'
UNION ALL
SELECT id, 'home_decor', 'Home Decor', 'Pillows, curtains, decorative items', 'system', 2 FROM category_definitions WHERE category_key = 'use_case'
UNION ALL
SELECT id, 'apparel', 'Apparel', 'Clothing and wearables', 'system', 3 FROM category_definitions WHERE category_key = 'use_case'
UNION ALL
SELECT id, 'stationery', 'Stationery', 'Cards, notebooks, calendars', 'system', 4 FROM category_definitions WHERE category_key = 'use_case'
UNION ALL
SELECT id, 'textiles', 'Textiles', 'Fabric and soft goods', 'system', 5 FROM category_definitions WHERE category_key = 'use_case';

-- Insert Season Tags
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, tag_type, sort_order)
SELECT id, 'spring', 'Spring', 'March, April, May - renewal and growth', 'system', 1 FROM category_definitions WHERE category_key = 'season'
UNION ALL
SELECT id, 'summer', 'Summer', 'June, July, August - warmth and vibrancy', 'system', 2 FROM category_definitions WHERE category_key = 'season'
UNION ALL
SELECT id, 'fall', 'Fall', 'September, October, November - harvest and transition', 'system', 3 FROM category_definitions WHERE category_key = 'season'
UNION ALL
SELECT id, 'winter', 'Winter', 'December, January, February - cozy and festive', 'system', 4 FROM category_definitions WHERE category_key = 'season'
UNION ALL
SELECT id, 'year_round', 'Year-Round', 'Suitable for any season', 'system', 5 FROM category_definitions WHERE category_key = 'season';