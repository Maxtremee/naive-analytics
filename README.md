# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

# Naive Analytics

A comprehensive web analytics platform built with NestJS, TypeScript, and React. Track user behavior, performance metrics, and engagement data with real-time insights.

## 🚀 Features

### 📊 Core Analytics
- **Session Tracking**: Monitor user sessions with detailed path analysis
- **Page Views**: Track page views with time-on-page metrics
- **Bounce Rate**: Calculate bounce rates and engagement metrics
- **Referrer Analysis**: Understand traffic sources and attribution

### 📱 Device & Browser Analytics
- **Device Breakdown**: Desktop, mobile, and tablet usage statistics
- **Browser Analytics**: Chrome, Firefox, Safari, Edge, and Opera usage
- **Operating System**: Windows, macOS, Linux, Android, iOS statistics
- **User Agent Parsing**: Automatic device and browser detection

### 🌍 Geographic Analytics
- **Country Analytics**: Top countries by traffic volume
- **City Analytics**: Geographic distribution of users
- **IP Geolocation**: Automatic location detection (placeholder implementation)

### 📄 Page Analytics
- **Top Pages**: Most visited pages with engagement metrics
- **Page Flow**: User journey analysis and navigation patterns
- **Time on Page**: Average time spent on each page
- **Scroll Depth**: User engagement through scroll tracking
- **Bounce Rate by Page**: Page-specific bounce rate analysis

### ⏰ Time-based Analytics
- **Hourly Distribution**: Traffic patterns throughout the day
- **Daily Distribution**: Weekly traffic patterns
- **Real-time Metrics**: Live user activity and current sessions
- **Historical Trends**: Time-series data analysis

### ⚡ Performance Analytics
- **Page Load Times**: Average load times per page
- **Slow Pages**: Identification of performance bottlenecks
- **Resource Loading**: Track resource load performance
- **Performance Events**: Monitor Core Web Vitals

### 🎯 Engagement Metrics
- **Click Tracking**: User interaction analysis
- **Scroll Depth**: Content engagement measurement
- **Form Interactions**: Form start and completion tracking
- **Video Analytics**: Play, pause, and completion tracking
- **Search Analytics**: Internal search behavior

### 🔄 Real-time Analytics
- **Active Users**: Current users on the site
- **Live Sessions**: Real-time session monitoring
- **Recent Activity**: Live user activity feed
- **Real-time Updates**: Auto-refreshing metrics

### 🛒 Conversion Tracking
- **Goal Completions**: Track conversion events
- **E-commerce**: Add to cart and purchase tracking
- **User Registration**: Sign-up and login tracking
- **Custom Events**: Flexible event tracking system

## 🏗️ Architecture

### Backend (NestJS)
```
apps/server/
├── src/
│   ├── modules/
│   │   ├── metrics/          # Analytics endpoints
│   │   ├── event/           # Event tracking
│   │   ├── session/         # Session management
│   │   └── website/         # Website configuration
│   ├── db/
│   │   └── entities/        # Database models
│   └── common/
│       └── events/          # Event handling
```

### Frontend (React)
```
apps/example/
├── src/
│   ├── App.tsx             # Main dashboard
│   ├── App.css             # Dashboard styling
│   └── main.tsx            # Application entry
```

## 📈 API Endpoints

### Core Metrics
- `GET /metrics/:apiKey` - Comprehensive analytics data
- `GET /metrics/:apiKey/referrers` - Traffic source analysis

### Device Analytics
- `GET /metrics/:apiKey/device-analytics` - Device and browser breakdown

### Geographic Analytics
- `GET /metrics/:apiKey/geographic-analytics` - Location-based analytics

### Page Analytics
- `GET /metrics/:apiKey/page-analytics` - Page performance and flow

### Real-time Analytics
- `GET /metrics/:apiKey/real-time` - Live user activity

## 🎯 Event Types

The system supports comprehensive event tracking:

### User Interactions
- `CLICK` - General click events
- `CLICK_LINK` - Link click tracking
- `SCROLL` - Scroll depth tracking
- `MOUSE_MOVE` - Mouse movement patterns
- `KEYSTROKE` - Keyboard interaction tracking

### Page Events
- `VIEW` - Page view tracking
- `FORM_START` - Form interaction start
- `FORM_SUBMIT` - Form submission
- `EXIT_INTENT` - User exit detection

### Media Events
- `VIDEO_PLAY` - Video playback start
- `VIDEO_PAUSE` - Video pause events
- `VIDEO_COMPLETE` - Video completion

### E-commerce Events
- `ADD_TO_CART` - Shopping cart additions
- `PURCHASE` - Purchase completions
- `SEARCH` - Internal search queries

### User Actions
- `SIGN_UP` - User registration
- `LOGIN` - User login events
- `DOWNLOAD` - File downloads
- `SHARE` - Content sharing
- `BOOKMARK` - Page bookmarks
- `PRINT` - Print actions
- `COPY` - Content copying

### Performance Events
- `PERFORMANCE` - Performance metrics
- `RESOURCE_LOAD` - Resource loading times
- `API_CALL` - API request tracking
- `ERROR` - Error tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd naive-analytics
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   cp local.yaml.example local.yaml
   # Edit local.yaml with your database configuration
   ```

4. **Start the development servers**
   ```bash
   pnpm dev
   ```

### Usage

1. **Create a website** in the system
2. **Get your API key** from the website configuration
3. **Implement tracking** on your website using the provided script
4. **View analytics** in the dashboard

## 📊 Dashboard Features

### Overview Section
- Total sessions and active users
- Average session duration
- Bounce rate and engagement metrics
- Page load performance

### Device Analytics
- Device type breakdown (desktop/mobile/tablet)
- Browser usage statistics
- Operating system distribution

### Geographic Analytics
- Top countries by traffic
- City-level analytics
- Geographic heat maps

### Page Analytics
- Most visited pages
- Page flow analysis
- Time on page metrics
- Page-specific bounce rates

### Real-time Monitoring
- Live user count
- Current active sessions
- Recent activity feed
- Real-time updates

## 🔧 Configuration

### Database Configuration
```yaml
# local.yaml
database:
  host: localhost
  port: 5432
  username: postgres
  password: password
  database: naive_analytics
```

### API Configuration
```typescript
// Client configuration
const client = new AnalyticsClient({
  apiKey: 'your-api-key',
  endpoint: 'http://localhost:3000',
  batchSize: 10,
  flushInterval: 5000
});
```

## 📈 Metrics Calculation

### Engagement Rate
```
Engagement Rate = (Sessions > 30 seconds) / Total Sessions × 100
```

### Bounce Rate
```
Bounce Rate = Single-page Sessions / Total Sessions × 100
```

### Average Session Duration
```
Avg Duration = Total Duration / Total Sessions
```

### Page Flow Analysis
```
Flow Count = Users navigating from Page A to Page B
```

## 🔒 Privacy & Compliance

- **GDPR Compliant**: Built with privacy-first design
- **Data Anonymization**: IP addresses are anonymized
- **Cookie Consent**: Respects user privacy preferences
- **Data Retention**: Configurable data retention policies

## 🛠️ Development

### Adding New Metrics

1. **Define the metric** in the metrics service
2. **Add the endpoint** in the metrics controller
3. **Update the frontend** to display the new metric
4. **Add tests** for the new functionality

### Custom Event Tracking

```typescript
// Track custom events
client.track('CUSTOM_EVENT', {
  category: 'engagement',
  action: 'button_click',
  label: 'signup_button',
  value: 1
});
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the examples

---

**Built with ❤️ using NestJS, TypeScript, and React**
