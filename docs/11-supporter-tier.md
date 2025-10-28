@docs

# 11 – Supporter Tier & LemonSqueezy Integration

1. Integrate LemonSqueezy checkout flow using their hosted payment link. Expose a `features/supporter/SubscribeButton.vue` component that opens the checkout in a new tab/modal and listens for postMessage events or webhook confirmations.
2. Implement backend-less verification by consuming LemonSqueezy webhooks via Dexie Cloud functions (if available) or polling the LemonSqueezy API with a serverless proxy stub. Store subscription state in the `SupporterStatus` table keyed by user ID.
3. On successful subscription, update the user’s Dexie role metadata to flag them as `supporter` and stamp a `priorityUntil` date. Ensure supporter submissions bubble to the top of moderation queries.
4. Handle cancellations or failed payments by downgrading the `supporter` flag when LemonSqueezy reports the status change; keep logic minimal per spec but reliable.
5. Update the dashboard and community submission UIs to read the supporter flag and adjust copy (e.g., “Your submissions jump the queue”). Avoid extra perks for now.
6. Provide a simple account settings panel where users can view their subscription status and follow a “Manage billing” link back to LemonSqueezy.
