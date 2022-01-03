import { updateNotificationsPrefs } from "./_queries_notification";
import { verifyAccessToken } from "../../helpers/token_helper";

export const edit_notifications_prefs = async (req, res, next) => {

    const accessToken = req.headers['x-access-token'];
    const value = req.params.name;

    try {

      const dec = await verifyAccessToken(accessToken);
      const userId = dec.userId;

      // Update user document
      await updateNotificationsPrefs(userId, value);

      return res.json({message: 'Success'});

    }
    catch(error) {
      return next(error);
    }


};
