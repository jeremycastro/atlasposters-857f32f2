-- Seed Poster History Brand Story Component
INSERT INTO public.brand_story_components (
  id,
  brand_id,
  scope,
  component_type,
  title,
  subtitle,
  content,
  status,
  version_number,
  is_current_version,
  order_index,
  tags,
  metadata
) VALUES (
  gen_random_uuid(),
  NULL,
  'atlas_global',
  'story_narrative',
  'The History of Posters',
  'From Medieval Broadsides to Digital Art — A Journey Through Visual Communication',
  E'For over five centuries, posters have shaped public discourse, artistic movements, and commercial culture. This exhibition traces the evolution of the poster from its earliest printed forms to the digital age, celebrating the artists and innovations that transformed simple notices into powerful works of art.\n\nFrom Gutenberg''s indulgences to Instagram feeds, the poster has adapted and evolved while remaining a powerful medium for visual communication. As we look to the future, the traditions established by Chéret, Mucha, and the great poster artists continue to inspire new generations of visual storytellers.\n\n*An exhibition curated by Atlas — Research compiled from museum archives and historical records*',
  'approved',
  1,
  true,
  1,
  ARRAY['poster history', 'art history', 'visual communication', 'exhibition', 'atlas global'],
  '{"source": "The History of Posters as told by Atlas", "type": "exhibition"}'::jsonb
);

-- Seed Timeline Event 1: The Printing Revolution
INSERT INTO public.brand_story_timeline (
  id,
  brand_id,
  scope,
  event_type,
  title,
  content,
  event_date,
  is_published,
  is_archived,
  tags
) VALUES (
  gen_random_uuid(),
  NULL,
  'atlas_global',
  'milestone',
  'The Printing Revolution & Early Broadsides',
  E'## The Dawn of Mass Communication (1450–1800)\n\nBefore the poster existed as we know it, public announcements relied on town criers and hand-written notices. The invention of the printing press by Johannes Gutenberg around 1440 in Mainz, Germany, fundamentally transformed human communication. Gutenberg''s innovation—movable metal type combined with a modified wine press—enabled the mass production of printed materials for the first time in European history.\n\n> **The oldest dated broadside is a letter of indulgence printed by Gutenberg himself in 1454, predating even his famous Bible.**\n\nBroadsides—single sheets printed on one side—became the dominant form of public notice from the 16th through 19th centuries. These ephemeral documents announced everything from royal proclamations to public executions, from theatrical performances to religious reforms. Martin Luther''s 95 Theses were famously circulated as broadsheets, demonstrating the power of printed propaganda.\n\nBy the 1660s, over **400,000 broadsides were being sold annually in England alone**. Despite their ubiquity, most were printed quickly and cheaply, with little artistic consideration—a sharp contrast to the visually sophisticated posters that would emerge two centuries later.\n\n### Key Innovations\n- Movable Type\n- Woodblock Illustration\n- Mass Production\n- Broadside Ballads',
  '1450-01-01',
  true,
  false,
  ARRAY['printing revolution', 'gutenberg', 'broadsides', '15th century', 'mass communication']
);

-- Seed Timeline Event 2: Birth of the Modern Poster
INSERT INTO public.brand_story_timeline (
  id,
  brand_id,
  scope,
  event_type,
  title,
  content,
  event_date,
  is_published,
  is_archived,
  tags
) VALUES (
  gen_random_uuid(),
  NULL,
  'atlas_global',
  'milestone',
  'The Birth of the Modern Poster',
  E'## Jules Chéret: Father of the Modern Poster (1866–1890)\n\nThe transformation of the poster from simple notice to vibrant art form began in Paris in 1866, when Jules Chéret opened his own lithographic printing firm after years of study in London. Chéret revolutionized lithography—a process invented in 1798—by developing his "three-stone lithographic process," which allowed artists to achieve the full spectrum of color using just red, yellow, and blue stones printed in careful registration.\n\n> **Chéret created over 1,000 posters during his 30-year career, earning him the Legion of Honour in 1890 for "creating an art form that advances commerce and industry."**\n\nUnlike earlier lithographers who copied artists'' designs onto stone, Chéret worked directly on the stone itself, using spirited brush lines, crosshatch, and soft watercolor-like washes. His signature style featured vibrant, joyful women—nicknamed "Chérettes"—promoting everything from cabarets like the Moulin Rouge to perfumes and beverages.\n\nIn 1884, Chéret organized the first group poster exhibition in art history, and in 1895 created "Les Maîtres de l''Affiche," a monthly publication featuring the finest poster designs of the era. His work laid the foundation for the golden age of poster art that would follow.\n\n### Key Figures\n- Jules Chéret\n- Eugène Rimmel\n- Pierre Bonnard',
  '1866-01-01',
  true,
  false,
  ARRAY['jules chéret', 'lithography', 'belle époque', 'paris', '19th century']
);

-- Seed Timeline Event 3: Art Nouveau
INSERT INTO public.brand_story_timeline (
  id,
  brand_id,
  scope,
  event_type,
  title,
  content,
  event_date,
  is_published,
  is_archived,
  tags
) VALUES (
  gen_random_uuid(),
  NULL,
  'atlas_global',
  'milestone',
  'Art Nouveau & the Golden Age',
  E'## Toulouse-Lautrec & Mucha: Masters of the Poster (1890–1910)\n\nThe 1890s witnessed poster art reach unprecedented heights of artistic achievement. In 1891, Henri de Toulouse-Lautrec created his first poster—"Moulin Rouge: La Goulue"—a six-foot-tall advertisement that made him famous overnight. About 3,000 copies spread throughout Paris, captivating the public with bold colors and innovative, Japanese-inspired silhouettes.\n\n> **Toulouse-Lautrec''s innovative use of flat color areas and strong outlines, influenced by Japanese woodblock prints, fundamentally changed poster aesthetics.**\n\nIn December 1894, a young Czech artist named Alphonse Mucha received a last-minute commission to design a poster for the legendary actress Sarah Bernhardt''s play "Gismonda." The result—a life-sized, nearly two-meter tall poster depicting Bernhardt in Byzantine costume—caused a sensation. Mucha''s distinctive style became so synonymous with the era that it was called "le style Mucha" in Paris.\n\nMucha''s work featured beautiful women with flowing hair and ornate attire surrounded by decorative botanical motifs in muted pastels. His belief that art should be "for the people" led him to create decorative panels—posters without text—that could adorn ordinary homes, democratizing fine art.\n\n### Key Figures\n- Henri de Toulouse-Lautrec\n- Alphonse Mucha\n- Sarah Bernhardt\n- Théophile Steinlen',
  '1891-01-01',
  true,
  false,
  ARRAY['art nouveau', 'toulouse-lautrec', 'alphonse mucha', 'golden age', 'moulin rouge']
);

-- Seed Timeline Event 4: WWI Propaganda
INSERT INTO public.brand_story_timeline (
  id,
  brand_id,
  scope,
  event_type,
  title,
  content,
  event_date,
  is_published,
  is_archived,
  tags
) VALUES (
  gen_random_uuid(),
  NULL,
  'atlas_global',
  'milestone',
  'World War I: The Poster as Weapon',
  E'## Propaganda and the Power of Visual Persuasion (1914–1918)\n\nWorld War I transformed the poster into a weapon of war. Every combatant nation launched unprecedented advertising campaigns to raise money, recruit soldiers, boost volunteer efforts, and spur production. America alone produced approximately **2,500 striking poster designs and nearly 20 million individual posters**—about one for every four citizens—in just over two years.\n\n> **James Montgomery Flagg''s "I Want YOU" poster was printed over four million times during WWI. Flagg modeled Uncle Sam on his own face, adding only a goatee and white hair.**\n\nIn 1917, artist James Montgomery Flagg created what would become one of the most enduring images of American propaganda. Inspired by a 1914 British poster featuring Lord Kitchener, Flagg''s Uncle Sam points directly at the viewer with piercing eyes, demanding enlistment. The Committee for Public Information commissioned the work, which has been reprinted countless times and remains instantly recognizable over a century later.\n\nThe lessons of brilliant WWI poster propaganda were not lost on future generations. The Bolsheviks in Russia, fascists in Italy, and Nazis in Germany all recognized the poster''s power to shape public opinion, making it a weapon of choice in both hot and cold wars throughout the 20th century.\n\n### Key Figures\n- James Montgomery Flagg\n- Alfred Leete\n- Howard Chandler Christy',
  '1917-01-01',
  true,
  false,
  ARRAY['world war i', 'propaganda', 'i want you', 'uncle sam', 'recruitment']
);

-- Seed Timeline Event 5: WWII Home Front
INSERT INTO public.brand_story_timeline (
  id,
  brand_id,
  scope,
  event_type,
  title,
  content,
  event_date,
  is_published,
  is_archived,
  tags
) VALUES (
  gen_random_uuid(),
  NULL,
  'atlas_global',
  'milestone',
  'World War II: The Home Front',
  E'## Rosie the Riveter and Wartime Morale (1939–1945)\n\nWorld War II brought a new emphasis on home front propaganda. As millions of men left for combat, women were recruited to fill their places in factories. In 1942, the Westinghouse Electric Corporation hired Pittsburgh artist J. Howard Miller to create a series of posters to boost worker morale and reduce the chance of strikes.\n\n> **The "We Can Do It!" poster was displayed for only about two weeks in Westinghouse factories in 1943. It was rediscovered in the 1980s and became a symbol of women''s empowerment.**\n\nMiller''s most famous creation—a woman in a red bandana flexing her arm with the caption "We Can Do It!"—is now often mistakenly called "Rosie the Riveter." The actual Rosie was popularized by a 1943 song and a Norman Rockwell painting that appeared on the cover of The Saturday Evening Post. Miller''s poster, virtually unknown during the war, was rediscovered in the 1980s and has since become one of the ten most-requested images at the National Archives.\n\nFrom 1940 to 1945, **women in the American workforce increased from 27% to 37%**, with 19 million women working on the home front and 350,000 serving in the military. The posters of this era both reflected and shaped this remarkable social transformation.\n\n### Key Figures\n- J. Howard Miller\n- Norman Rockwell\n- N.C. Wyeth',
  '1943-01-01',
  true,
  false,
  ARRAY['world war ii', 'rosie the riveter', 'we can do it', 'home front', 'women empowerment']
);

-- Seed Timeline Event 6: Psychedelic Revolution
INSERT INTO public.brand_story_timeline (
  id,
  brand_id,
  scope,
  event_type,
  title,
  content,
  event_date,
  is_published,
  is_archived,
  tags
) VALUES (
  gen_random_uuid(),
  NULL,
  'atlas_global',
  'milestone',
  'The Psychedelic Revolution',
  E'## San Francisco and the Summer of Love (1965–1971)\n\nIn 1965, a young artist named Wes Wilson began creating posters for rock concerts at San Francisco''s Fillmore Auditorium and Avalon Ballroom. Drawing inspiration from Art Nouveau, the Vienna Secession, and his own experiences with LSD at Ken Kesey''s "Acid Tests," Wilson invented what would become known as psychedelic poster art.\n\n> **"I had been told that lettering should always be legible, so I turned that around to say: Lettering should be as illegible as possible." — Victor Moscoso**\n\nWilson''s distinctive style—bubbled, flowing letterforms in vibrating colors that made text nearly illegible—was a deliberate rejection of conventional graphic design. His posters for bands like Jefferson Airplane, the Grateful Dead, and The Doors became collectible art almost immediately, with fans stealing them from telephone poles.\n\nA group of artists known as "**The Big Five**"—Wilson, Victor Moscoso, Rick Griffin, Stanley "Mouse" Miller, and Alton Kelley—defined the visual language of the 1960s counterculture. Moscoso, trained at Yale under color theorist Josef Albers, deliberately used vibrating color combinations that made his posters appear to move. By 1968, the style had spread from street corners to museums and department stores worldwide.\n\n### The Big Five\n- Wes Wilson\n- Victor Moscoso\n- Rick Griffin\n- Stanley Mouse\n- Alton Kelley',
  '1966-01-01',
  true,
  false,
  ARRAY['psychedelic', 'summer of love', 'fillmore', 'the big five', 'counterculture', 'rock posters']
);

-- Seed Timeline Event 7: Digital Age
INSERT INTO public.brand_story_timeline (
  id,
  brand_id,
  scope,
  event_type,
  title,
  content,
  event_date,
  is_published,
  is_archived,
  tags
) VALUES (
  gen_random_uuid(),
  NULL,
  'atlas_global',
  'milestone',
  'The Digital Age & Beyond',
  E'## Post-Modernism to Digital Revolution (1980–Present)\n\nIn the 1960s, reactions to the rigid canon of Swiss modernist design began emerging. A young teacher in Basel named Wolfgang Weingart led the "palace revolt," experimenting with offset printing to produce posters that appeared complex, chaotic, playful, and spontaneous. His liberation of typography laid the foundation for Post-Modern design and the digital experimentation that followed.\n\n> **The rise of digital printing and social media has democratized poster creation, making it easier than ever for individuals to produce and distribute visual messages.**\n\nComputer graphics revolutionized poster design in the 1990s and 2000s, allowing for complex, multi-layered designs that could be easily modified. Digital printing enabled shorter runs, faster turnaround, and greater customization. The poster—once the dominant form of mass communication—found itself competing with television, websites, and social media.\n\nYet the poster endures. Contemporary artists use the medium to address social and political issues from climate change to racial justice. Concert posters for bands like Wilco and the Black Keys draw on psychedelic traditions. Movie posters remain essential marketing tools. And the styles of Chéret, Mucha, and Toulouse-Lautrec continue to inspire designers more than a century after their creation.\n\n### Key Movements\n- Post-Modernism\n- Digital Design\n- Street Art\n- Social Media',
  '1980-01-01',
  true,
  false,
  ARRAY['digital age', 'post-modernism', 'computer graphics', 'social media', 'contemporary']
);