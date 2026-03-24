import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login({ email: data.email, password: data.password });
      toast.success(t('auth:loginSuccess'));
      navigate(ROUTES.dashboard);
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          toast.error(t('auth:loginInvalidCredentials'));
        } else if (status === 400) {
          const msg = err.response?.data?.message || err.response?.data?.title;
          toast.error(msg || t('auth:loginError'));
        } else if (status && status >= 500) {
          toast.error(t('common:serverError'));
        } else {
          toast.error(t('auth:loginError'));
        }
      } else if (err instanceof Error && err.message === 'SESSION_HYDRATION_FAILED') {
        toast.error(t('auth:sessionError'));
      } else {
        toast.error(t('auth:loginError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl shadow-primary/10">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {t('auth:loginTitle')}
        </CardTitle>
        <CardDescription>{t('auth:loginSubtitle')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth:email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{t('common:invalidEmail')}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth:password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{t('common:requiredField')}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('auth:login')}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t('auth:noAccount')}{' '}
            <Link to={ROUTES.register} className="font-medium text-primary hover:underline">
              {t('auth:register')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
