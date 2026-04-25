/**
 * OpenClaw API 封装
 */

const API_BASE_URL = (window.AppConfig ? window.AppConfig.API_BASE_URL : 'http://localhost:8080') + '/api';

/**
 * 下载API
 */
const DownloadAPI = {
  /**
   * 查询订单状态
   */
  async queryOrder(tradeNo) {
    const response = await fetch(`${API_BASE_URL}/downloads/order/${tradeNo}`);
    return response.json();
  }
};
