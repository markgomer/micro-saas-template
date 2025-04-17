# Aula 1

autenticação / banco de dados / pagamento
SEO / segurança / melhores práticas
Deploy no Vercel

## Começando

Next.js -> documentação

`npx create-next-app@latest`
-> Usa typescript!!
-> ESLint? Sim!
-> Tailwind? Sim!!
-> src/? Botou não, mas eu gosto...
-> App Router -> sim!
-> Turbopack: desnecessário

Rodar: `npm run dev`
-> Apaga Home() coloca div Hello World

globals.css -> não foca no dark mode no momento. Espera alguém pedir. Ele não gosta de deixar as coisas no global.css.

colocou bg-gray-100 no body

layout.tsx -> Metadata.title -> título que aparece no Google. Retirou do código (comentou)
- fontes: import { } from "next/font/google"
	- usou Poppins. Instanciou: `const poppins = Poppins({weight: [varios], subsets: ["latim"]})`
	- < body className={`${poppings.className} ...` }>
colocou bg-gray-100 no body

page.tsx -> `export default function Home(){...}`

-> Apagou public/

-> fez pasta "app/(project)/"
- app/actions/ -> funções simples pro projeto
- app/api/ -> rotas
- app/server/ -> coisas executadas exclusivamente no servidor (bom pra segurança)
- app/lib/
- app/components/
- app/hooks/ -> abstração pra não repetir código (DRY O.o)

-> (project)/page.tsx
- landing page: viu exemplos no product hunt pra inspiração pra landing page
- Faz tua landing page

-> redirecionar usr pra tela de login
- (project)/login/page.tsx
	- < Link href="/login"> < button ... < /button
	- import Link from "next/Link"
- Auth.js pra login `npm install next-auth@beta`

-> (project)/dashboard/page.tsx
h1 protected dashboard

-> `npx auth secret`
- cria var. amb. em .env.local
- /lib/auth.ts : copia da documentação
- /api/auth/[...nextauth]/route.ts : copia da doc
- adiciona login com provider (Google, GitHub etc)
- access token serve pra realizar ações no outro site. Ex.: criar eventos no google agenda; bot de whatsapp pelo facebook, etc.
- seguiu com Google.
- copia coisas no .env.local
- importa no lib/auth.ts
- 2 tipos de autenticação: lado do serv e lado client
	- sempre que possível fazer do lado do servidor.
	- no servidor tem performance melhor
- login/page.tsx: cola form de login da doc
	- muda action={}, para o actions/handle-auth.ts
- precisa das env do Google.
	- Obs: veja se tá usando nova versão de teste lá do Google Auth Platform.
	- vai pra doc do Google > cria novo projeto
	- precisa de email e info públicas.
	- Clientes > URI 1 localhost:3000 > URI 2 meudominio.com
		- URI redirec. autorizados: meudominio.com/api/auth/callback/google
	- Não coloca logotipo pra não precisar de aprovação
	- Acesso a dados: ativa userinfo e useremail
	- Salva!
	- Clientes: ID do cliente; chave secreta do cliente
		- cola no .env.local

-> dashboard/page.tsx:
async
```typescript
const session = await auth();
console.log(session)

<p>{session?.user?.email ? session?.user?.email : "não logado!"}
```

-> (project)/login/page.tsx
faz botãozinho pra logar com google

-> actions/handle-auth.ts
redirecionar para dashboard
```typescript
await signIn("google", { redirecTo: /dashboard })
```

LOGOUT
-> pega form do login e cola no dashboard:
email existe? aparece botão logout
```typescript
session?.user?.email && ( <form ... />)
```
- a parada redireciona pro login do google. Corrigir.

-> handle-auth.ts:
põe condição pra mudar pro signout
similar ao que fez no dashboard
```typescript
if (session) { await signOut({redirectTo: "/login"}) }
else await signIn("google", { redirecTo: /dashboard })
```

Usa muito isso pra proteger as rotas:
```typescript
const session = await auth();
```

**SALVAR LOGIN NO DB**
FIREBASE

-23:18
1:11:46~

`npm i firebase-admin`

-> lib/firebase.ts
```ts
const firebaseCert = cert({...})

if (!getApps().length) {
	initializeApp({
		credential: firebaseCert,
		...
	})
}

export const db getFirestore();
// export const storage = getStorage().bucket();
```

**Cria projeto no Firebase**

Could Firestore > Criar banco de dados
- Onde hospedar? Qualquer um. +Longe = +Latência. Depende do **cliente**

Modo produção

Integrar Auth.js com o DB do Firebase
Pegar keys do Firebase.
- Configurações do projeto > contas de serviço.

A quebra de linhas do private-key quebra VOCÊ!
- troca os \n por enter, 
- base64encode.org > encode > 
- [???] trocou a string pra FIREBASE_PRIVATE_KEY_BASE64= stringzona sem \n ....
- em firebase.ts: 
```ts
const decodedKey = Buffer.from(
	process.env.FIREBASE_PRIVATE_KEY_BASE64!,
	"base64").toString("utf-8");
```

-> Docs do Auth.js:
- Firebase Firestore: `npm install @auth/firebase-adapter`
	- Se der problema de versão: `npm install @auth/firebase-admin@12.6.0`

-> lib/auth.ts
```ts
adapter: FirestoreAdapter({
	credential: firebaseCert,
}),
```

-> Testa signin pelo google
-> Firebase Firestore database
checar sessions (demorou paburro) e accounts

# Atividade:
- Build in public:
	- documentar e compartilhar processo de desenvolvimento, evolução aprendizado e conquistas.
	- LinkedIn!

# Lições:
- Os locais das pastas importam!
- Prestar atenção nas chaves.
	(PROJECT_KEY != PROJECT_KEY_ID)

# Aula 2 O.o

Focar em empresas, atendendo um nicho específico.

## Integrando pagamentos

Vamos usar Stripe.

- Não tem Pix;
- Boa API.
- Recebe pagamentos do mundo inteiro (USD, EUR, etc)
- Formas de testar são boas.

É bom aprender o Mercado Pago também pra poder receber pagamentos pelo Pix.
Mas a documentação é fraca e as formas de testar são ruins.

### Stripe

--> lib/stripe.ts

npm i stripe

```ts
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil" // <- checar se é a atual. LSP preenche
});

export default stripe;
```




