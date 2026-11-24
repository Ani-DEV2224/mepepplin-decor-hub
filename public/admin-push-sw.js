self.addEventListener("push", event => {
  event.waitUntil(self.registration.showNotification("Meppeplin Decor Hub", {
    body: "You have received a new client enquiry. Tap to view.",
    icon: "/images/brand/mepepplin-logo.png",
    tag: "meppeplin-enquiry-" + Date.now(),
    data: { url: "/admin/enquiries" }
  }));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/admin/enquiries"));
});