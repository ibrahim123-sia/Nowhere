// Sample catalogue used by seeder.js (fresh databases) and
// scripts/enhanceProducts.js (upgrading an existing catalogue in place).
// Prices are in PKR. Photos are from Unsplash (free to use under the Unsplash License).

const products = [
  {
    "name": "Classic Oxford Button-Down Shirt",
    "description": "This classic Oxford shirt is tailored for a polished yet casual look. Crafted from high-quality cotton, it features a button-down collar and a comfortable, slightly relaxed fit. Perfect for both formal and casual occasions, it comes with long sleeves, a button placket, and a yoke at the back. The shirt is finished with a gently rounded hem and adjustable button cuffs.",
    "price": 3999,
    "discountPrice": 3499,
    "countInStock": 24,
    "sku": "OX-SH-001",
    "category": "Top Wear",
    "brand": "Urban Threads",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue",
      "White",
      "Navy"
    ],
    "collections": "Smart Casual",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Regular Fit",
    "season": "All Season",
    "occasion": [
      "Office",
      "Smart Casual"
    ],
    "highlights": [
      "Breathable Oxford-weave cotton",
      "Button-down collar keeps its shape",
      "Adjustable button cuffs and back yoke"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "cotton",
      "regular fit",
      "office",
      "smart casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=900&q=80",
        "altText": "Classic Oxford Button-Down Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1602810316693-3667c854239a?auto=format&fit=crop&w=900&q=80",
        "altText": "Classic Oxford Button-Down Shirt - styled view"
      }
    ],
    "isFeatured": true,
    "isPublished": true
  },
  {
    "name": "Slim-Fit Stretch Shirt",
    "description": "A versatile slim-fit shirt perfect for business or evening events. Designed with a fitted silhouette, the added stretch provides maximum comfort throughout the day. Features a crisp turn-down collar, button placket, and adjustable cuffs.",
    "price": 2999,
    "discountPrice": 2499,
    "countInStock": 18,
    "sku": "SLIM-SH-002",
    "category": "Top Wear",
    "brand": "Modern Fit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "Navy Blue",
      "Burgundy"
    ],
    "collections": "Workwear",
    "material": "Cotton Blend",
    "gender": "Men",
    "fit": "Slim Fit",
    "season": "All Season",
    "occasion": [
      "Office",
      "Evening"
    ],
    "highlights": [
      "2% elastane for all-day stretch",
      "Tailored slim silhouette",
      "Crisp turn-down collar"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not bleach",
      "Hang to dry",
      "Cool iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "cotton blend",
      "slim fit",
      "office",
      "evening"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1714228860111-0028d0060b95?auto=format&fit=crop&w=900&q=80",
        "altText": "Slim-Fit Stretch Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=900&q=80",
        "altText": "Slim-Fit Stretch Shirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Casual Denim Shirt",
    "description": "This casual denim shirt is made from lightweight cotton denim. It features a regular fit, snap buttons, and a straight hem. With Western-inspired details, this shirt is perfect for layering or wearing solo.",
    "price": 4999,
    "countInStock": 12,
    "sku": "CAS-DEN-003",
    "category": "Top Wear",
    "brand": "Street Style",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue",
      "Dark Wash"
    ],
    "collections": "Essentials",
    "material": "Denim",
    "gender": "Men",
    "fit": "Regular Fit",
    "season": "All Season",
    "occasion": [
      "Casual",
      "Weekend"
    ],
    "highlights": [
      "Lightweight 6oz cotton denim",
      "Western-inspired snap buttons",
      "Softens with every wash"
    ],
    "careInstructions": [
      "Wash inside out in cold water",
      "Wash dark denim separately",
      "Hang to dry to keep the shape",
      "Do not tumble dry"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "denim",
      "regular fit",
      "casual",
      "weekend"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1761426857312-7931f596e6f3?auto=format&fit=crop&w=900&q=80",
        "altText": "Casual Denim Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1740711152088-88a009e877bb?auto=format&fit=crop&w=900&q=80",
        "altText": "Casual Denim Shirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Printed Resort Shirt",
    "description": "Designed for summer, this printed resort shirt is perfect for vacation or weekend getaways. It features a relaxed fit, short sleeves, and a camp collar. The all-over tropical print adds a playful vibe.",
    "price": 2999,
    "discountPrice": 2299,
    "countInStock": 30,
    "sku": "PRNT-RES-004",
    "category": "Top Wear",
    "brand": "Beach Breeze",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Tropical Print",
      "Navy Palms"
    ],
    "collections": "Summer",
    "material": "Viscose",
    "gender": "Men",
    "fit": "Relaxed Fit",
    "season": "Summer",
    "occasion": [
      "Vacation",
      "Beach"
    ],
    "highlights": [
      "Fluid viscose that drapes and breathes",
      "Camp collar with short sleeves",
      "All-over tropical print"
    ],
    "careInstructions": [
      "Hand wash cold or delicate cycle",
      "Do not wring",
      "Dry flat in the shade",
      "Cool iron on reverse"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "viscose",
      "relaxed fit",
      "vacation",
      "beach"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1653839280015-8ea9c7a775d8?auto=format&fit=crop&w=900&q=80",
        "altText": "Printed Resort Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1576582839652-2f952f042952?auto=format&fit=crop&w=900&q=80",
        "altText": "Printed Resort Shirt - styled view"
      }
    ],
    "isFeatured": true,
    "isPublished": true
  },
  {
    "name": "Slim-Fit Easy-Iron Shirt",
    "description": "A slim-fit, easy-iron shirt in woven cotton fabric with a fitted silhouette. Features a turn-down collar, classic button placket, and a yoke at the back. Long sleeves and adjustable button cuffs with a rounded hem.",
    "price": 3499,
    "countInStock": 20,
    "sku": "SLIM-EIR-005",
    "category": "Top Wear",
    "brand": "Urban Chic",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White",
      "Gray"
    ],
    "collections": "Workwear",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Slim Fit",
    "season": "All Season",
    "occasion": [
      "Office",
      "Formal"
    ],
    "highlights": [
      "Easy-iron finish for crease-free mornings",
      "Fitted slim silhouette",
      "Rounded hem works tucked or untucked"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "cotton",
      "slim fit",
      "office",
      "formal"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1603252109612-24fa03d145c8?auto=format&fit=crop&w=900&q=80",
        "altText": "Slim-Fit Easy-Iron Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1612541122840-bf7071c968a2?auto=format&fit=crop&w=900&q=80",
        "altText": "Slim-Fit Easy-Iron Shirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Polo T-Shirt with Ribbed Collar",
    "description": "A wardrobe classic, this polo t-shirt features a ribbed collar and cuffs. Made from 100% cotton, it offers breathability and comfort throughout the day. Tailored in a slim fit with a button placket at the neckline.",
    "price": 2499,
    "discountPrice": 1999,
    "countInStock": 40,
    "sku": "POLO-TSH-006",
    "category": "Top Wear",
    "brand": "Polo Classics",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White",
      "Navy",
      "Red"
    ],
    "collections": "Essentials",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Regular Fit",
    "season": "Summer",
    "occasion": [
      "Casual",
      "Smart Casual"
    ],
    "highlights": [
      "Soft cotton piqué knit",
      "Ribbed collar and cuffs",
      "Two-button placket"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "cotton",
      "regular fit",
      "casual",
      "smart casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1625910513399-c9fcba54338c?auto=format&fit=crop&w=900&q=80",
        "altText": "Polo T-Shirt with Ribbed Collar - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1625910513413-c23b8bb81cba?auto=format&fit=crop&w=900&q=80",
        "altText": "Polo T-Shirt with Ribbed Collar - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Oversized Graphic T-Shirt",
    "description": "An oversized graphic t-shirt that combines comfort with street style. Featuring bold prints across the chest, this relaxed fit tee offers a modern vibe, perfect for pairing with jeans or joggers.",
    "price": 1999,
    "discountPrice": 1599,
    "countInStock": 5,
    "sku": "OVS-GRF-007",
    "category": "Top Wear",
    "brand": "Street Vibes",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "Gray"
    ],
    "collections": "Streetwear",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Oversized Fit",
    "season": "All Season",
    "occasion": [
      "Streetwear",
      "Casual"
    ],
    "highlights": [
      "Heavyweight 220gsm cotton",
      "Dropped shoulders and boxy cut",
      "Bold front graphic print"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "cotton",
      "oversized fit",
      "streetwear",
      "casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1775817104298-522393e1d72b?auto=format&fit=crop&w=900&q=80",
        "altText": "Oversized Graphic T-Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1604508230015-5a54faf1fa56?auto=format&fit=crop&w=900&q=80",
        "altText": "Oversized Graphic T-Shirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Regular-Fit Henley Shirt",
    "description": "A modern take on the classic Henley shirt, this regular-fit style features a buttoned placket and ribbed cuffs. Made from a soft cotton blend with a touch of elastane for stretch.",
    "price": 2299,
    "countInStock": 16,
    "sku": "REG-HEN-008",
    "category": "Top Wear",
    "brand": "Heritage Wear",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Heather Gray",
      "Olive",
      "Black"
    ],
    "collections": "Essentials",
    "material": "Cotton Blend",
    "gender": "Men",
    "fit": "Regular Fit",
    "season": "Autumn Winter",
    "occasion": [
      "Casual",
      "Weekend"
    ],
    "highlights": [
      "Three-button Henley placket",
      "Soft brushed cotton blend",
      "Long sleeves for easy layering"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not bleach",
      "Hang to dry",
      "Cool iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "cotton blend",
      "regular fit",
      "casual",
      "weekend"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1606200580317-a76017f52c7c?auto=format&fit=crop&w=900&q=80",
        "altText": "Regular-Fit Henley Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1671438118257-cefa6c86fd50?auto=format&fit=crop&w=900&q=80",
        "altText": "Regular-Fit Henley Shirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Long-Sleeve Thermal Tee",
    "description": "Stay warm with this long-sleeve thermal tee, made from soft cotton with a waffle-knit texture. Ideal for layering in cooler months, the slim-fit design ensures a snug yet comfortable fit.",
    "price": 2799,
    "countInStock": 22,
    "sku": "LST-THR-009",
    "category": "Top Wear",
    "brand": "Winter Basics",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Charcoal",
      "Dark Green",
      "Navy"
    ],
    "collections": "Autumn Winter",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Regular Fit",
    "season": "Winter",
    "occasion": [
      "Casual",
      "Layering"
    ],
    "highlights": [
      "Waffle-knit thermal texture",
      "Traps warmth without bulk",
      "Ribbed cuffs stay in place"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "cotton",
      "regular fit",
      "casual",
      "layering"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1614495039368-525273956716?auto=format&fit=crop&w=900&q=80",
        "altText": "Long-Sleeve Thermal Tee - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1699282022178-293b6658b45d?auto=format&fit=crop&w=900&q=80",
        "altText": "Long-Sleeve Thermal Tee - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "V-Neck Classic T-Shirt",
    "description": "A classic V-neck t-shirt for everyday wear. This regular-fit tee is made from breathable cotton and features a clean, simple design with a flattering V-neckline. Lightweight fabric and soft texture make it perfect for casual looks.",
    "price": 1499,
    "countInStock": 60,
    "sku": "VNECK-CLS-010",
    "category": "Top Wear",
    "brand": "Everyday Comfort",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White",
      "Black",
      "Navy"
    ],
    "collections": "Essentials",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Regular Fit",
    "season": "All Season",
    "occasion": [
      "Everyday",
      "Layering"
    ],
    "highlights": [
      "100% combed cotton",
      "Clean V-neck that won't stretch out",
      "Pre-shrunk for a lasting fit"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "men",
      "cotton",
      "regular fit",
      "everyday",
      "layering"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1592563057819-085e8851a29a?auto=format&fit=crop&w=900&q=80",
        "altText": "V-Neck Classic T-Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=900&q=80",
        "altText": "V-Neck Classic T-Shirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Slim Fit Joggers",
    "description": "Slim-fit joggers with an elasticated drawstring waist. Features ribbed hems and side pockets. Ideal for casual outings or workouts.",
    "price": 3999,
    "discountPrice": 3499,
    "countInStock": 26,
    "sku": "BW-001",
    "category": "Bottom Wear",
    "brand": "ActiveWear",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "Gray",
      "Navy"
    ],
    "collections": "Essentials",
    "material": "Cotton Blend",
    "gender": "Men",
    "fit": "Slim Fit",
    "season": "All Season",
    "occasion": [
      "Gym",
      "Casual"
    ],
    "highlights": [
      "Elasticated drawstring waist",
      "Ribbed ankle cuffs",
      "Deep side pockets"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not bleach",
      "Hang to dry",
      "Cool iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "cotton blend",
      "slim fit",
      "gym",
      "casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1635439714465-3ed3e6a122e3?auto=format&fit=crop&w=900&q=80",
        "altText": "Slim Fit Joggers - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1584864783592-f1d6d4fcd1d0?auto=format&fit=crop&w=900&q=80",
        "altText": "Slim Fit Joggers - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Cargo Joggers",
    "description": "Relaxed-fit cargo joggers featuring multiple pockets for functionality. Drawstring waist and cuffed hems for a modern look.",
    "price": 4499,
    "countInStock": 14,
    "sku": "BW-002",
    "category": "Bottom Wear",
    "brand": "UrbanStyle",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Olive",
      "Black"
    ],
    "collections": "Streetwear",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Relaxed Fit",
    "season": "All Season",
    "occasion": [
      "Streetwear",
      "Travel"
    ],
    "highlights": [
      "Six-pocket utility design",
      "Tapered leg with cuffed hem",
      "Durable cotton twill"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "cotton",
      "relaxed fit",
      "streetwear",
      "travel"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1758267928031-a87e5a5c6c5b?auto=format&fit=crop&w=900&q=80",
        "altText": "Cargo Joggers - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1756452720912-cdfb8d7f7699?auto=format&fit=crop&w=900&q=80",
        "altText": "Cargo Joggers - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Tapered Sweatpants",
    "description": "Tapered sweatpants designed for comfort. Elastic waistband with adjustable drawstring, perfect for lounging or athletic activities.",
    "price": 3499,
    "countInStock": 3,
    "sku": "BW-003",
    "category": "Bottom Wear",
    "brand": "ChillZone",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gray",
      "Charcoal",
      "Blue"
    ],
    "collections": "Lounge",
    "material": "Fleece",
    "gender": "Men",
    "fit": "Tapered Fit",
    "season": "Winter",
    "occasion": [
      "Lounge",
      "Casual"
    ],
    "highlights": [
      "Brushed fleece inside for warmth",
      "Tapered leg with cuffs",
      "Zip back pocket"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not use fabric softener",
      "Tumble dry low",
      "Do not iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "fleece",
      "tapered fit",
      "lounge",
      "casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789110520164-2389992e5d0f?auto=format&fit=crop&w=900&q=80",
        "altText": "Tapered Sweatpants - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1789110853719-2920fe512117?auto=format&fit=crop&w=900&q=80",
        "altText": "Tapered Sweatpants - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Denim Jeans",
    "description": "Classic slim-fit denim jeans with a slight stretch for comfort. Features a zip fly and five-pocket styling for a timeless look.",
    "price": 5999,
    "discountPrice": 4999,
    "countInStock": 34,
    "sku": "BW-004",
    "category": "Bottom Wear",
    "brand": "DenimCo",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Blue",
      "Light Blue"
    ],
    "collections": "Denim",
    "material": "Denim",
    "gender": "Men",
    "fit": "Slim Fit",
    "season": "All Season",
    "occasion": [
      "Everyday",
      "Casual"
    ],
    "highlights": [
      "Classic five-pocket styling",
      "Mid-rise with a slim leg",
      "Stretch denim for easy movement"
    ],
    "careInstructions": [
      "Wash inside out in cold water",
      "Wash dark denim separately",
      "Hang to dry to keep the shape",
      "Do not tumble dry"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "denim",
      "slim fit",
      "everyday",
      "casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&w=900&q=80",
        "altText": "Denim Jeans - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
        "altText": "Denim Jeans - styled view"
      }
    ],
    "isFeatured": true,
    "isPublished": true
  },
  {
    "name": "Chino Pants",
    "description": "Slim-fit chino pants made from stretch cotton twill. Features a button closure and front and back pockets. Ideal for both casual and semi-formal wear.",
    "price": 5499,
    "discountPrice": 4799,
    "countInStock": 28,
    "sku": "BW-005",
    "category": "Bottom Wear",
    "brand": "CasualLook",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige",
      "Navy",
      "Black"
    ],
    "collections": "Smart Casual",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Slim Fit",
    "season": "All Season",
    "occasion": [
      "Office",
      "Smart Casual"
    ],
    "highlights": [
      "Garment-dyed cotton twill",
      "Flat front with slant pockets",
      "Works with sneakers or loafers"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "cotton",
      "slim fit",
      "office",
      "smart casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
        "altText": "Chino Pants - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1788380944948-f5fe4a3b3a13?auto=format&fit=crop&w=900&q=80",
        "altText": "Chino Pants - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Track Pants",
    "description": "Comfortable track pants with an elasticated waistband and tapered leg. Features side stripes for a sporty look. Ideal for athletic and casual wear.",
    "price": 3999,
    "countInStock": 19,
    "sku": "BW-006",
    "category": "Bottom Wear",
    "brand": "SportX",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "Red",
      "Blue"
    ],
    "collections": "Activewear",
    "material": "Polyester",
    "gender": "Men",
    "fit": "Regular Fit",
    "season": "All Season",
    "occasion": [
      "Gym",
      "Running"
    ],
    "highlights": [
      "Quick-dry performance fabric",
      "Contrast side stripes",
      "Zip ankles for easy on/off"
    ],
    "careInstructions": [
      "Machine wash at 30°C",
      "Do not bleach",
      "Hang to dry",
      "Low iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "polyester",
      "regular fit",
      "gym",
      "running"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789110853644-4403e0f1e5fe?auto=format&fit=crop&w=900&q=80",
        "altText": "Track Pants - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=900&q=80",
        "altText": "Track Pants - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Slim Fit Trousers",
    "description": "Tailored slim-fit trousers with belt loops and a hook-and-eye closure. Suitable for formal occasions or smart-casual wear.",
    "price": 6499,
    "countInStock": 15,
    "sku": "BW-007",
    "category": "Bottom Wear",
    "brand": "ExecutiveStyle",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gray",
      "Black"
    ],
    "collections": "Workwear",
    "material": "Polyester",
    "gender": "Men",
    "fit": "Slim Fit",
    "season": "All Season",
    "occasion": [
      "Office",
      "Formal"
    ],
    "highlights": [
      "Wrinkle-resistant weave",
      "Pressed front crease",
      "Hidden hook-and-bar closure"
    ],
    "careInstructions": [
      "Machine wash at 30°C",
      "Do not bleach",
      "Hang to dry",
      "Low iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "polyester",
      "slim fit",
      "office",
      "formal"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1604822106141-d9dccd171fad?auto=format&fit=crop&w=900&q=80",
        "altText": "Slim Fit Trousers - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1622450180332-3da1126f10a4?auto=format&fit=crop&w=900&q=80",
        "altText": "Slim Fit Trousers - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Cargo Pants",
    "description": "Loose-fit cargo pants with multiple utility pockets. Features adjustable ankle cuffs and a drawstring waist for versatility and comfort.",
    "price": 4999,
    "countInStock": 11,
    "sku": "BW-008",
    "category": "Bottom Wear",
    "brand": "StreetWear",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Olive",
      "Brown",
      "Black"
    ],
    "collections": "Streetwear",
    "material": "Cotton",
    "gender": "Men",
    "fit": "Relaxed Fit",
    "season": "All Season",
    "occasion": [
      "Outdoor",
      "Streetwear"
    ],
    "highlights": [
      "Reinforced cargo pockets",
      "Adjustable ankle toggles",
      "Heavy-duty cotton canvas"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "cotton",
      "relaxed fit",
      "outdoor",
      "streetwear"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80",
        "altText": "Cargo Pants - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1661784396787-2a43e31a5689?auto=format&fit=crop&w=900&q=80",
        "altText": "Cargo Pants - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Relaxed Fit Sweatpants",
    "description": "Relaxed-fit sweatpants made from soft fleece fabric. Features an elastic waist and adjustable drawstring for a custom fit.",
    "price": 3499,
    "countInStock": 21,
    "sku": "BW-009",
    "category": "Bottom Wear",
    "brand": "LoungeWear",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gray",
      "Black",
      "Navy"
    ],
    "collections": "Lounge",
    "material": "Fleece",
    "gender": "Men",
    "fit": "Relaxed Fit",
    "season": "Winter",
    "occasion": [
      "Lounge",
      "Weekend"
    ],
    "highlights": [
      "Ultra-soft fleece",
      "Relaxed straight leg",
      "Wide elastic waistband"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not use fabric softener",
      "Tumble dry low",
      "Do not iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "fleece",
      "relaxed fit",
      "lounge",
      "weekend"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789110854262-ec66f0648ec7?auto=format&fit=crop&w=900&q=80",
        "altText": "Relaxed Fit Sweatpants - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1636533104731-1613d7deaaa3?auto=format&fit=crop&w=900&q=80",
        "altText": "Relaxed Fit Sweatpants - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Formal Dress Pants",
    "description": "Classic formal dress pants with a slim fit. Made from lightweight, wrinkle-resistant fabric for a polished look at the office or formal events.",
    "price": 6999,
    "countInStock": 9,
    "sku": "BW-010",
    "category": "Bottom Wear",
    "brand": "ElegantStyle",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "Navy"
    ],
    "collections": "Workwear",
    "material": "Polyester",
    "gender": "Men",
    "fit": "Tailored Fit",
    "season": "All Season",
    "occasion": [
      "Formal",
      "Wedding"
    ],
    "highlights": [
      "Sharp tailored silhouette",
      "Half-lined for structure",
      "Belt loops and side adjusters"
    ],
    "careInstructions": [
      "Machine wash at 30°C",
      "Do not bleach",
      "Hang to dry",
      "Low iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "men",
      "polyester",
      "tailored fit",
      "formal",
      "wedding"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80",
        "altText": "Formal Dress Pants - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1631052066165-9720608b36da?auto=format&fit=crop&w=900&q=80",
        "altText": "Formal Dress Pants - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "High-Waist Skinny Jeans",
    "description": "High-waist skinny jeans in stretch denim with a button and zip fly. Features a flattering fit that hugs your curves and enhances your silhouette.",
    "price": 4999,
    "discountPrice": 4499,
    "countInStock": 32,
    "sku": "BW-W-001",
    "category": "Bottom Wear",
    "brand": "DenimStyle",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Blue",
      "Black",
      "Light Blue"
    ],
    "collections": "Denim",
    "material": "Denim",
    "gender": "Women",
    "fit": "Skinny Fit",
    "season": "All Season",
    "occasion": [
      "Everyday",
      "Casual"
    ],
    "highlights": [
      "High-rise waist that holds you in",
      "Super-stretch denim",
      "Five-pocket classic styling"
    ],
    "careInstructions": [
      "Wash inside out in cold water",
      "Wash dark denim separately",
      "Hang to dry to keep the shape",
      "Do not tumble dry"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "denim",
      "skinny fit",
      "everyday",
      "casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=900&q=80",
        "altText": "High-Waist Skinny Jeans - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80",
        "altText": "High-Waist Skinny Jeans - styled view"
      }
    ],
    "isFeatured": true,
    "isPublished": true
  },
  {
    "name": "Wide-Leg Trousers",
    "description": "Flowy, wide-leg trousers with a high waist and side pockets. Perfect for an elegant look that combines comfort and style.",
    "price": 5999,
    "countInStock": 17,
    "sku": "BW-W-002",
    "category": "Bottom Wear",
    "brand": "ElegantWear",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige",
      "Black",
      "White"
    ],
    "collections": "Workwear",
    "material": "Polyester",
    "gender": "Women",
    "fit": "Wide Leg",
    "season": "All Season",
    "occasion": [
      "Office",
      "Smart Casual"
    ],
    "highlights": [
      "Flowing wide-leg silhouette",
      "High waist with front pleats",
      "Fully lined for a smooth drape"
    ],
    "careInstructions": [
      "Machine wash at 30°C",
      "Do not bleach",
      "Hang to dry",
      "Low iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "polyester",
      "wide leg",
      "office",
      "smart casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789110854083-e4752bded644?auto=format&fit=crop&w=900&q=80",
        "altText": "Wide-Leg Trousers - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1789110853687-71692f0e86be?auto=format&fit=crop&w=900&q=80",
        "altText": "Wide-Leg Trousers - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Stretch Leggings",
    "description": "Soft, stretch leggings in a high-rise style. Perfect for lounging, working out, or casual wear, with a smooth fit that flatters your body.",
    "price": 2499,
    "discountPrice": 1999,
    "countInStock": 45,
    "sku": "BW-W-003",
    "category": "Bottom Wear",
    "brand": "ComfyFit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "Gray",
      "Navy"
    ],
    "collections": "Activewear",
    "material": "Cotton Blend",
    "gender": "Women",
    "fit": "Skinny Fit",
    "season": "All Season",
    "occasion": [
      "Gym",
      "Yoga",
      "Everyday"
    ],
    "highlights": [
      "Four-way stretch",
      "Squat-proof, opaque fabric",
      "High-rise comfort waistband"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not bleach",
      "Hang to dry",
      "Cool iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "cotton blend",
      "skinny fit",
      "gym",
      "yoga",
      "everyday"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789111161057-90c5ce12dc21?auto=format&fit=crop&w=900&q=80",
        "altText": "Stretch Leggings - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1600696491085-19dbbeb4f8c1?auto=format&fit=crop&w=900&q=80",
        "altText": "Stretch Leggings - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Pleated Midi Skirt",
    "description": "Elegant pleated midi skirt with a high waistband and soft fabric that drapes beautifully. Ideal for both formal and casual occasions.",
    "price": 5499,
    "discountPrice": 4999,
    "countInStock": 4,
    "sku": "BW-W-004",
    "category": "Bottom Wear",
    "brand": "ChicStyle",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Pink",
      "Navy",
      "Black"
    ],
    "collections": "Summer",
    "material": "Polyester",
    "gender": "Women",
    "fit": "A-Line",
    "season": "Summer",
    "occasion": [
      "Office",
      "Brunch"
    ],
    "highlights": [
      "Knife pleats that move with you",
      "Midi length",
      "Elastic back waistband"
    ],
    "careInstructions": [
      "Machine wash at 30°C",
      "Do not bleach",
      "Hang to dry",
      "Low iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "polyester",
      "a-line",
      "office",
      "brunch"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1600681103852-5f6df72461aa?auto=format&fit=crop&w=900&q=80",
        "altText": "Pleated Midi Skirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1593129747951-db31f82963da?auto=format&fit=crop&w=900&q=80",
        "altText": "Pleated Midi Skirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Flared Palazzo Pants",
    "description": "High-waist palazzo pants with a loose, flowing fit. Comfortable and stylish, making them perfect for casual outings or beach days.",
    "price": 4499,
    "countInStock": 13,
    "sku": "BW-W-005",
    "category": "Bottom Wear",
    "brand": "BreezyVibes",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White",
      "Beige",
      "Light Blue"
    ],
    "collections": "Summer",
    "material": "Linen Blend",
    "gender": "Women",
    "fit": "Flared Fit",
    "season": "Summer",
    "occasion": [
      "Vacation",
      "Casual"
    ],
    "highlights": [
      "Breezy linen blend",
      "Flared palazzo leg",
      "Drawstring waist"
    ],
    "careInstructions": [
      "Machine wash cold, gentle cycle",
      "Line dry",
      "Iron while slightly damp"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "linen blend",
      "flared fit",
      "vacation",
      "casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1580651214613-f4692d6d138f?auto=format&fit=crop&w=900&q=80",
        "altText": "Flared Palazzo Pants - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=900&q=80",
        "altText": "Flared Palazzo Pants - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "High-Rise Joggers",
    "description": "Comfortable high-rise joggers with an elastic waistband and drawstring for a perfect fit. Great for lounging or working out.",
    "price": 3999,
    "discountPrice": 3499,
    "countInStock": 23,
    "sku": "BW-W-006",
    "category": "Bottom Wear",
    "brand": "ActiveWear",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Black",
      "Gray",
      "Pink"
    ],
    "collections": "Lounge",
    "material": "Cotton Blend",
    "gender": "Women",
    "fit": "Relaxed Fit",
    "season": "All Season",
    "occasion": [
      "Gym",
      "Lounge"
    ],
    "highlights": [
      "High-rise waistband",
      "Cuffed ankles",
      "Soft brushed interior"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not bleach",
      "Hang to dry",
      "Cool iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "cotton blend",
      "relaxed fit",
      "gym",
      "lounge"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789110520495-8f1b8545c0ff?auto=format&fit=crop&w=900&q=80",
        "altText": "High-Rise Joggers - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        "altText": "High-Rise Joggers - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Paperbag Waist Shorts",
    "description": "Stylish paperbag waist shorts with a belted waist and wide legs. Perfect for summer outings and keeping cool in style.",
    "price": 3499,
    "countInStock": 18,
    "sku": "BW-W-007",
    "category": "Bottom Wear",
    "brand": "SunnyStyle",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "White",
      "Khaki",
      "Blue"
    ],
    "collections": "Summer",
    "material": "Cotton",
    "gender": "Women",
    "fit": "Relaxed Fit",
    "season": "Summer",
    "occasion": [
      "Summer",
      "Weekend"
    ],
    "highlights": [
      "Paperbag waist with belt",
      "Button-fly front",
      "Breathable cotton"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "cotton",
      "relaxed fit",
      "summer",
      "weekend"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789110854417-28997be7605f?auto=format&fit=crop&w=900&q=80",
        "altText": "Paperbag Waist Shorts - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1789110519819-8047d10f0c5e?auto=format&fit=crop&w=900&q=80",
        "altText": "Paperbag Waist Shorts - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Stretch Denim Shorts",
    "description": "Comfortable stretch denim shorts with a high-waisted fit and raw hem. Perfect for pairing with your favorite tops during warmer months.",
    "price": 3999,
    "discountPrice": 3499,
    "countInStock": 25,
    "sku": "BW-W-008",
    "category": "Bottom Wear",
    "brand": "DenimStyle",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue",
      "Black",
      "White"
    ],
    "collections": "Denim",
    "material": "Denim",
    "gender": "Women",
    "fit": "Regular Fit",
    "season": "Summer",
    "occasion": [
      "Summer",
      "Casual"
    ],
    "highlights": [
      "Stretch denim",
      "Frayed raw hem",
      "Mid-rise waist"
    ],
    "careInstructions": [
      "Wash inside out in cold water",
      "Wash dark denim separately",
      "Hang to dry to keep the shape",
      "Do not tumble dry"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "denim",
      "regular fit",
      "summer",
      "casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80",
        "altText": "Stretch Denim Shorts - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1585145197082-dba095ba01ab?auto=format&fit=crop&w=900&q=80",
        "altText": "Stretch Denim Shorts - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Culottes",
    "description": "Wide-leg culottes with a flattering high waist and cropped length. The perfect blend of comfort and style for any casual occasion.",
    "price": 4999,
    "countInStock": 14,
    "sku": "BW-W-009",
    "category": "Bottom Wear",
    "brand": "ChicStyle",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Olive"
    ],
    "collections": "Essentials",
    "material": "Polyester",
    "gender": "Women",
    "fit": "Wide Leg",
    "season": "Summer",
    "occasion": [
      "Office",
      "Smart Casual"
    ],
    "highlights": [
      "Cropped wide-leg length",
      "Elastic back waist",
      "Wrinkle-resistant fabric"
    ],
    "careInstructions": [
      "Machine wash at 30°C",
      "Do not bleach",
      "Hang to dry",
      "Low iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "polyester",
      "wide leg",
      "office",
      "smart casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789110520410-4fce7246f844?auto=format&fit=crop&w=900&q=80",
        "altText": "Culottes - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1789110519554-bdca2e4549e5?auto=format&fit=crop&w=900&q=80",
        "altText": "Culottes - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Classic Pleated Trousers",
    "description": "Timeless pleated trousers with a tailored fit. A wardrobe essential for workwear or formal occasions.",
    "price": 6999,
    "countInStock": 10,
    "sku": "BW-W-010",
    "category": "Bottom Wear",
    "brand": "ElegantWear",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy",
      "Black",
      "Gray"
    ],
    "collections": "Workwear",
    "material": "Wool Blend",
    "gender": "Women",
    "fit": "Tailored Fit",
    "season": "Autumn Winter",
    "occasion": [
      "Office",
      "Formal"
    ],
    "highlights": [
      "Wool-blend suiting fabric",
      "Front pleats and pressed crease",
      "Side pockets"
    ],
    "careInstructions": [
      "Dry clean recommended",
      "Or hand wash cold with wool detergent",
      "Dry flat",
      "Steam to remove creases"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "bottom wear",
      "women",
      "wool blend",
      "tailored fit",
      "office",
      "formal"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1624468470821-04cfd6c26097?auto=format&fit=crop&w=900&q=80",
        "altText": "Classic Pleated Trousers - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=900&q=80",
        "altText": "Classic Pleated Trousers - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Knitted Cropped Top",
    "description": "A stylish knitted cropped top with a flattering fitted silhouette. Perfect for pairing with high-waisted jeans or skirts for a casual look.",
    "price": 3999,
    "discountPrice": 3499,
    "countInStock": 20,
    "sku": "TW-W-001",
    "category": "Top Wear",
    "brand": "ChicKnit",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Beige",
      "White"
    ],
    "collections": "Autumn Winter",
    "material": "Cotton Blend",
    "gender": "Women",
    "fit": "Cropped Fit",
    "season": "Summer",
    "occasion": [
      "Casual",
      "Brunch"
    ],
    "highlights": [
      "Ribbed knit texture",
      "Cropped length pairs with high-rise bottoms",
      "Soft stretch"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not bleach",
      "Hang to dry",
      "Cool iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "cotton blend",
      "cropped fit",
      "casual",
      "brunch"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1789110521285-0ad90c7fe2e9?auto=format&fit=crop&w=900&q=80",
        "altText": "Knitted Cropped Top - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1673925205809-601b5a22eb61?auto=format&fit=crop&w=900&q=80",
        "altText": "Knitted Cropped Top - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Boho Floral Blouse",
    "description": "Flowy boho blouse with floral patterns, featuring a relaxed fit and balloon sleeves. Ideal for casual summer days.",
    "price": 4999,
    "discountPrice": 4499,
    "countInStock": 15,
    "sku": "TW-W-002",
    "category": "Top Wear",
    "brand": "BohoVibes",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White",
      "Pink"
    ],
    "collections": "Summer",
    "material": "Viscose",
    "gender": "Women",
    "fit": "Relaxed Fit",
    "season": "Summer",
    "occasion": [
      "Casual",
      "Vacation"
    ],
    "highlights": [
      "Hand-embroidered floral detailing",
      "Breathable viscose",
      "Relaxed peasant sleeves"
    ],
    "careInstructions": [
      "Hand wash cold or delicate cycle",
      "Do not wring",
      "Dry flat in the shade",
      "Cool iron on reverse"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "viscose",
      "relaxed fit",
      "casual",
      "vacation"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1790440936748-426133cf7dd4?auto=format&fit=crop&w=900&q=80",
        "altText": "Boho Floral Blouse - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1790435236428-a8159a4c784d?auto=format&fit=crop&w=900&q=80",
        "altText": "Boho Floral Blouse - styled view"
      }
    ],
    "isFeatured": true,
    "isPublished": true
  },
  {
    "name": "Casual T-Shirt",
    "description": "A soft, breathable casual t-shirt with a classic fit. Features a round neckline and short sleeves, perfect for everyday wear.",
    "price": 2499,
    "countInStock": 50,
    "sku": "TW-W-003",
    "category": "Top Wear",
    "brand": "ComfyTees",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Gray"
    ],
    "collections": "Essentials",
    "material": "Cotton",
    "gender": "Women",
    "fit": "Regular Fit",
    "season": "All Season",
    "occasion": [
      "Everyday",
      "Layering"
    ],
    "highlights": [
      "Soft combed cotton",
      "Classic crew neck",
      "Easy everyday fit"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "cotton",
      "regular fit",
      "everyday",
      "layering"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1622445270936-5dcb604970e7?auto=format&fit=crop&w=900&q=80",
        "altText": "Casual T-Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80",
        "altText": "Casual T-Shirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Off-Shoulder Top",
    "description": "An elegant off-shoulder top with ruffled sleeves and a flattering fit. Ideal for adding a touch of femininity to your outfit.",
    "price": 4499,
    "discountPrice": 3999,
    "countInStock": 12,
    "sku": "TW-W-004",
    "category": "Top Wear",
    "brand": "Elegance",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Red",
      "White",
      "Blue"
    ],
    "collections": "Evening",
    "material": "Polyester",
    "gender": "Women",
    "fit": "Regular Fit",
    "season": "Summer",
    "occasion": [
      "Brunch",
      "Vacation"
    ],
    "highlights": [
      "Off-shoulder neckline with elastic",
      "Flutter sleeves",
      "Lightweight fabric"
    ],
    "careInstructions": [
      "Machine wash at 30°C",
      "Do not bleach",
      "Hang to dry",
      "Low iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "polyester",
      "regular fit",
      "brunch",
      "vacation"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1790516099879-091fc87cdf6d?auto=format&fit=crop&w=900&q=80",
        "altText": "Off-Shoulder Top - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1780541357187-2ae0cfce0a7d?auto=format&fit=crop&w=900&q=80",
        "altText": "Off-Shoulder Top - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Lace-Trimmed Cami Top",
    "description": "A delicate cami top with lace trim and adjustable straps. The lightweight fabric makes it perfect for layering or wearing alone during warmer weather.",
    "price": 3499,
    "countInStock": 0,
    "sku": "TW-W-005",
    "category": "Top Wear",
    "brand": "DelicateWear",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Black",
      "White"
    ],
    "collections": "Evening",
    "material": "Silk Blend",
    "gender": "Women",
    "fit": "Slim Fit",
    "season": "All Season",
    "occasion": [
      "Evening",
      "Layering"
    ],
    "highlights": [
      "Silk-blend satin",
      "Delicate lace trim",
      "Adjustable straps"
    ],
    "careInstructions": [
      "Hand wash cold with mild detergent",
      "Do not wring or tumble dry",
      "Dry flat in the shade",
      "Cool iron on reverse"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "silk blend",
      "slim fit",
      "evening",
      "layering"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1770294758971-44fa1eae61a3?auto=format&fit=crop&w=900&q=80",
        "altText": "Lace-Trimmed Cami Top - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1525171254930-643fc658b64e?auto=format&fit=crop&w=900&q=80",
        "altText": "Lace-Trimmed Cami Top - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Graphic Print Tee",
    "description": "A trendy graphic print tee with a relaxed fit. Pair it with jeans or skirts for a cool and casual look.",
    "price": 2999,
    "countInStock": 27,
    "sku": "TW-W-006",
    "category": "Top Wear",
    "brand": "StreetStyle",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White",
      "Black"
    ],
    "collections": "Streetwear",
    "material": "Cotton",
    "gender": "Women",
    "fit": "Relaxed Fit",
    "season": "All Season",
    "occasion": [
      "Casual",
      "Streetwear"
    ],
    "highlights": [
      "Soft cotton jersey",
      "Statement graphic print",
      "Relaxed boxy fit"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "cotton",
      "relaxed fit",
      "casual",
      "streetwear"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1610142991820-e02266a4a9f0?auto=format&fit=crop&w=900&q=80",
        "altText": "Graphic Print Tee - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1598886221171-8e62de2c4e35?auto=format&fit=crop&w=900&q=80",
        "altText": "Graphic Print Tee - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Ribbed Long-Sleeve Top",
    "description": "A cozy ribbed long-sleeve top that offers comfort and style. Perfect for layering during cooler months.",
    "price": 5499,
    "discountPrice": 4999,
    "countInStock": 19,
    "sku": "TW-W-007",
    "category": "Top Wear",
    "brand": "ComfortFit",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gray",
      "Pink",
      "Brown"
    ],
    "collections": "Autumn Winter",
    "material": "Cotton Blend",
    "gender": "Women",
    "fit": "Slim Fit",
    "season": "Autumn Winter",
    "occasion": [
      "Casual",
      "Layering"
    ],
    "highlights": [
      "Rib-knit stretch fabric",
      "Scoop neckline",
      "Long sleeves"
    ],
    "careInstructions": [
      "Machine wash cold, inside out",
      "Do not bleach",
      "Hang to dry",
      "Cool iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "cotton blend",
      "slim fit",
      "casual",
      "layering"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1714207427861-9b411beca97e?auto=format&fit=crop&w=900&q=80",
        "altText": "Ribbed Long-Sleeve Top - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1549057758-edd29ca2b6ac?auto=format&fit=crop&w=900&q=80",
        "altText": "Ribbed Long-Sleeve Top - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Ruffle-Sleeve Blouse",
    "description": "A lightweight ruffle-sleeve blouse with a flattering fit. Perfect for a feminine touch to any outfit.",
    "price": 4499,
    "countInStock": 16,
    "sku": "TW-W-008",
    "category": "Top Wear",
    "brand": "FeminineWear",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "White",
      "Navy",
      "Lavender"
    ],
    "collections": "Summer",
    "material": "Viscose",
    "gender": "Women",
    "fit": "Regular Fit",
    "season": "All Season",
    "occasion": [
      "Office",
      "Brunch"
    ],
    "highlights": [
      "Ruffled sleeve detail",
      "Covered button front",
      "Lightweight viscose"
    ],
    "careInstructions": [
      "Hand wash cold or delicate cycle",
      "Do not wring",
      "Dry flat in the shade",
      "Cool iron on reverse"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "viscose",
      "regular fit",
      "office",
      "brunch"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1778826971124-c5ee892e266e?auto=format&fit=crop&w=900&q=80",
        "altText": "Ruffle-Sleeve Blouse - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1771201408101-43c5883d2344?auto=format&fit=crop&w=900&q=80",
        "altText": "Ruffle-Sleeve Blouse - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "Classic Button-Up Shirt",
    "description": "A versatile button-up shirt that can be dressed up or down. Made from soft fabric with a tailored fit, it's perfect for both casual and formal occasions.",
    "price": 5999,
    "countInStock": 22,
    "sku": "TW-W-009",
    "category": "Top Wear",
    "brand": "ClassicStyle",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White",
      "Light Blue",
      "Black"
    ],
    "collections": "Workwear",
    "material": "Cotton",
    "gender": "Women",
    "fit": "Regular Fit",
    "season": "All Season",
    "occasion": [
      "Office",
      "Smart Casual"
    ],
    "highlights": [
      "Crisp cotton poplin",
      "Classic point collar",
      "Curved hem"
    ],
    "careInstructions": [
      "Machine wash cold with similar colours",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "cotton",
      "regular fit",
      "office",
      "smart casual"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1707691481398-ccfbecf99ba9?auto=format&fit=crop&w=900&q=80",
        "altText": "Classic Button-Up Shirt - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1750857740027-5587994d98f5?auto=format&fit=crop&w=900&q=80",
        "altText": "Classic Button-Up Shirt - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  },
  {
    "name": "V-Neck Wrap Top",
    "description": "A chic v-neck wrap top with a tie waist. Its elegant style makes it perfect for both casual and semi-formal occasions.",
    "price": 4999,
    "discountPrice": 4499,
    "countInStock": 2,
    "sku": "TW-W-010",
    "category": "Top Wear",
    "brand": "ChicWrap",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Red",
      "Black",
      "White"
    ],
    "collections": "Evening",
    "material": "Polyester",
    "gender": "Women",
    "fit": "Regular Fit",
    "season": "All Season",
    "occasion": [
      "Evening",
      "Date Night"
    ],
    "highlights": [
      "Wrap front with side tie",
      "Flattering V-neck",
      "Soft fluid jersey"
    ],
    "careInstructions": [
      "Machine wash at 30°C",
      "Do not bleach",
      "Hang to dry",
      "Low iron"
    ],
    "origin": "Made in Pakistan",
    "tags": [
      "top wear",
      "women",
      "polyester",
      "regular fit",
      "evening",
      "date night"
    ],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1788463127287-1d250cf5fe78?auto=format&fit=crop&w=900&q=80",
        "altText": "V-Neck Wrap Top - front view"
      },
      {
        "url": "https://images.unsplash.com/photo-1591950838253-e2577979eb78?auto=format&fit=crop&w=900&q=80",
        "altText": "V-Neck Wrap Top - styled view"
      }
    ],
    "isFeatured": false,
    "isPublished": true
  }
];

module.exports = products;
