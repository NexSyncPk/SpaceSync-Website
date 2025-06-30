const BaseController = require('./BaseController');
const { Event, Consultation, HeroSection, TeamSection, TestimonialSection } = require('../models');
const { Op } = require('sequelize');

class AnalyticsController extends BaseController {
  // Dashboard Stats
  async getDashboardStats(req, res) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    // Get total counts
    const totalEvents = await Event.count({ where: { isDeleted: false } });
    const totalConsultations = await Consultation.count({ where: { isDeleted: false } });
    const activeEvents = await Event.count({ 
      where: { 
        isDeleted: false, 
        eventDate: { [Op.gte]: now }
      } 
    });
    const upcomingEvents = await Event.count({ 
      where: { 
        isDeleted: false, 
        eventDate: { [Op.between]: [now, new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000))] }
      } 
    });

    // Get recent activity data
    const recentEvents = await Event.findAll({
      where: { 
        isDeleted: false,
        createdAt: { [Op.gte]: thirtyDaysAgo }
      },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const recentConsultations = await Consultation.findAll({
      where: { 
        isDeleted: false,
        createdAt: { [Op.gte]: thirtyDaysAgo }
      },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Mock some engagement stats (you can implement real analytics later)
    const stats = {
      overview: {
        totalEvents,
        totalConsultations,
        activeEvents,
        upcomingEvents,
        totalPageViews: Math.floor(Math.random() * 10000) + 5000, // Mock data
        responseRate: 85 + Math.floor(Math.random() * 10), // Mock data
      },
      growth: {
        eventsGrowth: recentEvents.length > 0 ? '+12%' : '0%',
        consultationsGrowth: recentConsultations.length > 0 ? '+8%' : '0%',
        pageViewsGrowth: '+18%', // Mock data
        engagementGrowth: '+5%', // Mock data
      },
      recentActivity: [
        ...recentEvents.map(event => ({
          action: `New event created: ${event.title}`,
          time: this.getTimeAgo(event.createdAt),
          type: 'event'
        })),
        ...recentConsultations.map(consultation => ({
          action: `New consultation added: ${consultation.title}`,
          time: this.getTimeAgo(consultation.createdAt), 
          type: 'consultation'
        }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
    };

    return this.sendResponse(res, 200, 'Dashboard stats retrieved successfully', stats);
  }

  // Event Analytics
  async getEventAnalytics(req, res) {
    const events = await Event.findAll({
      where: { isDeleted: false },
      attributes: ['id', 'title', 'eventType', 'category', 'eventDate', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    const analytics = {
      totalEvents: events.length,
      eventsByType: this.groupByField(events, 'eventType'),
      eventsByCategory: this.groupByField(events, 'category'),
      upcomingEvents: events.filter(e => new Date(e.eventDate) > new Date()).length,
      pastEvents: events.filter(e => new Date(e.eventDate) <= new Date()).length,
      recentEvents: events.slice(0, 10)
    };

    return this.sendResponse(res, 200, 'Event analytics retrieved successfully', analytics);
  }

  // Consultation Analytics
  async getConsultationAnalytics(req, res) {
    const consultations = await Consultation.findAll({
      where: { isDeleted: false },
      attributes: ['id', 'title', 'consultationType', 'expertName', 'rating', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    const analytics = {
      totalConsultations: consultations.length,
      consultationsByType: this.groupByField(consultations, 'consultationType'),
      consultationsByExpert: this.groupByField(consultations, 'expertName'),
      averageRating: this.calculateAverageRating(consultations),
      topRatedConsultations: consultations
        .filter(c => c.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10),
      recentConsultations: consultations.slice(0, 10)
    };

    return this.sendResponse(res, 200, 'Consultation analytics retrieved successfully', analytics);
  }

  // Traffic Analytics (Mock data - implement with real analytics service)
  async getTrafficAnalytics(req, res) {
    const mockTrafficData = {
      totalVisitors: Math.floor(Math.random() * 50000) + 10000,
      uniqueVisitors: Math.floor(Math.random() * 30000) + 5000,
      pageViews: Math.floor(Math.random() * 100000) + 20000,
      bounceRate: (Math.random() * 30 + 20).toFixed(1) + '%',
      sessionDuration: (Math.random() * 5 + 2).toFixed(1) + ' minutes',
      topPages: [
        { page: '/home', views: Math.floor(Math.random() * 5000) + 1000 },
        { page: '/events', views: Math.floor(Math.random() * 3000) + 500 },
        { page: '/consultations', views: Math.floor(Math.random() * 2000) + 300 },
        { page: '/about', views: Math.floor(Math.random() * 1500) + 200 },
        { page: '/contact', views: Math.floor(Math.random() * 1000) + 100 }
      ],
      dailyStats: this.generateDailyStats(30)
    };

    return this.sendResponse(res, 200, 'Traffic analytics retrieved successfully', mockTrafficData);
  }

  // User Engagement Analytics (Mock data)
  async getUserEngagementAnalytics(req, res) {
    const mockEngagementData = {
      totalEngagements: Math.floor(Math.random() * 10000) + 2000,
      eventRegistrations: Math.floor(Math.random() * 500) + 100,
      consultationBookings: Math.floor(Math.random() * 300) + 50,
      contactFormSubmissions: Math.floor(Math.random() * 200) + 30,
      newsletterSignups: Math.floor(Math.random() * 1000) + 200,
      socialMediaInteractions: Math.floor(Math.random() * 2000) + 500,
      engagementByChannel: {
        direct: Math.floor(Math.random() * 40) + 20,
        search: Math.floor(Math.random() * 30) + 15,
        social: Math.floor(Math.random() * 25) + 10,
        referral: Math.floor(Math.random() * 20) + 5
      }
    };

    return this.sendResponse(res, 200, 'User engagement analytics retrieved successfully', mockEngagementData);
  }

  // Helper methods
  groupByField(items, field) {
    return items.reduce((acc, item) => {
      const key = item[field] || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  calculateAverageRating(consultations) {
    const ratingsWithValues = consultations.filter(c => c.rating && c.rating > 0);
    if (ratingsWithValues.length === 0) return 0;
    
    const sum = ratingsWithValues.reduce((acc, c) => acc + c.rating, 0);
    return (sum / ratingsWithValues.length).toFixed(1);
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  generateDailyStats(days) {
    const stats = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      stats.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 1000) + 100,
        visitors: Math.floor(Math.random() * 500) + 50,
        engagements: Math.floor(Math.random() * 100) + 10
      });
    }
    
    return stats;
  }
}

module.exports = AnalyticsController;
