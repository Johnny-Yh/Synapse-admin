import React from "react";
import { Admin, Resource, resolveBrowserLocale } from "react-admin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import authProvider from "./synapse/authProvider";
import dataProvider from "./synapse/dataProvider";
import { UserList, UserCreate, UserEdit } from "./components/users";
import { RoomList, RoomShow } from "./components/rooms";
import LoginPage from "./components/LoginPage";
import UserIcon from "@material-ui/icons/Group";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import { UserMediaStatsList } from "./components/statistics";
import RoomIcon from "@material-ui/icons/ViewList";
import { ImportFeature } from "./components/ImportFeature";
import { Route } from "react-router-dom";
import englishMessages from "./i18n/en";
import chineseMessages from "./i18n/zh";

const messages = {
  en: englishMessages,
  zh: chineseMessages,
};
const i18nProvider = polyglotI18nProvider(
  locale => (messages[locale] ? messages[locale] : messages.en),
  resolveBrowserLocale()
);

const App = () => (
  <Admin
    disableTelemetry
    loginPage={LoginPage}
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    customRoutes={[
      <Route key="userImport" path="/import_users" component={ImportFeature} />,
    ]}
  >
    <Resource
      name="users"
      list={UserList}
      create={UserCreate}
      edit={UserEdit}
      icon={UserIcon}
    />
    <Resource name="rooms" list={RoomList} show={RoomShow} icon={RoomIcon} />
    <Resource
      name="user_media_statistics"
      list={UserMediaStatsList}
      icon={EqualizerIcon}
    />
    <Resource name="connections" />
    <Resource name="devices" />
    <Resource name="room_members" />
    <Resource name="users_media" />
    <Resource name="joined_rooms" />
    <Resource name="pushers" />
    <Resource name="servernotices" />
  </Admin>
);

export default App;
