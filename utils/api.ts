import { API_URL } from '@/constants/Api';

export const fetchItemsFromApi = async () => {
  const response = await fetch(`${API_URL}/items`);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados');
  }
  return response.json();
};
