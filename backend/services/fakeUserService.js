const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Service to create fake users with natural behavior
 */
class FakeUserService {
  constructor() {
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
  }

  /**
   * Generate random fake user data
   */
  generateFakeUserData() {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'James', 'Mary'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomNum = Math.floor(Math.random() * 10000);
    
    return {
      username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNum}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@example.com`,
      firstName,
      lastName,
      password: this.generateRandomPassword(),
      phone: this.generatePhoneNumber(),
      age: Math.floor(Math.random() * 50) + 18,
      address: `${Math.floor(Math.random() * 9999)} Main St`,
      city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
      country: 'United States',
      zipCode: String(Math.floor(Math.random() * 90000) + 10000)
    };
  }

  generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  generatePhoneNumber() {
    return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  }

  /**
   * Get random user agent
   */
  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Extract links from HTML
   */
  extractLinks(html, baseUrl) {
    const $ = cheerio.load(html);
    const links = new Set();

    $('a[href]').each((i, elem) => {
      try {
        const href = $(elem).attr('href');
        if (href) {
          const url = new URL(href, baseUrl);
          // Only include same-origin links
          if (url.origin === new URL(baseUrl).origin) {
            links.add(url.href);
          }
        }
      } catch (e) {
        // Invalid URL, skip
      }
    });

    return Array.from(links);
  }

  /**
   * Simulate natural user behavior by visiting random pages
   */
  async simulateNaturalBehavior(baseUrl) {
    const visitedPages = [];
    const startTime = Date.now();
    
    try {
      // Visit the main page first
      const response = await axios.get(baseUrl, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 10000,
        maxRedirects: 5
      });

      visitedPages.push(baseUrl);

      // Extract links from the page
      const links = this.extractLinks(response.data, baseUrl);

      // Visit 2-5 random subpages
      const pagesToVisit = Math.min(links.length, Math.floor(Math.random() * 4) + 2);
      const selectedLinks = this.shuffleArray(links).slice(0, pagesToVisit);

      for (const link of selectedLinks) {
        // Random delay between page visits (500ms - 3000ms)
        await this.sleep(Math.random() * 2500 + 500);

        try {
          await axios.get(link, {
            headers: {
              'User-Agent': this.getRandomUserAgent(),
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Referer': baseUrl
            },
            timeout: 10000,
            maxRedirects: 5
          });

          visitedPages.push(link);
        } catch (error) {
          // Ignore individual page errors
          console.log(`Failed to visit ${link}: ${error.message}`);
        }
      }

    } catch (error) {
      console.log(`Error during natural behavior simulation: ${error.message}`);
    }

    return {
      pagesVisited: visitedPages.length,
      duration: Date.now() - startTime,
      pages: visitedPages
    };
  }

  /**
   * Create a fake user with natural behavior
   */
  async createFakeUser(targetUrl) {
    const userData = this.generateFakeUserData();
    
    // Simulate natural browsing behavior
    const behaviorResult = await this.simulateNaturalBehavior(targetUrl);

    // In a real scenario, this would submit registration forms
    // For this demo, we're simulating the user creation
    
    return {
      user: userData,
      pagesVisited: behaviorResult.pagesVisited,
      duration: behaviorResult.duration,
      timestamp: new Date().toISOString()
    };
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = FakeUserService;
