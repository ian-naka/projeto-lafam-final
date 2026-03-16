import { useNavigate } from 'react-router-dom';

//componente
import React, { useState } from 'react';
import Input from '../../components/formulario/Input';
import Button from '../../components/formulario/Button';
import useFlashMessage from '../../hooks/useFlashMessage';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const { setFlashMessage } = useFlashMessage();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const resposta = await fetch('http://localhost:4000/auth/login', {
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

            setFlashMessage('login realizado com sucesso!', 'success');
            navigate('/criar-registro');

        } catch (error) {
            setFlashMessage(error instanceof Error ? error.message : String(error), 'error');
        }
    };

    return (
        //fundo escuro
        <div className="min-h-screen bg-[#2b2b2b] flex items-center justify-center p-4 font-sans">

            {/* container que alinha ao centro */}
            <div className="w-full max-w-[400px] flex flex-col items-center">

                {/* textos fora da caixa */}
                <h3 className="text-[36px] text-white font-bold mb-1 text-center drop-shadow-md">
                    Acesso
                </h3>
                <div className="text-[15px] text-white mb-6 text-center drop-shadow-md">
                    Entre com as credenciais!
                </div>

                {/* caixa branca com o formulario */}
                <div className="bg-white w-full p-[30px] shadow-lg">

                    <form onSubmit={handleLogin} className="flex flex-col gap-[15px]">

                        <div>
                            <label htmlFor="email" className="sr-only">Usuário ou E-mail</label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Usuário ou E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="senha" className="sr-only">Senha</label>
                            <Input
                                type="password"
                                id="senha"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        {/* botão preto */}
                        <Button type="submit">
                            Entrar
                        </Button>

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