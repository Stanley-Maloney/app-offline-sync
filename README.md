# 📋 Lista de Tarefas Offline com Sincronização

Aplicativo React Native que permite gerenciar tarefas de forma **offline**, com **sincronização manual** quando o dispositivo estiver online. Ideal para situações em que o usuário pode ficar sem internet e deseja manter seus dados seguros até que possa sincronizá-los.

---

## 🚀 Funcionalidades

- ✅ Adicionar novas tarefas
- 🔄 Marcar tarefas como concluídas
- 📶 Detectar automaticamente a conexão online/offline
- 💾 Salvar dados localmente com `AsyncStorage`
- ☁️ Sincronizar dados pendentes manualmente com um botão
- ♻️ Restaurar tarefas fixas do "servidor" (mock)

---

## 🧠 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)
- [@react-native-community/netinfo](https://github.com/react-native-netinfo/react-native-netinfo)

---

## 📱 Demonstração

<!-- Substitua pela imagem real depois -->
![app-preview](./assets/preview.png)

---

## 🛠️ Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/Stanley-Maloney/app-offline-sync.git
cd app-offline-sync

# Instale as dependências
npm install

# Inicie o projeto com Expo
npx expo start
```

> 💡 Você pode testar diretamente no celular usando o app **Expo Go** e escaneando o QR Code gerado no terminal.

---

## 📂 Estrutura do Projeto

```
/
├── index.tsx              # Tela principal com lógica da lista de tarefas
├── assets/                # Imagens e ícones
└── README.md              # Documentação do projeto
```

---

## 🔄 Como Funciona a Sincronização

1. O usuário adiciona ou edita uma tarefa offline.
2. A tarefa é salva localmente e marcada como `synced: false`.
3. Quando a conexão é detectada, um botão **"Sincronizar Agora"** aparece.
4. Ao clicar, a sincronização é simulada e as tarefas são marcadas como `synced: true`.

---

## 🧪 Restaurar Tarefas do Servidor (Mock)

- Um botão permite restaurar duas tarefas fixas como se fossem recebidas de um servidor remoto.
- Ideal para testes e reset de estado local.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests com melhorias.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
