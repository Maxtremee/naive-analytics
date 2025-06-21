import md5 from "md5";
import { getClient } from "./client/client";
import { CreateEventDtoType } from "./client/openapi";

export const analytics = (apiUrl: string, apiKey: string) => {
	// respect do not track
	if (navigator.doNotTrack === "1" || navigator.doNotTrack === "yes") {
		return;
	}

	const client = getClient(apiUrl);

	const enteredAt = Date.now();
	const path = [window.location.pathname];
	const sessionId = md5(navigator.userAgent + enteredAt.toString());

	// create session
	client.POST("/session", {
		body: {
			apiKey,
			id: sessionId,
			duration: Date.now() - enteredAt,
			enteredAt,
			path,
			userAgent: navigator.userAgent,
			referrer: document.referrer,
		},
	});

	// updates
	setInterval(() => {
		client.POST("/session", {
			body: {
				apiKey,
				id: sessionId,
				duration: Date.now() - enteredAt,
			},
		});
	}, 5000);

	// event listeners
	window.addEventListener("popstate", () => {
		path.push(window.location.pathname);
		client.POST("/session", {
			body: {
				apiKey,
				id: sessionId,
				duration: Date.now() - enteredAt,
				path,
			},
		});
	});

	window.addEventListener("pushstate", () => {
		path.push(window.location.pathname);
		client.POST("/session", {
			body: {
				apiKey,
				id: sessionId,
				duration: Date.now() - enteredAt,
				path,
			},
		});
	});

	// click event
	window.addEventListener("click", (event: MouseEvent) => {
		client.POST("/event", {
			body: {
				apiKey,
				sessionId,
				type: CreateEventDtoType.CLICK,
				data: {
					element: (event.target as HTMLElement).tagName,
				},
			},
		});
	});

	// link click event
	window.addEventListener("click", (event: MouseEvent) => {
		const target = event.target as HTMLAnchorElement;
		if (!target.href) {
			return;
		}
		client.POST("/event", {
			body: {
				apiKey,
				sessionId,
				type: CreateEventDtoType.CLICK_LINK,
				data: {
					href: (event.target as HTMLAnchorElement)?.href,
				},
			},
		});
	});

	// scroll event
	window.addEventListener("scroll", () => {
		client.POST("/event", {
			body: {
				apiKey,
				sessionId,
				type: CreateEventDtoType.SCROLL,
				data: {
					scrollTop: window.scrollY,
					scrollLeft: window.scrollX,
				},
			},
		});
	});

	// view event
	window.addEventListener("load", () => {
		client.POST("/event", {
			body: {
				apiKey,
				sessionId,
				type: CreateEventDtoType.VIEW,
				data: {
					href: window.location.href,
				},
			},
		});
	});

	// on exit
	window.addEventListener("beforeunload", () => {
		client.POST("/session", {
			body: {
				apiKey,
				id: sessionId,
				duration: Date.now() - enteredAt,
				exitedAt: Date.now(),
				path,
			},
		});
	});
};
