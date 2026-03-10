import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        try {
            const resposta = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || 'Erro ao realizar login.');
            }

            localStorage.setItem('token', dados.token);
            localStorage.setItem('adminId', dados.adminId);

            alert('Login realizado com sucesso!');
            
        } catch (error) {
            setErro(error instanceof Error ? error.message : String(error));
        }
    };

    return (
        //fundo escuro
        <div className="min-h-screen bg-[#2b2b2b] flex items-center justify-center p-4 font-sans">
            
            {/* container que alinha ao centro */}
            <div className="w-full max-w-[400px] flex flex-col items-center">
                
                {/* textos fora da caixa */}
                <h3 className="text-[36px] text-white font-bold mb-1 text-center drop-shadow-md">
                    Acesso ao LAFAM
                </h3>
                <div className="text-[15px] text-white mb-6 text-center drop-shadow-md">
                    Entre com as credenciais!
                </div>

                {/* caixa branca com o formulario */}
                <div className="bg-white w-full p-[30px] shadow-lg">
                    
                    {erro && (
                        <div className="text-[#a5002c] border border-[#a5002c] bg-[#fde8ec] p-3 mb-4 text-[14px] text-center">
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-[15px]">
                        
                        <div>
                            <label htmlFor="email" className="sr-only">Usuário ou E-mail</label>
                            <input 
                                type="email" 
                                id="email"
                                placeholder="Usuário ou E-mail" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                /* inputs quadrados */
                                className="w-full px-[15px] py-[12px] text-[14px] text-[#333333] bg-white border border-[#e2e2e2] focus:border-[#a5002c] focus:outline-none transition-colors duration-200 placeholder:text-[#888888] rounded-none"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="senha" className="sr-only">Senha</label>
                            <input 
                                type="password" 
                                id="senha"
                                placeholder="Senha" 
                                value={senha} 
                                onChange={(e) => setSenha(e.target.value)} 
                                required 
                                className="w-full px-[15px] py-[12px] text-[14px] text-[#333333] bg-white border border-[#e2e2e2] focus:border-[#a5002c] focus:outline-none transition-colors duration-200 placeholder:text-[#888888] rounded-none"
                            />
                        </div>

                        {/* botão preto */}
                        <button 
                            type="submit"
                            className="bg-[#181818] hover:bg-[#333333] text-white text-[13px] font-bold uppercase tracking-widest py-[14px] w-full mt-2 transition-colors duration-200 rounded-none"
                        >
                            Entrar
                        </button>

                        {/* link do print */}
                        <div className="text-center mt-3">
                            <a 
                                href="#" 
                                className="text-[#a5002c] text-[14px] hover:text-[#820022] hover:underline transition-colors"
                            >
                                Perdeu a Senha
                            </a>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;