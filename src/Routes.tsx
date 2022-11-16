import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '~/components/routes/protected-route';

const LoadAuthStateRoute = lazy(
  () => import('~/components/routes/load-auth-state-route'),
);
const Index = lazy(() => import('~/pages'));
const ConfirmEmail = lazy(() => import('~/pages/confirm-email'));
const EmailLogin = lazy(() => import('~/pages/email-login'));
const FriendsIndex = lazy(() => import('~/pages/friends'));
const Login = lazy(() => import('~/pages/login'));
const LoginCallback = lazy(() => import('~/pages/login-callback'));
const MapView = lazy(() => import('~/pages/map'));
const MessagesIndex = lazy(() => import('~/pages/messages'));
const ProfileView = lazy(() => import('~/pages/profiles/[id]'));
const Register = lazy(() => import('~/pages/register'));
const Search = lazy(() => import('~/pages/search'));
const NewSession = lazy(() => import('~/pages/sessions/new'));
const ActiveSession = lazy(() => import('~/pages/sessions/[id]'));
const Settings = lazy(() => import('~/pages/settings'));
const DarkMode = lazy(() => import('~/pages/settings/darkmode'));
const EditProfile = lazy(() => import('~/pages/settings/edit-profile'));
const Welcome = lazy(() => import('~/pages/welcome'));
const NotFound = lazy(() => import('~/pages/[...all]'));

const MainRoutes = () => (
  <Routes>
    {/** Protected Routes */}
    <Route path="/" element={<ProtectedRoute />}>
      <Route path="/" element={<LoadAuthStateRoute />}>
        <Route path="/" element={<Index />} />
        <Route path="/messages" element={<MessagesIndex />} />
        <Route path="/profiles/:id" element={<ProfileView />} />
        <Route path="/sessions/:id" element={<ActiveSession />} />
        <Route path="/sessions/new" element={<NewSession />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/darkmode" element={<DarkMode />} />
        <Route path="/settings/edit-profile" element={<EditProfile />} />
        <Route path="/friends" element={<FriendsIndex />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/search" element={<Search />} />
      </Route>
    </Route>

    {/** Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/email-login" element={<EmailLogin />} />
    <Route path="/login-callback" element={<LoginCallback />} />
    <Route path="/confirm-email" element={<ConfirmEmail />} />

    <Route path="404" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/404" replace />} />

    {/* </Route> */}
    {/** Permission denied route */}
    {/* <Route path="/denied" element={<PermissionDenied />} /> */}
  </Routes>
);

export default MainRoutes;
