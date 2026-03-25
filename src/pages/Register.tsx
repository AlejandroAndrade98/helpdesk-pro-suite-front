import AuthLayout from '@/layouts/AuthLayout';
import RegisterForm from '@/features/auth/components/RegisterForm';

const Register = () => (
  <div className="dark auth-dark">
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  </div>
);

export default Register;
