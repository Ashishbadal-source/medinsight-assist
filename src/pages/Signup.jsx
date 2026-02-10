import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    console.log("SIGNUP FORM DATA 👉", formData);
  const res = await signup({
    email: formData.email,
    password: formData.password,
    name: formData.name,
    age: formData.age,
    gender: formData.gender,
  });

  if (!res.success) {
    alert(res.error.message);
    return;
  }

  navigate("/profile");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <AuthForm type="signup" onSubmit={handleSignup} />
      </div>
    </div>
  );
};

export default Signup;
