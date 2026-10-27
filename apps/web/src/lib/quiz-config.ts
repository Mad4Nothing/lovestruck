export const config = {
 weights:{q3:3,q1:2,q4:2},
 defaultHero:{nude:'latte-love',red:'red-my-mind',pink:'berry-sweet'},
 productBaseUrl:'https://www.nykaa.com/nykaa-cosmetics-lovestruck-velvet-matte-long-wear-comfortable-lipstick/p/29584475',
 footerNote:'',
 /**
  * Splash-screen background video.
  * To use your own clip, upload a file named `splash-bg.mp4` to
  * apps/web/public/ — it will be served at /splash-bg.mp4 and picked up
  * automatically. The poster image (splash-bg.jpg) shows until the video
  * loads, while offline, or when reduced motion is requested.
  */
 splashVideo:{
  src:'/splash-bg.mp4',
  poster:'/splash-bg.png',
 },
};
export function shopUrl(shade:{id:string;sku:number|null}) {
 const url = new URL(config.productBaseUrl);
 if(shade.sku!==null) url.searchParams.set('skuId',String(shade.sku));
 Object.entries({utm_source:'lovestruck_pwa',utm_medium:'quiz',utm_campaign:'lip_soulmate',utm_content:shade.id}).forEach(([key,value])=>url.searchParams.set(key,value));
 return url.toString();
}
