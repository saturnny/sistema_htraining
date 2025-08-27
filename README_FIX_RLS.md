# HTraining – Sistema de Eventos 🎟️

Um painel administrativo e sistema de inscrição de eventos integrado ao **Supabase**.  
Permite gerenciar **lotes**, **participantes** e realizar **check-in** no dia do evento.

---

## 🚀 Tecnologias
- [Bootstrap 5](https://getbootstrap.com/) – interface responsiva
- [Supabase](https://supabase.com/) – banco de dados e autenticação
- HTML + CSS + JavaScript vanilla

---

## 📂 Estrutura de páginas
- `index.html` → Página pública de inscrição no evento
- `payment.html` → Placeholder para integração de pagamento
- `admin-login.html` → Tela de login (admin / admin)
- `admin-lots.html` → CRUD de lotes
- `admin-participants.html` → CRUD de participantes
- `admin-checkin.html` → Check-in de participantes
- `assets/` → Estilos, scripts e imagens

---

## ⚙️ Configuração do Supabase
Edite o arquivo `assets/config.js` e coloque suas credenciais:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://SEU-PROJETO.supabase.co",
  SUPABASE_ANON_KEY: "SUA-ANON-KEY",
  TABLES: { LOTS: "lots", PARTICIPANTS: "participants" }
};
🗄️ Estrutura do Banco (Supabase)
Execute o arquivo supabase_schema.sql no SQL Editor do Supabase:

Cria tabelas lots e participants

Ativa RLS

Índices para performance

🔐 Row Level Security (RLS)
Por padrão, o Supabase ativa RLS e bloqueia INSERT/UPDATE/DELETE.
Existem três opções:

1) Diagnóstico rápido
sql
Copiar código
select relname, relrowsecurity as rls_on
from pg_class
where relname in ('lots','participants');
2) Abrir tudo para DEV
Execute dev_open_policies.sql
Isso cria policies permissivas de select/insert/update/delete para anon/authenticated.

3) Desligar RLS (último recurso p/ teste)
Execute dev_disable_rls.sql
⚠️ Não use em produção.

4) Produção segura (recomendado)
Público: apenas SELECT em lots

Admin: mutações via Edge Functions com Service Role

Policies restritas que só aceitam operações via função

▶️ Rodando localmente
Clone o repositório:

bash
Copiar código
git clone https://github.com/saturnny/htraining-event-system.git
cd htraining-event-system
Sirva os arquivos em localhost:

bash
Copiar código
# Python
python -m http.server 5500

# ou Node
npx serve
Acesse no navegador:
http://localhost:5500

🌐 Deploy no Vercel
Conecte o repositório no Vercel

Escolha Framework Preset: Other

Root Directory: /

Deploy 🎉

👤 Login Administrativo
Usuário: admin

Senha: admin

⚠️ Altere depois para maior segurança.

📌 Próximos passos
Integrar gateway de pagamento na página payment.html

Fechar RLS em produção e mover mutações para Edge Functions

Customizar identidade visual conforme a marca do evento

yaml
Copiar código

---

👉 Esse README já deixa o projeto redondo no GitHub, bonito pra qualquer um que olhar, e você ainda mostra claramente como rodar e como lidar com o **RLS**.  

Quer que eu já te monte esse README no formato final e adicionar um `.gitignore` básico (pra ignorar `node_modules`, `.DS_Store`, etc.) antes de você dar o próximo `git push`?







Perguntar ao ChatGPT
