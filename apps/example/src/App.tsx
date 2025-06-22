import { useState, useEffect } from "react";
import "./App.css";

interface Metrics {
	// Basic metrics
	averageDuration: number;
	averagePages: number;
	averageUniquePages: number;
	totalSessions: number;
	totalDuration: number;
	totalPages: number;
	totalUniquePages: number;
	totalBounceRate: number;

	// Engagement metrics
	averageScrollDepth: number;
	averageTimeOnPage: number;
	totalClicks: number;
	totalViews: number;
	engagementRate: number;

	// Device analytics
	deviceBreakdown: {
		desktop: number;
		mobile: number;
		tablet: number;
	};
	browserBreakdown: Array<{
		browser: string;
		count: number;
		percentage: number;
	}>;

	// Geographic analytics
	topCountries: Array<{
		country: string;
		count: number;
		percentage: number;
	}>;

	// Page analytics
	topPages: Array<{
		page: string;
		views: number;
		uniqueViews: number;
		averageTimeOnPage: number;
		bounceRate: number;
	}>;

	// Time-based analytics
	hourlyDistribution: Array<{
		hour: number;
		sessions: number;
	}>;
	dailyDistribution: Array<{
		day: string;
		sessions: number;
	}>;

	// Real-time metrics
	activeUsers: number;
	currentSessions: number;

	// Performance metrics
	averagePageLoadTime: number;
	slowPages: Array<{
		page: string;
		avgLoadTime: number;
	}>;

	// Conversion metrics
	conversionRate: number;
	goalCompletions: number;
}

interface Referrers {
	referrer: string;
	count: number;
	percentage: number;
}

interface DeviceAnalytics {
	deviceBreakdown: {
		desktop: number;
		mobile: number;
		tablet: number;
	};
	browserBreakdown: Array<{
		browser: string;
		count: number;
		percentage: number;
	}>;
	osBreakdown: Array<{
		os: string;
		count: number;
		percentage: number;
	}>;
}

interface GeographicAnalytics {
	topCountries: Array<{
		country: string;
		count: number;
		percentage: number;
	}>;
	topCities: Array<{
		city: string;
		country: string;
		count: number;
		percentage: number;
	}>;
}

interface PageAnalytics {
	topPages: Array<{
		page: string;
		views: number;
		uniqueViews: number;
		averageTimeOnPage: number;
		bounceRate: number;
		avgScrollDepth: number;
	}>;
	pageFlow: Array<{
		from: string;
		to: string;
		count: number;
	}>;
}

interface RealTimeMetrics {
	activeUsers: number;
	currentSessions: number;
	recentActivity: Array<{
		timestamp: Date;
		action: string;
		page: string;
		userAgent: string;
	}>;
}

const API_KEY = import.meta.env.VITE_ANALYTICS_API_KEY;
const baseUrl = import.meta.env.VITE_ANALYTICS_URL;

function App() {
	const [metrics, setMetrics] = useState<Metrics | null>(null);
	const [referrers, setReferrers] = useState<Referrers[]>([]);
	const [deviceAnalytics, setDeviceAnalytics] =
		useState<DeviceAnalytics | null>(null);
	const [geographicAnalytics, setGeographicAnalytics] =
		useState<GeographicAnalytics | null>(null);
	const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics | null>(
		null,
	);
	const [realTimeMetrics, setRealTimeMetrics] =
		useState<RealTimeMetrics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch all metrics in parallel
				const [
					metricsRes,
					referrersRes,
					deviceRes,
					geoRes,
					pageRes,
					realTimeRes,
				] = await Promise.all([
					fetch(`${baseUrl}/metrics/${API_KEY}`),
					fetch(`${baseUrl}/metrics/${API_KEY}/referrers`),
					fetch(`${baseUrl}/metrics/${API_KEY}/device-analytics`),
					fetch(`${baseUrl}/metrics/${API_KEY}/geographic-analytics`),
					fetch(`${baseUrl}/metrics/${API_KEY}/page-analytics`),
					fetch(`${baseUrl}/metrics/${API_KEY}/real-time`),
				]);

				if (
					!metricsRes.ok ||
					!referrersRes.ok ||
					!deviceRes.ok ||
					!geoRes.ok ||
					!pageRes.ok ||
					!realTimeRes.ok
				) {
					throw new Error("Failed to fetch metrics");
				}

				const [
					metricsData,
					referrersData,
					deviceData,
					geoData,
					pageData,
					realTimeData,
				] = await Promise.all([
					metricsRes.json(),
					referrersRes.json(),
					deviceRes.json(),
					geoRes.json(),
					pageRes.json(),
					realTimeRes.json(),
				]);

				setMetrics(metricsData);
				setReferrers(referrersData);
				setDeviceAnalytics(deviceData);
				setGeographicAnalytics(geoData);
				setPageAnalytics(pageData);
				setRealTimeMetrics(realTimeData);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		// Refresh real-time metrics every 30 seconds
		const realTimeInterval = setInterval(async () => {
			try {
				const res = await fetch(`${baseUrl}/metrics/${API_KEY}/real-time`);
				if (res.ok) {
					const data = await res.json();
					setRealTimeMetrics(data);
				}
			} catch (err) {
				console.error("Failed to refresh real-time metrics:", err);
			}
		}, 30000);

		return () => clearInterval(realTimeInterval);
	}, [API_KEY]);

	if (loading) {
		return (
			<div className="app">
				<div className="loading">Loading analytics dashboard...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="app">
				<div className="error">Error: {error}</div>
			</div>
		);
	}

	if (!metrics) {
		return (
			<div className="app">
				<div className="error">No metrics data available</div>
			</div>
		);
	}

	return (
		<div className="app">
			<header className="header">
				<h1>📊 Analytics Dashboard</h1>
				<div className="real-time-indicator">🟢 Live Data</div>
			</header>

			<div className="dashboard">
				{/* Overview Cards */}
				<section className="overview-section">
					<h2>📈 Overview</h2>
					<div className="metrics-grid">
						<div className="metric-card">
							<h3>Total Sessions</h3>
							<div className="metric-value">
								{metrics.totalSessions.toLocaleString()}
							</div>
						</div>
						<div className="metric-card">
							<h3>Active Users</h3>
							<div className="metric-value">
								{realTimeMetrics?.activeUsers || 0}
							</div>
						</div>
						<div className="metric-card">
							<h3>Avg Duration</h3>
							<div className="metric-value">
								{Math.round(metrics.averageDuration)}s
							</div>
						</div>
						<div className="metric-card">
							<h3>Bounce Rate</h3>
							<div className="metric-value">
								{(metrics.totalBounceRate * 100).toFixed(1)}%
							</div>
						</div>
						<div className="metric-card">
							<h3>Engagement Rate</h3>
							<div className="metric-value">
								{metrics.engagementRate.toFixed(1)}%
							</div>
						</div>
						<div className="metric-card">
							<h3>Avg Page Load</h3>
							<div className="metric-value">
								{Math.round(metrics.averagePageLoadTime)}ms
							</div>
						</div>
					</div>
				</section>

				{/* Device Analytics */}
				{deviceAnalytics && (
					<section className="analytics-section">
						<h2>📱 Device Analytics</h2>
						<div className="analytics-grid">
							<div className="chart-card">
								<h3>Device Breakdown</h3>
								<div className="device-breakdown">
									<div className="device-item">
										<span>Desktop</span>
										<div className="progress-bar">
											<div
												className="progress-fill"
												style={{
													width: `${(deviceAnalytics.deviceBreakdown.desktop / metrics.totalSessions) * 100}%`,
												}}
											></div>
										</div>
										<span>{deviceAnalytics.deviceBreakdown.desktop}</span>
									</div>
									<div className="device-item">
										<span>Mobile</span>
										<div className="progress-bar">
											<div
												className="progress-fill"
												style={{
													width: `${(deviceAnalytics.deviceBreakdown.mobile / metrics.totalSessions) * 100}%`,
												}}
											></div>
										</div>
										<span>{deviceAnalytics.deviceBreakdown.mobile}</span>
									</div>
									<div className="device-item">
										<span>Tablet</span>
										<div className="progress-bar">
											<div
												className="progress-fill"
												style={{
													width: `${(deviceAnalytics.deviceBreakdown.tablet / metrics.totalSessions) * 100}%`,
												}}
											></div>
										</div>
										<span>{deviceAnalytics.deviceBreakdown.tablet}</span>
									</div>
								</div>
							</div>
							<div className="chart-card">
								<h3>Top Browsers</h3>
								<div className="browser-list">
									{deviceAnalytics.browserBreakdown
										.slice(0, 5)
										.map((browser, index) => (
											<div key={index} className="browser-item">
												<span>{browser.browser}</span>
												<span>
													{browser.count} ({browser.percentage.toFixed(1)}%)
												</span>
											</div>
										))}
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Geographic Analytics */}
				{geographicAnalytics && (
					<section className="analytics-section">
						<h2>🌍 Geographic Analytics</h2>
						<div className="analytics-grid">
							<div className="chart-card">
								<h3>Top Countries</h3>
								<div className="country-list">
									{geographicAnalytics.topCountries
										.slice(0, 5)
										.map((country, index) => (
											<div key={index} className="country-item">
												<span>{country.country}</span>
												<span>
													{country.count} ({country.percentage.toFixed(1)}%)
												</span>
											</div>
										))}
								</div>
							</div>
							<div className="chart-card">
								<h3>Top Cities</h3>
								<div className="city-list">
									{geographicAnalytics.topCities
										.slice(0, 5)
										.map((city, index) => (
											<div key={index} className="city-item">
												<span>
													{city.city}, {city.country}
												</span>
												<span>
													{city.count} ({city.percentage.toFixed(1)}%)
												</span>
											</div>
										))}
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Page Analytics */}
				{pageAnalytics && (
					<section className="analytics-section">
						<h2>📄 Page Analytics</h2>
						<div className="analytics-grid">
							<div className="chart-card">
								<h3>Top Pages</h3>
								<div className="page-list">
									{pageAnalytics.topPages.slice(0, 5).map((page, index) => (
										<div key={index} className="page-item">
											<div className="page-info">
												<span className="page-url">{page.page}</span>
												<span className="page-stats">
													{page.views} views •{" "}
													{page.averageTimeOnPage.toFixed(1)}s avg •{" "}
													{page.bounceRate.toFixed(1)}% bounce
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className="chart-card">
								<h3>Page Flow</h3>
								<div className="flow-list">
									{pageAnalytics.pageFlow.slice(0, 5).map((flow, index) => (
										<div key={index} className="flow-item">
											<span>
												{flow.from} → {flow.to}
											</span>
											<span>{flow.count} users</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Referrers */}
				{referrers.length > 0 && (
					<section className="analytics-section">
						<h2>🔗 Top Referrers</h2>
						<div className="referrers-list">
							{referrers.slice(0, 10).map((referrer, index) => (
								<div key={index} className="referrer-item">
									<span className="referrer-url">{referrer.referrer}</span>
									<span>
										{referrer.count} ({referrer.percentage.toFixed(1)}%)
									</span>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Time-based Analytics */}
				<section className="analytics-section">
					<h2>⏰ Time-based Analytics</h2>
					<div className="analytics-grid">
						<div className="chart-card">
							<h3>Hourly Distribution</h3>
							<div className="hourly-chart">
								{metrics.hourlyDistribution.map((hour, index) => (
									<div key={index} className="hour-bar">
										<div
											className="hour-fill"
											style={{
												height: `${(hour.sessions / Math.max(...metrics.hourlyDistribution.map((h) => h.sessions))) * 100}%`,
											}}
										></div>
										<span className="hour-label">{hour.hour}:00</span>
									</div>
								))}
							</div>
						</div>
						<div className="chart-card">
							<h3>Daily Distribution</h3>
							<div className="daily-list">
								{metrics.dailyDistribution.map((day, index) => (
									<div key={index} className="day-item">
										<span>{day.day}</span>
										<span>{day.sessions} sessions</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Performance Metrics */}
				{metrics.slowPages.length > 0 && (
					<section className="analytics-section">
						<h2>⚡ Performance Issues</h2>
						<div className="performance-list">
							{metrics.slowPages.map((page, index) => (
								<div key={index} className="performance-item">
									<span className="page-url">{page.page}</span>
									<span className="load-time">
										{Math.round(page.avgLoadTime)}ms avg
									</span>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Real-time Activity */}
				{realTimeMetrics && (
					<section className="analytics-section">
						<h2>🔄 Recent Activity</h2>
						<div className="activity-list">
							{realTimeMetrics.recentActivity.map((activity, index) => (
								<div key={index} className="activity-item">
									<span className="activity-time">
										{new Date(activity.timestamp).toLocaleTimeString()}
									</span>
									<span className="activity-action">{activity.action}</span>
									<span className="activity-page">{activity.page}</span>
								</div>
							))}
						</div>
					</section>
				)}
			</div>
		</div>
	);
}

export default App;
