import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { QuizApp } from '@/components/home/quiz-app';
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'Lovestruck — Find your lip soulmate',description:'Four questions. Twelve lipstick shades. Discover your personality match with the Cosmetics Lovestruck lip soulmate quiz.',image:'/app-icon.svg',jsonLd:[{'@context':'https://schema.org','@type':'WebSite',name:'Lovestruck',description:'A four-question lipstick personality quiz.'},{'@context':'https://schema.org','@type':'Organization',name:'Cosmetics Lovestruck'}]});}
export default function HomePage(){return <QuizApp/>;}
