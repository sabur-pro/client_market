'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const WelcomePage: FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-slate-900 rounded-2xl blur-xl opacity-20 animate-pulse-slow"></div>
              <div className="relative bg-slate-900 rounded-2xl p-4">
                <ShoppingBag className="h-12 w-12 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-light mb-3 text-slate-900 tracking-tight animate-fade-in animation-delay-200">
            Market
          </h1>
          
          <p className="text-slate-600 text-sm animate-fade-in animation-delay-400">
            Современный интернет-магазин
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <Button
            onClick={() => router.push('/register')}
            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-normal transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 animate-fade-in-up animation-delay-600 group"
          >
            <span>Создать аккаунт</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Button>

          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            className="w-full h-14 border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-slate-900 rounded-xl font-normal transition-all duration-300 animate-fade-in-up animation-delay-800"
          >
            Войти
          </Button>
        </div>

        <div className="text-center animate-fade-in animation-delay-1000">
          <p className="text-xs text-slate-400">
            Присоединяйтесь к тысячам покупателей
          </p>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50 animate-float"></div>
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50 animate-float-delayed"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -20px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-20px, 20px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 20s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;

