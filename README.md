# 📋 Lista de Tarefas Offline com Sincronização

Aplicativo React Native que permite gerenciar tarefas de forma **offline**, com **sincronização manual** quando o dispositivo estiver online. Ideal para situações em que o usuário pode ficar sem internet e deseja manter seus dados seguros até que possa sincronizá-los.

## 🚀 Funcionalidades

- ✅ Adicionar tarefas
- 🔄 Marcar tarefas como concluídas
- 📶 Detectar automaticamente quando o dispositivo está online/offline
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

![app-preview](./assets/preview.png) <!-- adicione uma imagem do app depois -->

---

## 🛠️ Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio

# Instale as dependências
npm install

# Inicie com o Expo
npx expo start
