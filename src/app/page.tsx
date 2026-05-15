import Footer from "../app/components/footer"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-black text-center text-3xl bg-white px-6 py-10 rounded-lg shadow-lg w-full max-w-md">
        Bem vindo ao Frotronic
        
        <div className="p-4 rounded-full mt-4">
          <Link href="/login" className="text-black text-xl hover:text-blue-600 transition-colors">
            Entrar
          </Link>
        </div>

        <div className="p-4 rounded-full">
          <Link href="/formulario" className="text-black text-xl hover:text-blue-600 transition-colors">
            Agendar Viagem
          </Link>
        </div>

        <div className="p-4 rounded-full">
          <Link href="/consulta" className="text-black text-xl hover:text-blue-600 transition-colors">
            Consultar Agendamentos
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}