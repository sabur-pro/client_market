'use client';

import { FC, useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginAsync, resetError } from '@/lib/features/auth/authSlice';
import { fetchCart } from '@/lib/features/cart/cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';

const LoginPage: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const result = await dispatch(loginAsync(formData));
    
    if (loginAsync.fulfilled.match(result)) {
      dispatch(fetchCart());
      
      setTimeout(() => {
        router.push('/products');
      }, 100);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <Link
          href="/welcome"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          <span className="text-sm">Назад</span>
        </Link>

        <div className="mb-8 animate-fade-in animation-delay-200">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-slate-900 rounded-xl p-3">
              <ShoppingBag className="h-6 w-6 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl font-light text-slate-900 mb-2">Вход</h1>
          <p className="text-slate-500 text-sm">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2 animate-fade-in-up animation-delay-400">
            <Label htmlFor="email" className="text-sm font-normal text-slate-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className="h-12 border-slate-200 focus:border-slate-900 rounded-lg"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2 animate-fade-in-up animation-delay-600">
            <Label htmlFor="password" className="text-sm font-normal text-slate-700">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="h-12 border-slate-200 focus:border-slate-900 rounded-lg"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-normal transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 animate-fade-in-up animation-delay-800"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" strokeWidth={2} />
                <span>Вход...</span>
              </>
            ) : (
              'Войти'
            )}
          </Button>

          <div className="text-center text-sm text-slate-600 pt-2 animate-fade-in-up animation-delay-1000">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-slate-900 font-medium hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </form>
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-shake {
          animation: shake 0.4s ease-out;
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

export default LoginPage;

