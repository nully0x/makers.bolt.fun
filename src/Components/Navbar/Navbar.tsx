import NavMobile from "./NavMobile";
import { MdComment, MdHomeFilled, MdLocalFireDepartment } from "react-icons/md";
import { useCallback, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useMediaQuery,
  useResizeListener,
} from "src/utils/hooks";
import { setNavHeight } from "src/redux/features/ui.slice";
import NavDesktop from "./NavDesktop";
import { MEDIA_QUERIES } from "src/utils/theme/media_queries";
import { IoMdTrophy } from "react-icons/io";
import { useNotifications } from "src/features/Notifications/useNotifications";
import { withProviders } from "src/utils/hoc";
import { RelayPoolProvider } from "src/lib/nostr";
import NotificationsList from "./NotificationsList/NotificationsList";

export const navLinks = [
  { text: "Explore", url: "/", icon: MdHomeFilled, color: "text-primary-600" },
  {
    text: "Blog",
    url: "/blog",
    icon: MdComment,
    color: "text-primary-600",
  },
  {
    text: "Hackathons",
    url: "/hackathons",
    icon: IoMdTrophy,
    color: "text-primary-600",
  },
  {
    text: "Hottest",
    url: "/hottest",
    icon: MdLocalFireDepartment,
    color: "text-primary-600",
  },
  // {
  //   text: "Categories",
  //   url: "/categories",
  //   icon: IoExtensionPuzzle,
  //   color: "text-primary-600",
  // },
];

function Navbar() {
  const dispatch = useAppDispatch();

  const isLargeScreen = useMediaQuery(MEDIA_QUERIES.isMinLarge);

  const user_nostr_key = useAppSelector(
    (state) => state.user.me?.primary_nostr_key
  );

  const { notifications, isEmpty } = useNotifications({
    pubkey: user_nostr_key,
  });

  const updateNavHeight = useCallback(() => {
    const nav = document.querySelector("nav");
    if (nav) {
      const navStyles = getComputedStyle(nav);
      if (navStyles.display !== "none") {
        dispatch(setNavHeight(nav.clientHeight));
        document.documentElement.style.setProperty(
          "--navHeight",
          nav.clientHeight + "px"
        );
      }
    }
  }, [dispatch]);

  useEffect(() => {
    updateNavHeight();
  }, [updateNavHeight]);

  useResizeListener(updateNavHeight);

  const RenderNotificationsList = () => (
    <NotificationsList
      isLoadingNotifications={notifications.length === 0 && !isEmpty}
      notifications={notifications}
      noKeyConnected={!user_nostr_key}
    />
  );

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-[2010]">
        {isLargeScreen ? (
          <NavDesktop renderNotificationsList={RenderNotificationsList} />
        ) : (
          <NavMobile renderNotificationsList={RenderNotificationsList} />
        )}
      </header>
    </>
  );
}

export default withProviders(RelayPoolProvider)(Navbar);
