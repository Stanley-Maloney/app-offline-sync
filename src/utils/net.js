import NetInfo from '@react-native-community/netinfo';

export const checkConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};
