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

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      toast.success(t('auth:registerSuccess'));
      navigate(ROUTES.login);
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 409) {
          toast.error(t('auth:registerConflict'));
        } else if (status === 400) {
          const msg = err.response?.data?.message || err.response?.data?.title;
          toast.error(msg || t('auth:registerError'));
        } else if (status && status >= 500) {
          toast.error(t('common:serverError'));
        } else {
          toast.error(t('auth:registerError'));
        }
      } else {
        toast.error(t('auth:registerError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl shadow-primary/10">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {t('auth:registerTitle')}
        </CardTitle>
        <CardDescription>{t('auth:registerSubtitle')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('auth:firstName')}</Label>
              <Input id="firstName" {...register('firstName')} className={errors.firstName ? 'border-destructive' : ''} />
              {errors.firstName && <p className="text-sm text-destructive">{t('common:requiredField')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('auth:lastName')}</Label>
              <Input id="lastName" {...register('lastName')} className={errors.lastName ? 'border-destructive' : ''} />
              {errors.lastName && <p className="text-sm text-destructive">{t('common:requiredField')}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth:email')}</Label>
            <Input id="email" type="email" placeholder="name@company.com" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
            {errors.email && <p className="text-sm text-destructive">{t('common:invalidEmail')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth:password')}</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} className={errors.password ? 'border-destructive' : ''} />
            {errors.password && <p className="text-sm text-destructive">{t('common:minLength', { min: 6 })}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('auth:register')}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t('auth:hasAccount')}{' '}
            <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
              {t('auth:login')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
