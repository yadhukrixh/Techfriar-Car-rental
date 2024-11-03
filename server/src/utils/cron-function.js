// src/cron/orderCron.js
import cron from 'node-cron';
import { CarRepository } from '../modules/user/repositories/car-repo.js';
import { AdminOrderControllers } from '../modules/admin/controllers/orders-controllers.js';

class OrderCleanupCron {
  constructor() {
    this.job = null;
  }

  /**
   * Initializes and schedules the cron job to run every 1 minute.
   */
  start() {
    if (!this.job) {
      this.job = cron.schedule('* * * * *', async () => {
        await CarRepository.cancelPendingOrders();
        await AdminOrderControllers.updateOrderStatuses()
      });
    }
  }

  /**
   * Stops the cron job if it is currently running.
   */
  stop() {
    if (this.job) {
      this.job.stop();
      console.log('Order cleanup cron job stopped');
    } else {
      console.log('Order cleanup cron job is not running');
    }
  }
}

export default new OrderCleanupCron();
