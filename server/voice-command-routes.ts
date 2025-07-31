import express from 'express';
import { storage } from './storage.js';

const router = express.Router();

// Voice Query Endpoint - Handle data queries from voice commands
router.post('/voice-query', async (req, res) => {
  try {
    const { queryType } = req.body;
    
    let result: any = {};
    
    switch (queryType) {
      case 'production_stats':
        const orders = await storage.getOrders();
        const completedOrders = orders.filter(order => order.status === 'completed');
        const pendingOrders = orders.filter(order => order.status === 'pending');
        const processingOrders = orders.filter(order => order.status === 'processing');
        
        result = {
          totalOrders: orders.length,
          completedOrders: completedOrders.length,
          pendingOrders: pendingOrders.length,
          processingOrders: processingOrders.length,
          completionRate: orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0,
          response: `Production Statistics: ${orders.length} total orders, ${completedOrders.length} completed (${orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0}% completion rate), ${pendingOrders.length} pending, ${processingOrders.length} in progress.`
        };
        break;
        
      case 'orders_today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await storage.getOrders();
        const todaysOrders = todayOrders.filter(order => {
          const orderDate = new Date(order.date);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        });
        
        result = {
          count: todaysOrders.length,
          orders: todaysOrders.slice(0, 5), // Return first 5 orders
          response: `Today's Orders: ${todaysOrders.length} orders created today. ${todaysOrders.length > 0 ? `Recent orders include: ${todaysOrders.slice(0, 3).map(o => `Order #${o.id}`).join(', ')}.` : 'No orders created today yet.'}`
        };
        break;
        
      case 'quality_issues':
        try {
          const qualityChecks = await storage.getQualityChecks?.() || [];
          const failedChecks = qualityChecks.filter(check => check.result === 'fail');
          
          result = {
            totalIssues: failedChecks.length,
            issues: failedChecks.slice(0, 5),
            response: `Quality Status: ${failedChecks.length} quality issues found. ${failedChecks.length > 0 ? 'Immediate attention required for failed quality checks.' : 'All quality checks are passing.'}`
          };
        } catch (error) {
          result = {
            totalIssues: 0,
            issues: [],
            response: 'Quality data is not available at the moment.'
          };
        }
        break;
        
      case 'customer_info':
        const customers = await storage.getCustomers();
        result = {
          totalCustomers: customers.length,
          recentCustomers: customers.slice(0, 5),
          response: `Customer Database: ${customers.length} customers in the system. ${customers.length > 0 ? `Recent customers include: ${customers.slice(0, 3).map(c => c.name).join(', ')}.` : 'No customers found.'}`
        };
        break;
        
      default:
        result = {
          error: 'Unknown query type',
          response: 'I cannot process that type of data query. Please try asking for production stats, today\'s orders, quality issues, or customer information.'
        };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Voice query error:', error);
    res.status(500).json({
      error: 'Failed to process voice query',
      response: 'Sorry, I encountered an error processing your request. Please try again.'
    });
  }
});

// Voice Create Endpoint - Handle record creation from voice commands
router.post('/voice-create', async (req, res) => {
  try {
    const { recordType, recordData } = req.body;
    
    let result: any = {};
    
    switch (recordType) {
      case 'customer':
        const customerCode = `VOICE_${Date.now()}`;
        const customerData = {
          id: customerCode,
          name: recordData.name || recordData.extracted || 'Voice Created Customer',
          code: customerCode,
          nameAr: null,
          userId: null,
          plateDrawerCode: null
        };
        
        const newCustomer = await storage.createCustomer(customerData);
        result = {
          success: true,
          customer: newCustomer,
          response: `Successfully created customer "${customerData.name}". Customer ID: ${newCustomer.id}.`
        };
        break;
        
      case 'order':
        const orderData = {
          customerId: recordData.customerId || 1, // Default to first customer if not specified
          status: 'pending',
          note: recordData.note || 'Created via voice command',
          createdAt: new Date().toISOString()
        };
        
        const newOrder = await storage.createOrder(orderData);
        result = {
          success: true,
          order: newOrder,
          response: `Successfully created order #${newOrder.id}. Status: pending.`
        };
        break;
        
      default:
        result = {
          error: 'Unknown record type',
          response: 'I can only create customers and orders via voice commands.'
        };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Voice create error:', error);
    res.status(500).json({
      error: 'Failed to create record',
      response: 'Sorry, I encountered an error creating the record. Please try again.'
    });
  }
});

// Voice Update Endpoint - Handle record updates from voice commands
router.post('/voice-update', async (req, res) => {
  try {
    const { recordType, recordId, updates } = req.body;
    
    let result: any = {};
    
    switch (recordType) {
      case 'order':
        const orderId = parseInt(recordId);
        if (isNaN(orderId)) {
          throw new Error('Invalid order ID');
        }
        
        const updatedOrder = await storage.updateOrder(orderId, updates);
        result = {
          success: true,
          order: updatedOrder,
          response: `Successfully updated order #${orderId}. Status: ${updates.status || 'updated'}.`
        };
        break;
        
      case 'customer':
        if (!recordId || typeof recordId !== 'string') {
          throw new Error('Invalid customer ID');
        }
        
        const updatedCustomer = await storage.updateCustomer(recordId, updates);
        result = {
          success: true,
          customer: updatedCustomer,
          response: `Successfully updated customer #${recordId}.`
        };
        break;
        
      default:
        result = {
          error: 'Unknown record type',
          response: 'I can only update customers and orders via voice commands.'
        };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Voice update error:', error);
    res.status(500).json({
      error: 'Failed to update record',
      response: 'Sorry, I encountered an error updating the record. Please try again.'
    });
  }
});

// Voice Command Help Endpoint
router.get('/voice-help', (req, res) => {
  const commands = {
    navigation: [
      'Go to dashboard',
      'Open orders',
      'Show production workflow',
      'Navigate to quality control'
    ],
    data: [
      'Show production stats',
      'Orders for today',
      'Show quality issues',
      'Customer information'
    ],
    actions: [
      'Create new order',
      'Add new customer',
      'Complete order [number]',
      'Mark order as completed'
    ],
    system: [
      'Help / Show commands',
      'Switch language',
      'Change to Arabic/English'
    ]
  };
  
  res.json({
    success: true,
    commands,
    response: 'Voice commands are organized into Navigation, Data queries, Actions, and System commands. You can say things like "Go to dashboard", "Show production stats", "Create new order", or "Help" for assistance.'
  });
});

export default router;