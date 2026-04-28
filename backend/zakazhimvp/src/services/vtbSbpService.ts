/**
 * Сервис для работы с VTB API для СБП (Система Быстрых Платежей)
 * 
 * ВАЖНО: Этот сервис должен использоваться только на backend!
 * Все API-вызовы должны проходить через ваш сервер для безопасности.
 */

export interface VtbSbpConfig {
  baseUrl: string; // https://vtb.rbsuat.com/payment/rest/ для sandbox
  userName: string;
  password: string;
  isProduction?: boolean;
}

export interface RegisterOrderRequest {
  amount: number; // сумма в копейках
  returnUrl: string;
  orderNumber: string;
  description?: string;
  language?: 'ru' | 'en';
}

export interface RegisterOrderResponse {
  orderId?: string;
  formUrl?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface CreateQrRequest {
  mdOrder: string; // orderId из register.do
  amount: number; // сумма в копейках
  currency?: number; // 643 для RUB
  orderDescription?: string;
  language?: 'ru' | 'en';
}

export interface CreateQrResponse {
  qrId?: string;
  qrUrl?: string;
  qrImage?: string; // Base64 изображение QR-кода
  errorCode?: string;
  errorMessage?: string;
}

export type SbpPaymentStatus = 
  | 'NEW' 
  | 'PAID' 
  | 'REJECTED_BY_USER' 
  | 'EXPIRED' 
  | 'CANCELLED';

export interface QrStatusResponse {
  status?: SbpPaymentStatus;
  amount?: number;
  currency?: number;
  orderNumber?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface RejectQrRequest {
  mdOrder: string;
  qrId: string;
}

export interface RejectQrResponse {
  rejected?: boolean;
  errorCode?: string;
  errorMessage?: string;
}

export interface OrderStatusResponse {
  OrderStatus?: number; // 0 - зарегистрирован, 2 - оплачен, 6 - отменен
  ErrorCode?: string;
  ErrorMessage?: string;
}

export class VtbSbpService {
  private config: VtbSbpConfig;

  constructor(config: VtbSbpConfig) {
    this.config = config;
  }

  /**
   * Регистрация заказа для оплаты через СБП
   */
  async registerOrder(request: RegisterOrderRequest): Promise<RegisterOrderResponse> {
    const params = new URLSearchParams({
      userName: this.config.userName,
      password: this.config.password,
      amount: request.amount.toString(),
      returnUrl: request.returnUrl,
      orderNumber: request.orderNumber,
    });

    if (request.description) {
      params.append('description', request.description);
    }
    if (request.language) {
      params.append('language', request.language);
    }

    const response = await fetch(`${this.config.baseUrl}register.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    return await response.json();
  }

  /**
   * Создание динамического QR-кода для СБП
   */
  async createQrCode(request: CreateQrRequest): Promise<CreateQrResponse> {
    const params = new URLSearchParams({
      userName: this.config.userName,
      password: this.config.password,
      mdOrder: request.mdOrder,
      amount: request.amount.toString(),
      currency: (request.currency || 643).toString(),
    });

    if (request.orderDescription) {
      params.append('orderDescription', request.orderDescription);
    }
    if (request.language) {
      params.append('language', request.language);
    }

    const response = await fetch(
      `${this.config.baseUrl}sbp/c2b/qr/dynamic/create.do`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    return await response.json();
  }

  /**
   * Получение статуса СБП-платежа
   */
  async getQrStatus(mdOrder: string, qrId: string): Promise<QrStatusResponse> {
    const params = new URLSearchParams({
      userName: this.config.userName,
      password: this.config.password,
      mdOrder,
      qrId,
    });

    const response = await fetch(
      `${this.config.baseUrl}sbp/c2b/qr/dynamic/status.do`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    return await response.json();
  }

  /**
   * Отклонение СБП-платежа
   */
  async rejectQr(request: RejectQrRequest): Promise<RejectQrResponse> {
    const params = new URLSearchParams({
      userName: this.config.userName,
      password: this.config.password,
      mdOrder: request.mdOrder,
      qrId: request.qrId,
    });

    const response = await fetch(
      `${this.config.baseUrl}sbp/c2b/qr/dynamic/reject.do`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    return await response.json();
  }

  /**
   * Получение статуса заказа
   */
  async getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    const params = new URLSearchParams({
      userName: this.config.userName,
      password: this.config.password,
      orderId,
    });

    const response = await fetch(`${this.config.baseUrl}getOrderStatus.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    return await response.json();
  }

  /**
   * Полный процесс создания платежа через СБП
   * Возвращает данные для отображения QR-кода
   */
  async createPayment(
    amount: number,
    orderNumber: string,
    returnUrl: string,
    description?: string
  ): Promise<{
    orderId: string;
    qrId: string;
    qrImage: string;
    qrUrl: string;
  }> {
    // 1. Регистрация заказа
    const orderResponse = await this.registerOrder({
      amount,
      returnUrl,
      orderNumber,
      description,
      language: 'ru',
    });

    if (orderResponse.errorCode || !orderResponse.orderId) {
      throw new Error(
        orderResponse.errorMessage || 'Ошибка регистрации заказа'
      );
    }

    // 2. Создание QR-кода
    const qrResponse = await this.createQrCode({
      mdOrder: orderResponse.orderId,
      amount,
      currency: 643,
      orderDescription: description,
      language: 'ru',
    });

    if (qrResponse.errorCode || !qrResponse.qrId || !qrResponse.qrImage) {
      throw new Error(qrResponse.errorMessage || 'Ошибка создания QR-кода');
    }

    return {
      orderId: orderResponse.orderId,
      qrId: qrResponse.qrId,
      qrImage: qrResponse.qrImage,
      qrUrl: qrResponse.qrUrl || '',
    };
  }

  /**
   * Проверка статуса платежа с интервалом
   * Возвращает промис, который резолвится когда платеж оплачен или отклонен
   */
  async pollPaymentStatus(
    mdOrder: string,
    qrId: string,
    options: {
      interval?: number; // интервал проверки в мс (по умолчанию 5000)
      timeout?: number; // таймаут в мс (по умолчанию 30 минут)
      onStatusUpdate?: (status: QrStatusResponse) => void;
    } = {}
  ): Promise<QrStatusResponse> {
    const { interval = 5000, timeout = 30 * 60 * 1000, onStatusUpdate } = options;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          // Проверка таймаута
          if (Date.now() - startTime > timeout) {
            reject(new Error('Превышено время ожидания платежа'));
            return;
          }

          const status = await this.getQrStatus(mdOrder, qrId);

          if (onStatusUpdate) {
            onStatusUpdate(status);
          }

          // Проверяем финальные статусы
          if (status.status === 'PAID') {
            resolve(status);
            return;
          }

          if (
            status.status === 'REJECTED_BY_USER' ||
            status.status === 'EXPIRED' ||
            status.status === 'CANCELLED'
          ) {
            reject(new Error(`Платеж ${status.status}`));
            return;
          }

          // Если статус еще не финальный, проверяем снова через интервал
          if (status.status === 'NEW' || !status.status) {
            setTimeout(checkStatus, interval);
          } else {
            // Неизвестный статус
            reject(new Error(`Неизвестный статус: ${status.status}`));
          }
        } catch (error) {
          reject(error);
        }
      };

      checkStatus();
    });
  }
}

/**
 * Создание экземпляра сервиса для sandbox окружения
 */
export function createVtbSbpSandboxService(
  userName: string,
  password: string
): VtbSbpService {
  return new VtbSbpService({
    baseUrl: 'https://vtb.rbsuat.com/payment/rest/',
    userName,
    password,
    isProduction: false,
  });
}

/**
 * Создание экземпляра сервиса для production окружения
 */
export function createVtbSbpProductionService(
  userName: string,
  password: string
): VtbSbpService {
  return new VtbSbpService({
    baseUrl: 'https://securepayments.sberbank.ru/payment/rest/',
    userName,
    password,
    isProduction: true,
  });
}





