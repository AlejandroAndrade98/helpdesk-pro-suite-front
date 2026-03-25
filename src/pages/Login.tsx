import AuthLayout from '@/layouts/AuthLayout';
import LoginForm from '@/features/auth/components/LoginForm';

const Login = () => (
  <div className="dark auth-dark">
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  </div>
);

export default Login;
