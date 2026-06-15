"use client"

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false); // Adicionado para simular o loading
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    try{
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas. Tente novamente.");
      } else {
        router.push("/dashboard"); 
        router.refresh();
      }
    } catch(e) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally{
      setIsPending(false);
    }
  }

  return (
    <div className="bg-[#121626] w-full h-screen flex justify-center items-center">
      {/* Card principal com as mesmas cores e proporções do Registro */}
      <div className="bg-[#303B59] w-[90%] max-w-125 md:w-[50%] md:h-[60%] border border-[#70788f] rounded-xl p-10 text-white">
        
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Entrar no Sistema</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Campo Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email" 
              name="email" 
              type="email"
              placeholder="seu@email.com" 
              required
              className="bg-[#262a33] h-12 rounded-md p-5 border-none outline-none focus:ring-2 focus:ring-[#6989ff]"
            />
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Senha</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Sua senha" 
              required
              className="bg-[#262a33] h-12 rounded-md p-5 border-none outline-none focus:ring-2 focus:ring-[#6989ff]"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button 
            type="submit" 
            disabled={isPending}
            className="rounded-md mt-4 p-3 font-bold transition-all hover:opacity-90 disabled:opacity-50 bg-[linear-gradient(135deg,#6989ff_0%,#2151da_100%)] text-white"
          >
            {isPending ? "Entrando..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-2">
            Não tem uma conta? <a href="/register" className="text-[#6989ff] hover:underline">Cadastre-se</a>
          </p>
        </form>
      </div>
    </div>
  );
}