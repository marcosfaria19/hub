import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axios";
import { Button } from "modules/shared/components/ui/button";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaNodeJs, FaReact } from "react-icons/fa";
import { SiMongodb, SiTailwindcss, SiTypescript } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { UserRound } from "lucide-react";

function Login() {
  const { setToken } = useContext(AuthContext);
  const [credencial, setCredencial] = useState("");
  const [senha, setSenha] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/login", {
        LOGIN: credencial,
        senha: senha,
      });

      const token = response.data.token;
      if (typeof token === "string" && token.trim() !== "") {
        setToken(token);
        navigate("/projects");
      } else {
        toast.error("Erro ao obter o token de autenticação.");
      }
    } catch (err) {
      console.error("Login falhou", err);
      if (err.response && err.response.status === 401) {
        const message = err.response.data.message;
        if (message === "Nome de usuário ou senha inválidos") {
          toast.error("Senha incorreta");
        } else if (
          message ===
          "Você ainda não cadastrou uma senha, registre uma senha para entrar"
        ) {
          setShowPasswordModal(true);
        }
      } else if (err.response && err.response.status === 404) {
        toast.error(
          "Credencial não autorizada, solicitar acesso aos administradores",
        );
      } else {
        toast.error("Erro ao realizar o login");
      }
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      await axiosInstance.put("/register", {
        LOGIN: credencial,
        senha: senha,
      });

      setShowPasswordModal(false);
      handleLoginSubmit({ preventDefault: () => {} });
    } catch (err) {
      console.error("Erro ao registrar senha", err);
      if (err.response && err.response.status === 401) {
        toast.error(
          "Usuário sem permissão de acesso, solicitar ao administrador",
        );
      } else if (err.response && err.response.status === 400) {
        toast.error("Este usuário já possui uma senha cadastrada");
      } else {
        toast.error("Erro ao registrar a senha");
      }
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
  };

  const handleGoogleLogin = async () => {
    // Implement Google login logic here
    toast.info("Google login não implementado ainda");
  };

  const handleVisitorEntry = async () => {
    try {
      const response = await axiosInstance.post("/login", {
        LOGIN: "Visitante",
        senha: "visitante001",
      });

      const token = response.data.token;

      if (typeof token === "string" && token.trim() !== "") {
        setToken(token);
        navigate("/projects");
      } else {
        toast.error("Erro ao realizar o login como visitante.");
      }
    } catch (err) {
      console.error("Erro ao realizar o login como visitante", err);
      toast.error(
        "Falha ao entrar como visitante. Tente novamente mais tarde.",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Toaster />
      {/* Left Column - Image and Info */}
      <div className="relative w-full lg:w-1/2">
        <div className="login-bg absolute inset-0 bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white lg:p-12">
          <div>
            <h1 className="mb-2 text-3xl font-bold lg:text-5xl">
              Marcos Faria
            </h1>
            <p className="mb-4 text-xl lg:text-2xl">Fullstack Developer</p>

            <div className="mt-6 flex flex-wrap gap-4">
              <FaReact className="text-2xl text-blue-500" title="React" />
              <SiTypescript
                className="text-2xl text-blue-600"
                title="TypeScript"
              />
              <SiTailwindcss
                className="text-2xl text-blue-400"
                title="Tailwind CSS"
              />

              <FaNodeJs className="text-2xl text-green-500" title="Node.js" />
              <SiMongodb className="text-2xl text-green-600" title="MongoDB" />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <Button asChild size="icon" variant="ghost">
              <a
                href="https://github.com/marcosfaria19/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white"
              >
                <BsGithub className="h-6 w-6" />
              </a>
            </Button>

            <Button asChild size="icon" variant="ghost">
              <a
                href="https://linkedin.com/in/marcosfaria19"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white"
              >
                <BsLinkedin className="h-6 w-6" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Login Options */}
      <div className="flex w-full items-center justify-center bg-gray-100 p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mb-2 text-3xl font-bold">
              Bem-vindo(a) ao meu Hub de Projetos
            </h2>
            <p className="mb-6 text-gray-600">
              Escolha como deseja explorar meu portfólio de aplicações fullstack
            </p>
          </div>
          <div className="space-y-4">
            <Button
              className="h-12 w-full bg-black text-lg"
              onClick={handleVisitorEntry}
            >
              <UserRound className="mr-4 h-6 w-6" />
              Entrar como Visitante
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full text-lg text-background"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="mr-4 h-6 w-6" />
              Entrar com Google
            </Button>
            <p className="text-center text-sm text-gray-600">
              O login com Google demonstra a implementação de autenticação
              OAuth, mas não é necessário para explorar os projetos.
            </p>
          </div>
        </div>
      </div>

      {/* Modal para registrar senha */}
      <Dialog open={showPasswordModal} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar senha</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>
              Parece ser seu primeiro acesso. Gostaria de registrar essa senha?
            </p>
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={handleModalClose}>
              Voltar
            </Button>
            <Button variant="primary" onClick={handleRegisterSubmit}>
              Registrar senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Login;
