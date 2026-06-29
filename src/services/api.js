/**
 * NexusERP Simulated Mock Service API
 * Simulates server network delays for dashboard analytics fetching, 
 * CRM deal staging, inventory operations, and database synchronization.
 */

const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  /**
   * Simulates fetching latest performance analytics reports
   */
  async getDashboardAnalytics() {
    await delay(500);
    return {
      revenueGrowth: 18.4,
      salesConversion: 3.42,
      activeQuotes: 12,
      systemUptime: '99.98%'
    };
  },

  /**
   * Simulates sync request to active warehouse inventory systems
   */
  async syncWarehouseStock() {
    await delay(1200);
    return {
      status: 'success',
      syncedWarehouses: ['Warehouse Alpha', 'Warehouse Beta'],
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Simulates sending invoice receipt PDF email
   */
  async emailInvoiceReceipt(orderId, customerEmail) {
    await delay(800);
    return {
      status: 'sent',
      message: `Invoice receipt for order ${orderId} successfully dispatched to ${customerEmail}.`
    };
  }
};
