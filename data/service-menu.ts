import type { IconName } from '@/components/Icon';
export const serviceMenu: { title: string; items: { label: string; href: string; icon: IconName }[] }[] = [
{ title: 'Commerce & websites', items: [
{label:'Shopify development',href:'/services/shopify-development',icon:'shopify'},
{label:'Shopify migration',href:'/services/woocommerce-to-shopify',icon:'workflow'},
{label:'Shopify redesign',href:'/services/shopify-redesign',icon:'layout'},
{label:'Conversion optimisation',href:'/services/shopify-cro',icon:'chart'}]},
{title:'Creative & content',items:[
{label:'AI product photography',href:'/services/ai-product-photography',icon:'camera'},
{label:'AI video production',href:'/services/ai-video-production',icon:'sparkles'},
{label:'Content strategy',href:'/services#content-strategy',icon:'content'}]},
{title:'Reach & growth',items:[
{label:'Performance marketing',href:'/services#performance-marketing',icon:'megaphone'},
{label:'SEO & AEO',href:'/services#seo-aeo',icon:'search'},
{label:'Automation',href:'/services#automation',icon:'workflow'}]},
];
