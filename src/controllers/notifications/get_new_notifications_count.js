import { getNewNotificationsCount } from "./_queries_notification";

export const new_notifications_count = async (req, res, next) => {

  const userId = req.params.userId;

  const count = await getNewNotificationsCount(userId);

  return res.json({newNotificationsCount: count});

};
