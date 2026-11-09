export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cascondigital.com').replace(/\/$/, '');
export const SITE_NAME = 'Cascon';
export const SITE_DESCRIPTION = 'Cascon is a Shopify agency and AI media studio in Bangalore and Dubai. We build ecommerce stores and create content, marketing and search foundations for brands in India and the UAE.';
export const CONTACT_EMAIL = 'info@cascondigital.com';
export const CAL_LINK = 'https://cal.com/cascon-haw2fz/15min';
export const PLAUSIBLE_DOMAIN = 'www.cascondigital.com';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1444150007832418';

export const SOCIAL = {
  instagram: 'https://www.instagram.com/wearecascon',
};

export const LOCATIONS = {
  coventry: {
    label: 'Dubai',
    address: 'Office #2220, 22nd Floor, Tower Plaza\nSheikh Zayed Road, Dubai\nUnited Arab Emirates',
    mapUrl: 'https://goo.gl/maps/CyJdFtbyL9QZ12Sk8',
    phone: '+971 54 747 5998',
  },
  bangalore: {
    label: 'Bangalore',
    address: 'No. 33, 4th Floor, 1st Main, Ganganagar Gramatana\nHMT Layout, CBI Road\nBangalore 560032\nIndia',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=No.+33+4th+Floor+1st+Main+Ganganagar+Gramatana+HMT+Layout+CBI+Road+Bangalore+560032',
    phone: '+91 82816 63376',
  },
};

export const VIMEO = {
  desktop: '1177636206',
  mobile: '1177636252',
};

export const WHATSAPP_URL = `https://wa.me/${LOCATIONS.bangalore.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Cascon, I would like to discuss a project.')}`;
