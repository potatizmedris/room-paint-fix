export interface NCSColor {
  code: string;
  name: string;
  hex: string;
  category: string;
}

// Comprehensive NCS Color Database
// Categories: Whites & Neutrals, Yellows, Oranges, Reds, Pinks, Purples, Blues, Greens, Browns, Grays
export const NCS_COLORS: NCSColor[] = [
  // Whites & Off-Whites
  { code: "S 0500-N", name: "Pure White", hex: "#FFFFFF", category: "Whites & Neutrals" },
  { code: "S 0502-Y", name: "Warm White", hex: "#FEFDF5", category: "Whites & Neutrals" },
  { code: "S 0502-B", name: "Cool White", hex: "#F5FAFD", category: "Whites & Neutrals" },
  { code: "S 0804-Y30R", name: "Antique White", hex: "#FAF5E8", category: "Whites & Neutrals" },
  { code: "S 1002-Y", name: "Ivory", hex: "#F5F3E7", category: "Whites & Neutrals" },
  { code: "S 1005-Y20R", name: "Cream", hex: "#F2EDE0", category: "Whites & Neutrals" },
  { code: "S 1502-Y", name: "Linen", hex: "#E8E4D8", category: "Whites & Neutrals" },
  { code: "S 0510-R90B", name: "Ice Blue", hex: "#F0F5FA", category: "Whites & Neutrals" },
  
  // Yellows
  { code: "S 0510-Y", name: "Pale Yellow", hex: "#FDF8DC", category: "Yellows" },
  { code: "S 0520-Y", name: "Light Butter", hex: "#FCF4C4", category: "Yellows" },
  { code: "S 0530-Y", name: "Butter Yellow", hex: "#FAEFA8", category: "Yellows" },
  { code: "S 1020-Y", name: "Soft Yellow", hex: "#F5E8A0", category: "Yellows" },
  { code: "S 1030-Y", name: "Sunshine", hex: "#F0DC78", category: "Yellows" },
  { code: "S 1040-Y", name: "Golden Yellow", hex: "#E8CF50", category: "Yellows" },
  { code: "S 1050-Y", name: "Bright Yellow", hex: "#E0C430", category: "Yellows" },
  { code: "S 2030-Y", name: "Mustard Light", hex: "#D4C460", category: "Yellows" },
  { code: "S 2040-Y", name: "Saffron", hex: "#CBAE40", category: "Yellows" },
  { code: "S 3040-Y", name: "Ochre", hex: "#B89830", category: "Yellows" },
  { code: "S 0520-Y10R", name: "Champagne", hex: "#FCF0B8", category: "Yellows" },
  { code: "S 1030-Y10R", name: "Honey", hex: "#F0D070", category: "Yellows" },
  
  // Oranges
  { code: "S 0520-Y30R", name: "Apricot Light", hex: "#FCE8B0", category: "Oranges" },
  { code: "S 0530-Y40R", name: "Peach", hex: "#FADCA0", category: "Oranges" },
  { code: "S 1030-Y40R", name: "Cantaloupe", hex: "#F0C080", category: "Oranges" },
  { code: "S 1040-Y50R", name: "Tangerine", hex: "#E8A860", category: "Oranges" },
  { code: "S 1050-Y60R", name: "Orange", hex: "#E09048", category: "Oranges" },
  { code: "S 2040-Y50R", name: "Pumpkin", hex: "#D0904C", category: "Oranges" },
  { code: "S 2050-Y60R", name: "Burnt Orange", hex: "#C87840", category: "Oranges" },
  { code: "S 3040-Y60R", name: "Rust", hex: "#B87038", category: "Oranges" },
  { code: "S 1030-Y50R", name: "Coral Light", hex: "#F0B880", category: "Oranges" },
  { code: "S 0540-Y50R", name: "Melon", hex: "#F8C890", category: "Oranges" },
  
  // Reds
  { code: "S 0520-Y80R", name: "Blush", hex: "#FAD8C0", category: "Reds" },
  { code: "S 0530-Y90R", name: "Salmon", hex: "#F8C8B0", category: "Reds" },
  { code: "S 1040-Y90R", name: "Coral", hex: "#E8A088", category: "Reds" },
  { code: "S 1050-Y90R", name: "Tomato", hex: "#E08868", category: "Reds" },
  { code: "S 2050-Y90R", name: "Terra Cotta", hex: "#C87058", category: "Reds" },
  { code: "S 1050-R", name: "Poppy Red", hex: "#D86060", category: "Reds" },
  { code: "S 2050-R", name: "Cherry", hex: "#B85050", category: "Reds" },
  { code: "S 3050-R", name: "Burgundy", hex: "#984040", category: "Reds" },
  { code: "S 2040-R", name: "Rose Red", hex: "#C06060", category: "Reds" },
  { code: "S 1040-R", name: "Watermelon", hex: "#D87878", category: "Reds" },
  
  // Pinks
  { code: "S 0520-R", name: "Pale Pink", hex: "#FAD8D8", category: "Pinks" },
  { code: "S 0530-R", name: "Baby Pink", hex: "#F8C8C8", category: "Pinks" },
  { code: "S 1020-R", name: "Rose Blush", hex: "#F0C0C0", category: "Pinks" },
  { code: "S 1030-R", name: "Candy Pink", hex: "#E8A8A8", category: "Pinks" },
  { code: "S 0520-R10B", name: "Shell Pink", hex: "#FAD0D8", category: "Pinks" },
  { code: "S 1030-R10B", name: "Flamingo", hex: "#E8A0B0", category: "Pinks" },
  { code: "S 1040-R20B", name: "Hot Pink", hex: "#D890A8", category: "Pinks" },
  { code: "S 2030-R20B", name: "Mauve", hex: "#C08898", category: "Pinks" },
  { code: "S 0530-R20B", name: "Cotton Candy", hex: "#F8C0D0", category: "Pinks" },
  { code: "S 1020-R10B", name: "Dusty Rose", hex: "#E8B8C0", category: "Pinks" },
  
  // Purples
  { code: "S 0520-R50B", name: "Lavender Mist", hex: "#E8D8F0", category: "Purples" },
  { code: "S 1020-R50B", name: "Lavender", hex: "#D8C8E8", category: "Purples" },
  { code: "S 1030-R50B", name: "Lilac", hex: "#C8B0D8", category: "Purples" },
  { code: "S 2030-R50B", name: "Wisteria", hex: "#A890C0", category: "Purples" },
  { code: "S 2040-R50B", name: "Purple", hex: "#9878B0", category: "Purples" },
  { code: "S 3040-R50B", name: "Grape", hex: "#786098", category: "Purples" },
  { code: "S 1030-R60B", name: "Periwinkle", hex: "#B8A8D8", category: "Purples" },
  { code: "S 2030-R60B", name: "Violet", hex: "#9888C0", category: "Purples" },
  { code: "S 3050-R50B", name: "Plum", hex: "#684878", category: "Purples" },
  { code: "S 0530-R50B", name: "Light Orchid", hex: "#E0C8E8", category: "Purples" },
  
  // Blues
  { code: "S 0520-R80B", name: "Ice Blue Light", hex: "#D8E8F8", category: "Blues" },
  { code: "S 0530-R90B", name: "Baby Blue", hex: "#C8E0F8", category: "Blues" },
  { code: "S 1020-R90B", name: "Powder Blue", hex: "#C0D8F0", category: "Blues" },
  { code: "S 1030-R90B", name: "Sky Blue", hex: "#A8C8E8", category: "Blues" },
  { code: "S 1040-R90B", name: "Cornflower", hex: "#90B8E0", category: "Blues" },
  { code: "S 2040-R90B", name: "Periwinkle Blue", hex: "#78A0D0", category: "Blues" },
  { code: "S 2050-R90B", name: "Royal Blue", hex: "#6088C0", category: "Blues" },
  { code: "S 3050-R90B", name: "Cobalt", hex: "#4870A8", category: "Blues" },
  { code: "S 4050-R90B", name: "Navy", hex: "#305890", category: "Blues" },
  { code: "S 1030-B", name: "Aqua Blue", hex: "#98C8D8", category: "Blues" },
  { code: "S 2030-B", name: "Ocean Blue", hex: "#78B0C8", category: "Blues" },
  { code: "S 3040-B", name: "Teal Blue", hex: "#5890A8", category: "Blues" },
  { code: "S 1020-B10G", name: "Robin Egg", hex: "#B0D8E0", category: "Blues" },
  { code: "S 2030-B10G", name: "Turquoise Light", hex: "#80C0D0", category: "Blues" },
  
  // Greens
  { code: "S 0520-B50G", name: "Mint Light", hex: "#D8F0E8", category: "Greens" },
  { code: "S 0530-B50G", name: "Seafoam", hex: "#C0E8DC", category: "Greens" },
  { code: "S 1020-B50G", name: "Pale Mint", hex: "#B8E0D4", category: "Greens" },
  { code: "S 1030-B50G", name: "Mint", hex: "#98D4C4", category: "Greens" },
  { code: "S 2030-B50G", name: "Turquoise", hex: "#70C0B0", category: "Greens" },
  { code: "S 3040-B50G", name: "Teal", hex: "#48A090", category: "Greens" },
  { code: "S 1030-G", name: "Spring Green", hex: "#98D8A8", category: "Greens" },
  { code: "S 2030-G", name: "Grass Green", hex: "#70C080", category: "Greens" },
  { code: "S 2040-G", name: "Kelly Green", hex: "#58B068", category: "Greens" },
  { code: "S 3040-G", name: "Forest Green", hex: "#409050", category: "Greens" },
  { code: "S 4040-G", name: "Hunter Green", hex: "#307040", category: "Greens" },
  { code: "S 1030-G10Y", name: "Lime Light", hex: "#A8D898", category: "Greens" },
  { code: "S 2030-G10Y", name: "Apple Green", hex: "#80C070", category: "Greens" },
  { code: "S 1020-G30Y", name: "Pistachio", hex: "#C0D8A0", category: "Greens" },
  { code: "S 2030-G30Y", name: "Olive Light", hex: "#98C070", category: "Greens" },
  { code: "S 3040-G30Y", name: "Sage", hex: "#789858", category: "Greens" },
  { code: "S 4040-G30Y", name: "Olive", hex: "#607848", category: "Greens" },
  { code: "S 5040-G30Y", name: "Moss", hex: "#486038", category: "Greens" },
  
  // Browns
  { code: "S 2020-Y30R", name: "Sand", hex: "#D4C4A0", category: "Browns" },
  { code: "S 3020-Y30R", name: "Tan", hex: "#C0A880", category: "Browns" },
  { code: "S 4020-Y30R", name: "Camel", hex: "#A89068", category: "Browns" },
  { code: "S 5020-Y30R", name: "Khaki", hex: "#907850", category: "Browns" },
  { code: "S 3030-Y40R", name: "Caramel", hex: "#B89060", category: "Browns" },
  { code: "S 4030-Y40R", name: "Toffee", hex: "#987848", category: "Browns" },
  { code: "S 5030-Y40R", name: "Bronze", hex: "#806038", category: "Browns" },
  { code: "S 4040-Y50R", name: "Sienna", hex: "#906040", category: "Browns" },
  { code: "S 5040-Y50R", name: "Chocolate", hex: "#704830", category: "Browns" },
  { code: "S 6030-Y50R", name: "Espresso", hex: "#604028", category: "Browns" },
  { code: "S 2010-Y30R", name: "Beige", hex: "#DCD0B8", category: "Browns" },
  { code: "S 3010-Y30R", name: "Greige", hex: "#C4B8A0", category: "Browns" },
  
  // Grays
  { code: "S 1500-N", name: "Silver", hex: "#D8D8D8", category: "Grays" },
  { code: "S 2000-N", name: "Light Gray", hex: "#C8C8C8", category: "Grays" },
  { code: "S 2500-N", name: "Warm Gray", hex: "#B8B8B8", category: "Grays" },
  { code: "S 3000-N", name: "Medium Gray", hex: "#A8A8A8", category: "Grays" },
  { code: "S 4000-N", name: "Gray", hex: "#909090", category: "Grays" },
  { code: "S 5000-N", name: "Dark Gray", hex: "#787878", category: "Grays" },
  { code: "S 6000-N", name: "Charcoal", hex: "#606060", category: "Grays" },
  { code: "S 7000-N", name: "Slate", hex: "#484848", category: "Grays" },
  { code: "S 8000-N", name: "Graphite", hex: "#303030", category: "Grays" },
  { code: "S 2002-Y", name: "Warm Silver", hex: "#D0D0C8", category: "Grays" },
  { code: "S 3005-Y20R", name: "Taupe", hex: "#B0A898", category: "Grays" },
  { code: "S 4005-Y20R", name: "Stone", hex: "#989080", category: "Grays" },
  { code: "S 2002-B", name: "Cool Silver", hex: "#C8D0D4", category: "Grays" },
  { code: "S 3005-B20G", name: "Steel Gray", hex: "#98A8A8", category: "Grays" },
  { code: "S 5005-B20G", name: "Pewter", hex: "#687878", category: "Grays" },
];

export const NCS_CATEGORIES = [
  "Whites & Neutrals",
  "Yellows",
  "Oranges",
  "Reds",
  "Pinks",
  "Purples",
  "Blues",
  "Greens",
  "Browns",
  "Grays",
] as const;

export type NCSCategory = typeof NCS_CATEGORIES[number];
