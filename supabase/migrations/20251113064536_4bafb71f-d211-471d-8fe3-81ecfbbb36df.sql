-- Room Type (15 tags)
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, sort_order, tag_type)
SELECT id, 'living_room', 'Living Room', 'Main gathering space', 10, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'bedroom', 'Bedroom', 'Sleeping quarters', 20, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'dining_room', 'Dining Room', 'Eating area', 30, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'kitchen', 'Kitchen', 'Cooking and food prep', 40, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'bathroom', 'Bathroom', 'Personal care space', 50, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'office', 'Office', 'Work and study space', 60, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'nursery', 'Nursery', 'Baby and children room', 70, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'kids_room', 'Kids Room', 'Children bedroom', 80, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'entryway', 'Entryway', 'Entrance and foyer', 90, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'hallway', 'Hallway', 'Corridor and passage', 100, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'library', 'Library', 'Reading and book space', 110, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'studio', 'Studio', 'Creative workspace', 120, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'gym', 'Gym', 'Exercise and fitness room', 130, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'laundry', 'Laundry', 'Utility room', 140, 'system' FROM category_definitions WHERE category_key = 'room_type'
UNION ALL SELECT id, 'outdoor', 'Outdoor', 'Patio, porch, garden', 150, 'system' FROM category_definitions WHERE category_key = 'room_type';

-- Commercial Use (18 tags)
INSERT INTO tag_definitions (category_id, tag_key, display_name, description, sort_order, tag_type)
SELECT id, 'hospitality', 'Hospitality', 'Hotels, resorts, lodging', 10, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'restaurant', 'Restaurant', 'Dining establishments', 20, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'cafe', 'Cafe', 'Coffee shops and cafes', 30, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'retail', 'Retail', 'Stores and shops', 40, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'office_space', 'Office Space', 'Corporate environments', 50, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'healthcare', 'Healthcare', 'Medical facilities', 60, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'spa', 'Spa', 'Wellness and spa facilities', 70, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'salon', 'Salon', 'Beauty and hair salons', 80, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'education', 'Education', 'Schools and learning spaces', 90, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'coworking', 'Coworking', 'Shared workspace', 100, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'gallery', 'Gallery', 'Art gallery spaces', 110, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'museum', 'Museum', 'Museum and cultural spaces', 120, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'library_commercial', 'Library', 'Public library spaces', 130, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'fitness', 'Fitness', 'Gym and fitness centers', 140, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'hospitality_event', 'Event Space', 'Venues and event halls', 150, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'lobby', 'Lobby', 'Building entrance areas', 160, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'waiting_room', 'Waiting Room', 'Reception and waiting areas', 170, 'system' FROM category_definitions WHERE category_key = 'commercial_use'
UNION ALL SELECT id, 'corporate_gift', 'Corporate Gift', 'Business gifting', 180, 'system' FROM category_definitions WHERE category_key = 'commercial_use';