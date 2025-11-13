-- Delete old taxonomy completely and create new comprehensive categories
DELETE FROM entity_tags WHERE tag_id IN (SELECT id FROM tag_definitions);
DELETE FROM tag_definitions;
DELETE FROM category_definitions;

-- CORE ARTWORK CATEGORIES (5)
INSERT INTO category_definitions (category_key, display_name, description, scope, icon, color, sort_order, allows_custom_tags, is_hierarchical) VALUES
('artistic_style', 'Artistic Style', 'Visual art movement or aesthetic approach', ARRAY['artwork', 'brand'], 'Palette', '#8B5CF6', 10, true, false),
('subject_matter', 'Subject Matter', 'Primary content or focus of the artwork', ARRAY['artwork'], 'Image', '#EC4899', 20, true, true),
('color_palette', 'Color Palette', 'Dominant color schemes and combinations', ARRAY['artwork', 'brand', 'product'], 'Paintbrush', '#F59E0B', 30, false, false),
('mood_emotion', 'Mood & Emotion', 'Emotional tone and atmosphere', ARRAY['artwork', 'brand'], 'Heart', '#EF4444', 40, true, false),
('art_medium', 'Art Medium', 'Artistic technique or material used', ARRAY['artwork'], 'Brush', '#10B981', 50, true, false);

-- COMMERCIAL APPLICATION CATEGORIES (6)
INSERT INTO category_definitions (category_key, display_name, description, scope, icon, color, sort_order, allows_custom_tags, is_hierarchical) VALUES
('room_type', 'Room Type', 'Ideal room or space for display', ARRAY['product'], 'Home', '#3B82F6', 110, false, true),
('commercial_use', 'Commercial Use', 'Business or commercial application', ARRAY['product', 'brand'], 'Building', '#6366F1', 120, true, false),
('product_compatibility', 'Product Type', 'Compatible product categories', ARRAY['artwork', 'product'], 'Package', '#8B5CF6', 130, false, false),
('size_category', 'Size Category', 'Physical size classification', ARRAY['product', 'product_variant'], 'Maximize', '#14B8A6', 140, false, false),
('orientation', 'Orientation', 'Physical orientation of artwork', ARRAY['artwork', 'product'], 'Layout', '#06B6D4', 150, false, false),
('target_market', 'Target Market', 'Intended market segment', ARRAY['brand', 'product'], 'Target', '#0EA5E9', 160, false, false);

-- BRAND & LICENSING CATEGORIES (5)
INSERT INTO category_definitions (category_key, display_name, description, scope, icon, color, sort_order, allows_custom_tags, is_hierarchical) VALUES
('brand_personality', 'Brand Personality', 'Brand character and voice', ARRAY['brand'], 'Sparkles', '#A855F7', 210, true, false),
('target_demographic', 'Target Demographic', 'Audience age and lifestyle', ARRAY['brand', 'product'], 'Users', '#EC4899', 220, false, false),
('brand_values', 'Brand Values', 'Core principles and beliefs', ARRAY['brand'], 'Award', '#F59E0B', 230, true, false),
('industry_focus', 'Industry Focus', 'Primary business sector', ARRAY['brand', 'product'], 'Briefcase', '#EF4444', 240, false, false),
('geographic_style', 'Geographic Style', 'Regional aesthetic influence', ARRAY['artwork', 'brand'], 'Globe', '#10B981', 250, false, false);

-- SEASONAL & OCCASION CATEGORIES (3)
INSERT INTO category_definitions (category_key, display_name, description, scope, icon, color, sort_order, allows_custom_tags, is_hierarchical) VALUES
('season', 'Season', 'Seasonal relevance and timing', ARRAY['artwork', 'product'], 'Sun', '#F59E0B', 310, false, false),
('holiday', 'Holiday', 'Holiday or celebration theme', ARRAY['artwork', 'product'], 'Gift', '#EF4444', 320, false, false),
('occasion', 'Occasion', 'Life events and special occasions', ARRAY['product'], 'Calendar', '#EC4899', 330, false, false);

-- TECHNICAL & PRODUCTION CATEGORIES (4)
INSERT INTO category_definitions (category_key, display_name, description, scope, icon, color, sort_order, allows_custom_tags, is_hierarchical) VALUES
('print_quality', 'Print Quality', 'Print resolution and specifications', ARRAY['product', 'product_variant'], 'FileCheck', '#3B82F6', 410, false, false),
('material', 'Material', 'Physical material or substrate', ARRAY['product', 'product_variant'], 'Layers', '#6366F1', 420, true, false),
('finish', 'Finish', 'Surface finish or texture', ARRAY['product', 'product_variant'], 'Sparkle', '#8B5CF6', 430, false, false),
('frame_style', 'Frame Style', 'Frame or mounting options', ARRAY['product_variant'], 'Frame', '#A855F7', 440, false, false);