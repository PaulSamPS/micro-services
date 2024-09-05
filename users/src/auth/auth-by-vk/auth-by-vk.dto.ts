export class VkAuthPayloadDto {
  payload: {
    auth: number;
    token: string;
    ttl: number;
    type: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      avatar: string;
      phone: string;
    };
    uuid: string;
  };
}

/**
 * Ответ на запрос обмена silent token на access token
 * @see https://dev.vk.com/ru/vkid/tokens/access-token
 */
export type VkAccessTokenResponse = {
  access_token: string;
  /** используется для отзыва токена, передается в callback api в событии user_session_finished */
  access_token_id: string;
  user_id: string;
  /** номер всегда начинается с кода страны без знака + */
  phone: string;
  /**
   * дата последней валидации timestamp в секундах. Если дата валидации не включена для вашего приложения, поле не возвращается
   */
  phone_validated: number;
  /** признак partial авторизации */
  is_partial: boolean;
  /** тип учетной записи:
   *
   * сервисная (если есть только аккаунт VK ID) - значение true,
   *
   * полная (к аккаунту VK ID привязан профиль ВК) - значение false */
  is_service: boolean;
  /** почта для получения уведомлений */
  email: string;
  /**
   * код причины вызова exchangeSilentToken
   * @see https://dev.vk.com/ru/vkid/tokens/access-token#%D0%9F%D1%80%D0%B8%D1%87%D0%B8%D0%BD%D1%8B%20%D0%B2%D1%8B%D0%B7%D0%BE%D0%B2%D0%B0%20exchangeSilentAuthToken
   */
  source: number;
  /** приходит информация о том, что послужило поводом для вызова exchangeSilentToken */
  source_description: string;
};

/**
 * Ответ на запрос профиля ВК
 * @see https://dev.vk.com/ru/method/account.getProfileInfo
 */
export type VkProfileResponse = {
  id: string;
  /** URL аватарки */
  photo_200: string;
  first_name: string;
  last_name: string;
  maiden_name: string;
  screen_name?: string;
  /** 1 - ж, 2 - м, 0 - не указан */
  sex: 1 | 2 | 0;
  /** дата в формате ДД.М.ГГГГ */
  bdate: string;
  country: { id: number; title: string };
  city?: { id: number; title: string };
  phone: string;
};
