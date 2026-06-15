"use client" // Obrigatório para usar Hooks

import { useActionState } from "react";
import { registerAction } from "@/actions/registerAction";

export default function RegisterPage() {
  // state: o que a action retorna (começa como null)
  // formAction: a versão da action que o formulário aceita
  // isPending: booleano para desabilitar o botão enquanto processa
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="bg-[#121626] w-full h-screen flex justify-center items-center">
      <div className="bg-[#303B59] w-[90%] max-w-125 md:w-[50%] md:h-[60%] border border-[#70788f] rounded-xl p-10">

        <h1 className="text-2xl font-bold mb-6 text-center text-white">Cadastre-se</h1>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="">
              Nome Completo
            </label>
            <input id="name" name="name" placeholder="Nome" className="bg-[#262a33] h-12 rounded-md p-5"/>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="">
              E-mail
            </label>
            <input id="email" name="email" placeholder="Email" className="bg-[#262a33] h-12 rounded-md p-5"/>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="">
              Senha
            </label>
            <input id="password" name="password" type="password" placeholder="Senha" className="bg-[#262a33] h-12 rounded-md p-5"/>
          </div>
          
          
          {state?.error && <p className="text-red-500">{state.error}</p>}

          <button type="submit" disabled={isPending} className="rounded-md mt-2 p-3 bg-[linear-gradient(135deg,#6989ff_0%,#2151da_100%)] ">
            {isPending ? "Carregando..." : "Cadastrar"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-2">
            Já tem uma conta? <a href="/login" className="text-[#6989ff] hover:underline">Faça Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

{/*
    
    */}