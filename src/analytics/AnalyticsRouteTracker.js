import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { trackRouteChange } from './analyticsClient';

export default function AnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackRouteChange(location.pathname);
  }, [location.pathname]);

  return null;
}
