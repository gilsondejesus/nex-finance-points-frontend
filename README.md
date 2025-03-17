📱 Frontend - Nex-Points

Deploy: https://nex-front.vercel.app
Backend:https://github.com/gilsondejesus/nex-finance-points-backend

Login usuário com dados disponíveis para consulta: 
Usuário 1
CPF: 111.111.111-11
Email: user@teste.com
Senha: @user_test

Vídeo de Apresentação do Projeto: https://drive.google.com/file/d/1X_wcRFx2ZTG3-JcoEdyca_w2kPHsdUdV/view

Visão Geral:

Aplicação React para gestão de pontos, desenvolvida com Vite e Tailwind CSS. Funcionalidades principais:

- Autenticação JWT

- Visualização de extrato

- Gestão de carteira digital

- Upload de transações (admin)

Interface responsiva

📋 Pré-requisitos:
 - Node.js v18+
 - npm v9+
 - Backend em execução

⚙️ Instalação:

- git clone 
- npm install
  
🔧 Configuração
- Crie o arquivo .env na raiz:
VITE_API_URL=http://localhost:3000

🖥 Execução:

# Ambiente de desenvolvimento
- npm run dev
Aplicação disponível em: http://localhost:5173


🛠 Troubleshooting Comum

Problema: Erro de CORS

Solução:

1 - Verifique a variável CORS_ORIGIN no backend

2 - Certifique-se de incluir o domínio do frontend

3 - Reinicie o servidor backend

Problema: Conexão com banco de dados
Solução:

1 - Verifique as credenciais no .env

2 - Teste a conexão localmente

3 - Para bancos na nuvem, verifique:

- Requer SSL

- Whitelist de IPs

