'use client';

import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logoutAsync } from '@/lib/features/auth/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, LogOut, Loader2 } from 'lucide-react';

const ProfilePage: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    router.push('/welcome');
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Профиль</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Информация профиля
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {user.firstName && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Имя</p>
                  <p className="font-medium">
                    {user.firstName} {user.lastName || ''}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-5 w-5 flex items-center justify-center">
                <div className={`h-3 w-3 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-600' : 'bg-green-600'}`}></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Роль</p>
                <p className="font-medium">
                  {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Действия</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

