import { getNotifications, updateSeenNotifications } from "./_queries_notification";

export const get_notifications = async (req, res, next) => {

  const userId = req.params.userId;
  const page = req.params.page;

  // get and update notifications documents
  const notifications = await getNotifications(userId, page);
  await updateSeenNotifications(userId);

  return res.json({notifications: notifications});

};
