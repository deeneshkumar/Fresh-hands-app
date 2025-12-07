import { COLORS } from './colors';

export const CATEGORIES = [
    {
        id: 'cleaning',
        name: 'Cleaning',
        tagline: 'Deep Clean & Sanitize',
        pricing: 'From ₹199',
        rating: 4.8,
        reviewCount: '1.2k',
        arrivalTime: '30 mins',
        icon: 'sparkles',
        image: 'https://tse2.mm.bing.net/th/id/OIP.ELcAksPvcfQnOl19AbNcIQHaFp?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
        id: 'repair',
        name: 'Repair',
        tagline: 'Quick & Reliable Fixes',
        pricing: 'From ₹149',
        rating: 4.7,
        reviewCount: '850+',
        arrivalTime: '45 mins',
        icon: 'wrench',
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'relocation',
        name: 'Relocation',
        tagline: 'Pack, Move, Unpack',
        pricing: 'From ₹999',
        rating: 4.9,
        reviewCount: '2k+',
        arrivalTime: 'On Schedule',
        icon: 'truck',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'vehicle',
        name: 'Vehicle',
        tagline: 'Complete Auto Care',
        pricing: 'From ₹399',
        rating: 4.6,
        reviewCount: '500+',
        arrivalTime: '60 mins',
        icon: 'car',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'lifestyle',
        name: 'Lifestyle',
        tagline: 'Decor & Renovation',
        pricing: 'From ₹1999',
        rating: 4.8,
        reviewCount: '300+',
        arrivalTime: 'Consultation',
        icon: 'palette',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'tech',
        name: 'Tech',
        tagline: 'Install & Repair',
        pricing: 'From ₹299',
        rating: 4.7,
        reviewCount: '900+',
        arrivalTime: '45 mins',
        icon: 'cpu',
        image: 'https://tse1.mm.bing.net/th/id/OIP.2GgtEInYei89zufP0sMaiwHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
        id: 'quick',
        name: 'Quick Fix',
        tagline: 'Small Jobs Done',
        pricing: 'From ₹99',
        rating: 4.5,
        reviewCount: '150+',
        arrivalTime: '30 mins',
        icon: 'zap',
        image: 'https://tse4.mm.bing.net/th/id/OIP.R0QrR3K7PRwL4whe9IIyxQHaE7?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
        id: 'pest',
        name: 'Pest Control',
        tagline: 'Safe Removal',
        pricing: 'From ₹499',
        rating: 4.8,
        reviewCount: '1k+',
        arrivalTime: '24 hrs',
        icon: 'bug',
        image: 'https://tse2.mm.bing.net/th/id/OIP.gNKhPPi0RBY6ap2GBzJTRgHaEP?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
        id: 'salon',
        name: 'Salon',
        tagline: 'Beauty at Home',
        pricing: 'From ₹249',
        rating: 4.9,
        reviewCount: '3k+',
        arrivalTime: '30 mins',
        icon: 'scissors',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'massage',
        name: 'Massage',
        tagline: 'Therapy & Relax',
        pricing: 'From ₹799',
        rating: 4.9,
        reviewCount: '1.5k+',
        arrivalTime: '45 mins',
        icon: 'smile',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop'
    },
];

export const SERVICES = [
    // Cleaning
    {
        id: 'c1',
        categoryId: 'cleaning',
        name: 'Home Cleaner (Full)',
        price: '999',
        rating: 4.8,
        icon: 'home',
        isPopular: true,
        image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=600&auto=format&fit=crop', // New bathroom cleaning image
        keywords: ['clean', 'house', 'maid', 'dusting', 'mop']
    },
    {
        id: 'c2',
        categoryId: 'cleaning',
        name: 'Kitchen Cleaning',
        price: '499',
        rating: 4.7,
        icon: 'utensils',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',
        keywords: ['kitchen', 'sink', 'stove', 'clean']
    },
    {
        id: 'c3',
        categoryId: 'cleaning',
        name: 'Bathroom Cleaning',
        price: '399',
        rating: 4.6,
        icon: 'droplet',
        image: 'https://tse2.mm.bing.net/th/id/OIP.9-4Ipg9SMplVacW10QhcgAHaFi?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        keywords: ['bathroom', 'toilet', 'wash', 'clean']
    },

    // Repair
    {
        id: 'r1',
        categoryId: 'repair',
        name: 'Plumber',
        price: '299',
        rating: 4.5,
        icon: 'droplet',
        isPopular: true,
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop',
        keywords: ['pipe', 'leak', 'tap', 'water', 'plumbing']
    },
    {
        id: 'r2',
        categoryId: 'repair',
        name: 'Electrician',
        price: '349',
        rating: 4.6,
        icon: 'zap',
        isPopular: true,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
        keywords: ['light', 'fan', 'switch', 'power', 'electric']
    },
    {
        id: 'r3',
        categoryId: 'repair',
        name: 'Carpenter',
        price: '449',
        rating: 4.7,
        icon: 'hammer',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        keywords: ['wood', 'furniture', 'door', 'repair']
    },

    // Vehicle
    {
        id: 'v1',
        categoryId: 'vehicle',
        name: 'Car Wash',
        price: '599',
        rating: 4.8,
        icon: 'car',
        isPopular: true,
        image: 'https://tse3.mm.bing.net/th/id/OIP.b67O8zbLSxFnvAVSQgIbEgHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        keywords: ['car', 'wash', 'clean', 'vehicle']
    },
    {
        id: 'v2',
        categoryId: 'vehicle',
        name: 'Bike Service',
        price: '399',
        rating: 4.5,
        icon: 'bike',
        image: 'https://5.imimg.com/data5/PA/ED/ZI/SELLER-31759934/bike-repairing-services-500x500.jpg',
        keywords: ['bike', 'repair', 'service', 'two wheeler']
    },

    // Lifestyle
    {
        id: 'l1',
        categoryId: 'lifestyle',
        name: 'Interior Design',
        price: '1999',
        rating: 4.9,
        icon: 'layout',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop',
        keywords: ['design', 'decor', 'home', 'style']
    },
    {
        id: 'l2',
        categoryId: 'lifestyle',
        name: 'House Painting',
        price: '4999',
        rating: 4.7,
        icon: 'brush',
        image: 'https://tse3.mm.bing.net/th/id/OIP.CAj1pmZS1r_KnPNwAjk_SgHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        keywords: ['paint', 'wall', 'color', 'house']
    },

    // Tech
    {
        id: 't1',
        categoryId: 'tech',
        name: 'AC Service & Repair',
        price: '499',
        rating: 4.8,
        icon: 'thermometer',
        image: 'https://media.istockphoto.com/photos/male-repair-air-conditioner-at-room-he-is-air-technician-mechanic-picture-id1279259535?b=1&k=20&m=1279259535&s=170667a&w=0&h=GC1LaqaNNYVPIEQR5yQfA5dnhIwHLYTU7Ps7oHAB4cM=',
        keywords: ['ac', 'air conditioner', 'repair', 'cooling']
    },
    {
        id: 't2',
        categoryId: 'tech',
        name: 'Laptop/PC Repair',
        price: '299',
        rating: 4.7,
        icon: 'monitor',
        image: 'https://tse2.mm.bing.net/th/id/OIP.hfVDhs1xHyBDYPnXyXtxggHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        keywords: ['laptop', 'computer', 'repair', 'tech']
    },

    // Pest Control
    {
        id: 'pc1',
        categoryId: 'pest',
        name: 'General Pest Control',
        price: '899',
        rating: 4.9,
        icon: 'shield',
        image: 'https://img.freepik.com/premium-photo/pest-control-hd-image-stock-images-pest-control-hd-image-stock-photo_1012565-47691.jpg',
        keywords: ['pest', 'cockroach', 'ant', 'cleaning']
    },
    {
        id: 'pc2',
        categoryId: 'pest',
        name: 'Termite Treatment',
        price: '2999',
        rating: 4.8,
        icon: 'alert-triangle',
        image: 'https://tse1.mm.bing.net/th/id/OIP.BwHO97kV6DdImW8gVI_TcwHaE3?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        keywords: ['termite', 'wood', 'pest', 'protection']
    },

    // Relocation
    {
        id: 'rl1',
        categoryId: 'relocation',
        name: 'House Shifting (Small)',
        price: '3999',
        rating: 4.7,
        icon: 'truck',
        image: 'https://th.bing.com/th/id/OIP.2O0Mfjd9XO9Eb5qmv6VyqgHaCv?w=345&h=129&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1',
        keywords: ['shift', 'move', 'house', 'truck']
    },
    {
        id: 'rl2',
        categoryId: 'relocation',
        name: 'Vehicle Moving',
        price: '5999',
        rating: 4.8,
        icon: 'navigation',
        image: 'https://th.bing.com/th/id/OIP.d7EdGz8kjJ7D3SaA2h4rbAHaFS?w=166&h=150&c=6&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1',
        keywords: ['car', 'bike', 'move', 'transport']
    },

    // Quick Fix
    {
        id: 'qf1',
        categoryId: 'quick',
        name: 'Door Lock Repair',
        price: '199',
        rating: 4.5,
        icon: 'unlock',
        image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=600&auto=format&fit=crop',
        keywords: ['door', 'lock', 'repair', 'key']
    },
    {
        id: 'qf2',
        categoryId: 'quick',
        name: 'Curtain Rod Install',
        price: '249',
        rating: 4.6,
        icon: 'tool',
        image: 'https://th.bing.com/th/id/OIP.H4uhTRL44X2GJdT55mz_2AHaES?w=321&h=186&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1',
        keywords: ['curtain', 'rod', 'drill', 'install']
    },

    // More Popular Services
    {
        id: 'p1',
        categoryId: 'salon',
        name: 'Men\'s Haircut',
        price: '299',
        rating: 4.6,
        icon: 'scissors',
        isPopular: true,
        image: 'https://images.unsplash.com/photo-1593702295094-aea22597af65?q=80&w=600&auto=format&fit=crop',
        keywords: ['hair', 'cut', 'men', 'salon']
    },
    {
        id: 'p3',
        categoryId: 'salon',
        name: 'Women\'s Haircut',
        price: '599',
        rating: 4.8,
        icon: 'scissors',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
        keywords: ['hair', 'cut', 'women', 'salon', 'style']
    },
    {
        id: 'p2',
        categoryId: 'massage',
        name: 'Full Body Massage',
        price: '1499',
        rating: 4.9,
        icon: 'smile',
        isPopular: true,
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600&auto=format&fit=crop',
        keywords: ['massage', 'relax', 'body', 'spa']
    },
    {
        id: 'p4',
        categoryId: 'massage',
        name: 'Head & Shoulder',
        price: '499',
        rating: 4.7,
        icon: 'smile',
        image: 'https://th.bing.com/th/id/OIP.KjTv7U3M9PUJdCo4jB7n2gHaE7?w=268&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1',
        keywords: ['massage', 'head', 'relax', 'stress']
    }
];

export const POPULAR_SERVICES = SERVICES.filter(s => s.isPopular);

export const OFFERS = [
    {
        id: '1',
        title: '50% OFF',
        subtitle: 'On First Cleaning',
        color: COLORS.primary,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop',
        description: 'Get half price on your first home cleaning service. Valid for new users only.'
    },
    {
        id: '2',
        title: 'Free Checkup',
        subtitle: 'For AC Service',
        color: COLORS.secondary,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
        description: 'Summer special! Free AC checkup with every service.'
    },
    {
        id: '3',
        title: 'Cashback',
        subtitle: 'Up to ₹100 on UPI',
        color: '#4CAF50',
        image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=600&auto=format&fit=crop', // New cashback image
        description: 'Pay via UPI and get instant cashback.'
    },
    {
        id: '4',
        title: 'Mega Sale',
        subtitle: 'Flat 20% OFF',
        color: '#9C27B0',
        image: 'https://images.unsplash.com/photo-1572584642822-6f8de0243c93?q=80&w=600&auto=format&fit=crop',
        description: 'Limited time offer on all repair services.'
    },
    {
        id: '5',
        title: 'Painting Special',
        subtitle: 'Free Consultation',
        color: '#FF9800',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        description: 'Get expert advice for your home makeover.'
    },
    {
        id: '6',
        title: 'Spa at Home',
        subtitle: 'Relax & Rejuvenate',
        color: '#E91E63',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
        description: 'Luxury spa treatments in your living room.'
    }
];

export const FEATURED_SERVICES = SERVICES.filter(s => ['c1', 'r2', 'l1', 'p2'].includes(s.id));